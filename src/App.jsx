import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// --- Particle Background Component ---
// Using a simple canvas-based particle animation
const ParticleBackground = () => {
    useEffect(() => {
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = document.body.scrollHeight; // Make canvas full page height
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        const init = () => {
            particles = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = 'rgba(34, 211, 238, 0.5)';
                particles.push(new Particle(x, y, directionX, directionY, size, color));
            }
        };

        const animate = () => {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connect();
        };
        
        const connect = () => {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                                 + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (canvas.width/7) * (canvas.height/7)) {
                        opacityValue = 1 - (distance/20000);
                        ctx.strokeStyle = `rgba(34, 211, 238, ${opacityValue})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        init();
        animate();
        // Recalculate on resize and load
        window.addEventListener('resize', () => {
            resizeCanvas();
            init();
        });


        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas id="particle-canvas" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, width: '100%', height: '100%' }} />;
};


// --- Global Styles Component ---
const GlobalStyles = () => (
  <style>{`
    /* --- GLOBAL STYLES & VARIABLES --- */
    :root {
      --color-bg-dark: #111827;
      --color-bg-medium: #1f2937;
      --color-bg-light: #374151;
      --color-text-primary: #ffffff;
      --color-text-secondary: #d1d5db;
      --color-text-muted: #9ca3af;
      --color-accent: #22d3ee;
      --color-accent-hover: #67e8f9;
      --font-primary: 'Inter', sans-serif;
    }

    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');

    body {
      background-color: var(--color-bg-dark);
      color: var(--color-text-primary);
      font-family: var(--font-primary);
      line-height: 1.6;
      letter-spacing: 0.5px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      margin: 0;
    }

    .app-wrapper {
        background-color: var(--color-bg-dark);
        position: relative;
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      box-sizing: border-box;
    }

    .section {
      padding-top: 5rem;
      padding-bottom: 5rem;
      position: relative;
      z-index: 2;
    }

    .section-skills, .section-experience, .section-contact, .footer {
      background-color: transparent;
    }

    .section-about, .section-projects, .section-achievements {
      background-color: var(--color-bg-medium);
    }

    .section-title {
      font-size: 2.25rem;
      font-weight: 800;
      text-align: center;
      margin-bottom: 3rem;
    }

    .text-highlight {
      color: var(--color-accent);
    }

    .btn {
      display: inline-block;
      font-weight: 700;
      padding: 0.75rem 2rem;
      border-radius: 9999px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-decoration: none;
      border: none;
      cursor: pointer;
    }

    .btn-primary {
      background-color: var(--color-accent);
      color: var(--color-bg-dark);
      box-shadow: 0 4px 14px 0 rgba(34, 211, 238, 0.39);
    }

    .btn-primary:hover {
      background-color: var(--color-accent-hover);
      transform: scale(1.05);
    }

    /* --- KEYFRAMES FOR ANIMATIONS --- */
    @keyframes pulse {
      50% { opacity: .5; }
    }

    @keyframes spin-slow {
      to { transform: rotate(360deg); }
    }

    @keyframes tilt {
      0%, 50%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(1deg); }
      75% { transform: rotate(-1deg); }
    }

    @keyframes ping {
      75%, 100% { transform: scale(2); opacity: 0; }
    }
    
    @keyframes animated-gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* --- HEADER --- */
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
      transition: all 0.3s ease;
    }

    .header.scrolled {
      background-color: rgba(17, 24, 39, 0.8);
      backdrop-filter: blur(4px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }

    .logo a {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-accent);
      text-decoration: none;
    }

    .nav-desktop {
      display: none;
    }

    .nav-desktop a {
      color: var(--color-text-secondary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .nav-desktop a:hover {
      color: var(--color-accent);
    }

    .nav-mobile-toggle button {
      background: none;
      border: none;
      color: var(--color-text-secondary);
      cursor: pointer;
    }
    .nav-mobile-toggle svg {
      width: 1.5rem;
      height: 1.5rem;
    }

    .nav-mobile-menu {
      background-color: rgba(31, 41, 55, 0.95);
      backdrop-filter: blur(4px);
    }

    .nav-mobile-menu a {
      display: block;
      padding: 0.75rem 1.5rem;
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .nav-mobile-menu a:hover {
      background-color: var(--color-bg-light);
      color: var(--color-accent);
    }

    /* --- HERO SECTION --- */
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      background: transparent;
    }

    .hero-container {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }

    .hero-content {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .hero-content h1 {
      font-size: 2.5rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 1rem;
    }

    .hero-content h1 span:first-child {
      color: var(--color-text-muted);
    }

    .name-highlight {
      color: var(--color-accent);
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-text-secondary);
      margin-bottom: 2rem;
      background: linear-gradient(90deg, var(--color-accent), #fff, var(--color-accent));
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: animated-gradient 3s ease-in-out infinite;
    }

    .social-links {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .social-links a {
      color: var(--color-text-muted);
      transition: all 0.3s ease;
    }

    .social-links a:hover {
      color: var(--color-accent);
      transform: scale(1.25);
    }

    .social-links .icon {
      width: 1.75rem;
      height: 1.75rem;
    }

    .icon-inline {
      display: inline-block;
      margin-left: 0.5rem;
      width: 1.25rem;
      height: 1.25rem;
      vertical-align: middle;
    }

    .hero-image-wrapper {
      width: 66.66%;
      max-width: 320px;
    }

    .hero-image-container {
      position: relative;
    }

    .hero-image-glow {
      position: absolute;
      inset: -0.25rem;
      background: linear-gradient(to right, var(--color-accent), #3b82f6);
      border-radius: 1.5rem;
      filter: blur(1.5rem);
      opacity: 0.5;
      transition: all 1s ease;
      animation: tilt 10s infinite linear;
    }

    .hero-image-container:hover .hero-image-glow {
      opacity: 1;
      transition-duration: 0.2s;
    }

    .hero-image {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 1rem;
      border: 4px solid var(--color-bg-light);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      object-fit: cover;
      aspect-ratio: 1 / 1;
    }

    /* --- ABOUT SECTION --- */
    .about-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3rem;
    }

    .about-text {
      font-size: 1.125rem;
      line-height: 1.75;
      color: var(--color-text-secondary);
    }

    .about-text p {
      margin-bottom: 1.5rem;
    }

    .education-card {
      background-color: rgba(55, 65, 81, 0.5);
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.06);
    }

    .education-card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-accent);
      margin-bottom: 1rem;
    }

    .education-card p {
      margin-bottom: 0.25rem;
    }
    .education-card p strong {
      color: var(--color-text-primary);
    }

    .about-animation-container {
      position: relative;
      width: 16rem;
      height: 16rem;
    }

    .ping-1, .ping-2 {
      position: absolute;
      border-radius: 9999px;
      opacity: 0.2;
      animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    .ping-1 {
      inset: 0;
      background-color: var(--color-accent);
    }
    .ping-2 {
      inset: 1rem;
      background-color: #3b82f6;
      animation-delay: 0.5s;
    }

    .react-logo-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-accent);
    }
    .react-logo {
      animation: spin-slow 10s linear infinite;
      width: 6rem;
      height: 6rem;
    }

    /* --- SKILLS --- */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }

    .skill-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background-color: var(--color-bg-medium);
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
    }

    .skill-card:hover {
      box-shadow: 0 0 15px rgba(34, 211, 238, 0.2);
    }

    .skill-icon {
      color: var(--color-accent);
      width: 3.5rem;
      height: 3.5rem;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .skill-icon svg {
      width: 100%;
      height: 100%;
    }

    .skill-card p {
      font-weight: 500;
      color: var(--color-text-primary);
      margin: 0;
    }

    /* --- PROJECTS --- */
    .projects-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .project-card {
      background-color: var(--color-bg-dark);
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .project-card:hover {
      box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
      transform: translateY(-5px);
    }

    .project-card-image {
        width: 100%;
        aspect-ratio: 16 / 9;
        object-fit: cover;
        filter: grayscale(50%);
        transition: filter 0.3s ease;
    }
    .project-card:hover .project-card-image {
        filter: grayscale(0%);
    }

    .project-card-content {
      padding: 1.5rem;
      flex-grow: 1;
    }

    .project-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-accent);
      margin-bottom: 0.5rem;
    }

    .project-card p {
      color: var(--color-text-muted);
      margin-bottom: 1rem;
      flex-grow: 1;
    }

    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .tag {
      background-color: var(--color-bg-light);
      color: var(--color-accent-hover);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
    }

    .project-card-footer {
      background-color: rgba(31, 41, 55, 0.5);
      padding: 1.5rem;
    }

    .project-card-footer a {
      color: var(--color-accent);
      font-weight: 600;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .project-card-footer a:hover {
      color: var(--color-accent-hover);
    }

    .icon-inline.small {
      width: 1rem;
      height: 1rem;
    }

    /* --- EXPERIENCE --- */
    .timeline {
      position: relative;
      border-left: 2px solid rgba(34, 211, 238, 0.3);
      padding-left: 2.5rem;
      margin-left: 1rem;
    }

    .timeline-item {
      margin-bottom: 3rem;
      position: relative;
    }
    .timeline-item:last-child {
      margin-bottom: 0;
    }

    .timeline-dot {
      position: absolute;
      left: -3.2rem;
      top: 5px;
      width: 1.5rem;
      height: 1.5rem;
      background-color: var(--color-accent);
      border-radius: 50%;
      border: 4px solid var(--color-bg-dark);
    }

    .timeline-content {
      background-color: var(--color-bg-medium);
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .timeline-duration {
      font-size: 0.875rem;
      color: var(--color-accent);
      font-weight: 600;
    }

    .timeline-content h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin-top: 0.25rem;
    }

    .timeline-company {
      color: var(--color-text-muted);
      margin-bottom: 0.75rem;
    }

    .timeline-content p {
      color: var(--color-text-secondary);
    }

    /* --- ACHIEVEMENTS --- */
    .achievements-grid {
      display: grid;
      gap: 1rem;
    }

    .achievement-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background-color: var(--color-bg-dark);
      border-radius: 0.5rem;
    }

    .achievement-icon {
      color: var(--color-accent);
      margin-top: 0.25rem;
      flex-shrink: 0;
    }
    .achievement-icon svg {
      width: 1.5rem;
      height: 1.5rem;
    }

    .achievement-item p {
      color: var(--color-text-secondary);
      margin: 0;
    }

    /* --- CONTACT --- */
    .contact-form-wrapper {
      max-width: 48rem;
      margin: 0 auto;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .contact-form label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      margin-bottom: 0.5rem;
    }

    .contact-form input,
    .contact-form textarea {
      width: 100%;
      background-color: var(--color-bg-medium);
      border: 2px solid var(--color-bg-light);
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      color: var(--color-text-primary);
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .contact-form input:focus,
    .contact-form textarea:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.5);
    }

    .form-submit-container {
      text-align: center;
    }

    .form-status {
      text-align: center;
      margin-top: 1rem;
      color: var(--color-accent);
    }

    /* --- FOOTER --- */
    .footer {
      border-top: 1px solid var(--color-bg-medium);
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    .footer-container {
      text-align: center;
      color: var(--color-text-muted);
    }

    .footer .social-links {
      margin-bottom: 1rem;
    }

    .footer .social-links .icon {
      width: 1.5rem;
      height: 1.5rem;
    }

    .footer-credits {
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    /* --- RESPONSIVE STYLES --- */
    @media (min-width: 768px) {
      .nav-desktop {
        display: flex;
        gap: 2rem;
      }
      .nav-mobile-toggle {
        display: none;
      }
      .hero-container {
        flex-direction: row;
      }
      .hero-content {
        width: 50%;
        text-align: left;
        margin-bottom: 0;
      }
      .social-links {
        justify-content: flex-start;
      }
      .hero-image-wrapper {
        width: 33.33%;
      }
      .about-content {
        flex-direction: row;
        gap: 3rem;
      }
      .about-text {
        width: 66.66%;
      }
      .about-animation {
        width: 33.33%;
      }
      .skills-grid {
        grid-template-columns: repeat(4, 1fr);
      }
      .projects-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .achievements-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .skills-grid {
        grid-template-columns: repeat(6, 1fr);
      }
      .projects-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `}</style>
);


// --- SVG Icon Components ---
const IconGithub = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const IconLinkedin = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const IconMail = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const IconPhone = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

const IconDownload = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

const IconHackerRank = (props) => (
    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.6c-5.302 0-9.6-4.298-9.6-9.6S6.698 2.4 12 2.4s9.6 4.298 9.6 9.6-4.298 9.6-9.6 9.6zM7.2 7.2v9.6h2.4V7.2H7.2zm7.2 0v9.6h2.4V7.2h-2.4zM12 10.8c-.663 0-1.2.537-1.2 1.2s.537 1.2 1.2 1.2 1.2-.537 1.2-1.2-.537-1.2-1.2-1.2z"/>
    </svg>
);

const IconLeetCode = (props) => (
    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 5.844a1.38 1.38 0 0 0-.438.961v10.392a1.38 1.38 0 0 0 .438.961l5.405 5.405a1.373 1.373 0 0 0 .961.438h7.032a1.378 1.378 0 0 0 1.378-1.378V1.378A1.378 1.378 0 0 0 20.515 0h-7.032zM18.428 16.5a.762.762 0 0 1-.762.762H12.25a.762.762 0 0 1-.762-.762v-3.375a.762.762 0 0 1 .762-.762h5.416a.762.762 0 0 1 .762.762v3.375zm0-6.875a.762.762 0 0 1-.762.762h-5.416a.762.762 0 0 1-.762-.762V6.25a.762.762 0 0 1 .762-.762h5.416a.762.762 0 0 1 .762.762v3.375zM4.996 9.125a.762.762 0 0 1-.762.762H3.328a.762.762 0 0 1-.762-.762V5.75a.762.762 0 0 1 .762-.762h.906a.762.762 0 0 1 .762.762v3.375z"/>
    </svg>
);

const IconJava = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>Java</title><path d="M8.33 3.067c0 2.224-1.53 3.518-1.53 3.518v.586c0 .387.232.58.232.58s.233.194.233.679v5.626c0 .387-.233.58-.233.58s-.232.194-.232.679v.586s1.53 1.294 1.53 3.518c0 .873-.465 1.547-1.085 1.935-.62.387-1.442.58-2.264.58-1.674 0-2.978-.58-3.72-1.742-.743-1.163-.977-2.88-.977-4.877V.113h7.44c.822 0 1.442.194 1.976.387.535.194.872.58.872 1.065 0 .485-.337.873-.872 1.066-.534.193-1.154.386-1.976.386h-2.88v.05zm14.723 11.239c0 1.646-.232 2.975-.872 4.095-.64 1.12-1.627 1.935-2.977 2.42-1.348.485-2.88.728-4.65.728-1.58 0-2.978-.193-4.272-.678-1.294-.485-2.325-1.294-3.067-2.32-.742-1.023-1.085-2.22-1.085-3.517 0-.97.194-1.84.678-2.788.484-.948 1.294-1.742 2.22-2.32.927-.58 2.063-.873 3.413-.873.743 0 1.442.097 2.136.29.694.194 1.349.485 1.883.97.535.484.927 1.065 1.217 1.74.29.678.484 1.448.484 2.32zm-7.298-2.22c-.62 0-1.14.12-1.674.388-.534.267-.926.655-1.217 1.163-.29.508-.484 1.113-.484 1.838 0 1.45.62 2.42 1.884 2.42.62 0 1.14-.193 1.58-.484.44-.29.742-.728.872-1.26.13-.534.194-1.163.194-1.888 0-.822-.194-1.448-.484-1.887-.29-.438-.694-.656-1.155-.656z"/></svg>;
const IconPython = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>Python</title><path d="M23.111 14.426C21.083 13.212 18.39 12 15.694 12H12v-2.805h2.28c2.413 0 4.37-1.958 4.37-4.37S16.693.455 14.28.455H7.532c-2.413 0-4.37 1.958-4.37 4.37s1.957 4.37 4.37 4.37H9.81V12H8.306c-2.696 0-5.389 1.212-7.417 2.426C-1.22 15.726 0 20.14 0 20.14h12l-.002-4.883h.002c2.413 0 4.37-1.958 4.37-4.37s-1.957-4.37-4.37-4.37H9.713v2.805h2.285L12 12v2.894h-2.28c-2.413 0-4.37 1.958-4.37 4.37S7.277 23.545 9.69 23.545h6.778c2.413 0 4.37-1.958 4.37-4.37s-1.957-4.37-4.37-4.37H12v-2.894h3.694c2.696 0 5.389-1.212 7.417-2.426 2.11-1.284-.002-5.7-..002-5.7zM15.694 6.37c1.026 0 1.858 1.048 1.858 2.344s-.832 2.344-1.858 2.344H12V6.37h3.694zm-8.55 14.663c-1.026 0-1.858-1.048-1.858-2.344s.832-2.344 1.858-2.344H12v4.688H7.144z"/></svg>;
const IconReact = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>React</title><path d="M12.001 2.002c-5.522 0-10 4.477-10 10s4.478 10 10 10 10-4.477 10-10-4.478-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.828-10.415c.79-.79 2.072-.79 2.862 0l.707.707c1.17 1.17 1.17 3.072 0 4.242l-2.12 2.122c-1.17 1.17-3.073 1.17-4.243 0l-.707-.707c-.79-.79-.79-2.072 0-2.862l3.52-3.52zm5.656-2.828c-1.17-1.17-3.072-1.17-4.242 0l-2.122 2.12c-.79.79-.79 2.072 0 2.862l.707.707c.79.79 2.072.79 2.862 0l3.52-3.52c.79-.79.79-2.072 0-2.862l-.725-.727z"/></svg>;
const IconNodeJs = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>Node.js</title><path d="M11.999 24a12 12 0 0 1-5.74-22.314l.43.862A11.003 11.003 0 1 0 12 1a11.012 11.012 0 0 0-5.323 1.51l.43.86a12.002 12.002 0 0 1 10.63 20.944l.013.006A11.95 11.95 0 0 1 12 24zM9.13 8.37H6.89v4.45h2.24v-4.45zm.26-1.34c0-.72.55-1.29 1.33-1.29s1.33.57 1.33 1.29-.55 1.29-1.33 1.29-1.33-.57-1.33-1.29zm-2.52 1.34v7.23H4.63V7.03h2.24zm3.87 7.23l3.47-7.23h2.32l-4.65 9.47h-2.34l4.63-9.47h-2.32l-2.28 4.78v4.45h2.17z"/></svg>;
const IconHtml5 = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>HTML5</title><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>;
const IconCss3 = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>CSS3</title><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-4.64l.24 2.573h4.155l-.33 3.42-2.91.803-2.954-.81-.188-2.11H6.247l.32 4.17L12 19.35l5.38-1.44.743-8.157-12.54-.002z"/></svg>;
const IconGit = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>Git</title><path d="M23.502 10.485c-1.522-1.24-3.268-2.02-5.13-2.288-.3-.043-.54-.33-.5-.632.04-.302.33-.54.63-.5.21 0 .42.02.63.04 2.18.33 4.15 1.25 5.89 2.72.24.2.32.53.18.8l-.18.21c-.24.27-.63.3-.91.06zM12 1.25C6.063 1.25 1.25 6.062 1.25 12S6.062 22.75 12 22.75c5.937 0 10.75-4.813 10.75-10.75 0-2.018-.57-3.91-1.572-5.52l-8.9 8.9a2.532 2.532 0 0 1-3.58 0 2.532 2.532 0 0 1 0-3.58l8.9-8.9C15.91 1.82 14.018 1.25 12 1.25zm0 3.125c1.45 0 2.77.563 3.75 1.563s1.562 2.3 1.562 3.75-.563 2.77-1.563 3.75-2.3 1.563-3.75 1.563-2.77-.563-3.75-1.563S6.688 11.137 6.688 9.688s.562-2.77 1.562-3.75S10.55 4.375 12 4.375z"/></svg>;
const IconJavascript = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>JavaScript</title><path d="M0 0h24v24H0V0zm22.034 18.262c.333-1.22.123-2.173-.347-3.21-.52-.96-1.28-1.593-2.227-2.113-.946-.52-1.92-.8-2.88-.753l.387.92c.6.093 1.173.347 1.72.727.546.387.96.893 1.213 1.5.28.607.347 1.28.147 1.987l-1.026.293c-.334-1.12-.88-1.94-1.586-2.427-.707-.486-1.574-.646-2.467-.44l.386.947c.48-.106.973-.046 1.426.16.454.207.827.54 1.107 1.027.28.487.427 1.053.427 1.687 0 .706-.153 1.36-.433 1.906-.28.547-.687 1.007-1.227 1.347-.54.34-1.186.52-1.92.52-.64 0-1.213-.12-1.72-.347-.506-.226-.92-.56-1.226-1-.307-.44-.494-.94-.534-1.467l-.973.2c.093.853.42 1.593 1.027 2.186.606.593 1.386.92 2.32 1.027.933.106 1.84-.027 2.653-.386.813-.36 1.44-.927 1.853-1.667.44-.74.647-1.6.58-2.506zM9.534 21.026c.427-.293.747-.667.947-1.133.2-.467.274-1.013.214-1.64l-1.026.187c.026.4.007.76-.066 1.053-.074.293-.22.54-.427.72-.207.18-.46.293-.747.333-.286.04-.593-.013-.906-.16-.314-.146-.534-.36-.64-.62-.107-.26-.12-.54-.04-.827.08-.286.24-.54.467-.746.226-.207.506-.367.826-.467l.56-.173-1.16-4.427h1.107l.6 2.4.52-2.4h1.033l-1.76 6.733c-.227.88-.634 1.573-1.22 2.053-.587.48-1.32.733-2.16.733-.427 0-.84-.08-1.227-.227-.386-.146-.72-.36-1-.626-.28-.267-.493-.58-.626-.933-.134-.353-.194-.74-.174-1.147l.986-.186c-.04.453.013.84.16 1.147.146.306.36.54.626.68.267.14.56.213.867.213.467 0 .893-.113 1.253-.333.36-.22.62-.54.76-.933z"/></svg>;
const IconMongodb = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>MongoDB</title><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.66 12.572c-.12.228-.288.432-.492.6a10.26 10.26 0 0 1-3.324 2.124c-.3.156-.612.3-.936.42-.324.12-.66.216-.996.3V12.6h.024c.336-.084.672-.18 1.008-.3.336-.12.66-.264.972-.432.312-.168.612-.372.888-.6.276-.228.528-.492.744-.78.216-.288.396-.6.54-.924.144-.324.24-.672.3-1.032.06-.36.084-.732.084-1.116 0-.552-.06-1.092-.18-1.608-.12-.516-.3-1.008-.552-1.464-.252-.456-.564-.864-.924-1.224-.36-.36-.78-.66-1.248-.888-.468-.228-1-.396-1.56-.504-.564-.108-1.152-.168-1.752-.168-.588 0-1.164.048-1.716.144s-1.092.24-1.596.444c-.504.204-.972.468-1.392.78-.42.312-.792.684-1.104 1.104-.312.42-.564.888-.744 1.392-.18.504-.288 1.032-.324 1.572-.036.54-.048 1.08-.048 1.608 0 .54.024 1.068.084 1.572.06.504.156 1 .288 1.464.132.468.312.912.528 1.32.216.408.48.78.78 1.116.3.336.648.636 1.032.888.384.252.804.468 1.26.636.456.168.936.3 1.44.384.504.084 1.02.12 1.548.12.516 0 1.02-.036 1.5-.12.48-.084.936-.204 1.356-.372.42-.168.816-.372 1.176-.612.36-.24.684-.516.96-.828.276-.312.504-.66.684-1.032.18-.372.3-.768.372-1.176.072-.408.108-.828.108-1.26 0-.216-.012-.432-.036-.636a.89.89 0 0 0-.168-.408z"/></svg>;
const IconExpress = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>Express</title><path d="M24 14.672c0-3.38-2.196-4.383-3.953-4.383h-1.22v-1.12h1.154c1.758 0 3.954-1.002 3.954-4.382C24 1.405 21.824 0 19.07 0H4.93C2.176 0 0 1.405 0 4.787c0 3.38 2.195 4.382 3.953 4.382h1.22v1.12H3.953C2.195 10.29 0 11.293 0 14.672c0 3.38 2.195 4.383 3.953 4.383h1.22v1.12H3.953C2.195 20.175 0 21.178 0 24h24V14.672zM3.465 2.784c0-1.08.79-1.39 1.464-1.39h14.143c.673 0 1.464.31 1.464 1.39v1.39c0 1.08-.79 1.39-1.464 1.39H4.93c-.674 0-1.465-.31-1.465-1.39V2.783zm1.465 17.584c-.674 0-1.465-.31-1.465-1.39v-1.39c0-1.08.79-1.39 1.465-1.39h4.088l5.04-7.56h-4.088c-1.758 0-3.953-1-3.953-4.383V7.84h10.996v1.39c0 1.08-.79 1.39-1.465 1.39h-4.088l-5.04 7.56h4.088c1.758 0 3.953 1 3.953 4.383v1.39c0 1.08-.79 1.39-1.465 1.39H4.93z"/></svg>;
const IconTensorflow = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>TensorFlow</title><path d="M12.01 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-3.32 19.22L4.25 17.4V6.6l4.44-1.82v14.44zm.67-15.07L18.75 8v1.88l-5.37-2.2v12.07l5.37-2.2V16l-9.41 3.85V4.15z"/></svg>;
const IconPytorch = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>PyTorch</title><path d="m20.86 11.79-6.39 3.69c-2.31 1.33-2.31 4.49 0 5.82l6.39 3.69c2.31 1.33 5.03-.35 5.03-3.03v-7.36c0-2.68-2.72-4.36-5.03-3.03zm-1.89 8.27a.3.3 0 0 1-.3 0l-6.39-3.69a.3.3 0 0 1-.15-.26V9.88a.3.3 0 0 1 .15-.26l6.39-3.69a.3.3 0 0 1 .3 0l6.39 3.69a.3.3 0 0 1 .15.26v7.36a.3.3 0 0 1-.15.26l-6.39 3.69zM8.13 8.52a4.26 4.26 0 1 0 0-8.52 4.26 4.26 0 0 0 0 8.52zm0-1.2a3.06 3.06 0 1 1 0-6.12 3.06 3.06 0 0 1 0 6.12zm-5 11.27a4.26 4.26 0 1 0 0-8.52 4.26 4.26 0 0 0 0 8.52zm0-1.2a3.06 3.06 0 1 1 0-6.12 3.06 3.06 0 0 1 0 6.12z"/></svg>;
const IconScikitLearn = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>scikit-learn</title><path d="M22.33 9.135a7.183 7.183 0 0 0-5.834-5.834 7.2 7.2 0 0 0-12.992 5.834v5.73a7.183 7.183 0 0 0 5.834 5.834 7.2 7.2 0 0 0 12.992-5.834zm-1.644 5.73a5.539 5.539 0 0 1-4.47 4.47 5.55 5.55 0 0 1-10-4.47v-5.73a5.539 5.539 0 0 1 4.47-4.47 5.55 5.55 0 0 1 10 4.47z"/></svg>;
const IconKeras = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>Keras</title><path d="M24 0H0v24h24V0zM8.42 5.32h2.34v4.14h3.28V5.32h2.34v13.36h-2.34v-4.9H10.76v4.9H8.42V5.32z"/></svg>;
const IconOpenCV = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>OpenCV</title><path d="M16.15 3.32A9.52 9.52 0 0 0 7.85 3.32a9.52 9.52 0 0 0-6.4 8.68 9.52 9.52 0 0 0 6.4 8.68 9.52 9.52 0 0 0 8.3 0 9.52 9.52 0 0 0 6.4-8.68 9.52 9.52 0 0 0-6.4-8.68zM7.85 5.07A6.47 6.47 0 0 1 12 4.1a6.47 6.47 0 0 1 4.15.97 6.47 6.47 0 0 1 3.2 3.2 6.47 6.47 0 0 1 0 6.46 6.47 6.47 0 0 1-3.2 3.2 6.47 6.47 0 0 1-4.15.97 6.47 6.47 0 0 1-4.15-.97 6.47 6.47 0 0 1-3.2-3.2 6.47 6.47 0 0 1 0-6.46 6.47 6.47 0 0 1 3.2-3.2zm-.7 4.8a2.15 2.15 0 1 1 0 4.3 2.15 2.15 0 0 1 0-4.3zm9.7 0a2.15 2.15 0 1 1 0 4.3 2.15 2.15 0 0 1 0-4.3z"/></svg>;
const IconHadoop = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>Apache Hadoop</title><path d="M15.46 8.41h-.02c-.32 0-.6-.02-.85-.05a1.8 1.8 0 0 0-.66-.23c-.2-.08-.38-.18-.54-.3a.9.9 0 0 0-.33-.4c-.1-.14-.15-.3-.15-.46 0-.1.02-.2.06-.3a.43.43 0 0 1 .18-.22c.1-.07.2-.1.33-.1.1 0 .2.03.3.08.1.05.15.13.15.23 0 .08-.03.15-.08.2-.05.05-.12.08-.2.08-.03 0-.05 0-.07-.02a.1.1 0 0 1-.05-.06.12.12 0 0 1 0-.08c0-.05.03-.1.08-.13a.24.24 0 0 1 .16-.05c.1 0 .2.03.28.08.08.05.14.13.17.22.03.1.05.2.05.33 0 .2-.05.38-.15.53-.1.15-.25.28-.44.38-.2.1-.42.16-.67.2-.25.03-.5.05-.76.05h-.02c-1.2 0-2.2-.2-3-.62-.8-.42-1.2-1.04-1.2-1.85 0-.65.25-1.2.76-1.65.5-.45 1.2-.68 2.1-.68.56 0 1.06.1 1.5.32.44.22.8.52 1.07.92l-1.3.66c-.1-.2-.24-.36-.4-.46-.18-.1-.38-.15-.6-.15-.38 0-.7.1-1 .28-.28.18-.42.44-.42.76 0 .3.13.54.4.7.28.17.62.25 1.04.25zm-3.4 8.35c.6-.42 1.3-.63 2.1-.63.6 0 1.1.1 1.52.32.42.22.75.52.98.9l-1.2 1c-.12-.2-.28-.35-.48-.45-.2-.1-.43-.15-.7-.15-.4 0-.72.1-1 .28-.28.18-.42.44-.42.78 0 .3.14.54.42.7.28.17.62.25 1.04.25h.02c.32 0 .6-.02.85-.05.26-.03.5-.1.67-.2.2-.1.38-.2.53-.32.15-.12.28-.27.38-.45.1-.18.15-.38.15-.6l1.5-.2c0 .3-.08.6-.23.85a1.8 1.8 0 0 1-.6.67c-.28.2-.6.35-1 .45-.35.1-.74.16-1.15.16-1.2 0-2.2-.2-3-.6-.8-.42-1.2-1.05-1.2-1.85 0-.65.25-1.2.75-1.65zM12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm-1.2 20.4c-.8-.5-1.4-1.1-1.8-1.8-.4-.7-.6-1.5-.6-2.4 0-.9.2-1.7.6-2.4.4-.7 1-1.3 1.8-1.8.8-.5 1.7-.7 2.7-.7s1.9.2 2.7.7c.8.5 1.4 1.1 1.8 1.8.4.7.6 1.5.6 2.4 0 .9-.2 1.7-.6 2.4-.4.7-1 1.3-1.8 1.8-.8.5-1.7.7-2.7.7s-1.9-.2-2.7-.7z"/></svg>;
const IconSpark = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>Apache Spark</title><path d="M12.93 6.65L9.2 12.01l3.72 5.35-1.7 1.2-4.59-6.57 4.59-6.56zm4.66 1.2l-1.7 1.2-2.12-3.05 1.7-1.2zm-7.44 10.7l-2.12-3.05-1.7 1.2 2.12 3.05zM12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 21.6c-5.3 0-9.6-4.3-9.6-9.6S6.7 2.4 12 2.4s9.6 4.3 9.6 9.6-4.3 9.6-9.6 9.6z"/></svg>;
const IconTableau = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>Tableau</title><path d="M5.76 11.28h3.36v9.36h-3.36zm4.32-3.36h3.36v12.72h-3.36zm4.32-4.32h3.36v17.04h-3.36zM2.4 2.4h19.2v2.4H2.4z"/></svg>;
const IconPowerBi = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>Microsoft Power BI</title><path d="M12.512 1.21a.48.48 0 0 0-.448.24l-3.36 6.72H5.04a.48.48 0 0 0-.408.768l6.72 9.36a.48.48 0 0 0 .816 0l6.72-9.36a.48.48 0 0 0-.408-.768h-3.664l-3.36-6.72a.48.48 0 0 0-.448-.24zM3.84 20.16a.48.48 0 0 0 .48.48h15.36a.48.48 0 0 0 .48-.48v-3.84a.48.48 0 0 0-.48-.48H3.84a.48.48 0 0 0-.48.48z"/></svg>;
const IconJenkins = (props) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>Jenkins</title><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.06 19.44c-3.12 0-3.12-2.22-3.12-2.22s.12 2.22-1.92 2.22-2.16-2.22-2.16-2.22S4.8 19.44 2.7 19.44s-2.22-2.22-2.22-2.22.42 2.22-2.22 2.22V6.78s2.64-2.22 2.22-2.22-2.22 2.22-2.22 2.22S2.7 4.56 4.8 4.56s2.22 2.22 2.22 2.22-1.92-2.22-2.16-2.22S2.7 6.78 2.7 6.78s2.1-2.22 2.1-4.56h4.62s-.18 4.62 2.46 4.62c2.58 0 2.46-4.62 2.46-4.62h4.62s0 2.34-2.1 4.56c-2.1 2.22-2.16-2.22-2.16-2.22s-2.22 2.22-2.22-2.22S14.7 4.56 16.8 4.56s2.22 2.22 2.22 2.22-2.22-2.22-2.22-2.22.42 2.22-2.22 2.22V17.22s2.64 2.22 2.22 2.22-2.22-2.22-2.22-2.22S16.8 19.44 18.9 19.44s2.22-2.22 2.22-2.22-2.22 2.22-2.22 2.22.42-2.22-2.22-2.22h-4.62s.18-4.62-2.46-4.62c-2.64 0-2.46 4.62-2.46 4.62H5.22s0-2.34 2.1-4.56c2.1-2.22 2.16 2.22 2.16 2.22s2.22-2.22 2.22 2.22S9.6 19.44 7.5 19.44s-2.22-2.22-2.22-2.22 2.22 2.22 2.22 2.22z"/></svg>;


const PHOTO_URL = "/Jahnavi.png";

// Resume data
const resumeData = {
  name: "JAHNAVI J P",
  title: "CSE-DS Student|AIML&DL Enthusiast|Big Data Analyst (Hadoop, HDFS, Hive, Pig, PySpark)|Full Stack Developer (MERN, Python)|Data Visualization (Tableau, Power BI)|DevOps(Jenkins,Maven,Gradle)|Cloud Computing|Researcher",
  contact: {
    email: "jahnavi2056@gmail.com",
    phone: "+91-9353-935663",
    github: "https://github.com/jahnavi2056",
    linkedin: "https://www.linkedin.com/in/jahnavi-j-p-a70a2a260",
    hackerrank: "https://www.hackerrank.com/profile/jahnavi2056",
    leetcode: "https://leetcode.com/u/janu2004/",
  },
  education: {
    degree: "Bachelor of Engineering - Computer Science",
    institution: "Acharya Institute of Technology (VTU)",
    cgpa: "9.56",
  },
  summary: "A passionate and driven Computer Science engineer with a strong foundation in full-stack web development and a keen interest in Artificial Intelligence and Machine Learning. Proven ability to lead projects, collaborate in teams, and deliver high-quality results in fast-paced environments. Also a dedicated athlete with national-level achievements, demonstrating discipline and a competitive spirit.",
  skills: [
    { name: "Java", icon: <IconJava /> },
    { name: "Python", icon: <IconPython /> },
    { name: "JavaScript", icon: <IconJavascript /> },
    { name: "React.js", icon: <IconReact /> },
    { name: "Node.js", icon: <IconNodeJs /> },
    { name: "Express.js", icon: <IconExpress /> },
    { name: "MongoDB", icon: <IconMongodb /> },
    { name: "HTML5", icon: <IconHtml5 /> },
    { name: "CSS3", icon: <IconCss3 /> },
    { name: "TensorFlow", icon: <IconTensorflow /> },
    { name: "PyTorch", icon: <IconPytorch /> },
    { name: "Scikit-learn", icon: <IconScikitLearn /> },
    { name: "Keras", icon: <IconKeras /> },
    { name: "OpenCV", icon: <IconOpenCV /> },
    { name: "Hadoop", icon: <IconHadoop /> },
    { name: "Spark", icon: <IconSpark /> },
    { name: "Tableau", icon: <IconTableau /> },
    { name: "Power BI", icon: <IconPowerBi /> },
    { name: "Git", icon: <IconGit /> },
    { name: "Jenkins", icon: <IconJenkins /> },
  ],
  experience: [
    {
      role: "Student Researcher - Epileptic Seizure Detection",
      company: "Bangalore, India",
      duration: "June 2024 - Nov 2024",
      description: "Conducted EEG-based epileptic seizure detection using ML and DL models (SVM, CNN, RNN), with Python-driven feature extraction and analysis, achieving high accuracy to support early diagnosis.",
    },
    {
      role: "Web Development Intern",
      company: "CodSoft",
      duration: "July 2024 - Aug 2024",
      description: "Completed three development tasks using HTML, CSS, and JavaScript, including a personal portfolio website, a responsive landing page, and a functional calculator. Strengthened skills in UI design and layout structuring.",
    },
    {
        role: "Product Innovator",
        company: "Startup Incubation Project",
        duration: "Remote",
        description: "Developed eco-friendly tissue paper from dry leaf waste, contributing to sustainable living. Designed a product advertisement using frontend technologies and initiated the patent process after selection for incubation support."
    }
  ],
  projects: [
    {
      title: "Dream Capture AI",
      description: "A deep learning system aimed at decoding and reconstructing dream content using EEG signals with CNN/RNN architectures.",
      link: "https://github.com/jahnavi2056/DreamCaptureAl",
      tags: ["TensorFlow", "Keras", "EEG", "AI"],
      image: "https://thumbs.dreamstime.com/b/female-entrepreneur-dragging-text-dream-big-young-female-entrepreneur-dragging-stone-text-dream-big-stepping-up-105671789.jpg"
    },
    {
      title: "Prefix-Based Keyword API",
      description: "Developed and deployed a RESTful API that accepts a list of keywords and returns the smallest unique prefix for each.",
      link: "https://github.com/jahnavi2056/prefix-management",
      tags: ["Node.js", "Express.js", "React.js", "Render"],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW2rQ7oG7T5gLhnoutWxQO4FLZh4LngvxYfgXVZhn4WaSaSTU7l6Pnccz8w-OSR6FDJKU&usqp=CAU"
    },
    {
      title: "Virtual Health Assistant",
      description: "A big data-driven health assistant that analyzes patient symptoms and history using the Hadoop ecosystem and PySpark.",
      link: "https://github.com/jahnavi2056/BDA",
      tags: ["Hadoop", "PySpark", "MongoDB", "Big Data"],
      image: "https://cdn-cchkmpj.nitrocdn.com/CJXGnJvCvbQYOSNVvxpLvOYcHhpJDKbH/assets/images/optimized/rev-f4ff6bb/ossisto.com/wp-content/uploads/2023/05/Benefits-of-Healthcare-Virtual-Assistants.webp"
    },
    {
      title: "AI Design for Artisans",
      description: "Generates AI-assisted 3D prototype designs for pottery and handicrafts using the Stable Diffusion model.",
      link: "https://github.com/jahnavi2056/Artisans-Stable-diffusion-model",
      tags: ["Stable Diffusion", "Hugging Face", "AI", "Design"],
      image: "https://www.shutterstock.com/image-photo/kolkata-india-november-26-smiling-600nw-788025343.jpg"
    },
    {
        title: "DocuBot",
        description: "Conversational AI chatbot that extracts, indexes, and answers questions from uploaded PDF documents using TF-IDF and cosine similarity.",
        link: "https://github.com/jahnavi2056/DocuBot",
        tags: ["Flask", "scikit-learn", "NLP", "Chatbot"],
        image: "https://www.nextiva.com/blog/wp-content/uploads/sites/10/2024/07/Conversational-AI-Chatbots.webp"
    },
    {
        title: "Product bAsed E-Commerce Website",
        description: "a responsive online shopping platform with features like user login, product search, cart, and secure checkout.",
        link: "https://github.com/jahnavi2056/Product-based-E-Commerce-Website",
        tags: ["MERN stack (MongoDB, Express.js, React.js, Node.js)", "REST API", "Full-stack development"],
        image: "https://themefisher.com/blog/flipmart.webp"
    },

  ],
  achievements: [
    "Published research paper in Neural Nexus Journal (WoS indexed).",
    "2nd Place, State Level Srishti Hackathon 2024.",
    "National Finalist, E-Yuva BIRAC Competition 2024.",
    "Received project incubation support from Acharya Institute of Technology.",
    "Top 10 Finalist, State-Level Ideathon 2024.",
    "3rd Place, VTU Inter-collegiate Power Lifting Competition 2023.",
    "Represented Karnataka State and VTU in National Handball Championships.",
  ]
};

// Animated Section Wrapper
const AnimatedSection = ({ children, id }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    const variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    return (
        <motion.section
            id={id}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            className={`section section-${id}`}
        >
            <div className="container">
                {children}
            </div>
        </motion.section>
    );
};

// Header Component
const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = ["About", "Skills", "Projects", "Experience", "Contact"];

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container header-container">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="logo"
                >
                    <a href="#home">JP</a>
                </motion.div>
                <nav className="nav-desktop">
                    {navLinks.map(link => (
                        <a key={link} href={`#${link.toLowerCase()}`}>{link}</a>
                    ))}
                </nav>
                <div className="nav-mobile-toggle">
                    <button onClick={() => setIsOpen(!isOpen)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path></svg>
                    </button>
                </div>
            </div>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="nav-mobile-menu"
                >
                    {navLinks.map(link => (
                        <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setIsOpen(false)}>{link}</a>
                    ))}
                </motion.div>
            )}
        </header>
    );
};

