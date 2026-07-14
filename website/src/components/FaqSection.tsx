'use client';

import React, { useState, useRef } from 'react';

interface FaqItemProps {
  question: string;
  answer: React.ReactNode;
}

const FAQ_ITEMS: FaqItemProps[] = [
  {
    question: 'Is Tonal really free?',
    answer: (
      <p>
        Yes. Tonal is completely free and open-source. There are no monthly subscriptions, hidden fees, or premium limits. The code is entirely open for inspection, and you can download and run it directly.
      </p>
    )
  },
  {
    question: 'Do I need my own Groq API key?',
    answer: (
      <p>
        No. Tonal works out of the box using our pre-configured backend proxy, so you can start adjusting your tone immediately. If you want to use your own Groq API key (to get higher limits or customize prompts), you can easily add it in the extension settings.
      </p>
    )
  },
  {
    question: 'Is my text data private and secure?',
    answer: (
      <p>
        Absolutely. Tonal does not store, log, or track your text. It simply forwards your inputs securely to the AI model and replaces them. For security, all Tonal interface elements are encapsulated within a isolated <strong>Shadow Root</strong>, meaning the host website cannot inspect, read, or alter Tonal&apos;s internal UI or your API key settings.
      </p>
    )
  },
  {
    question: 'Which websites are supported?',
    answer: (
      <p>
        Tonal has dedicated adapters for <strong>Gmail</strong>, <strong>Slack (Web)</strong>, and <strong>LinkedIn</strong> to perfectly align with their custom input fields. For other sites, Tonal&apos;s smart <strong>Default Adapter</strong> automatically detects any standard text input or textarea, allowing it to work on virtually any site (such as Twitter/X, GitHub, Notion, etc.).
      </p>
    )
  },
  {
    question: 'How does the Undo feature work?',
    answer: (
      <p>
        Tonal saves a local, temporary copy of your draft in memory immediately before it requests a tone rewrite. If you aren&apos;t happy with the result, or if you clicked the wrong option, a floating <strong>Undo</strong> pill will appear next to your text box. One click restores your draft exactly as it was.
      </p>
    )
  },
  {
    question: 'How fast are the tone adjustments?',
    answer: (
      <p>
        Under the hood, Tonal communicates with the Groq API running <strong>Llama 3.3 70B</strong>. Because Groq&apos;s LPUs process tokens at incredible speeds, tone adjustments are practically instantaneous—usually completing in under 0.5 seconds.
      </p>
    )
  }
];

function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState('0px');
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleOpen();
    }
  };

  const elementId = `faq-answer-${question.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()}`;

  return (
    <div className={`faq-item ${isOpen ? 'active' : ''}`}>
      <div 
        className="faq-question" 
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        aria-controls={elementId}
      >
        <span>{question}</span>
        <span className="faq-icon" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
      </div>
      <div
        id={elementId}
        className="faq-answer"
        ref={contentRef}
        style={{
          maxHeight: height,
          opacity: isOpen ? 1 : 0,
          transition: 'max-height 0.25s var(--ease-out), opacity 0.2s ease'
        }}
      >
        {answer}
      </div>
    </div>
  );
}

export default function FaqSection() {
  return (
    <section className="faq-section section-padding" id="faq">
      <div className="container">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, idx) => (
            <FaqItem key={idx} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
