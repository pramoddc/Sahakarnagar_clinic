import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Users,
  ShieldCheck,
  Sparkles,
  Camera,
  Info,
  ArrowRight,
  Phone
} from 'lucide-react';

interface MobileQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPatientLogin?: () => void;
}

export const MobileQrModal: React.FC<MobileQrModalProps> = ({
  isOpen,
  onClose,
  onNavigateToPatientLogin
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string>('default');
  const [customInput, setCustomInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [qrColor, setQrColor] = useState<'teal' | 'stone'>('teal');

  // Compute origin safely
  const [baseUrl, setBaseUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      setBaseUrl(`${origin}${pathname}`);
    }
  }, []);

  // Compute final dynamic link
  const getDynamicUrl = (): string => {
    if (!baseUrl) return 'https://sahakarphysio.com/?section=patient';
    
    const url = new URL(baseUrl);
    url.searchParams.set('section', 'patient');

    if (selectedTarget === 'pt-001') {
      url.searchParams.set('patientId', 'pt-001');
    } else if (selectedTarget === 'pt-002') {
      url.searchParams.set('patientId', 'pt-002');
    } else if (selectedTarget === 'pt-003') {
      url.searchParams.set('patientId', 'pt-003');
    } else if (selectedTarget === 'pt-004') {
      url.searchParams.set('patientId', 'pt-004');
    } else if (selectedTarget === 'custom' && customInput.trim()) {
      url.searchParams.set('patientId', customInput.trim().toLowerCase());
    }

    return url.toString();
  };

  const dynamicUrl = getDynamicUrl();

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(dynamicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenNewTab = () => {
    window.open(dynamicUrl, '_blank', 'noopener,noreferrer');
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Hello! Access your Sahakar Physio & Elder Care Patient Portal here:\n${dynamicUrl}`
  )}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 id="qr-modal-title" className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
                  Open Patient Portal on Mobile
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Dynamic QR
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Scan with any smartphone camera to review sessions, exercises, and digital receipts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Target Profile Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 block">
              Choose Target Destination for QR Code:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTarget('default')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedTarget === 'default'
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Standard Patient Login</span>
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">OTP Screen</span>
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Allows any registered patient or family caregiver to sign in.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTarget('pt-001')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedTarget === 'pt-001'
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Suryanarayana Rao (72y)</span>
                  <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-400">Post-Op TKR</span>
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Direct demo bypass: 14/20 Home-Care sessions & exercises.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTarget('pt-002')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedTarget === 'pt-002'
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Ananya Deshmukh (34y)</span>
                  <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-400">Spine Techie</span>
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Direct demo bypass: Clinic bay ergonomic rehab.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTarget('pt-003')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedTarget === 'pt-003'
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Rukminiamma S. (81y)</span>
                  <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-400">Elder Mobility</span>
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Direct demo bypass: Geriatric fall prevention program.
                </div>
              </button>
            </div>
          </div>

          {/* QR Display & Instructions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* QR Code Container */}
            <div className="md:col-span-6 flex flex-col items-center justify-center p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 shadow-xs">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-stone-100">
                <QRCodeSVG
                  value={dynamicUrl}
                  size={190}
                  level="M"
                  includeMargin={true}
                  fgColor={qrColor === 'teal' ? '#0f766e' : '#1c1917'}
                  bgColor="#ffffff"
                />
              </div>

              {/* QR Tone Switcher */}
              <div className="flex items-center space-x-2 mt-3 text-[11px] text-stone-500 dark:text-stone-400">
                <span>Color Tone:</span>
                <button
                  type="button"
                  onClick={() => setQrColor('teal')}
                  className={`px-2 py-0.5 rounded-md font-bold cursor-pointer transition-colors ${
                    qrColor === 'teal' ? 'bg-teal-700 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  Clinical Teal
                </button>
                <button
                  type="button"
                  onClick={() => setQrColor('stone')}
                  className={`px-2 py-0.5 rounded-md font-bold cursor-pointer transition-colors ${
                    qrColor === 'stone' ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  High Contrast
                </button>
              </div>

              <div className="mt-2 text-center">
                <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 inline-flex items-center">
                  <Camera className="w-3.5 h-3.5 mr-1 text-teal-600 dark:text-teal-400" />
                  Point phone camera at this QR code
                </span>
              </div>
            </div>

            {/* Scanning Info & Quick Links */}
            <div className="md:col-span-6 space-y-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 space-y-1">
                <div className="font-bold text-teal-900 dark:text-teal-200 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-teal-600 dark:text-teal-400" />
                  Instant Camera Launch (No App Install Required)
                </div>
                <p className="text-teal-800 dark:text-teal-300 leading-relaxed text-[11px]">
                  Compatible with iPhone Camera and Android Google Lens. Opens the PWA-ready responsive portal seamlessly on Chrome, Safari, or Samsung Internet.
                </p>
              </div>

              {/* Dynamic URL display */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                  Encoded Mobile Link
                </label>
                <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-[11px] text-stone-700 dark:text-stone-300 break-all select-all flex items-center justify-between gap-2">
                  <span className="truncate">{dynamicUrl}</span>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-white dark:bg-stone-700 hover:bg-stone-200 text-stone-700 dark:text-stone-200 shrink-0 cursor-pointer transition-colors"
                    title="Copy URL"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                    <span>{copied ? 'Link Copied!' : 'Copy Mobile Link'}</span>
                  </button>

                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Send on WhatsApp</span>
                  </a>
                </div>

                <button
                  onClick={handleOpenNewTab}
                  className="w-full py-2.5 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Mobile Portal in New Tab</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Footer Notice */}
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 gap-2">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Patient records are encrypted and protected by DISHA guidelines.</span>
            </div>
            {onNavigateToPatientLogin && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToPatientLogin();
                }}
                className="text-amber-700 dark:text-amber-400 hover:underline font-bold cursor-pointer"
              >
                Switch to Patient Portal on this device →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
