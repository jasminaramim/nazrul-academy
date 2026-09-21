import React, { useState, useEffect } from 'react';
import { UpcomingEvent } from '../../shared/types';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  UserCheck,
  X,
  ArrowRight,
  Heart,
  Megaphone,
  CheckCircle2,
} from 'lucide-react';

interface UpcomingEventModalProps {
  event: UpcomingEvent | null;
  isOpen?: boolean;
  onNavigate: (page: string) => void;
  onClose?: () => void;
}

export const UpcomingEventModal: React.FC<UpcomingEventModalProps> = ({
  event,
  isOpen: externalIsOpen,
  onNavigate,
  onClose,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Check if event is valid and in the future
  useEffect(() => {
    if (!event || event.isActive === false || event.showPopup === false) {
      setInternalIsOpen(false);
      return;
    }

    try {
      const eventTargetDate = event.dateTime ? new Date(event.dateTime) : new Date(event.eventDate);
      const isFuture = !isNaN(eventTargetDate.getTime()) && eventTargetDate.getTime() > Date.now();

      // Check session storage to avoid spamming the user in the same session if they dismissed it
      const isDismissed = sessionStorage.getItem(`dismissed_event_poster_${event.id}`);

      if (isFuture && !isDismissed && externalIsOpen === undefined) {
        // Small delay on first page load for smooth entry transition
        const timer = setTimeout(() => {
          setInternalIsOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      setInternalIsOpen(false);
    }
  }, [event, externalIsOpen]);

  // Live countdown timer
  useEffect(() => {
    if (!event) return;

    const calculateTimeLeft = () => {
      try {
        const target = event.dateTime ? new Date(event.dateTime) : new Date(event.eventDate);
        const diff = target.getTime() - Date.now();

        if (diff <= 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } catch {
        // fallback
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [event]);

  if (!isOpen || !event) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(`dismissed_event_poster_${event.id}`, 'true');
    setInternalIsOpen(false);
    if (onClose) onClose();
  };

  const handleGoToRegister = () => {
    sessionStorage.setItem(`dismissed_event_poster_${event.id}`, 'true');
    setInternalIsOpen(false);
    if (onClose) onClose();
    onNavigate('register');
  };

  const handleGoToDonate = () => {
    sessionStorage.setItem(`dismissed_event_poster_${event.id}`, 'true');
    setInternalIsOpen(false);
    if (onClose) onClose();
    onNavigate('donate');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-300 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer backdrop-blur-xs"
          title="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Poster Top Banner / Visual */}
        <div className="relative h-48 sm:h-72 w-full bg-slate-950 shrink-0 overflow-hidden">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#00732A] via-[#005c21] to-[#CA0000] text-white p-6 text-center">
              <Megaphone className="w-12 h-12 mb-2 text-white/80 animate-bounce" />
              <h2 className="text-xl font-black">{event.title}</h2>
            </div>
          )}

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top Tag */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-600/95 text-white shadow-lg uppercase tracking-wider backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>আসন্ন বিশেষ অনুষ্ঠান</span>
            </span>
          </div>

          {/* Countdown Timer Overlay on Poster Bottom */}
          <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-4">
            <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/15 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-1.5 text-white text-xs font-bold pl-1">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">অনুষ্ঠান শুরু হতে বাকি:</span>
                <span className="sm:hidden">কাউন্টডাউন:</span>
              </div>

              <div className="flex items-center gap-2 text-center text-white">
                <div className="bg-white/10 px-2 py-1 rounded-lg min-w-[42px]">
                  <span className="font-mono text-sm sm:text-base font-black text-amber-400 block leading-tight">
                    {timeLeft.days}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-300">দিন</span>
                </div>
                <span className="font-bold text-amber-400">:</span>
                <div className="bg-white/10 px-2 py-1 rounded-lg min-w-[42px]">
                  <span className="font-mono text-sm sm:text-base font-black text-amber-400 block leading-tight">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-300">ঘণ্টা</span>
                </div>
                <span className="font-bold text-amber-400">:</span>
                <div className="bg-white/10 px-2 py-1 rounded-lg min-w-[42px]">
                  <span className="font-mono text-sm sm:text-base font-black text-amber-400 block leading-tight">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-300">মিনিট</span>
                </div>
                <span className="font-bold text-amber-400">:</span>
                <div className="bg-white/10 px-2 py-1 rounded-lg min-w-[42px]">
                  <span className="font-mono text-sm sm:text-base font-black text-amber-400 block leading-tight">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-300">সেকেন্ড</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 flex-1">
          <div>
            <h3 className="text-[19px] sm:text-2xl font-black text-slate-900 leading-snug">
              {event.title}
            </h3>

            {/* Date & Location Badges */}
            <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-[#00732A] font-bold">
                <Calendar className="w-3.5 h-3.5" />
                <span>{event.eventDate}</span>
                {event.eventTime && (
                  <>
                    <span className="opacity-40">•</span>
                    <span>{event.eventTime}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Chief Guest and Special Attraction (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {event.chiefGuest && (
              <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-950">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-600 block tracking-wider">
                    প্রধান অতিথি
                  </span>
                  <span className="font-bold text-slate-900">{event.chiefGuest}</span>
                </div>
              </div>
            )}

            {event.specialAttraction && (
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-950">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-700 block tracking-wider">
                    বিশেষ আকর্ষণ
                  </span>
                  <span className="font-bold text-slate-900">{event.specialAttraction}</span>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          {event.details && (
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {event.details}
            </div>
          )}
        </div>

        {/* Footer Actions (নিবন্ধন করুন & অনুদান করুন) */}
        <div className="p-3.5 sm:p-5 bg-white border-t border-slate-100 shrink-0 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
          <div className="w-full flex sm:contents items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={handleGoToRegister}
              className="flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl text-[13px] sm:text-sm font-extrabold text-white bg-gradient-to-r from-[#00732A] to-[#005c21] hover:from-[#005c21] hover:to-[#004719] shadow-md shadow-emerald-900/20 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all scale-100 hover:scale-[1.02]"
            >
              <span>নিবন্ধন করুন</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              type="button"
              onClick={handleGoToDonate}
              className="flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl text-[13px] sm:text-sm font-extrabold text-white bg-gradient-to-r from-[#CA0000] to-[#a80000] hover:from-[#a80000] hover:to-[#880000] shadow-md shadow-red-900/20 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all scale-100 hover:scale-[1.02]"
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
              <span>অনুদান করুন</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="w-full sm:w-auto py-1.5 sm:py-2.5 px-4 text-xs font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
          >
            পরে দেখুন
          </button>
        </div>
      </div>
    </div>
  );
};
