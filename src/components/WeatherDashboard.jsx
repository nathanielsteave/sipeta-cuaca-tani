// src/components/WeatherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { getWeatherForBagorKulon } from '../services/bmkg.ts'; // Pastikan path ini benar

// Import semua komponen display Anda
import CurrentWeather from './weather/CurrentWeather';
import HourlyForecast from './weather/HourlyForecast';
import DailyForecast from './weather/DailyForecast';
import PanduanPetani from './weather/PanduanPetani';
import InfoCard from './weather/InfoCard';
import ExportButtons from './interactive/ExportButtons';

export default function WeatherDashboard() {
  // State untuk menyimpan data cuaca, status loading, dan error
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect akan berjalan di browser pengguna setelah halaman dimuat
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
  }, []); // Array kosong memastikan ini hanya berjalan sekali saat komponen dimuat

  // Tampilkan pesan loading
  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold dark:text-white">Sedang mengambil data cuaca terbaru...</p>
      </div>
    );
  }

  // Tampilkan pesan error jika ada
  if (error) {
    return (
      <div className="text-center py-20 bg-red-100 dark:bg-red-900/50 p-6 rounded-lg">
        <p className="text-red-700 dark:text-red-300 font-bold">Terjadi Kesalahan</p>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }
  
  // Jika data berhasil dimuat, tampilkan semua komponen
  if (weatherData) {
    const { lokasi, prakiraan } = weatherData;
    const prakiraanTerkini = prakiraan[0];
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
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">
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
          <PanduanPetani weatherData={weatherData} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCard icon="💨" title="Angin" value={prakiraanTerkini.ws} unit="km/jam" description={`Arah ${prakiraanTerkini.wd}`} />
          <InfoCard icon="🌡️" title="Suhu" value={prakiraanTerkini.t} unit="°C" description="Suhu saat ini" />
          <InfoCard icon="💧" title="Kelembapan" value={prakiraanTerkini.hu} unit="%" description="Kelembapan udara" />
          <InfoCard icon="🕒" title="Waktu" value={new Date(prakiraanTerkini.local_datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} unit="" description="Waktu data terakhir" />
        </div>
      </div>
    );
  }

  return null; // Tampilkan null jika tidak ada data sama sekali
}