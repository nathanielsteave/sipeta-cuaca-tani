// src/components/WeatherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { getWeatherForBagorKulon } from '../services/bmkg.ts';

// Import semua komponen display Anda
import CurrentWeather from './weather/CurrentWeather';
import HourlyForecast from './weather/HourlyForecast';
import DailyForecast from './weather/DailyForecast';
import PanduanPetani from './weather/PanduanPetani';
import InfoCard from './weather/InfoCard';
import ExportButtons from './interactive/ExportButtons';
import AktivitasTani from './weather/AktivitasTani.jsx';

export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getWeatherForBagorKulon();
        if (data) {
          setWeatherData(data);
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

  const getWateringNeed = (prakiraan) => {
    const willRainSoon = prakiraan.slice(0, 4).some(p => parseInt(p.image) >= 60);

    if (willRainSoon) {
      return {
        value: "Rendah",
        desc: "Akan segera turun hujan."
      };
    }

    const current = prakiraan[0];
    if (parseInt(current.t) > 32 && parseInt(current.hu) < 75) {
      return {
        value: "Tinggi",
        desc: "Cuaca panas dan kering."
      };
    }

    return {
      value: "Normal",
      desc: "Cek kelembapan tanah."
    };
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold dark:text-white">Sedang mengambil data cuaca terbaru...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-100 dark:bg-red-900/50 p-6 rounded-lg">
        <p className="text-red-700 dark:text-red-300 font-bold">Terjadi Kesalahan</p>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (weatherData) {
    const { lokasi, prakiraan } = weatherData;
    const prakiraanTerkini = prakiraan[0];
    const wateringNeed = getWateringNeed(prakiraan); // Hitung kebutuhan air
    const dataForExcel = prakiraan.map(p => ({
        WaktuLokal: p.local_datetime,
        SuhuC: p.t,
        KelembapanPersen: p.hu,
        Deskripsi: p.weather_desc,
        KecepatanAngin: `${p.ws} km/jam`,
        ArahAngin: p.wd,
    }));

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Prakiraan Cuaca untuk {lokasi.desa}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {lokasi.kecamatan}, {lokasi.kotkab}, {lokasi.provinsi}
            </p>
          </div>
          <ExportButtons dataToExport={dataForExcel} elementIdToCapture="weather-dashboard" />
        </div>

        <CurrentWeather data={prakiraanTerkini} />
        <HourlyForecast prakiraan={prakiraan} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DailyForecast prakiraan={prakiraan} />
          {/* --- TAMPILKAN KARTU BARU DI SINI --- */}
          <AktivitasTani weatherData={weatherData} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCard icon="💨" title="Angin" value={prakiraanTerkini.ws} unit="km/jam" description={`Arah ${prakiraanTerkini.wd}`} />
          {/* --- TAMPILKAN KARTU KEBUTUHAN AIR DI SINI --- */}
          <InfoCard icon="💧" title="Kebutuhan Air" value={wateringNeed.value} unit="" description={wateringNeed.desc} />
          <InfoCard icon="🌡️" title="Suhu" value={prakiraanTerkini.t} unit="°C" description="Suhu saat ini" />
          <InfoCard icon="🕒" title="Waktu" value={new Date(prakiraanTerkini.local_datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} unit="" description="Waktu data terakhir" />
        </div>
      </div>
    );
  }

  return null;
}