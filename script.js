// Interactive Storytelling Application
class NeuralStory {
    constructor() {
        this.currentChapter = 0;
        this.storyState = {
            trust: 50,
            stealth: 75,
            intel: 60,
            chapter: 1,
            location: "NEO-TOKYO UNDERGROUND",
            achievements: [],
            inventory: [],
            choiceHistory: []
        };
        
        this.settings = {
            audioEnabled: true,
            typewriterSpeed: 50,
            effectsEnabled: true,
            autoSave: true
        };
        
        this.typewriterTimeout = null;
        this.choiceTimer = null;
        this.currentTimerDuration = 30;
        
        this.init();
    }
    
    init() {
        this.loadElements();
        this.setupEventListeners();
        this.loadSettings();
        this.showLoadingScreen();
        this.loadStoryData();
        
        // Start the experience after loading
        setTimeout(() => {
            this.hideLoadingScreen();
            this.startStory();
        }, 3000);
    }
    
    loadElements() {
        // Main elements
        this.loadingScreen = document.getElementById('loading-screen');
        this.storyText = document.getElementById('story-text');
        this.choicesContainer = document.getElementById('choices-container');
        this.chapterNum = document.getElementById('chapter-num');
        this.currentLocation = document.getElementById('current-location');
        this.choiceTimer = document.getElementById('choice-timer');
        
        // Status elements
        this.trustValue = document.getElementById('trust-value');
        this.stealthValue = document.getElementById('stealth-value');
        this.intelValue = document.getElementById('intel-value');
        this.trustFill = document.querySelector('.trust-fill');
        this.stealthFill = document.querySelector('.stealth-fill');
        this.intelFill = document.querySelector('.intel-fill');
        
        // Navigation elements
        this.restartBtn = document.getElementById('restart-btn');
        this.backBtn = document.getElementById('back-btn');
        this.saveBtn = document.getElementById('save-btn');
        this.settingsBtn = document.getElementById('settings-btn');
        
        // Settings elements
        this.settingsPanel = document.getElementById('settings-panel');
        this.closeSettingsBtn = document.getElementById('close-settings');
        this.audioToggle = document.getElementById('audio-toggle');
        this.typewriterSpeedSlider = document.getElementById('typewriter-speed');
        this.effectsToggle = document.getElementById('effects-toggle');
        this.autoSaveToggle = document.getElementById('autosave-toggle');
        
        // Achievement elements
        this.achievementNotification = document.getElementById('achievement-notification');
        
        // Audio elements
        this.ambientSound = document.getElementById('ambient-sound');
    }
    
    setupEventListeners() {
        // Navigation events
        this.restartBtn.addEventListener('click', () => this.restartStory());
        this.backBtn.addEventListener('click', () => this.goBack());
        this.saveBtn.addEventListener('click', () => this.saveGame());
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        
        // Settings events
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.audioToggle.addEventListener('change', () => this.toggleAudio());
        this.typewriterSpeedSlider.addEventListener('input', (e) => this.updateTypewriterSpeed(e.target.value));
        this.effectsToggle.addEventListener('change', () => this.toggleEffects());
        this.autoSaveToggle.addEventListener('change', () => this.toggleAutoSave());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Click outside settings to close
        document.addEventListener('click', (e) => {
            if (!this.settingsPanel.contains(e.target) && !this.settingsBtn.contains(e.target)) {
                this.closeSettings();
            }
        });
    }
    
