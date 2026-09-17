import { useState, useRef, useEffect, KeyboardEvent, ReactNode } from 'react';
import { 
  MessageSquare, 
  MessageCircle,
  X, 
  Send, 
  Phone, 
  Calculator, 
  ArrowRight, 
  ArrowLeftRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Official channel icons based on user specifications:
// - Chatbot Widget: https://img.icons8.com/?size=100&id=123772&format=png&color=FFFFFF
// - Chatbot: https://img.icons8.com/?size=100&id=HiC7xMlM0VYI&format=png&color=FFFFFF (Resolves the Icons8 link where ID evaluated to undefined)
// - Messenger: https://img.icons8.com/?size=100&id=4PiUK80MorY7&format=png&color=FFFFFF
// - Viber: https://static.vecteezy.com/system/resources/thumbnails/070/283/442/small_2x/viber-icon-viber-white-logo-in-transparent-background-free-png.png
export const CHANNEL_ICON_DATA = {
  chatbotWidget: {
    src: "https://img.icons8.com/?size=100&id=123772&format=png&color=FFFFFF",
    fallbackSrc: "/icons/chatbot-widget.png",
    alt: "Chatbot Widget",
  },
  chatbot: {
    src: "https://img.icons8.com/?size=100&id=HiC7xMlM0VYI&format=png&color=FFFFFF",
    fallbackSrc: "/icons/chatbot.png",
    alt: "Solar AI Chatbot",
  },
  messenger: {
    src: "https://img.icons8.com/?size=100&id=4PiUK80MorY7&format=png&color=FFFFFF",
    fallbackSrc: "/icons/messenger.png",
    alt: "Messenger Support",
  },
  viber: {
    src: "https://static.vecteezy.com/system/resources/thumbnails/070/283/442/small_2x/viber-icon-viber-white-logo-in-transparent-background-free-png.png",
    fallbackSrc: "/icons/viber.png",
    alt: "Viber Support",
  },
};

function ChannelIcon({
  src,
  fallbackSrc,
  alt,
  className = "w-6 h-6 sm:w-7 sm:h-7 object-contain pointer-events-none drop-shadow-xs select-none",
  fallbackSvg,
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  fallbackSvg?: ReactNode;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setHasFailed(false);
  }, [src]);

  if (hasFailed && fallbackSvg) {
    return <>{fallbackSvg}</>;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        } else {
          setHasFailed(true);
        }
      }}
      referrerPolicy="no-referrer"
      loading="eager"
    />
  );
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  action?: {
    type: 'quote' | 'call' | 'services' | 'messenger';
    label: string;
  };
}

interface ChatbotWidgetProps {
  onOpenQuotation?: () => void;
  onNavigateServices?: () => void;
}

