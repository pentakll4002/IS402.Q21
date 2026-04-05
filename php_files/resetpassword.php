<?php
// ✅ Cho phép mọi domain truy cập
header("Access-Control-Allow-Origin: *");

// ✅ Cho phép các headers và phương thức
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// ✅ Nếu là request OPTIONS (preflight), dừng ở đây
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'supabase_config.php';

try {
    $body = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($body['token']) || !isset($body['password'])) {
        throw new Exception('Thiếu thông tin cần thiết');
    }

    $token = $body['token'];
    $password = $body['password'];

    // Kiểm tra độ dài mật khẩu
    if (strlen($password) < 6) {
        throw new Exception('Mật khẩu phải có ít nhất 6 ký tự');
    }

    // Gọi API Supabase để đặt lại mật khẩu
    $response = makeSupabaseRequest('/auth/v1/user', 'PUT', [
        'password' => $password
    ], $token);

    if ($response['status'] >= 400) {
        throw new Exception($response['data']['message'] ?? 'Không thể đặt lại mật khẩu');
    }

    // Set cache headers to prevent caching of this response
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Cache-Control: post-check=0, pre-check=0', false);
    header('Pragma: no-cache');
    
    http_response_code(200);
    echo json_encode([
        'ok' => true,
        'message' => 'Đặt lại mật khẩu thành công'
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
} 