    loadStoryData() {
        this.storyData = {
            0: {
                text: "Welcome to Neo-Tokyo, 2087. The neon-drenched streets pulse with digital life as rain cascades down towering corporate monoliths. You are Alex Chen, a freelance data archaeologist who just received a mysterious message: 'The memories you seek are buried in the old neural networks. Find me in the Underground. - Ghost Protocol'",
                location: "NEO-TOKYO UNDERGROUND",
                chapter: 1,
                choices: [
                    {
                        id: 1,
                        title: "Investigate the Corporate District",
                        description: "Head to the towering megacorp headquarters where the message might have originated.",
                        icon: "🌆",
                        consequences: { trust: 10, stealth: -5, intel: 0 },
                        nextChapter: 1
                    },
                    {
                        id: 2,
                        title: "Descend into the Underground",
                        description: "Follow the cryptic message directly to the neural network hub beneath the city.",
                        icon: "🚇",
                        consequences: { trust: 0, stealth: 15, intel: 10 },
                        nextChapter: 2
                    },
                    {
                        id: 3,
                        title: "Analyze the Message",
                        description: "Use your data archaeology skills to trace the message's origin and encryption patterns.",
                        icon: "🔍",
                        consequences: { trust: -5, stealth: 0, intel: 20 },
                        nextChapter: 3
                    }
                ]
            },
            1: {
                text: "The corporate district towers above you like digital cathedrals. Security drones patrol the sky while holographic advertisements flicker across glass surfaces. You approach the Nexus Corp building, its neural-interface logo pulsing with electric blue light. A security guard notices your approach.",
                location: "NEXUS CORP PLAZA",
                chapter: 2,
                choices: [
                    {
                        id: 4,
                        title: "Flash Corporate Credentials",
                        description: "Use your forged corporate ID to gain legitimate access to the building.",
                        icon: "🏢",
                        consequences: { trust: 15, stealth: -10, intel: 5 },
                        nextChapter: 4
                    },
                    {
                        id: 5,
                        title: "Sneak Around Back",
                        description: "Find a maintenance entrance to avoid the main security checkpoint.",
                        icon: "🔧",
                        consequences: { trust: 0, stealth: 20, intel: 0 },
                        nextChapter: 5
                    },
                    {
                        id: 6,
                        title: "Hack the Security System",
                        description: "Use your neural interface to temporarily disable the building's security grid.",
                        icon: "⚡",
                        consequences: { trust: -10, stealth: 10, intel: 25 },
                        nextChapter: 6
                    }
                ]
            },
            2: {
                text: "The underground tunnels stretch endlessly through the city's digital nervous system. Fiber optic cables snake along the walls like glowing veins, carrying terabytes of data. You hear footsteps echoing behind you - someone is following. A figure emerges from the shadows wearing a neural crown.",
                location: "NEURAL NETWORK TUNNELS",
                chapter: 2,
                choices: [
                    {
                        id: 7,
                        title: "Confront the Stranger",
                        description: "Turn and face whoever has been following you through the tunnels.",
                        icon: "👥",
                        consequences: { trust: 20, stealth: -15, intel: 10 },
                        nextChapter: 7
                    },
                    {
                        id: 8,
                        title: "Continue Deeper",
                        description: "Ignore the follower and push deeper into the network's core systems.",
                        icon: "⬇️",
                        consequences: { trust: -5, stealth: 25, intel: 15 },
                        nextChapter: 8
                    },
                    {
                        id: 9,
                        title: "Set a Digital Trap",
                        description: "Use your skills to create a data snare that will reveal the follower's identity.",
                        icon: "🕸️",
                        consequences: { trust: 5, stealth: 10, intel: 30 },
                        nextChapter: 9
                    }
                ]
            },
            3: {
                text: "Your neural interface buzzes with activity as you dissect the message's encryption. The code is unlike anything you've seen - part quantum, part biological. Suddenly, your screen flickers and a ghostly face appears: 'You're getting close, Alex. But they're watching. The Collective knows you're here.'",
                location: "YOUR SAFEHOUSE",
                chapter: 2,
                choices: [
                    {
                        id: 10,
                        title: "Trace the Ghost Signal",
                        description: "Follow the quantum signature back to its source before it disappears.",
                        icon: "👻",
                        consequences: { trust: 0, stealth: 5, intel: 35 },
                        nextChapter: 10
                    },
                    {
                        id: 11,
                        title: "Prepare Defenses",
                        description: "The Collective is coming - fortify your systems and prepare for a cyber siege.",
                        icon: "🛡️",
                        consequences: { trust: 10, stealth: 30, intel: 5 },
                        nextChapter: 11
                    },
                    {
                        id: 12,
                        title: "Abandon the Safehouse",
                        description: "Pack your gear and flee before the Collective's hunters arrive.",
                        icon: "🏃",
                        consequences: { trust: -10, stealth: 40, intel: 0 },
                        nextChapter: 12
                    }
                ]
            },
            4: {
                text: "The elevator rises through the corporate tower's neural core. Each floor pulses with different colored lights - red for finance, blue for research, green for security. You reach the executive level where the Ghost Protocol message originated. The CEO's office door stands ajar, revealing a figure slumped over a neural interface chair.",
                location: "NEXUS CORP EXECUTIVE FLOOR",
                chapter: 3,
                choices: [
                    {
                        id: 13,
                        title: "Check the CEO's Vitals",
                        description: "Investigate whether the executive is alive or another victim of the mystery.",
                        icon: "❤️",
                        consequences: { trust: 25, stealth: -5, intel: 15 },
                        nextChapter: 13
                    },
                    {
                        id: 14,
                        title: "Access the Neural Interface",
                        description: "Jack into the CEO's neural chair to extract the memories stored within.",
                        icon: "🧠",
                        consequences: { trust: -15, stealth: 10, intel: 40 },
                        nextChapter: 14
                    },
                    {
                        id: 15,
                        title: "Search for Evidence",
                        description: "Look for physical clues in the office before touching anything digital.",
                        icon: "🔍",
                        consequences: { trust: 5, stealth: 20, intel: 20 },
                        nextChapter: 15
                    }
                ]
            },
            // Add more story chapters as needed...
            'ending': {
                text: "As the digital rain falls on Neo-Tokyo, you realize the Ghost Protocol was never about finding someone else - it was about finding yourself. The memories you've uncovered reveal a truth that will reshape the city's future. Your choices have led you here, to this moment of digital awakening.",
                location: "NEURAL NEXUS CORE",
                chapter: 'FINAL',
                choices: []
            }
        };
    }
    
