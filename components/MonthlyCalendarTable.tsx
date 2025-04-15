import React, { useState } from "react";
import { format, subMonths, addMonths, isSameMonth, isToday } from "date-fns";

interface ResultRow {
  date: string; // YYYY-MM-DD
  game_id: number;
  result: number;
}

interface CalendarProps {
  results: ResultRow[];
  currentDate: Date;
}

const GAMES = [
  { id: 2, name: "DSWR" },
  { id: 3, name: "FRBD" },
  { id: 4, name: "GZBD" },
  { id: 1, name: "GALI" },
];

const MonthlyResultCalendar: React.FC<CalendarProps> = ({ results }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
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

  return (
    <div className="mt-8 mb-6 text-center">
      <h2 className="bg-emerald-400 text-white font-bold py-2 text-lg">
        Monthly Satta King Result Chart of {format(currentMonth, "MMMM yyyy")} for Gali, Desawer, Gaziabad and Faridabad
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
              <tr key={day} className="text-center">
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
  );
};

export default MonthlyResultCalendar;
