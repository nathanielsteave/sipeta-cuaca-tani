import React from 'react';

// Fungsi untuk memeriksa potensi cuaca ekstrem (tidak berubah)
const getPeringatanDini = (prakiraan) => {
    if (!prakiraan) return { icon: '✅', title: 'Aman', message: 'Data tidak tersedia.' };
    const prakiraan24Jam = prakiraan.slice(0, 24);

    const anginKencang = prakiraan24Jam.find(p => parseFloat(p.ws) > 25);
    if (anginKencang) {
        const jam = new Date(anginKencang.local_datetime).toLocaleTimeString('id-ID', { hour: '2-digit' });
        return {
            icon: '💨',
            title: 'Angin Kencang',
            message: `Potensi >25 km/jam pukul ${jam}:00.`,
        };
    }

    const hujanPetir = prakiraan24Jam.find(p => parseInt(p.image) === 95 || parseInt(p.image) === 97);
    if (hujanPetir) {
        const jam = new Date(hujanPetir.local_datetime).toLocaleTimeString('id-ID', { hour: '2-digit' });
        return {
            icon: '⛈️',
            title: 'Hujan Petir',
            message: `Potensi petir sekitar pukul ${jam}:00.`,
        };
    }

    return { icon: '✅', title: 'Aman', message: 'Tidak ada potensi cuaca ekstrem.' };
};

export default function PeringatanDiniCard({ weatherData }) {
    const peringatan = getPeringatanDini(weatherData?.prakiraan);

    return (
        <div className="bg-gradient-to-br from-sky-300 to-sky-500 p-4 rounded-2xl shadow-lg h-full transition-transform duration-300 hover:scale-105 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-3 text-white/90">
                    <span className="text-xl">⚠️</span>
                    <h4 className="font-semibold">Peringatan Dini</h4>
                </div>
                <div className="my-2 flex items-baseline gap-2">
                    <p className="text-3xl">{peringatan.icon}</p>
                    <span className="text-lg font-bold text-white">{peringatan.title}</span>
                </div>
            </div>
            <p className="text-xs text-sky-100 mt-1">{peringatan.message}</p>
        </div>
    );
}