import { XMLParser } from 'fast-xml-parser';

export interface WeatherArea {
    name: string;
    latitude: string;
    longitude: string;
    temperature: { time: string; value: string }[];
    weather: { time: string; code: string; name: string }[];
}

const weatherCodes: { [key: string]: string } = {
    '0': 'Cerah', '100': 'Cerah', '1': 'Cerah Berawan', '101': 'Cerah Berawan',
    '2': 'Cerah Berawan', '102': 'Cerah Berawan', '3': 'Berawan', '103': 'Berawan',
    '4': 'Berawan Tebal', '104': 'Berawan Tebal', '5': 'Udara Kabur', '10': 'Asap',
    '45': 'Kabut', '60': 'Hujan Ringan', '61': 'Hujan Sedang', '63': 'Hujan Lebat',
    '80': 'Hujan Lokal', '95': 'Hujan Petir', '97': 'Hujan Petir'
};

export async function getWeatherData(provinsi: string = "JawaBarat"): Promise<WeatherArea[] | null> {
    const URL = `https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-${provinsi}.xml`;
    try {
        const response = await fetch(URL);
        if (!response.ok) throw new Error(`Gagal fetch data BMKG (status: ${response.status})`);
        const xmlData = await response.text();
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
        const jsonData = parser.parse(xmlData);
        const areas = jsonData.data.forecast.area;
        return areas.map((area: any): WeatherArea => {
            const tempParam = area.parameter.find((p: any) => p.id === 't');
            const weatherParam = area.parameter.find((p: any) => p.id === 'weather');
            return {
                name: area.description,
                latitude: area.latitude,
                longitude: area.longitude,
                temperature: tempParam?.timerange.map((tr: any) => ({ time: tr.datetime, value: tr.value.find((v: any) => v.unit === 'C')['#text'] })) || [],
                weather: weatherParam?.timerange.map((tr: any) => ({ time: tr.datetime, code: tr.value['#text'], name: weatherCodes[tr.value['#text']] || 'Tidak Diketahui' })) || []
            };
        });
    } catch (error) {
        console.error("Error fetching BMKG data:", error);
        return null;
    }
}