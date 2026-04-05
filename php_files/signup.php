<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Xử lý preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Lấy dữ liệu gửi từ client
$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"] ?? null;
$password = $data["password"] ?? null;
$fullName = $data["fullName"] ?? null;

// Kiểm tra đầu vào
if (!$email || !$password || !$fullName) {
  http_response_code(400);
  echo json_encode(["error" => "Vui lòng nhập đầy đủ thông tin đăng ký."]);
  exit;
}

// Supabase API endpoint và API key
$apiUrl = "https://yqbaaipksxorhlynhmfd.supabase.co/auth/v1/signup";
$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxYmFhaXBrc3hvcmhseW5obWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NDA3NDAsImV4cCI6MjA2MzExNjc0MH0.W7bgKUJmSuMS9YcmQlLK8Ol1ZOSeRcaHICECY6HWk1k";

$redirectTo = "http://localhost:5173/verify"; // hoặc trang bạn muốn sau khi xác nhận email

// Dữ liệu gửi lên Supabase
$payload = json_encode([
  "email" => $email,
  "password" => $password,
  "options" => [
    "data" => [
      "full_name" => $fullName
    ],
    "email_redirect_to" => $redirectTo
  ]
]);

// Gửi request với cURL
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "Content-Type: application/json",
  "apikey: $apiKey",
  "Authorization: Bearer $apiKey"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

// Nhận phản hồi
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// Xử lý phản hồi
$responseData = json_decode($response, true);

if (($httpCode === 200 || $httpCode === 201) && isset($responseData['user']) && $responseData['user']) {
  // Đăng ký thành công thực sự
  echo $response;
} elseif (($httpCode === 200 || $httpCode === 201) && (!isset($responseData['user']) || !$responseData['user'])) {
  // Nếu user là null và có lỗi liên quan đến email => Email đã được đăng ký
  if (
    (isset($responseData['msg']) && stripos($responseData['msg'], 'email') !== false) ||
    (isset($responseData['error']) && stripos($responseData['error'], 'email') !== false)
  ) {
    http_response_code(400);
    echo json_encode([
      "error" => "Email đã được đăng ký",
      "details" => $responseData,
      "curl_error" => $error
    ]);
  } else {
    // Trường hợp user null nhưng không có lỗi email (hiếm gặp)
    http_response_code(400);
    echo json_encode([
      "error" => "Đăng ký thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
      "details" => $responseData,
      "curl_error" => $error
    ]);
  }
} else {
  // Các lỗi khác
  http_response_code(400);
  echo json_encode([
    "error" => isset($responseData['msg']) ? $responseData['msg'] : (isset($responseData['error']) ? $responseData['error'] : "Đăng ký thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ."),
    "details" => $responseData,
    "curl_error" => $error
  ]);
}
