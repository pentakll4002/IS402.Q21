import { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import Spinner from '@/components/ui/Spinner';
import AnimatedDiv from '@/components/ui/AnimatedDiv';
import { useRegisterFormLogic } from './useRegisterFormLogic';

function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    errors,
    watch,
    onSubmit,
    loading,
    error,
    success,
  } = useRegisterFormLogic();

  return (
    <AnimatedDiv className='w-full'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4 sm:space-y-6 w-full max-w-[320px] mx-auto'
      >
        {error && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-sm text-red-600'>{error}</p>
          </div>
        )}

        {success && (
          <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
            <p className='text-sm text-green-600'>{success}</p>
          </div>
        )}

        <AnimatedDiv>
          <input
            type='text'
            placeholder='Họ và Tên'
            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border text-sm sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('fullName', { required: 'Vui lòng nhập họ và tên' })}
          />
          {errors.fullName && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.fullName.message}
            </p>
          )}
        </AnimatedDiv>

        <AnimatedDiv>
          <input
            type='email'
            placeholder='Email'
            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border text-sm sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('email', {
              required: 'Vui lòng nhập email',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email không hợp lệ',
              },
            })}
          />
          {errors.email && (
            <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>
          )}
        </AnimatedDiv>

        <AnimatedDiv className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Mật khẩu'
            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border text-sm sm:text-base rounded-md pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('password', {
              required: 'Vui lòng nhập mật khẩu',
              minLength: {
                value: 6,
                message: 'Mật khẩu phải có ít nhất 6 ký tự',
              },
            })}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-2 sm:right-3 top-1/2 -translate-y-1/2'
          >
            {showPassword ? (
              <HiEyeOff className='w-4 h-4 sm:w-5 sm:h-5 text-gray-600' />
            ) : (
              <HiEye className='w-4 h-4 sm:w-5 sm:h-5 text-gray-600' />
            )}
          </button>
          {errors.password && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.password.message}
            </p>
          )}
        </AnimatedDiv>

        <AnimatedDiv className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Xác nhận mật khẩu'
            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border text-sm sm:text-base rounded-md pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('confirmPassword', {
              required: 'Vui lòng xác nhận mật khẩu',
              validate: (value) =>
                value === watch('password') || 'Mật khẩu không khớp',
            })}
          />
          {errors.confirmPassword && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.confirmPassword.message}
            </p>
          )}
        </AnimatedDiv>

        <AnimatedDiv>
          <button
            type='submit'
            disabled={loading || success}
            className={`w-full py-2 sm:py-2.5 bg-red-600 text-white text-sm sm:text-base font-semibold rounded-md transition-all ${
              loading || success
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-red-700 hover:scale-103'
            }`}
          >
            {loading ? (
              <div className='flex items-center justify-center gap-2'>
                <Spinner className='w-4 h-4 sm:w-5 sm:h-5' /> Đang đăng ký...
              </div>
            ) : success ? (
              'Đăng ký thành công!'
            ) : (
              'Đăng ký'
            )}
          </button>
        </AnimatedDiv>
      </form>
    </AnimatedDiv>
  );
}

export default RegistrationForm;
