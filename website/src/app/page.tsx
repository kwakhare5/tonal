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
    <div className="min-h-screen bg-[#F9FAFB] text-[#0F0F0F] font-sans antialiased overflow-x-hidden">
      
      {/* ── HEADER / FLOATING NAVBAR ── */}
      <header className="fixed top-4 left-4 right-4 z-50 flex justify-center animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex items-center justify-between w-full max-w-[1100px] bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-2xl px-6 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <a href="#" className="flex items-center gap-2.5 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity duration-300">
            <span className="flex items-center">
              <Image src="/icon128.png" alt="Tonal Logo" width={24} height={24} className="rounded-lg shadow-sm" />
            </span>
            <span>Tonal</span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#demo" className="text-sm font-semibold text-gray-500 hover:text-[#0F0F0F] transition-colors duration-300">Interactive Playground</a>
            <a href="#features" className="text-sm font-semibold text-gray-500 hover:text-[#0F0F0F] transition-colors duration-300">Features</a>
            <a href="#install" className="text-sm font-semibold text-gray-500 hover:text-[#0F0F0F] transition-colors duration-300">Installation</a>
          </nav>
          <a href="#install" className="bg-[#0F0F0F] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#1C1C1E] hover:shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0">
            Download Extension
          </a>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="pt-32 md:pt-40 pb-16 text-center px-6 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>
        <h1 className="text-5xl md:text-[72px] font-extrabold leading-[1.05] tracking-tight max-w-[900px] mx-auto mb-6 text-[#0F0F0F] animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75">
          Write without the anxiety.
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-[640px] mx-auto mb-10 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-3 duration-500 delay-150">
          Instantly translate your raw thoughts into polished work messages, or decode confusing corporate jargon into plain English. Works right inside Gmail, Slack, and LinkedIn.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200">
          <a href="#demo" className="w-full sm:w-auto bg-[#0F0F0F] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#1C1C1E] shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0">
            Try Interactive Playground
          </a>
          <a href="#install" className="w-full sm:w-auto bg-white text-[#0F0F0F] border border-gray-200 font-bold px-8 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0">
            Download Extension
          </a>
        </div>
      </section>

      {/* ── INTERACTIVE PLAYGROUND (PLATFORM ADAPTER VISUALIZER) ── */}
      <section id="demo" className="pb-24 max-w-[1000px] mx-auto px-6 -mt-4 relative z-10">
        <div className="bg-white border border-gray-200/80 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-[590px] animate-in fade-in zoom-in-95 duration-500 delay-300">
          
          {/* Header tabs */}
          <div className="bg-[#FAFAFA] border-b border-gray-200/80 px-5 py-3.5 flex items-center justify-between">
            <div className="flex gap-2">
              <button 
                onClick={() => handleTabChange("gmail")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-300 ${
                  activeTab === "gmail" 
                    ? "bg-[#EA4335] text-white shadow-sm" 
                    : "text-gray-500 hover:bg-gray-200/50 hover:text-[#0F0F0F]"
                }`}
              >
                Gmail Composer
              </button>
              <button 
                onClick={() => handleTabChange("slack")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-300 ${
                  activeTab === "slack" 
                    ? "bg-[#4A154B] text-white shadow-sm" 
                    : "text-gray-500 hover:bg-gray-200/50 hover:text-[#0F0F0F]"
                }`}
              >
                Slack Chat
              </button>
              <button 
                onClick={() => handleTabChange("linkedin")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-300 ${
                  activeTab === "linkedin" 
                    ? "bg-[#0A66C2] text-white shadow-sm" 
                    : "text-gray-500 hover:bg-gray-200/50 hover:text-[#0F0F0F]"
                }`}
              >
                LinkedIn Post
              </button>
              <button 
                onClick={() => handleTabChange("decode")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-300 ${
                  activeTab === "decode" 
                    ? "bg-[#0F0F0F] text-white shadow-sm" 
                    : "text-gray-500 hover:bg-gray-200/50 hover:text-[#0F0F0F]"
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
                        className={`flex items-center h-6 px-2.5 gap-1.5 bg-[#0F0F0F] text-white rounded-full text-[10px] font-bold shadow-sm cursor-pointer hover:bg-[#1E1B4B] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md active:translate-y-0 select-none ${
                          isMenuOpen ? "bg-[#1E1B4B] ring-2 ring-[#6366F1] ring-offset-1" : ""
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
                              className="flex items-center h-6 px-2.5 gap-1.5 bg-[#0F0F0F] text-white rounded-full text-[10px] font-bold shadow-sm cursor-pointer hover:bg-[#1E1B4B] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md active:translate-y-0 select-none"
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
                        className="flex items-center h-6 px-2.5 gap-1.5 bg-[#0F0F0F] text-white rounded-full text-[10px] font-bold shadow-sm cursor-pointer hover:bg-[#1E1B4B] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md active:translate-y-0 select-none"
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
                        className="bg-[#0F0F0F] text-white px-3.5 py-2 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1] hover:bg-[#1E1B4B] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
                      >
                        <Eye className="w-3.5 h-3.5" />
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
      <section id="features" className="py-32 bg-white border-t border-gray-100">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F0F0F] mb-6">Enterprise-grade privacy.<br/>Zero friction.</h2>
            <p className="text-gray-500 text-xl max-w-2xl font-medium">Under the hood, Tonal is engineered as a lightweight, highly secure, and deeply isolated extension.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-[#F9FAFB] rounded-[2rem] p-10 flex flex-col justify-between border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#0F0F0F] mb-8 group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                <Shield className="w-6 h-6 text-[#0F0F0F]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-[#0F0F0F]">Shadow DOM Isolation</h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  Every UI component is wrapped in isolated Shadow Roots. Host styles never bleed in, and our styles never break your page. Absolute quarantine.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F9FAFB] rounded-[2rem] p-10 flex flex-col justify-between border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#0F0F0F] mb-8 group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                <Cpu className="w-6 h-6 text-[#0F0F0F]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-[#0F0F0F]">Zero Dependencies</h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  No build step. No heavy npm packages. Written purely in Vanilla JS and CSS, heavily optimizing performance and load times.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F9FAFB] rounded-[2rem] p-10 flex flex-col justify-between border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#0F0F0F] mb-8 group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                <Lock className="w-6 h-6 text-[#0F0F0F]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-[#0F0F0F]">Secure Architecture</h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  No API keys stored locally. All traffic is encrypted and routed via Service Workers to a serverless Cloudflare Workers proxy.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW TO INSTALL ── */}
      <section id="install" className="py-24 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto bg-[#0F0F0F] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-white relative z-10">Ready to upgrade your workflow?</h2>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium relative z-10">
            Install the extension locally in seconds. Join thousands of professionals communicating with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a href="#install" className="w-full sm:w-auto bg-white text-[#0F0F0F] font-bold px-10 py-4 rounded-xl hover:bg-gray-100 hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0 text-lg">
              Download Extension
            </a>
            <a href="https://github.com/kwakhare5/Tonal" target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-[#1C1C1E] text-white border border-gray-800 font-bold px-10 py-4 rounded-xl hover:bg-gray-800 hover:border-gray-700 hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0 text-lg">
              View Source Code
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white pb-12 text-center">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="inline-flex items-center gap-2 font-bold text-sm mb-4">
            <Image src="/icon128.png" alt="Tonal Logo" width={24} height={24} className="rounded-lg shadow-sm" />
            <span className="text-[#0F0F0F]">Tonal</span>
          </div>
          <p className="text-sm font-medium text-gray-400">© 2026 Tonal. Calibrated corporate correspondence.</p>
        </div>
      </footer>

    </div>
  );
}
