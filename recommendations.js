// Recommendations Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const songInput = document.getElementById('song-input');
    const searchButton = document.getElementById('search-button');
    const recommendationsResults = document.getElementById('recommendations-results');
    const recommendationsContainer = document.getElementById('recommendations-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    
    // Add event listeners
    searchButton.addEventListener('click', getRecommendations);
    songInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getRecommendations();
        }
    });
    
    // Load data and model
    let spotifyData = null;
    let scaler = null;
    
    // Load the data
    async function loadData() {
        try {
            // In a real application, you would load the data from a server
            // For this demo, we'll use a simplified approach
            const response = await fetch('data 2/data.csv');
            const csvText = await response.text();
            
            // Parse CSV (simplified version)
            const lines = csvText.split('\n');
            const headers = lines[0].split(',');
            
            // Create data array
            const data = [];
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim() === '') continue;
                
                const values = lines[i].split(',');
                const entry = {};
                
                for (let j = 0; j < headers.length; j++) {
                    entry[headers[j]] = values[j];
                }
                
                data.push(entry);
            }
            
            spotifyData = data;
            console.log('Data loaded successfully');
            return data;
        } catch (error) {
            console.error('Error loading data:', error);
            return null;
        }
    }
    
    // Function to get recommendations
    async function getRecommendations() {
        const songName = songInput.value.trim();
        
        if (!songName) {
            alert('Please enter a song name');
            return;
        }
        
        // Show loading indicator
        loadingIndicator.style.display = 'flex';
        recommendationsResults.style.display = 'none';
        errorMessage.style.display = 'none';
        
        try {
            // If data is not loaded yet, load it
            if (!spotifyData) {
                await loadData();
            }
            
            // Find the song in the dataset
            const song = getSongData(songName, spotifyData);
            
            if (!song) {
                // Show error message
                errorMessage.style.display = 'flex';
                loadingIndicator.style.display = 'none';
                return;
            }
            
            // Get recommendations
            const recommendations = recommendSongs([songName], spotifyData);
            
            // Display recommendations
            displayRecommendations(recommendations);
            
            // Hide loading indicator and show results
            loadingIndicator.style.display = 'none';
            recommendationsResults.style.display = 'block';
            
        } catch (error) {
            console.error('Error getting recommendations:', error);
            errorMessage.style.display = 'flex';
            loadingIndicator.style.display = 'none';
        }
    }
    
    // Function to generate random image URL
    function getRandomImageUrl(songName, index) {
        // Use Picsum Photos for reliable landscape photos
        // This is the only option that consistently works
        return `https://picsum.photos/seed/${songName.replace(/\s+/g, '')}_${index}/200/200?category=nature`;
    }
    
    // Function to display recommendations
    function displayRecommendations(recommendations) {
        // Clear previous recommendations
        recommendationsContainer.innerHTML = '';
        
        // Add each recommendation as a card
        recommendations.forEach((song, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Get a random image URL for this song
            const imageUrl = getRandomImageUrl(song.name, index);
            
            card.innerHTML = `
                <div class="card-image">
                    <img src="${imageUrl}" alt="${song.name}">
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <h3>${song.name}</h3>
                <p>${song.artists || 'Unknown Artist'} (${song.year})</p>
            `;
            
            recommendationsContainer.appendChild(card);
        });
    }
    
    // Function to get song data by name
    function getSongData(songName, data) {
        const matches = data.filter(song => 
            song.name.toLowerCase() === songName.toLowerCase());
        
        if (matches.length > 0) {
            return matches[0];
        } else {
            console.warn(`Warning: '${songName}' not found in the dataset.`);
            return null;
        }
    }
    
    // Function to recommend songs using cosine similarity (based on the notebook model)
    function recommendSongs(songNames, data, numSongs = 10) {
        // Define numerical columns for similarity calculation (same as in the notebook)
        const numberCols = ['valence', 'year', 'acousticness', 'danceability', 'duration_ms', 'energy', 'explicit',
            'instrumentalness', 'key', 'liveness', 'loudness', 'mode', 'popularity', 'speechiness', 'tempo'];
        
        // Get song vectors for the input songs
        const songVectors = [];
        for (const songName of songNames) {
            const songData = getSongData(songName, data);
            if (songData) {
                const songVector = [];
                for (const col of numberCols) {
                    songVector.push(parseFloat(songData[col]) || 0);
                }
                songVectors.push(songVector);
            }
        }
        
        if (songVectors.length === 0) {
            console.error('No valid songs found for recommendation');
            return [];
        }
        
        // Calculate mean vector (song center)
        const songCenter = [];
        for (let i = 0; i < numberCols.length; i++) {
            let sum = 0;
            for (const vector of songVectors) {
                sum += vector[i];
            }
            songCenter.push(sum / songVectors.length);
        }
        
        // Calculate distances between song center and all songs
        const distances = [];
        for (let i = 0; i < data.length; i++) {
            const songVector = [];
            for (const col of numberCols) {
                songVector.push(parseFloat(data[i][col]) || 0);
            }
            
            // Calculate cosine similarity
            const similarity = cosineSimilarity(songCenter, songVector);
            // Convert to distance (1 - similarity)
            const distance = 1 - similarity;
            
            distances.push({ index: i, distance: distance });
        }
        
        // Sort by distance (ascending)
        distances.sort((a, b) => a.distance - b.distance);
        
        // Get recommendations (excluding input songs)
        const recommendations = [];
        const lowerSongNames = songNames.map(name => name.toLowerCase());
        
        for (const item of distances) {
            const song = data[item.index];
            if (!lowerSongNames.includes(song.name.toLowerCase())) {
                recommendations.push(song);
                if (recommendations.length >= numSongs) {
                    break;
                }
            }
        }
        
        return recommendations;
    }
    
    // Helper function to calculate cosine similarity between two vectors
    function cosineSimilarity(vecA, vecB) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        
        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);
        
        if (normA === 0 || normB === 0) {
            return 0;
        }
        
        return dotProduct / (normA * normB);
    }
});