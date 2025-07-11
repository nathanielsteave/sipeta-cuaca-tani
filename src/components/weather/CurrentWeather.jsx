import React from 'react';

const getWeatherIcon = (weatherCode, local_datetime) => {
    const code = parseInt(weatherCode);
    const hour = new Date(local_datetime).getHours();
    const isNight = hour >= 18 || hour < 6;

    if (code === 1 || code === 2) return isNight ? '☁️' : '🌤️'; // Cerah Berawan
    if (code === 3) return '☁️'; // Berawan
    if (code === 4) return '🌥️'; // Berawan Tebal
    if (code === 5) return '🌫️'; // Kabut
    if (code >= 10 && code <= 60) return '🌧️'; // Hujan Ringan hingga Sedang
    if (code >= 61 && code <= 97) return '⛈️'; // Hujan Lebat/Petir

    // Fallback ke cerah/malam jika tidak ada yang cocok
    return isNight ? '🌙' : '☀️';
};

export default function CurrentWeather({ data }) {
    if (!data) return null;

    const backgroundClass = 'from-sky-300 to-sky-500'; // Selalu tema siang

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