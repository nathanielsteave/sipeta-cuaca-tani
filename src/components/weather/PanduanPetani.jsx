import React, { useState } from 'react';

// --- LOGIKA PANDUAN DENGAN JAGUNG DISERTAKAN KEMBALI ---
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
    // --- PANDUAN SPESIFIK UNTUK JAGUNG ---
    else if (tanaman === 'jagung') {
        if (akanPanasTerik) {
            panduan.push({
                prioritas: 1, icon: "🥵",
                judul: "Waspada Stres Kekeringan",
                isi: "Cuaca akan sangat panas. Pastikan penyiraman cukup, terutama pada fase pembungaan dan pengisian biji untuk mencegah gagal panen."
            });
        }
        if (akanHujan) {
            panduan.push({
                prioritas: 1, icon: "🌧️",
                judul: "Tunda Pemupukan",
                isi: "Hujan akan datang. Tunda pemupukan nitrogen (Urea) untuk menghindari pencucian unsur hara yang sia-sia."
            });
        }
        if (anginTenangSekarang && !akanHujan) {
            panduan.push({
                prioritas: 2, icon: "✅",
                judul: "Waktu Ideal Penyerbukan",
                isi: "Angin tenang sangat baik untuk proses penyerbukan alami. Hindari penyemprotan pestisida di pagi hari agar tidak mengganggu lebah."
            });
        }
        if (lembapTinggiSekarang) {
            panduan.push({
                prioritas: 3, icon: "🍄",
                judul: "Cegah Penyakit Bulai",
                isi: "Kelembapan tinggi memicu penyakit bulai. Pastikan jarak tanam tidak terlalu rapat untuk sirkulasi udara yang baik. Pertimbangkan aplikasi fungisida."
            });
        }
    }

    // --- PANDUAN SPESIFIK UNTUK KEDELAI ---
    else if (tanaman === 'kedelai') {
        if (akanPanasTerik) {
            panduan.push({
                prioritas: 1, icon: "🥵",
                judul: "Waspada Kekeringan",
                isi: "Cuaca akan sangat panas. Pastikan pengairan cukup, terutama fase pembungaan dan pengisian polong untuk mencegah kegagalan panen."
            });
        }
        if (akanHujan) {
            panduan.push({
                prioritas: 1, icon: "🌧️",
                judul: "Perbaiki Drainase",
                isi: "Curah hujan tinggi berisiko menyebabkan busuk polong dan menurunkan kualitas biji. Pastikan saluran air lancar."
            });
        }
        if (anginTenangSekarang && !akanHujan) {
            panduan.push({
                prioritas: 2, icon: "✅",
                judul: "Waktu Ideal Perawatan",
                isi: "Kondisi ideal untuk penyiangan gulma atau penyemprotan pestisida/fungisida karena akan lebih efektif."
            });
        }
        if (lembapTinggiSekarang) {
            panduan.push({
                prioritas: 3, icon: "🍄",
                judul: "Cegah Karat Daun & Antraknosa",
                isi: "Kelembapan tinggi memicu perkembangan penyakit jamur. Pantau daun dan batang secara berkala, pertimbangkan aplikasi fungisida jika perlu."
            });
        }
    }

    else if (tanaman === 'melon') {
        if (akanPanasTerik) {
            panduan.push({
                prioritas: 1, icon: "🥵",
                judul: "Penyiraman Intensif",
                isi: "Cuaca panas akan meningkatkan penguapan. Pastikan tanaman melon mendapatkan cukup air, terutama saat pembentukan buah."
            });
        }
        if (akanHujan) {
            panduan.push({
                prioritas: 1, icon: "🌧️",
                judul: "Waspada Jamur Daun",
                isi: "Hujan dapat memicu penyakit embun tepung (powdery mildew). Siapkan fungisida dan perbaiki sirkulasi udara di sekitar tanaman."
            });
        }
    }

    else if (tanaman === 'semangka') {
        if (akanPanasTerik) {
            panduan.push({
                prioritas: 1, icon: "🥵",
                judul: "Jaga Kelembapan Tanah",
                isi: "Semangka membutuhkan banyak air saat cuaca panas. Lakukan penyiraman secara teratur untuk mencegah buah pecah."
            });
        }
        if (akanHujan) {
            panduan.push({
                prioritas: 1, icon: "🌧️",
                judul: "Cegah Busuk Buah",
                isi: "Hujan berlebih dapat menyebabkan busuk buah. Pastikan drainase baik dan beri alas pada buah agar tidak langsung menyentuh tanah basah."
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
        <div className="bg-gradient-to-br from-sky-300 to-sky-500 p-6 rounded-2xl shadow-lg h-full transition-transform duration-300 hover:scale-105 flex flex-col">
            <h3 className="text-xl font-bold text-white">Panduan Tani Cerdas</h3>

            <div className="flex flex-wrap items-center gap-2 my-4">
                <button onClick={() => setTanamanAktif('padi')} className={getButtonClass('padi')}>
                    Padi
                </button>
                <button onClick={() => setTanamanAktif('bawang')} className={getButtonClass('bawang')}>
                    Bawang Merah
                </button>
                <button onClick={() => setTanamanAktif('jagung')} className={getButtonClass('jagung')}>
                    Jagung
                </button>
                <button onClick={() => setTanamanAktif('kedelai')} className={getButtonClass('kedelai')}>
                    Kedelai
                </button>
                {/* --- TOMBOL MELON DAN SEMANGKA DITAMBAHKAN --- */}
                <button onClick={() => setTanamanAktif('melon')} className={getButtonClass('melon')}>
                    Melon
                </button>
                <button onClick={() => setTanamanAktif('semangka')} className={getButtonClass('semangka')}>
                    Semangka
                </button>
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