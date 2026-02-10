// Flashcard Data
const flashcardSets = {
    cpp: [
        { front: "What is C++?", back: "A general-purpose programming language known for efficiency and performance" },
        { front: "What are pointers?", back: "Variables that store memory addresses of other variables" },
        { front: "What is OOP?", back: "Object-Oriented Programming - paradigm based on objects and classes" },
        { front: "What is polymorphism?", back: "Ability of objects to take multiple forms or override methods" },
        { front: "What is encapsulation?", back: "Bundling data and methods within a class, hiding internal details" }
    ],
    java: [
        { front: "What is Java?", back: "A platform-independent, object-oriented programming language" },
        { front: "What is JVM?", back: "Java Virtual Machine - runs compiled Java bytecode" },
        { front: "What are classes?", back: "Blueprints for creating objects with attributes and methods" },
        { front: "What is inheritance?", back: "Mechanism where a class inherits properties from another class" },
        { front: "What is an interface?", back: "A contract that defines methods a class must implement" }
    ],
    python: [
        { front: "What is Python?", back: "An interpreted, high-level programming language known for simplicity" },
        { front: "What are lists?", back: "Ordered, mutable collections that can hold multiple data types" },
        { front: "What are dictionaries?", back: "Unordered collections of key-value pairs" },
        { front: "What is a function?", back: "A reusable block of code that performs a specific task" },
        { front: "What are decorators?", back: "Functions that modify or enhance other functions or classes" }
    ],
    html: [
        { front: "What is HTML?", back: "HyperText Markup Language used to create web pages" },
        { front: "What is a semantic tag?", back: "HTML tags that clearly describe their meaning (header, footer, article)" },
        { front: "What is the head tag?", back: "Contains metadata, links, and scripts not directly displayed" },
        { front: "What are attributes?", back: "Additional information provided to HTML elements" },
        { front: "What is responsive design?", back: "Design that adapts to different screen sizes and devices" }
    ]
};

let currentSet = 'cpp';
let currentCardIndex = 0;
let isFlipped = false;

function initFlashcards() {
    loadFlashcardSet('cpp');
    setupFlashcardListeners();
}

