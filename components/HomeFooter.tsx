'use client';

import { useState } from 'react';

const FooterFilter = () => {
  const [month, setMonth] = useState('January');
  const [year, setYear] = useState('2025');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const years = ['2023', '2024', '2025'];

  return (
    <div className="space-y-3">
      {/* Top Blue CTA */}
      <div className="bg-blue-600 text-white text-center py-2 font-medium">
        April-2025 Ka Gali, Desawar, Ghaziabad Aur Faridabad Ka Latest Chart Dekhne Ke Liye Yahan Click Kariye
      </div>

      {/* Yellow Filter Block */}
      <div className="bg-yellow-400 p-4 text-center space-y-4">
        <p className="font-semibold text-black">
          Yahan Aap Month Aur Year Select Karke Gali, Desawar, Ghaziabad Aur Faridabad Ka Combined Chart Dekh Sakte Hai.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {/* Month Dropdown */}
          <select
            className="px-4 py-2 font-bold text-black rounded-md border border-gray-300 bg-white"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            className="px-4 py-2 font-bold text-black rounded-md border border-gray-300 bg-white"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* Go Button */}
          <button className="bg-blue-600 text-white font-bold px-8 py-2 rounded-md hover:bg-blue-700 transition-all">
            Go
          </button>
        </div>
      </div>

      <a
        href="https://wa.me/919813260875" // replace with your number
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50"
      >
        <img
          src="/whatsapp-icon.png" // make sure the icon is in /public folder
          alt="Chat on WhatsApp"
          className="w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
        />
      </a>

    </div>
  );
};

export default FooterFilter;
