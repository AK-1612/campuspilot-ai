/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Camera, Send, CheckCircle, MapPin, Droplet, MoreHorizontal, AlertCircle } from 'lucide-react';
import { HazardIssue } from '../types';
import { INITIAL_ISSUES } from '../data';
import { uploadToCloudinary } from '../services/api';

interface ReportIssueViewProps {
  onBackClick?: () => void;
  onSubmitSuccess?: (newIssue: HazardIssue) => void;
  initialLocation?: string;
}

const CATEGORIES = [
  { id: 'construction', label: 'Construction' },
  { id: 'lift', label: 'Lift Not Working' },
  { id: 'toilet', label: 'Accessible Toilet Closed' },
  { id: 'wet_floor', label: 'Wet Floor' },
  { id: 'door', label: 'Door Not Opening' },
  { id: 'other', label: 'Other' }
] as const;

// Custom custom SVG icons to match the high-fidelity screenshots
const ConstructionIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    <path d="M8.5 15.5l2-2" />
  </svg>
);

const LiftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 8h6" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
    <path d="M12 5v14" />
  </svg>
);

const WheelchairIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2.5" />
    <path d="M8 11h5l1.5 4.5h4.5" />
    <path d="M8.5 15.5a4 4 0 1 0 5 3.5" />
  </svg>
);

const DoorIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <circle cx="15" cy="12" r="1.5" />
  </svg>
);

