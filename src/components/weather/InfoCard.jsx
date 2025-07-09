import React, { useState, useEffect } from 'react';

export default function InfoCard({ icon, title, value, unit, description }) {
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
      const hour = new Date().getHours();
      setIsNight(hour >= 18 || hour < 6);
  }, []);

  // --- PERUBAHAN DI SINI: Latar belakang dan warna dinamis ---
  const backgroundClass = isNight
    ? 'from-nightsky-800 to-nightsky-900'
    : 'from-sky-300 to-sky-500';

  const titleColor = isNight ? 'text-neutral-400' : 'text-white/90';
  const valueColor = isNight ? 'text-white' : 'text-white';
  const unitColor = isNight ? 'text-neutral-300' : 'text-sky-100';
  const descriptionColor = isNight ? 'text-neutral-400' : 'text-sky-100';

  return (
    <div className={`bg-gradient-to-br ${backgroundClass} p-4 rounded-2xl shadow-lg h-full transition-transform duration-300 hover:scale-105`}>
      <div className={`flex items-center gap-3 ${titleColor}`}>
        <span className="text-xl">{icon}</span>
        <h4 className="font-semibold">{title}</h4>
      </div>
      <div className="my-2">
        <p className={`text-3xl font-bold ${valueColor}`}>
          {value}
          <span className={`text-xl font-semibold ml-1 ${unitColor}`}>{unit}</span>
        </p>
      </div>
      {description && <p className={`text-xs ${descriptionColor} mt-2`}>{description}</p>}
    </div>
  );
}