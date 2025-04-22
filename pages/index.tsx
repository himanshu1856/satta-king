// pages/index.tsx

"use client";

import Head from "next/head";
import ResultTable from "@/components/ResultTable";
import HomeHeader from "@/components/HomeHeader";
import HomeFooter from "@/components/HomeFooter";
import { createClient } from "@supabase/supabase-js";
import { format } from "date-fns";
import MonthlyCalendarTable from "@/components/MonthlyCalendarTable";
import StaticInfo from "@/components/StaticInfo";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const formatDate = (date: Date) => format(date, "yyyy-MM-dd");
const formatLabel = (date: Date) => format(date, "EEE. do");
const formatTitleDate = (date: Date) => format(date, "MMMM dd, yyyy");

export async function getServerSideProps() {
  // Convert server time to IST (UTC+5:30)
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
  const istTime = new Date(now.getTime() + istOffset);

  const today = new Date(
    istTime.getFullYear(),
    istTime.getMonth(),
    istTime.getDate()
  );
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const todayStr = formatDate(today);
  const yesterdayStr = formatDate(yesterday);

  const [{ data: games = [] }, { data: results = [] }] = await Promise.all([
    supabase.from("games").select("*"),
    supabase.from("results").select("*").in("date", [todayStr, yesterdayStr]),
  ]);

  const resultMap: Record<number, { today?: string; yesterday?: string }> = {};
  if (results) {
    results.forEach((row) => {
      const val =
        row.result === null || row.result === -1 ? "XX" : String(row.result);
      if (!resultMap[row.game_id]) resultMap[row.game_id] = {};
      if (row.date === todayStr) resultMap[row.game_id].today = val;
      if (row.date === yesterdayStr) resultMap[row.game_id].yesterday = val;
    });
  }

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  const allGameIds = (games || []).map((g) => g.game_id);

  const { data: monthlyCalendarResults = [] } = await supabase
    .from("results")
    .select("*")
    .in("game_id", allGameIds)
    .gte("date", formatDate(prevMonthStart))
    .lt("date", formatDate(nextMonthStart));

  return {
    props: {
      games,
      resultMap,
      monthlyCalendarResults,
      todayFormatted: formatTitleDate(today),
      yesterdayFormatted: formatTitleDate(yesterday),
      todayLabel: formatLabel(today),
      yesterdayLabel: formatLabel(yesterday),
      currentDate: today.toISOString(),
    },
  };
}

export default function Home({
  games,
  resultMap,
  monthlyCalendarResults,
  todayFormatted,
  yesterdayFormatted,
  todayLabel,
  yesterdayLabel,
  currentDate,
}: any) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Satta King Mhadev Results</title>
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <HomeHeader />
        <ResultTable
          title={`Satta King Fast Results of ${todayFormatted} & ${yesterdayFormatted}`}
          games={games}
          resultMap={resultMap}
          todayLabel={todayLabel}
          yesterdayLabel={yesterdayLabel}
        />
        <ResultTable
          title={`Timewise Superfast Satta King Results of ${todayFormatted} & ${yesterdayFormatted}`}
          games={games}
          resultMap={resultMap}
          todayLabel={todayLabel}
          yesterdayLabel={yesterdayLabel}
        />
        <MonthlyCalendarTable
          results={monthlyCalendarResults}
          currentDate={currentDate}
        />
        <HomeFooter />
        <StaticInfo />
      </main>
    </>
  );
}
