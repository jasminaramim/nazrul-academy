import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { UpcomingEvent } from '../../../shared/types';
import { ImageUploader } from '../../../shared/components/ImageUploader';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  UserCheck,
  Eye,
  CheckCircle2,
  AlertTriangle,
  X,
  Megaphone,
} from 'lucide-react';

interface UpcomingEventsTabProps {
  upcomingEvents: UpcomingEvent[];
  editingUpcomingEvent: UpcomingEvent | null;
  setEditingUpcomingEvent: (event: UpcomingEvent | null) => void;
  flashMessage: (msg: string, isError?: boolean) => void;
  loadAllData: () => void;
  onPreviewEvent?: (event: UpcomingEvent) => void;
}

export const UpcomingEventsTab: React.FC<UpcomingEventsTabProps> = ({
  upcomingEvents,
  editingUpcomingEvent,
  setEditingUpcomingEvent,
  flashMessage,
  loadAllData,
  onPreviewEvent,
}) => {
  const [saving, setSaving] = useState(false);
  const [previewingEvent, setPreviewingEvent] = useState<UpcomingEvent | null>(null);

  const isEventPast = (event: UpcomingEvent) => {
    try {
      const d = event.dateTime ? new Date(event.dateTime) : new Date(event.eventDate);
      return !isNaN(d.getTime()) && d.getTime() < Date.now();
    } catch {
      return false;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUpcomingEvent) return;

    if (!editingUpcomingEvent.title?.trim()) {
      flashMessage('অনুষ্ঠানের নাম বা শিরোনাম আবশ্যক', true);
      return;
    }
    if (!editingUpcomingEvent.eventDate?.trim()) {
      flashMessage('অনুষ্ঠানের তারিখ নির্বাচন করুন', true);
      return;
    }
    if (!editingUpcomingEvent.location?.trim()) {
      flashMessage('অনুষ্ঠানের স্থান উল্লেখ করুন', true);
      return;
    }

    setSaving(true);
    try {
      if (editingUpcomingEvent.id) {
        await apiService.updateUpcomingEvent(editingUpcomingEvent.id, editingUpcomingEvent);
        flashMessage('আসন্ন অনুষ্ঠানের তথ্য সফলভাবে আপডেট করা হয়েছে');
      } else {
        const { id, ...rest } = editingUpcomingEvent;
        await apiService.addUpcomingEvent(rest as any);
        flashMessage('নতুন অনুষ্ঠান সফলভাবে যুক্ত করা হয়েছে');
      }
      setEditingUpcomingEvent(null);
      loadAllData();
    } catch (err: any) {
      flashMessage(err.message || 'সংরক্ষণ করতে ব্যর্থ হয়েছে', true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই অনুষ্ঠানটি ডিলিট করতে চান?')) return;
    try {
      await apiService.deleteUpcomingEvent(id);
      flashMessage('অনুষ্ঠান সফলভাবে ডিলিট করা হয়েছে');
      loadAllData();
    } catch (err: any) {
      flashMessage(err.message || 'ডিলিট করতে ব্যর্থ হয়েছে', true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-[#00732A]">
              <Megaphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">আসন্ন অনুষ্ঠান ও পোস্টার ব্যবস্থাপনা (Upcoming Events & Popup)</h3>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            পরবর্তী যেসকল অনুষ্ঠান বা কার্যক্রম অনুষ্ঠিত হবে তা এখানে যুক্ত করুন। নির্ধারিত তারিখ ও সময়ের পূর্বে যেকোনো ভিজিটর ওয়েবসাইটে প্রবেশ করলে এটি বড় পোস্টার পপআপ হিসেবে প্রদর্শিত হবে।
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingUpcomingEvent({
              id: '',
              title: '',
              eventDate: new Date().toISOString().split('T')[0],
              eventTime: 'সকাল ১০:০০ টা',
              location: 'ত্রিশাল সরকারি নজরুল একাডেমি কেন্দ্রীয় প্রাঙ্গণ, ত্রিশাল',
              details: '',
              image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
              chiefGuest: '',
              specialAttraction: '',
              isActive: true,
              showPopup: true,
            })
          }
          className="flex items-center gap-2 px-4 py-2.5 bg-[#00732A] text-white rounded-xl text-xs font-bold hover:bg-[#005c21] shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন অনুষ্ঠান / পোস্টার যোগ করুন</span>
        </button>
      </div>

      {/* Events List */}
      {upcomingEvents.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 space-y-3">
          <Calendar className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
          <p className="text-sm font-semibold">কোনো আসন্ন অনুষ্ঠান বা কার্যক্রম যুক্ত করা নেই।</p>
          <p className="text-xs text-slate-400">উপরের বাটন দিয়ে নতুন অনুষ্ঠানের পোস্টার যুক্ত করুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {upcomingEvents.map((event) => {
            const isPast = isEventPast(event);
            return (
              <div
                key={event.id}
                className={`bg-white rounded-3xl border overflow-hidden flex flex-col justify-between transition-all hover:shadow-md ${
                  isPast
                    ? 'border-slate-200 opacity-80'
                    : event.isActive
                    ? 'border-emerald-200 ring-1 ring-emerald-100'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Poster Image / Banner Preview */}
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden group">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400">
                        <Megaphone className="w-10 h-10 opacity-30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                    {/* Status Badges on Image */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 ${
                          isPast
                            ? 'bg-slate-700/90 text-slate-200'
                            : event.isActive
                            ? 'bg-emerald-600/95 text-white'
                            : 'bg-red-600/95 text-white'
                        }`}
                      >
                        {isPast ? (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>সময় সমাপ্ত (Past)</span>
                          </>
                        ) : event.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>সক্রিয় (Active)</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            <span>বন্ধ (Inactive)</span>
                          </>
                        )}
                      </span>

                      {event.showPopup && !isPast && (
                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-500/95 text-white shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>পপআপ অন</span>
                        </span>
                      )}
                    </div>

                    {/* Date / Time on Image Bottom */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{event.eventDate}</span>
                        {event.eventTime && (
                          <>
                            <span className="opacity-60">•</span>
                            <Clock className="w-3.5 h-3.5" />
                            <span>{event.eventTime}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                      {event.title}
                    </h4>

                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span className="font-medium">{event.location}</span>
                    </div>

                    {event.chiefGuest && (
                      <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-2 text-xs text-blue-900">
                        <UserCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold text-blue-700 block">প্রধান অতিথি</span>
                          <span className="font-semibold">{event.chiefGuest}</span>
                        </div>
                      </div>
                    )}

                    {event.specialAttraction && (
                      <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-950">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold text-amber-800 block">বিশেষ আকর্ষণ</span>
                          <span className="font-semibold">{event.specialAttraction}</span>
                        </div>
                      </div>
                    )}

                    {event.details && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {event.details}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onPreviewEvent) onPreviewEvent(event);
                      else setPreviewingEvent(event);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>পোস্টার প্রিভিউ</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingUpcomingEvent(event)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors"
                      title="সম্পাদনা করুন"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
                      title="ডিলিট করুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {editingUpcomingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-[#00732A]">
                  <Megaphone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingUpcomingEvent.id ? 'অনুষ্ঠানের তথ্য সম্পাদনা' : 'নতুন অনুষ্ঠান / পোস্টার যোগ করুন'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingUpcomingEvent(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  অনুষ্ঠানের নাম বা শিরোনাম (কি ইভেন্ট) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ঐতিহাসিক শতবর্ষ পূর্তি ও মহা পুনর্মিলনী উৎসব ২০২৬"
                  value={editingUpcomingEvent.title || ''}
                  onChange={(e) =>
                    setEditingUpcomingEvent({ ...editingUpcomingEvent, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    অনুষ্ঠানের তারিখ (Date) *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingUpcomingEvent.eventDate || ''}
                    onChange={(e) =>
                      setEditingUpcomingEvent({ ...editingUpcomingEvent, eventDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    অনুষ্ঠানের সময় (Time)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: সকাল ১০:০০ টা / 10:00 AM"
                    value={editingUpcomingEvent.eventTime || ''}
                    onChange={(e) =>
                      setEditingUpcomingEvent({ ...editingUpcomingEvent, eventTime: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  অনুষ্ঠানের স্থান (Location) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ত্রিশাল সরকারি নজরুল একাডেমি কেন্দ্রীয় প্রাঙ্গণ, ত্রিশাল"
                  value={editingUpcomingEvent.location || ''}
                  onChange={(e) =>
                    setEditingUpcomingEvent({ ...editingUpcomingEvent, location: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>

              {/* Poster / Banner Image */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  পোস্টার বা ব্যানার ছবি (Poster Image)
                </label>
                <ImageUploader
                  value={editingUpcomingEvent.image || ''}
                  onChange={(url) => setEditingUpcomingEvent({ ...editingUpcomingEvent, image: url })}
                  label="পোস্টার বা ব্যানার আপলোড করুন"
                  placeholder="ছবি আপলোড বা সিলেক্ট করুন"
                  aspectRatio="banner"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    প্রধান অতিথি (Chief Guest - ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: মাননীয় সংস্কৃতি বিষয়ক উপদেষ্টা"
                    value={editingUpcomingEvent.chiefGuest || ''}
                    onChange={(e) =>
                      setEditingUpcomingEvent({ ...editingUpcomingEvent, chiefGuest: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    বিশেষ আকর্ষণ (Special Attraction - ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: দেশের স্বনামধন্য শিল্পীদের পরিবেশনা"
                    value={editingUpcomingEvent.specialAttraction || ''}
                    onChange={(e) =>
                      setEditingUpcomingEvent({
                        ...editingUpcomingEvent,
                        specialAttraction: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  বিস্তারিত বিবরণ (Details)
                </label>
                <textarea
                  rows={3}
                  placeholder="অনুষ্ঠানের বিস্তারিত বর্ণনা ও সূচি..."
                  value={editingUpcomingEvent.details || ''}
                  onChange={(e) =>
                    setEditingUpcomingEvent({ ...editingUpcomingEvent, details: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-slate-800">
                    অনুষ্ঠানটি সক্রিয় রাখুন (Is Active)
                  </span>
                  <input
                    type="checkbox"
                    checked={editingUpcomingEvent.isActive !== false}
                    onChange={(e) =>
                      setEditingUpcomingEvent({
                        ...editingUpcomingEvent,
                        isActive: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#00732A] rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer border-t border-slate-200/60 pt-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      ওয়েবসাইটে বড় পোস্টার পপআপ হিসেবে দেখান
                    </span>
                    <span className="text-[11px] text-slate-500">
                      ভিজিটররা ওয়েবসাইটে প্রবেশ করা মাত্র বড় পোস্টার ভেসে উঠবে
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingUpcomingEvent.showPopup !== false}
                    onChange={(e) =>
                      setEditingUpcomingEvent({
                        ...editingUpcomingEvent,
                        showPopup: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#00732A] rounded cursor-pointer"
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUpcomingEvent(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#00732A] hover:bg-[#005c21] rounded-xl shadow-md cursor-pointer disabled:opacity-60"
                >
                  {saving ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IN-TAB POSTER PREVIEW MODAL */}
      {previewingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 space-y-4">
            <div className="relative h-60 w-full bg-slate-950">
              {previewingEvent.image && (
                <img
                  src={previewingEvent.image}
                  alt={previewingEvent.title}
                  className="w-full h-full object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => setPreviewingEvent(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 pt-2 space-y-3">
              <h3 className="text-lg font-black text-slate-900">{previewingEvent.title}</h3>
              <div className="flex items-center gap-3 text-xs font-bold text-emerald-800">
                <span>📅 {previewingEvent.eventDate}</span>
                {previewingEvent.eventTime && <span>⏰ {previewingEvent.eventTime}</span>}
              </div>
              <p className="text-xs text-slate-600">{previewingEvent.location}</p>
              {previewingEvent.chiefGuest && (
                <p className="text-xs font-semibold text-blue-700">প্রধান অতিথি: {previewingEvent.chiefGuest}</p>
              )}
              {previewingEvent.specialAttraction && (
                <p className="text-xs font-semibold text-amber-700">বিশেষ আকর্ষণ: {previewingEvent.specialAttraction}</p>
              )}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewingEvent(null)}
                  className="w-full py-2.5 text-xs font-bold text-white bg-[#00732A] rounded-xl cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
