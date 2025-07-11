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

const groupForecastByDay = (prakiraan) => {
    const grouped = {};
    prakiraan.forEach(p => {
        const date = p.local_datetime.split(' ')[0];
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(p);
    });
    return Object.values(grouped);
};

export default function DailyForecast({ prakiraan }) {
    if (!prakiraan || prakiraan.length === 0) return null;

    const dailyData = groupForecastByDay(prakiraan).map(dayForecast => {
        const temps = dayForecast.map(p => parseFloat(p.t));
        const representativeWeather = dayForecast.find(p => p.local_datetime.includes('12:00')) || dayForecast[0];
        
        return {
            date: new Date(dayForecast[0].local_datetime),
            maxTemp: Math.max(...temps),
            minTemp: Math.min(...temps),
            weatherIcon: getWeatherIcon(representativeWeather.image, representativeWeather.local_datetime),
        };
    }).slice(0, 3);

    return (
        <div className="bg-gradient-to-br from-sky-300 to-sky-500 p-6 rounded-2xl shadow-lg h-full transition-transform duration-300 hover:scale-105">
            <h3 className="text-xl font-bold text-white mb-4">Prakiraan 3 Hari Kedepan</h3>
            <div className="space-y-3">
                {dailyData.map((day, index) => (
                    <div key={index} className="flex justify-between items-center text-sm border-b border-sky-400/50 pb-2 last:border-b-0 last:pb-0">
                        <p className="font-semibold w-1/3 text-white/90">
                            {day.date.toLocaleDateString('id-ID', { weekday: 'long' })}
                        </p>
                        <div className="text-xl w-1/3 text-center">{day.weatherIcon}</div>
                        <div className="w-1/3 text-right">
                            <span className="font-bold text-white">{day.maxTemp.toFixed(0)}°</span>
                            <span className="text-sky-100"> / {day.minTemp.toFixed(0)}°</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}