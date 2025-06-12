// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    // Function to show a specific page
    function showPage(pageId) {
        // Update active nav link
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector(`[href="#${pageId}"]`).classList.add('active');
        
        // Show target page
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === pageId) {
                page.classList.add('active');
            }
        });
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showPage(targetId);
            
            // Update URL hash
            window.location.hash = targetId;
        });
    });

    // Handle initial page load and browser back/forward
    function handleInitialLoad() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            showPage(hash);
        } else {
            // Default to landing page if no valid hash
            showPage('landing');
        }
    }

    // Handle browser back/forward buttons
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            showPage(hash);
        }
    });

    // Initialize the app
    initializeApp();
    
    // Handle initial page load
    handleInitialLoad();
});

// Initialize all app functionality
function initializeApp() {
    setupCountdown();
    loadNPCs();
    loadRules();
    loadParty();
    setupModals();
}

// Countdown timer functionality
function setupCountdown() {
    const sessionDateElement = document.getElementById('session-date');
    const sessionTimeElement = document.getElementById('session-time');
    const countdownElement = document.getElementById('countdown');
    const nextSessionHeading = document.querySelector('.next-session-card h2');

    let countdownInterval;

    async function fetchSessionInfo() {
        try {
            const response = await fetch('session_info.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            sessionDateElement.textContent = data.date;
            sessionTimeElement.textContent = data.time;
        } catch (error) {
            console.error('Error fetching session info:', error);
            sessionDateElement.textContent = 'ERROR';
            sessionTimeElement.textContent = 'ERROR';
        }
    }

    function updateCountdown() {
        const sessionDateText = sessionDateElement.textContent; // e.g., "27.06.2025"
        const parts = sessionDateText.split('.');
        const rawDate = parts[0];
        const rawMonth = parts[1];
        const rawYear = parts[2]; // Get the year from the date string
        const rawTime = sessionTimeElement.textContent; // "18:00"

        const now = new Date();

        // Construct session start and end dates for the given year
        const sessionStartTime = new Date(
            parseInt(rawYear),
            parseInt(rawMonth) - 1, // Month is 0-indexed
            parseInt(rawDate),
            parseInt(rawTime.split(':')[0]),
            parseInt(rawTime.split(':')[1]),
            0 // Seconds
        );

        // Assuming session is a single day for simplicity, if range is needed, this logic will need expansion
        const sessionEndTime = new Date(
            parseInt(rawYear),
            parseInt(rawMonth) - 1,
            parseInt(rawDate),
            23, 59, 59
        );

        let targetDate = sessionStartTime;

        if (now > sessionEndTime) {
            // If session has passed for this year, target next year
            targetDate.setFullYear(sessionStartTime.getFullYear() + 1);
        } else if (now >= sessionStartTime && now <= sessionEndTime) {
            nextSessionHeading.textContent = 'SESSION IN PROGRESS!';
            countdownElement.innerHTML = '00:00:00:00'; // days:hours:minutes:seconds
            clearInterval(countdownInterval);
            return;
        }

        const timeLeft = targetDate - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        } else {
            nextSessionHeading.textContent = 'SESSION IS STARTING!';
            countdownElement.innerHTML = '00:00:00:00';
            clearInterval(countdownInterval);
        }
    }

    // Initial fetch and then start countdown
    fetchSessionInfo().then(() => {
        updateCountdown(); // Initial call to display immediately after fetching
        countdownInterval = setInterval(updateCountdown, 1000); // Update every second
    });
}

