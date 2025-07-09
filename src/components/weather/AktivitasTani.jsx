import React from 'react';

// Fungsi untuk menentukan kondisi aktivitas pertanian
const getGardeningCondition = (prakiraan) => {
    const current = prakiraan[0];
    const code = parseInt(current.image);
    const temp = parseInt(current.t);

    if (code >= 60) return { status: 'Kurang Baik', reason: 'Ada potensi hujan, tunda aktivitas.' };
    if (temp > 34) return { status: 'Cukup Baik', reason: 'Suhu panas, hindari aktivitas berat.' };
    if (code >= 3) return { status: 'Baik', reason: 'Cuaca berawan, ideal untuk menanam.' };
    
    return { status: 'Sangat Baik', reason: 'Cuaca cerah, waktu yang tepat.' };
};

// Fungsi untuk mendapatkan status aktivitas per jam
const getHourlyGardeningStatus = (prakiraan) => {
    return prakiraan.slice(1, 4).map(p => {
        const code = parseInt(p.image);
        let status = 'Baik';
        let icon = '😊';

        if (code >= 60) {
            status = 'Kurang';
            icon = '☹️';
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

    const condition = getGardeningCondition(weatherData.prakiraan);
    const hourlyStatus = getHourlyGardeningStatus(weatherData.prakiraan);

    return (
        <div className="bg-gradient-to-br from-sky-300 to-sky-500 dark:from-nightsky-800 dark:to-nightsky-900 p-6 rounded-2xl shadow-lg h-full transition-transform duration-300 hover:scale-105 flex flex-col">
            {/* --- PERUBAHAN DI SINI --- */}
            <h3 className="text-xl font-bold text-white mb-4">Aktivitas Pertanian</h3>
            <div className="flex-grow grid grid-cols-2 gap-4">
                {/* Sisi Kiri */}
                <div className="flex flex-col items-center justify-center text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-800 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M15.146 3.42a1 1 0 010 1.414l-1.414 1.415a1 1 0 11-1.414-1.415l1.414-1.414a1 1 0 011.414 0zM11.92 6.24a1 1 0 00-1.414 0L4.14 12.607a1 1 0 000 1.414l2.122 2.121a1 1 0 001.414 0l6.364-6.364a1 1 0 000-1.414l-2.121-2.121zM5.858 15.43l-1.415-1.414a1 1 0 00-1.414 1.414l1.414 1.415a1 1 0 001.415-1.414z" clipRule="evenodd" />
                        <path d="M4 10.586l.293-.293a1 1 0 111.414 1.414L3.414 14A2 2 0 012 12.586V11a1 1 0 112 0v1.586zM17 5a1 1 0 10-2 0v1.586a2 2 0 01-1.293 1.828l-2.121 1.06-1.06 2.122a1 1 0 101.414 1.414l1.06-2.121 2.122-1.06A2 2 0 0118 8.586V7a1 1 0 10-2 0v-2z" />
                    </svg>
                    <p className="text-2xl font-bold mt-2 text-black dark:text-white">{condition.status}</p>
                    <p className="text-sm text-black dark:text-white">{condition.reason}</p>
                </div>
                {/* Sisi Kanan */}
                <div className="flex flex-col items-center justify-center space-y-2">
                    {hourlyStatus.map((h, i) => (
                        <div key={i} className="flex items-center justify-between w-full text-sm">
                            <span className="font-semibold text-black dark:text-white">{h.time}:00</span>
                            <span className="text-black dark:text-white">{h.status}</span>
                            <span className="text-xl">{h.icon}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}