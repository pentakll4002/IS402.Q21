import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MdSave,
  MdNotifications,
  MdSecurity,
  MdLanguage,
  MdPalette,
} from 'react-icons/md';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'Cài đặt chung', icon: <MdSave /> },
    { id: 'notifications', name: 'Thông báo', icon: <MdNotifications /> },
    { id: 'security', name: 'Bảo mật', icon: <MdSecurity /> },
    { id: 'appearance', name: 'Giao diện', icon: <MdPalette /> },
    { id: 'language', name: 'Ngôn ngữ', icon: <MdLanguage /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Cài đặt hệ thống</h1>
        <p className='text-gray-600'>Quản lý cài đặt và tùy chỉnh hệ thống</p>
      </div>

      <div className='flex flex-col md:flex-row gap-6'>
        <div className='w-full md:w-64 mb-6 md:mb-0'>
          <div className='bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-red-50 text-red-600 border-l-4 border-red-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className='text-xl mr-3'>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className='flex-1'>
          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
            {activeTab === 'general' && (
              <div>
                <h2 className='text-lg font-semibold text-gray-800 mb-4'>
                  Cài đặt chung
                </h2>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Tên cửa hàng
                    </label>
                    <input
                      type='text'
                      className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800'
                      defaultValue='PC World Shop'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Địa chỉ email liên hệ
                    </label>
                    <input
                      type='email'
                      className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800'
                      defaultValue='contact@pcworld.com'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Số điện thoại
                    </label>
                    <input
                      type='tel'
                      className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800'
                      defaultValue='0123456789'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Địa chỉ
                    </label>
                    <textarea
                      className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800'
                      rows='3'
                      defaultValue='227 Nguyễn Văn Cừ, Quận 5, TP.HCM'
                    ></textarea>
                  </div>
                  <div className='pt-4'>
                    <button className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'>
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className='text-lg font-semibold text-gray-800 mb-4'>
                  Cài đặt thông báo
                </h2>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-medium text-gray-800'>
                        Thông báo đơn hàng mới
                      </h3>
                      <p className='text-sm text-gray-600'>
                        Nhận thông báo khi có đơn hàng mới
                      </p>
                    </div>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='sr-only peer'
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-medium text-gray-800'>
                        Thông báo email
                      </h3>
                      <p className='text-sm text-gray-600'>
                        Nhận thông báo qua email
                      </p>
                    </div>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='sr-only peer'
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-medium text-gray-800'>
                        Thông báo hết hàng
                      </h3>
                      <p className='text-sm text-gray-600'>
                        Nhận thông báo khi sản phẩm hết hàng
                      </p>
                    </div>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input type='checkbox' className='sr-only peer' />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <div className='pt-4'>
                    <button className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'>
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className='text-lg font-semibold text-gray-800 mb-4'>
                  Cài đặt bảo mật
                </h2>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type='password'
                      className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Mật khẩu mới
                    </label>
                    <input
                      type='password'
                      className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type='password'
                      className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800'
                    />
                  </div>
                  <div className='pt-4'>
                    <button className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'>
                      Cập nhật mật khẩu
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h2 className='text-lg font-semibold text-gray-800 mb-4'>
                  Cài đặt giao diện
                </h2>
                <div className='space-y-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-3'>
                      Màu chính
                    </label>
                    <div className='flex space-x-3'>
                      <div className='w-8 h-8 rounded-full bg-red-600 border-2 border-white outline  outline-red-600 cursor-pointer'></div>
                      <div className='w-8 h-8 rounded-full bg-blue-600 border-2 border-white outline  outline-gray-200 cursor-pointer'></div>
                      <div className='w-8 h-8 rounded-full bg-green-600 border-2 border-white outline  outline-gray-200 cursor-pointer'></div>
                      <div className='w-8 h-8 rounded-full bg-purple-600 border-2 border-white outline  outline-gray-200 cursor-pointer'></div>
                      <div className='w-8 h-8 rounded-full bg-yellow-500 border-2 border-white outline outline-gray-200 cursor-pointer'></div>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-3'>
                      Hiệu ứng chuyển động
                    </label>
                    <div className='flex items-center space-x-4'>
                      <label className='inline-flex items-center cursor-pointer'>
                        <input
                          type='radio'
                          name='motion'
                          className='form-radio h-4 w-4 text-red-600 focus:ring-red-500'
                          defaultChecked
                        />
                        <span className='ml-2 text-gray-800'>Bật</span>
                      </label>
                      <label className='inline-flex items-center cursor-pointer'>
                        <input
                          type='radio'
                          name='motion'
                          className='form-radio h-4 w-4 text-red-600 focus:ring-red-500'
                        />
                        <span className='ml-2 text-gray-800'>Tắt</span>
                      </label>
                    </div>
                    <p className='mt-2 text-sm text-gray-600'>
                      Tắt hiệu ứng chuyển động nếu bạn cảm thấy khó chịu với các
                      animation.
                    </p>
                  </div>

                  <div className='pt-4'>
                    <button className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'>
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'language' && (
              <div>
                <h2 className='text-lg font-semibold text-gray-800 mb-4'>
                  Cài đặt ngôn ngữ
                </h2>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Ngôn ngữ hiển thị
                    </label>
                    <select className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800'>
                      <option value='vi'>Tiếng Việt</option>
                      <option value='en'>English</option>
                      <option value='ja'>日本語</option>
                      <option value='ko'>한국어</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Định dạng ngày
                    </label>
                    <select className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800'>
                      <option value='dd/mm/yyyy'>DD/MM/YYYY</option>
                      <option value='mm/dd/yyyy'>MM/DD/YYYY</option>
                      <option value='yyyy/mm/dd'>YYYY/MM/DD</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Định dạng tiền tệ
                    </label>
                    <select className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800'>
                      <option value='vnd'>VND (₫)</option>
                      <option value='usd'>USD ($)</option>
                      <option value='eur'>EUR (€)</option>
                    </select>
                  </div>
                  <div className='pt-4'>
                    <button className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'>
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