// Hero Section
const Hero = () => {
    return (
        <section id="home" className="hero-section">
            <div className="container hero-container">
                <motion.div 
                    className="hero-content"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h1>
                        <span>Hi, I'm </span>
                        <span className="name-highlight">{resumeData.name}</span>
                    </h1>
                    <p className="hero-subtitle">{resumeData.title}</p>
                    <div className="social-links">
                        <a href={resumeData.contact.github} target="_blank" rel="noopener noreferrer"><IconGithub className="icon" /></a>
                        <a href={resumeData.contact.linkedin} target="_blank" rel="noopener noreferrer"><IconLinkedin className="icon" /></a>
                        <a href={resumeData.contact.hackerrank} target="_blank" rel="noopener noreferrer"><IconHackerRank className="icon" /></a>
                        <a href={resumeData.contact.leetcode} target="_blank" rel="noopener noreferrer"><IconLeetCode className="icon" /></a>
                        <a href={`mailto:${resumeData.contact.email}`}><IconMail className="icon" /></a>
                        <a href={`tel:${resumeData.contact.phone}`}><IconPhone className="icon" /></a>
                    </div>
                    <motion.a 
                        href="/JP_RESUME.pdf" 
                        download
                        className="btn btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Download Resume <IconDownload className="icon-inline" />
                    </motion.a>
                </motion.div>
                <motion.div 
                    className="hero-image-wrapper"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 120, delay: 0.4 }}
                >
                    <div className="hero-image-container">
                        <div className="hero-image-glow"></div>
                        <img src={PHOTO_URL} alt={resumeData.name} className="hero-image" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// About Section
