import asyncio
import json
import time
import requests
import argparse
from playwright.async_api import async_playwright

WORKER_URL = "https://tonal-proxy.kwakhare5.workers.dev"

# Generate 100 scenarios covering different real-world use cases
SCENARIOS = [
    # Work & Office (30)
    {"text": "I can't make it to the meeting today, I'm feeling sick.", "cat": "Work"},
    {"text": "Can you review my pull request? It's been pending for 2 days.", "cat": "Work"},
    {"text": "I want a raise, I've been doing the work of 3 people.", "cat": "Work"},
    {"text": "The client is very angry about the delay. What do we do?", "cat": "Work"},
    {"text": "I'm resigning next week. Thanks for everything.", "cat": "Work"},
    {"text": "Let's push the deadline to Friday.", "cat": "Work"},
    {"text": "Who broke the build? The staging server is down.", "cat": "Work"},
    {"text": "Great job on the presentation, everyone loved it.", "cat": "Work"},
    {"text": "Can we sync up tomorrow at 10 AM?", "cat": "Work"},
    {"text": "I need the credentials for the production database.", "cat": "Work"},
    {"text": "Please sign the NDA before we proceed.", "cat": "Work"},
    {"text": "I will be OOO from Monday to Wednesday.", "cat": "Work"},
    {"text": "Where is the report I asked for?", "cat": "Work"},
    {"text": "Let's brainstorm some ideas for the Q3 roadmap.", "cat": "Work"},
    {"text": "I'm stuck on this bug, can anyone help?", "cat": "Work"},
    {"text": "Don't forget to submit your timesheets by EOD.", "cat": "Work"},
    {"text": "Welcome to the team, Sarah!", "cat": "Work"},
    {"text": "We need to cut costs by 20% next quarter.", "cat": "Work"},
    {"text": "The new feature is ready for QA testing.", "cat": "Work"},
    {"text": "Can someone cover my shift on Saturday?", "cat": "Work"},
    {"text": "I disagree with this approach, it's not scalable.", "cat": "Work"},
    {"text": "Please find the attached invoice for last month.", "cat": "Work"},
    {"text": "Let's schedule a 1-on-1 to discuss your performance.", "cat": "Work"},
    {"text": "We lost the contract with the big client.", "cat": "Work"},
    {"text": "I need approval for the software license renewal.", "cat": "Work"},
    {"text": "The marketing campaign generated a lot of leads.", "cat": "Work"},
    {"text": "Can you send me the Zoom link?", "cat": "Work"},
    {"text": "I'm running 5 minutes late.", "cat": "Work"},
    {"text": "Thanks for catching that mistake.", "cat": "Work"},
    {"text": "What's the status of the Jira ticket?", "cat": "Work"},

    # Social & Personal (30)
    {"text": "Happy birthday! Hope you have a great day.", "cat": "Personal"},
    {"text": "Can I borrow $50 until next week?", "cat": "Personal"},
    {"text": "I'm so sorry for your loss.", "cat": "Personal"},
    {"text": "Let's grab a beer tonight.", "cat": "Personal"},
    {"text": "Are we still on for dinner?", "cat": "Personal"},
    {"text": "I can't believe he said that to you.", "cat": "Personal"},
    {"text": "You looked beautiful in that dress.", "cat": "Personal"},
    {"text": "Call me when you get home so I know you're safe.", "cat": "Personal"},
    {"text": "I'm so proud of you for passing the exam.", "cat": "Personal"},
    {"text": "Can you pick up some milk on your way back?", "cat": "Personal"},
    {"text": "I don't think we should see each other anymore.", "cat": "Personal"},
    {"text": "Thanks for helping me move the sofa.", "cat": "Personal"},
    {"text": "Did you watch the game last night?", "cat": "Personal"},
    {"text": "I miss you so much.", "cat": "Personal"},
    {"text": "What do you want for Christmas?", "cat": "Personal"},
    {"text": "I'm so tired I could sleep for a week.", "cat": "Personal"},
    {"text": "Congratulations on the new house!", "cat": "Personal"},
    {"text": "I'm sorry I forgot to call you back.", "cat": "Personal"},
    {"text": "Let's go to the beach this weekend.", "cat": "Personal"},
    {"text": "I hate it when people chew with their mouth open.", "cat": "Personal"},
    {"text": "You owe me an apology.", "cat": "Personal"},
    {"text": "I'm craving pizza right now.", "cat": "Personal"},
    {"text": "Did you hear the news about Tom?", "cat": "Personal"},
    {"text": "I need to vent for a minute.", "cat": "Personal"},
    {"text": "Let's split the bill.", "cat": "Personal"},
    {"text": "I'm stuck in traffic, be there soon.", "cat": "Personal"},
    {"text": "Thanks for the lovely gift.", "cat": "Personal"},
    {"text": "I don't feel like going out tonight.", "cat": "Personal"},
    {"text": "Can you recommend a good book?", "cat": "Personal"},
    {"text": "Have a safe flight!", "cat": "Personal"},

    # Networking & Sales (20)
    {"text": "I saw your profile and would love to connect.", "cat": "Networking"},
    {"text": "Are you open to new opportunities in tech?", "cat": "Networking"},
    {"text": "I'd like to pitch you our new SEO software.", "cat": "Networking"},
    {"text": "Thanks for accepting my connection request.", "cat": "Networking"},
    {"text": "Can you introduce me to the hiring manager?", "cat": "Networking"},
    {"text": "Loved your latest article on AI trends.", "cat": "Networking"},
    {"text": "We help companies scale their revenue by 3x.", "cat": "Networking"},
    {"text": "Do you have 10 minutes for a quick call next week?", "cat": "Networking"},
    {"text": "I'm an expert in React and looking for a role.", "cat": "Networking"},
    {"text": "Following up on my previous message.", "cat": "Networking"},
    {"text": "I admire the work you're doing at Google.", "cat": "Networking"},
    {"text": "Are you the right person to speak to about partnerships?", "cat": "Networking"},
    {"text": "I'm offering a free audit of your website.", "cat": "Networking"},
    {"text": "Let's collaborate on a project together.", "cat": "Networking"},
    {"text": "Can I feature you on my podcast?", "cat": "Networking"},
    {"text": "Thanks for the great conversation at the event.", "cat": "Networking"},
    {"text": "Here is my resume for your consideration.", "cat": "Networking"},
    {"text": "We are hosting a webinar and would love you to attend.", "cat": "Networking"},
    {"text": "Please let me know if you are interested.", "cat": "Networking"},
    {"text": "I have extensive experience in building scalable apps.", "cat": "Networking"},

    # Difficult/Conflict (10)
    {"text": "You took credit for my idea in the meeting.", "cat": "Conflict"},
    {"text": "Stop micromanaging me.", "cat": "Conflict"},
    {"text": "This code is garbage, rewrite it.", "cat": "Conflict"},
    {"text": "You are always late and it's disrespectful.", "cat": "Conflict"},
    {"text": "I refuse to work under these conditions.", "cat": "Conflict"},
    {"text": "You lied to me about the budget.", "cat": "Conflict"},
    {"text": "That joke was inappropriate and offensive.", "cat": "Conflict"},
    {"text": "I'm reporting this to HR.", "cat": "Conflict"},
    {"text": "You owe me money, pay up.", "cat": "Conflict"},
    {"text": "Stop contacting me.", "cat": "Conflict"},

    # Customer Service (10)
    {"text": "Your product arrived broken, give me a refund.", "cat": "CS"},
    {"text": "I can't log into my account, please help.", "cat": "CS"},
    {"text": "Where is my order? It's been 2 weeks.", "cat": "CS"},
    {"text": "Cancel my subscription immediately.", "cat": "CS"},
    {"text": "The food was cold and tasted awful.", "cat": "CS"},
    {"text": "I was overcharged on my credit card.", "cat": "CS"},
    {"text": "Your delivery driver left the package in the rain.", "cat": "CS"},
    {"text": "I want to speak to a manager.", "cat": "CS"},
    {"text": "Thank you for fixing the issue so quickly.", "cat": "CS"},
    {"text": "I'm very disappointed with your service.", "cat": "CS"}
]

