import React from 'react';

const getWeatherIcon = (weatherCode) => {
    if (parseInt(weatherCode) >= 10) return '🌧️';
    if (parseInt(weatherCode) >= 5) return '🌫️';
    if (parseInt(weatherCode) >= 3) return '☁️';
    return '☀️';
};

export default function CurrentWeather({ data }) {
    if (!data) return null;

    return (
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center transition-transform duration-300 hover:scale-[1.02]">
            <div>
                <p className="text-lg font-semibold capitalize">{data.weather_desc}</p>
                <p className="text-7xl font-bold my-1">{data.t}°C</p>
                <p className="opacity-90">Kelembapan saat ini: {data.hu}%</p>
            </div>
            <div className="text-8xl opacity-80 -mr-4">
                {getWeatherIcon(data.image)}
            </div>
        </div>
    );
}