    showLoadingScreen() {
        this.loadingScreen.style.display = 'flex';
        
        // Start ambient sound
        if (this.settings.audioEnabled) {
            this.ambientSound.play().catch(e => console.log('Audio autoplay prevented'));
        }
    }
    
    hideLoadingScreen() {
        this.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 1000);
    }
    
    startStory() {
        this.displayStory(0);
        this.showAchievement("Story Begin", "Welcome to Neural Echoes");
    }
    
    displayStory(chapterIndex) {
        const chapter = this.storyData[chapterIndex];
        if (!chapter) return;
        
        this.currentChapter = chapterIndex;
        
        // Update chapter info
        this.chapterNum.textContent = String(chapter.chapter).padStart(2, '0');
        this.currentLocation.textContent = chapter.location;
        
        // Clear previous content
        this.clearTypewriter();
        
        // Display story text with typewriter effect
        this.typewriterText(chapter.text);
        
        // Update choices after text is complete
        setTimeout(() => {
            this.displayChoices(chapter.choices);
        }, this.calculateTypewriterDuration(chapter.text));
        
        // Update navigation
        this.updateNavigation();
        
        // Auto-save if enabled
        if (this.settings.autoSave) {
            this.saveGame();
        }
    }
    
    typewriterText(text) {
        const textElement = this.storyText.querySelector('.typewriter-text');
        textElement.textContent = '';
        
        let index = 0;
        const speed = 101 - this.settings.typewriterSpeed; // Invert for intuitive slider
        
        const typeChar = () => {
            if (index < text.length) {
                textElement.textContent += text.charAt(index);
                index++;
                this.typewriterTimeout = setTimeout(typeChar, speed);
            } else {
                // Remove cursor after completion
                textElement.style.borderRight = 'none';
                setTimeout(() => {
                    textElement.style.borderRight = '2px solid var(--text-accent)';
                }, 1000);
            }
        };
        
        typeChar();
    }
    
    clearTypewriter() {
        if (this.typewriterTimeout) {
            clearTimeout(this.typewriterTimeout);
            this.typewriterTimeout = null;
        }
    }
    
    calculateTypewriterDuration(text) {
        const speed = 101 - this.settings.typewriterSpeed;
        return text.length * speed + 1000; // Add buffer time
    }
    
    displayChoices(choices) {
        this.choicesContainer.innerHTML = '';
        
        if (choices.length === 0) {
            // Story ending
            this.showEndingOptions();
            return;
        }
        
        choices.forEach((choice, index) => {
            const choiceElement = this.createChoiceElement(choice, index);
            this.choicesContainer.appendChild(choiceElement);
        });
        
        // Start choice timer
        this.startChoiceTimer();
    }
    
    createChoiceElement(choice, index) {
        const choiceDiv = document.createElement('div');
        choiceDiv.className = 'choice-card';
        choiceDiv.dataset.choice = choice.id;
        choiceDiv.dataset.index = index;
        
        const consequences = Object.entries(choice.consequences)
            .map(([stat, value]) => {
                const sign = value > 0 ? '+' : '';
                return `<span class="consequence ${stat}">${sign}${value} ${stat.toUpperCase()}</span>`;
            })
            .join('');
        
        choiceDiv.innerHTML = `
            <div class="choice-icon">${choice.icon}</div>
            <div class="choice-content">
                <div class="choice-title">${choice.title}</div>
                <div class="choice-description">${choice.description}</div>
                <div class="choice-consequences">${consequences}</div>
            </div>
            <div class="choice-glow"></div>
        `;
        
        choiceDiv.addEventListener('click', () => this.selectChoice(choice));
        
        // Add keyboard support
        choiceDiv.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                this.selectChoice(choice);
            }
        });
        
        choiceDiv.tabIndex = 0;
        
        return choiceDiv;
    }
    
    selectChoice(choice) {
        // Prevent multiple selections
        if (this.choicesContainer.querySelector('.choice-selected')) return;
        
        // Mark choice as selected
        const choiceElement = this.choicesContainer.querySelector(`[data-choice="${choice.id}"]`);
        choiceElement.classList.add('choice-selected');
        
        // Disable other choices
        this.choicesContainer.querySelectorAll('.choice-card').forEach(card => {
            if (card !== choiceElement) {
                card.classList.add('choice-disabled');
            }
        });
        
        // Stop timer
        this.stopChoiceTimer();
        
        // Update stats
        this.updateStats(choice.consequences);
        
        // Record choice
        this.storyState.choiceHistory.push({
            chapterIndex: this.currentChapter,
            choiceId: choice.id,
            choiceTitle: choice.title
        });
        
        // Check for achievements
        this.checkAchievements(choice);
        
        // Continue story after a delay
        setTimeout(() => {
            this.displayStory(choice.nextChapter);
        }, 2000);
    }
    
    updateStats(consequences) {
        Object.entries(consequences).forEach(([stat, change]) => {
            const newValue = Math.max(0, Math.min(100, this.storyState[stat] + change));
            this.storyState[stat] = newValue;
            
            // Update UI
            const valueElement = document.getElementById(`${stat}-value`);
            const fillElement = document.querySelector(`.${stat}-fill`);
            
            if (valueElement && fillElement) {
                valueElement.textContent = newValue;
                fillElement.style.width = `${newValue}%`;
                
                // Add pulse animation
                fillElement.parentElement.classList.add('stat-change');
                setTimeout(() => {
                    fillElement.parentElement.classList.remove('stat-change');
                }, 1000);
            }
        });
    }
    
    startChoiceTimer() {
        this.currentTimerDuration = 30;
        this.updateTimerDisplay();
        
        this.choiceTimerInterval = setInterval(() => {
            this.currentTimerDuration--;
            this.updateTimerDisplay();
            
            if (this.currentTimerDuration <= 0) {
                this.autoSelectChoice();
            }
        }, 1000);
    }
    
    stopChoiceTimer() {
        if (this.choiceTimerInterval) {
            clearInterval(this.choiceTimerInterval);
            this.choiceTimerInterval = null;
        }
    }
    
    updateTimerDisplay() {
        const timerElement = document.getElementById('choice-timer');
        const timerFill = document.querySelector('.timer-fill');
        
        if (timerElement && timerFill) {
            timerElement.textContent = this.currentTimerDuration;
            const percentage = (this.currentTimerDuration / 30) * 100;
            timerFill.style.transform = `rotate(${percentage * 3.6}deg)`;
            
            // Change color as time runs out
            if (this.currentTimerDuration <= 10) {
                timerFill.style.background = 'var(--danger-color)';
            } else if (this.currentTimerDuration <= 20) {
                timerFill.style.background = 'var(--warning-color)';
            } else {
                timerFill.style.background = 'var(--accent-color)';
            }
        }
    }
    
    autoSelectChoice() {
        // Auto-select the first available choice when timer runs out
        const firstChoice = this.choicesContainer.querySelector('.choice-card:not(.choice-disabled)');
        if (firstChoice) {
            const choiceId = firstChoice.dataset.choice;
            const chapter = this.storyData[this.currentChapter];
            const choice = chapter.choices.find(c => c.id == choiceId);
            if (choice) {
                this.selectChoice(choice);
                this.showAchievement("Time's Up", "Auto-selected due to timeout");
            }
        }
    }
    
    checkAchievements(choice) {
        const achievements = [];
        
        // First choice achievement
        if (this.storyState.choiceHistory.length === 1) {
            achievements.push({ title: "First Step", description: "Made your first choice" });
        }
        
        // Stats-based achievements
        if (this.storyState.trust >= 90) {
            achievements.push({ title: "Trusted Agent", description: "Reached maximum trust" });
        }
        if (this.storyState.stealth >= 90) {
            achievements.push({ title: "Ghost in the Shell", description: "Mastered stealth operations" });
        }
        if (this.storyState.intel >= 90) {
            achievements.push({ title: "Data Archaeologist", description: "Maximum intelligence gathered" });
        }
        
        // Choice-based achievements
        if (choice.id === 2) {
            achievements.push({ title: "Underground Explorer", description: "Chose the path less traveled" });
        }
        if (choice.id === 14) {
            achievements.push({ title: "Memory Thief", description: "Accessed forbidden neural data" });
        }
        
        // Show achievements
        achievements.forEach(achievement => {
            if (!this.storyState.achievements.includes(achievement.title)) {
                this.storyState.achievements.push(achievement.title);
                this.showAchievement(achievement.title, achievement.description);
            }
        });
    }
    
    showAchievement(title, description) {
        const notification = this.achievementNotification;
        const titleElement = notification.querySelector('.achievement-title');
        const descElement = notification.querySelector('.achievement-description');
        
        titleElement.textContent = title;
        descElement.textContent = description;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }
    
    showEndingOptions() {
        this.choicesContainer.innerHTML = `
            <div class="ending-panel">
                <h3>Neural Echoes Complete</h3>
                <p>Your journey through the digital underworld has come to an end. Your choices have shaped the fate of Neo-Tokyo.</p>
                <div class="final-stats">
                    <div class="final-stat">
                        <span class="stat-label">Trust</span>
                        <span class="stat-value">${this.storyState.trust}%</span>
                    </div>
                    <div class="final-stat">
                        <span class="stat-label">Stealth</span>
                        <span class="stat-value">${this.storyState.stealth}%</span>
                    </div>
                    <div class="final-stat">
                        <span class="stat-label">Intel</span>
                        <span class="stat-value">${this.storyState.intel}%</span>
                    </div>
                </div>
                <div class="ending-actions">
                    <button class="nav-btn" onclick="neuralStory.restartStory()">
                        <span class="btn-icon">🔄</span>
                        <span class="btn-text">Play Again</span>
                    </button>
                    <button class="nav-btn" onclick="neuralStory.shareResults()">
                        <span class="btn-icon">📤</span>
                        <span class="btn-text">Share Results</span>
                    </button>
                </div>
            </div>
        `;
    }
    
    updateNavigation() {
        // Enable/disable back button based on story progress
        this.backBtn.disabled = this.storyState.choiceHistory.length === 0;
        
        // Update button states
        if (this.storyState.choiceHistory.length > 0) {
            this.backBtn.classList.remove('disabled');
        } else {
            this.backBtn.classList.add('disabled');
        }
    }
    
    goBack() {
        if (this.storyState.choiceHistory.length === 0) return;
        
        // Remove last choice from history
        const lastChoice = this.storyState.choiceHistory.pop();
        
        // Revert stats (approximate - not perfect but functional)
        // In a real game, you'd store complete state snapshots
        
        // Go back to previous chapter
        this.displayStory(lastChoice.chapterIndex);
    }
    
    restartStory() {
        // Reset all state
        this.storyState = {
            trust: 50,
            stealth: 75,
            intel: 60,
            chapter: 1,
            location: "NEO-TOKYO UNDERGROUND",
            achievements: [],
            inventory: [],
            choiceHistory: []
        };
        
        // Reset timers
        this.stopChoiceTimer();
        this.clearTypewriter();
        
        // Start from beginning
        this.displayStory(0);
        
        // Show achievement
        this.showAchievement("Neural Reset", "Story restarted");
    }
    
    saveGame() {
        const saveData = {
            storyState: this.storyState,
            currentChapter: this.currentChapter,
            settings: this.settings,
            timestamp: new Date().toISOString()
        };
        
        // Store in memory (since localStorage is not available)
        this.savedGame = saveData;
        
        // Show save confirmation
        this.showAchievement("Game Saved", "Progress saved to memory");
    }
    
    loadGame() {
        if (this.savedGame) {
            this.storyState = this.savedGame.storyState;
            this.currentChapter = this.savedGame.currentChapter;
            this.settings = this.savedGame.settings;
            
            // Update UI
            this.updateAllStats();
            this.displayStory(this.currentChapter);
            
            this.showAchievement("Game Loaded", "Progress restored");
        }
    }
    
    updateAllStats() {
        ['trust', 'stealth', 'intel'].forEach(stat => {
            const valueElement = document.getElementById(`${stat}-value`);
            const fillElement = document.querySelector(`.${stat}-fill`);
            
            if (valueElement && fillElement) {
                valueElement.textContent = this.storyState[stat];
                fillElement.style.width = `${this.storyState[stat]}%`;
            }
        });
    }
    
    openSettings() {
        this.settingsPanel.classList.add('show');
    }
    
    closeSettings() {
        this.settingsPanel.classList.remove('show');
    }
    
    toggleAudio() {
        this.settings.audioEnabled = this.audioToggle.checked;
        
        if (this.settings.audioEnabled) {
            this.ambientSound.play().catch(e => console.log('Audio play failed'));
        } else {
            this.ambientSound.pause();
        }
    }
    
    updateTypewriterSpeed(value) {
        this.settings.typewriterSpeed = parseInt(value);
    }
    
    toggleEffects() {
        this.settings.effectsEnabled = this.effectsToggle.checked;
        
        const body = document.body;
        if (this.settings.effectsEnabled) {
            body.classList.remove('no-effects');
        } else {
            body.classList.add('no-effects');
        }
    }
    
    toggleAutoSave() {
        this.settings.autoSave = this.autoSaveToggle.checked;
    }
    
    loadSettings() {
        // Since localStorage is not available, use defaults
        this.audioToggle.checked = this.settings.audioEnabled;
        this.typewriterSpeedSlider.value = this.settings.typewriterSpeed;
        this.effectsToggle.checked = this.settings.effectsEnabled;
        this.autoSaveToggle.checked = this.settings.autoSave;
    }
    
    shareResults() {
        const results = {
            trust: this.storyState.trust,
            stealth: this.storyState.stealth,
            intel: this.storyState.intel,
            achievements: this.storyState.achievements.length,
            choices: this.storyState.choiceHistory.length
        };
        
        const shareText = `I just completed Neural Echoes with ${results.trust}% Trust, ${results.stealth}% Stealth, and ${results.intel}% Intel! Unlocked ${results.achievements} achievements in ${results.choices} choices.`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Neural Echoes - My Results',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showAchievement("Results Copied", "Share text copied to clipboard");
            });
        }
    }
    
    handleKeyPress(e) {
        // Keyboard shortcuts
        switch(e.key) {
            case '1':
            case '2':
            case '3':
                if (!this.settingsPanel.classList.contains('show')) {
                    const choiceIndex = parseInt(e.key) - 1;
                    const choiceElement = this.choicesContainer.children[choiceIndex];
                    if (choiceElement && !choiceElement.classList.contains('choice-disabled')) {
                        choiceElement.click();
                    }
                }
                break;
            case 'r':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.restartStory();
                }
                break;
            case 's':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.saveGame();
                }
                break;
            case 'Escape':
                this.closeSettings();
                break;
        }
    }
    
    // Add background effects
    createBackgroundEffects() {
        this.createMatrixRain();
        this.createFloatingParticles();
        this.animateNeonGrid();
    }
    
    createMatrixRain() {
        const matrixContainer = document.querySelector('.matrix-rain');
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        for (let i = 0; i < 50; i++) {
            const drop = document.createElement('div');
            drop.className = 'matrix-drop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDelay = Math.random() * 2 + 's';
            drop.style.animationDuration = (Math.random() * 3 + 2) + 's';
            drop.textContent = chars[Math.floor(Math.random() * chars.length)];
            matrixContainer.appendChild(drop);
        }
    }
    
    createFloatingParticles() {
        const particlesContainer = document.querySelector('.floating-particles');
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    animateNeonGrid() {
        const grid = document.querySelector('.neon-grid');
        setInterval(() => {
            grid.style.opacity = Math.random() * 0.3 + 0.1;
        }, 2000);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.neuralStory = new NeuralStory();
});

