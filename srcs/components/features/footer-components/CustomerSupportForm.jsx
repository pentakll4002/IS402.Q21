const CustomerSupportForm = () => {
  return (
    <div className='max-w-2xl mx-auto p-4 sm:p-6 font-sans'>
      <h1 className='text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 leading-tight'>
        HAAD Tech XIN HÂN HẠNH ĐƯỢC HỖ TRỢ QUÝ KHÁCH
      </h1>

      <div className='space-y-4 sm:space-y-6'>
        {/* Phần chủ đề */}
        <section>
          <h2 className='font-medium mb-2 sm:mb-3 text-sm sm:text-base'>
            Quý khách đang quan tâm về:
          </h2>
          <select className='w-full p-2 sm:p-3 border rounded-md mb-3 sm:mb-4 text-sm sm:text-base'>
            <option>Chọn chủ đề</option>
          </select>

          <div className='space-y-2'>
            <label className='block font-medium text-sm sm:text-base'>
              Tiêu đề:
            </label>
            <input
              type='text'
              placeholder='Quý khách vui lòng nhập tiêu đề'
              className='w-full p-2 sm:p-3 border rounded-md text-sm sm:text-base'
            />
          </div>
        </section>

        {/* Phần nội dung */}
        <section>
          <h2 className='font-medium mb-2 sm:mb-3 text-sm sm:text-base'>
            Nội dung:
          </h2>
          <textarea
            placeholder='Xin quý khách vui lòng mô tả chi tiết'
            className='w-full p-2 sm:p-3 border rounded-md h-24 sm:h-32 text-sm sm:text-base resize-none'
          />
        </section>

        <hr className='my-4 sm:my-6' />

        {/* Thông tin liên hệ */}
        <section className='space-y-3 sm:space-y-4'>
          <div>
            <label className='block font-medium mb-1 sm:mb-2 text-sm sm:text-base'>
              Họ và tên:
            </label>
            <input
              type='text'
              placeholder='Nhập họ tên'
              className='w-full p-2 sm:p-3 border rounded-md text-sm sm:text-base'
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
            <div>
              <label className='block font-medium mb-1 sm:mb-2 text-sm sm:text-base'>
                Địa chỉ Email:
              </label>
              <input
                type='email'
                placeholder='Nhập Email'
                className='w-full p-2 sm:p-3 border rounded-md text-sm sm:text-base'
              />
            </div>

            <div>
              <label className='block font-medium mb-1 sm:mb-2 text-sm sm:text-base'>
                Số điện thoại:
              </label>
              <input
                type='tel'
                placeholder='Nhập sđt'
                className='w-full p-2 sm:p-3 border rounded-md text-sm sm:text-base'
              />
            </div>
          </div>
        </section>

        {/* Nút gửi */}
        <button className='w-full bg-red-600 text-white py-2 sm:py-3 rounded-md font-semibold hover:bg-red-700 transition-colors text-sm sm:text-base mt-4 sm:mt-6'>
          GỬI LIÊN HỆ
        </button>
      </div>
    </div>
  );
};

export default CustomerSupportForm;
