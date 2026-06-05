import { createContext, useContext, useEffect, useState } from "react";
import { useIsFetching } from "@tanstack/react-query";

type AlertType = "success" | "error" | "info";
interface AlertState {
    type?: AlertType;
    message: string;
    visible: boolean;
    render: boolean;
}

interface LoadingContextType {
    isLoading: boolean;
    showAlert: (message: string, type?: AlertType) => void;
}

const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    showAlert: () => { }
});

export const useGlobalAlerts = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const isFetching = useIsFetching();
    const [showSpinner, setShowSpinner] = useState(false);
    const [alert, setAlert] = useState<AlertState>({ message: "", visible: false, render: false });

    useEffect(() => {
        let timer: number;

        if (isFetching > 0)
            timer = setTimeout(() => {
                setShowSpinner(true);
            }, 5000);
        else setShowSpinner(false);

        return () => clearTimeout(timer);
    }, [isFetching]);

    const showAlert = (message: string, type: AlertType = "success") => {
        setAlert({ message, type, render: true, visible: false });
        setTimeout(() => {
            setAlert(prev => ({ ...prev, visible: true }));
        }, 10);
        setTimeout(() => {
            setAlert(prev => ({ ...prev, visible: false }));
        }, 3500);
        setTimeout(() => {
            setAlert(prev => ({ ...prev, render: false }));
        }, 4000);
    };

    return (
        <LoadingContext.Provider value={{ isLoading: showSpinner, showAlert }}>
            {children}
            {showSpinner && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>}

            {alert.render && (
                <div className={`fixed px-4 py-3 rounded z-50 border shadow-lg transition-all duration-500 ease-in-out
                        ${alert.visible
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                    }`}
                    style={{
                        ...alert.type === "success" ? {
                            backgroundColor: 'rgb(8, 32, 10)',
                            color: "rgb(123, 241, 180)",
                            borderColor: "rgb(123, 241, 180)",
                        } : alert.type === "error" ? {
                            backgroundColor: 'rgb(32, 8, 10)',
                            color: "rgb(241, 123, 180)",
                            borderColor: "rgb(241, 123, 180)",
                        } : {
                            backgroundColor: 'rgb(8, 16, 32)',
                            color: "rgb(123, 241, 241)",
                            borderColor: "rgb(123, 241, 241)",
                        },
                        bottom: "1rem",
                        left: "1rem"
                    }}
                    role="alert"
                >
                    <strong className="font-bold">{alert.type === "success" ? "¡Éxito!" : alert.type === "error" ? "¡Error!" : "¡Información!"}</strong>
                    <span className="block sm:inline ml-2">{alert.message}</span>
                </div>
            )}
        </LoadingContext.Provider>
    )
}