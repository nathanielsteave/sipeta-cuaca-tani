import React, { useState } from 'react';

// --- LOGIKA BARU DENGAN PANDUAN SPESIFIK TANAMAN ---
const getPanduan = (weatherData, tanaman) => {
    let panduan = [];
    if (!weatherData?.prakiraan?.length) {
        return panduan;
    }
    
    const prakiraanSaatIni = weatherData.prakiraan[0];
    const prakiraanNanti = weatherData.prakiraan.slice(1, 4);

    const akanHujan = prakiraanNanti.some(p => parseInt(p.image) >= 60);
    const akanAnginKencang = prakiraanNanti.some(p => parseFloat(p.ws) > 15);
    const akanPanasTerik = prakiraanNanti.some(p => parseInt(p.t) > 34);
    const anginTenangSekarang = parseFloat(prakiraanSaatIni.ws) < 10;
    const lembapTinggiSekarang = parseInt(prakiraanSaatIni.hu) > 85;

    // --- PANDUAN SPESIFIK UNTUK PADI ---
    if (tanaman === 'padi') {
        if (akanAnginKencang && akanPanasTerik) {
            panduan.push({ 
                prioritas: 1, icon: "💨", 
                judul: "Waspada Ledakan Wereng", 
                isi: "Kombinasi angin panas sangat disukai wereng. Pantau pangkal batang. Jika populasi tinggi, semprot insektisida sore hari." 
            });
        }
        if (akanHujan) {
            panduan.push({ 
                prioritas: 1, icon: "🌧️", 
                judul: "Jaga Sirkulasi Air", 
                isi: "Hujan akan datang. Pastikan saluran drainase lancar untuk mencegah air tergenang terlalu lama yang dapat menyebabkan busuk akar." 
            });
        }
        if (anginTenangSekarang && !akanHujan) {
             panduan.push({ 
                prioritas: 2, icon: "✅", 
                judul: "Waktu Terbaik Pemupukan", 
                isi: "Cuaca ideal untuk pemupukan daun atau penyemprotan. Nutrisi akan terserap maksimal tanpa gangguan angin atau hujan." 
            });
        }
        if (lembapTinggiSekarang) {
             panduan.push({
                prioritas: 3, icon: "🍄", 
                judul: "Cegah Jamur & Kresek", 
                isi: "Kelembapan tinggi memicu hawar pelepah dan bakteri kresek. Jaga sawah tetap bersih dari gulma untuk sirkulasi udara."
            });
        }
    } 
    // --- PANDUAN SPESIFIK UNTUK BAWANG MERAH ---
    else if (tanaman === 'bawang') {
        if (akanHujan) {
            panduan.push({ 
                prioritas: 1, icon: "⚠️", 
                judul: "KRITIS: Amankan Panen!", 
                isi: "Ada prediksi hujan! Jika bawang siap panen, segera cabut sekarang juga. Umbi bisa busuk jika terlanjur basah di tanah." 
            });
        }
        if (lembapTinggiSekarang) {
            panduan.push({ 
                prioritas: 1, icon: "🐛", 
                judul: "Waspada Layu & Trotol", 
                isi: "Kelembapan ekstrem adalah pemicu utama jamur layu (Fusarium) dan bercak ungu (Trotol). Periksa daun dan umbi dengan teliti." 
            });
        }
        if (akanPanasTerik) {
             panduan.push({ 
                prioritas: 2, icon: "☀️", 
                judul: "Siram di Sore Hari", 
                isi: "Cuaca akan sangat panas. Siram secukupnya setelah jam 4 sore untuk mendinginkan tanah tanpa membuat daun gosong." 
            });
        }
        if (anginTenangSekarang && !akanHujan) {
             panduan.push({ 
                prioritas: 2, icon: "👍", 
                judul: "Jendela Perawatan Terbuka", 
                isi: "Kondisi sempurna untuk penyiangan gulma, pemupukan susulan, atau aplikasi pestisida/fungisida karena akan sangat efektif." 
            });
        }
    }

    panduan.sort((a, b) => a.prioritas - b.prioritas);
    
    if (panduan.length === 0) {
        panduan.push({
            icon: "🧐",
            judul: "Kondisi Cuaca Stabil",
            isi: "Tidak ada peringatan cuaca signifikan. Lanjutkan perawatan rutin sesuai jadwal. Periksa kondisi tanaman secara berkala."
        });
    }

    return panduan.slice(0, 2);
};


export default function PanduanPetani({ weatherData }) {
    const [tanamanAktif, setTanamanAktif] = useState('padi');

    if (!weatherData) return null;

    const panduanList = getPanduan(weatherData, tanamanAktif);
    
    const getButtonClass = (tanaman) => {
        const baseClass = "px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300";
        if (tanaman === tanamanAktif) {
            return `${baseClass} bg-white text-sky-700 shadow`;
        }
        return `${baseClass} bg-white/20 text-white hover:bg-white/40`;
    }

    return (
        <div className="bg-gradient-to-br from-sky-300 to-sky-500 p-6 rounded-2xl shadow-lg h-full transition-transform duration-300 hover:scale-105">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Panduan Tani Cerdas</h3>
                <div className="flex items-center gap-2 bg-sky-900/20 p-1 rounded-full">
                    <button onClick={() => setTanamanAktif('padi')} className={getButtonClass('padi')}>
                        Padi
                    </button>
                    <button onClick={() => setTanamanAktif('bawang')} className={getButtonClass('bawang')}>
                        Bawang Merah
                    </button>
                </div>
            </div>
            <div className="space-y-3">
                {panduanList.map((p, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 bg-sky-400/50 rounded-lg">
                        <div className="text-3xl mt-1">{p.icon}</div>
                        <div>
                            <h4 className="font-bold text-white">{p.judul}</h4>
                            <p className="text-sm text-white/90">{p.isi}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}