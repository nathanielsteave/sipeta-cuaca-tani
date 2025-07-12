import React from 'react';

export default function InfoCard({ icon, title, value, unit, description }) {
  return (
    <div className="bg-gradient-to-br from-sky-300 to-sky-500 p-4 rounded-2xl shadow-lg h-full transition-transform duration-300 hover:scale-105 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 text-white/90">
          <span className="text-xl">{icon}</span>
          <h4 className="font-semibold">{title}</h4>
        </div>
        <div className="my-2">
          <p className="text-3xl font-bold text-white">
            {value}
            <span className="text-xl font-semibold ml-1 text-sky-100">{unit}</span>
          </p>
        </div>
      </div>
      {description && <p className="text-xs text-sky-100 mt-1">{description}</p>}
    </div>
  );
}