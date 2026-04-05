import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { apiLogin } from '@/components/services/apiLogin';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function useLoginFormLogic() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: apiLogin,

    onSuccess: async (userData) => {
      try {
        setLoginError('');
        localStorage.setItem('user', JSON.stringify(userData));

        // Đăng nhập thành công, redirect về home
        navigate('/home', { replace: true });
      } catch (error) {
        console.error('Error in login success handler:', error);
        setLoginError('Có lỗi xảy ra sau khi đăng nhập');
      }
    },

    onError: (error) => {
      console.error('Login error:', error);
      setLoginError(error.message || 'Đăng nhập thất bại');
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading: mutation.isLoading,
    loginError,
  };
}
