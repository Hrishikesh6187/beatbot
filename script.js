// Script for Music Recommendation Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize browse tab functionality
    initBrowseTab();
    // Initialize browse tab functionality
    initBrowseTab();
    // Initialize horizontal scrolling for sections
    initHorizontalScroll();
    
    // Initialize player controls
    initPlayerControls();
    
    // Initialize like buttons
    initLikeButtons();
    
    // Replace all image placeholders with random images
    replaceImagePlaceholders();
});

/**
 * Initialize horizontal scrolling functionality
 */
function initHorizontalScroll() {
    const scrollContainers = document.querySelectorAll('.horizontal-scroll');
    
    scrollContainers.forEach(container => {
        // Add mouse wheel scrolling
        container.addEventListener('wheel', function(e) {
            if (e.deltaY !== 0) {
                e.preventDefault();
                container.scrollLeft += e.deltaY;
            }
        });
        
        // Add keyboard navigation
        container.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                container.scrollLeft += 100;
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                container.scrollLeft -= 100;
            }
        });
    });
}

/**
 * Initialize player controls functionality
 */
function initPlayerControls() {
    const playButton = document.querySelector('.play-btn');
    const pauseButton = document.querySelector('.fa-pause');
    const progressBar = document.querySelector('.progress');
    const progressFilled = document.querySelector('.progress-filled');
    
    // Play button functionality
    if (playButton) {
        playButton.addEventListener('click', function() {
            // Simulate playing the featured song
            console.log('Playing featured song');
        });
    }
    
    // Pause button functionality
    if (pauseButton) {
        pauseButton.addEventListener('click', function() {
            // Toggle between play and pause
            if (this.classList.contains('fa-pause')) {
                this.classList.remove('fa-pause');
                this.classList.add('fa-play');
                console.log('Paused');
            } else {
                this.classList.remove('fa-play');
                this.classList.add('fa-pause');
                console.log('Playing');
            }
        });
    }
    
    // Progress bar functionality
    if (progressBar) {
        progressBar.addEventListener('click', function(e) {
            const progressWidth = this.clientWidth;
            const clickPosition = e.offsetX;
            const percentPlayed = (clickPosition / progressWidth) * 100;
            
            // Update progress bar fill
            progressFilled.style.width = `${percentPlayed}%`;
            console.log(`Seeking to ${percentPlayed.toFixed(2)}%`);
        });
    }
}

/**
 * Initialize like buttons functionality
 */
function initBrowseTab() {
    const browseTab = document.querySelector('.menu li:nth-child(2)');
    const browseContent = document.createElement('div');
    browseContent.className = 'browse-content';
    browseContent.innerHTML = `
        <div class='browse-container'>
            <h2>Browse Music</h2>
            <div class='categories'>
                <div class='category-item'>
                    <i class='fas fa-music'></i>
                    <span>Genres</span>
                </div>
                <div class='category-item'>
                    <i class='fas fa-star'></i>
                    <span>Top Charts</span>
                </div>
                <div class='category-item'>
                    <i class='fas fa-calendar'></i>
                    <span>New Releases</span>
                </div>
            </div>
        </div>
    `;

    browseTab.addEventListener('click', function() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = '';
        mainContent.appendChild(browseContent);
    });
}

function initLikeButtons() {
    const likeButtons = document.querySelectorAll('.fa-heart');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle between filled and outline heart
            if (this.classList.contains('far')) {
                this.classList.remove('far');
                this.classList.add('fas');
                this.style.color = '#e51d4f';
                console.log('Added to favorites');
            } else {
                this.classList.remove('fas');
                this.classList.add('far');
                this.style.color = '';
                console.log('Removed from favorites');
            }
        });
    });
}

/**
 * Generate a random image URL using Picsum Photos
 * @param {string} name - The name to use as seed for the image
 * @param {number} index - Index to ensure uniqueness
 * @returns {string} - The generated image URL
 */
function getRandomImageUrl(name, index) {
    // Use Picsum Photos for reliable landscape photos
    return `https://picsum.photos/seed/${name.replace(/\s+/g, '')}_${index}/200/200?category=nature`;
}

/**
 * Replace all static image placeholders with random images
 */
