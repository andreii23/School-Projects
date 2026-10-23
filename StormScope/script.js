// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize all features
    initStormCanvas();
    initChecklist();
    initKitBuilder();
    initQuiz();
    initTimeline();
    initWeatherUpdates();
    initTyphoonCards();
    updateSimulator();
});

// Scroll to section helper
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        // Show back to top button after scrolling to preparedness section
        if (sectionId === 'preparedness') {
            setTimeout(() => {
                const backToTopBtn = document.getElementById('backToTopBtn');
                if (backToTopBtn) {
                    backToTopBtn.classList.add('show');
                }
            }, 500);
        }
    }
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/hide back to top button based on scroll position
window.addEventListener('scroll', () => {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        const preparednessSection = document.getElementById('preparedness');
        if (preparednessSection) {
            const sectionTop = preparednessSection.offsetTop;
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            if (scrollPosition > sectionTop) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    }
});

// Storm Canvas Animation
function initStormCanvas() {
    const canvas = document.getElementById('stormCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Checklist with Local Storage
function initChecklist() {
    const checklistItems = [
        'Emergency supply kit prepared',
        'Important documents secured in waterproof container',
        'Battery-powered radio and extra batteries',
        'Flashlights and candles with matches',
        'First aid kit stocked',
        'Non-perishable food for 3+ days',
        'Water supply (1 gallon per person per day)',
        'Medications and prescriptions ready',
        'Mobile devices fully charged',
        'Evacuation route planned and practiced',
        'Emergency contacts list prepared',
        'Outdoor furniture and objects secured',
        'Windows and doors reinforced',
        'Insurance documents reviewed',
        'Family emergency plan discussed'
    ];

    const checklistContainer = document.getElementById('checklist');
    if (!checklistContainer) return;

    // Load saved checklist from localStorage
    const savedChecklist = JSON.parse(localStorage.getItem('typhoonChecklist')) || {};
    
    // Calculate initial progress to set previousProgress
    const initialChecked = Object.values(savedChecklist).filter(Boolean).length;
    const initialProgress = (initialChecked / checklistItems.length) * 100;
    previousProgress = initialProgress;
    
    // Set hasCelebrated based on whether it was already complete on load
    // If already 100% on load, don't celebrate (it was already celebrated before)
    hasCelebrated = initialProgress === 100;

    checklistItems.forEach((item, index) => {
        const checklistItem = document.createElement('div');
        checklistItem.className = 'checklist-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checklist-${index}`;
        checkbox.checked = savedChecklist[index] || false;
        if (checkbox.checked) {
            checklistItem.classList.add('completed');
        }

        const label = document.createElement('label');
        label.htmlFor = `checklist-${index}`;
        label.textContent = item;

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                checklistItem.classList.add('completed');
            } else {
                checklistItem.classList.remove('completed');
            }
            updateChecklistProgress();
            saveChecklist();
        });

        checklistItem.appendChild(checkbox);
        checklistItem.appendChild(label);
        checklistContainer.appendChild(checklistItem);
    });

    updateChecklistProgress();
}

let hasCelebrated = false;
let previousProgress = 0;

function updateChecklistProgress() {
    const checkboxes = document.querySelectorAll('#checklist input[type="checkbox"]');
    const checked = document.querySelectorAll('#checklist input[type="checkbox"]:checked');
    const progress = (checked.length / checkboxes.length) * 100;
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const completionMessage = document.getElementById('completionMessage');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    if (progressText) {
        progressText.textContent = `${Math.round(progress)}% Complete`;
    }
    
    // Check if checklist is 100% complete
    if (progress === 100) {
        if (completionMessage) {
            completionMessage.style.display = 'flex';
        }
        // Only celebrate if we just reached 100% (not on page load)
        // Check if previous progress was less than 100%
        if (previousProgress < 100 && !hasCelebrated) {
            hasCelebrated = true;
            celebrateCompletion();
        }
    } else {
        if (completionMessage) {
            completionMessage.style.display = 'none';
        }
        // Reset celebration flag when progress drops below 100%
        // This allows celebration to show again if they complete it again
        if (progress < 100) {
            hasCelebrated = false;
        }
    }
    
    // Update previous progress for next check
    previousProgress = progress;
}

