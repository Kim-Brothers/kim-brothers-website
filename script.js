// ===== Cursor Glow =====
const glow = document.getElementById('cursor-glow');
const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (glow && !isReduced && window.innerWidth > 768) {
    let mx = 0, my = 0, gx = 0, gy = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
    }, { passive: true });

    (function loop() {
        gx += (mx - gx) * 0.12;
        gy += (my - gy) * 0.12;
        glow.style.left = gx + 'px';
        glow.style.top = gy + 'px';
        requestAnimationFrame(loop);
    })();
}

// ===== Navigation =====
const nav = document.getElementById('nav');
const burger = document.getElementById('nav-burger');
const navLinks = document.getElementById('nav-links');
const links = navLinks.querySelectorAll('a');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

links.forEach(a => {
    a.addEventListener('click', () => {
        burger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Active link tracking
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
    const y = window.scrollY + 250;
    sections.forEach(s => {
        const top = s.offsetTop;
        const id = s.getAttribute('id');
        if (y >= top && y < top + s.offsetHeight) {
            links.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === '#' + id);
            });
        }
    });
}, { passive: true });

// ===== Hero Canvas — Particle Field =====
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const count = window.innerWidth < 768 ? 40 : 80;

    function resize() {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: 1.5 + Math.random() * 1.5,
                a: 0.15 + Math.random() * 0.3
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6, 255, 165, ${p.a})`;
            ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = dx * dx + dy * dy;

                if (dist < 22000) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(6, 255, 165, ${0.06 * (1 - dist / 22000)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        if (!isReduced) requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', resize);
}

// ===== Scroll Reveals =====
const reveals = document.querySelectorAll('.reveal-up, .reveal-slide-right');

const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObs.unobserve(e.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObs.observe(el));

// ===== Hero Parallax =====
if (!isReduced && window.innerWidth > 768) {
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
            const r = y / window.innerHeight;
            heroContent.style.transform = `translateY(${y * 0.2}px)`;
            heroContent.style.opacity = 1 - r * 1.2;
        }
    }, { passive: true });
}

// ===== Contact Email Obfuscation =====
const _u = 'contact', _d = 'kimbrothers', _t = 'net';
const _addr = `${_u}@${_d}.${_t}`;

const emailText = document.getElementById('email-text');
if (emailText) emailText.textContent = _addr;

const form = document.getElementById('contact-form');
if (form) {
    form.action = `https://formsubmit.co/${_addr}`;
    const btn = form.querySelector('button');
    form.addEventListener('submit', () => {
        btn.innerHTML = '<span>Sending...</span>';
        btn.disabled = true;
    });
}
