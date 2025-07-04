import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

export default function ExportButtons({ dataToExport, elementIdToCapture }) {
  // Fungsi untuk ekspor ke PDF
  const exportToPDF = () => {
    // Cari elemen HTML dengan id yang diberikan (misal: "weather-dashboard")
    const input = document.getElementById(elementIdToCapture);
    if (!input) { alert("Elemen untuk di-export tidak ditemukan!"); return; }
    
    // Gunakan html2canvas untuk mengubah elemen HTML menjadi gambar
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Tambahkan gambar ke PDF dan simpan
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('prakiraan-cuaca.pdf');
    });
  };

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
      <button onClick={exportToPDF} className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition-all shadow-md text-sm sm:text-base">
        PDF
      </button>
      <button onClick={exportToExcel} className="bg-green-700 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-800 transition-all shadow-md text-sm sm:text-base">
        Excel
      </button>
    </div>
  );
}