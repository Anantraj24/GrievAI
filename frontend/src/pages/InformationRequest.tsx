import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const InformationRequest: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0].name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0].name);
    }
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen flex flex-col font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Simplified Header for Focused Task */}
      <header className="flex items-center justify-between h-16 px-gutter border-b border-surface-variant bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/authority/workspace" className="flex items-center gap-stack-sm text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md group">
          <span className="material-symbols-outlined text-[18px] group-active:-translate-x-1 transition-transform">arrow_back</span>
          Return to Case
        </Link>
        <div className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-stack-sm">
          <span className="material-symbols-outlined text-primary">gavel</span>
          GrievAI
        </div>
        <div className="w-24"></div> {/* Spacer for centering */}
      </header>
      
      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center p-gutter md:p-container-padding py-12">
        <div className="w-full max-w-3xl">
          {/* Page Header */}
          <div className="mb-stack-lg text-center md:text-left">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-stack-sm">
              Information Requested for GRV-00142
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Please provide the requested details to proceed with your case review.
            </p>
          </div>
          
          {/* Task Card */}
          <div className="bg-surface border border-surface-variant rounded-lg p-gutter md:p-container-padding shadow-sm">
            {/* Authority Request Block */}
            <div className="bg-surface-container-high border-l-4 border-primary rounded-r p-stack-md mb-stack-lg">
              <div className="flex items-start gap-stack-sm">
                <span className="material-symbols-outlined text-primary mt-1">announcement</span>
                <div>
                  <h2 className="font-label-md text-label-md text-primary mb-unit uppercase tracking-wider">Authority Request</h2>
                  <p className="font-body-lg text-body-lg text-on-surface">
                    "Please provide a clear photo of the maintenance notice that was posted on your floor regarding the water shutoff on Oct 12th. If you have any additional context regarding the timeline, please include it below."
                  </p>
                </div>
              </div>
            </div>
            
            <form className="space-y-stack-lg">
              {/* Response Field */}
              <div className="space-y-stack-sm focus-within:ring-2 focus-within:ring-primary/10 rounded">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="response-text">Your Response</label>
                <textarea 
                  className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded p-stack-md focus:border-primary focus:ring-0 transition-colors resize-y" 
                  id="response-text" 
                  placeholder="Type your explanation or additional context here..." 
                  rows={5}
                ></textarea>
              </div>
              
              {/* File Upload Area */}
              <div className="space-y-stack-sm">
                <label className="block font-label-md text-label-md text-on-surface">Supporting Documents</label>
                <div 
                  className={`border-2 border-dashed transition-colors rounded-lg p-container-padding text-center cursor-pointer group flex flex-col items-center justify-center min-h-[160px] ${isDragOver ? 'border-primary bg-surface-container-low' : 'border-outline-variant hover:border-primary bg-surface-container-lowest hover:bg-surface-container-low'}`}
                  onClick={handleUploadClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-stack-sm group-hover:scale-110 transition-transform duration-200">
                    <span className="material-symbols-outlined text-primary text-2xl">upload_file</span>
                  </div>
                  <p className="font-body-lg text-body-lg text-on-surface mb-unit">
                    {selectedFile ? `Selected: ${selectedFile}` : 'Click to upload or drag and drop'}
                  </p>
                  {!selectedFile && (
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      SVG, PNG, JPG or PDF (max. 10MB)
                    </p>
                  )}
                  {/* Hidden File Input */}
                  <input 
                    className="hidden" 
                    id="file-upload" 
                    multiple 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-stack-md pt-stack-md border-t border-surface-variant mt-stack-lg">
                <button className="w-full sm:w-auto font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container px-stack-lg py-3 rounded transition-colors" type="button">
                  Save Draft
                </button>
                <button className="w-full sm:w-auto font-label-md text-label-md bg-primary text-on-primary hover:bg-primary-fixed px-stack-lg py-3 rounded transition-colors flex items-center justify-center gap-stack-sm" type="submit">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Submit Information
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InformationRequest;
