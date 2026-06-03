import { useEffect, useRef } from "react";

interface UseBarcodeScannerProps {
  onScan: (code: string) => void;
}

export const useBarcodeScanner = ({ onScan }: UseBarcodeScannerProps) => {
  const bufferRef = useRef<string>("");
  const lastKeyTimeRef = useRef<number>(0);
  const isScanningRef = useRef<boolean>(false);

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
        if (isScanningRef.current && bufferRef.current.length > 2) {
          event.preventDefault();
          event.stopPropagation();

          onScan(bufferRef.current);
        }

        bufferRef.current = "";
        isScanningRef.current = false;
        return;
      }

      if (timeDiff < 30 || bufferRef.current === "") {
        if (bufferRef.current !== "") {
          isScanningRef.current = true;
        }

        if (event.key.length === 1) {
          bufferRef.current += event.key;
        }

        if (isScanningRef.current) {
          event.preventDefault();
          event.stopPropagation();
        }

      } else {
        bufferRef.current = event.key.length === 1 ? event.key : "";
        isScanningRef.current = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [onScan]);
};