const About = () => {
    return (
        <AnimatedSection id="about">
            <h2 className="section-title">About <span className="text-highlight">Me</span></h2>
            <div className="about-content">
                <motion.div 
                    className="about-text"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p>{resumeData.summary}</p>
                    <div className="education-card">
                        <h3>Education</h3>
                        <p><strong>{resumeData.education.degree}</strong></p>
                        <p>{resumeData.education.institution}</p>
                        <p>CGPA: {resumeData.education.cgpa}</p>
                    </div>
                </motion.div>
                <motion.div 
                    className="about-animation"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="about-animation-container">
                        <div className="ping-1"></div>
                        <div className="ping-2"></div>
                        <div className="react-logo-container">
                            <IconReact className="react-logo" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatedSection>
    );
};

// Skills Section
const Skills = () => {
    return (
        <AnimatedSection id="skills">
            <h2 className="section-title">My <span className="text-highlight">Skills</span></h2>
            <div className="skills-grid">
                {resumeData.skills.map((skill, index) => (
                    <motion.div 
                        key={index}
                        className="skill-card"
                        whileHover={{ scale: 1.1, y: -8 }}
                    >
                        <div className="skill-icon">{skill.icon}</div>
                        <p>{skill.name}</p>
                    </motion.div>
                ))}
            </div>
        </AnimatedSection>
    );
};

