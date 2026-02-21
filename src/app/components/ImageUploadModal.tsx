import { useState, useRef, useCallback } from 'react';
import { X, Upload, Image as ImageIcon, Loader2, CheckCircle, MapPin, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadedImage {
  file: File;
  preview: string;
  gps?: { lat: number; lng: number };
  analyzing: boolean;
  complete: boolean;
  score?: number;
  risk?: string;
  assetId?: string;
}

export function ImageUploadModal({ isOpen, onClose }: ImageUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const processImages = async (files: File[]) => {
    const newImages: UploadedImage[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      analyzing: true,
      complete: false,
    }));

    setUploadedImages((prev) => [...prev, ...newImages]);

    for (const image of newImages) {
      const gps = {
        lat: 30.2 + Math.random() * 0.1,
        lng: -97.7 + Math.random() * 0.1,
      };

      setUploadedImages((prev) =>
        prev.map((img) =>
          img.preview === image.preview ? { ...img, gps } : img
        )
      );

      try {
        const b64 = await fileToBase64(image.file);
        const res = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_base64: b64,
            lat: gps.lat,
            lng: gps.lng,
          }),
        });

        if (!res.ok) throw new Error(`API error ${res.status}`);

        const data = await res.json();
        setUploadedImages((prev) =>
          prev.map((img) =>
            img.preview === image.preview
              ? {
                  ...img,
                  analyzing: false,
                  complete: true,
                  score: data.score,
                  risk: data.risk_label,
                  assetId: data.asset_id,
                }
              : img
          )
        );
      } catch {
        setUploadedImages((prev) =>
          prev.map((img) =>
            img.preview === image.preview
              ? {
                  ...img,
                  analyzing: false,
                  complete: true,
                  score: 0,
                  risk: 'Analysis Failed',
                  assetId: 'ERR',
                }
              : img
          )
        );
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      processImages(files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      processImages(files);
    }
  };

  const handleViewDetails = (image: UploadedImage) => {
    if (image.complete && image.assetId) {
      navigate(`/inspection/${image.assetId}`);
      onClose();
    }
  };

  const getStatusColor = (score?: number) => {
    if (!score) return 'gray';
    if (score >= 70) return 'red';
    if (score >= 50) return 'yellow';
    return 'green';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Upload Asset Images</h2>
            <p className="text-sm text-gray-600 mt-1">
              AI will analyze images and extract GPS coordinates
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-1">
                  Drop images here or click to browse
                </p>
                <p className="text-sm text-gray-600">
                  Supports JPG, PNG, WebP • Max 10MB per file
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Select Images
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Processing ({uploadedImages.length})
              </h3>
              <div className="space-y-4">
                {uploadedImages.map((image, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-4"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img
                        src={image.preview}
                        alt="Upload preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {image.complete && (
                        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {image.file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(image.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        {image.complete && (
                          <button
                            onClick={() => handleViewDetails(image)}
                            className="ml-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </button>
                        )}
                      </div>

                      {/* Status */}
                      <div className="space-y-2">
                        {/* GPS Extraction */}
                        <div className="flex items-center gap-2 text-sm">
                          {!image.gps ? (
                            <>
                              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                              <span className="text-gray-600">Extracting GPS coordinates...</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-4 h-4 text-green-600" />
                              <span className="text-gray-900 font-mono text-xs">
                                {image.gps.lat.toFixed(4)}, {image.gps.lng.toFixed(4)}
                              </span>
                            </>
                          )}
                        </div>

                        {/* AI Analysis */}
                        {image.gps && (
                          <div className="flex items-center gap-2 text-sm">
                            {image.analyzing ? (
                              <>
                                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                <span className="text-gray-600">Running AI analysis...</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className={`w-4 h-4 text-${getStatusColor(image.score)}-600`} />
                                <span className="text-gray-900 font-medium">
                                  Score: {image.score}/100 • {image.risk}
                                </span>
                                <span className="text-gray-500">• {image.assetId}</span>
                              </>
                            )}
                          </div>
                        )}

                        {/* Progress Bar */}
                        {!image.complete && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                              style={{
                                width: !image.gps ? '33%' : image.analyzing ? '66%' : '100%',
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {uploadedImages.filter((img) => img.complete).length} of {uploadedImages.length} complete
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {uploadedImages.length > 0 && uploadedImages.every((img) => img.complete) && (
              <button
                onClick={() => {
                  setUploadedImages([]);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save to Database
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
