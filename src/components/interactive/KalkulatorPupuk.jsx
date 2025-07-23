import React, { useState, useMemo } from 'react';

// Rekomendasi dosis umum per hektar (10.000 m²) - DOSIS TELAH DISESUAIKAN
const rekomendasi = {
    padi: {
        urea: 300, // kg
        sp36: 150, // kg
        kcl: 100,   // kg
        phonska: 300, // kg (sebagai alternatif/tambahan)
    },
    bawang: {
        urea: 200, // kg
        sp36: 300, // kg
        kcl: 200,  // kg
        za: 300,   // kg
        phonska: 400, // kg
        npk16: 250, // kg
    },
    jagung: {
        urea: 400, // kg
        sp36: 200, // kg
        kcl: 150,  // kg
        phonska: 300, // kg
    },
    kedelai: {
        urea: 100,  // kg
        sp36: 150,  // kg
        kcl: 150,   // kg
        phonska: 250, //kg
    },
    melon: {
        urea: 150,
        sp36: 200,
        kcl: 200,
        npk16: 300,
        za: 100,
    },
    semangka: {
        urea: 150,
        sp36: 200,
        kcl: 200,
        npk16: 300,
        za: 100,
    }
};

export default function KalkulatorPupuk() {
    const [luas, setLuas] = useState(1);
    const [satuan, setSatuan] = useState('hektar');
    const [tanaman, setTanaman] = useState('padi');

    const luasDalamHektar = useMemo(() => {
        if (satuan === 'hektar') {
            return luas || 0;
        }
        if (satuan === 'ru') {
            return (luas * 14) / 10000; // 1 ru = 14 m²
        }
        return (luas) / 10000; // m²
    }, [luas, satuan]);

    const hasil = useMemo(() => {
        const dosis = rekomendasi[tanaman];
        const hasilKalkulasi = {};
        for (const pupuk in dosis) {
            hasilKalkulasi[pupuk] = (dosis[pupuk] * luasDalamHektar).toFixed(2);
        }
        return hasilKalkulasi;
    }, [luasDalamHektar, tanaman]);

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Kolom Input */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-black">1. Pilih Tanaman</label>
                        <select
                            value={tanaman}
                            onChange={(e) => setTanaman(e.target.value)}
                            className="mt-1 block w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-black"
                        >
                            <option value="padi">Padi</option>
                            <option value="bawang">Bawang Merah</option>
                            <option value="jagung">Jagung</option>
                            <option value="kedelai">Kedelai</option>
                            <option value="melon">Melon</option>
                            <option value="semangka">Semangka</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black">2. Masukkan Luas Lhan</label>
                        <div className="flex mt-1">
                            <input
                                type="number"
                                value={luas}
                                onChange={(e) => setLuas(parseFloat(e.target.value))}
                                className="w-2/3 p-2 border border-r-0 border-neutral-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500 text-black"
                                placeholder="Contoh: 1"
                            />
                            <select
                                value={satuan}
                                onChange={(e) => setSatuan(e.target.value)}
                                className="w-1/3 p-2 border border-neutral-300 rounded-r-md bg-neutral-50 text-black"
                            >
                                <option value="hektar">Hektar</option>
                                <option value="m2">m²</option>
                                <option value="ru">Ru</option>
                            </select>
                        </div>
                         <p className="text-xs text-black mt-1">1 Hektar = 10000 m²</p>
                    </div>
                </div>

                {/* Kolom Hasil */}
                <div className="bg-primary-50 p-4 rounded-lg text-black">
                    <h3 className="font-bold text-lg mb-2">Rekomendasi Kebutuhan Pupuk:</h3>
                    <div className="space-y-2 text-sm">
                        {Object.entries(hasil).map(([pupuk, jumlah]) => (
                            <div key={pupuk} className="flex justify-between">
                                <span>{pupuk.charAt(0).toUpperCase() + pupuk.slice(1)}:</span>
                                <span className="font-bold">{jumlah} kg</span>
                            </div>
                        ))}
                    </div>
                     <p className="text-xs mt-4">*Dosis ini adalah rekomendasi umum yang telah disesuaikan. Tetap perhatikan kondisi spesifik lahan dan tanaman Anda.</p>
                </div>
            </div>
        </div>
    );
}