// src/services/bmkg.ts

// Interface tidak perlu diubah
export interface Prakiraan {
    utc_datetime: string;
    local_datetime: string;
    t: string;
    hu: string;
    weather_desc: string;
    weather_desc_en: string;
    ws: string;
    wd: string;
    image: string;
}
export interface Lokasi {
    desa: string;
    kecamatan: string;
    kotkab: string;
    provinsi: string;
    lat: string;
    lon: string;
    timezone: string;
}
export interface WeatherData {
    lokasi: Lokasi;
    prakiraan: Prakiraan[];
}

// Fungsi yang telah diperbaiki untuk Nganjuk
export async function getWeatherForBagorKulon(): Promise<WeatherData | null> {
    const KODE_ADM4_BAGOR_KULON = "35.18.14.2007";
    const API_URL = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${KODE_ADM4_BAGOR_KULON}`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            console.error(`Gagal fetch data BMKG (status: ${response.status})`);
            return null;
        }

        const data = await response.json();

        if (!data || !data.lokasi || !data.data || !Array.isArray(data.data[0]?.cuaca)) {
            console.error("Struktur data JSON dari BMKG tidak sesuai harapan.");
            return null;
        }
        
        // --- PERBAIKAN KUNCI DI SINI ---
        // 'data.data[0].cuaca' adalah array berisi array harian.
        // Kita gunakan .flat() untuk menggabungkannya menjadi satu array panjang.
        const prakiraanPerHari: Prakiraan[][] = data.data[0].cuaca;
        const semuaPrakiraan: Prakiraan[] = prakiraanPerHari.flat();

        const result: WeatherData = {
            lokasi: data.lokasi,
            prakiraan: semuaPrakiraan, // Sekarang ini sudah menjadi array yang benar
        };

        return result;

    } catch (error) {
        console.error("Terjadi error saat memproses data BMKG:", error);
        return null;
    }
}