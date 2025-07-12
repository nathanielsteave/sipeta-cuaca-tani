import React from 'react';

// Fungsi untuk mendapatkan ikon cuaca
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

export default function CurrentWeather({ data }) {
    if (!data) return null;

    // --- PERUBAHAN DI SINI ---
    // Kelas latar belakang sekarang statis dan tidak akan berubah.
    const backgroundClass = 'from-sky-300 to-sky-500';

    return (
        <div className={`bg-gradient-to-br ${backgroundClass} text-white p-6 rounded-2xl shadow-lg flex justify-between items-center transition-transform duration-300 hover:scale-[1.02]`}>
            <div>
                <p className="text-lg font-semibold capitalize">{data.weather_desc}</p>
                <p className="text-7xl font-bold my-1">{data.t}°C</p>
                <p className="opacity-90">Kelembapan saat ini: {data.hu}%</p>
            </div>
            <div className="text-8xl opacity-80 -mr-4">
                {getWeatherIcon(data.image, data.local_datetime)}
            </div>
        </div>
    );
}