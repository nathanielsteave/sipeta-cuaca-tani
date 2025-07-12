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

// --- FUNGSI BARU UNTUK INTERPOLASI DATA ---
const interpolateForecast = (prakiraan) => {
    if (!prakiraan || prakiraan.length < 2) return prakiraan;

    const hourly = [];
    // Iterasi hingga data kedua dari terakhir untuk melakukan interpolasi
    for (let i = 0; i < prakiraan.length - 1; i++) {
        const start = prakiraan[i];
        const end = prakiraan[i + 1];

        const startDate = new Date(start.local_datetime);
        const endDate = new Date(end.local_datetime);
        const hourDiff = (endDate - startDate) / (1000 * 60 * 60);

        // Jika selisihnya 3 jam, lakukan interpolasi
        if (hourDiff === 3) {
            const startTemp = parseFloat(start.t);
            const endTemp = parseFloat(end.t);
            const startHum = parseFloat(start.hu);
            const endHum = parseFloat(end.hu);

            // Tambahkan data jam pertama (data asli)
            hourly.push(start);

            // Interpolasi untuk 2 jam berikutnya
            for (let j = 1; j < hourDiff; j++) {
                const interpDate = new Date(startDate.getTime() + j * 60 * 60 * 1000);
                
                // Interpolasi linier untuk suhu dan kelembapan
                const interpTemp = startTemp + (endTemp - startTemp) * (j / hourDiff);
                const interpHum = startHum + (endHum - startHum) * (j / hourDiff);

                hourly.push({
                    ...start, // Salin data lain seperti deskripsi & ikon dari jam awal
                    local_datetime: interpDate.toISOString(),
                    t: interpTemp.toFixed(1), // Simpan dengan 1 desimal
                    hu: interpHum.toFixed(0), // Bulatkan ke integer
                });
            }
        } else { // Jika selisih bukan 3 jam, cukup tambahkan data awal
            hourly.push(start);
        }
    }
    // Tambahkan data terakhir dari array asli
    hourly.push(prakiraan[prakiraan.length - 1]);

    return hourly;
};


export default function HourlyForecast({ prakiraan }) {
    if (!prakiraan || prakiraan.length === 0) return null;

    // Lakukan interpolasi dan ambil 24 jam pertama
    const interpolatedPrakiraan = interpolateForecast(prakiraan);
    const next24Forecasts = interpolatedPrakiraan.slice(0, 24);

    return (
        <div className="bg-gradient-to-br from-sky-300 to-sky-500 p-6 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.02]">
            <h3 className="text-xl font-bold text-white mb-4">Prakiraan 24 Jam Kedepan</h3>
            <div className="flex overflow-x-auto space-x-4 pb-2">
                {next24Forecasts.map((p, index) => (
                    <div key={index} className="flex-shrink-0 w-24 text-center bg-sky-400/50 p-3 rounded-lg">
                        <p className="font-semibold text-sm text-white/90">{new Date(p.local_datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-3xl my-2">{getWeatherIcon(p.image, p.local_datetime)}</p>
                        <p className="font-bold text-lg text-white">{parseFloat(p.t).toFixed(0)}°C</p>
                        <p className="text-xs text-white/90">💧 {p.hu}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
}