// NPC data and functionality
async function loadNPCs() {
    const container = document.getElementById('npcs-container');
    container.innerHTML = '<p>Loading NPCs...</p>'; // Loading indicator
    try {
        const response = await fetch('npcs.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const npcsData = await response.json();
        
        container.innerHTML = ''; // Clear loading indicator
        if (npcsData.length === 0) {
            container.innerHTML = '<p>No NPCs found.</p>';
            return;
        }

        npcsData.forEach(npc => {
            const npcCard = document.createElement('div');
            npcCard.className = 'npc-card';
            npcCard.innerHTML = `
                <img src="${npc.image}" alt="${npc.name}" class="npc-image">
                <h3 class="npc-name">${npc.name}</h3>
                <p class="npc-description">${npc.description}</p>
            `;
            
            npcCard.addEventListener('click', () => showNPCDetails(npc));
            container.appendChild(npcCard);
        });
    } catch (error) {
        console.error('Error loading NPCs:', error);
        container.innerHTML = '<p>Failed to load NPCs.</p>';
    }
}

function showNPCDetails(npc) {
    const modal = document.getElementById('npc-modal');
    const content = document.getElementById('npc-modal-content');
    
    content.innerHTML = `
        <h2>${npc.name}</h2>
        <img src="${npc.image}" alt="${npc.name}" style="width: 100%; max-width: 300px; border-radius: 10px; margin: 1rem 0;">
        <p><strong>Role:</strong></p>
        <p>${npc.role}</p>
        <p><strong>Lokace:</strong></p>
        <p>${npc.location}</p>
        <p><strong>Popis:</strong></p>
        <p>${npc.description}</p>
    `;
    
    modal.style.display = 'block';
}

// Rules data and functionality
async function loadRules() {
    const container = document.getElementById('rules-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    container.innerHTML = '<p>Loading rules...</p>'; // Loading indicator

    let rulesData = []; // Declare rulesData in a scope accessible by displayRules
    try {
        const response = await fetch('rules.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        rulesData = await response.json(); // Assign fetched data

        if (rulesData.length === 0) {
            container.innerHTML = '<p>No rules found.</p>';
            return;
        }

    } catch (error) {
        console.error('Error loading rules:', error);
        container.innerHTML = '<p>Failed to load rules.</p>';
        return; // Exit if data loading fails
    }

    function displayRules(filter = 'all') {
        container.innerHTML = ''; // Clear loading indicator and previous content
        
        const filteredRules = filter === 'all' 
            ? rulesData 
            : rulesData.filter(rule => rule.tags.includes(filter));
        
        filteredRules.forEach(rule => {
            const ruleItem = document.createElement('div');
            ruleItem.className = 'rule-item';
            ruleItem.innerHTML = `
                <h3 class="rule-title">${rule.title}</h3>
                <div class="rule-tags">
                    ${rule.tags.map(tag => `<span class="rule-tag">${tag}</span>`).join('')}
                </div>
                <p class="rule-content">${rule.content}</p>
            `;
            container.appendChild(ruleItem);
        });
    }
    
    // Initial display
    displayRules();
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            displayRules(this.dataset.filter);
        });
    });
}

// Party data and functionality
async function loadParty() {
    const container = document.getElementById('party-container');
    container.innerHTML = '<p>Loading party members...</p>'; // Loading indicator

    try {
        const response = await fetch('party.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const partyData = await response.json();

        container.innerHTML = ''; // Clear loading indicator
        if (partyData.length === 0) {
            container.innerHTML = '<p>No party members found.</p>';
            return;
        }
        
        partyData.forEach(member => {
            const partyCard = document.createElement('div');
            partyCard.className = 'party-card';
            partyCard.innerHTML = `
                <img src="${member.portrait}" alt="${member.characterName}" class="party-portrait">
                <div class="party-info">
                    <h3 class="party-name">${member.characterName}</h3>
                    <p class="party-class">${member.class}</p>
                    <span class="party-level">Level ${member.level}</span>
                </div>
            `;
            
            partyCard.addEventListener('click', () => showPartyDetails(member));
            container.appendChild(partyCard);
        });
    } catch (error) {
        console.error('Error loading party members:', error);
        container.innerHTML = '<p>Failed to load party members.</p>';
    }
}

function showPartyDetails(member) {
    const modal = document.getElementById('party-modal');
    const content = document.getElementById('party-modal-content');
    
    content.innerHTML = `
        <h2>${member.characterName}</h2>
        <img src="${member.portrait}" alt="${member.characterName}" style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid #b08d6c; margin: 1rem 0;">
        <p><strong>Class:</strong> ${member.class}</p>
        <p><strong>Level:</strong> ${member.level}</p>
        
        <p style="color: #e6007e; margin-top: 2rem; font-style: italic;">
            Character details can be viewed in D&D Beyond or your character sheet.
        </p>
    `;
    
    modal.style.display = 'block';
}

// Modal functionality
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modals.forEach(modal => modal.style.display = 'none');
        });
    });
    
    window.addEventListener('click', function(event) {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Add some smooth scrolling animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and items
    document.querySelectorAll('.npc-card, .rule-item, .party-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations when page loads
window.addEventListener('load', addScrollAnimations); 