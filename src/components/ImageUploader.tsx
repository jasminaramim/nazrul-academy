import React, { useState, useRef, DragEvent } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check, Loader2, Link, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label,
  placeholder = 'ছবি ড্রপ করুন অথবা সিলেক্ট করুন',
  aspectRatio = 'auto',
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputVal, setUrlInputVal] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square max-w-[200px]';
      case 'video':
        return 'aspect-video max-w-[400px]';
      case 'banner':
        return 'aspect-[21/9] max-w-[500px]';
      default:
        return 'min-h-[140px]';
    }
  };

  // Upload file handler (Cloudinary + direct client processing)
  const processAndUploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('ফাইলের আকার সর্বোচ্চ 10MB হতে পারে');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const base64Str = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      const res = await apiService.uploadImage(base64Str);
      
      if (res.success && res.url) {
        onChange(res.url);
        setUrlInputVal(res.url);
      } else {
        throw new Error(res.message || 'আপলোড ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      setError('ছবি আপলোড করতে সমস্যা হয়েছে: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAndUploadFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    onChange('');
    setUrlInputVal('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        {label && <label className="text-xs font-bold text-slate-700 block">{label}</label>}
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Link className="w-3 h-3" />
          <span>{showUrlInput ? 'ড্র্যাগ & ড্রপ মোড' : 'লিংক দিয়ে দিন'}</span>
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder="https://..."
            value={urlInputVal}
            onChange={(e) => {
              setUrlInputVal(e.target.value);
              onChange(e.target.value);
            }}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none bg-white"
          />
          {urlInputVal && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {value ? (
            /* Uploaded Image Preview Box */
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-50 group p-1">
              <div className={`w-full overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center ${getAspectClass()}`}>
                <img
                  src={value}
                  alt="Uploaded"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-2xl">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>পরিবর্তন</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>মুছুন</span>
                </button>
              </div>

              <div className="absolute bottom-2 right-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Check className="w-3 h-3" />
                <span>আপলোড সম্পন্ন</span>
              </div>
            </div>
          ) : (
            /* Drag and Drop Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                  : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50'
              } ${getAspectClass()}`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  <span className="text-xs font-bold text-slate-600">Cloudinary তে আপলোড হচ্ছে...</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{placeholder}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      ছবি টেনে আনুন (Drag & Drop) অথবা ক্লিক করে ফাইল সিলেক্ট করুন
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mt-1">
                    JPG, PNG, WebP (Cloudinary)
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