// Add CSS animations and effects
const style = document.createElement('style');
style.textContent = `
    .stat-change {
        animation: statPulse 0.5s ease-out;
    }
    
    @keyframes statPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .choice-selected {
        border-color: var(--accent-color);
        background: rgba(0, 255, 150, 0.1);
        transform: scale(1.05);
    }
    
    .choice-disabled {
        opacity: 0.5;
        pointer-events: none;
    }
    
    .ending-panel {
        background: rgba(0, 0, 0, 0.8);
        border: 2px solid var(--accent-color);
        border-radius: 10px;
        padding: 2rem;
        text-align: center;
        margin: 2rem 0;
    }
    
    .final-stats {
        display: flex;
        justify-content: space-around;
        margin: 1rem 0;
    }
    
    .final-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .ending-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }
    
    .matrix-drop {
        position: absolute;
        color: var(--accent-color);
        font-size: 14px;
        animation: matrixFall linear infinite;
    }
    
    @keyframes matrixFall {
        0% { transform: translateY(-100vh); opacity: 1; }
        100% { transform: translateY(100vh); opacity: 0; }
    }
    
    .particle {
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--accent-color);
        border-radius: 50%;
        animation: float infinite ease-in-out;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }
    
    .no-effects .background-effects {
        display: none;
    }
    
    .disabled {
        opacity: 0.5;
        pointer-events: none;
    }
`;
document.head.appendChild(style);