function loadFlashcardSet(setName) {
    currentSet = setName;
    currentCardIndex = 0;
    isFlipped = false;
    document.querySelectorAll('.flashcard-selector').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-set="${setName}"]`).classList.add('active');
    displayFlashcard();
    updateProgress();
}

function displayFlashcard() {
    const card = flashcardSets[currentSet][currentCardIndex];
    const flashcard = document.querySelector('.flashcard');
    document.querySelector('.flashcard-front').textContent = card.front;
    document.querySelector('.flashcard-back').textContent = card.back;
    flashcard.classList.remove('flipped');
    isFlipped = false;
    updateNavigationButtons();
    updateProgress();
}

function flipFlashcard() {
    document.querySelector('.flashcard').classList.toggle('flipped');
    isFlipped = !isFlipped;
}

function nextCard() {
    if (currentCardIndex < flashcardSets[currentSet].length - 1) {
        currentCardIndex++;
        displayFlashcard();
    }
}

function prevCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        displayFlashcard();
    }
}

function updateNavigationButtons() {
    document.querySelector('[data-action="prev"]').disabled = currentCardIndex === 0;
    document.querySelector('[data-action="next"]').disabled = currentCardIndex === flashcardSets[currentSet].length - 1;
}

function updateProgress() {
    const total = flashcardSets[currentSet].length;
    const progress = ((currentCardIndex + 1) / total) * 100;
    document.querySelector('.flashcard-progress-bar').style.width = progress + '%';
    document.querySelector('.flashcard-counter').textContent = `Card ${currentCardIndex + 1} of ${total}`;
}

function setupFlashcardListeners() {
    document.querySelector('.flashcard').addEventListener('click', flipFlashcard);
    document.querySelector('[data-action="prev"]').addEventListener('click', prevCard);
    document.querySelector('[data-action="next"]').addEventListener('click', nextCard);
    document.querySelectorAll('.flashcard-selector').forEach(btn => {
        btn.addEventListener('click', () => loadFlashcardSet(btn.dataset.set));
    });
}

// ===== CONTACT MANAGEMENT SYSTEM =====
let contacts = [];
let editingIndex = -1;

function loadContacts() {
    const stored = localStorage.getItem('contacts');
    contacts = stored ? JSON.parse(stored) : [];
    renderContacts();
}

function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

function validateContact(name, email, phone, message) {
    if (!name.trim()) { alert('Please enter a name'); return false; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email'); return false; }
    if (!phone.trim()) { alert('Please enter a phone number'); return false; }
    if (!message.trim()) { alert('Please enter a message'); return false; }
    return true;
}

// Edit contact — loads into form, switches button to local-save mode
function editContact(index) {
    const contact = contacts[index];
    document.getElementById('contactName').value = contact.name;
    document.getElementById('contactEmail').value = contact.email;
    document.getElementById('contactPhone').value = contact.phone;
    document.getElementById('contactMessage').value = contact.message;
    editingIndex = index;
    updateCancelButton();
    document.getElementById('contactName').focus();
    window.scrollTo({ top: document.querySelector('.contact-form').offsetTop - 100, behavior: 'smooth' });
}

// Save edits locally only (no Formspree resubmit)
function handleLocalEdit() {
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
    const message = document.getElementById('contactMessage').value;

    if (!validateContact(name, email, phone, message)) return;

    contacts[editingIndex] = {
        ...contacts[editingIndex],
        name, email, phone, message,
        date: new Date().toLocaleDateString()
    };
    editingIndex = -1;
    saveContacts();
    renderContacts();
    clearForm();
    updateCancelButton();
}

function clearForm() {
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
    document.getElementById('contactMessage').value = '';
}

function updateCancelButton() {
    const cancelBtn = document.getElementById('cancelEditBtn');
    const addBtn = document.getElementById('addContactBtn');
    if (editingIndex === -1) {
        cancelBtn.style.display = 'none';
        addBtn.textContent = 'Send Message ✈️';
        addBtn.type = 'submit'; // native Formspree submit
    } else {
        cancelBtn.style.display = 'inline-block';
        addBtn.textContent = 'Update Message ✏️';
        addBtn.type = 'button'; // local save only, no form POST
    }
}

function deleteContact(index) {
    if (confirm('Are you sure you want to delete this contact?')) {
        contacts.splice(index, 1);
        saveContacts();
        renderContacts();
    }
}

function cancelEdit() {
    editingIndex = -1;
    clearForm();
    updateCancelButton();
}

function filterContacts(searchTerm) {
    const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderContacts(filtered);
}

function renderContacts(listToRender = contacts) {
    const contactsList = document.getElementById('contactsList');
    if (listToRender.length === 0) {
        contactsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <p>No submissions yet. Your messages will appear here.</p>
            </div>`;
        return;
    }
    contactsList.innerHTML = listToRender.map((contact) => {
        const actualIndex = contacts.indexOf(contact);
        return `
            <div class="contact-card">
                <div class="contact-card-header">
                    <div class="contact-status">✉️ ${contact.date}</div>
                </div>
                <div class="contact-card-content">
                    <div class="contact-field">
                        <div class="contact-label">Name</div>
                        <div class="contact-value">${contact.name}</div>
                    </div>
                    <div class="contact-field">
                        <div class="contact-label">Email</div>
                        <div class="contact-value">${contact.email}</div>
                    </div>
                    <div class="contact-field">
                        <div class="contact-label">Phone</div>
                        <div class="contact-value">${contact.phone}</div>
                    </div>
                    <div class="contact-field" style="grid-column: 1 / -1;">
                        <div class="contact-label">Message</div>
                        <div class="contact-value" style="white-space: pre-wrap; max-height: 100px; overflow-y: auto;">${contact.message}</div>
                    </div>
                </div>
                <div class="contact-card-actions">
                    <button class="contact-btn edit-btn" onclick="editContact(${actualIndex})">✏️ Edit</button>
                    <button class="contact-btn delete-btn" onclick="deleteContact(${actualIndex})">🗑️ Delete</button>
                </div>
            </div>`;
    }).join('');
}

// ✅ Setup: intercept form submit → save localStorage → let Formspree handle email natively
function setupContactManagement() {
    const contactForm = document.getElementById('contactForm');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const addBtn = document.getElementById('addContactBtn');
    const searchInput = document.getElementById('searchInput');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            // Edit mode: save locally, do NOT submit to Formspree
            if (editingIndex !== -1) {
                e.preventDefault();
                handleLocalEdit();
                return;
            }

            // New submission: validate first
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value;
            const message = document.getElementById('contactMessage').value;

            if (!validateContact(name, email, phone, message)) {
                e.preventDefault();
                return;
            }

            // Save to localStorage BEFORE page navigates away to Formspree
            contacts.push({
                id: Date.now(),
                name, email, phone, message,
                date: new Date().toLocaleDateString(),
                emailSent: true
            });
            saveContacts();
            // ✅ Do NOT call e.preventDefault() — let Formspree receive the POST
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', function () {
            if (editingIndex !== -1) {
                handleLocalEdit();
            }
        });
    }

    if (cancelBtn) cancelBtn.addEventListener('click', cancelEdit);
    if (searchInput) {
        searchInput.addEventListener('input', (e) => filterContacts(e.target.value));
    }

    loadContacts();
}

// Smooth scrolling + animations
document.addEventListener('DOMContentLoaded', () => {
    initFlashcards();
    setupFlipCards();
    setupContactManagement();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    document.querySelectorAll('.stat, .skill-bar, .trait-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const viewWorkBtn = document.querySelector('.btn-primary');
    if (viewWorkBtn) {
        viewWorkBtn.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
        });
    }

    const contactButtons = document.querySelectorAll('.btn-secondary');
    if (contactButtons[0]) {
        contactButtons[0].addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

function setupFlipCards() {
    document.querySelectorAll('.skill-item').forEach(item => {
        item.addEventListener('click', function () { this.classList.toggle('flipped'); });
    });
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function () { this.classList.toggle('flipped'); });
    });
}
