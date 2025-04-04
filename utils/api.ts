// utils/api.ts
import { supabase } from "./supabaseClient";

export const fetchResults = async () => {
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .order("time"); // optional: you can order by time or name

  if (error) {
    console.error("Error fetching:", error.message);
    return [];
  }

  return data || [];
};
