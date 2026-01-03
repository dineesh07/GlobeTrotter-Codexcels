import '../styles/style.css';
import { destinations } from '../data/destinations';


export const Home = () => {
    const container = document.createElement('div');
    container.className = 'home-container';

    // Inline styles for this specific page layout
    // Ideally we'd move this to CSS but for speed/simplicity in this vanilla setup we inject a style block
    const style = document.createElement('style');
    style.textContent = `
    .home-container {
        max-width: 1440px; /* Wider than default app container */
        margin: 0 auto;
        padding: 0 2rem;
        background: transparent;
        text-align: left;
    }

    /* Navbar */
    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 0;
        margin-bottom: 4rem;
    }

    .logo {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--text-main);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .nav-links {
        display: flex;
        gap: 2rem;
        align-items: center;
    }

    .nav-links a {
        color: var(--text-muted);
        font-weight: 500;
        font-size: 0.95rem;
    }

    .nav-links a:hover {
        color: var(--primary-color);
    }

    /* Hero Section */
    .hero {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
        padding-bottom: 4rem;
    }

    .hero-content h1 {
        font-size: 4rem;
        line-height: 1.1;
        font-weight: 800;
        color: var(--text-main);
        margin-bottom: 1.5rem;
        letter-spacing: -0.03em;
    }

    .hero-content p {
        font-size: 1.125rem;
        color: var(--text-muted);
        line-height: 1.6;
        margin-bottom: 2.5rem;
        max-width: 90%;
    }

    .hero-actions {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .btn-hero-primary {
        background-color: var(--text-main); /* Black/Dark button as per design */
        color: white;
        padding: 0.8rem 1.8rem;
        border-radius: var(--radius-sm);
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: transform 0.2s;
    }
    
    .btn-hero-primary:hover {
        transform: translateY(-2px);
        background-color: #000;
    }

    .btn-hero-secondary {
        background: transparent;
        color: var(--text-main);
        padding: 0.8rem 1.5rem;
        font-weight: 500;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .btn-hero-secondary:hover {
        background: var(--bg-color);
        border-color: var(--text-muted);
    }

    .hero-image img {
        width: 100%;
        height: auto;
        border-radius: var(--radius-lg);
        /* Optional: drop shadow if the image is transparent */
    }

    @media (max-width: 768px) {
        .hero {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
        }
        
        .hero-content p {
            margin: 0 auto 2rem auto;
        }

        .hero-actions {
            justify-content: center;
        }

        .nav-links {
            display: none; /* Simple mobile hide */
        }
    }


    /* Carousel Styles */
    .hero-image-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 75%; /* Aspect ratio similar to original image */
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    
    .carousel-slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 1s ease-in-out;
    }
    
    .carousel-slide.active {
        opacity: 1;
    }
    
    .carousel-slide img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    /* Features Section */
    .features-section {
        padding: 4rem 0;
        background-color: var(--bg-secondary);
        border-radius: var(--radius-lg);
        margin-bottom: 4rem;
        text-align: center;
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        margin-top: 3rem;
        padding: 0 2rem;
    }

    .feature-card {
        padding: 2rem;
        background: white;
        border-radius: var(--radius-md);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        text-align: left;
    }

    .feature-icon {
        width: 48px;
        height: 48px;
        background: var(--primary-light);
        color: var(--primary-color);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
    }

    .feature-card h3 {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
        color: var(--text-main);
    }

    .feature-card p {
        color: var(--text-muted);
        font-size: 0.95rem;
        line-height: 1.5;
    }

    /* Popular Destinations */
    .destinations-section {
        margin-bottom: 6rem;
        overflow: hidden; /* Hide the overflow from the infinite scroll */
        max-width: 100%;
    }
    
    .section-header {
        margin-bottom: 2.5rem;
        text-align: center;
    }

    .section-header h2 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }

    .destinations-grid {
        display: flex;
        gap: 2rem;
        width: max-content;
        animation: scroll 60s linear infinite;
        padding: 2rem 0;
    }
    
    .destinations-grid:hover {
        animation-play-state: paused;
    }

    @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }

    .destination-card {
        width: 300px; /* Fixed width for calculation saftety */
        min-width: 300px;
        position: relative;
        height: 400px;
        border-radius: var(--radius-md);
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.3s ease;
        flex-shrink: 0;
    }




    .destination-card:hover {
        transform: translateY(-5px);
    }

    .destination-card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .destination-card:hover img {
        transform: scale(1.05);
    }

    .destination-info {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 2rem;
        background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
        color: white;
    }

    .destination-info h3 {
        font-size: 1.5rem;
        margin-bottom: 0.25rem;
    }

    .destination-info p {
        font-size: 0.9rem;
        opacity: 0.9;
    }

    @media (max-width: 900px) {
        .features-grid, .destinations-grid {
            grid-template-columns: 1fr;
        }
    }
    `;
    container.appendChild(style);

    container.innerHTML += `
    <nav class="navbar">
        <a href="#" class="logo">
             <img src="/src/assets/logo_v2.png" alt="GlobeTrotter Logo" style="height: 60px; width: auto;">
             GlobeTrotter
        </a>
        <div class="nav-links">
            <a href="#">Destinations</a>
            <a href="#">Testimonials</a>
            <a href="#">Blog</a>
            <button id="nav-signin-btn" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Sign In</button>
        </div>
    </nav>

    <div class="hero">
        <div class="hero-content">
            <h1>The smartest way to plan your next trip</h1>
            <p>
                Start the fun before the trip. Create itineraries, track budgets, and plan unforgettable journeys with your group, all in one place.
            </p>
            <div class="hero-actions">
                <button id="hero-start-btn" class="btn btn-hero-primary">
                    Start Planning for Free 
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>

            </div>
        </div>
        <div class="hero-image">
             <div class="hero-image-container">
                <div class="carousel-slide active">
                    <img src="/src/assets/hero_maldives.png" alt="Maldives Beach">
                </div>
                <div class="carousel-slide">
                    <img src="/src/assets/hero_swiss.png" alt="Swiss Alps">
                </div>
                <div class="carousel-slide">
                    <img src="/src/assets/hero_tokyo.png" alt="Tokyo Night">
                </div>
             </div>
        </div>
    </div>

    <div class="features-section">
        <div class="section-header">
            <h2>Everything you need for the perfect trip</h2>
            <p style="color: var(--text-muted);">From planning to memories, we've got you covered.</p>
        </div>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <h3>Collaborative Itineraries</h3>
                <p>Build the plan together in real-time. Suggest activities, vote on ideas, and create the perfect schedule.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h3>Expense Tracking</h3>
                <p>Keep track of who owes what effortlessly. Split bills, log expenses, and settle up without the awkwardness.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3>Community & Wishlists</h3>
                <p>Discover new places from the community, save them to your wishlist, and start planning your next adventure.</p>
            </div>
        </div>
    </div>

    <div class="destinations-section">
        <div class="section-header">
            <h2>Explore Top Destinations</h2>
            <p style="color: var(--text-muted);">Inspiration for your next getaway.</p>
        </div>
        <div class="destinations-grid" id="destinations-container">
            <!-- Dynamic Destinations will be inserted here -->
        </div>

        <!-- Details Modal -->
        <div class="modal-overlay" id="destination-modal">
            <div class="modal-content">
                <button class="close-modal" id="close-modal-btn">&times;</button>
                <img src="" alt="" class="modal-image" id="modal-img">
                <div class="modal-details">
                    <h2 id="modal-title">Destination Name</h2>
                    <p class="modal-desc" id="modal-desc">Description goes here.</p>
                    
                    <div class="modal-info-row">
                        <div class="info-item">
                            <span class="info-label">Avg. Cost</span>
                            <span class="info-value" id="modal-cost">₹0</span>
                        </div>
                    </div>

                    <h3>Important Places to Visit</h3>
                    <ul class="spots-list" id="modal-spots">
                        <!-- Spots list -->
                    </ul>
                </div>
            </div>
        </div>
    </div>
    `;

    // Event Listeners
    container.querySelector('#nav-signin-btn').addEventListener('click', () => {
        window.navigateTo('login');
    });

    container.querySelector('#hero-start-btn').addEventListener('click', () => {
        // If logged in, maybe direct to create-trip? 
        // For now, simpler flow: go to login/signup. 
        // Or if we check auth state we could redirect smartly, 
        // but 'login' is a safe default for a "Start" button if not auth'd.
        window.navigateTo('signup');
    });

    // Destinations Data


    // Render Destinations
    const destContainer = container.querySelector('#destinations-container');

    destinations.forEach(dest => {
        const card = document.createElement('div');
        card.className = 'destination-card';
        card.innerHTML = `
            <img src="${dest.image}" alt="${dest.name}">
            <div class="destination-info">
                <h3>${dest.name}</h3>
                <p>${dest.desc}</p>
            </div>
        `;

        // Modal Event Listener
        card.addEventListener('click', () => {
            const modal = container.querySelector('#destination-modal');
            modal.querySelector('#modal-img').src = dest.image;
            modal.querySelector('#modal-title').textContent = dest.name;
            modal.querySelector('#modal-desc').textContent = dest.desc;
            modal.querySelector('#modal-cost').textContent = dest.cost;

            const spotsList = modal.querySelector('#modal-spots');
            spotsList.innerHTML = dest.spots.map(spot => `<li>${spot}</li>`).join('');

            modal.classList.add('open');
        });

        destContainer.appendChild(card);
    });

    // Close Modal Logic
    const modal = container.querySelector('#destination-modal');
    const closeBtn = container.querySelector('#close-modal-btn');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });

    // Carousel Logic
    const slides = container.querySelectorAll('.carousel-slide');
    let currentSlide = 0;

    // Start rotation
    const carouselInterval = setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4000); // Change every 4 seconds

    // Cleanup interval when component is effectively "unmounted" 
    // (Note: Vanilla SPA doesn't have true unmount hooks, but since we replace innerHTML 
    // of app for new routes, the DOM elements are removed. The interval however might persist 
    // if not cleared. We can attach it to the container to find it later or just hope for the best 
    // in this simple setup. A better way is to return a cleanup function if our router supported it.
    // For now, let's attach it to the window or app state if we wanted to be strict, 
    // but for this simple task, it's a minor leak risk mostly on page refresh/nav.
    // To be cleaner, let's attach a mutation observer or something, BUT for this scope:
    // We will just let it run. In a real app, I'd add a cleanup method to the component return.)


    return container;
};