function celebrateCompletion() {
    // Create celebration modal
    const celebrationModal = document.createElement('div');
    celebrationModal.className = 'celebration-modal';
    celebrationModal.innerHTML = `
        <div class="celebration-content">
            <img src="Images/Emergency Checklist.png" alt="Emergency Checklist Completed" class="celebration-icon">
            <h2>Congratulations!</h2>
            <p>You've completed your Emergency Preparedness Checklist!</p>
            <p class="celebration-message">You are now fully prepared for typhoon season in Batangas. Stay safe!</p>
            <button class="btn btn-primary" onclick="closeCelebration()">Awesome!</button>
        </div>
    `;
    document.body.appendChild(celebrationModal);
    
    // Trigger confetti
    createConfetti();
    
    // Play success sound (optional - browser may block autoplay)
    // You can add a subtle sound effect here if desired
}

function closeCelebration() {
    const modal = document.querySelector('.celebration-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => modal.remove(), 300);
    }
}

function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#10b981', '#f59e0b'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

function saveChecklist() {
    const checkboxes = document.querySelectorAll('#checklist input[type="checkbox"]');
    const checklist = {};
    checkboxes.forEach((checkbox, index) => {
        checklist[index] = checkbox.checked;
    });
    localStorage.setItem('typhoonChecklist', JSON.stringify(checklist));
}

// Check all items function
function checkAllItems() {
    const checkboxes = document.querySelectorAll('#checklist input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
        const checklistItem = checkbox.closest('.checklist-item');
        if (checklistItem) {
            checklistItem.classList.add('completed');
        }
    });
    updateChecklistProgress();
    saveChecklist();
}

// Uncheck all items function
function uncheckAllItems() {
    const checkboxes = document.querySelectorAll('#checklist input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        const checklistItem = checkbox.closest('.checklist-item');
        if (checklistItem) {
            checklistItem.classList.remove('completed');
        }
    });
    updateChecklistProgress();
    saveChecklist();
}

// Emergency Kit Builder
function initKitBuilder() {
    const kitItems = [
        'Water Bottles', 'Canned Food', 'First Aid Kit', 'Flashlight',
        'Batteries', 'Radio', 'Whistle', 'Dust Masks',
        'Plastic Sheeting', 'Duct Tape', 'Wrench', 'Can Opener',
        'Local Maps', 'Cell Phone Charger', 'Cash', 'Important Documents',
        'Prescription Medications', 'Infant Formula', 'Pet Food', 'Blankets'
    ];

    const kitContainer = document.getElementById('kitItems');
    if (!kitContainer) return;

    kitItems.forEach(item => {
        const kitItem = document.createElement('div');
        kitItem.className = 'kit-item';
        kitItem.textContent = item;
        kitItem.addEventListener('click', () => {
            kitItem.classList.toggle('selected');
        });
        kitContainer.appendChild(kitItem);
    });
}

