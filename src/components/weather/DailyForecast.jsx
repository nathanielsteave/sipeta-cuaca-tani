import React from 'react';

const getWeatherIcon = (weatherCode) => {
    if (parseInt(weatherCode) >= 10) return '🌧️';
    if (parseInt(weatherCode) >= 3) return '☁️';
    return '☀️';
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
            weatherIcon: getWeatherIcon(representativeWeather.image),
        };
    }).slice(0, 3); // --- PERUBAHAN DI SINI: Dibatasi hanya untuk 3 hari ---

    return (
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-md h-full transition-transform duration-300 hover:scale-105">
            {/* --- PERUBAHAN DI SINI: Judul diubah --- */}
            <h3 className="text-xl font-bold text-primary-800 dark:text-primary-200 mb-4">Prakiraan 3 Hari Kedepan</h3>
            <div className="space-y-3">
                {dailyData.map((day, index) => (
                    <div key={index} className="flex justify-between items-center text-sm border-b border-neutral-100 dark:border-neutral-700 pb-2 last:border-b-0 last:pb-0 transition-colors duration-500">
                        <p className="font-semibold w-1/3 text-neutral-700 dark:text-neutral-300">
                            {day.date.toLocaleDateString('id-ID', { weekday: 'long' })}
                        </p>
                        <div className="text-xl w-1/3 text-center">{day.weatherIcon}</div>
                        <div className="w-1/3 text-right">
                            <span className="font-bold text-neutral-800 dark:text-white">{day.maxTemp.toFixed(0)}°</span>
                            <span className="text-neutral-500 dark:text-neutral-400"> / {day.minTemp.toFixed(0)}°</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}