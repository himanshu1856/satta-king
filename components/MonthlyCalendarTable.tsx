import React, { useState,useEffect } from "react";
import { format, subMonths, addMonths, isSameMonth } from "date-fns";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


interface ResultRow {
  date: string; // YYYY-MM-DD
  game_id: number;
  result: number;
}

interface CalendarProps {
  currentDate: Date;
}

const ALL_GAMES = [
  { id: 1, name: "Gali" },
  { id: 2, name: "Desawer" },
  { id: 3, name: "Faridabad" },
  { id: 4, name: "Ghaziabad" },
  { id: 5, name: "Barlin Day" },
  { id: 6, name: "Hisar Club" },
  { id: 7, name: "U.K Day" },
  { id: 8, name: "Gold Kolkata" },
  { id: 9, name: "Gwalior Night" },
  { id: 10, name: "Gali King Gold" },
  { id: 11, name: "Delhi Bazar" },
  { id: 12, name: "Shri Ganesh" },
];

const MonthlyResultCalendar: React.FC<CalendarProps> = () => {

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [results, setResults] = useState<ResultRow[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const nextMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  
      const { data, error } = await supabase
        .from("results")
        .select("*")
        .gte("date", format(monthStart, "yyyy-MM-dd"))
        .lt("date", format(nextMonthStart, "yyyy-MM-dd"));
  
      if (error) {
        console.error("Error fetching results:", error);
      } else {
        setResults(data || []);
      }
    };
  
    fetchResults();
  }, [currentMonth]);
  

  const isCurrentMonth = isSameMonth(currentMonth, new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const todayDate = new Date().getDate();
  const daysToRender = isCurrentMonth ? todayDate : daysInMonth;

  const filteredResults = results.filter((row) => {
    const rowDate = new Date(row.date);
    return isSameMonth(rowDate, currentMonth);
  });

  const resultMap: Record<string, Record<number, number>> = {};

  filteredResults.forEach((row) => {
    const dateKey = row.date.split("-")[2]; // Get the day part only
    if (!resultMap[dateKey]) resultMap[dateKey] = {};
    resultMap[dateKey][row.game_id] = row.result;
  });

  const gameChunks = [
    ALL_GAMES.slice(0, 4),
    ALL_GAMES.slice(4, 8),
    ALL_GAMES.slice(8, 12),
  ];

  return (
    <div className="mt-8 mb-6 text-center">
      {gameChunks.map((GAMES, index) => (
        <div key={index} className="mb-10">
          <h2 className="bg-emerald-400 text-white font-bold py-2 text-lg">
            Monthly Satta King Result Chart of {format(currentMonth, "MMMM yyyy")} for {GAMES.map((g) => g.name).join(", ")}
          </h2>
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-yellow-400">
                <th className="border border-gray-300 py-1">DATE</th>
                {GAMES.map((game) => (
                  <th key={game.id} className="border border-gray-300 py-1">
                    {game.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(daysToRender)].map((_, i) => {
                const day = String(i + 1).padStart(2, "0");
                return (
                  <tr key={`${index}-${day}`} className="text-center">
                    <td className="text-red-600 font-bold border py-1">{day}</td>
                    {GAMES.map((game) => {
                      const value = resultMap[day]?.[game.id];
                      return (
                        <td key={game.id} className="border py-1">
                          {value === undefined || value === -1 ? "XX" : String(value).padStart(2, "0")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
              className="bg-blue-600 text-white px-6 py-1 rounded hover:bg-blue-700"
            >
              {format(subMonths(currentMonth, 1), "MMM yyyy")}
            </button>
            <button
              onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
              className="bg-blue-600 text-white px-6 py-1 rounded hover:bg-blue-700"
            >
              {format(addMonths(currentMonth, 1), "MMM yyyy")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthlyResultCalendar;