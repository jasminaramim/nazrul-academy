import React, { useState, useRef, DragEvent } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check, Loader2, Link, RefreshCw } from 'lucide-react';
import { apiService } from '../../shared/services/api';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto' | 'avatar';
  className?: string;
  acceptsVideo?: boolean;
  acceptsPdf?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label,
  placeholder = 'ছবি বা ভিডিও ড্রপ করুন অথবা সিলেক্ট করুন',
  aspectRatio = 'auto',
  className = '',
  acceptsVideo = false,
  acceptsPdf = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputVal, setUrlInputVal] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'avatar':
        return 'aspect-square w-32 h-32 sm:w-36 sm:h-36 mx-auto';
      case 'square':
        return 'aspect-square w-40 h-40 sm:w-48 sm:h-48 mx-auto';
      case 'video':
        return 'aspect-video max-w-[400px] w-full mx-auto';
      case 'banner':
        return 'aspect-[21/9] max-w-[500px] w-full mx-auto';
      default:
        return 'max-h-[200px] max-w-sm w-full mx-auto';
    }
  };

  // Upload file handler (Cloudinary + direct client processing)
  const processAndUploadFile = async (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isPdf = file.type === 'application/pdf';

    if (!isImage && !(acceptsVideo && isVideo) && !(acceptsPdf && isPdf)) {
      setError(`অনুগ্রহ করে একটি সঠিক ফাইল নির্বাচন করুন`);
      return;
    }

    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`ফাইলের আকার সর্বোচ্চ ${isVideo ? '50MB' : '10MB'} হতে পারে`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const base64Str = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 40)); // 40% for reading
          }
        };
        reader.onload = () => {
          setUploadProgress(40);
          resolve(reader.result as string);
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      const res = await apiService.uploadMediaWithProgress(base64Str, (percent) => {
        setUploadProgress(40 + Math.round(percent * 0.6)); // 60% for uploading
      });
      
      if (res.success && res.url) {
        onChange(res.url);
        setUrlInputVal(res.url);
      } else {
        throw new Error(res.message || 'আপলোড ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      setError('আপলোড করতে সমস্যা হয়েছে: ' + err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
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
            accept={acceptsPdf ? ".pdf,image/*" : acceptsVideo ? "video/*,image/*" : "image/*"}
            className="hidden"
            onChange={handleFileChange}
          />

          {value ? (
            /* Uploaded Image Preview Box */
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-50 group p-1 w-fit mx-auto shadow-sm">
              <div className={`overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center ${getAspectClass()}`}>
                {value.endsWith('.pdf') ? (
                  <div className="flex flex-col items-center justify-center p-4">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-2">
                      <span className="font-bold text-xl">PDF</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 max-w-[120px] truncate">{value.split('/').pop()}</span>
                  </div>
                ) : value.match(/\.(mp4|webm|mov)$/i) || value.includes('video/upload') ? (
                  <div className="relative w-full h-full bg-black flex items-center justify-center rounded-lg overflow-hidden">
                     <video src={value} className="w-full h-full object-contain" muted />
                     <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                        <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">ভিডিও</span>
                     </div>
                  </div>
                ) : (
                  <img
                    src={value}
                    alt="Uploaded"
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-2xl backdrop-blur-xs">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg bg-white/95 hover:bg-white text-slate-900 text-[11px] font-bold flex items-center gap-1 shadow-md cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>পরিবর্তন</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-md cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>মুছুন</span>
                </button>
              </div>

              <div className="absolute bottom-1.5 right-1.5 bg-emerald-700/90 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Check className="w-2.5 h-2.5" />
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
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                  : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50'
              } ${getAspectClass()}`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2 py-2 w-full max-w-[200px]">
                  <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
                  <span className="text-xs font-bold text-slate-600">
                    আপলোড হচ্ছে... {uploadProgress > 0 && `${uploadProgress}%`}
                  </span>
                  {uploadProgress > 0 && (
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300 ease-out" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ) : aspectRatio === 'avatar' ? (
                <div className="flex flex-col items-center justify-center p-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-700 leading-tight">
                    ছবি সিলেক্ট করুন
                  </p>
                  <span className="text-[9px] text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full mt-1 font-medium">
                    ড্রপ বা ক্লিক
                  </span>
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
                    {acceptsPdf ? 'PDF, JPG, PNG' : acceptsVideo ? 'MP4, JPG, PNG' : 'JPG, PNG, WebP'}
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
