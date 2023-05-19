<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: *');

// Connect to the database
$hostname = "sql311.epizy.com";
$username = "epiz_34175108";
$password = "nDTPgPCemp";
$dbname = "epiz_34175108";

$con = mysqli_connect($hostname, $username, $password, $dbname);

if (!$con) {
    die("Failed to connect to the database: " . mysqli_connect_error());
}

if (isset($_POST['save_btn'])) {
    $city = $_POST['city'];

    // Fetch weather data from the API
    $forecast_url = "https://api.openweathermap.org/data/2.5/forecast?q=" . urlencode($city) . "&appid=684f6b931569a4243c07634eb61fc2f9&units=metric";
    $weather_data = file_get_contents($forecast_url);

    if ($weather_data !== false) {
        $weather_array = json_decode($weather_data, true);

        $city = $weather_array['city']['name'];
        $weather_list = $weather_array['list'];

        // Prepare the INSERT INTO query
        $query = "INSERT INTO weather (Date_Time, City_Name, Temperature, Feels_Like, Description, Pressure, Humidity, Wind_Speed, Wind_Direction, Icon) VALUES ";

        // Process weather data for each day
        for ($i = 0; $i < count($weather_list); $i += 8) {
            $weather = $weather_list[$i];
            $date = $weather['dt_txt'];
            $temperature = $weather['main']['temp'];
            $feels_like = $weather['main']['feels_like'];
            $description = $weather['weather'][0]['main'];
            $pressure = $weather['main']['pressure'];
            $humidity = $weather['main']['humidity'];
            $wind_speed = $weather['wind']['speed'];
            $wind_direction = $weather['wind']['deg'];
            $icon = $weather['weather'][0]['icon'];

            // Add the values to the query
            $query .= "('$date', '$city', '$temperature', '$feels_like', '$description', '$pressure', '$humidity', '$wind_speed', '$wind_direction', '$icon'),";
        }

        // Remove the trailing comma from the query
        $query = rtrim($query, ",");

        // Execute the query
        $result = mysqli_query($con, $query);

        if ($result) {
            header("Location: ".$_SERVER['PHP_SELF']);
            exit();
        } else {
            ?>
            <script>
                alert("Error");
            </script>
            <?php
        }
    } else {
        ?>
        <script>
            alert("Failed to fetch weather data");
        </script>
        <?php
    }
}
?>

<form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
    <input type="text" name="city" placeholder="Enter city name">
    <button type="submit" name="save_btn">Save</button>
</form>
