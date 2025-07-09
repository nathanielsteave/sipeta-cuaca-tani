import React, { useState, useEffect } from 'react';

const getWeatherIcon = (weatherCode, local_datetime) => {
    const code = parseInt(weatherCode);
    const hour = new Date(local_datetime).getHours();
    const isNight = hour >= 18 || hour < 6;

    if (code === 1 || code === 2) return isNight ? '☁️' : '🌤️';
    if (code === 3) return '☁️';
    if (code === 4) return '🌥️';
    if (code === 5) return '🌫️';
    if (code >= 10 && code <= 60) return '🌧️';
    if (code >= 61 && code <= 97) return '⛈️';
    
    return isNight ? '🌙' : '☀️';
};

export default function HourlyForecast({ prakiraan }) {
    const [isNight, setIsNight] = useState(false);

    useEffect(() => {
        const hour = new Date().getHours();
        setIsNight(hour >= 18 || hour < 6);
    }, []);

    if (!prakiraan || prakiraan.length === 0) return null;

    const next8Forecasts = prakiraan.slice(0, 8);

    // --- PERUBAHAN DI SINI: Latar belakang dan warna teks dinamis ---
    const backgroundClass = isNight
        ? 'from-nightsky-800 to-nightsky-900'
        : 'from-sky-300 to-sky-500';

    const titleClass = isNight ? 'text-sky-200' : 'text-white';
    const timeClass = isNight ? 'text-neutral-300' : 'text-white/90';
    const tempClass = isNight ? 'text-white' : 'text-white';
    const humidityClass = isNight ? 'text-sky-400' : 'text-white/90';
    const cardBgClass = isNight ? 'bg-nightsky-700/50' : 'bg-sky-400/50';

    return (
        <div className={`bg-gradient-to-br ${backgroundClass} p-6 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.02]`}>
            <h3 className={`text-xl font-bold ${titleClass} mb-4`}>Prakiraan 24 Jam Kedepan</h3>
            <div className="flex overflow-x-auto space-x-4 pb-2">
                {next8Forecasts.map((p, index) => (
                    <div key={index} className={`flex-shrink-0 w-24 text-center ${cardBgClass} p-3 rounded-lg transition-colors duration-500`}>
                        <p className={`font-semibold text-sm ${timeClass}`}>{new Date(p.local_datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-3xl my-2">{getWeatherIcon(p.image, p.local_datetime)}</p>
                        <p className={`font-bold text-lg ${tempClass}`}>{p.t}°C</p>
                        <p className={`text-xs ${humidityClass}`}>💧 {p.hu}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
}