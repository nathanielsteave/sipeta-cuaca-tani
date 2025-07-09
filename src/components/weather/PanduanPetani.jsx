import React, { useState, useEffect } from 'react';

const getPanduan = (weatherData) => {
    const panduan = [];
    const current = weatherData.prakiraan[0];
    const akanHujan = weatherData.prakiraan.slice(0, 4).some(p => parseInt(p.image) >= 60);

    if (current.hu > 85) {
        panduan.push({ 
            icon: "🍄", 
            judul: "Rekomendasi: Cek Hama", 
            isi: "Kelembapan tinggi. Periksa tanaman dari potensi jamur/hama. Pastikan drainase baik." 
        });
    }

    if (akanHujan) {
        panduan.push({ 
            icon: "💧", 
            judul: "Aksi: Tunda Pemupukan", 
            isi: "Ada potensi hujan. Tunda penyemprotan atau pemupukan. Amankan hasil panen yang dijemur." 
        });
    } else {
        panduan.push({ 
            icon: "☀️", 
            judul: "Rekomendasi: Lahan Siap", 
            isi: "Cuaca cerah. Waktu ideal untuk mengolah tanah, memupuk, atau melakukan penyemprotan." 
        });
    }
    
    return panduan;
};

export default function PanduanPetani({ weatherData }) {
    const [isNight, setIsNight] = useState(false);

    useEffect(() => {
        const hour = new Date().getHours();
        setIsNight(hour >= 18 || hour < 6);
    }, []);

    if (!weatherData) return null;
    const panduanList = getPanduan(weatherData);

    // --- PERUBAHAN DI SINI: Latar belakang dan warna dinamis ---
    const backgroundClass = isNight
        ? 'from-nightsky-800 to-nightsky-900'
        : 'from-sky-300 to-sky-500';
        
    const titleClass = isNight ? 'text-sky-200' : 'text-white';
    const cardBgClass = isNight ? 'bg-nightsky-700/50' : 'bg-sky-400/50';
    const cardTitleClass = isNight ? 'text-sky-200' : 'text-white';
    const cardTextClass = isNight ? 'text-neutral-300' : 'text-white/90';

    return (
        <div className={`bg-gradient-to-br ${backgroundClass} p-6 rounded-2xl shadow-lg h-full transition-transform duration-300 hover:scale-105`}>
            <h3 className={`text-xl font-bold ${titleClass} mb-4`}>Panduan Cerdas Petani</h3>
            <div className="space-y-4">
                {panduanList.map((p, index) => (
                    <div key={index} className={`flex items-start gap-4 p-3 ${cardBgClass} rounded-lg`}>
                        <div className="text-3xl mt-1">{p.icon}</div>
                        <div>
                            <h4 className={`font-bold ${cardTitleClass}`}>{p.judul}</h4>
                            <p className={`text-sm ${cardTextClass}`}>{p.isi}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}