import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/router";
import { format } from "date-fns";

interface Game {
  game_id: number;
  name: string;
  start_time: string;
}

export default function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [todayResult, setTodayResult] = useState<{ gameId: number | null; result: string }>({ gameId: null, result: "" });
  const [editDate, setEditDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [editGameId, setEditGameId] = useState<number | null>(null);
  const [editResult, setEditResult] = useState<string>("");
  const [addGame, setAddGame] = useState<{ name: string; start_time: string }>({ name: "", start_time: "" });

  const router = useRouter();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const { data, error } = await supabase.from("games").select("*");
    if (error) {
      console.error("Error fetching games:", error.message);
    } else {
      setGames(data || []);
      console.log("Fetched games:", data); // helpful for debugging
    }
  };

  const handleTodayUpdate = async () => {
    if (!todayResult.gameId || todayResult.result.trim() === "") {
      alert("Please select a game and enter the result.");
      return;
    }

    const today = format(new Date(), "yyyy-MM-dd");
    const { error } = await supabase.from("results").upsert({
      game_id: todayResult.gameId,
      date: today,
      result: todayResult.result === "XX" ? -1 : parseInt(todayResult.result),
    });

    if (error) alert("Failed to update today's result: " + error.message);
    else alert("✅ Updated successfully");
  };

  const handleEditResult = async () => {
    if (!editGameId || editResult.trim() === "") {
      alert("Please select a game and enter the result to edit.");
      return;
    }

    const { error } = await supabase.from("results").upsert({
      game_id: editGameId,
      date: editDate,
      result: editResult === "XX" ? -1 : parseInt(editResult),
    });

    if (error) alert("Error updating result: " + error.message);
    else alert("✅ Result updated!");
  };

  const handleDeleteResult = async () => {
    if (!editGameId) {
      alert("Please select a game to delete its result.");
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete this result?");
    if (!confirm) return;

    const { error } = await supabase
      .from("results")
      .delete()
      .eq("game_id", editGameId)
      .eq("date", editDate);

    if (error) alert("❌ Delete failed: " + error.message);
    else alert("🗑️ Deleted successfully");
  };

  const handleAddGame = async () => {
    if (!addGame.name.trim() || !addGame.start_time.trim()) {
      alert("Please provide both name and start time for the game.");
      return;
    }

    const { error } = await supabase.from("games").insert(addGame);
    if (error) alert("Failed to add game: " + error.message);
    else {
      alert("✅ Game added!");
      fetchGames();
      setAddGame({ name: "", start_time: "" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-sm bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Home
          </a>
          <h2 className="text-xl text-center font-bold text-blue-700">Update Results</h2>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard - SATTA KING MHADEV</h1>
      </div>

      {/* Section 1: Update Today's Result */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Update Today's Result</h2>
        <div className="flex flex-col gap-2">
          <select
            className="border p-2 rounded"
            onChange={(e) =>
              setTodayResult({ ...todayResult, gameId: parseInt(e.target.value) || null })
            }
            value={todayResult.gameId ?? ""}
          >
            <option value="">Select Game</option>
            {games.map((g) => (
              <option key={g.game_id} value={g.game_id.toString()}>
                {g.name}
              </option>
            ))}
          </select>
          <input
            className="border p-2 rounded"
            placeholder="Enter Result"
            value={todayResult.result}
            onChange={(e) =>
              setTodayResult({ ...todayResult, result: e.target.value })
            }
          />
          <button onClick={handleTodayUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </section>

      {/* Section 2: Edit Previous Records */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Update Previous Records</h2>
        <div className="flex flex-col gap-2">
          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            className="border p-2 rounded"
            onChange={(e) => setEditGameId(parseInt(e.target.value) || null)}
            value={editGameId ?? ""}
          >
            <option value="">Select Game</option>
            {games.map((g) => (
              <option key={g.game_id} value={g.game_id.toString()}>
                {g.name}
              </option>
            ))}
          </select>
          <input
            className="border p-2 rounded"
            placeholder="Enter Result"
            value={editResult}
            onChange={(e) => setEditResult(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={handleEditResult} className="bg-green-600 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={handleDeleteResult} className="bg-red-600 text-white px-4 py-2 rounded">
              Delete
            </button>
          </div>
        </div>
      </section>

      {/* Section 3: Add New Game */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Add New Game</h2>
        <div className="flex flex-col gap-2">
          <input
            className="border p-2 rounded"
            placeholder="Game Name"
            value={addGame.name}
            onChange={(e) => setAddGame({ ...addGame, name: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Start Time (e.g., 14:30:00)"
            value={addGame.start_time}
            onChange={(e) => setAddGame({ ...addGame, start_time: e.target.value })}
          />
          <button onClick={handleAddGame} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
      </section>
    </div>
  );
}
