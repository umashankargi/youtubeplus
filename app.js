document.addEventListener('DOMContentLoaded', () => {
    // Show loading spinner initially
    document.querySelector('.loading-spinner').classList.add('active');
    
    // Hide loading spinner after 1.5 seconds (simulating content load)
    setTimeout(() => {
        document.querySelector('.loading-spinner').classList.remove('active');
    }, 1500);

    // Video data
    const videoContent = [
        {
            id: 'watch-now1',
            url: 'https://www.youtube.com/embed/qYvjYYElCqs',
            title: 'MrBeast vs IShowSpeed - The Ultimate Showdown!'
        },
        {
            id: 'watch-now2',
            url: 'https://www.youtube.com/embed/okoI0CqiGXU',
            title: 'Dr. Droom - Marvel\'s Next Big Villain?'
        },
        {
            id: 'watch-now3',
            url: 'https://www.youtube.com/embed/DG4WZpZ4710',
            title: 'The Untold Story of The Lion King'
        }
    ];

    // Sample search data
    const searchData = [
        {
            title: 'MrBeast vs IShowSpeed - The Ultimate Showdown!',
            image: 'thumb.jpg',
            url: 'https://www.youtube.com/embed/qYvjYYElCqs',
            views: '12M views',
            duration: '3:45'
        },
        {
            title: 'Dr. Droom - Marvel\'s Next Big Villain?',
            image: 'droom.png',
            url: 'https://www.youtube.com/embed/okoI0CqiGXU',
            views: '8.5M views',
            duration: '2:30'
        },
        {
            title: 'The Untold Story of The Lion King',
            image: 'lion.jpg',
            url: 'https://www.youtube.com/embed/DG4WZpZ4710',
            views: '5.2M views',
            duration: '4:15'
        },
        {
            title: 'Debba Debba Trailer',
            image: 'deb.jpg',
            url: 'https://www.youtube.com/embed/mTz-vR_lhh8',
            views: '3.1M views',
            duration: '1:45'
        },
        {
            title: 'Peddi Glimpse',
            image: 'ped.jpg',
            url: 'https://www.youtube.com/embed/tu4giJZVhPc',
            views: '2.8M views',
            duration: '2:10'
        }
    ];

    // DOM Elements
    const elements = {
        releasesGrid: document.getElementById('releases-grid'),
        releasesGridMostEpic: document.getElementById('releases-grid-most-epic'),
        searchToggle: document.getElementById('search-toggle'),
        searchButton: document.getElementById('search-button'),
        searchInput: document.getElementById('search-input'),
        searchResults: document.getElementById('search-results-container'),
        profileLink: document.getElementById('profile-link'),
        profileImageInput: document.getElementById('profile-image-input'),
        profileNameInput: document.getElementById('profile-name-input'),
        submitProfile: document.getElementById('submit-profile'),
        profileDisplay: document.getElementById('profile-display'),
        profileImage: document.getElementById('profile-image'),
        profileName: document.getElementById('profile-name'),
        videoModal: new bootstrap.Modal(document.getElementById('videoModal')),
        videoIframe: document.querySelector('#videoModal iframe'),
        videoModalLabel: document.getElementById('videoModalLabel'),
        fabMain: document.getElementById('fab-main'),
        fabOptions: document.querySelectorAll('.fab-option'),
        fabContainer: document.querySelector('.fab-container'),
        darkModeToggle: document.getElementById('darkModeToggle'),
        notificationsLink: document.getElementById('notifications-link'),
        notificationsModal: new bootstrap.Modal(document.getElementById('notificationsModal')),
        favoritesLink: document.getElementById('favorites-link')
    };

    // Initialize video players
    videoContent.forEach(video => {
        document.getElementById(video.id).addEventListener('click', () => {
            openVideoPlayer(video.url, video.title);
        });
    });

    // Initialize sliders
    setupSlider(elements.releasesGrid, 
              document.getElementById('releases-prev-button'), 
              document.getElementById('releases-next-button'));
              
    setupSlider(elements.releasesGridMostEpic, 
              document.getElementById('releases-prev-button-most-epic'), 
              document.getElementById('releases-next-button-most-epic'));

    // Search functionality
    elements.searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        new bootstrap.Modal(document.getElementById('searchModal')).show();
    });

    elements.searchButton.addEventListener('click', performSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Profile functionality
    elements.profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        new bootstrap.Modal(document.getElementById('profileModal')).show();
    });

    elements.profileImageInput.addEventListener('change', handleImageUpload);
    elements.submitProfile.addEventListener('click', saveProfile);

    // FAB functionality
    elements.fabMain.addEventListener('click', toggleFab);
    elements.fabOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            alert(`Feature coming soon: ${option.getAttribute('data-bs-original-title')}`);
        });
    });

    // Dark mode toggle
    elements.darkModeToggle.addEventListener('click', toggleDarkMode);

    // Notifications
    elements.notificationsLink.addEventListener('click', (e) => {
        e.preventDefault();
        elements.notificationsModal.show();
    });

    // Favorites link
    elements.favoritesLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Favorites feature coming soon!');
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Load saved profile
    loadProfile();

    // Functions
    function openVideoPlayer(url, title) {
        elements.videoIframe.src = `${url}?autoplay=1&rel=0&modestbranding=1`;
        elements.videoModalLabel.textContent = title;
        elements.videoModal.show();
    }

    function setupSlider(grid, prevBtn, nextBtn) {
        const items = grid.querySelectorAll('.release-item');
        const itemWidth = grid === elements.releasesGridMostEpic ? 135 : 240;
        const gap = 24;
        let position = 0;
        const maxPosition = (items.length - 1) * (itemWidth + gap);
        
        items.forEach(item => {
            item.addEventListener('click', () => {
                const videoUrl = item.getAttribute('data-video');
                const videoTitle = item.querySelector('p').textContent;
                openVideoPlayer(videoUrl, videoTitle);
            });
        });

        nextBtn.addEventListener('click', () => {
            position = Math.min(position + (itemWidth + gap) * 3, maxPosition);
            grid.scrollTo({ left: position, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            position = Math.max(position - (itemWidth + gap) * 3, 0);
            grid.scrollTo({ left: position, behavior: 'smooth' });
        });

        // Auto-hide nav buttons on mobile
        if (window.innerWidth <= 768) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
    }

    function performSearch() {
        const query = elements.searchInput.value.trim().toLowerCase();
        elements.searchResults.innerHTML = '';
        
        if (query) {
            const results = searchData.filter(video => 
                video.title.toLowerCase().includes(query)
            );
            
            if (results.length) {
                results.forEach(video => {
                    const item = document.createElement('div');
                    item.className = 'search-result-item';
                    item.innerHTML = `
                        <img src="${video.image}" alt="${video.title}">
                        <div>
                            <p>${video.title}</p>
                            <span class="meta">${video.views} • ${video.duration}</span>
                        </div>
                    `;
                    item.addEventListener('click', () => {
                        openVideoPlayer(video.url, video.title);
                        bootstrap.Modal.getInstance(document.getElementById('searchModal')).hide();
                    });
                    elements.searchResults.appendChild(item);
                });
            } else {
                elements.searchResults.innerHTML = `
                    <div class="text-center py-4">
                        <i class="fas fa-search fa-3x mb-3 text-muted"></i>
                        <p>No results found for "${query}"</p>
                    </div>
                `;
            }
        } else {
            elements.searchResults.innerHTML = `
                <div class="text-center py-4 text-muted">
                    <i class="fas fa-search fa-3x mb-3"></i>
                    <p>Search for your favorite videos</p>
                </div>
            `;
        }
    }

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                elements.profileImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    function saveProfile() {
        const name = elements.profileNameInput.value.trim();
        const file = elements.profileImageInput.files[0];
        
        if (name) {
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    localStorage.setItem('profileImage', e.target.result);
                    localStorage.setItem('profileName', name);
                    loadProfile();
                    bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
                };
                reader.readAsDataURL(file);
            } else {
                localStorage.setItem('profileName', name);
                loadProfile();
                bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
            }
        } else {
            alert('Please enter your name');
        }
    }

    function loadProfile() {
        const savedImage = localStorage.getItem('profileImage');
        const savedName = localStorage.getItem('profileName');
        
        if (savedImage) {
            elements.profileImage.src = savedImage;
            elements.profileLink.innerHTML = `<img src="${savedImage}" class="rounded-circle" width="30" height="30">`;
        }
        
        if (savedName) {
            elements.profileName.textContent = savedName;
            elements.profileNameInput.value = savedName;
        }
    }

    function toggleFab() {
        elements.fabContainer.classList.toggle('active');
        
        if (elements.fabContainer.classList.contains('active')) {
            elements.fabMain.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            elements.fabMain.innerHTML = '<i class="fas fa-plus"></i>';
        }
    }

    function toggleDarkMode() {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        
        if (isLightMode) {
            document.body.style.setProperty('--dark-bg', '#f8f9fa');
            document.body.style.setProperty('--card-bg', '#ffffff');
            document.body.style.setProperty('--text-light', '#212529');
            document.body.style.setProperty('--text-muted', '#6c757d');
            elements.darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.style.setProperty('--dark-bg', '#1a1a1a');
            document.body.style.setProperty('--card-bg', '#2a2a2a');
            document.body.style.setProperty('--text-light', '#f8f9fa');
            document.body.style.setProperty('--text-muted', '#adb5bd');
            elements.darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        localStorage.setItem('darkMode', isLightMode ? 'light' : 'dark');
    }

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'light') {
        toggleDarkMode();
    }

    // Close video modal when hidden
    document.getElementById('videoModal').addEventListener('hidden.bs.modal', () => {
        elements.videoIframe.src = '';
    });

    // Add animation to elements when they come into view
    const animateOnScroll = () => {
        const sections = document.querySelectorAll('.content-section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight - 100) {
                section.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    };

    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Add hover effect to category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
});