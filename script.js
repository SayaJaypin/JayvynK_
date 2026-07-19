document.addEventListener("DOMContentLoaded", () => {
    /* ==========================================
       1. LOADING SCREEN & PROGRESS
       ========================================== */
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.progress-bar');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if(progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => loadingScreen.remove(), 800);
            }, 300);
        }
        progressBar.style.width = `${progress}%`;
    }, 100);

    /* ==========================================
       2. CUSTOM CURSOR & MAGNETIC EFFECT
       ========================================== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Aktifkan hanya di device yang memiliki hover state (Desktop)
    if(window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });

        // Hover effect pada elemen interaktif
        const interactables = document.querySelectorAll('a, button, .faq-question');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(128,128,128,0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });

        // Efek Magnetic untuk tombol utama
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', function(e) {
                const position = btn.getBoundingClientRect();
                const x = e.pageX - position.left - position.width / 2;
                const y = e.pageY - position.top - position.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
            });
            btn.addEventListener('mouseout', function() {
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    /* ==========================================
       3. DARK / LIGHT MODE TOGGLE
       ========================================== */
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    // Ambil preferensi dari LocalStorage
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    themeBtn.addEventListener('click', () => {
        const newTheme = htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if(theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    /* ==========================================
       4. SCROLL PROGRESS & BACK TO TOP
       ========================================== */
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = `${scrolled}%`;

        if(scrollTop > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ==========================================
       5. REVEAL ANIMATION ON SCROLL
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal-anim');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Menjalankan animasi angka counter saat elemen tampil
                if(entry.target.classList.contains('large-glass-panel') && !animatedStats) {
                    animateCounters();
                    animatedStats = true;
                }
            }
        });
    }, { rootMargin: '0px 0px -100px 0px', threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; // 2 detik
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if(current < target) {
                    stat.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = target;
                }
            };
            updateCounter();
        });
    }

    /* ==========================================
       6. FAQ ACCORDION LOGIC
       ========================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            // Menutup semua accordion
            faqItems.forEach(el => el.classList.remove('active'));
            // Membuka accordion yang diklik (jika belum terbuka)
            if(!isActive) {
                item.classList.add('active');
            }
        });
    });
});
