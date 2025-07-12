import React from 'react';

// Fungsi baru untuk memperkirakan Indeks UV dengan lebih akurat
const getUVIndex = (prakiraan) => {
    if (!prakiraan) return { value: 0, description: 'Data tidak tersedia' };

    const prakiraanSaatIni = prakiraan[0];
    const jam = new Date(prakiraanSaatIni.local_datetime).getHours();
    const kodeCuaca = parseInt(prakiraanSaatIni.image);

    let uvIndex = 0;

    // Logika yang lebih realistis berdasarkan waktu di Indonesia
    // Puncak tertinggi terjadi sekitar jam 11:00 - 13:00
    if (jam >= 9 && jam < 15) {
        if (jam === 9) uvIndex = 5;
        else if (jam === 10) uvIndex = 8;
        else if (jam >= 11 && jam <= 13) uvIndex = 10; // Nilai puncak
        else if (jam === 14) uvIndex = 7;
    } else if (jam === 8 || jam === 15) {
        uvIndex = 2; // UV rendah di pagi/sore hari
    }

    // Pengurangan nilai UV berdasarkan tutupan awan
    if (kodeCuaca === 3) { // Berawan
        uvIndex *= 0.6;
    } else if (kodeCuaca === 4) { // Berawan Tebal
        uvIndex *= 0.4;
    } else if (kodeCuaca >= 60) { // Hujan atau sangat mendung
        uvIndex = Math.min(uvIndex, 1); // Batasi maksimal 1 jika hujan
    }

    const uvValue = Math.round(uvIndex);
    let description = 'Rendah';
    if (uvValue >= 3 && uvValue <= 5) description = 'Sedang';
    if (uvValue >= 6 && uvValue <= 7) description = 'Tinggi';
    if (uvValue >= 8 && uvValue <= 10) description = 'Sangat Tinggi';
    if (uvValue >= 11) description = 'Ekstrem';

    return { value: uvValue, description };
};


export default function UVIndexCard({ weatherData }) {
    const uvInfo = getUVIndex(weatherData?.prakiraan);

    return (
        <div className="bg-gradient-to-br from-sky-300 to-sky-500 p-4 rounded-2xl shadow-lg h-full transition-transform duration-300 hover:scale-105 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-3 text-white/90">
                    <span className="text-xl">☀️</span>
                    <h4 className="font-semibold">Indeks UV</h4>
                </div>
                
                <div className="my-2">
                    <p className="text-4xl font-bold text-white leading-tight">{uvInfo.value}</p>
                    <p className="text-lg font-semibold text-sky-100 -mt-1">{uvInfo.description}</p>
                </div>
            </div>
            <p className="text-xs text-sky-100 mt-1">Gunakan pelindung saat di luar ruangan</p>
        </div>
    );
}