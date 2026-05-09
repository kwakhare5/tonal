import asyncio
from playwright.async_api import async_playwright

INSERT_TEXT_FN = """
function insertText(input, text, isRichText = false) {
    // We do NOT call input.focus() or execCommand('selectAll') because we rely on the user's existing selection.

    // 1. Synthetic Paste Event
    const dataTransfer = new DataTransfer();
    dataTransfer.setData('text/plain', text);
    if (isRichText) dataTransfer.setData('text/html', text);
    
    const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: dataTransfer,
        bubbles: true,
        cancelable: true
    });
    input.dispatchEvent(pasteEvent);

    if (pasteEvent.defaultPrevented) {
        input.blur(); input.focus();
        return "paste_handled";
    }

    // 2. Synthetic beforeinput Event
    const beforeInputEvent = new InputEvent('beforeinput', {
        inputType: isRichText ? 'insertFromPaste' : 'insertText',
        data: text,
        bubbles: true,
        cancelable: true
    });
    input.dispatchEvent(beforeInputEvent);

    if (beforeInputEvent.defaultPrevented) {
        input.blur(); input.focus();
        return "beforeinput_handled";
    }

    // 3. Native DOM Mutation
    const command = isRichText ? 'insertHTML' : 'insertText';
    document.execCommand(command, false, text);
    
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    input.blur();
    input.focus();
    return "native_handled";
}
"""

async def test_editor(name, url, selector, expected_text):
    print(f"\\n🧪 Testing {name}")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        try:
            await page.goto(url, timeout=15000, wait_until="domcontentloaded")
            await page.wait_for_selector(selector, timeout=10000)
            
            # Click and type text
            await page.click(selector)
            
            # Draft.js / Lexical requires actual typing to register internal state
            await page.keyboard.type("I am Karan and today marks my first day.", delay=10)
            await page.wait_for_timeout(1000)
            

            await page.add_script_tag(content=INSERT_TEXT_FN)
            
            print(f"   Executing injection...")
            handler_used = await page.evaluate(f'''() => {{
                const el = document.querySelector("{selector}");
                return insertText(el, "{expected_text}", false);
            }}''')
            
            await page.wait_for_timeout(1000)
            
            result_text = await page.evaluate(f'''() => {{
                const el = document.querySelector("{selector}");
                return el.innerText || el.value || el.textContent;
            }}''')
            
            result_text = result_text.strip().replace('\\n', ' ')
            
            if result_text == expected_text:
                print(f"   ✅ PASS: Exact Match. Handled by: {handler_used}")
            elif expected_text in result_text and len(result_text) > len(expected_text):
                print(f"   ❌ FAIL: Duplication detected! Result: '{result_text}'. Handled by: {handler_used}")
            else:
                print(f"   ❌ FAIL: Ghost Text or mismatch. Result: '{result_text}'. Handled by: {handler_used}")
                
        except Exception as e:
            print(f"   ⚠️ ERROR: {str(e)}")
        finally:
            await browser.close()

async def main():
    print("🚀 Starting Tonal Injection Framework Tests")
    
    # 1. Lexical (WhatsApp Web)
    await test_editor(
        name="WhatsApp Web (Lexical Framework)",
        url="https://playground.lexical.dev/",
        selector="[data-lexical-editor='true']",
        expected_text="I am starting my new role today."
    )
    
    # 2. Draft.js (LinkedIn)
    await test_editor(
        name="LinkedIn (Draft.js / React)",
        url="https://draftjs.org/",
        selector=".public-DraftEditor-content",
        expected_text="I am starting my new role today."
    )
    
    # 3. Simple ContentEditable (Gmail)
    await test_editor(
        name="Gmail (Basic ContentEditable)",
        url="data:text/html,<div contenteditable='true' id='editor' style='width:300px;height:300px;'></div>",
        selector="#editor",
        expected_text="I am starting my new role today."
    )

if __name__ == "__main__":
    asyncio.run(main())
