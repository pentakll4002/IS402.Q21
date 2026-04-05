import { supabase } from "./supabase";

export async function registerUser({ userData }) {
  const { data, error } = await supabase
    .from("Registration")
    .insert([{ userData }])
    .select();

  if (error) {
    console.error("Lỗi khi đăng ký:", error.message);
    throw error;
  }

  return data;
}
