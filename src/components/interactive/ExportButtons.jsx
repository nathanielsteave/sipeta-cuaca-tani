import React from 'react';
import * as XLSX from 'xlsx';

export default function ExportButtons({ dataToExport }) {
  // Fungsi untuk ekspor ke Excel
  const exportToExcel = () => {
    // Ubah data JSON (array of objects) menjadi worksheet Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Prakiraan');
    
    // Tulis dan simpan file Excel
    XLSX.writeFile(workbook, 'prakiraan-cuaca.xlsx');
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <button onClick={exportToExcel} className="bg-green-700 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-800 transition-all shadow-md text-sm sm:text-base">
        Excel
      </button>
    </div>
  );
}