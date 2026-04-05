import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useRegisterFormLogic() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(
        "http://localhost/Do_An_Web/IS207_P21/php_files/signup.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            fullName: data.fullName,
          }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        setError(result?.error || "Đăng ký thất bại.");
        setLoading(false);
        return;
      }
      if (result?.message) {
        setSuccess(result.message);
        setTimeout(() => {
          navigate("/home", { state: { modal: "login" } });
        }, 3000);
        setLoading(false);
        return;
      }
      setSuccess(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản."
      );
      setTimeout(() => {
        navigate("/home", { state: { modal: "login" } });
      }, 3000);
    } catch (err) {
      setError("Lỗi hệ thống: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    watch,
    onSubmit,
    loading,
    error,
    success,
  };
}