// Projects Section
const Projects = () => {
    return (
        <AnimatedSection id="projects">
            <h2 className="section-title">My <span className="text-highlight">Projects</span></h2>
            <div className="projects-grid">
                {resumeData.projects.map((project, index) => (
                    <motion.div 
                        key={index}
                        className="project-card"
                        whileHover={{ y: -10 }}
                    >
                        <img src={project.image} alt={project.title} className="project-card-image" />
                        <div className="project-card-content">
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="project-tags">
                                {project.tags.map(tag => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="project-card-footer">
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                                View on GitHub <IconGithub className="icon-inline small" />
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </AnimatedSection>
    );
};

// Experience Section
const Experience = () => {
    return (
        <AnimatedSection id="experience">
            <h2 className="section-title">Work <span className="text-highlight">Experience</span></h2>
            <div className="timeline">
                {resumeData.experience.map((exp, index) => (
                    <motion.div 
                        key={index}
                        className="timeline-item"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <p className="timeline-duration">{exp.duration}</p>
                            <h3>{exp.role}</h3>
                            <p className="timeline-company">{exp.company}</p>
                            <p>{exp.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </AnimatedSection>
    );
};

// Achievements Section
const Achievements = () => {
    return (
        <AnimatedSection id="achievements">
            <h2 className="section-title">Achievements & <span className="text-highlight">Certifications</span></h2>
            <div className="achievements-grid">
                {resumeData.achievements.map((achievement, index) => (
                     <motion.div 
                        key={index}
                        className="achievement-item"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                     >
                        <div className="achievement-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p>{achievement}</p>
                    </motion.div>
                ))}
            </div>
        </AnimatedSection>
    );
};

// Contact Section
const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');
        // This is a mock submission. For a real form, you would use a service like EmailJS, Formspree, or a backend server.
        setTimeout(() => {
            setStatus('Message sent successfully!');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus(''), 3000);
        }, 2000);
    };

    return (
        <AnimatedSection id="contact">
            <h2 className="section-title">Get In <span className="text-highlight">Touch</span></h2>
            <div className="contact-form-wrapper">
                <form onSubmit={handleSubmit} className="contact-form">
                    <div>
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="message">Message</label>
                        <textarea name="message" id="message" rows="4" required value={formData.message} onChange={handleChange}></textarea>
                    </div>
                    <div className="form-submit-container">
                        <motion.button 
                            type="submit" 
                            className="btn btn-primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Send Message
                        </motion.button>
                    </div>
                    {status && <p className="form-status">{status}</p>}
                </form>
            </div>
        </AnimatedSection>
    );
};

// Footer Component
const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="social-links">
                    <a href={resumeData.contact.github} target="_blank" rel="noopener noreferrer"><IconGithub className="icon" /></a>
                    <a href={resumeData.contact.linkedin} target="_blank" rel="noopener noreferrer"><IconLinkedin className="icon" /></a>
                    <a href={resumeData.contact.hackerrank} target="_blank" rel="noopener noreferrer"><IconHackerRank className="icon" /></a>
                    <a href={resumeData.contact.leetcode} target="_blank" rel="noopener noreferrer"><IconLeetCode className="icon" /></a>
                    <a href={`mailto:${resumeData.contact.email}`}><IconMail className="icon" /></a>
                    <a href={`tel:${resumeData.contact.phone}`}><IconPhone className="icon" /></a>
                </div>
                <p>&copy; {new Date().getFullYear()} {resumeData.name}. All Rights Reserved.</p>
                <p className="footer-credits">Designed & Built with ❤️</p>
            </div>
        </footer>
    );
};

// Main App Component
export default function App() {
  return (
    <div className="app-wrapper">
        <ParticleBackground />
        <GlobalStyles />
        <Header />
        <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Achievements />
            <Contact />
        </main>
        <Footer />
    </div>
  );
}