export default function ReportIssueView({
  onBackClick,
  onSubmitSuccess,
  initialLocation = 'Engineering Block A — Corridor B'
}: ReportIssueViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [locationValue, setLocationValue] = useState(initialLocation);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [photoAttached, setPhotoAttached] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [photoFileOrData, setPhotoFileOrData] = useState<File | string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState(false);
  const [activeReports, setActiveReports] = useState<HazardIssue[]>(INITIAL_ISSUES);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
      const url = URL.createObjectURL(file);
      setPhotoPreviewUrl(url);
      setPhotoFileOrData(file);
      setPhotoAttached(true);
      setShowPhotoOptions(false);
    }
  };

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access API not supported in this environment');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setVideoStream(stream);
      setIsCameraActive(true);
      setShowPhotoOptions(false);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera access failed, falling back to manual upload:", err);
      // Fallback: trigger standard file upload
      fileInputRef.current?.click();
      setShowPhotoOptions(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && videoStream) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhotoPreviewUrl(dataUrl);
        setPhotoFileOrData(dataUrl);
        setPhotoAttached(true);
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setIsCameraActive(false);
  };

  React.useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);

  const renderCategoryIcon = (id: string, className: string) => {
    switch (id) {
      case 'construction':
        return <ConstructionIcon className={className} />;
      case 'lift':
        return <LiftIcon className={className} />;
      case 'toilet':
        return <WheelchairIcon className={className} />;
      case 'wet_floor':
        return <Droplet className={className} />;
      case 'door':
        return <DoorIcon className={className} />;
      case 'other':
        return <MoreHorizontal className={className} />;
      default:
        return <MoreHorizontal className={className} />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError(null);

    let imageUrl = undefined;
    try {
      if (photoAttached && photoFileOrData) {
        imageUrl = await uploadToCloudinary(photoFileOrData);
      }

      const matchedCategory = CATEGORIES.find(c => c.id === selectedCategory);
      const typeName = matchedCategory ? matchedCategory.label : 'Other issue';

      const newIssue: HazardIssue = {
        id: `issue-${Date.now()}`,
        type: (selectedCategory as any) || 'other',
        typeName,
        location: locationValue || 'Campus Walkway',
        details: additionalDetails || 'No details specified',
        photoAttached,
        photoUrl: imageUrl,
        timestamp: new Date().toISOString(),
        isCustom: true
      };

      setSubmissionFeedback(true);
      setActiveReports(prev => [newIssue, ...prev]);

      setTimeout(() => {
        setSubmissionFeedback(false);
        setSelectedCategory('');
        setAdditionalDetails('');
        setPhotoAttached(false);
        setPhotoPreviewUrl(null);
        setPhotoFileOrData(null);
        if (onSubmitSuccess) {
          onSubmitSuccess(newIssue);
        }
      }, 2500);
    } catch (err: any) {
      console.error('Cloudinary upload failed', err);
      setUploadError(err.message || 'Failed to upload photo. Please check your config.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-6 pt-6 pb-[100px] font-sans antialiased bg-white">
      {/* Top bar with back option if present */}
      <div className="flex items-center gap-3 mb-6">
        {onBackClick && (
          <button
            aria-label="Go back"
            onClick={onBackClick}
            className="p-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-full transition-all shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-2xl font-bold font-sans tracking-tight text-[#002f5c]">
          Report an Issue
        </h1>
      </div>

      {submissionFeedback && (
        <div className="mb-6 bg-teal-50 border border-teal-500/20 rounded-2xl p-4 flex items-start gap-3 shadow-sm animate-pulse">
          <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-teal-800">Report Submitted</h4>
            <p className="text-xs text-teal-700/80 mt-1">
              Thank you! Facility staff has been alerted. This hazard issue is now integrated into real-time routing engines.
            </p>
          </div>
        </div>
      )}

      <p className="font-sans text-sm font-medium text-zinc-500 mb-5 text-left">
        What type of issue are you reporting?
      </p>

      {/* Grid of issues */}
      <div className="grid grid-cols-2 gap-4 mb-6" id="issue-grid">
        {CATEGORIES.map(category => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex flex-col items-center justify-center p-4 bg-white border rounded-2xl min-h-[112px] transition-all duration-200 hover:bg-zinc-50 active:scale-95 text-left ${
                isSelected
                  ? 'border-[#002f5c] bg-blue-50/20 shadow-md scale-[1.01]'
                  : 'border-zinc-200'
              }`}
              type="button"
            >
              <span className="mb-2">
                {renderCategoryIcon(category.id, "w-8 h-8 text-[#002f5c]")}
              </span>
              <span className="font-sans font-bold text-xs text-[#002f5c] text-center">
                {category.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Details Form Card */}
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm text-left">
        {/* Location Row */}
        <div className="space-y-2">
          <label className="font-sans font-bold text-sm text-[#002f5c] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-zinc-450" />
            Location
          </label>
          <div className="relative bg-[#f8f5ff] rounded-xl px-1 border-b-2 border-indigo-100">
            <input
              type="text"
              value={locationValue}
              onChange={(e) => setLocationValue(e.target.value)}
              className="w-full bg-transparent border-0 focus:ring-0 font-sans text-sm font-semibold text-zinc-800 px-3 py-2.5 transition-colors focus:outline-none"
              placeholder="e.g. Science Library Corridor B"
            />
          </div>
        </div>

        {/* Additional details */}
        <div className="space-y-2">
          <label htmlFor="details" className="font-sans font-bold text-sm text-[#002f5c]">
            Additional Details
          </label>
          <textarea
            id="details"
            rows={3}
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            className="w-full bg-[#fcfcff] border border-zinc-200 focus:border-[#002f5c] focus:ring-1 focus:ring-[#002f5c] rounded-xl font-sans text-sm p-3 transition-all resize-none text-zinc-800 focus:outline-none"
            placeholder="Add details..."
            required
          ></textarea>
        </div>

        {/* Hidden File input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Action / Photo Attach */}
        <div className="flex items-center gap-4 pt-3 border-t border-zinc-100">
          {photoAttached && photoPreviewUrl ? (
            <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-zinc-200 shrink-0 group">
              <img src={photoPreviewUrl} alt="Preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
                  setPhotoAttached(false);
                  setPhotoPreviewUrl(null);
                  setPhotoFileOrData(null);
                }}
                className="absolute inset-0 bg-black/60 hover:bg-black/80 flex items-center justify-center text-white text-[10px] font-bold transition-colors"
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPhotoOptions(true)}
              aria-label="Add photo"
              className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#e2dfff] text-[#002f5c] hover:bg-indigo-100 transition-colors active:scale-95"
            >
              <Camera className="w-5 h-5" />
            </button>
          )}
          <span className="font-sans text-xs text-zinc-500 font-medium text-left">
            {photoAttached ? '✓ Photo attached' : 'Add a photo to help us locate the issue.'}
          </span>
        </div>

        {/* Modal for Photo Options */}
        {showPhotoOptions && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-end justify-center">
            <div className="w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl animate-slide-up text-center">
              <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-6" />
              <h3 className="text-base font-extrabold text-[#002f5c] mb-6">Attach Photo</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex flex-col items-center justify-center p-5 bg-zinc-50 border border-zinc-200 rounded-2xl hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  <Camera className="w-8 h-8 text-[#002f5c] mb-2" />
                  <span className="text-xs font-bold text-[#002f5c]">Take Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-5 bg-zinc-50 border border-zinc-200 rounded-2xl hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  <svg className="w-8 h-8 text-[#002f5c] mb-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 12c0 .324.086.63.25.9a4.5 4.5 0 0 0-.25 2.1z" />
                  </svg>
                  <span className="text-xs font-bold text-[#002f5c]">Upload File</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowPhotoOptions(false)}
                className="w-full mt-5 h-12 bg-zinc-100 hover:bg-zinc-200 text-zinc-650 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Error Dialog Banner */}
        {uploadError && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 flex items-start gap-3 shadow-sm text-xs font-semibold mb-4">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!selectedCategory || isUploading}
          className="w-full h-14 bg-[#002f5c] disabled:bg-zinc-300 disabled:dark:bg-zinc-800 text-white disabled:text-zinc-500 font-sans font-bold rounded-full flex items-center justify-center gap-2 cursor-pointer hover:bg-[#002447] transition-all active:scale-[0.98] shadow-md mt-6"
        >
          <Send className="w-4 h-4 transform rotate-0" />
          {isUploading ? 'Uploading photo & submitting...' : 'Submit Report'}
        </button>
      </form>

      {/* Live Camera View Overlay */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col justify-between p-6 text-white text-center">
          <div className="pt-4 flex justify-between items-center w-full max-w-md mx-auto">
            <h3 className="text-xs font-extrabold tracking-widest uppercase">Camera Capture</h3>
            <button
              type="button"
              onClick={stopCamera}
              className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl bg-zinc-800"
            >
              Cancel
            </button>
          </div>
          
          <div className="relative flex-1 w-full max-w-md mx-auto rounded-3xl overflow-hidden bg-zinc-900 my-6 flex items-center justify-center border border-zinc-800">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Sight guide box overlay */}
            <div className="absolute inset-10 border-2 border-dashed border-white/20 rounded-2xl pointer-events-none" />
          </div>

          <div className="w-full max-w-md mx-auto pb-8">
            <button
              type="button"
              onClick={capturePhoto}
              className="w-20 h-20 bg-white border-8 border-zinc-350 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-transform mx-auto flex items-center justify-center shadow-lg"
            >
              <div className="w-10 h-10 bg-[#002f5c] rounded-full" />
            </button>
            <span className="text-xs text-zinc-400 font-bold mt-3 block">Tap capture button to save image</span>
          </div>
        </div>
      )}
    </div>
  );
}
