import React from "react";
import { formatTimeTo12Hour } from "@/utils/formatters";


interface Game {
  id: number;
  name: string;
  start_time: string;
}

interface ResultMapEntry {
  today?: string;
  yesterday?: string;
}

interface ResultTableProps {
  title: string;
  games: Game[];
  resultMap: Record<number, ResultMapEntry>;
  todayLabel: string;
  yesterdayLabel: string;
}

const ResultTable: React.FC<ResultTableProps> = ({
  title,
  games,
  resultMap,
  todayLabel,
  yesterdayLabel,
}) => {
  if (!games || games.length === 0) {
    return <p className="text-red-500 text-center">No game data available.</p>;
  }

  return (
    <div className="border border-gray-400 rounded-md shadow-md overflow-hidden my-6">
      <div className="bg-emerald-400 text-white text-center py-3 font-bold text-lg">
        {title}
      </div>
      <table className="w-full">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Games List</th>
            <th className="py-2 px-4 text-center">{yesterdayLabel}</th>
            <th className="py-2 px-4 text-center">{todayLabel}</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => {
            const results = resultMap[game.id] || {};
            const today = results.today === "-1" ? "XX" : results.today || "XX";
            const yesterday = results.yesterday === "-1" ? "XX" : results.yesterday || "XX";

            return (
              <tr key={game.id} className=" border-t border-gray-400">
                <td className="py-2 px-4 text-start">
                  <div className="text-black font-semibold uppercase">{game.name}</div>
                  <div className="text-sm text-gray-600">
                    at {formatTimeTo12Hour(game.start_time)}{" "}
                    <a
                      href={`/record/${game.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-blue-600 hover:underline ml-1"
                    >
                      Record Chart
                    </a>
                  </div>
                </td>

                <td className="py-2 px-4 text-center">{yesterday}</td>
                <td className="py-2 px-4 text-center">{today}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="bg-gray-800 text-white text-center py-2 text-sm">
        Click here for more games results.
      </div>
    </div>
  );
};

export default ResultTable;
