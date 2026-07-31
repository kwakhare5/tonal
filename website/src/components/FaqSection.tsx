'use client';

import React, { useState, useRef } from 'react';

interface FaqItemProps {
  question: string;
  answer: React.ReactNode;
}

const FAQ_ITEMS: FaqItemProps[] = [
  {
    question: 'Is tonal really free?',
    answer: (
      <p>
        Yes. tonal is completely free and open-source. There are no monthly subscriptions, hidden fees, or premium limits. The code is open for inspection, and you can download and run it locally.
      </p>
    )
  },
  {
    question: 'Do I need my own Groq API key?',
    answer: (
      <p>
        No. tonal works out of the box using our pre-configured backend proxy, so you can start adjusting your tone immediately. If you want to use your own Groq API key (for higher limits or custom prompts), you can add it in the extension settings.
      </p>
    )
  },
  {
    question: 'Is my text data private and secure?',
    answer: (
      <p>
        Absolutely. tonal does not store, log, or track your text. It forwards your inputs securely to the AI model and returns the rewritten draft. All tonal UI components are encapsulated within an isolated <strong>Shadow Root</strong>, keeping them completely safe from host page scripts.
      </p>
    )
  },
  {
    question: 'Which websites are supported?',
    answer: (
      <p>
        tonal has dedicated adapters for <strong>Gmail</strong>, <strong>Slack (Web)</strong>, and <strong>LinkedIn</strong> to seamlessly match their unique message inputs. For all other sites, tonal&apos;s <strong>Default Adapter</strong> automatically detects any standard text input or textarea (such as Twitter/X, GitHub, Notion, etc.).
      </p>
    )
  },
  {
    question: 'How does the Undo feature work?',
    answer: (
      <p>
        tonal saves every rewrite to a persistent local history (up to 10 entries) that survives page navigation and tab closes. If you aren&apos;t happy with a result, tap the floating <strong>Undo</strong> pill to restore your original draft instantly.
      </p>
    )
  },
  {
    question: 'How fast are tone adjustments?',
    answer: (
      <p>
        Under the hood, tonal communicates with the Groq LPU API running <strong>Llama 3.3 70B</strong>. Because Groq&apos;s hardware processes tokens at extreme speeds, tone adjustments complete in under 0.5 seconds.
      </p>
    )
  },
  {
    question: 'Can I use tonal without a mouse?',
    answer: (
      <p>
        Yes. Press <strong>Ctrl+Shift+T</strong> (or <strong>Cmd+Shift+T</strong> on Mac) to activate tonal on your focused input field without touching your mouse. The tone picker opens immediately.
      </p>
    )
  },
  {
    question: 'Does tonal remember my tone preference per site?',
    answer: (
      <p>
        Yes. When you select a tone on a given site, tonal silently saves that preference for that hostname. The next time you visit Gmail, Slack, or LinkedIn, your pill initialises with the tone you last used there.
      </p>
    )
  }
];

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [height, setHeight] = useState<string>('0px');
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight('0px');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleOpen();
    }
  };

  const elementId = `faq-answer-${question.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()}`;

  return (
    <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
      <button 
        className="faq-question" 
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        type="button"
        aria-expanded={isOpen}
        aria-controls={elementId}
      >
        <span>{question}</span>
        <span className="faq-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </button>
      <div
        id={elementId}
        className="faq-answer"
        ref={contentRef}
        style={{
          maxHeight: height,
          opacity: isOpen ? 1 : 0,
        }}
      >
        {answer}
      </div>
    </div>
  );
};

export const FaqSection: React.FC = () => {
  return (
    <section className="faq-section section-padding reveal-on-scroll" id="faq">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-purple">Got Questions?</span>
          <h2 className="section-title">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, idx) => (
            <FaqItem key={idx} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
