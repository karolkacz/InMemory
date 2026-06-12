document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle (Day / Night)
    initThemeToggle();

    // 2. Background Slideshow (Hero Carousel)
    initSlideshow();

    // 3. Scroll Reveal Animations
    initScrollReveal();

    // 4. Share Logic
    initShareLogic();

    // 5. Lightbox Gallery with Navigation & Swipes
    initLightbox();

    // 6. Custom Video Play
    initVideoPlay();
});

/* Theme Toggle Logic */
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeButtonText(toggleBtn, currentTheme);

    toggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButtonText(toggleBtn, newTheme);
    });
}

function updateThemeButtonText(button, theme) {
    if (theme === 'dark') {
        button.innerHTML = `
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
            Tryb dzienny
        `;
    } else {
        button.innerHTML = `
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            Tryb nocny
        `;
    }
}

/* Background Slideshow (Hero Carousel) */
function initSlideshow() {
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    slides[currentSlide].classList.add('active');

    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

/* Scroll Reveal Animations */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
}

/* Share Logic (Web Share API with Fallback Modal) */
function initShareLogic() {
    const shareBtn = document.getElementById('share-btn');
    const modalOverlay = document.getElementById('share-modal-overlay');
    const closeBtn = document.getElementById('close-modal');
    const copyBtn = document.getElementById('copy-url-btn');

    if (!shareBtn || !modalOverlay || !closeBtn || !copyBtn) return;

    shareBtn.addEventListener('click', () => {
        const pageTitle = document.title;
        const pageUrl = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: pageTitle,
                text: 'Strona pamięci Andrzeja Wiśniewskiego',
                url: pageUrl
            }).catch(err => {
                console.log('Error sharing:', err);
            });
        } else {
            modalOverlay.classList.add('active');
        }
    });

    const closeModal = () => {
        modalOverlay.classList.remove('active');
    };

    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    copyBtn.addEventListener('click', () => {
        const pageUrl = window.location.href;
        navigator.clipboard.writeText(pageUrl).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Link skopiowany!';
            copyBtn.style.backgroundColor = '#4CAF50';
            copyBtn.style.color = '#FFFFFF';
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '';
                copyBtn.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Błąd kopiowania: ', err);
        });
    });
}

/* Lightbox Gallery Viewer with Navigation & Swipe Gestures */
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');
    if (galleryItems.length === 0) return;

    // Create array of image sources for easy lookup
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);
    let currentIndex = 0;

    // Create lightbox element dynamically if not exists
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Zamknij">&times;</button>
            <button class="lightbox-arrow lightbox-prev" aria-label="Poprzednia">&lsaquo;</button>
            <img class="lightbox-content" src="" alt="Powiększone zdjęcie">
            <button class="lightbox-arrow lightbox-next" aria-label="Następna">&rsaquo;</button>
        `;
        document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('.lightbox-content');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    // Show image based on index
    const showImage = (index) => {
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;
        currentIndex = index;
        lightboxImg.src = images[currentIndex];
    };

    // Open lightbox on image click
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            showImage(index);
            lightbox.classList.add('active');
            document.body.classList.add('lightbox-open');
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    };

    // Click Handlers
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
    });
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex + 1);
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showImage(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            showImage(currentIndex + 1);
        }
    });

    // Mobile swipe gestures
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const threshold = 50; // minimum swipe distance in pixels
        const swipeDistance = touchEndX - touchStartX;
        
        if (swipeDistance > threshold) {
            // Swiped right -> go to previous image
            showImage(currentIndex - 1);
        } else if (swipeDistance < -threshold) {
            // Swiped left -> go to next image
            showImage(currentIndex + 1);
        }
    };
}

/* Custom Video Play Logic (Clean Custom Poster -> Autoplay YouTube) */
function initVideoPlay() {
    const videoWrapper = document.getElementById('video-wrapper');
    if (!videoWrapper) return;

    const poster = videoWrapper.querySelector('.video-poster');
    if (!poster) return;

    poster.addEventListener('click', () => {
        videoWrapper.innerHTML = `
            <iframe 
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                src="https://www.youtube.com/embed/MllCZ9eZk2I?autoplay=1&rel=0&modestbranding=1" 
                title="Wspomnienie wideo" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
            </iframe>
        `;
        videoWrapper.style.position = 'relative';
    });
}
