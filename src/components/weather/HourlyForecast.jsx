import React from 'react';

const getWeatherIcon = (weatherCode) => {
    if (parseInt(weatherCode) >= 10) return '🌧️';
    if (parseInt(weatherCode) >= 3) return '☁️';
    return '☀️';
};

export default function HourlyForecast({ prakiraan }) {
    if (!prakiraan || prakiraan.length === 0) return null;

    // Ambil 8 data prakiraan berikutnya (24 jam)
    const next8Forecasts = prakiraan.slice(0, 8);

    return (
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-md transition-transform duration-300 hover:scale-[1.02]">
            <h3 className="text-xl font-bold text-primary-800 dark:text-primary-200 mb-4">Prakiraan 24 Jam Kedepan</h3>
            <div className="flex overflow-x-auto space-x-4 pb-2">
                {next8Forecasts.map((p, index) => (
                    <div key={index} className="flex-shrink-0 w-24 text-center bg-neutral-100 dark:bg-neutral-700 p-3 rounded-lg transition-colors duration-500">
                        <p className="font-semibold text-sm text-neutral-700 dark:text-neutral-300">{new Date(p.local_datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-3xl my-2">{getWeatherIcon(p.image)}</p>
                        <p className="font-bold text-lg text-neutral-800 dark:text-white">{p.t}°C</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">💧 {p.hu}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
}