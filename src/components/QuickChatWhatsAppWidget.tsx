import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Check,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  RotateCcw,
  ExternalLink,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  User,
  Sparkles,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'desk' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  bookingSummary?: {
    refId: string;
    patientName: string;
    phone: string;
    serviceType: string;
    location: string;
    slot: string;
    specialist: string;
  };
}

interface QuickChatWhatsAppWidgetProps {
  onNavigateToPatientLogin?: () => void;
  onOpenBookingModal?: (data?: any) => void;
}

export const QuickChatWhatsAppWidget: React.FC<QuickChatWhatsAppWidgetProps> = ({
  onNavigateToPatientLogin,
  onOpenBookingModal
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasUnread, setHasUnread] = useState<boolean>(true);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Booking state collected through the simulated WhatsApp chat
  const [bookingState, setBookingState] = useState<{
    step: 'service' | 'condition' | 'location' | 'slot' | 'contact' | 'confirmed';
    serviceType?: string;
    condition?: string;
    location?: string;
    slot?: string;
    patientName?: string;
    phone?: string;
  }>({
    step: 'service'
  });

  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'desk',
      text: 'Namaskara! 🙏 Welcome to Sahakar Physio & Elder Care, Sahakarnagar.\n\nI am Pooja from the front desk. How can we assist you or your family member today?',
      timestamp: 'Just now',
      quickReplies: [
        '🏡 Elder Home Visit (Sahakarnagar)',
        '🏥 Clinic Consultation (60ft Rd)',
        '🦵 Post-Op Knee/Hip Rehab (TKR)',
        '💻 Techie Spine & Posture Care'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setShowTooltip(false);
    }
  }, [isOpen, messages, isTyping]);

  // Handle user selecting a quick reply or sending custom text
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: getFormattedTime()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Process state machine based on current step
    setTimeout(() => {
      processNextDeskStep(text);
      setIsTyping(false);
    }, 750);
  };

  const processNextDeskStep = (userReply: string) => {
    const replyLower = userReply.toLowerCase();
    const timeNow = getFormattedTime();

    if (bookingState.step === 'service') {
      let detectedService = userReply;
      setBookingState(prev => ({
        ...prev,
        step: 'condition',
        serviceType: detectedService
      }));

      const isHome = replyLower.includes('home') || replyLower.includes('elder');

      setMessages(prev => [
        ...prev,
        {
          id: `desk-${Date.now()}`,
          sender: 'desk',
          text: isHome
            ? 'Excellent! For Elder Home Visits in Sahakarnagar, our senior physiotherapists arrive with complete electrotherapy, mobility aids, and vitals check (BP, SpO2).\n\nWhat is the primary condition or symptom?'
            : 'Noted! For our 60ft Road Clinic consultations, what is the primary diagnosis or symptom we should evaluate?',
          timestamp: timeNow,
          quickReplies: isHome
            ? [
                'Post-Op Knee Replacement (TKR)',
                'Elder Balance & Fall Prevention',
                'Stroke Gait Retraining',
                'Severe Back & Hip Arthritis'
              ]
            : [
                'Neck & Lumbar Disc / Techie Spine',
                'Frozen Shoulder / Sports Injury',
                'Post-Surgery Knee/Hip Assessment',
                'General Mobility & Pain Check'
              ]
        }
      ]);
    } else if (bookingState.step === 'condition') {
      setBookingState(prev => ({
        ...prev,
        step: 'location',
        condition: userReply
      }));

      setMessages(prev => [
        ...prev,
        {
          id: `desk-${Date.now()}`,
          sender: 'desk',
          text: 'Got it. Which society or locality in Sahakarnagar / North Bangalore should we schedule this for?',
          timestamp: timeNow,
          quickReplies: [
            'CQAL Layout / 60ft Rd Central',
            'Judicial Layout / Telecom Colony',
            'Alpine Pyramid / Raintree Boulevard',
            'Tata Nagar / Kodigehalli Enclave',
            'Godrej Platinum / Hebbal Corridor',
            'At Sahakar Clinic (60ft Rd Centre)'
          ]
        }
      ]);
    } else if (bookingState.step === 'location') {
      setBookingState(prev => ({
        ...prev,
        step: 'slot',
        location: userReply
      }));

      setMessages(prev => [
        ...prev,
        {
          id: `desk-${Date.now()}`,
          sender: 'desk',
          text: 'Understood. When would you prefer the physiotherapist session?',
          timestamp: timeNow,
          quickReplies: [
            'Morning: 09:00 AM - 12:00 PM',
            'Afternoon Home Slot: 01:30 PM - 04:30 PM',
            'Evening: 05:00 PM - 08:30 PM',
            'Earliest Available Slot'
          ]
        }
      ]);
    } else if (bookingState.step === 'slot') {
      setBookingState(prev => ({
        ...prev,
        step: 'contact',
        slot: userReply
      }));

      setMessages(prev => [
        ...prev,
        {
          id: `desk-${Date.now()}`,
          sender: 'desk',
          text: 'Almost set! Could you please share the Patient Name and WhatsApp Phone Number to confirm your slot?',
          timestamp: timeNow,
          quickReplies: [
            'Use Demo: Suryanarayana Rao, 98450 21980',
            'Use Demo: Ananya Deshmukh, 98450 44210'
          ]
        }
      ]);
    } else if (bookingState.step === 'contact' || bookingState.step === 'confirmed') {
      let pName = 'Patient Guest';
      let pPhone = '+91 98450 21980';

      if (userReply.includes('Suryanarayana')) {
        pName = 'Suryanarayana Rao (72y)';
        pPhone = '+91 98450 21980';
      } else if (userReply.includes('Ananya')) {
        pName = 'Ananya Deshmukh (34y)';
        pPhone = '+91 98450 44210';
      } else {
        pName = userReply.split(',')[0]?.trim() || userReply;
      }

      const refId = `SHK-WA-${Math.floor(1000 + Math.random() * 9000)}`;
      const assignedPhysio =
        (bookingState.serviceType || '').includes('Home') || (bookingState.serviceType || '').includes('Elder')
          ? 'Dr. Rajesh Kumar, BPT (Senior Home Care Specialist)'
          : 'Dr. Anita Rao, MPT (Lead Clinical Specialist)';

      setBookingState(prev => ({
        ...prev,
        step: 'confirmed',
        patientName: pName,
        phone: pPhone
      }));

      setMessages(prev => [
        ...prev,
        {
          id: `desk-${Date.now()}`,
          sender: 'desk',
          text: `🎉 Appointment Successfully Slotted! Here is your booking confirmation:`,
          timestamp: timeNow,
          bookingSummary: {
            refId: refId,
            patientName: pName,
            phone: pPhone,
            serviceType: bookingState.serviceType || 'Elder Home Care',
            location: bookingState.location || 'Sahakarnagar Area',
            slot: bookingState.slot || 'Afternoon Slot (01:30 - 04:30 PM)',
            specialist: assignedPhysio
          }
        }
      ]);
    }
  };

  const handleResetChat = () => {
    setBookingState({ step: 'service' });
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'desk',
        text: 'Namaskara! 🙏 How can we help you or your family member at Sahakar Physio today?',
        timestamp: getFormattedTime(),
        quickReplies: [
          '🏡 Elder Home Visit (Sahakarnagar)',
          '🏥 Clinic Consultation (60ft Rd)',
          '🦵 Post-Op Knee/Hip Rehab (TKR)',
          '💻 Techie Spine & Posture Care'
        ]
      }
    ]);
  };

  const buildOfficialWhatsAppUrl = (summary?: any) => {
    const text = summary
      ? `Hello Sahakar Physio! I booked appointment Ref #${summary.refId} for ${summary.patientName} (${summary.serviceType} at ${summary.location}, ${summary.slot}). Please confirm availability.`
      : `Hello Sahakar Physio & Elder Care! I would like to inquire about booking a physiotherapy consultation in Sahakarnagar.`;
    return `https://wa.me/919845021980?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      {/* Floating Action Button (FAB) on Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {/* Tooltip hint on load */}
        {showTooltip && !isOpen && (
          <div className="mb-2 mr-1 animate-bounce max-w-[210px] p-2.5 rounded-2xl bg-stone-900 text-white text-[11px] shadow-xl border border-stone-700 relative">
            <div className="flex items-start justify-between">
              <span className="font-bold flex items-center text-emerald-400">
                <Sparkles className="w-3 h-3 mr-1" />
                Book via WhatsApp Chat
              </span>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-stone-400 hover:text-stone-200 cursor-pointer p-0.5 ml-1"
                aria-label="Dismiss tooltip"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-stone-300 text-[10px] mt-0.5 leading-tight">
              Instant guided booking for clinic & elder home visits in Sahakarnagar.
            </p>
            {/* Arrow tail */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-stone-900 border-r border-b border-stone-700 rotate-45" />
          </div>
        )}

        <button
          id="quick-chat-fab"
          onClick={() => setIsOpen(prev => !prev)}
          aria-label="Open WhatsApp Quick Chat"
          className="group relative flex items-center space-x-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-2xl hover:shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/20"
        >
          {/* Pulsing online glow ring */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white" />
          </span>

          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
          </div>

          <span className="tracking-tight">Quick Chat</span>

          {hasUnread && !isOpen && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Simulated WhatsApp Conversation Modal Window */}
      {isOpen && (
        <div
          id="whatsapp-chat-window"
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[580px] max-h-[85vh] bg-[#efeae2] dark:bg-[#0b141a] rounded-3xl shadow-2xl border border-stone-300 dark:border-stone-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="whatsapp-chat-title"
        >
          {/* WhatsApp Header */}
          <div className="px-4 py-3 bg-emerald-700 dark:bg-emerald-900 text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white text-emerald-800 flex items-center justify-center font-black text-sm shadow-xs border-2 border-emerald-400">
                  SP
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-800 rounded-full" />
              </div>

              <div>
                <h3 id="whatsapp-chat-title" className="text-sm font-black text-white leading-tight flex items-center">
                  Sahakar Physio Care Desk
                  <ShieldCheck className="w-3.5 h-3.5 ml-1 text-emerald-300" />
                </h3>
                <p className="text-[11px] text-emerald-100 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse inline-block mr-1" />
                  <span>Dr. Aditi & Pooja • Online</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-emerald-100">
              <button
                onClick={handleResetChat}
                title="Restart Chat"
                className="p-1.5 rounded-lg hover:bg-emerald-800/60 transition-colors cursor-pointer text-emerald-200"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 rounded-lg hover:bg-emerald-800/60 transition-colors cursor-pointer text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* WhatsApp Wallpaper Sub-banner */}
          <div className="bg-emerald-50/80 dark:bg-stone-900/90 px-3 py-1.5 text-[10px] text-stone-600 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
            <span className="flex items-center">
              <MapPin className="w-3 h-3 mr-1 text-emerald-600" />
              60ft Rd Clinic + Home Visits (PIN 560092)
            </span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              Avg reply: &lt; 1 min
            </span>
          </div>

          {/* WhatsApp Messages Scroll Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 text-xs select-text">
            {/* Encryption & Date pill */}
            <div className="flex flex-col items-center space-y-1.5 my-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/70 dark:bg-stone-800/80 text-[10px] font-bold text-stone-600 dark:text-stone-300 shadow-xs border border-stone-200/60 dark:border-stone-700/60">
                TODAY
              </span>
              <span className="text-[10px] text-stone-600 dark:text-stone-300 text-center max-w-[280px] bg-amber-50/80 dark:bg-amber-950/30 px-2 py-1 rounded-lg border border-amber-200/60 dark:border-amber-900/60">
                🔒 Verified WhatsApp Desk. Guided assistant for appointments & elder care dispatch.
              </span>
            </div>

            {/* Render conversation bubbles */}
            {messages.map(msg => {
              const isDesk = msg.sender === 'desk';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isDesk ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`relative max-w-[85%] sm:max-w-[80%] p-3 rounded-2xl shadow-xs text-xs leading-relaxed ${
                      isDesk
                        ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-tl-xs border border-stone-200/70 dark:border-stone-700'
                        : 'bg-[#d9fdd3] dark:bg-[#005c4b] text-stone-900 dark:text-emerald-50 rounded-tr-xs border border-emerald-200/60 dark:border-emerald-700/60'
                    }`}
                  >
                    {/* Message Body */}
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Booking Confirmation Card if present */}
                    {msg.bookingSummary && (
                      <div className="mt-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-stone-900/90 border border-emerald-300 dark:border-emerald-700 text-xs space-y-2">
                        <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-1.5">
                          <span className="font-black text-emerald-900 dark:text-emerald-200 text-xs flex items-center">
                            <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            Slot Reserved
                          </span>
                          <span className="font-mono text-[10px] font-bold bg-emerald-200/60 dark:bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-900 dark:text-emerald-300">
                            {msg.bookingSummary.refId}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                          <div>
                            <span className="text-stone-600 dark:text-stone-300 block text-[10px]">Patient:</span>
                            <span className="font-bold text-stone-900 dark:text-white">
                              {msg.bookingSummary.patientName}
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-600 dark:text-stone-300 block text-[10px]">Phone:</span>
                            <span className="font-bold text-stone-900 dark:text-white">
                              {msg.bookingSummary.phone}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-stone-600 dark:text-stone-300 block text-[10px]">Service & Area:</span>
                            <span className="font-bold text-stone-900 dark:text-white">
                              {msg.bookingSummary.serviceType} • {msg.bookingSummary.location}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-stone-600 dark:text-stone-300 block text-[10px]">Assigned Specialist:</span>
                            <span className="font-bold text-emerald-800 dark:text-emerald-300">
                              {msg.bookingSummary.specialist}
                            </span>
                          </div>
                        </div>

                        {/* Booking Card Action Buttons */}
                        <div className="pt-2 space-y-1.5">
                          <a
                            href={buildOfficialWhatsAppUrl(msg.bookingSummary)}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Continue to Official WhatsApp App</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>

                          {onNavigateToPatientLogin && (
                            <button
                              onClick={() => {
                                setIsOpen(false);
                                onNavigateToPatientLogin();
                              }}
                              className="w-full py-1.5 px-3 rounded-lg bg-white dark:bg-stone-800 hover:bg-stone-100 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-bold text-[11px] flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                            >
                              <span>View in Patient & Caregiver Portal</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Timestamp and Read Status */}
                    <div className="mt-1 flex items-center justify-end space-x-1 text-[9px] text-stone-600 dark:text-stone-300">
                      <span>{msg.timestamp}</span>
                      {!isDesk && <CheckCheck className="w-3 h-3 text-sky-500" />}
                    </div>
                  </div>

                  {/* Quick Reply Chips below Desk messages */}
                  {isDesk && msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                      {msg.quickReplies.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(chip)}
                          className="px-2.5 py-1.5 rounded-full bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[11px] font-semibold transition-all shadow-2xs hover:scale-[1.02] cursor-pointer text-left"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-1.5 p-2.5 rounded-2xl rounded-tl-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 w-24 shadow-xs">
                <span className="text-[10px] text-stone-600 dark:text-stone-300 font-medium">Typing</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp Footer / Input Bar */}
          <div className="p-2.5 bg-[#f0f2f5] dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center space-x-2 shrink-0">
            <div className="flex-1 flex items-center bg-white dark:bg-stone-800 rounded-full px-3 py-1.5 border border-stone-200 dark:border-stone-700 focus-within:border-emerald-500">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message or query..."
                className="flex-1 bg-transparent text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden"
              />
            </div>

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                inputValue.trim()
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
