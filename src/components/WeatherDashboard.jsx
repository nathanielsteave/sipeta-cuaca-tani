import React, { useState, useEffect } from 'react';
import { getWeatherForBagorKulon } from '../services/bmkg.ts';

// Impor semua komponen display yang diperlukan
import CurrentWeather from './weather/CurrentWeather';
import HourlyForecast from './weather/HourlyForecast';
import DailyForecast from './weather/DailyForecast';
import PanduanPetani from './weather/PanduanPetani';
import AktivitasTani from './weather/AktivitasTani.jsx';
import InfoCard from './weather/InfoCard';
import ExportButtons from './interactive/ExportButtons';
// Impor komponen kartu baru
import UVIndexCard from './weather/UVIndexCard';
import PeringatanDiniCard from './weather/PeringatanDiniCard';

// Fungsi untuk melakukan interpolasi data dari 3-jam-an menjadi per jam
const interpolateForecast = (prakiraan) => {
    if (!prakiraan || prakiraan.length < 2) return prakiraan;

    const hourly = [];
    for (let i = 0; i < prakiraan.length - 1; i++) {
        const start = prakiraan[i];
        const end = prakiraan[i + 1];

        const startDate = new Date(start.local_datetime);
        const endDate = new Date(end.local_datetime);
        const hourDiff = Math.round((endDate - startDate) / (1000 * 60 * 60));

        hourly.push(start); // Selalu tambahkan data awal dari interval

        if (hourDiff > 1) { // Lakukan interpolasi jika ada jeda waktu
            const startTemp = parseFloat(start.t);
            const endTemp = parseFloat(end.t);
            const startHum = parseFloat(start.hu);
            const endHum = parseFloat(end.hu);

            for (let j = 1; j < hourDiff; j++) {
                const interpDate = new Date(startDate.getTime() + j * 60 * 60 * 1000);
                const interpTemp = startTemp + (endTemp - startTemp) * (j / hourDiff);
                const interpHum = startHum + (endHum - startHum) * (j / hourDiff);

                hourly.push({
                    ...start,
                    local_datetime: interpDate.toISOString(),
                    t: interpTemp.toFixed(1),
                    hu: interpHum.toFixed(0),
                });
            }
        }
    }
    hourly.push(prakiraan[prakiraan.length - 1]); // Tambahkan data paling akhir
    return hourly;
};


export default function WeatherDashboard() {
  const [originalWeatherData, setOriginalWeatherData] = useState(null);
  const [hourlyWeatherData, setHourlyWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getWeatherForBagorKulon();
        if (data && data.prakiraan) {
          // Simpan data asli untuk komponen DailyForecast
          setOriginalWeatherData(data);

          // Buat data per jam untuk komponen lain
          const interpolatedPrakiraan = interpolateForecast(data.prakiraan);
          setHourlyWeatherData({
            ...data,
            prakiraan: interpolatedPrakiraan,
          });

        } else {
          throw new Error('Gagal memuat data prakiraan cuaca.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold text-black">Sedang mengambil data cuaca terbaru...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-100 p-6 rounded-lg">
        <p className="text-red-700 font-bold">Terjadi Kesalahan</p>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (hourlyWeatherData && originalWeatherData) {
    const { lokasi } = hourlyWeatherData;
    const prakiraanTerkini = hourlyWeatherData.prakiraan[0];
    
    const getWateringNeed = (prakiraan) => {
        const willRainSoon = prakiraan.slice(0, 4).some(p => parseInt(p.image) >= 60);
        if (willRainSoon) return { value: "Rendah", desc: "Akan segera turun hujan" };
        const current = prakiraan[0];
        if (parseInt(current.t) > 32 && parseInt(current.hu) < 75) return { value: "Tinggi", desc: "Cuaca panas dan kering" };
        return { value: "Normal", desc: "Cek kelembapan tanah" };
    };

    const wateringNeed = getWateringNeed(hourlyWeatherData.prakiraan);
    const dataForExcel = hourlyWeatherData.prakiraan.map(p => ({
        WaktuLokal: p.local_datetime,
        SuhuC: p.t,
        KelembapanPersen: p.hu,
        Deskripsi: p.weather_desc,
        KecepatanAngin: `${p.ws} km/jam`,
        ArahAngin: p.wd,
    }));

    return (
      <div className="space-y-6" id="weather-dashboard">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Prakiraan Cuaca untuk {lokasi.desa}
            </h1>
            <p className="text-neutral-800">
              {lokasi.kecamatan}, {lokasi.kotkab}, {lokasi.provinsi}
            </p>
          </div>
          <ExportButtons dataToExport={dataForExcel} />
        </div>

        <CurrentWeather data={prakiraanTerkini} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PanduanPetani weatherData={hourlyWeatherData} />
          <AktivitasTani weatherData={hourlyWeatherData} />
        </div>

        <HourlyForecast prakiraan={hourlyWeatherData.prakiraan} />
        
        <DailyForecast prakiraan={originalWeatherData.prakiraan} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCard icon="💨" title="Angin" value={prakiraanTerkini.ws} unit="km/jam" description={`Arah ${prakiraanTerkini.wd}`} />
          <InfoCard icon="💧" title="Kebutuhan Air" value={wateringNeed.value} unit="" description={wateringNeed.desc} />
          <UVIndexCard weatherData={hourlyWeatherData} />
          <PeringatanDiniCard weatherData={hourlyWeatherData} />
        </div>
      </div>
    );
  }

  return null;
}