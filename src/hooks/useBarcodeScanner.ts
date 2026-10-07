import { useEffect, useRef } from "react";

interface UseBarcodeScannerProps {
  onScan: (code: string) => void;
  minLength?: number;
  maxKeyDelay?: number;
}

export const useBarcodeScanner = ({
  onScan,
  minLength = 5,
  maxKeyDelay = 50,
}: UseBarcodeScannerProps) => {
  const bufferRef = useRef("");
  const lastKeyTimeRef = useRef(0);

  const targetRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const originalValueRef = useRef("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTimeRef.current;

      const target = event.target as HTMLElement | null;

      const isInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement;

      // const isEditable = isInput || target?.isContentEditable === true;

      if (bufferRef.current && timeDiff > maxKeyDelay) {
        bufferRef.current = "";
        targetRef.current = null;
        originalValueRef.current = "";
      }

      lastKeyTimeRef.current = currentTime;

      if (event.key === "Enter") {
        const code = bufferRef.current;

        if (code.length >= minLength) {
          event.preventDefault();
          event.stopPropagation();

          if (targetRef.current) {
            targetRef.current.value = originalValueRef.current;
            targetRef.current.dispatchEvent(new Event("input", { bubbles: true, }));
          }

          bufferRef.current = "";
          targetRef.current = null;
          originalValueRef.current = "";

          onScan(code);
        }

        return;
      }

      if (event.key.length !== 1) return;

      if (!bufferRef.current) {
        if (isInput) {
          targetRef.current = target;
          originalValueRef.current = target.value;
        } else {
          targetRef.current = null;
          originalValueRef.current = "";
        }
      }

      bufferRef.current += event.key;

      if (bufferRef.current.length >= 2 && timeDiff <= maxKeyDelay) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [onScan]);
};