TONES = ["casual", "workChat", "formal"]

INSERT_TEXT_FN = """
function insertText(input, text, isRichText = false) {
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

    const command = isRichText ? 'insertHTML' : 'insertText';
    document.execCommand(command, false, text);
    
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    input.blur();
    input.focus();
    return "native_handled";
}
"""

async def fetch_ai_tone(text, tone):
    payload = {
        "text": text,
        "toneLevel": tone,
        "mode": "convert",
        "provider": "groq"
    }
    try:
        loop = asyncio.get_event_loop()
        res = await loop.run_in_executor(None, lambda: requests.post(WORKER_URL, json=payload, timeout=20))
        data = res.json()
        if data.get("success"):
            return data["text"]
        return f"ERR: {data.get('error')}"
    except Exception as e:
        return f"ERR: {str(e)}"

async def run_platform_test(platform_name, url, selector):
    print(f"\n🚀 Starting Deep 100+ Test for {platform_name}")
    print(f"URL: {url}")
    print(f"Total Scenarios: {len(SCENARIOS)}")
    
    results = {"passed": 0, "failed": 0, "errors": 0}
    failed_details = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        try:
            await page.goto(url, timeout=20000, wait_until="domcontentloaded")
            await page.wait_for_selector(selector, timeout=10000)
            await page.add_script_tag(content=INSERT_TEXT_FN)
            
            for idx, scenario in enumerate(SCENARIOS):
                original_text = scenario["text"]
                print(f"\n--- Test {idx+1}/100: {scenario['cat']} ---")
                print(f"Original: {original_text}")
                
                for tone in TONES:
                    print(f"  Tone: {tone.upper()}...", end=" ", flush=True)
                    
                    # 1. Get AI Text
                    ai_text = await fetch_ai_tone(original_text, tone)
                    if ai_text.startswith("ERR:"):
                        print(f"❌ AI Error")
                        results["errors"] += 1
                        continue
                        
                    # 2. Inject
                    try:
                        # Clear the editor by typing a placeholder then selecting it
                        await page.click(selector)
                        await page.keyboard.press("Control+A")
                        await page.keyboard.press("Backspace")
                        await page.keyboard.type("placeholder...", delay=10)
                        await page.keyboard.press("Control+A")
                        
                        handler = await page.evaluate(f'''() => {{
                            const el = document.querySelector("{selector}");
                            return insertText(el, `{ai_text.replace('`', '\\`')}`, false);
                        }}''')
                        
                        await page.wait_for_timeout(300)
                        
                        result_text = await page.evaluate(f'''() => {{
                            const el = document.querySelector("{selector}");
                            return el.innerText || el.value || el.textContent;
                        }}''')
                        
                        result_text = result_text.strip().replace('\\n', ' ')
                        expected = ai_text.strip().replace('\\n', ' ')
                        
                        if expected == result_text:
                            print(f"✅ PASS")
                            results["passed"] += 1
                        elif expected in result_text and len(result_text) > len(expected):
                            print(f"❌ FAIL (Duplication)")
                            results["failed"] += 1
                            failed_details.append(f"Test {idx+1} {tone} Duplication: '{result_text}'")
                        else:
                            print(f"❌ FAIL (Mismatch/Ghost)")
                            results["failed"] += 1
                            failed_details.append(f"Test {idx+1} {tone} Mismatch: Expected '{expected}', Got '{result_text}'")
                            
                    except Exception as e:
                        print(f"⚠️ Inject Error: {str(e)}")
                        results["errors"] += 1
                        
        except Exception as e:
            print(f"Critical Setup Error: {str(e)}")
        finally:
            await browser.close()
            
    print(f"\n📊 Final Results for {platform_name}")
    print(f"Passed: {results['passed']}")
    print(f"Failed: {results['failed']}")
    print(f"Errors: {results['errors']}")
    
    if failed_details:
        print("\nFail Details:")
        for fd in failed_details[:10]:
            print(fd)
        if len(failed_details) > 10:
            print(f"... and {len(failed_details)-10} more.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--platform", type=str, required=True, choices=["whatsapp", "linkedin", "gmail", "slack"])
    args = parser.parse_args()
    
    config = {
        "whatsapp": {
            "name": "WhatsApp Web (Lexical Framework)",
            "url": "https://playground.lexical.dev/",
            "selector": "[data-lexical-editor='true']"
        },
        "linkedin": {
            "name": "LinkedIn (Draft.js / React)",
            "url": "https://draftjs.org/",
            "selector": ".public-DraftEditor-content"
        },
        "gmail": {
            "name": "Gmail (Basic ContentEditable)",
            "url": "data:text/html,<div contenteditable='true' id='editor' style='width:300px;height:300px;'></div>",
            "selector": "#editor"
        },
        "slack": {
            "name": "Slack (Quill Framework / React)",
            "url": "https://quilljs.com/playground/",
            "selector": ".ql-editor"
        }
    }
    
    plat = config[args.platform]
    asyncio.run(run_platform_test(plat["name"], plat["url"], plat["selector"]))