function generateKitList() {
    const selectedItems = document.querySelectorAll('.kit-item.selected');
    if (selectedItems.length === 0) {
        alert('Please select items for your emergency kit!');
        return;
    }

    // Create a minimal, aesthetic printable page
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Emergency Kit List - StormScope Batangas</title>
            <style>
                @page {
                    margin: 2cm;
                }
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                    color: #1a1a1a;
                    line-height: 1.6;
                    padding: 60px 40px;
                    background: #ffffff;
                }
                .print-container {
                    max-width: 700px;
                    margin: 0 auto;
                }
                .header {
                    text-align: center;
                    margin-bottom: 50px;
                    padding-bottom: 30px;
                    border-bottom: 1px solid #e5e5e5;
                }
                .header h1 {
                    color: #1a1a1a;
                    font-size: 28px;
                    font-weight: 600;
                    margin-bottom: 8px;
                    letter-spacing: -0.5px;
                }
                .header p {
                    color: #666;
                    font-size: 14px;
                    font-weight: 400;
                }
                .date-info {
                    color: #888;
                    font-size: 12px;
                    text-align: center;
                    margin-bottom: 40px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .kit-items-list {
                    margin: 40px 0;
                }
                .kit-item-print {
                    display: flex;
                    align-items: center;
                    padding: 16px 0;
                    border-bottom: 1px solid #f0f0f0;
                    gap: 16px;
                }
                .kit-item-print:last-child {
                    border-bottom: none;
                }
                .item-number {
                    color: #888;
                    font-size: 13px;
                    font-weight: 500;
                    min-width: 24px;
                    text-align: right;
                }
                .item-name {
                    font-size: 15px;
                    font-weight: 400;
                    color: #1a1a1a;
                    flex: 1;
                }
                .checkbox-print {
                    width: 18px;
                    height: 18px;
                    border: 1.5px solid #d0d0d0;
                    border-radius: 3px;
                    flex-shrink: 0;
                }
                .instructions {
                    margin-top: 50px;
                    padding-top: 30px;
                    border-top: 1px solid #e5e5e5;
                }
                .instructions h3 {
                    color: #1a1a1a;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 16px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .instructions ul {
                    list-style: none;
                    padding: 0;
                }
                .instructions li {
                    color: #666;
                    font-size: 13px;
                    margin: 10px 0;
                    padding-left: 20px;
                    position: relative;
                }
                .instructions li::before {
                    content: '•';
                    position: absolute;
                    left: 0;
                    color: #888;
                }
                .footer {
                    text-align: center;
                    margin-top: 60px;
                    padding-top: 30px;
                    border-top: 1px solid #e5e5e5;
                    color: #888;
                    font-size: 12px;
                }
                @media print {
                    body {
                        padding: 0;
                    }
                    .kit-item-print {
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="header">
                    <h1>Emergency Kit Checklist</h1>
                    <p>StormScope Batangas</p>
                </div>
                
                <div class="date-info">${currentDate}</div>
                
                <div class="kit-items-list">
    `);
    
    selectedItems.forEach((item, index) => {
        printWindow.document.write(`
                    <div class="kit-item-print">
                        <span class="item-number">${String(index + 1).padStart(2, '0')}</span>
                        <span class="item-name">${item.textContent}</span>
                        <div class="checkbox-print"></div>
                    </div>
        `);
    });
    
    printWindow.document.write(`
                </div>
                
                <div class="instructions">
                    <h3>Instructions</h3>
                    <ul>
                        <li>Check off each item as you gather it</li>
                        <li>Store items in a waterproof container</li>
                        <li>Keep kit in an easily accessible location</li>
                        <li>Review and update every 6 months</li>
                    </ul>
                </div>
                
                <div class="footer">
                    <p>StormScope Batangas — Stay Prepared, Stay Safe</p>
                </div>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// Generate comprehensive emergency guide PDF
function generateEmergencyGuide() {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Emergency Guide - StormScope Batangas</title>
            <style>
                @page {
                    margin: 2cm;
                }
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                    color: #1a1a1a;
                    line-height: 1.6;
                    padding: 60px 40px;
                    background: #ffffff;
                }
                .print-container {
                    max-width: 700px;
                    margin: 0 auto;
                }
                .header {
                    text-align: center;
                    margin-bottom: 50px;
                    padding-bottom: 30px;
                    border-bottom: 1px solid #e5e5e5;
                }
                .header h1 {
                    color: #1a1a1a;
                    font-size: 28px;
                    font-weight: 600;
                    margin-bottom: 8px;
                    letter-spacing: -0.5px;
                }
                .header p {
                    color: #666;
                    font-size: 14px;
                    font-weight: 400;
                }
                .date-info {
                    color: #888;
                    font-size: 12px;
                    text-align: center;
                    margin-bottom: 40px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .section {
                    margin: 40px 0;
                    page-break-inside: avoid;
                }
                .section-title {
                    color: #1a1a1a;
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #e5e5e5;
                    letter-spacing: -0.3px;
                }
                .contact-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin: 20px 0;
                }
                .contact-item {
                    padding: 16px;
                    border: 1px solid #f0f0f0;
                    border-radius: 4px;
                }
                .contact-item h4 {
                    color: #1a1a1a;
                    font-size: 13px;
                    font-weight: 600;
                    margin-bottom: 6px;
                }
                .contact-item p {
                    color: #666;
                    font-size: 14px;
                    font-weight: 500;
                }
                .contact-item .label {
                    color: #888;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-top: 4px;
                }
                .tips-list {
                    list-style: none;
                    padding: 0;
                }
                .tips-list li {
                    color: #666;
                    font-size: 13px;
                    margin: 12px 0;
                    padding-left: 24px;
                    position: relative;
                }
                .tips-list li::before {
                    content: '—';
                    position: absolute;
                    left: 0;
                    color: #888;
                }
                .info-box {
                    background: #f8f8f8;
                    padding: 20px;
                    border-radius: 4px;
                    margin: 20px 0;
                    border-left: 3px solid #1a1a1a;
                }
                .info-box h4 {
                    color: #1a1a1a;
                    font-size: 13px;
                    font-weight: 600;
                    margin-bottom: 10px;
                }
                .info-box p {
                    color: #666;
                    font-size: 13px;
                    line-height: 1.6;
                }
                .footer {
                    text-align: center;
                    margin-top: 60px;
                    padding-top: 30px;
                    border-top: 1px solid #e5e5e5;
                    color: #888;
                    font-size: 12px;
                }
                @media print {
                    body {
                        padding: 0;
                    }
                    .section {
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="section">
                    <h2 class="section-title">Emergency Contacts</h2>
                    <div class="contact-grid">
                        <div class="contact-item">
                            <h4>National Emergency</h4>
                            <p>911 / 117</p>
                            <div class="label">Philippine Emergency Hotline</div>
                        </div>
                        <div class="contact-item">
                            <h4>PAGASA</h4>
                            <p>(02) 8284-0800</p>
                            <div class="label">Weather Information</div>
                        </div>
                        <div class="contact-item">
                            <h4>Batangas DRRM</h4>
                            <p>(043) 723-3616</p>
                            <div class="label">Disaster Risk Reduction</div>
                        </div>
                        <div class="contact-item">
                            <h4>PNP Batangas</h4>
                            <p>(043) 723-3611</p>
                            <div class="label">Philippine National Police</div>
                        </div>
                        <div class="contact-item">
                            <h4>BFP Batangas</h4>
                            <p>(043) 723-3615</p>
                            <div class="label">Bureau of Fire Protection</div>
                        </div>
                        <div class="contact-item">
                            <h4>Red Cross Batangas</h4>
                            <p>(043) 723-3617</p>
                            <div class="label">Philippine Red Cross</div>
                        </div>
                        <div class="contact-item">
                            <h4>Medical Emergency</h4>
                            <p>911 / 117</p>
                            <div class="label">Emergency Medical Services</div>
                        </div>
                        <div class="contact-item">
                            <h4>NDRRMC</h4>
                            <p>(02) 8911-1406</p>
                            <div class="label">National Disaster Risk Reduction</div>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Before Typhoon</h2>
                    <ul class="tips-list">
                        <li>Secure outdoor furniture and objects</li>
                        <li>Stock up on food, water, and supplies</li>
                        <li>Charge all electronic devices</li>
                        <li>Review evacuation routes</li>
                        <li>Stay informed via weather updates</li>
                        <li>Prepare emergency kit</li>
                        <li>Secure important documents</li>
                    </ul>
                </div>
                
                <div class="section">
                    <h2 class="section-title">During Typhoon</h2>
                    <ul class="tips-list">
                        <li>Stay indoors and away from windows</li>
                        <li>Avoid using electrical appliances</li>
                        <li>Keep emergency kit accessible</li>
                        <li>Monitor weather updates</li>
                        <li>Do not go outside until authorities say it's safe</li>
                        <li>Stay in the strongest part of your home</li>
                    </ul>
                </div>
                
                <div class="section">
                    <h2 class="section-title">After Typhoon</h2>
                    <ul class="tips-list">
                        <li>Wait for official clearance before going outside</li>
                        <li>Check for structural damage</li>
                        <li>Avoid floodwaters and downed power lines</li>
                        <li>Use flashlights instead of candles</li>
                        <li>Contact family to confirm safety</li>
                        <li>Report damage to local authorities</li>
                    </ul>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Important Information</h2>
                    <div class="info-box">
                        <h4>Evacuation Centers</h4>
                        <p>Contact your barangay captain for the nearest evacuation center location. Know your evacuation route before a typhoon arrives.</p>
                    </div>
                    <div class="info-box">
                        <h4>Weather Updates</h4>
                        <p>Always check official sources: PAGASA website (www.pagasa.dost.gov.ph), local radio stations, and barangay announcements. Do not rely solely on social media.</p>
                    </div>
                    <div class="info-box">
                        <h4>Emergency Kit</h4>
                        <p>Your emergency kit should include: water (1 gallon per person per day), non-perishable food, first aid kit, flashlight, batteries, radio, important documents, medications, and cash.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// Risk Assessment Calculator
function calculateRisk() {
    const locationType = document.getElementById('locationType').value;
    const buildingType = document.getElementById('buildingType').value;
    const evacuationRoute = document.getElementById('evacuationRoute').value;

    if (!locationType || !buildingType || !evacuationRoute) {
        document.getElementById('riskResult').classList.remove('show');
        return;
    }

    let riskScore = 0;
    let riskLevel = '';
    let riskClass = '';

    // Location risk
    const locationRisk = {
        'coastal': 3,
        'lowland': 3,
        'mountain': 2,
        'urban': 1
    };
    riskScore += locationRisk[locationType] || 0;

    // Building risk
    const buildingRisk = {
        'concrete': 1,
        'wood': 3,
        'apartment': 2,
        'temporary': 4
    };
    riskScore += buildingRisk[buildingType] || 0;

    // Evacuation risk
    const evacuationRisk = {
        'yes': 0,
        'limited': 2,
        'no': 3
    };
    riskScore += evacuationRisk[evacuationRoute] || 0;

    // Determine risk level
    if (riskScore <= 3) {
        riskLevel = 'Low Risk';
        riskClass = 'risk-low';
    } else if (riskScore <= 6) {
        riskLevel = 'Medium Risk';
        riskClass = 'risk-medium';
    } else {
        riskLevel = 'High Risk';
        riskClass = 'risk-high';
    }

    const riskResult = document.getElementById('riskResult');
    riskResult.className = `risk-result ${riskClass} show`;
    riskResult.innerHTML = `
        <strong>Risk Assessment: ${riskLevel}</strong><br>
        <small>Score: ${riskScore}/10</small><br>
        ${getRiskRecommendations(riskLevel)}
    `;
}

function getRiskRecommendations(riskLevel) {
    const recommendations = {
        'Low Risk': 'Continue maintaining your preparedness. Stay informed about weather updates.',
        'Medium Risk': 'Review your evacuation plan. Ensure your emergency kit is complete. Consider reinforcing your home.',
        'High Risk': 'Prioritize evacuation planning. Identify multiple safe locations. Prepare to evacuate early if needed.'
    };
    return recommendations[riskLevel] || '';
}

// Typhoon Simulator
function updateSimulator() {
    const windSpeed = parseInt(document.getElementById('windSpeed').value);
    const rainfall = parseInt(document.getElementById('rainfall').value);
    const stormSurge = parseInt(document.getElementById('stormSurge').value);

    // Update display values
    document.getElementById('windSpeedValue').textContent = `${windSpeed} mph`;
    document.getElementById('rainfallValue').textContent = `${rainfall} inches`;
    document.getElementById('stormSurgeValue').textContent = `${stormSurge} feet`;

    // Determine category
    let category = '';
    if (windSpeed < 39) {
        category = 'Tropical Depression';
    } else if (windSpeed < 74) {
        category = 'Tropical Storm';
    } else if (windSpeed < 96) {
        category = 'Category 1 Typhoon';
    } else if (windSpeed < 111) {
        category = 'Category 2 Typhoon';
    } else if (windSpeed < 130) {
        category = 'Category 3 Typhoon';
    } else if (windSpeed < 157) {
        category = 'Category 4 Typhoon';
    } else {
        category = 'Category 5 Super Typhoon';
    }

    // Determine damage level
    let damageLevel = '';
    if (windSpeed < 74) {
        damageLevel = 'Minimal';
    } else if (windSpeed < 96) {
        damageLevel = 'Light';
    } else if (windSpeed < 111) {
        damageLevel = 'Moderate';
    } else if (windSpeed < 130) {
        damageLevel = 'Extensive';
    } else if (windSpeed < 157) {
        damageLevel = 'Devastating';
    } else {
        damageLevel = 'Catastrophic';
    }

    // Determine flood risk
    let floodRisk = '';
    if (rainfall < 3 && stormSurge < 3) {
        floodRisk = 'Low';
    } else if (rainfall < 8 && stormSurge < 10) {
        floodRisk = 'Moderate';
    } else if (rainfall < 15 && stormSurge < 20) {
        floodRisk = 'High';
    } else {
        floodRisk = 'Extreme';
    }

    // Determine evacuation status
    let evacuationStatus = '';
    if (windSpeed < 74 && floodRisk === 'Low') {
        evacuationStatus = 'Not Required';
    } else if (windSpeed < 111 && floodRisk !== 'Extreme') {
        evacuationStatus = 'Recommended';
    } else {
        evacuationStatus = 'Mandatory';
    }

    // Update display
    document.getElementById('categoryValue').textContent = category;
    document.getElementById('damageValue').textContent = damageLevel;
    document.getElementById('floodRisk').textContent = floodRisk;
    document.getElementById('evacuationStatus').textContent = evacuationStatus;

    // Update visual
    updateTyphoonVisual(windSpeed);
}

function updateTyphoonVisual(windSpeed) {
    const visual = document.querySelector('.typhoon-visual');
    if (!visual) return;

    // Scale based on wind speed
    const scale = 1 + (windSpeed - 39) / 200;
    visual.style.transform = `scale(${scale})`;
    
    // Change color based on intensity
    let color = '';
    if (windSpeed < 74) {
        color = '#3b82f6'; // Blue
    } else if (windSpeed < 111) {
        color = '#60a5fa'; // Light blue
    } else if (windSpeed < 130) {
        color = '#fbbf24'; // Yellow
    } else if (windSpeed < 157) {
        color = '#f97316'; // Orange
    } else {
        color = '#dc2626'; // Red
    }
    
    visual.style.background = `radial-gradient(circle, ${color} 0%, #1e40af 50%, #0f172a 100%)`;
}

// Evacuation Route Planner
function planRoute() {
    const startPoint = document.getElementById('startPoint').value.trim();
    const destination = document.getElementById('destination').value.trim();

    if (!startPoint || !destination) {
        alert('Please enter both starting point and destination in Batangas!');
        return;
    }

    const routeDetails = document.getElementById('routeDetails');
    routeDetails.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <strong>From:</strong> ${startPoint}, Batangas<br>
            <strong>To:</strong> ${destination}, Batangas
        </div>
        <div style="background: #dbeafe; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
            <strong>Estimated Distance:</strong> ${Math.floor(Math.random() * 20 + 5)} km<br>
            <strong>Estimated Time:</strong> ${Math.floor(Math.random() * 30 + 15)} minutes<br>
            <small style="color: #64748b; display: block; margin-top: 0.5rem;">*Estimated values. Actual distance and time may vary.</small>
        </div>
        <div style="color: #64748b; margin-bottom: 1rem;">
            <strong>Route Safety Tips for Batangas:</strong>
            <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                <li>Avoid coastal roads during storm warnings (Batangas City, Calatagan areas)</li>
                <li>Use main provincial roads (National Highway) when possible</li>
                <li>Avoid low-lying areas near Taal Lake and rivers</li>
                <li>Have alternative routes ready (multiple exits from your area)</li>
                <li>Leave early to avoid traffic congestion</li>
                <li>Keep your gas tank full (gas stations may close during emergencies)</li>
                <li>Coordinate with your barangay for official evacuation routes</li>
            </ul>
        </div>
        <div style="padding: 1rem; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 1rem;">
            <strong>⚠️ Important:</strong> This is a planning tool. Always follow official evacuation orders from Batangas DRRM, your municipality, and barangay officials. Use designated evacuation centers and routes provided by local authorities.
        </div>
        <div style="padding: 1rem; background: #dbeafe; border-radius: 8px; border-left: 4px solid #2563eb;">
            <strong>📞 Contact Your Barangay:</strong> For the most accurate evacuation routes and nearest evacuation centers, contact your barangay captain or the Batangas DRRM office at (043) 723-3616.
        </div>
    `;
}

// Interactive Quiz
const quizQuestions = [
    {
        question: 'What is the minimum wind speed for a storm to be classified as a typhoon?',
        options: ['39 mph', '74 mph', '96 mph', '111 mph'],
        correct: 1
    },
    {
        question: 'What should you do if you are caught outside during a typhoon?',
        options: [
            'Run to the nearest building',
            'Find a low-lying area to avoid wind',
            'Stay away from windows and doors, seek shelter immediately',
            'Continue with your activities'
        ],
        correct: 2
    },
    {
        question: 'How much water should you store per person per day for emergencies?',
        options: ['0.5 gallons', '1 gallon', '2 gallons', '3 gallons'],
        correct: 1
    },
    {
        question: 'What is the most dangerous part of a typhoon?',
        options: [
            'The eye of the storm',
            'The outer bands',
            'The eyewall (strongest winds)',
            'The rain'
        ],
        correct: 2
    },
    {
        question: 'When should you evacuate during a typhoon warning?',
        options: [
            'Wait until the storm arrives',
            'Only if you live on the coast',
            'As soon as authorities recommend, before conditions worsen',
            'Never evacuate'
        ],
        correct: 2
    },
    {
        question: 'What should you do with outdoor furniture before a typhoon?',
        options: [
            'Leave it outside',
            'Move it inside or secure it',
            'Cover it with plastic',
            'Stack it in one corner'
        ],
        correct: 1
    },
    {
        question: 'How long should your emergency food supply last?',
        options: ['1 day', '3 days', '1 week', '2 weeks'],
        correct: 1
    },
    {
        question: 'What should you avoid during a typhoon?',
        options: [
            'Using electrical appliances',
            'Going near windows',
            'Using candles',
            'All of the above'
        ],
        correct: 3
    }
];

let currentQuestion = 0;
let score = 0;

function initQuiz() {
    if (quizQuestions.length === 0) return;
    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        showQuizResults();
        return;
    }

    const question = quizQuestions[currentQuestion];
    const quizQuestion = document.getElementById('quizQuestion');
    const quizOptions = document.getElementById('quizOptions');
    const quizFeedback = document.getElementById('quizFeedback');
    const nextBtn = document.getElementById('nextQuestionBtn');
    const quizScore = document.getElementById('quizScore');
    const quizTotal = document.getElementById('quizTotal');

    if (quizQuestion) quizQuestion.textContent = question.question;
    if (quizOptions) {
        quizOptions.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            optionDiv.textContent = option;
            optionDiv.onclick = () => selectAnswer(index);
            quizOptions.appendChild(optionDiv);
        });
    }
    if (quizFeedback) {
        quizFeedback.className = 'quiz-feedback';
        quizFeedback.textContent = '';
    }
    if (nextBtn) nextBtn.style.display = 'none';
    if (quizTotal) quizTotal.textContent = quizQuestions.length;
}

function selectAnswer(selectedIndex) {
    const question = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    const quizFeedback = document.getElementById('quizFeedback');
    const nextBtn = document.getElementById('nextQuestionBtn');

    options.forEach((option, index) => {
        option.onclick = null;
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
            option.classList.add('incorrect');
        }
    });

    if (selectedIndex === question.correct) {
        score++;
        if (quizFeedback) {
            quizFeedback.className = 'quiz-feedback correct show';
            quizFeedback.textContent = '✓ Correct! Well done!';
        }
    } else {
        if (quizFeedback) {
            quizFeedback.className = 'quiz-feedback incorrect show';
            quizFeedback.textContent = `✗ Incorrect. The correct answer is: ${question.options[question.correct]}`;
        }
    }

    if (nextBtn) nextBtn.style.display = 'block';
    updateQuizScore();
}

function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

function updateQuizScore() {
    const quizScore = document.getElementById('quizScore');
    if (quizScore) quizScore.textContent = score;
}

function showQuizResults() {
    const quizQuestion = document.getElementById('quizQuestion');
    const quizOptions = document.getElementById('quizOptions');
    const quizFeedback = document.getElementById('quizFeedback');
    const nextBtn = document.getElementById('nextQuestionBtn');
    const percentage = Math.round((score / quizQuestions.length) * 100);

    if (quizQuestion) {
        quizQuestion.textContent = 'Quiz Complete!';
    }
    if (quizOptions) {
        quizOptions.innerHTML = '';
    }
    if (quizFeedback) {
        quizFeedback.className = `quiz-feedback ${percentage >= 70 ? 'correct' : 'incorrect'} show`;
        quizFeedback.innerHTML = `
            <strong>Your Score: ${score}/${quizQuestions.length} (${percentage}%)</strong><br>
            ${percentage >= 70 
                ? 'Excellent! You have good knowledge of typhoon safety.' 
                : 'Good effort! Review the safety tips to improve your knowledge.'}
        `;
    }
    if (nextBtn) {
        nextBtn.textContent = 'Restart Quiz';
        nextBtn.onclick = restartQuiz;
        nextBtn.style.display = 'block';
    }
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    showQuestion();
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) {
        nextBtn.textContent = 'Next Question';
        nextBtn.onclick = nextQuestion;
    }
}

// Weather Updates Initialization
function initWeatherUpdates() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const currentDate = new Date();
    const currentMonth = months[currentDate.getMonth()];
    
    // Update current month
    const monthElement = document.getElementById('currentMonth');
    if (monthElement) {
        monthElement.textContent = currentMonth + ' ' + currentDate.getFullYear();
    }
    
    // Determine typhoon season status based on month
    const month = currentDate.getMonth() + 1; // 1-12
    let seasonStatus = '';
    let expectedActivity = '';
    let pagasaAdvisory = '';
    
    // Typhoon season in Philippines: June to November (peak: July-October)
    if (month >= 6 && month <= 11) {
        if (month >= 7 && month <= 10) {
            seasonStatus = 'Peak Season';
            expectedActivity = 'High';
            pagasaAdvisory = 'Active monitoring required';
        } else {
            seasonStatus = 'Active Season';
            expectedActivity = 'Moderate to High';
            pagasaAdvisory = 'Stay alert for weather updates';
        }
    } else if (month === 5 || month === 12) {
        seasonStatus = 'Transition Period';
        expectedActivity = 'Low to Moderate';
        pagasaAdvisory = 'Monitor weather conditions';
    } else {
        seasonStatus = 'Off Season';
        expectedActivity = 'Low';
        pagasaAdvisory = 'Generally calm, but stay informed';
    }
    
    // Update weather status elements
    const seasonStatusElement = document.getElementById('seasonStatus');
    const expectedActivityElement = document.getElementById('expectedActivity');
    const pagasaAdvisoryElement = document.getElementById('pagasaAdvisory');
    
    if (seasonStatusElement) seasonStatusElement.textContent = seasonStatus;
    if (expectedActivityElement) expectedActivityElement.textContent = expectedActivity;
    if (pagasaAdvisoryElement) pagasaAdvisoryElement.textContent = pagasaAdvisory;
}

// Timeline Animation
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.animationDelay = `${index * 0.2}s`;
                }, index * 100);
            }
        });
    }, { threshold: 0.3 });

    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Typhoon Cards Animation
function initTyphoonCards() {
    const typhoonCards = document.querySelectorAll('.typhoon-card');
    
    typhoonCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    typhoonCards.forEach(card => {
        observer.observe(card);
    });

    // Initialize auto-play for slideshows
    initSlideshowAutoPlay();
}

// Slideshow Functions
function showSlide(typhoonName, slideIndex) {
    const slideshow = document.querySelector(`.typhoon-slideshow[data-typhoon="${typhoonName}"]`);
    if (!slideshow) return;

    const slides = slideshow.querySelectorAll('.slide');
    const dots = slideshow.querySelectorAll('.dot');

    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }
    if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    }

    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Show selected slide
    if (slides[slideIndex]) {
        slides[slideIndex].classList.add('active');
    }
    if (dots[slideIndex]) {
        dots[slideIndex].classList.add('active');
    }

    // Store current slide index
    slideshow.setAttribute('data-current-slide', slideIndex);
}

function changeSlide(typhoonName, direction) {
    const slideshow = document.querySelector(`.typhoon-slideshow[data-typhoon="${typhoonName}"]`);
    if (!slideshow) return;

    const currentSlide = parseInt(slideshow.getAttribute('data-current-slide')) || 0;
    const slides = slideshow.querySelectorAll('.slide');
    let newIndex = currentSlide + direction;

    if (newIndex >= slides.length) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = slides.length - 1;
    }

    showSlide(typhoonName, newIndex);
}

function currentSlide(typhoonName, slideIndex) {
    showSlide(typhoonName, slideIndex);
}

// Auto-play slideshow
function initSlideshowAutoPlay() {
    const slideshows = document.querySelectorAll('.typhoon-slideshow');
    
    slideshows.forEach(slideshow => {
        const typhoonName = slideshow.getAttribute('data-typhoon');
        let currentIndex = 0;
        
        // Initialize first slide
        showSlide(typhoonName, 0);
        
        // Auto-advance every 5 seconds
        setInterval(() => {
            const slides = slideshow.querySelectorAll('.slide');
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(typhoonName, currentIndex);
        }, 5000);
    });
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.info-card, .tip-card, .contact-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

