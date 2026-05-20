import { createContext, useContext, useEffect, useState } from "react";
import { useIsFetching } from "@tanstack/react-query";

const LoadingContext = createContext({ isLoading: false });

export const useGlobalLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const isFetching = useIsFetching();
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        let timer: number;

        if (isFetching > 0)
            timer = setTimeout(() => {
                setShowSpinner(true);
            }, 5000);
        else setShowSpinner(false);

        return () => clearTimeout(timer);
    }, [isFetching]);

    return (
        <LoadingContext.Provider value={{ isLoading: showSpinner }}>
            {children}
            {showSpinner && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>}
        </LoadingContext.Provider>
    );
}