import { supabase } from "./supabase";

function isValidEmail(email) {
  // Đơn giản, chỉ kiểm tra có ký tự @ và dấu chấm
  return typeof email === "string" && /.+@.+\..+/.test(email);
}

export async function apiLogin({ username, password }) {
  if (!username || !password) {
    throw new Error("Vui lòng nhập đầy đủ email và mật khẩu");
  }
  if (!isValidEmail(username)) {
    throw new Error("Email không hợp lệ");
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });

    if (error) {
      // Customize error messages
      if (error.message.includes("Invalid login credentials")) {
        throw new Error("Email hoặc mật khẩu không đúng");
      } else if (error.message.includes("Email not confirmed")) {
        throw new Error(
          "Email chưa được xác nhận. Vui lòng kiểm tra hộp thư của bạn"
        );
      } else {
        throw new Error(error.message);
      }
    }

    if (!data.user) {
      throw new Error("Đăng nhập thất bại. Vui lòng thử lại");
    }

    return {
      user: data.user,
      session: data.session,
      message: "Đăng nhập thành công",
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
