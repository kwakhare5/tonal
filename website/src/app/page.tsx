"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  RotateCcw, 
  Copy, 
  Check, 
  ChevronDown, 
  Lock, 
  Shield, 
  Cpu, 
  Eye,
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Trash2,
  Bold,
  Italic,
  List,
  Code,
  Link,
  MoreHorizontal,
  Globe,
  Settings,
  Users
} from "lucide-react";

type Platform = "gmail" | "slack" | "linkedin" | "decode";
type Tone = "casual" | "work" | "formal";

interface ToneExample {
  id: string;
  label: string;
  default: string;
  casual: string;
  work: string;
  formal: string;
}

const gmailExamples: ToneExample[] = [
  { id: "resched", label: "Reschedule Meeting", default: "hey can we reschedule that call tomorrow morning? something came up", casual: "hey can we reschedule tomorrow's call? something came up on my end!", work: "Hey team, could we reschedule tomorrow morning's meeting? An unexpected conflict came up on my calendar. Let me know if another time works for you.", formal: "Dear team, I am writing to request that we reschedule our conference call planned for tomorrow morning. Unfortunately, an urgent conflict has arisen on my end. I apologize for the inconvenience and look forward to coordinating a new time." },
  { id: "request_doc", label: "Request Document", default: "can u send me the doc u talked about yesterday", casual: "hey can you send over that doc from yesterday?", work: "Can you send me the document you mentioned yesterday?", formal: "Could you please share the document we discussed yesterday?" },
  { id: "thanks_help", label: "Thanks for Help", default: "thanks for the help really appreciate it", casual: "thanks for the help! really appreciate it", work: "Thanks for the help! I really appreciate it.", formal: "Thank you for your assistance. It is greatly appreciated." },
  { id: "update_eod", label: "Update by EOD", default: "ill get back to u by end of day today", casual: "i'll get back to you by EOD today", work: "I'll get back to you by the end of the day today.", formal: "I will provide you with an update by the end of the business day." },
  { id: "invoice_status", label: "Invoice Status", default: "revolving back on the invoice thing", casual: "checking in on the invoice", work: "Circling back on the invoice.", formal: "I am following up regarding the status of the invoice." }
];

const slackExamples: ToneExample[] = [
  { id: "review_pr", label: "Review PR", default: "hey can someone take a look at this pr real quick", casual: "hey can someone review this pr real quick?", work: "Hey, can someone take a look at this PR quickly?", formal: "Could someone please review this pull request at the earliest convenience?" },
  { id: "prod_deploy", label: "Production Deploy", default: "deployed to prod 10 mins ago all good", casual: "deployed to prod 10m ago, all good", work: "Deployed to production 10 minutes ago. Everything is looking good.", formal: "The production deployment was completed 10 minutes ago, and all systems are stable." },
  { id: "missed_meeting", label: "Missed Meeting", default: "sry was in a meeting what did i miss", casual: "sorry missed it, in a meeting. what'd I miss?", work: "Sorry, I was in a meeting. What did I miss?", formal: "My apologies, I was in a meeting. Could you please provide a brief update on what was discussed?" },
  { id: "pick_kids", label: "Pick Up Kids", default: "gtg pick up kids back in 20", casual: "gtg grab the kids, back in 20", work: "I have to go pick up the kids. I'll be back in 20 minutes.", formal: "I need to step away to pick up my children. I will be back online in approximately 20 minutes." },
  { id: "hop_huddle", label: "Hop on Huddle", default: "wanna hop on huddle for 5 mins", casual: "down for a 5m huddle?", work: "Do you want to hop on a huddle for 5 minutes?", formal: "Would you like to join a brief 5-minute call to discuss this?" }
];

const linkedinExamples: ToneExample[] = [
  { id: "feedback_post", label: "AI Post Feedback", default: "hey karan loved ur post on ai", casual: "loved your post on ai, karan!", work: "Hey Karan, I loved your post on AI!", formal: "Hello Karan, I recently read your post regarding AI and found it very insightful." },
  { id: "connect_collab", label: "Connect Collaboration", default: "wanna connect and talk about collab", casual: "let's connect and chat about collab", work: "Do you want to connect and talk about a potential collaboration?", formal: "I would welcome the opportunity to connect and discuss potential collaboration opportunities." },
  { id: "hiring_dev", label: "Hiring Dev Roles", default: "are u hiring for dev roles rn", casual: "hiring dev roles right now?", work: "Are you hiring for developer roles right now?", formal: "I am writing to inquire if there are currently any open developer positions at your company." },
  { id: "thank_invite", label: "Thank Invite", default: "thx for the invite looking forward to it", casual: "thanks for the invite, looking forward!", work: "Thanks for the invite! Looking forward to it.", formal: "Thank you for the invitation. I am looking forward to our upcoming meeting." },
  { id: "mutual_conn", label: "Mutual Connection", default: "found ur profile through a mutual friend", casual: "found your profile through a mutual friend!", work: "I found your profile through a mutual friend.", formal: "I discovered your profile through a mutual connection and was impressed by your background." }
];

interface DecoderExample {
  id: number;
  label: string;
  sender: string;
  subject: string;
  text: string;
  blunt: string;
}

