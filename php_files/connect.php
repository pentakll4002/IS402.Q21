<?php
$servername = "localhost";
$username = "root";
$password = ""; // Default is empty in XAMPP
$database = "user_web";


$conn =  mysqli_connect($servername, $username, $password, $database);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully!";
?>
