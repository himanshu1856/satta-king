import ResultTable from "@/components/ResultTable";
import HomeHeader from "@/components/HomeHeader";
import { fetchResults } from "@/utils/api";
import FooterFilter from "@/components/HomeFooter";
import TimewiseResultTable from "@/components/TimewiseResultTable";

export default function Home({ results }: any) {
  return (
    <main className="min-h-screen p-4 max-w-5xl mx-auto">
      <HomeHeader />
      <ResultTable results={results} />
      <TimewiseResultTable results={results}/>
      <FooterFilter />
    </main>
  );
}

export async function getServerSideProps() {
  const results = await fetchResults();
  return { props: { results } };
}
