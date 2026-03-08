document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. 3D Tilt Effect for Model Cards
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });

    function handleTilt(e) {
        const card = this;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation angles (max 10 degrees)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.1s ease';

        // Move glow effect following mouse
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.top = `${y - 100}px`;
            glow.style.left = `${x - 100}px`;
        }
    }

    function resetTilt(e) {
        const card = this;
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s ease-out';

        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.top = '-100px';
            glow.style.left = '-100px';
            setTimeout(() => {
                glow.style.left = 'auto';
                glow.style.right = '-100px';
            }, 500);
        }
    }

    // 3. Reveal Animations on Scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply reveal to code container
    const codeContainer = document.querySelector('.code-container');
    if (codeContainer) {
        codeContainer.style.opacity = '0';
        codeContainer.style.transform = 'translateY(40px)';
        codeContainer.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        revealObserver.observe(codeContainer);
    }

    // Smooth reveal for cards
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) ' + (index * 0.1) + 's';
        revealObserver.observe(card);
    });

    // 4. Typing Effect for Hero Title
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const phrases = [
            "reimagine everything",
            "build the future",
            "understand the world",
            "create without limits"
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // faster when deleting
            } else {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            // If word is complete
            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end of phrase
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before next phrase
            }

            setTimeout(type, typingSpeed);
        }

        // Start typing effect after a small initial delay
        setTimeout(type, 1000);
    }

    // 5. Smooth Parallax Scroll Effect
    const heroContent = document.querySelector('.hero-content');
    const blobBg = document.querySelector('.blob-bg');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                // Parallax for hero content (moves up at 0.4x speed and fades out smoothly)
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrollY * 0.4}px)`;
                    heroContent.style.opacity = Math.max(0, 1 - (scrollY / 600));
                }

                // Parallax for background blobs (moves up slightly at 0.15x speed)
                if (blobBg) {
                    blobBg.style.transform = `translateY(${scrollY * 0.15}px)`;
                }

                ticking = false;
            });
            ticking = true;
        }
    });
});
