## Dịch vụ Invoice Generator

Dịch vụ này cho phép tạo hóa đơn PDF từ dữ liệu đơn hàng.

### Các script liên quan:

- `start_invoice_service.bat`: Khởi động dịch vụ Invoice Generator trên port 8002
- `restart-invoice-service.bat`: Khởi động lại dịch vụ Invoice Generator
- `stop-invoice-service.bat`: Dừng dịch vụ Invoice Generator
- `test-invoice-service.bat`: Kiểm tra dịch vụ Invoice Generator bằng cách tạo hóa đơn mẫu

### API Endpoints:

- `POST /generate-invoice/`: Tạo hóa đơn PDF từ dữ liệu đơn hàng
- `GET /test-invoice/`: Tạo hóa đơn mẫu để kiểm tra
- `GET /health`: Kiểm tra trạng thái của dịch vụ

### Cách sử dụng:

1. Chạy `start_invoice_service.bat` để khởi động dịch vụ
2. Gửi request POST đến `/generate-invoice/` với dữ liệu đơn hàng để tạo hóa đơn
3. Dịch vụ sẽ trả về file PDF hóa đơn 