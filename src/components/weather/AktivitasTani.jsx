import React from 'react';

// Fungsi ini akan menerima data prakiraan per jam.
// Logika untuk menentukan kondisi umum tidak perlu diubah.
const getGardeningCondition = (weatherData) => {
    // Memastikan weatherData dan prakiraan ada
    if (!weatherData?.prakiraan?.length) {
        return { status: 'Kurang Baik', reason: 'Data cuaca tidak tersedia.' };
    }

    const prakiraanSaatIni = weatherData.prakiraan[0];
    // Dengan data per jam, slice(1, 4) berarti memeriksa 3 jam ke depan.
    const prakiraanNanti = weatherData.prakiraan.slice(1, 4); 

    const suhu = parseInt(prakiraanSaatIni.t);
    const kodeCuaca = parseInt(prakiraanSaatIni.image);
    const jam = new Date(prakiraanSaatIni.local_datetime).getHours();

    // Pengecekan potensi hujan dalam 3 jam ke depan menjadi lebih akurat.
    const akanHujan = prakiraanNanti.some(p => parseInt(p.image) >= 60);

    if (jam >= 18 || jam < 6) {
        return { status: 'Kurang Baik', reason: 'Waktu istirahat. Aktivitas pertanian tidak disarankan.' };
    }
    if (kodeCuaca >= 60 || akanHujan) {
        return { status: 'Kurang Baik', reason: 'Potensi hujan. Tunda aktivitas pemupukan dan penyemprotan.' };
    }
    if (suhu > 34) {
        return { status: 'Kurang Baik', reason: 'Cuaca sangat panas. Hindari aktivitas berat untuk mencegah dehidrasi.' };
    }
     if (suhu < 20) {
        return { status: 'Kurang Baik', reason: 'Cuaca terlalu dingin, kurang ideal untuk sebagian besar aktivitas.' };
    }
    if (kodeCuaca <= 3 && suhu >= 24 && suhu <= 32) {
         return { status: 'Sangat Baik', reason: 'Cuaca cerah dan suhu ideal. Waktu yang tepat untuk semua aktivitas.' };
    }

    return { status: 'Baik', reason: 'Cuaca cukup mendukung untuk aktivitas seperti penyiangan atau persiapan lahan.' };
};

// Fungsi ini sekarang akan menampilkan status per jam untuk 4 jam ke depan.
const getHourlyGardeningStatus = (prakiraan) => {
    // Mengambil 4 data prakiraan berikutnya, yang berarti 4 jam ke depan.
    return prakiraan.slice(1, 5).map(p => { 
        const code = parseInt(p.image);
        const temp = parseInt(p.t);
        const jam = new Date(p.local_datetime).getHours();
        
        let status = 'Baik';
        let icon = '👍';

        if (jam >= 18 || jam < 6) {
            status = 'Istirahat';
            icon = '😴';
        } 
        else if (code >= 60) {
            status = 'Hujan';
            icon = '🌧️';
        } else if (temp > 34) {
            status = 'Panas';
            icon = '🥵';
        }
        
        return {
            time: new Date(p.local_datetime).toLocaleTimeString('id-ID', { hour: 'numeric', hour12: false }),
            status,
            icon,
        };
    });
};


export default function AktivitasTani({ weatherData }) {
    if (!weatherData) return null;

    const condition = getGardeningCondition(weatherData);
    const hourlyStatus = getHourlyGardeningStatus(weatherData.prakiraan);

    return (
        <div className="bg-gradient-to-br from-sky-300 to-sky-500 p-6 rounded-2xl shadow-lg h-full transition-transform duration-300 hover:scale-105 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">Aktivitas Pertanian</h3>
            <div className="flex-grow grid grid-cols-2 gap-4">
                {/* Sisi Kiri (kondisi saat ini) */}
                <div className="flex flex-col items-center justify-center text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M15.146 3.42a1 1 0 010 1.414l-1.414 1.415a1 1 0 11-1.414-1.415l1.414-1.414a1 1 0 011.414 0zM11.92 6.24a1 1 0 00-1.414 0L4.14 12.607a1 1 0 000 1.414l2.122 2.121a1 1 0 001.414 0l6.364-6.364a1 1 0 000-1.414l-2.121-2.121zM5.858 15.43l-1.415-1.414a1 1 0 00-1.414 1.414l1.414 1.415a1 1 0 001.415-1.414z" clipRule="evenodd" />
                        <path d="M4 10.586l.293-.293a1 1 0 111.414 1.414L3.414 14A2 2 0 012 12.586V11a1 1 0 112 0v1.586zM17 5a1 1 0 10-2 0v1.586a2 2 0 01-1.293 1.828l-2.121 1.06-1.06 2.122a1 1 0 101.414 1.414l1.06-2.121 2.122-1.06A2 2 0 0118 8.586V7a1 1 0 10-2 0v-2z" />
                    </svg>
                    <p className="text-2xl font-bold mt-2 text-white">{condition.status}</p>
                    <p className="text-sm text-white">{condition.reason}</p>
                </div>
                {/* Sisi Kanan (prakiraan per jam) */}
                <div className="flex flex-col items-center justify-center space-y-2">
                    {hourlyStatus.map((h, i) => (
                        <div key={i} className="flex items-center justify-between w-full text-sm">
                            <span className="font-semibold text-white">{h.time}:00</span>
                            <span className="text-white">{h.status}</span>
                            <span className="text-xl">{h.icon}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}