import React from 'react';

export default function InfoCard({ icon, title, value, unit, description }) {
  return (
    <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-md h-full transition-transform duration-300 hover:scale-105">
      <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-400">
        <span className="text-xl">{icon}</span>
        <h4 className="font-semibold">{title}</h4>
      </div>
      <div className="my-2">
        <p className="text-3xl font-bold text-neutral-800 dark:text-white">
          {value}
          <span className="text-xl font-semibold text-neutral-600 dark:text-neutral-300 ml-1">{unit}</span>
        </p>
      </div>
      {description && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">{description}</p>}
    </div>
  );
}