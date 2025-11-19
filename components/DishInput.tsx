import React, { useRef } from 'react';

interface DishInputProps {
  onImageSelect: (file: File | null) => void;
  onDescriptionChange: (text: string) => void;
  onClear: () => void;
  imagePreviewUrl: string | null;
  description: string;
  isLoading: boolean;
  isGuest: boolean;
  onNavigateToRegister: () => void;
  imageFeaturesDisabled?: boolean;
}

const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const PhotoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ClearIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const LockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

export const DishInput: React.FC<DishInputProps> = ({ 
    onImageSelect, 
    onDescriptionChange,
    onClear, 
    imagePreviewUrl,
    description,
    isLoading,
    isGuest,
    onNavigateToRegister,
    imageFeaturesDisabled
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageSelect(event.target.files[0]);
    }
    event.target.value = '';
  };

  const handleClearImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onImageSelect(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">
                What are we cooking today?
            </h2>
            <p className="text-slate-600 text-lg">
                Snap a photo or describe a Filipino craving.
            </p>
        </div>

        <div className="relative group bg-white rounded-3xl shadow-xl shadow-orange-100/50 border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-100">
            {isGuest && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center">
                    <LockIcon />
                    <h3 className="text-xl font-bold text-slate-800 mb-1">Unlock Visual Discovery</h3>
                    <p className="text-slate-500 mb-4 max-w-xs mx-auto">Sign up to analyze food photos and get instant recipes.</p>
                    <button
                        onClick={onNavigateToRegister}
                        className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 transition-all"
                    >
                        Create Free Account
                    </button>
                </div>
            )}

            <div className="p-2">
                <div className="relative flex flex-col md:flex-row">
                    {/* Image Preview Area */}
                    {imagePreviewUrl && (
                        <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0 m-2 rounded-2xl overflow-hidden group/image">
                            <img src={imagePreviewUrl} alt="Dish preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={handleClearImage}
                                    className="p-2 bg-white/20 backdrop-blur-md border border-white/50 text-white rounded-full hover:bg-red-500 hover:border-red-500 transition-all"
                                    aria-label="Remove image"
                                    disabled={isGuest}
                                >
                                    <ClearIcon />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Text Area */}
                    <textarea
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        placeholder={imagePreviewUrl ? "Add any details about this dish..." : "Describe a dish (e.g., 'Sinigang na Baboy with lots of gabi') or upload a photo..."}
                        className={`w-full bg-transparent border-none p-6 text-lg placeholder-slate-400 text-slate-700 focus:ring-0 resize-none ${imagePreviewUrl ? 'h-auto min-h-[150px]' : 'h-40'}`}
                        disabled={isLoading || isGuest}
                    />
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-slate-50/50 border-t border-slate-100 px-4 py-3 flex items-center justify-between">
                <div className="flex gap-2">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
                    <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" ref={cameraInputRef} />
                    
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading || isGuest || imageFeaturesDisabled}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        <PhotoIcon />
                        <span className="hidden sm:inline">Upload</span>
                    </button>
                    <button 
                        onClick={() => cameraInputRef.current?.click()}
                        disabled={isLoading || isGuest || imageFeaturesDisabled}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        <CameraIcon />
                        <span className="hidden sm:inline">Camera</span>
                    </button>
                </div>

                {(description || imagePreviewUrl) && (
                    <button 
                        onClick={onClear}
                        className="text-slate-400 hover:text-red-500 transition-colors text-sm font-medium px-3"
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
        
        {imageFeaturesDisabled && (
            <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p>Image features are temporarily disabled. Please describe your dish instead.</p>
            </div>
        )}
    </div>
  );
};