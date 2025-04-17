// pages/record/[game_id].tsx

import { useRouter } from "next/router";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { format, getDaysInMonth } from "date-fns";
import Head from "next/head";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getServerSideProps(context: any) {
  const gameId = parseInt(context.params.game_id);
  const queryMonth = parseInt(context.query.month) || new Date().getMonth() + 1;
  const queryYear = parseInt(context.query.year) || new Date().getFullYear();

  const { data, error } = await supabase.from("games").select("*");
  if (error || !data) return { notFound: true };
  const games = data;

  const selectedGame = games.find((g: any) => g.game_id === gameId);
  if (!selectedGame) return { notFound: true };

  const defaultOthers = [1, 2, 3].filter(id => id !== gameId);
  if (defaultOthers.length < 3) {
    for (let i = 1; i <= 4; i++) {
      if (!defaultOthers.includes(i) && i !== gameId) defaultOthers.push(i);
      if (defaultOthers.length === 3) break;
    }
  }

  const otherGameIds = defaultOthers.slice(0, 3);

  const startDate = new Date(queryYear, queryMonth - 1, 1);
  const isCurrentMonth = queryMonth === new Date().getMonth() + 1 && queryYear === new Date().getFullYear();
  const endDay = isCurrentMonth ? new Date().getDate() : getDaysInMonth(startDate);
  const endDate = new Date(queryYear, queryMonth - 1, endDay);

  const dateRange = {
    start: format(startDate, "yyyy-MM-dd"),
    end: format(endDate, "yyyy-MM-dd"),
  };

  const initialGameIds = [gameId, ...otherGameIds];
  const { data: initialResults = [] } = await supabase
    .from("results")
    .select("*")
    .in("game_id", initialGameIds)
    .gte("date", dateRange.start)
    .lte("date", dateRange.end);

  return {
    props: {
      games,
      selectedGame,
      selectedGameId: gameId,
      defaultOtherIds: otherGameIds,
      initialResults,
      year: queryYear,
      month: queryMonth,
      dateRange,
    },
  };
}

export default function RecordChartPage({
  games,
  selectedGame,
  selectedGameId,
  defaultOtherIds,
  initialResults,
  year,
  month,
  dateRange,
}: any) {
  const router = useRouter();
  const [others, setOthers] = useState<number[]>(defaultOtherIds);
  const [results, setResults] = useState(initialResults);

  const daysInMonth = getDaysInMonth(new Date(year, month - 1));
  const isCurrentMonth = month === new Date().getMonth() + 1 && year === new Date().getFullYear();

  const getResult = (day: number, game_id: number) => {
    const date = format(new Date(year, month - 1, day), "yyyy-MM-dd");
    const entry = results.find((r: any) => r.date === date && r.game_id === game_id);
    const val = entry?.result;
    return val === -1 || val === "-1" || val == null ? "XX" : val.toString();
  };
  

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(year, month - 1 + offset, 1);
    router.push(`/record/${selectedGameId}?month=${newDate.getMonth() + 1}&year=${newDate.getFullYear()}`);
  };

  const updateOtherGame = async (colIndex: number, newGameId: number) => {
    const updated = [...others];
    updated[colIndex] = newGameId;
    setOthers(updated);

    const { data: updatedResults = [] } = await supabase
      .from("results")
      .select("*")
      .in("game_id", [selectedGameId, ...updated])
      .gte("date", dateRange.start)
      .lte("date", dateRange.end);

    setResults(updatedResults);
  };

  return (
    <>
      <Head><title>{selectedGame.name} Record Chart</title></Head>
      <div className="max-w-5xl mx-auto p-4">
      <a
            href="/"
            className="text-sm bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Home
          </a>
        <h1 className="text-2xl font-bold mb-4 text-center">
          Record Chart – {selectedGame.name} ({format(new Date(year, month - 1), "MMMM yyyy")})
        </h1>

        <table className="w-full border border-gray-300 mb-6 text-sm">
          <thead>
            <tr className="bg-[#f9f9f9] border-b border-gray-300 text-gray-800 text-[15px]">
              <th className="p-2 font-bold text-red-600">DATE</th>
              <th className="p-2 font-bold">{selectedGame.name}</th>
              {others.map((game_id: number, i: number) => (
                <th key={i} className="p-2 font-bold">
                  <select
                    className="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={game_id}
                    onChange={(e) => updateOtherGame(i, parseInt(e.target.value))}
                  >
                    {games
                      .filter((g: any) => g.game_id !== selectedGameId)
                      .map((g: any) => (
                        <option key={g.game_id} value={g.game_id}>
                          {g.name}
                        </option>
                      ))}
                  </select>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <tr key={day} className="border-b border-gray-200 text-center">
                <td className="p-2 text-red-600 font-medium">{String(day).padStart(2, "0")}</td>
                <td className="p-2 font-semibold">{getResult(day, selectedGameId)}</td>
                {others.map((game_id: number) => (
                  <td key={game_id} className="p-2">{getResult(day, game_id)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => handleMonthChange(-1)}
          >
            Prev ({format(new Date(year, month - 2), "MMMM yyyy")})
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={() => handleMonthChange(1)}
            disabled={isCurrentMonth}
          >
            Next ({format(new Date(year, month), "MMMM yyyy")})
          </button>
        </div>
      </div>
    </>
  );
}
