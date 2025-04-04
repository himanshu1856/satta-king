import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function AdminDashboard() {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const getResults = async () => {
      const { data } = await supabase.from("results").select("*").order("time");
      setResults(data || []);
    };
    getResults();
  }, []);

  const handleUpdate = async (id: string, newResult: string) => {
    const { error } = await supabase
      .from("results")
      .update({ result: newResult })
      .eq("id", id);

    if (error) {
      alert("Update failed!");
      console.error(error);
    } else {
      alert("Updated!");
      const updated = results.map((r) =>
        r.id === id ? { ...r, result: newResult } : r
      );
      setResults(updated);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Update Results</h2>
        {results.map((game, idx) => (
          <div key={game.id} className="mb-4">
            <p className="font-medium">{game.name} — {game.time}</p>
            <input
              type="text"
              value={game.result}
              onChange={(e) => handleUpdate(game.id, e.target.value)}
              className="border p-2 rounded w-full mt-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
