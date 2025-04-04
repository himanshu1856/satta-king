import ResultTable from "@/components/ResultTable";
import { fetchResults } from "@/utils/api";

export default function Home({ results }: any) {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <ResultTable results={results} />
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  const results = await fetchResults();
  return { props: { results } };
}
