(function () {
    const canvas = document.getElementById("terrainCanvas");
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    let scale = parseFloat(document.getElementById("scaleInput").value);
    let bias = parseFloat(document.getElementById("biasInput").value);
    let temperatureScale = parseFloat(
        document.getElementById("temperatureInput").value
    );
    let humidityScale = parseFloat(
        document.getElementById("humidityInput").value
    );
    let elevationScale = parseFloat(
        document.getElementById("elevationInput").value
    );
    let seed = document.getElementById("seedInput").value || Math.random();

    const perlin = new PerlinNoise();
    perlin.seed(seed);

    function generateTerrain() {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Generate noise values for elevation, temperature, and humidity
                const elevation =
                    perlin.noise(x * scale, y * scale) * elevationScale + bias;
                const temperature =
                    perlin.noise(x * temperatureScale, y * temperatureScale) +
                    bias;
                const humidity =
                    perlin.noise(x * humidityScale, y * humidityScale) + bias;

                const biome = getBiome(elevation, temperature, humidity);
                ctx.fillStyle = biomeColors[biome];
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }

    const biomeColors = {
        ocean: "#0000FF",
        beach: "#FFFF00",
        plains: "#00FF00",
        forest: "#008000",
        swamp: "#00FF7F",
        desert: "#FFFFA0",
        mountains: "#8B4513",
        snow: "#FFFFFF",
        tundra: "#FA4616",
    };
    function getBiome(elevation, temperature, humidity) {
        if (elevation < -0.2) return "ocean";
        if (elevation < -0.1) return "beach";
        if (elevation < 0) return "plains";

        if (temperature > 0.5) {
            if (humidity > 0.5) return "forest";
            if (humidity > 0.2) return "swamp";
            return "desert";
        }

        if (temperature < -0.5) return "snow";
        if (elevation > 0.5) {
            if (temperature > 0.1) return "snow";
            return "mountains";
        }
        return "plains";
    }

    function updateTerrain() {
        perlin.seed(seed);
        generateTerrain();
    }

    function handleInputChange(event) {
        const id = event.target.id;
        const value = parseFloat(event.target.value);

        switch (id) {
            case "scaleInput":
                scale = value;
                document.getElementById("scaleValue").textContent = value;
                break;
            case "biasInput":
                bias = value;
                document.getElementById("biasValue").textContent = value;
                break;
            case "temperatureInput":
                temperatureScale = value;
                document.getElementById("temperatureValue").textContent = value;
                break;
            case "humidityInput":
                humidityScale = value;
                document.getElementById("humidityValue").textContent = value;
                break;
            case "elevationInput":
                elevationScale = value;
                document.getElementById("elevationValue").textContent = value;
                break;
            case "seedInput":
                seed = value;
                break;
        }
        updateTerrain();
    }

    function handleEnterKey(event) {
        if (event.key === "Enter") {
            handleInputChange(event);
        }
    }

    document
        .getElementById("scaleInput")
        .addEventListener("change", handleInputChange);
    document
        .getElementById("biasInput")
        .addEventListener("change", handleInputChange);
    document
        .getElementById("temperatureInput")
        .addEventListener("change", handleInputChange);
    document
        .getElementById("humidityInput")
        .addEventListener("change", handleInputChange);
    document
        .getElementById("elevationInput")
        .addEventListener("change", handleInputChange);
    document
        .getElementById("seedInput")
        .addEventListener("change", handleInputChange);

    document
        .getElementById("scaleInput")
        .addEventListener("keydown", handleEnterKey);
    document
        .getElementById("biasInput")
        .addEventListener("keydown", handleEnterKey);
    document
        .getElementById("temperatureInput")
        .addEventListener("keydown", handleEnterKey);
    document
        .getElementById("humidityInput")
        .addEventListener("keydown", handleEnterKey);
    document
        .getElementById("elevationInput")
        .addEventListener("keydown", handleEnterKey);
    document
        .getElementById("seedInput")
        .addEventListener("keydown", handleEnterKey);

    document
        .getElementById("randomSeedButton")
        .addEventListener("click", () => {
            seed = Math.random().toString();
            document.getElementById("seedInput").value = seed;
            updateTerrain();
        });

    function displayBiomeInfo() {
        const biomeContainer = document.getElementById("biomeContainer");
        for (let biome in biomeColors) {
            const biomeItem = document.createElement("div");
            biomeItem.classList.add("biome-item");

            const biomeColor = document.createElement("div");
            biomeColor.classList.add("biome-color");
            biomeColor.style.backgroundColor = biomeColors[biome];

            const biomeName = document.createElement("span");
            biomeName.textContent = biome;

            biomeItem.appendChild(biomeColor);
            biomeItem.appendChild(biomeName);
            biomeContainer.appendChild(biomeItem);
        }
    }

    displayBiomeInfo();

    generateTerrain();
})();