export default function ChatbotWidget({ onOpenQuotation, onNavigateServices }: ChatbotWidgetProps) {
  // Expanded state controls the horizontal sliding row of channels
  const [isExpanded, setIsExpanded] = useState(false);
  // Active modal controls whether AI Advisor ('ai'), Viber Support ('viber'), or Messenger Support ('messenger') window is open
  const [activeModal, setActiveModal] = useState<'ai' | 'viber' | 'messenger' | null>(null);
  const isChatOpen = activeModal === 'ai';
  const isViberOpen = activeModal === 'viber';
  const isMessengerOpen = activeModal === 'messenger';

  const [unreadCount, setUnreadCount] = useState(1);
  const [showCallout, setShowCallout] = useState(true);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 640 : false);

  // Robust cross-browser clipboard copy helper (silently prepares clipboard for Messenger/Viber)
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // fallback below
    }
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, 99999);
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // AI Advisor Chat State
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialMessages: Message[] = [
    {
      id: 'msg-1',
      sender: 'bot',
      text: "Hello! I'm your Solareign Assistant.\nHow can I help you transition to clean, cost-efficient solar energy today?",
      timestamp: '12:39 PM',
    }
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const frequentlyAsked = [
    { label: 'How much can I save with solar?', query: 'How much can I save with solar?' },
    { label: 'Inquire about Net Metering', query: 'Inquire about Net Metering' },
    { label: 'Request an Energy Audit', query: 'Request an Energy Audit' },
    { label: 'View Solar Array Specs', query: 'View Solar Array Specs' },
  ];

  // Viber Support State (Follows Viber reference image)
  const initialViberMessages: Message[] = [
    {
      id: 'viber-msg-1',
      sender: 'bot',
      text: "Please let us know your details (such as Name, Email, and Phone number) and your inquiry in your message. Type your message below and press Send to launch our official Viber channel!",
      timestamp: '12:58 PM',
    }
  ];

  const [viberMessages, setViberMessages] = useState<Message[]>(initialViberMessages);
  const [viberInputValue, setViberInputValue] = useState('');
  const [isViberTyping, setIsViberTyping] = useState(false);
  const viberInputRef = useRef<HTMLInputElement>(null);
  const viberMessagesEndRef = useRef<HTMLDivElement>(null);

  const viberStarters = [
    { label: '"Hi Solareign! I\'d like to get a free solar quote..."', query: "Hi Solareign! I'd like to get a free solar quote for my home/business." },
    { label: '"Hello! I am inquiring about solar pricing..."', query: "Hello! I am inquiring about solar pricing and packages." },
  ];

  // Messenger Support State (Follows identical reference image structural flow)
  const initialMessengerMessages: Message[] = [
    {
      id: 'messenger-msg-1',
      sender: 'bot',
      text: "Please let us know your details (such as Name, Email, and Phone number) and your inquiry in your message. Type your message below and press Send to launch our official Facebook Messenger channel!",
      timestamp: '12:58 PM',
    }
  ];

  const [messengerMessages, setMessengerMessages] = useState<Message[]>(initialMessengerMessages);
  const [messengerInputValue, setMessengerInputValue] = useState('');
  const [isMessengerTyping, setIsMessengerTyping] = useState(false);
  const messengerInputRef = useRef<HTMLInputElement>(null);
  const messengerMessagesEndRef = useRef<HTMLDivElement>(null);

  const messengerStarters = [
    { label: '"Hi Solareign! I\'d like to get a free solar quote..."', query: "Hi Solareign! I'd like to get a free solar quote for my home/business." },
    { label: '"Hello! I am inquiring about solar pricing..."', query: "Hello! I am inquiring about solar pricing and packages." },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToViberBottom = () => {
    viberMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMessengerBottom = () => {
    messengerMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isChatOpen, messages]);

  useEffect(() => {
    if (isViberOpen) {
      scrollToViberBottom();
      setTimeout(() => {
        viberInputRef.current?.focus();
      }, 200);
    }
  }, [isViberOpen, viberMessages]);

  useEffect(() => {
    if (isMessengerOpen) {
      scrollToMessengerBottom();
      setTimeout(() => {
        messengerInputRef.current?.focus();
      }, 200);
    }
  }, [isMessengerOpen, messengerMessages]);

  const handleToggleWidget = () => {
    setIsExpanded(prev => {
      const next = !prev;
      if (!next) {
        setActiveModal(null);
      }
      return next;
    });
    setUnreadCount(0);
    setShowCallout(false);
  };

  const handleCloseAll = () => {
    setIsExpanded(false);
    setActiveModal(null);
  };

  const handleBackToOptions = () => {
    setActiveModal(null);
    setIsExpanded(true);
  };

  const showChannelOptions = isExpanded && !activeModal;

  const handleToggleChatWindow = () => {
    setActiveModal(prev => prev === 'ai' ? null : 'ai');
  };

  const handleToggleViberWindow = () => {
    setActiveModal(prev => prev === 'viber' ? null : 'viber');
  };

  const handleToggleMessengerWindow = () => {
    setActiveModal(prev => prev === 'messenger' ? null : 'messenger');
  };

  const handleMessengerStarterClick = (query: string) => {
    setMessengerInputValue(query);
    messengerInputRef.current?.focus();
  };

  const handleSendMessengerMessage = async (customText?: string) => {
    const content = (customText || messengerInputValue).trim();
    if (!content) return;

    const userMessage: Message = {
      id: `messenger-user-${Date.now()}`,
      sender: 'user',
      text: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Silently copy message to clipboard so it's ready to paste if needed
    await copyToClipboard(content);

    setMessengerMessages(prev => [...prev, userMessage]);
    setMessengerInputValue('');

    // Launch Messenger link with prefilled text parameter (Official Facebook m.me format)
    const messengerUrl = `https://m.me/1130073486862415?text=${encodeURIComponent(content)}`;
    try {
      window.open(messengerUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = messengerUrl;
    }
  };

  const handleMessengerKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessengerMessage();
    }
  };

  const handleResetMessenger = () => {
    setMessengerMessages(initialMessengerMessages);
    setMessengerInputValue('');
  };

  const handleViberStarterClick = (query: string) => {
    setViberInputValue(query);
    viberInputRef.current?.focus();
  };

  const handleSendViberMessage = async (customText?: string) => {
    const content = (customText || viberInputValue).trim();
    if (!content) return;

    const userMessage: Message = {
      id: `viber-user-${Date.now()}`,
      sender: 'user',
      text: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Silently copy message to clipboard so it's ready to paste if needed
    await copyToClipboard(content);

    setViberMessages(prev => [...prev, userMessage]);
    setViberInputValue('');

    // Launch Viber deep-link for 0908 145 4906 with draft text parameter
    const viberUrl = `viber://chat?number=%2B639081454906&draft=${encodeURIComponent(content)}`;
    try {
      window.location.href = viberUrl;
    } catch {
      window.open(`https://viber.me/639081454906?draft=${encodeURIComponent(content)}`, '_blank');
    }
  };

  const handleViberKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendViberMessage();
    }
  };

  const handleResetViber = () => {
    setViberMessages(initialViberMessages);
    setViberInputValue('');
  };

  const generateBotReply = (userText: string): { reply: string; action?: Message['action'] } => {
    const text = userText.toLowerCase();

    // 1. FAQ: How much can I save with solar?
    if (text.includes('save') || text.includes('saving') || text.includes('bill') || text.includes('cost') || text.includes('kw') || text.includes('price')) {
      return {
        reply: 'Installing solar in the Philippines reduces electric bills by up to 70% to 80% through daytime solar self-consumption and Meralco Net Metering export credits.\n\n• Bills around ₱5,000/mo: 3kW to 5kW system\n• Bills ₱10,000–₱20,000/mo: 8kW to 15kW array\n• Typical ROI is 3 to 4 years with 25+ years of guaranteed power generation.',
        action: {
          type: 'quote',
          label: 'Request Free Savings Sizing & Quotation'
        }
      };
    }

    // 2. FAQ: Inquire about Net Metering
    if (text.includes('net meter') || text.includes('meralco') || text.includes('erc') || text.includes('export') || text.includes('grid')) {
      return {
        reply: 'Solareign Solar Power Services provides 100% turnkey Meralco Net Metering processing!\n\nWe manage everything on your behalf:\n• Professional Electrical Engineer (PEE) signed and sealed single-line plans\n• Distribution Impact Study (DIS)\n• Certificate of Final Electrical Inspection (CFEI)\n• Bi-directional smart meter installation to earn automatic billing credits for surplus power.',
        action: {
          type: 'quote',
          label: 'Consult an Engineer on Net Metering'
        }
      };
    }

    // 3. FAQ: Request an Energy Audit
    if (text.includes('audit') || text.includes('site') || text.includes('survey') || text.includes('inspection') || text.includes('visit')) {
      return {
        reply: 'Our engineering team conducts complimentary on-site solar energy audits across Cavite, Metro Manila, and Region IV-A.\n\nDuring the audit, we assess:\n• 12-month electric utility kWh consumption history\n• Roof structural integrity & azimuth tilt\n• Shading analysis using solar path modeling\n• Main service entrance panel & cable routing',
        action: {
          type: 'quote',
          label: 'Book Complimentary Energy Audit'
        }
      };
    }

    // 4. FAQ: View Solar Array Specs
    if (text.includes('spec') || text.includes('array') || text.includes('panel') || text.includes('inverter') || text.includes('equipment') || text.includes('hardware')) {
      return {
        reply: 'Solareign Solar Power Services installs premium Tier-1 engineering equipment:\n\n• Solar Panels: N-Type TOPCon & Bifacial modules (580W+ each, >22.5% efficiency, 25-yr linear warranty)\n• Inverters: Smart Grid-Tie & Hybrid inverters (Huawei, Solis, Deye) with IP65 weather rating & rapid shutdown\n• Battery Storage: High-cycle LiFePO4 (Lithium Iron Phosphate) with 6,000+ cycle life\n• Mounting: Anodized marine-grade aluminum rails & 304 stainless fasteners.',
        action: {
          type: 'services',
          label: 'View Solar Engineering Services'
        }
      };
    }

    // Battery Backup Installation & UPS / Inverter Upgrades
    if (text.includes('battery') || text.includes('bess') || text.includes('ups') || text.includes('backup') || text.includes('hybrid') || text.includes('brownout') || text.includes('blackout')) {
      return {
        reply: 'Solareign specializes in Battery Backup Installation and Whole-Home UPS/Inverter Upgrades. Using high-cycle LiFePO4 batteries and intelligent smart hybrid inverters, our systems provide sub-10ms automatic switchover to keep your appliances, lights, and air conditioning running seamlessly during power outages.',
        action: {
          type: 'services',
          label: 'Explore Battery & UPS Services'
        }
      };
    }

    // Net Metering Application Assistance
    if (text.includes('net meter') || text.includes('meralco') || text.includes('sell') || text.includes('export') || text.includes('credit') || text.includes('metering')) {
      return {
        reply: 'Solareign provides turnkey Net Metering Application Assistance. We handle Distribution Utility / Meralco coordination, Single-Line Diagrams, Distribution Impact Studies (DIS), and bi-directional meter engineering so you can sell surplus solar power back to the grid for electric bill credits.',
        action: {
          type: 'services',
          label: 'Explore Net Metering Assistance'
        }
      };
    }

    // Panel Cleaning, Performance Monitoring & Diagnostics
    if (text.includes('clean') || text.includes('wash') || text.includes('diagnost') || text.includes('health') || text.includes('check') || text.includes('monitor') || text.includes('telemetry')) {
      return {
        reply: 'We provide comprehensive Panel Cleaning & Inspection (deionized water & thermal imaging), Performance Monitoring Setup (IoT cloud telemetry), and System Health Checks & Inverter Diagnostics (I-V curve tracing & Megger tests) compliant with PEC standards.',
        action: {
          type: 'services',
          label: 'Explore Maintenance & Diagnostics'
        }
      };
    }

    // Contact info
    if (text.includes('contact') || text.includes('phone') || text.includes('email') || text.includes('location') || text.includes('address') || text.includes('office') || text.includes('number')) {
      return {
        reply: 'You can reach our engineering office directly:\n• Phone / Viber: 0908 145 4906\n• Messenger ID: 1130073486862415\n• Email: solareignpower09@gmail.com\n• Main Hub: Bacoor City, Bacoor, Philippines, 4102\n• Hours: Mon - Sat: 8:00 AM - 5:00 PM',
        action: {
          type: 'call',
          label: 'Call / Viber 0908 145 4906 Now'
        }
      };
    }

    return {
      reply: 'Thank you for reaching out! Solareign offers 6 core services:\n1. Battery Backup Installation\n2. Whole-Home UPS/Inverter Upgrades\n3. Panel Cleaning & Inspection\n4. Performance Monitoring Setup\n5. System Health Checks & Inverter Diagnostics\n6. Net Metering Application Assistance\n\nWould you like a customized proposal or technical consultation?',
      action: {
        type: 'quote',
        label: 'Get Free Engineering Quote'
      }
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const messageContent = (textToSend || inputValue).trim();
    if (!messageContent) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const responseData = generateBotReply(messageContent);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: responseData.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: responseData.action
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleActionClick = (action: Message['action']) => {
    if (!action) return;
    if (action.type === 'quote') {
      setActiveModal(null);
      setIsExpanded(false);
      if (onOpenQuotation) {
        onOpenQuotation();
      } else {
        const contactSection = document.getElementById('contact') || document.getElementById('home');
        contactSection?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action.type === 'call') {
      const draftText = "Hi Solareign! I'm inquiring about solar solutions for my property.";
      copyToClipboard(draftText);
      const viberUrl = `viber://chat?number=%2B639081454906&draft=${encodeURIComponent(draftText)}`;
      try {
        window.location.href = viberUrl;
      } catch {
        window.open(`https://viber.me/639081454906?draft=${encodeURIComponent(draftText)}`, '_blank');
      }
    } else if (action.type === 'messenger') {
      const draftText = "Hi Solareign! I'm inquiring about solar solutions for my property.";
      copyToClipboard(draftText);
      const messengerUrl = `https://m.me/1130073486862415?text=${encodeURIComponent(draftText)}`;
      window.open(messengerUrl, '_blank', 'noopener,noreferrer');
    } else if (action.type === 'services') {
      setActiveModal(null);
      setIsExpanded(false);
      if (onNavigateServices) {
        onNavigateServices();
      } else {
        const servicesSection = document.getElementById('services');
        servicesSection?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
  };

  // Rolling motion physics: pitch distance between button centers
  // Desktop (sm): 56px button + 12px gap = 68px pitch
  // Mobile: 48px button + 8px gap = 56px pitch
  const pitch = isDesktop ? 68 : 56;

  // Ultra-smooth easing curves:
  // Decelerates fluidly to a stop when rolling left on open
  const easeOutRoll = [0.16, 1, 0.3, 1];
  // Smoothly accelerates into the launcher when rolling right on close
  const easeInRoll = [0.38, 0, 0.24, 1];

  const messengerVariants = {
    initial: { opacity: 0, x: pitch * 3, rotate: 360, scale: 0.85 },
    animate: { 
      opacity: 1, 
      x: 0, 
      rotate: 0, 
      scale: 1,
      transition: {
        duration: 0.42,
        ease: easeOutRoll,
        delay: 0, // leads the roll out to the left
      }
    },
    exit: { 
      opacity: 0, 
      x: pitch * 3, 
      rotate: 360, 
      scale: 0.85,
      transition: {
        duration: 0.32,
        ease: easeInRoll,
        delay: 0.04, // rolls back into corner right after Viber
      }
    }
  };

  const viberVariants = {
    initial: { opacity: 0, x: pitch * 2, rotate: 270, scale: 0.85 },
    animate: { 
      opacity: 1, 
      x: 0, 
      rotate: 0, 
      scale: 1,
      transition: {
        duration: 0.38,
        ease: easeOutRoll,
        delay: 0.02,
      }
    },
    exit: { 
      opacity: 0, 
      x: pitch * 2, 
      rotate: 270, 
      scale: 0.85,
      transition: {
        duration: 0.3,
        ease: easeInRoll,
        delay: 0.02,
      }
    }
  };

  const botVariants = {
    initial: { opacity: 0, x: pitch * 1, rotate: 180, scale: 0.85 },
    animate: { 
      opacity: 1, 
      x: 0, 
      rotate: 0, 
      scale: 1,
      transition: {
        duration: 0.35,
        ease: easeOutRoll,
        delay: 0.04,
      }
    },
    exit: { 
      opacity: 0, 
      x: pitch * 1, 
      rotate: 180, 
      scale: 0.85,
      transition: {
        duration: 0.28,
        ease: easeInRoll,
        delay: 0, // rolls into corner first
      }
    }
  };

  return (
    <div id="solareign-chatbot-container" className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end">
      
      {/* 1. Interactive Chatbot Window (Follows reference image structural flow and section placement) */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            id="solareign-chatbot-window"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-[92vw] sm:w-[390px] h-auto max-h-[550px] max-h-[82vh] mb-3 bg-white rounded-3xl shadow-2xl border-2 border-[#0F5A29] flex flex-col overflow-hidden text-left z-50 origin-bottom-right"
          >
            {/* Header: Dark Green with Robot Avatar, SOLAREIGN AI, ONLINE ASSISTANT, and Action Controls */}
            <div className="bg-[#072417] text-white px-5 py-4 flex items-center justify-between border-b border-emerald-950 shrink-0">
              <div className="flex items-center gap-3">
                {/* Robot Avatar with solid online indicator */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#041a10] border border-[#88D628]/40 flex items-center justify-center p-2">
                    <ChannelIcon
                      src={CHANNEL_ICON_DATA.chatbot.src}
                      fallbackSrc={CHANNEL_ICON_DATA.chatbot.fallbackSrc}
                      alt="Chatbot"
                      className="w-5 h-5 object-contain pointer-events-none"
                    />
                  </div>
                  {/* Status Indicator */}
                  <span 
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#22c55e] border-2 border-[#072417]" 
                    title="Online"
                  />
                </div>

                {/* Identity */}
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm sm:text-base tracking-wider text-white uppercase leading-tight">
                    SOLAREIGN AI
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#88D628] uppercase mt-0.5">
                    ONLINE ASSISTANT
                  </span>
                </div>
              </div>

              {/* Right Control Icons: Back to Options (⇄) and Close (✕) */}
              <div className="flex items-center gap-1.5 text-slate-300">
                <button
                  type="button"
                  onClick={handleBackToOptions}
                  title="Back to options"
                  className="p-1.5 hover:text-[#88D628] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  aria-label="Back to options"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCloseAll}
                  title="Close chat window"
                  className="p-1.5 hover:text-[#88D628] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close chat window"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Body Scroll Area */}
            <div className="flex-auto min-h-0 overflow-y-auto p-4 space-y-4 bg-[#FAFBFB]">
              
              {/* Messages Container */}
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {/* First Greeting Bubble matches reference image card layout */}
                  {index === 0 && msg.sender === 'bot' ? (
                    <div className="w-full bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs text-slate-800">
                      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-800 font-normal">
                        {msg.text}
                      </p>
                      <div className="text-[11px] text-slate-400 font-medium mt-3">
                        {msg.timestamp}
                      </div>
                    </div>
                  ) : (
                    /* Subsequent User & Bot Bubbles */
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#0F5A29] text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line font-normal">{msg.text}</p>

                      {msg.action && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => handleActionClick(msg.action)}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-[#0F5A29] hover:bg-[#0c4820] text-white hover:text-[#88D628] transition-all cursor-pointer shadow-sm group"
                          >
                            {msg.action.type === 'quote' && <Calculator className="w-3.5 h-3.5 text-[#88D628]" />}
                            {msg.action.type === 'call' && <Phone className="w-3.5 h-3.5 text-[#88D628]" />}
                            {msg.action.type === 'services' && <ArrowRight className="w-3.5 h-3.5 text-[#88D628] group-hover:translate-x-0.5 transition-transform" />}
                            <span>{msg.action.label}</span>
                          </button>
                        </div>
                      )}
                      
                      <div className={`text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-white/70 text-right' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  )}

                  {/* FREQUENTLY ASKED section placed directly below the initial greeting */}
                  {index === 0 && (
                    <div className="w-full mt-4">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2.5 px-0.5">
                        FREQUENTLY ASKED
                      </div>
                      <div className="space-y-2">
                        {frequentlyAsked.map((faq, fIdx) => (
                          <button
                            key={fIdx}
                            type="button"
                            onClick={() => handleSendMessage(faq.query)}
                            className="w-full text-left px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-emerald-50/40 hover:border-[#0F5A29] text-slate-800 hover:text-[#0F5A29] text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-[0.99] flex items-center justify-between cursor-pointer"
                          >
                            <span>{faq.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ))}

              {isTyping && (
                <div className="flex items-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0F5A29] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#0F5A29] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#88D628] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Area: Pill Input with "Type your message..." & Send Icon Button */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2.5 shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 text-sm bg-slate-100/70 border border-slate-200/80 rounded-2xl px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F5A29] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                aria-label="Send message"
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                  inputValue.trim()
                    ? 'bg-[#0F5A29] hover:bg-[#0c4820] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
              >
                <Send className="w-4 h-4 fill-current" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Viber Support Window (Follows Viber reference image structural flow and section placement) */}
        {isViberOpen && (
          <motion.div
            id="solareign-viber-window"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-[92vw] sm:w-[390px] h-auto max-h-[550px] max-h-[82vh] mb-3 bg-white rounded-3xl shadow-2xl border-2 border-[#7360F2] flex flex-col overflow-hidden text-left z-50 origin-bottom-right"
          >
            {/* Viber Header */}
            <div className="bg-[#7360F2] text-white px-5 py-4 flex items-center justify-between border-b border-[#6350e0] shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#5f4de0] border border-white/20 flex items-center justify-center shadow-xs p-1">
                    <ChannelIcon
                      src={CHANNEL_ICON_DATA.viber.src}
                      fallbackSrc={CHANNEL_ICON_DATA.viber.fallbackSrc}
                      alt="Viber"
                      className="w-[30px] h-[30px] object-contain pointer-events-none"
                    />
                  </div>
                  <span 
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#22c55e] border-2 border-[#7360F2]" 
                    title="Online"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="font-extrabold text-sm sm:text-base tracking-wider text-white uppercase leading-tight">
                    VIBER SUPPORT
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-white/90 uppercase mt-0.5">
                    VIBER CHAT
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-white/90">
                <button
                  type="button"
                  onClick={handleBackToOptions}
                  title="Back to options"
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  aria-label="Back to options"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCloseAll}
                  title="Close window"
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close window"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Viber Content Body */}
            <div className="flex-auto min-h-0 overflow-y-auto p-4 space-y-4 bg-[#FAFBFB]">
              {viberMessages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {/* First Card (Welcome to Solareign Viber! 👋) matches reference image */}
                  {index === 0 && msg.sender === 'bot' ? (
                    <div className="w-full bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs text-slate-800">
                      <div className="font-bold text-sm text-slate-900 mb-1.5 flex items-center gap-1.5">
                        <span>Welcome to Solareign Viber!</span>
                        <span>👋</span>
                      </div>
                      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 font-normal">
                        {msg.text}
                      </p>
                      <div className="text-[11px] text-slate-400 font-medium mt-3">
                        {msg.timestamp}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#7360F2] text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line font-normal">{msg.text}</p>
                      {msg.action && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleActionClick(msg.action)}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-[#7360F2] hover:bg-[#6350e0] text-white transition-all cursor-pointer shadow-sm"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{msg.action.label}</span>
                          </button>
                        </div>
                      )}

                      <div className={`text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-white/70 text-right' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  )}

                  {/* SUGGESTED STARTERS section placed directly below the initial greeting card */}
                  {index === 0 && (
                    <div className="w-full mt-4">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2.5 px-0.5">
                        SUGGESTED STARTERS:
                      </div>
                      <div className="space-y-2">
                        {viberStarters.map((starter, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleViberStarterClick(starter.query)}
                            className="w-full text-left px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-[#7360F2]/10 hover:border-[#7360F2] text-slate-800 hover:text-[#7360F2] text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-[0.99] flex items-center justify-between cursor-pointer"
                          >
                            <span>{starter.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isViberTyping && (
                <div className="flex items-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#7360F2] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#7360F2] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#7360F2] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={viberMessagesEndRef} />
            </div>

            {/* Bottom Input Area: Pill Input with "Type name, contact, inquiry..." & Send button with footer notice */}
            <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-1.5 shrink-0">
              <div className="flex items-center gap-2.5">
                <input
                  ref={viberInputRef}
                  type="text"
                  value={viberInputValue}
                  onChange={(e) => setViberInputValue(e.target.value)}
                  onKeyDown={handleViberKeyDown}
                  placeholder="Type name, contact, inquiry..."
                  className="flex-1 text-sm bg-slate-100/70 border border-slate-200/80 rounded-2xl px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#7360F2] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleSendViberMessage()}
                  disabled={!viberInputValue.trim()}
                  aria-label="Send message"
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    viberInputValue.trim()
                      ? 'bg-[#7360F2] hover:bg-[#6350e0] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <Send className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Messenger Support Window (Follows identical reference image structural flow and section placement as Viber) */}
        {isMessengerOpen && (
          <motion.div
            id="solareign-messenger-window"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-[92vw] sm:w-[390px] h-auto max-h-[550px] max-h-[82vh] mb-3 bg-white rounded-3xl shadow-2xl border-2 border-[#0084FF] flex flex-col overflow-hidden text-left z-50 origin-bottom-right"
          >
            {/* Messenger Header */}
            <div className="bg-[#0084FF] text-white px-5 py-4 flex items-center justify-between border-b border-[#0074e0] shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#0074e0] border border-white/20 flex items-center justify-center shadow-xs p-2">
                    <ChannelIcon
                      src={CHANNEL_ICON_DATA.messenger.src}
                      fallbackSrc={CHANNEL_ICON_DATA.messenger.fallbackSrc}
                      alt="Messenger"
                      className="w-5 h-5 object-contain pointer-events-none"
                    />
                  </div>
                  <span 
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#22c55e] border-2 border-[#0084FF]" 
                    title="Online"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="font-extrabold text-sm sm:text-base tracking-wider text-white uppercase leading-tight">
                    MESSENGER SUPPORT
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-white/90 uppercase mt-0.5">
                    MESSENGER CHAT
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-white/90">
                <button
                  type="button"
                  onClick={handleBackToOptions}
                  title="Back to options"
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  aria-label="Back to options"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCloseAll}
                  title="Close window"
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close window"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Messenger Content Body */}
            <div className="flex-auto min-h-0 overflow-y-auto p-4 space-y-4 bg-[#FAFBFB]">
              {messengerMessages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {/* First Card (Welcome to Solareign Messenger! 👋) matches reference image flow */}
                  {index === 0 && msg.sender === 'bot' ? (
                    <div className="w-full bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs text-slate-800">
                      <div className="font-bold text-sm text-slate-900 mb-1.5 flex items-center gap-1.5">
                        <span>Welcome to Solareign Messenger!</span>
                        <span>👋</span>
                      </div>
                      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 font-normal">
                        {msg.text}
                      </p>
                      <div className="text-[11px] text-slate-400 font-medium mt-3">
                        {msg.timestamp}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#0084FF] text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line font-normal">{msg.text}</p>
                      {msg.action && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleActionClick(msg.action)}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-[#0084FF] hover:bg-[#0074e0] text-white transition-all cursor-pointer shadow-sm"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{msg.action.label}</span>
                          </button>
                        </div>
                      )}

                      <div className={`text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-white/70 text-right' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  )}

                  {/* SUGGESTED STARTERS section placed directly below the initial greeting card */}
                  {index === 0 && (
                    <div className="w-full mt-4">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2.5 px-0.5">
                        SUGGESTED STARTERS:
                      </div>
                      <div className="space-y-2">
                        {messengerStarters.map((starter, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleMessengerStarterClick(starter.query)}
                            className="w-full text-left px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-[#0084FF]/10 hover:border-[#0084FF] text-slate-800 hover:text-[#0084FF] text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-[0.99] flex items-center justify-between cursor-pointer"
                          >
                            <span>{starter.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isMessengerTyping && (
                <div className="flex items-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0084FF] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#0084FF] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#0084FF] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messengerMessagesEndRef} />
            </div>

            {/* Bottom Input Area */}
            <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-1.5 shrink-0">
              <div className="flex items-center gap-2.5">
                <input
                  ref={messengerInputRef}
                  type="text"
                  value={messengerInputValue}
                  onChange={(e) => setMessengerInputValue(e.target.value)}
                  onKeyDown={handleMessengerKeyDown}
                  placeholder="Type name, contact, inquiry..."
                  className="flex-1 text-sm bg-slate-100/70 border border-slate-200/80 rounded-2xl px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleSendMessengerMessage()}
                  disabled={!messengerInputValue.trim()}
                  aria-label="Send message"
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    messengerInputValue.trim()
                      ? 'bg-[#0084FF] hover:bg-[#0074e0] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <Send className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Floating Multi-Channel Layout (Rolling Animation to Left on Open, Rolling to Right on Close) */}
      <div className="flex items-center gap-2 sm:gap-3 select-none">
        
        {/* Closed State: "CONTACT NOW" Speech Bubble Callout Pill */}
        <AnimatePresence>
          {!isExpanded && showCallout && (
            <motion.div 
              key="chatbot-callout-pill"
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              onClick={handleToggleWidget}
              className="group relative flex items-center cursor-pointer transition-transform duration-200 hover:scale-105 select-none"
              role="button"
              tabIndex={0}
              aria-label="Open contact options"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleToggleWidget(); }}
            >
              {/* Pill Container in Website Brand Style */}
              <div className="relative z-10 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white border-2 border-[#0F5A29] shadow-md flex items-center justify-center transition-all group-hover:bg-[#0F5A29]">
                <span className="text-xs sm:text-sm font-black font-mono tracking-wider text-[#0F5A29] group-hover:text-white uppercase whitespace-nowrap transition-colors">
                  CONTACT NOW
                </span>
              </div>

              {/* Seamless Speech Bubble Arrow Tail pointing Right toward the circular button */}
              <div 
                aria-hidden="true" 
                className="absolute -right-[7px] top-1/2 -translate-y-1/2 z-20 pointer-events-none"
              >
                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="0,1 7,7 0,13" fill="white" className="group-hover:fill-[#0F5A29] transition-colors" />
                  <path d="M0 1L7 7L0 13" stroke="#0F5A29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3 Channels: Messenger, Viber, AI Advisor (Direct children of AnimatePresence for smooth entry and exit rolls) */}
        <AnimatePresence>
          {showChannelOptions && (
            <motion.button
              key="chatbot-channel-messenger"
              type="button"
              id="chatbot-channel-messenger"
              variants={messengerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleToggleMessengerWindow}
              title="Connect via Messenger Support"
              aria-label="Connect via Messenger Support"
              className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-md transition-colors duration-200 cursor-pointer z-10 border-2 ${
                isMessengerOpen
                  ? 'bg-[#006bd1] border-white'
                  : 'bg-[#0084FF] hover:bg-[#0074e0] text-white border-white/80'
              }`}
            >
              <ChannelIcon
                src={CHANNEL_ICON_DATA.messenger.src}
                fallbackSrc={CHANNEL_ICON_DATA.messenger.fallbackSrc}
                alt={CHANNEL_ICON_DATA.messenger.alt}
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain pointer-events-none drop-shadow-xs select-none"
                fallbackSvg={
                  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 fill-white pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.54 3.12 7.37.16.15.26.37.26.6v2.21c0 .54.58.89 1.04.62l2.45-1.42c.16-.09.34-.13.53-.1.85.24 1.74.37 2.6.37 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.14 12.18l-2.58-2.75-5.04 2.75 5.54-5.88 2.65 2.75 4.97-2.75-5.54 5.88z"/>
                  </svg>
                }
              />
            </motion.button>
          )}

          {showChannelOptions && (
            <motion.button
              key="chatbot-channel-viber"
              type="button"
              id="chatbot-channel-viber"
              variants={viberVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleToggleViberWindow}
              title="Connect via Viber Support"
              aria-label="Connect via Viber Support"
              className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-md transition-colors duration-200 cursor-pointer z-10 border-2 ${
                isViberOpen
                  ? 'bg-[#5846d1] border-white'
                  : 'bg-[#7360F2] hover:bg-[#6552e0] text-white border-white/80'
              }`}
            >
              <ChannelIcon
                src={CHANNEL_ICON_DATA.viber.src}
                fallbackSrc={CHANNEL_ICON_DATA.viber.fallbackSrc}
                alt={CHANNEL_ICON_DATA.viber.alt}
                className="w-9 h-9 sm:w-[42px] sm:h-[42px] object-contain pointer-events-none drop-shadow-xs select-none"
                fallbackSvg={
                  <svg viewBox="0 0 24 24" className="w-9 h-9 sm:w-[42px] sm:h-[42px] fill-white pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.9 14.5c-.5-.4-1.6-.9-2.2-1.1-.6-.2-1-.2-1.4.3-.4.6-.8 1-1.1 1.2-.3.2-.6.2-1.1 0-.9-.4-1.8-.9-2.6-1.7-.8-.8-1.3-1.7-1.7-2.6-.2-.5-.2-.8 0-1.1.2-.3.6-.7 1.2-1.1.5-.4.5-.8.3-1.4-.2-.6-.7-1.7-1.1-2.2-.4-.5-.8-.5-1.2-.5-.4 0-.8.1-1.1.4-.7.6-1.2 1.4-1.2 2.4 0 1.5.7 3.3 2 4.9 1.6 2 3.4 3.1 5.3 3.6.5.1 1 .2 1.5.2 1.3 0 2.2-.6 2.8-1.3.3-.4.4-.8.4-1.2 0-.4 0-.8-.5-1.2z"/>
                    <path d="M15.5 3c2.9.4 5.2 2.7 5.6 5.6.1.6.6 1 1.1.9.6-.1 1-.6.9-1.1C22.6 4.7 19.4 1.5 15.6 1c-.6-.1-1.1.4-1.2.9-.1.6.4 1.1 1.1 1.1z"/>
                    <path d="M15 6c1.4.3 2.5 1.4 2.8 2.8.1.5.6.9 1.1.8.5-.1.9-.6.8-1.1-.5-2-2.1-3.6-4.1-4-.5-.1-1 .3-1.1.8-.1.6.3 1.1.8 1.2z"/>
                  </svg>
                }
              />
            </motion.button>
          )}

          {showChannelOptions && (
            <motion.button
              key="chatbot-channel-bot"
              type="button"
              id="chatbot-channel-bot"
              variants={botVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleToggleChatWindow}
              title="Talk with Solar AI Advisor"
              aria-label="Talk with Solar AI Advisor"
              className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-md transition-colors duration-200 cursor-pointer z-10 border-2 ${
                isChatOpen 
                  ? 'bg-[#082C1E] border-[#88D628]' 
                  : 'bg-[#0F5A29] hover:bg-[#0c4820] border-[#88D628]/80'
              }`}
            >
              <ChannelIcon
                src={CHANNEL_ICON_DATA.chatbot.src}
                fallbackSrc={CHANNEL_ICON_DATA.chatbot.fallbackSrc}
                alt={CHANNEL_ICON_DATA.chatbot.alt}
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain pointer-events-none drop-shadow-xs select-none"
                fallbackSvg={
                  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2v2.5M9.5 2h5" stroke="#88D628" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M6 7.5h12a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-5l-3 2.5v-2.5H6a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3z" fill="none" stroke="#88D628" strokeWidth="1.9" strokeLinejoin="round" />
                    <circle cx="9.5" cy="12" r="1.3" fill="#88D628" />
                    <circle cx="14.5" cy="12" r="1.3" fill="#88D628" />
                    <path d="M10 15c.6.6 2.4.6 3 0" fill="none" stroke="#88D628" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M2 11v4M22 11v4" stroke="#88D628" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                }
              />
            </motion.button>
          )}
        </AnimatePresence>

        {/* 4. Anchor / Toggle / Close Button */}
        <button
          type="button"
          id={isExpanded ? "chatbot-channel-close" : "solareign-chatbot-toggle-button"}
          onClick={handleToggleWidget}
          aria-label={isExpanded ? "Close options" : "Open contact channels"}
          title={isExpanded ? "Close options" : "Open contact channels"}
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0F5A29] hover:bg-[#0c4820] text-white flex items-center justify-center shadow-md transition-transform duration-200 active:scale-95 cursor-pointer z-20 group border-2 border-[#88D628]"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isExpanded ? (
              <motion.div
                key="icon-close"
                initial={{ rotate: -90, opacity: 0, scale: 0.75 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.75 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center pointer-events-none"
              >
                <X className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="icon-chat"
                initial={{ rotate: 90, opacity: 0, scale: 0.75 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.75 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center pointer-events-none"
              >
                <ChannelIcon
                  src={CHANNEL_ICON_DATA.chatbotWidget.src}
                  fallbackSrc={CHANNEL_ICON_DATA.chatbotWidget.fallbackSrc}
                  alt={CHANNEL_ICON_DATA.chatbotWidget.alt}
                  className="w-6 h-6 sm:w-7 sm:h-7 object-contain pointer-events-none drop-shadow-xs select-none"
                  fallbackSvg={<MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.2]" />}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!isExpanded && unreadCount > 0 && (
            <span 
              id="chatbot-unread-badge"
              className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#88D628] text-[#061810] font-black text-[11px] sm:text-xs flex items-center justify-center border-2 border-white shadow-sm"
            >
              {unreadCount}
            </span>
          )}
        </button>

      </div>
    </div>
  );
}

