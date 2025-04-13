// pages/index.tsx
import Head from "next/head";
import ResultTable from "@/components/ResultTable";
import HomeHeader from "@/components/HomeHeader";
import HomeFooter from "@/components/HomeFooter";
import { createClient } from "@supabase/supabase-js";
import { format } from "date-fns";
import MonthlyCalendarTable from "@/components/MonthlyCalendarTable";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const formatDate = (date: Date) => format(date, "yyyy-MM-dd");
const formatLabel = (date: Date) => format(date, "EEE. do");
const formatTitleDate = (date: Date) => format(date, "MMMM dd, yyyy");

export async function getServerSideProps() {
  const today = new Date();
  const yesterday = new Date();
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
      if (!resultMap[row.game_id]) resultMap[row.game_id] = {};
      const value = row.result === null || row.result === -1 ? "XX" : String(row.result);
      if (row.date === todayStr) resultMap[row.game_id].today = value;
      if (row.date === yesterdayStr) resultMap[row.game_id].yesterday = value;
    });
  }

  // Removed redundant re-declaration of formatDate

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  const { data: monthlyCalendarResults, error: calendarError } = await supabase
    .from("results")
    .select("*")
    .in("game_id", [1, 2, 3, 4]) // Gali, Desawer, Faridabad, Ghaziabad
    .gte("date", formatDate(prevMonthStart))
    .lt("date", formatDate(nextMonthStart)); // Up to the start of next month

  return {
    props: {
      games,
      resultMap,
      monthlyCalendarResults,
      todayFormatted: formatTitleDate(today),
      yesterdayFormatted: formatTitleDate(yesterday),
      todayLabel: formatLabel(today),
      yesterdayLabel: formatLabel(yesterday),
    },
  };
}

export default function Home({ games, monthlyCalendarResults, resultMap, todayFormatted, yesterdayFormatted, todayLabel, yesterdayLabel }: any) {
  return (
    <>
      <Head>
        <title>Satta King - Fast Results</title>
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
        <MonthlyCalendarTable results={monthlyCalendarResults} />
        <HomeFooter />
      </main>
    </>
  );
}