function replaceImagePlaceholders() {
    // Replace featured image
    const featuredImage = document.querySelector('.featured-image img');
    if (featuredImage) {
        featuredImage.src = getRandomImageUrl('featured', 0);
    }
    
    // Replace song card images
    const songCards = document.querySelectorAll('.card');
    songCards.forEach((card, index) => {
        const img = card.querySelector('.card-image img');
        const title = card.querySelector('h3')?.textContent || `song${index}`;
        const artist = card.querySelector('p')?.textContent || 'artist';
        
        if (img) {
            img.src = getRandomImageUrl(`${title}_${artist}`, index);
        }
    });
    
    // Replace Top Streams Real-time images
    const streamItems = document.querySelectorAll('.stream-item');
    streamItems.forEach((item, index) => {
        const img = item.querySelector('.stream-image img');
        const title = item.querySelector('h4')?.textContent || `stream${index}`;
        const artist = item.querySelector('p')?.textContent || 'artist';
        
        if (img) {
            img.src = getRandomImageUrl(`stream_${title}_${artist}`, index);
        }
    });
    
    // Replace player bar image
    const playerImage = document.querySelector('.track-image img');
    if (playerImage) {
        const trackName = document.querySelector('.track-details p')?.textContent || 'current_track';
        const artistName = document.querySelector('.track-details .artist')?.textContent || 'artist';
        playerImage.src = getRandomImageUrl(`player_${trackName}_${artistName}`, 0);
    }
}

/**
 * Navigate to recommendation page
 */
function goToRecommendations() {
    window.location.href = 'recommendations.html';
}

// Add event listeners for category items
document.addEventListener('DOMContentLoaded', function() {
    // Initialize browse tab functionality
    initBrowseTab();
    // Initialize browse tab functionality
    initBrowseTab();
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Navigate to recommendations page with the selected category
            const category = this.querySelector('h4').textContent;
            console.log(`Selected category: ${category}`);
            // In a real app, you would pass the category as a parameter
            goToRecommendations();
        });
    });
});

/**
 * Generate a random image URL using Picsum Photos
 * @param {string} name - The name to use as seed for the imagethe 
 * @param {number} index - Index to ensure uniqueness
 * @returns {string} - The generated image URL
 */
function getRandomImageUrl(name, index) {
    // Use Picsum Photos for reliable landscape photos
    return `https://picsum.photos/seed/${name.replace(/\s+/g, '')}_${index}/200/200?category=nature`;
}

/**
 * Replace all static image placeholders with random images
 */
function replaceImagePlaceholders() {
    // Replace featured image
    const featuredImage = document.querySelector('.featured-image img');
    if (featuredImage) {
        featuredImage.src = getRandomImageUrl('featured', 0);
    }
    
    // Replace song card images
    const songCards = document.querySelectorAll('.card');
    songCards.forEach((card, index) => {
        const img = card.querySelector('.card-image img');
        const title = card.querySelector('h3')?.textContent || `song${index}`;
        const artist = card.querySelector('p')?.textContent || 'artist';
        
        if (img) {
            img.src = getRandomImageUrl(`${title}_${artist}`, index);
        }
    });
    
    // Replace Top Streams Real-time images
    const streamItems = document.querySelectorAll('.stream-item');
    streamItems.forEach((item, index) => {
        const img = item.querySelector('.stream-image img');
        const title = item.querySelector('h4')?.textContent || `stream${index}`;
        const artist = item.querySelector('p')?.textContent || 'artist';
        
        if (img) {
            img.src = getRandomImageUrl(`stream_${title}_${artist}`, index);
        }
    });
    
    // Replace player bar image
    const playerImage = document.querySelector('.track-image img');
    if (playerImage) {
        const trackName = document.querySelector('.track-details p')?.textContent || 'current_track';
        const artistName = document.querySelector('.track-details .artist')?.textContent || 'artist';
        playerImage.src = getRandomImageUrl(`player_${trackName}_${artistName}`, 0);
    }
}

// Call the function to replace images when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize browse tab functionality
    initBrowseTab();
    // Initialize browse tab functionality
    initBrowseTab();
    // Initialize horizontal scrolling for sections
    initHorizontalScroll();
    
    // Initialize player controls
    initPlayerControls();
    
    // Initialize like buttons
    initLikeButtons();
    
    // Replace all image placeholders with random images
    replaceImagePlaceholders();
});