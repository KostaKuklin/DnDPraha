// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target page
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === targetId) {
                    page.classList.add('active');
                }
            });
        });
    });

    // Initialize the app
    initializeApp();
});

// Initialize all app functionality
function initializeApp() {
    setupCountdown();
    loadNPCs();
    loadRules();
    loadParty();
    setupModals();
    setupLogin();
    setupAdminEditing();
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
                <button class="admin-button edit-item-btn" data-id="${npc.id}" data-type="npc" style="display: none;">Edit NPC</button>
            `;
            
            npcCard.addEventListener('click', () => showNPCDetails(npc));
            container.appendChild(npcCard);
        });
        checkAdminStatusForButtons();
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
        <p><strong>Role:</strong> ${npc.role}</p>
        <p><strong>Location:</strong> ${npc.location}</p>
        <p><strong>Description:</strong></p>
        <p>${npc.description}</p>
        <button class="admin-button edit-item-btn" data-id="${npc.id}" data-type="npc" style="display: none;">Edit NPC</button>
    `;
    
    modal.style.display = 'block';
    checkAdminStatusForButtons();
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
                <button class="admin-button edit-item-btn" data-id="${rule.id}" data-type="rule" style="display: none;">Edit Rule</button>
            `;
            container.appendChild(ruleItem);
        });
        checkAdminStatusForButtons();
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
                <button class="admin-button edit-item-btn" data-id="${member.id}" data-type="party" style="display: none;">Edit Party Member</button>
            `;
            
            partyCard.addEventListener('click', () => showPartyDetails(member));
            container.appendChild(partyCard);
        });
        checkAdminStatusForButtons();
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
        <p><strong>Player:</strong> ${member.playerName}</p>
        <p><strong>Class:</strong> ${member.class}</p>
        <p><strong>Level:</strong> ${member.level}</p>
        
        <h3 style="color: #e6007e; margin-top: 2rem;">Spells & Abilities</h3>
        <ul style="list-style: none; padding: 0;">
            ${member.spells.map(spell => `<li style="background: rgba(230, 0, 126, 0.1); margin: 0.5rem 0; padding: 0.5rem; border-radius: 5px; border-left: 3px solid #e6007e;">${spell}</li>`).join('')}
        </ul>
        
        <h3 style="color: #e6007e; margin-top: 2rem;">Magical Items</h3>
        <ul style="list-style: none; padding: 0;">
            ${member.magicalItems.map(item => `<li style="background: rgba(230, 0, 126, 0.1); margin: 0.5rem 0; padding: 0.5rem; border-radius: 5px; border-left: 3px solid #e6007e;">${item}</li>`).join('')}
        </ul>
        <button class="admin-button edit-item-btn" data-id="${member.id}" data-type="party" style="display: none;">Edit Party Member</button>
    `;
    
    modal.style.display = 'block';
    checkAdminStatusForButtons();
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

// Login functionality - Simplified for static site
function setupLogin() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const welcomeMessage = document.getElementById('welcome-message');
    const loginContainer = document.querySelector('.login-container');

    function setLoggedInState(username, role) {
        loginContainer.style.display = 'none'; // Hide login fields by default if logged in
        usernameInput.style.display = 'none';
        passwordInput.style.display = 'none';
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        welcomeMessage.textContent = `Welcome, ${username}! (${role})`;
        welcomeMessage.style.display = 'inline-block';
        sessionStorage.setItem('loggedInUser', JSON.stringify({ username, role }));
        toggleAdminButtons(role === 'admin');
    }

    function setLoggedOutState() {
        usernameInput.value = '';
        passwordInput.value = '';
        usernameInput.style.display = 'inline-block';
        passwordInput.style.display = 'inline-block';
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        welcomeMessage.style.display = 'none';
        welcomeMessage.textContent = '';
        loginContainer.style.display = 'flex'; // Show login fields
        sessionStorage.removeItem('loggedInUser');
        toggleAdminButtons(false);
    }

    // Check if user is already logged in on page load
    const storedUser = sessionStorage.getItem('loggedInUser');
    if (storedUser) {
        const { username, role } = JSON.parse(storedUser);
        setLoggedInState(username, role);
    } else {
        setLoggedOutState();
    }

    loginBtn.addEventListener('click', async () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        // Simple client-side authentication for static site
        if (username === 'admin' && password === 'admin') {
            setLoggedInState(username, 'admin');
        } else if (username === 'user1' && password === 'userpass') {
            setLoggedInState(username, 'normal user');
        } else {
            alert('Invalid username or password');
            setLoggedOutState();
        }
    });

    logoutBtn.addEventListener('click', () => {
        setLoggedOutState();
        alert('Logged out successfully.');
    });
}

// Function to toggle visibility of admin buttons
function toggleAdminButtons(isAdmin) {
    const adminButtons = document.querySelectorAll('.admin-button');
    adminButtons.forEach(button => {
        button.style.display = isAdmin ? 'inline-block' : 'none';
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

// Admin editing functionality - Simplified for static site
function setupAdminEditing() {
    const editSessionBtn = document.getElementById('edit-session-btn');
    const addNpcBtn = document.getElementById('add-npc-btn');
    const addRuleBtn = document.getElementById('add-rule-btn');
    const addPartyBtn = document.getElementById('add-party-btn');

    const sessionEditModal = document.getElementById('session-edit-modal');
    const npcEditModal = document.getElementById('npc-edit-modal');
    const ruleEditModal = document.getElementById('rule-edit-modal');
    const partyEditModal = document.getElementById('party-edit-modal');

    const sessionEditForm = document.getElementById('session-edit-form');
    const npcEditForm = document.getElementById('npc-edit-form');
    const ruleEditForm = document.getElementById('rule-edit-form');
    const partyEditForm = document.getElementById('party-edit-form');

    const deleteNpcBtn = document.getElementById('delete-npc-btn');
    const deleteRuleBtn = document.getElementById('delete-rule-btn');
    const deletePartyBtn = document.getElementById('delete-party-btn');

    // Open modals
    editSessionBtn.addEventListener('click', async () => {
        sessionEditModal.style.display = 'block';
        try {
            const response = await fetch('session_info.json');
            const sessionInfo = await response.json();
            document.getElementById('edit-session-date').value = sessionInfo.date;
            document.getElementById('edit-session-time').value = sessionInfo.time;
        } catch (error) {
            console.error('Error fetching session info for edit:', error);
            alert('Failed to load session information.');
        }
    });

    addNpcBtn.addEventListener('click', () => {
        // Clear form for new entry
        npcEditForm.reset();
        document.getElementById('npc-edit-id').value = '';
        document.getElementById('npc-edit-modal-title').textContent = 'Add New NPC';
        deleteNpcBtn.style.display = 'none';
        npcEditModal.style.display = 'block';
    });

    addRuleBtn.addEventListener('click', () => {
        // Clear form for new entry
        ruleEditForm.reset();
        document.getElementById('rule-edit-id').value = '';
        document.getElementById('rule-edit-modal-title').textContent = 'Add New Rule';
        deleteRuleBtn.style.display = 'none';
        ruleEditModal.style.display = 'block';
    });

    addPartyBtn.addEventListener('click', () => {
        // Clear form for new entry
        partyEditForm.reset();
        document.getElementById('party-edit-id').value = '';
        document.getElementById('party-edit-modal-title').textContent = 'Add New Party Member';
        deletePartyBtn.style.display = 'none';
        partyEditModal.style.display = 'block';
    });

    // Close modals (reusing existing close functionality if implemented, otherwise add here)
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Handle Save/Submit Forms - Simplified for static site
    sessionEditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const date = document.getElementById('edit-session-date').value;
        const time = document.getElementById('edit-session-time').value;

        // For static site, we'll just update the display and show a message
        document.getElementById('session-date').textContent = date;
        document.getElementById('session-time').textContent = time;
        alert('Session info updated! (Note: Changes are temporary in static version)');
        sessionEditModal.style.display = 'none';
    });

    npcEditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        alert('NPC updated! (Note: Changes are temporary in static version)');
        npcEditModal.style.display = 'none';
    });

    ruleEditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        alert('Rule updated! (Note: Changes are temporary in static version)');
        ruleEditModal.style.display = 'none';
    });

    partyEditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        alert('Party member updated! (Note: Changes are temporary in static version)');
        partyEditModal.style.display = 'none';
    });

    // Handle Delete Buttons - Simplified for static site
    deleteNpcBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this NPC? (Note: Changes are temporary in static version)')) {
            alert('NPC deleted! (Note: Changes are temporary in static version)');
            npcEditModal.style.display = 'none';
        }
    });

    deleteRuleBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this Rule? (Note: Changes are temporary in static version)')) {
            alert('Rule deleted! (Note: Changes are temporary in static version)');
            ruleEditModal.style.display = 'none';
        }
    });

    deletePartyBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this Party Member? (Note: Changes are temporary in static version)')) {
            alert('Party member deleted! (Note: Changes are temporary in static version)');
            partyEditModal.style.display = 'none';
        }
    });

    // Populate modals for editing existing items
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-item-btn')) {
            const id = e.target.dataset.id;
            const type = e.target.dataset.type;

            try {
                let data;
                let modal;
                let form;
                let titleElement;
                let deleteButton;

                switch (type) {
                    case 'npc':
                        const npcResponse = await fetch('npcs.json');
                        const npcsData = await npcResponse.json();
                        data = npcsData.find(npc => npc.id == id);
                        modal = npcEditModal;
                        form = npcEditForm;
                        titleElement = document.getElementById('npc-edit-modal-title');
                        deleteButton = deleteNpcBtn;
                        
                        document.getElementById('npc-edit-id').value = data.id;
                        document.getElementById('npc-name').value = data.name;
                        document.getElementById('npc-description').value = data.description;
                        document.getElementById('npc-image').value = data.image;
                        document.getElementById('npc-role').value = data.role;
                        document.getElementById('npc-location').value = data.location;
                        break;
                    case 'rule':
                        const ruleResponse = await fetch('rules.json');
                        const rulesData = await ruleResponse.json();
                        data = rulesData.find(rule => rule.id == id);
                        modal = ruleEditModal;
                        form = ruleEditForm;
                        titleElement = document.getElementById('rule-edit-modal-title');
                        deleteButton = deleteRuleBtn;

                        document.getElementById('rule-edit-id').value = data.id;
                        document.getElementById('rule-title').value = data.title;
                        document.getElementById('rule-content').value = data.content;
                        document.getElementById('rule-tags').value = data.tags.join(', ');
                        break;
                    case 'party':
                        const partyResponse = await fetch('party.json');
                        const partyData = await partyResponse.json();
                        data = partyData.find(member => member.id == id);
                        modal = partyEditModal;
                        form = partyEditForm;
                        titleElement = document.getElementById('party-edit-modal-title');
                        deleteButton = deletePartyBtn;

                        document.getElementById('party-edit-id').value = data.id;
                        document.getElementById('party-player-name').value = data.playerName;
                        document.getElementById('party-character-name').value = data.characterName;
                        document.getElementById('party-class').value = data.class;
                        document.getElementById('party-level').value = data.level;
                        document.getElementById('party-portrait').value = data.portrait;
                        document.getElementById('party-spells').value = data.spells.join(', ');
                        document.getElementById('party-magical-items').value = data.magicalItems.join(', ');
                        break;
                }

                titleElement.textContent = `Edit ${type.toUpperCase()}`;
                deleteButton.style.display = 'inline-block';
                modal.style.display = 'block';
            } catch (error) {
                console.error(`Error fetching ${type} for edit:`, error);
                alert(`Failed to load ${type} information for editing.`);
            }
        }
    });
}

// New function to check admin status and toggle edit buttons for dynamically loaded content
function checkAdminStatusForButtons() {
    const storedUser = sessionStorage.getItem('loggedInUser');
    let isAdmin = false;
    if (storedUser) {
        const { role } = JSON.parse(storedUser);
        isAdmin = (role === 'admin');
    }

    document.querySelectorAll('.edit-item-btn').forEach(button => {
        button.style.display = isAdmin ? 'inline-block' : 'none';
    });
} 