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

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ClearIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const LockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
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
    // Reset the input value to allow re-uploading the same file
    event.target.value = '';
  };

  const handleClearImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onImageSelect(null); // Effectively clears the image
  };

  return (
    <div className="w-full space-y-4 relative">
       {isGuest && (
        <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-sm z-10 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
            <LockIcon />
            <h3 className="text-lg font-bold text-slate-800">AI Features Locked</h3>
            <p className="text-slate-600 text-sm mb-4">Register for free to get recipes from photos and chat with our AI chef.</p>
            <button
                onClick={onNavigateToRegister}
                className="px-6 py-2 bg-sky-500 text-white font-bold rounded-lg shadow-md hover:bg-sky-600 transition-colors text-sm sm:text-base"
            >
                Register for Free
            </button>
        </div>
       )}
       <div className="flex justify-between items-center">
         <label htmlFor="dish-description" className="block text-lg font-semibold text-slate-700">Describe a Filipino Dish</label>
         {(imagePreviewUrl || description) && (
            <button onClick={() => {
                if (window.confirm('Are you sure you want to clear the form?')) {
                    onClear();
                }
            }} className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1">
                <ClearIcon />
                Clear All
            </button>
         )}
       </div>

      <div className="relative flex flex-col sm:flex-row gap-2 items-start">
        {imagePreviewUrl && (
            <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                <img src={imagePreviewUrl} alt="Dish preview" className="w-full h-full object-cover rounded-lg shadow-md" />
                <button
                  onClick={handleClearImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-500 transition-colors"
                  aria-label="Clear image"
                  disabled={isGuest || imageFeaturesDisabled}
                >
                  <ClearIcon />
                </button>
            </div>
        )}

        <textarea
            id="dish-description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="e.g., 'a sour and savory soup with pork and tamarind', 'chicken adobo', or upload a photo..."
            className="w-full h-32 p-3 bg-white/80 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors disabled:bg-slate-100"
            aria-label="Describe the dish"
            disabled={isLoading || isGuest}
        />
      </div>
      
      {imageFeaturesDisabled && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded-md text-sm" role="alert">
            <p><span className="font-bold">Note:</span> Image upload is disabled. This feature requires a Gemini API key with billing enabled. You can continue using text descriptions.</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
        <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" ref={cameraInputRef} />
        
        <button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isLoading || isGuest || imageFeaturesDisabled}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
        >
            <UploadIcon />
            Upload Photo
        </button>
        <button 
            onClick={() => cameraInputRef.current?.click()} 
            disabled={isLoading || isGuest || imageFeaturesDisabled}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
        >
            <CameraIcon />
            Use Camera
        </button>
      </div>
    </div>
  );
};
