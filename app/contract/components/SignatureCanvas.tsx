"use client";

import { useRef, useEffect, useState } from "react";
import ReactSignatureCanvas from "react-signature-canvas";

interface SignatureCanvasProps {
  onSignatureChange: (signature: string | null) => void;
  initialSignature?: string;
  disabled?: boolean;
}

export default function SignatureCanvas({
  onSignatureChange,
  initialSignature,
  disabled = false,
}: SignatureCanvasProps) {
  const sigCanvas = useRef<ReactSignatureCanvas>(null);
  const [typedSignature, setTypedSignature] = useState("");
  const [useTyped, setUseTyped] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (initialSignature && sigCanvas.current) {
      sigCanvas.current.fromDataURL(initialSignature);
      setIsEmpty(false);
    }
  }, [initialSignature]);

  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setIsEmpty(true);
      onSignatureChange(null);
    }
  };

  const handleSave = () => {
    if (useTyped && typedSignature) {
      // Create a simple canvas with typed signature
      const canvas = document.createElement("canvas");
      canvas.width = 500;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.font = "italic 48px Georgia, serif";
        ctx.fillStyle = "#000";
        ctx.fillText(typedSignature, 50, 120);
        onSignatureChange(canvas.toDataURL());
        setIsEmpty(false);
      }
    } else if (sigCanvas.current && !isEmpty) {
      const dataURL = sigCanvas.current.toDataURL();
      onSignatureChange(dataURL);
    }
  };

  const handleTypedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedSignature(e.target.value);
    if (e.target.value) {
      setIsEmpty(false);
    } else {
      setIsEmpty(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setUseTyped(false)}
          disabled={disabled}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            !useTyped
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Draw Signature
        </button>
        <button
          type="button"
          onClick={() => setUseTyped(true)}
          disabled={disabled}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            useTyped
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Type Signature
        </button>
      </div>

      {!useTyped ? (
        /* Drawing Canvas */
        <div className="relative">
          <div
            className={`border-2 rounded-lg bg-white ${
              disabled ? "border-gray-200" : "border-gray-300"
            }`}
          >
            <ReactSignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                className: `w-full h-48 ${disabled ? "cursor-not-allowed pointer-events-none opacity-50" : "cursor-crosshair"}`,
              }}
              onEnd={() => {
                if (sigCanvas.current) {
                  setIsEmpty(sigCanvas.current.isEmpty());
                }
              }}
            />
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="mt-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear Signature
            </button>
          )}
        </div>
      ) : (
        /* Typed Signature Input */
        <div className="space-y-2">
          <input
            type="text"
            value={typedSignature}
            onChange={handleTypedChange}
            disabled={disabled}
            placeholder="Type your full name"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-lg italic font-serif focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
          <p className="text-xs text-gray-500">
            Your typed signature will be rendered in a professional font
          </p>
        </div>
      )}

      {/* Signature Info for Audit Trail */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>IP Address: {typeof window !== "undefined" ? "Logged on signature" : "N/A"}</p>
        <p>Timestamp: {new Date().toLocaleString()}</p>
        <p>User Agent: {typeof window !== "undefined" ? navigator.userAgent.substring(0, 50) + "..." : "N/A"}</p>
      </div>
    </div>
  );
}
