// Function to generate random image URL
function getRandomImageUrl(name, index) {
    // Use Picsum Photos for reliable landscape photos
    return `https://picsum.photos/seed/${name.replace(/\s+/g, '')}_${index}/200/200?category=nature`;
}

// Function to parse CSV data
async function loadSongsFromCSV() {
    try {
        const response = await fetch('data 2/data.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        const nameIndex = headers.indexOf('name');
        const artistIndex = headers.indexOf('artists');
        
        return lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
                const values = line.split(',');
                return {
                    title: values[nameIndex]?.replace(/"/g, '').trim(),
                    artist: values[artistIndex]?.replace(/"/g, '').trim()
                };
            });
    } catch (error) {
        console.error('Error loading songs:', error);
        return [];
    }
}

// Initialize songs array
let songs = [];

// Load songs when the page loads
window.addEventListener('load', async () => {
    songs = await loadSongsFromCSV();
});

function stringSimilarity(a, b) {
    // Simple Levenshtein distance implementation
    const matrix = [];
    let i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    let j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1).toLowerCase() === a.charAt(j - 1).toLowerCase()) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }
    return 1 - matrix[b.length][a.length] / Math.max(a.length, b.length);
}

function findMostSimilarSong(query) {
    let bestMatch = null;
    let bestScore = -1;
    for (const song of songs) {
        if (song.title && song.title.toLowerCase() === query.toLowerCase()) {
            return { song, exact: true };
        }
        const score = stringSimilarity(query, song.title || '');
        if (score > bestScore) {
            bestScore = score;
            bestMatch = song;
        }
    }
    return { song: bestMatch, exact: false };
}

document.getElementById("browse-search-button").addEventListener("click", function() {
    const input = document.getElementById("browse-song-input").value.trim();
    const resultsSection = document.getElementById("browse-results");
    const resultContainer = document.getElementById("browse-result-container");
    const loading = document.getElementById("browse-loading-indicator");
    const errorContainer = document.getElementById("browse-error-container");
    const errorMsg = document.getElementById("browse-error-message");

    resultsSection.style.display = "none";
    errorContainer.style.display = "none";
    loading.style.display = "flex";
    resultContainer.innerHTML = "";

    setTimeout(() => {
        loading.style.display = "none";
        if (!input) {
            errorMsg.textContent = "Please enter a song name.";
            errorContainer.style.display = "flex";
            return;
        }
        if (songs.length === 0) {
            errorMsg.textContent = "Song data is not loaded yet. Please try again.";
            errorContainer.style.display = "flex";
            return;
        }
        const { song, exact } = findMostSimilarSong(input);
        if (!song) {
            errorMsg.textContent = "No songs found.";
            errorContainer.style.display = "flex";
            return;
        }
        const imageUrl = getRandomImageUrl(song.title, 1);
        resultContainer.innerHTML = `
            <div class="browse-card">
                <div class="browse-card-image"><img src="${imageUrl}" alt="${song.title}"></div>
                <div class="browse-card-title">${song.title}${exact ? "" : " (Closest Match)"}</div>
                <div class="browse-card-artist">${song.artist}</div>
            </div>
        `;
        resultsSection.style.display = "block";
    }, 700);
});

document.getElementById("browse-song-input").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        document.getElementById("browse-search-button").click();
    }
});