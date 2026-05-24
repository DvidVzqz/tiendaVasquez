import { useEffect, useRef } from "react";

interface UseBarcodeScannerProps {
  onScan: (code: string) => void;
}

export const useBarcodeScanner = ({ onScan }: UseBarcodeScannerProps) => {
  const bufferRef = useRef<string>("");
  const lastKeyTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" || 
        target.tagName === "SELECT" || 
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTimeRef.current;
      lastKeyTimeRef.current = currentTime;

      if (event.key === "Enter") {
        if (bufferRef.current.length > 2) {
          onScan(bufferRef.current);
          bufferRef.current = "";
        }
        return;
      }

      if (timeDiff < 30 || bufferRef.current === "") {
        if (event.key.length === 1) {
          bufferRef.current += event.key;
        }
      } else {
        bufferRef.current = event.key.length === 1 ? event.key : "";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onScan]);
};