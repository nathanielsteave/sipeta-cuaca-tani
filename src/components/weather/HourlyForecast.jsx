import React from 'react';

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
    if (!prakiraan || prakiraan.length === 0) return null;

    const next8Forecasts = prakiraan.slice(0, 8);

    return (
        <div className="bg-gradient-to-br from-sky-300 to-sky-500 p-6 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.02]">
            <h3 className="text-xl font-bold text-white mb-4">Prakiraan 24 Jam Kedepan</h3>
            <div className="flex overflow-x-auto space-x-4 pb-2">
                {next8Forecasts.map((p, index) => (
                    <div key={index} className="flex-shrink-0 w-24 text-center bg-sky-400/50 p-3 rounded-lg">
                        <p className="font-semibold text-sm text-white/90">{new Date(p.local_datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-3xl my-2">{getWeatherIcon(p.image, p.local_datetime)}</p>
                        <p className="font-bold text-lg text-white">{p.t}°C</p>
                        <p className="text-xs text-white/90">💧 {p.hu}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
}