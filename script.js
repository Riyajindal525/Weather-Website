let btn = document.querySelector("button");
let input = document.querySelector("input");
let resultDiv = document.querySelector("#result");
let suggestionDiv = document.querySelector("#suggestion");

// Add enter key support
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        btn.click();
    }
});

btn.addEventListener("click", () => {
    let city = input.value.trim();
    if (city === "") {
        alert("Please enter a city name");
        return;
    }
    
    // Add loading state
    btn.textContent = "Loading...";
    btn.disabled = true;
    resultDiv.classList.remove("show");
    suggestionDiv.classList.remove("show");
    
    getCoordinates(city);
});

async function getCoordinates(city) {
    try {
        let geoRes = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
            { headers: { 'User-Agent': 'weather-app-demo' } }
        );

        if (geoRes.data.length > 0) {
            let lat = geoRes.data[0].lat;
            let lon = geoRes.data[0].lon;
            getWeather(lat, lon);
        } else {
            alert("City not found!");
            resetButton();
        }
    } catch (error) {
        console.error(error);
        resetButton();
    }
}

async function getWeather(lat, lon) {
    try {
        let weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        let temp = weatherRes.data.current_weather.temperature;
        let wind = weatherRes.data.current_weather.windspeed;

        resultDiv.innerHTML = `
            <h2>🌡 Temperature: ${temp}°C</h2>
            <h3>💨 Wind Speed: ${wind} km/h</h3>
        `;

        // Show results with animation
        setTimeout(() => {
            resultDiv.classList.add("show");
        }, 100);

        // Update background and suggestions based on temperature
        document.body.classList.remove("cold-weather", "perfect-weather", "hot-weather");

        if (temp < 15) {
            document.body.classList.add("cold-weather");
            suggestionDiv.innerHTML = "❄️ It's cold! Wear warm clothes and maybe grab a hot drink.";
            alert("❄️ It's cold! Wear warm clothes and maybe grab a hot drink.");
        } else if (temp < 25) {
            document.body.classList.add("perfect-weather");
            suggestionDiv.innerHTML = "🌤 Perfect weather! Great day for a walk outside.";
            alert("🌤 Perfect weather! Great day for a walk outside.");
        } else {
            document.body.classList.add("hot-weather");
            suggestionDiv.innerHTML = "🔥 It's hot! Stay hydrated!";
            alert("🔥 It's hot! Stay hydrated!");
        }

        // Show suggestion with delay
        setTimeout(() => {
            suggestionDiv.classList.add("show");
        }, 300);

        resetButton();

    } catch (error) {
        console.error(error);
        resetButton();
    }
}

function resetButton() {
    btn.textContent = "Check Weather";
    btn.disabled = false;
}
