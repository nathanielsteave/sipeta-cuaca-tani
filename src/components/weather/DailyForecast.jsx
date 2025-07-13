import React from 'react';

// Fungsi utama untuk mendapatkan ikon cuaca, sudah memperhitungkan siang/malam
const getWeatherIcon = (weatherCode, local_datetime) => {
    const code = parseInt(weatherCode);
    const hour = new Date(local_datetime).getHours();
    const isNight = hour >= 18 || hour < 6;

    if (code === 1 || code === 2) return isNight ? '☁️' : '🌤️';
    if (code === 3) return '☁️';
    if (code === 4) return '🌥️';
    if (code === 5 || code === 10 || code === 45) return '🌫️';
    if (code >= 60 && code <= 97) return '⛈️';
    
    // Default untuk kode 0 (Cerah)
    return isNight ? '🌙' : '☀️';
};

// Fungsi untuk mengelompokkan data prakiraan per hari
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
        
        // --- LOGIKA PEMILIHAN IKON YANG DIPERBAIKI ---

        // 1. Cari prakiraan representatif untuk SIANG HARI (antara jam 9 pagi - 5 sore)
        const dayTimeForecasts = dayForecast.filter(p => {
            const hour = new Date(p.local_datetime).getHours();
            return hour >= 9 && hour < 18;
        });
        // Jika tidak ada data siang, gunakan data paling awal sebagai acuan
        const dayWeather = dayTimeForecasts.find(p => p.local_datetime.includes('12:00')) || dayTimeForecasts[0] || dayForecast[0];

        // 2. Cari prakiraan representatif untuk MALAM HARI (jam 6 sore ke atas)
        const nightTimeForecasts = dayForecast.filter(p => new Date(p.local_datetime).getHours() >= 18);
        const nightWeather = nightTimeForecasts[0]; // Ambil data jam malam pertama yang tersedia

        return {
            date: new Date(dayForecast[0].local_datetime),
            maxTemp: Math.max(...temps),
            minTemp: Math.min(...temps),
            dayIcon: getWeatherIcon(dayWeather.image, dayWeather.local_datetime),
            // Jika ada data malam, proses. Jika tidak, kembalikan null.
            nightIcon: nightWeather ? getWeatherIcon(nightWeather.image, nightWeather.local_datetime) : null,
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
                        
                        <div className="w-1/3 text-center text-xl">
                            <span>{day.dayIcon}</span>
                            {/* --- PERUBAHAN UTAMA DI SINI --- */}
                            {/* Ikon malam hanya ditampilkan jika ada DAN berbeda dari ikon siang */}
                            {day.nightIcon && day.nightIcon !== day.dayIcon && (
                                <>
                                    <span className="mx-1 text-white/80">/</span>
                                    <span>{day.nightIcon}</span>
                                </>
                            )}
                        </div>

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