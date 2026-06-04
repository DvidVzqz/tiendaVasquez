import { useState, useEffect } from 'react';

export default function Reloj() {
    // 1. Estado inicial con la hora del sistema
    const [hora, setHora] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        // 2. Intervalo que actualiza el estado cada segundo (1000 ms)
        const timerID = setInterval(() => {
            setHora(new Date().toLocaleTimeString());
        }, 1000);

        // 3. Limpieza del intervalo al desmontar el componente
        return () => clearInterval(timerID);
    }, []);

    return (
        <div className="p-2 bg-gray-800 text-white rounded-lg shadow-md text-center">
            Hora: {hora}
        </div>
    );
};