const decoderExamples: DecoderExample[] = [
  { id: 1, label: "Synergy Opt", sender: "Director of Alignment", subject: "Quarterly Bandwidth Optimization", text: "we need to optimize our bandwidth and leverage cross-functional synergies to drive customer alignment.", blunt: "We are understaffed and need to work faster to make the client happy." },
  { id: 2, label: "Offline Sync", sender: "Operations VP", subject: "Synergy and Offline Coordination", text: "Let's circle back and touch base offline.", blunt: "Let's talk about this later when we aren't in this meeting." },
  { id: 3, label: "Capacity Limit", sender: "Project Lead", subject: "Resource Constraints", text: "I'm at capacity right now but I'll keep this on my radar.", blunt: "I'm too busy and I'm going to forget about this." },
  { id: 4, label: "KPI Needles", sender: "Account Manager", subject: "KPI Needle Movement", text: "We need to move the needle on our key performance indicators.", blunt: "We need to improve our numbers." }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Platform>("gmail");
  
  // Active example tracking per platform
  const [gmailExample, setGmailExample] = useState<ToneExample>(gmailExamples[0]);
  const [slackExample, setSlackExample] = useState<ToneExample>(slackExamples[0]);
  const [linkedinExample, setLinkedinExample] = useState<ToneExample>(linkedinExamples[0]);
  const [decoderExample, setDecoderExample] = useState<DecoderExample>(decoderExamples[0]);

  // --- TRANSLATE/PLAYGROUND STATES ---
  const [editorText, setEditorText] = useState(gmailExamples[0].default);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState<{ text: string; color: string } | null>(null);
  const [showUndo, setShowUndo] = useState(false);

  // --- DECODE MODE STATES ---
  const [showDecodePill, setShowDecodePill] = useState(false);
  const [showDecodeCard, setShowDecodeCard] = useState(false);
  const [decodeText, setDecodeText] = useState("Translating...");
  const [copied, setCopied] = useState(false);

  const typingInterval = useRef<NodeJS.Timeout | null>(null);

  const handleTabChange = (platform: Platform) => {
    setActiveTab(platform);
    setIsMenuOpen(false);
    setIsTyping(false);
    setToast(null);
    setShowUndo(false);
    if (typingInterval.current) clearInterval(typingInterval.current);
    
    if (platform === "gmail") {
      setEditorText(gmailExample.default);
    } else if (platform === "slack") {
      setEditorText(slackExample.default);
    } else if (platform === "linkedin") {
      setEditorText(linkedinExample.default);
    } else {
      setShowDecodePill(true);
      setShowDecodeCard(false);
    }
  };

  const loadGmailExample = (ex: ToneExample) => {
    setGmailExample(ex);
    setEditorText(ex.default);
    setToast(null);
    setShowUndo(false);
    setIsMenuOpen(false);
    setIsTyping(false);
    if (typingInterval.current) clearInterval(typingInterval.current);
  };

  const loadSlackExample = (ex: ToneExample) => {
    setSlackExample(ex);
    setEditorText(ex.default);
    setToast(null);
    setShowUndo(false);
    setIsMenuOpen(false);
    setIsTyping(false);
    if (typingInterval.current) clearInterval(typingInterval.current);
  };

  const loadLinkedinExample = (ex: ToneExample) => {
    setLinkedinExample(ex);
    setEditorText(ex.default);
    setToast(null);
    setShowUndo(false);
    setIsMenuOpen(false);
    setIsTyping(false);
    if (typingInterval.current) clearInterval(typingInterval.current);
  };

  const loadDecoderExample = (ex: DecoderExample) => {
    setDecoderExample(ex);
    setShowDecodePill(true);
    setShowDecodeCard(false);
    setDecodeText("Translating...");
  };

  useEffect(() => {
    if (activeTab !== "decode") return;
    const timer = setTimeout(() => {
      setShowDecodePill(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const toggleTonalMenu = (e: React.MouseEvent) => {
    if (isTyping) return;
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleOutsideClick = () => {
      setIsMenuOpen(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const selectTone = (tone: Tone) => {
    setIsMenuOpen(false);
    if (isTyping || activeTab === "decode") return;

    setToast({
      text: "Consulting AI models...",
      color: "bg-[#FF9F0A]"
    });

    const config = activeTab === "gmail" ? gmailExample : activeTab === "slack" ? slackExample : linkedinExample;
    const targetText = config[tone];
    let dotColor = "";
    let toneLabel = "";

    if (tone === "formal") {
      dotColor = "bg-[#34C759]";
      toneLabel = "Formal";
    } else if (tone === "work") {
      dotColor = "bg-[#FF9F0A]";
      toneLabel = "Work Chat";
    } else {
      dotColor = "bg-[#636366]";
      toneLabel = "Casual Text";
    }

    setTimeout(() => {
      setIsTyping(true);
      setEditorText("");
      
      let charIndex = 0;
      if (typingInterval.current) clearInterval(typingInterval.current);

      typingInterval.current = setInterval(() => {
        if (charIndex < targetText.length) {
          setEditorText((prev) => prev + targetText.charAt(charIndex));
          charIndex++;
        } else {
          if (typingInterval.current) clearInterval(typingInterval.current);
          setIsTyping(false);
          setToast({
            text: `Translated to ${toneLabel}`,
            color: dotColor
          });
          setShowUndo(true);
        }
      }, 12);

    }, 1000);
  };

  const triggerUndo = () => {
    if (isTyping || activeTab === "decode") return;
    const config = activeTab === "gmail" ? gmailExample : activeTab === "slack" ? slackExample : linkedinExample;
    setEditorText(config.default);
    setToast(null);
    setShowUndo(false);
  };

  const triggerDecode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDecodePill(false);
    setShowDecodeCard(true);
    setDecodeText("Decoding corporate messaging...");

    setTimeout(() => {
      setDecodeText(`Blunt English: "${decoderExample.blunt}"`);
    }, 1000);
  };

  const copyDecodedText = () => {
    navigator.clipboard.writeText(decoderExample.blunt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#0F0F0F] font-sans antialiased overflow-x-hidden">
      
      {/* ── HEADER / FLOATING NAVBAR ── */}
      <header className="fixed top-4 left-4 right-4 z-50 flex justify-center animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex items-center justify-between w-full max-w-[1100px] bg-white/85 backdrop-blur-md border border-[#E5E5EA]/60 rounded-full px-6 py-2.5 shadow-sm">
          <a href="#" className="flex items-center gap-2.5 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity">
            <span className="flex items-center">
              <Image src="/icon128.png" alt="Tonal Logo" width={24} height={24} className="rounded-md" />
            </span>
            <span>Tonal</span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#demo" className="text-sm font-medium text-[#636366] hover:text-[#0F0F0F] transition-colors">Interactive Playground</a>
            <a href="#features" className="text-sm font-medium text-[#636366] hover:text-[#0F0F0F] transition-colors">Architecture</a>
            <a href="#install" className="text-sm font-medium text-[#636366] hover:text-[#0F0F0F] transition-colors">Installation</a>
          </nav>
          <a href="#install" className="bg-[#0F0F0F] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#1C1C1E] transition-all hover:scale-[1.03] active:scale-[0.98]">
            Install Extension
          </a>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="pt-40 pb-16 text-center px-6">
        <div className="inline-flex items-center gap-1.5 bg-white border border-[#E5E5EA] rounded-full px-3 py-1 text-[11px] font-semibold tracking-wider uppercase mb-6 shadow-xs animate-in fade-in zoom-in-95 duration-500">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse"></span> Now Running Next.js + Tailwind v4
        </div>
        <h1 className="text-4xl md:text-[56px] font-extrabold leading-tight tracking-tight max-w-[850px] mx-auto mb-5 text-[#0F0F0F] animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75">
          Calibrate your tone.<br />Translate corporate speak in real-time.
        </h1>
        <p className="text-base md:text-lg text-[#636366] max-w-[640px] mx-auto mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-3 duration-500 delay-150">
          A zero-dependency, two-way tone translator that works natively inside Gmail, Slack, and LinkedIn. Wrapped fully inside isolated Shadow DOM elements.
        </p>
        <div className="flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200">
          <a href="#demo" className="bg-[#0F0F0F] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1C1C1E] transition-all hover:-translate-y-0.5 shadow-sm active:translate-y-0">
            Try Interactive Playground
          </a>
          <a href="#install" className="bg-white text-[#0F0F0F] border border-[#E5E5EA] font-semibold px-6 py-3 rounded-lg hover:border-[#AEAEB2] transition-all hover:-translate-y-0.5 shadow-xs active:translate-y-0">
            Get Started
          </a>
        </div>
      </section>

      {/* ── INTERACTIVE PLAYGROUND (PLATFORM ADAPTER VISUALIZER) ── */}
      <section id="demo" className="pb-24 max-w-[1100px] mx-auto px-6">
        <div className="bg-white border border-[#E5E5EA] rounded-2xl shadow-lg overflow-hidden flex flex-col h-[590px] animate-in fade-in zoom-in-95 duration-500 delay-300">
          
          {/* Header tabs */}
          <div className="bg-[#F2F2F7] border-b border-[#E5E5EA] px-5 py-3 flex items-center justify-between">
            <div className="flex gap-1 md:gap-2">
              <button 
                onClick={() => handleTabChange("gmail")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                  activeTab === "gmail" 
                    ? "bg-white text-[#0F0F0F] shadow-xs" 
                    : "text-[#636366] hover:bg-black/5 hover:text-[#0F0F0F]"
                }`}
              >
                Gmail Composer
              </button>
              <button 
                onClick={() => handleTabChange("slack")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                  activeTab === "slack" 
                    ? "bg-white text-[#0F0F0F] shadow-xs" 
                    : "text-[#636366] hover:bg-black/5 hover:text-[#0F0F0F]"
                }`}
              >
                Slack Chat
              </button>
              <button 
                onClick={() => handleTabChange("linkedin")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                  activeTab === "linkedin" 
                    ? "bg-white text-[#0F0F0F] shadow-xs" 
                    : "text-[#636366] hover:bg-black/5 hover:text-[#0F0F0F]"
                }`}
              >
                LinkedIn Post
              </button>
              <button 
                onClick={() => handleTabChange("decode")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                  activeTab === "decode" 
                    ? "bg-white text-[#0F0F0F] shadow-xs" 
                    : "text-[#636366] hover:bg-black/5 hover:text-[#0F0F0F]"
                }`}
              >
                Jargon Decoder
              </button>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E5E5EA]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#E5E5EA]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#E5E5EA]"></div>
            </div>
          </div>

          {/* Interactive Workspace Area */}
          <div className="flex-1 relative bg-white overflow-hidden">
            
            {/* 1. GMAIL COMPOSER VIEW */}
            {activeTab === "gmail" && (
              <div className="h-full flex flex-col animate-in fade-in duration-200">
                {/* Mock Gmail Window header */}
                <div className="bg-[#2C2C2E] px-4 py-3 flex items-center justify-between text-white text-xs font-semibold">
                  <span>New Message</span>
                  <div className="flex gap-2 opacity-60">
                    <span>—</span>
                    <span>⤢</span>
                    <span>✕</span>
                  </div>
                </div>
                {/* Inputs */}
                <div className="border-b border-[#E5E5EA] px-4 py-3 flex items-center gap-2 text-xs">
                  <span className="text-[#AEAEB2] font-medium w-12 text-right">To:</span>
                  <span className="bg-[#F2F2F7] text-[#0F0F0F] px-2 py-0.5 rounded-full font-medium">team@tonal.ai</span>
                </div>
                <div className="border-b border-[#E5E5EA] px-4 py-3 flex items-center gap-2 text-xs">
                  <span className="text-[#AEAEB2] font-medium w-12 text-right">Subject:</span>
                  <span className="text-[#0F0F0F] font-semibold">Rescheduling meeting tomorrow</span>
                </div>

                {/* Example Selector Bar */}
                <div className="border-b border-[#E5E5EA] px-4 py-2 flex items-center gap-2 text-[10px] bg-[#F9F9FB] overflow-x-auto whitespace-nowrap scrollbar-none">
                  <span className="text-[#AEAEB2] font-bold uppercase tracking-wider text-[8px] shrink-0 mr-1">Tones Examples:</span>
                  <div className="flex gap-1.5">
                    {gmailExamples.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => loadGmailExample(ex)}
                        className={`px-2.5 py-1 rounded-full font-bold transition-all border cursor-pointer text-[10px] ${
                          gmailExample.id === ex.id 
                            ? "bg-[#0F0F0F] text-white border-transparent shadow-xs" 
                            : "bg-white border-[#E5E5EA] text-[#636366] hover:text-[#0F0F0F] hover:border-[#AEAEB2]"
                        }`}
                      >
                        {ex.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Editor composition area */}
                <div className="flex-1 p-6 relative flex flex-col">
                  <textarea 
                    className={`flex-1 border-none resize-none outline-none text-[15px] text-[#0F0F0F] bg-transparent leading-relaxed ${isTyping ? "after:content-['|'] after:animate-pulse" : ""}`}
                    value={editorText}
                    readOnly
                  />
                  
                  {/* Tonal Injected Pill (Gmail Style - inside editor, bottom right) */}
                  <div className="absolute right-6 bottom-6 flex flex-col items-end z-40">
                    <span className="font-mono text-[8px] text-[#007AFF] font-bold opacity-80 mb-1 select-none pointer-events-none">#tonal-root (Shadow DOM)</span>
                    <div className="border border-dashed border-[#007AFF]/40 p-1 rounded-full bg-[#007AFF]/5 hover:border-[#007AFF] transition-colors">
                      <button 
                        onClick={toggleTonalMenu}
                        className={`flex items-center h-6 px-2.5 gap-1.5 bg-[#0F0F0F] text-white rounded-full text-[10px] font-bold shadow-sm cursor-pointer hover:bg-[#1C1C1E] transition-all hover:scale-[1.04] active:scale-[0.98] select-none ${
                          isMenuOpen ? "bg-[#1C1C1E]" : ""
                        }`}
                      >
                        <svg width="13" height="8" viewBox="0 0 72 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0" y="18" width="72" height="8" rx="4" fill="#2C2C2E"/>
                          <rect x="0" y="18" width="39" height="8" rx="4" fill="white"/>
                          <circle cx="39" cy="22" r="16" fill="#F2F2F2"/>
                          <circle cx="39" cy="22" r="14.5" fill="white"/>
                          <circle cx="39" cy="22" r="9" fill="#1C1C1E"/>
                          <circle cx="39" cy="22" r="4" fill="#3A3A3C"/>
                        </svg>
                        <span>Tonal</span>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${isMenuOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isMenuOpen && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="absolute bottom-7 right-1 bg-white/95 backdrop-blur-md border border-[#E5E5EA] rounded-2xl shadow-lg p-1 flex flex-col w-[192px] z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
                        >
                          <div className="text-[8px] font-bold text-[#AEAEB2] px-[15px] py-[9px] uppercase tracking-wider">Tone Selection</div>
                          <div className="h-[1px] bg-[#F2F2F7]" />
                          <div onClick={() => selectTone("casual")} className="flex items-center justify-between px-[15px] py-[11px] rounded-lg text-xs font-semibold text-[#0F0F0F] hover:bg-[#F5F5F7] cursor-pointer transition-colors">
                            <span>Casual</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#636366]"></span>
                          </div>
                          <div className="h-[1px] bg-[#F2F2F7]" />
                          <div onClick={() => selectTone("work")} className="flex items-center justify-between px-[15px] py-[11px] rounded-lg text-xs font-semibold text-[#0F0F0F] hover:bg-[#F5F5F7] cursor-pointer transition-colors">
                            <span>Work Chat</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F0A]"></span>
                          </div>
                          <div className="h-[1px] bg-[#F2F2F7]" />
                          <div onClick={() => selectTone("formal")} className="flex items-center justify-between px-[15px] py-[11px] rounded-lg text-xs font-semibold text-[#0F0F0F] hover:bg-[#F5F5F7] cursor-pointer transition-colors">
                            <span>Formal Professional</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gmail Composer Footer */}
                <div className="bg-[#F5F5F7] border-t border-[#E5E5EA] px-4 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="bg-[#0B57D0] text-white text-xs font-semibold px-5 py-2 rounded-full hover:bg-[#08429E] transition-all flex items-center gap-1.5 cursor-not-allowed">
                      <span>Send</span>
                      <Send className="w-3 h-3" />
                    </button>
                    <div className="flex gap-2.5 text-[#636366]">
                      <Paperclip className="w-4 h-4 cursor-not-allowed" />
                      <Link className="w-4 h-4 cursor-not-allowed" />
                      <Smile className="w-4 h-4 cursor-not-allowed" />
                      <ImageIcon className="w-4 h-4 cursor-not-allowed" />
                    </div>
                  </div>
                  
                  {/* Status / Actions */}
                  <div className="flex items-center gap-4">
                    {toast && (
                      <div className="flex items-center gap-1.5 text-xs text-[#636366] bg-white border border-[#E5E5EA] px-2.5 py-1 rounded-full shadow-xs">
                        <span className={`w-1.5 h-1.5 rounded-full ${toast.color}`}></span>
                        <span>{toast.text}</span>
                      </div>
                    )}
                    {showUndo && (
                      <button onClick={triggerUndo} className="flex items-center gap-1 text-xs font-bold text-[#FF3B30] hover:underline cursor-pointer">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Undo
                      </button>
                    )}
                    <Trash2 className="w-4 h-4 text-[#636366] cursor-not-allowed" />
                  </div>
                </div>
              </div>
            )}

            {/* 2. SLACK MESSAGE VIEW */}
            {activeTab === "slack" && (
              <div className="h-full flex animate-in fade-in duration-200">
                {/* Slack channel list mock sidebar */}
                <div className="w-[180px] bg-[#3F0E40] text-[#BCABB6] p-3 flex flex-col gap-4 text-xs font-medium shrink-0">
                  <div className="flex items-center justify-between text-white font-bold mb-1">
                    <span>Tonal Workspace</span>
                    <Settings className="w-3.5 h-3.5 opacity-60" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold tracking-wider opacity-60 uppercase mb-1">Channels</span>
                    <span className="px-2.5 py-1.5 rounded-md hover:bg-white/10 hover:text-white cursor-pointer transition-colors"># general</span>
                    <span className="bg-[#1164A3] text-white px-2.5 py-1.5 rounded-md font-bold cursor-pointer"># tone-testing</span>
                    <span className="px-2.5 py-1.5 rounded-md hover:bg-white/10 hover:text-white cursor-pointer transition-colors"># marketing</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-[10px] font-bold tracking-wider opacity-60 uppercase mb-1">Direct Messages</span>
                    <span className="px-2.5 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-white/10 hover:text-white cursor-pointer">
                      <span className="w-2 h-2 rounded-full bg-[#34C759]"></span> Tonal Bot
                    </span>
                    <span className="px-2.5 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-white/10 hover:text-white cursor-pointer">
                      <span className="w-2 h-2 rounded-full bg-[#34C759]"></span> Karan T.
                    </span>
                  </div>
                </div>

                {/* Slack chat conversation frame */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden">
                  {/* Chat top info */}
                  <div className="border-b border-[#E5E5EA] px-5 py-3.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-sm text-[#0F0F0F]"># tone-testing</span>
                      <span className="text-[#AEAEB2] ml-2">Testing extension adapters in Slack</span>
                    </div>
                    <Users className="w-4 h-4 text-[#636366]" />
                  </div>

                  {/* Example Selector Bar */}
                  <div className="border-b border-[#E5E5EA] px-4 py-2 flex items-center gap-2 text-[10px] bg-[#F9F9FB] overflow-x-auto whitespace-nowrap scrollbar-none">
                    <span className="text-[#AEAEB2] font-bold uppercase tracking-wider text-[8px] shrink-0 mr-1">Tones Examples:</span>
                    <div className="flex gap-1.5">
                      {slackExamples.map((ex) => (
                        <button
                          key={ex.id}
                          onClick={() => loadSlackExample(ex)}
                          className={`px-2.5 py-1 rounded-full font-bold transition-all border cursor-pointer text-[10px] ${
                            slackExample.id === ex.id 
                              ? "bg-[#0F0F0F] text-white border-transparent shadow-xs" 
                              : "bg-white border-[#E5E5EA] text-[#636366] hover:text-[#0F0F0F] hover:border-[#AEAEB2]"
                          }`}
                        >
                          {ex.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Chat feed history */}
                  <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 text-xs leading-relaxed">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded bg-[#1164A3] text-white font-bold flex items-center justify-center text-[10px] shrink-0">KT</div>
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-[#0F0F0F]">Karan T.</span>
                          <span className="text-[9px] text-[#AEAEB2]">10:42 AM</span>
                        </div>
                        <span className="text-[#636366]">I am testing if Tonal injections are fully compliant inside the Slack Lexical text node editor.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded bg-[#34C759] text-white font-bold flex items-center justify-center text-[10px] shrink-0">TB</div>
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-[#0F0F0F]">Tonal Bot</span>
                          <span className="text-[9px] text-[#AEAEB2]">10:45 AM</span>
                        </div>
                        <span className="text-[#636366]">Pill injected successfully inside editor wrapper. Rest state initialized at 30x16px.</span>
                      </div>
                    </div>
                  </div>

                  {/* Slack Compose message box */}
                  <div className="p-5">
                    <div className="border border-[#D1D1D6] rounded-xl overflow-hidden flex flex-col relative focus-within:border-[#AEAEB2] transition-colors bg-white">
                      {/* Slack Toolbar top */}
                      <div className="bg-[#F5F5F7] border-b border-[#E5E5EA] px-3.5 py-2 flex gap-3.5 text-[#636366]">
                        <Bold className="w-3.5 h-3.5 cursor-not-allowed" />
                        <Italic className="w-3.5 h-3.5 cursor-not-allowed" />
                        <List className="w-3.5 h-3.5 cursor-not-allowed" />
                        <Code className="w-3.5 h-3.5 cursor-not-allowed" />
                      </div>
                      
                      {/* Text Box */}
                      <div className="p-4 pb-12">
                        <textarea 
                          className="w-full border-none resize-none outline-none text-xs text-[#0F0F0F] bg-transparent leading-relaxed h-[42px]"
                          value={editorText}
                          readOnly
                        />
                      </div>

                      {/* Tonal Injected Pill (Slack style - toolbar bottom right) */}
                      <div className="absolute right-3 bottom-2.5 flex items-center gap-2 z-40">
                        {toast && (
                          <div className="flex items-center gap-1.5 text-[10px] text-[#636366] bg-[#F2F2F7] px-2 py-0.5 rounded-full border border-[#E5E5EA]">
                            <span className={`w-1.5 h-1.5 rounded-full ${toast.color}`}></span>
                            <span>{toast.text}</span>
                          </div>
                        )}
                        {showUndo && (
                          <button onClick={triggerUndo} className="flex items-center gap-0.5 text-[10px] font-bold text-[#FF3B30] hover:underline cursor-pointer">
                            <RotateCcw className="w-3 h-3" />
                            Undo
                          </button>
                        )}
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-[7px] text-[#007AFF] font-bold opacity-80 mb-0.5 select-none pointer-events-none">#tonal-root (Shadow DOM)</span>
                          <div className="border border-dashed border-[#007AFF]/40 p-0.5 rounded-full bg-[#007AFF]/5 hover:border-[#007AFF] transition-colors flex items-center">
                            <button 
                              onClick={toggleTonalMenu}
                              className="flex items-center h-6 px-2.5 gap-1.5 bg-[#0F0F0F] text-white rounded-full text-[10px] font-bold shadow-sm cursor-pointer hover:bg-[#1C1C1E] transition-all hover:scale-[1.04] active:scale-[0.98] select-none"
                            >
                              <svg width="13" height="8" viewBox="0 0 72 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0" y="18" width="72" height="8" rx="4" fill="#2C2C2E"/>
                                <rect x="0" y="18" width="39" height="8" rx="4" fill="white"/>
                                <circle cx="39" cy="22" r="16" fill="#F2F2F2"/>
                                <circle cx="39" cy="22" r="14.5" fill="white"/>
                                <circle cx="39" cy="22" r="9" fill="#1C1C1E"/>
                                <circle cx="39" cy="22" r="4" fill="#3A3A3C"/>
                              </svg>
                              <span>Tonal</span>
                              <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${isMenuOpen ? "rotate-180" : ""}`} />
                            </button>
                            
                            {isMenuOpen && (
                              <div className="absolute bottom-7 right-1 bg-white border border-[#E5E5EA] rounded-2xl shadow-lg p-1 flex flex-col w-[192px] z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <div className="text-[8px] font-bold text-[#AEAEB2] px-[15px] py-[9px] uppercase tracking-wider">Tone Selection</div>
                                <div className="h-[1px] bg-[#F2F2F7]" />
                                <div onClick={() => selectTone("casual")} className="flex items-center justify-between px-[15px] py-[11px] rounded-lg text-xs font-semibold text-[#0F0F0F] hover:bg-[#F5F5F7] cursor-pointer transition-colors">
                                  <span>Casual</span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#636366]"></span>
                                </div>
                                <div className="h-[1px] bg-[#F2F2F7]" />
                                <div onClick={() => selectTone("work")} className="flex items-center justify-between px-[15px] py-[11px] rounded-lg text-xs font-semibold text-[#0F0F0F] hover:bg-[#F5F5F7] cursor-pointer transition-colors">
                                  <span>Work Chat</span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F0A]"></span>
                                </div>
                                <div className="h-[1px] bg-[#F2F2F7]" />
                                <div onClick={() => selectTone("formal")} className="flex items-center justify-between px-[15px] py-[11px] rounded-lg text-xs font-semibold text-[#0F0F0F] hover:bg-[#F5F5F7] cursor-pointer transition-colors">
                                  <span>Formal Professional</span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. LINKEDIN POST VIEW */}
            {activeTab === "linkedin" && (
              <div className="h-full bg-slate-50/50 p-6 flex flex-col justify-center items-center animate-in fade-in duration-200 overflow-y-auto">
                {/* Example Selector Bar */}
                <div className="w-full max-w-[480px] border border-[#E5E5EA] rounded-xl px-4 py-2 flex items-center gap-2 text-[10px] bg-[#F9F9FB] overflow-x-auto whitespace-nowrap scrollbar-none mb-3">
                  <span className="text-[#AEAEB2] font-bold uppercase tracking-wider text-[8px] shrink-0 mr-1">Tones Examples:</span>
                  <div className="flex gap-1.5">
                    {linkedinExamples.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => loadLinkedinExample(ex)}
                        className={`px-2.5 py-1 rounded-full font-bold transition-all border cursor-pointer text-[10px] ${
                          linkedinExample.id === ex.id 
                            ? "bg-[#0F0F0F] text-white border-transparent shadow-xs" 
                            : "bg-white border-[#E5E5EA] text-[#636366] hover:text-[#0F0F0F] hover:border-[#AEAEB2]"
                        }`}
                      >
                        {ex.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modal post window */}
                <div className="w-full max-w-[480px] bg-white border border-[#E5E5EA] rounded-xl shadow-md overflow-hidden flex flex-col relative">
                  {/* LinkedIn Header */}
                  <div className="border-b border-[#E5E5EA] px-4 py-3.5 flex justify-between items-center text-xs">
                    <span className="font-bold text-[#0F0F0F] text-sm">Create a post</span>
                    <button className="text-gray-400 hover:text-black">✕</button>
                  </div>
                  
                  {/* Profile Section */}
                  <div className="px-4 pt-4 flex gap-2.5 items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-[#0F0F0F]">KW</div>
                    <div>
                      <div className="text-xs font-bold text-[#0F0F0F]">Karan Wakhare</div>
                      <div className="inline-flex items-center gap-1 text-[10px] text-[#636366] bg-slate-100 px-1.5 py-0.5 rounded-full border border-gray-200">
                        <Globe className="w-2.5 h-2.5" />
                        <span>Anyone</span>
                        <ChevronDown className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn Editor Area */}
                  <div className="p-5 min-h-[140px] flex flex-col">
                    <textarea 
                      className="flex-1 border-none resize-none outline-none text-xs text-[#0F0F0F] bg-transparent leading-relaxed h-[90px]"
                      value={editorText}
                      readOnly
                    />
                  </div>

                  {/* LinkedIn Footer Toolbar */}
                  <div className="border-t border-[#E5E5EA] px-4 py-3.5 flex items-center justify-between bg-slate-50/50">
                    <div className="flex gap-3 text-[#636366]">
                      <ImageIcon className="w-4.5 h-4.5 cursor-not-allowed" />
                      <Paperclip className="w-4.5 h-4.5 cursor-not-allowed" />
                      <MoreHorizontal className="w-4.5 h-4.5 cursor-not-allowed" />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {toast && (
                        <div className="flex items-center gap-1.5 text-[9px] text-[#636366] bg-white border border-[#E5E5EA] px-2 py-0.5 rounded-full shadow-xs">
                          <span className={`w-1 h-1 rounded-full ${toast.color}`}></span>
                          <span>{toast.text}</span>
                        </div>
                      )}
                      {showUndo && (
                        <button onClick={triggerUndo} className="text-[10px] font-bold text-[#FF3B30] hover:underline cursor-pointer">
                          Undo
                        </button>
                      )}
                      <button className="bg-slate-200 text-slate-500 text-xs font-semibold px-4 py-1.5 rounded-full cursor-not-allowed">
                        Post
                      </button>
                    </div>
                  </div>

                  {/* Tonal Pill (LinkedIn Style - Injected bottom right toolbar overlay) */}
                  <div className="absolute right-24 bottom-3 z-40 flex flex-col items-end">
                    <span className="font-mono text-[7px] text-[#007AFF] font-bold opacity-80 mb-0.5 select-none pointer-events-none">#tonal-root (Shadow DOM)</span>
                    <div className="border border-dashed border-[#007AFF]/40 p-0.5 rounded-full bg-[#007AFF]/5 hover:border-[#007AFF] transition-colors flex items-center">
                      <button 
                        onClick={toggleTonalMenu}
                        className="flex items-center h-6 px-2.5 gap-1.5 bg-[#0F0F0F] text-white rounded-full text-[10px] font-bold shadow-sm cursor-pointer hover:bg-[#1C1C1E] transition-all hover:scale-[1.04] active:scale-[0.98] select-none"
                      >
                        <svg width="13" height="8" viewBox="0 0 72 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0" y="18" width="72" height="8" rx="4" fill="#2C2C2E"/>
                          <rect x="0" y="18" width="39" height="8" rx="4" fill="white"/>
                          <circle cx="39" cy="22" r="16" fill="#F2F2F2"/>
                          <circle cx="39" cy="22" r="14.5" fill="white"/>
                          <circle cx="39" cy="22" r="9" fill="#1C1C1E"/>
                          <circle cx="39" cy="22" r="4" fill="#3A3A3C"/>
                        </svg>
                        <span>Tonal</span>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${isMenuOpen ? "rotate-180" : ""}`} />
                      </button>
                      
                      {isMenuOpen && (
                        <div className="absolute bottom-7 right-0 bg-white border border-[#E5E5EA] rounded-2xl shadow-lg p-1 flex flex-col w-[192px] z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <div className="text-[8px] font-bold text-[#AEAEB2] px-[15px] py-[9px] uppercase tracking-wider">Tone Selection</div>
                          <div className="h-[1px] bg-[#F2F2F7]" />
                          <div onClick={() => selectTone("casual")} className="flex items-center justify-between px-[15px] py-[11px] rounded-lg text-xs font-semibold text-[#0F0F0F] hover:bg-[#F5F5F7] cursor-pointer transition-colors">
                            <span>Casual</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#636366]"></span>
                          </div>
                          <div className="h-[1px] bg-[#F2F2F7]" />
                          <div onClick={() => selectTone("work")} className="flex items-center justify-between px-[15px] py-[11px] rounded-lg text-xs font-semibold text-[#0F0F0F] hover:bg-[#F5F5F7] cursor-pointer transition-colors">
                            <span>Work Chat</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F0A]"></span>
                          </div>
                          <div className="h-[1px] bg-[#F2F2F7]" />
                          <div onClick={() => selectTone("formal")} className="flex items-center justify-between px-[15px] py-[11px] rounded-lg text-xs font-semibold text-[#0F0F0F] hover:bg-[#F5F5F7] cursor-pointer transition-colors">
                            <span>Formal Professional</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 4. JARGON DECODER VIEW */}
            {activeTab === "decode" && (
              <div className="h-full flex flex-col p-6 relative animate-in fade-in duration-200 overflow-y-auto">
                {/* Received email reader with Example selector tab */}
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#AEAEB2] mb-3 flex justify-between items-center shrink-0">
                  <span>Mock Inbox (Received Mail)</span>
                  <div className="flex gap-1.5">
                    {decoderExamples.map((ex) => (
                      <button 
                        key={ex.id}
                        onClick={() => loadDecoderExample(ex)} 
                        className={`px-2.5 py-1 rounded-full border text-[9px] font-bold cursor-pointer transition-all ${
                          decoderExample.id === ex.id 
                            ? "bg-[#0F0F0F] text-white border-transparent shadow-xs" 
                            : "bg-white border-[#E5E5EA] text-[#636366] hover:text-[#0F0F0F]"
                        }`}
                      >
                        {ex.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border border-[#E5E5EA] rounded-xl p-5 bg-white shadow-xs max-w-[640px] mx-auto w-full relative">
                  <div className="flex justify-between items-baseline text-xs mb-4 pb-4 border-b border-[#F2F2F7]">
                    <div>
                      <span className="font-bold text-[#0F0F0F]">{decoderExample.sender}</span>
                      <span className="text-[#636366] ml-2">&lt;sender@firm.co&gt;</span>
                    </div>
                    <span className="text-[#AEAEB2] text-[10px]">9:02 AM</span>
                  </div>
                  <div className="text-xs font-bold text-[#636366] mb-4">Subject: {decoderExample.subject}</div>
                  <div className="text-sm text-[#0F0F0F] leading-relaxed">
                    Dear team,<br /><br />
                    As we look to move forward,{" "}
                    <span 
                      onClick={() => setShowDecodePill(true)}
                      className="bg-[#FF9F0A]/15 border-b-2 border-[#FF9F0A] cursor-pointer relative font-medium hover:bg-[#FF9F0A]/25 transition-colors"
                    >
                      {decoderExample.text}
                    </span>{" "}
                    Please keep this in mind.<br /><br />
                    Regards,<br />
                    Management
                  </div>
                </div>

                {/* Floating Decode Button (inside isolated DOM wrapper indicator) */}
                {showDecodePill && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center">
                    <span className="font-mono text-[8px] text-[#007AFF] font-bold opacity-80 mb-1 select-none pointer-events-none">#tonal-root (Shadow DOM)</span>
                    <div className="border border-dashed border-[#007AFF]/40 p-1 rounded-full bg-[#007AFF]/5 hover:border-[#007AFF] transition-colors">
                      <button 
                        onClick={triggerDecode}
                        className="bg-[#0F0F0F] text-white px-3.5 py-2 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-md cursor-pointer hover:bg-[#1C1C1E] transition-all hover:scale-[1.04] animate-bounce"
                      >
                        <Eye className="w-3.5 h-3.5 animate-pulse" />
                        Decode Selection
                      </button>
                    </div>
                  </div>
                )}

                {/* Viewport-Aware Decode Result Card */}
                {showDecodeCard && (
                  <div className="absolute bottom-6 left-6 right-6 z-50 flex flex-col">
                    <span className="font-mono text-[8px] text-[#007AFF] font-bold opacity-80 mb-1 select-none pointer-events-none self-end mr-3">#tonal-root (Shadow DOM)</span>
                    <div className="bg-white/95 backdrop-blur-md border border-dashed border-[#007AFF]/40 rounded-xl shadow-lg p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 bg-[#007AFF]/5">
                      <div className="bg-white rounded-lg p-3 border border-[#E5E5EA] flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#FF9F0A] uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F0A]"></span>
                            Tonal Decoder
                          </div>
                          <button 
                            onClick={() => {
                              setShowDecodeCard(false);
                              setShowDecodePill(true);
                            }} 
                            className="text-[#636366] hover:bg-[#F2F2F7] hover:text-[#0F0F0F] p-1 rounded-full cursor-pointer transition-colors"
                          >
                            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </button>
                        </div>
                        
                        <div className="text-sm font-semibold leading-relaxed text-[#0F0F0F]">
                          {decodeText}
                        </div>

                        <div className="flex justify-end">
                          <button 
                            onClick={copyDecodedText}
                            disabled={decodeText.includes("Decoding")}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                              copied 
                                ? "bg-[#34C759] text-white" 
                                : "bg-[#F2F2F7] text-[#0F0F0F] hover:bg-[#E5E5EA]"
                            }`}
                          >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? "Copied!" : "Copy"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── UNDER THE HOOD (FEATURES) ── */}
      <section id="features" className="py-24 bg-white border-y border-[#E5E5EA]">
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-center mb-12">Under the hood. Built for production.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="border border-[#F2F2F7] rounded-xl p-8 hover:translate-y-[-4px] hover:shadow-md transition-all duration-200">
              <div className="w-11 h-11 rounded-lg bg-[#F5F5F7] flex items-center justify-center text-[#0F0F0F] mb-5">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-3">Shadow DOM Isolation</h3>
              <p className="text-sm text-[#636366] leading-relaxed">
                Every Tonal UI component is fully wrapped inside isolated Shadow Roots. Host styles never bleed in, and extension styles never disrupt the page styling rules.
              </p>
            </div>

            <div className="border border-[#F2F2F7] rounded-xl p-8 hover:translate-y-[-4px] hover:shadow-md transition-all duration-200">
              <div className="w-11 h-11 rounded-lg bg-[#F5F5F7] flex items-center justify-center text-[#0F0F0F] mb-5">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-3">Zero Dependencies</h3>
              <p className="text-sm text-[#636366] leading-relaxed">
                No build step. No npm. No bundlers. Written purely in Vanilla Javascript and CSS, optimizing performance, page loads, and extension package size.
              </p>
            </div>

            <div className="border border-[#F2F2F7] rounded-xl p-8 hover:translate-y-[-4px] hover:shadow-md transition-all duration-200">
              <div className="w-11 h-11 rounded-lg bg-[#F5F5F7] flex items-center justify-center text-[#0F0F0F] mb-5">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-3">Secure Proxy Architecture</h3>
              <p className="text-sm text-[#636366] leading-relaxed">
                No API keys are stored in the client-side content scripts. All traffic is securely encrypted and routed via Service Workers to a serverless Cloudflare Workers proxy.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW TO INSTALL ── */}
      <section id="install" className="py-24 max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-5">Install on Chrome</h2>
            <p className="text-base text-[#636366] mb-8">
              Tonal is developed with standard manifest-driven modular scripts. You can run the extension locally in seconds by loading it unpacked.
            </p>
            
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-start">
                <div className="font-mono text-xs font-semibold text-[#636366] bg-white border border-[#E5E5EA] w-7 h-7 rounded-full flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="text-base font-bold mb-1">Clone / Download Code</h4>
                  <p className="text-sm text-[#636366]">Download the codebase files and keep the directory structured as is.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="font-mono text-xs font-semibold text-[#636366] bg-white border border-[#E5E5EA] w-7 h-7 rounded-full flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="text-base font-bold mb-1">Open Extensions Panel</h4>
                  <p className="text-sm text-[#636366]">Navigate to <span className="font-mono bg-[#E5E5EA]/50 px-1.5 py-0.5 rounded text-xs text-[#0F0F0F]">chrome://extensions/</span> in your address bar.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="font-mono text-xs font-semibold text-[#636366] bg-white border border-[#E5E5EA] w-7 h-7 rounded-full flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="text-base font-bold mb-1">Toggle Developer Mode</h4>
                  <p className="text-sm text-[#636366]">Switch on the <strong>Developer mode</strong> toggle located in the upper-right corner of the window.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="font-mono text-xs font-semibold text-[#636366] bg-white border border-[#E5E5EA] w-7 h-7 rounded-full flex items-center justify-center shrink-0">4</div>
                <div>
                  <h4 className="text-base font-bold mb-1">Load Unpacked Extension</h4>
                  <p className="text-sm text-[#636366]">Click the <strong>Load unpacked</strong> button on the top-left, and select the folder containing the manifest.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E5EA] rounded-2xl p-8 shadow-md">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#AEAEB2] mb-3">manifest.json</div>
            <pre className="bg-[#F5F5F7] rounded-lg p-5 font-mono text-xs text-[#1C1C1E] overflow-x-auto border border-[#E5E5EA]">
              <code>{`{
  "manifest_version": 3,
  "name": "Tonal",
  "version": "5.0.0",
  "permissions": [
    "storage"
  ],
  "host_permissions": [
    "https://mail.google.com/*",
    "https://*.slack.com/*",
    "https://*.linkedin.com/*"
  ]
}`}</code>
            </pre>
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-[#E5E5EA] py-12 text-center">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="inline-flex items-center gap-2 font-bold text-sm mb-4">
            <Image src="/icon128.png" alt="Tonal Logo" width={24} height={24} className="rounded-md" />
            <span>Tonal</span>
          </div>
          <p className="text-xs text-[#AEAEB2]">© 2026 Tonal. Calibrated corporate correspondence.</p>
        </div>
      </footer>

    </div>
  );
}
