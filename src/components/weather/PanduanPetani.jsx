import React from 'react';

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
    if (!weatherData) return null;
    const panduanList = getPanduan(weatherData);

    return (
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-md h-full transition-transform duration-300 hover:scale-105">
            <h3 className="text-xl font-bold text-primary-800 dark:text-primary-200 mb-4">Panduan Cerdas Petani</h3>
            <div className="space-y-4">
                {panduanList.map((p, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
                        <div className="text-3xl mt-1">{p.icon}</div>
                        <div>
                            <h4 className="font-bold text-secondary-900 dark:text-secondary-100">{p.judul}</h4>
                            <p className="text-sm text-neutral-700 dark:text-neutral-300">{p.isi}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}