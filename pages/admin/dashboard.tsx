import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/admin/login");
      } else {
        fetchResults();
      }
    };

    const fetchResults = async () => {
      const { data } = await supabase.from("results").select("*").order("time");
      setResults(data || []);
      setLoading(false);
    };

    checkSession();
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-700">Update Results</h2>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {results.map((game, idx) => (
          <div key={game.id} className="mb-4">
            <p className="font-medium">
              {game.name} — {game.time}
            </p>
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
