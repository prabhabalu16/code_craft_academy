// script.js
// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Extract RGB values from CSS variables
    extractCSSColors();
    
    // Initialize all components
    initThemeToggle();
    initSidebar();
    initNavigation();
    initAuthModal();
    initUserSession();
    initCourses();
    initDashboard();
    initProfile();
    initContactForm();
    
    // Show auth modal if not logged in
    if (!isLoggedIn()) {
        setTimeout(() => {
            showAuthModal();
        }, 1000);
    }
    
    // Check for hash in URL
    checkUrlHash();
});

// CSS Color Extraction
function extractCSSColors() {
    const root = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
    const secondaryColor = getComputedStyle(root).getPropertyValue('--secondary-color').trim();
    
    // Convert hex to RGB for primary color
    const primaryRGB = hexToRgb(primaryColor);
    if (primaryRGB) {
        root.style.setProperty('--primary-color-rgb', `${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}`);
    }
    
    // Convert hex to RGB for secondary color
    const secondaryRGB = hexToRgb(secondaryColor);
    if (secondaryRGB) {
        root.style.setProperty('--secondary-color-rgb', `${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}`);
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
        
        // Update theme icon
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

// Sidebar
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('expanded');
            this.innerHTML = sidebar.classList.contains('expanded') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('expanded') &&
            !sidebar.contains(event.target) &&
            !event.target.closest('.sidebar-toggle')) {
            sidebar.classList.remove('expanded');
            sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding page
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                const sidebarToggle = document.getElementById('sidebarToggle');
                if (sidebar.classList.contains('expanded')) {
                    sidebar.classList.remove('expanded');
                    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
    
    // Start Learning button
    const startLearningBtn = document.getElementById('startLearningBtn');
    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', function() {
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelector('[data-page="courses"]').classList.add('active');
            
            // Show courses page
            showPage('courses');
        });
    }
}

function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageId + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Update dashboard if needed
        if (pageId === 'dashboard') {
            updateDashboard();
        }
        
        // Update profile if needed
        if (pageId === 'profile') {
            updateProfile();
        }
    }
}

function checkUrlHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const navLink = document.querySelector(`[data-page="${hash}"]`);
        if (navLink) {
            navLinks.forEach(l => l.classList.remove('active'));
            navLink.classList.add('active');
            showPage(hash);
        }
    }
}

// Authentication Modal
function initAuthModal() {
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            if (tab === 'login') {
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
            } else {
                loginForm.classList.remove('active');
                registerForm.classList.add('active');
            }
        });
    });
    
    // Show register form
    if (showRegister) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelector('[data-tab="register"]').classList.add('active');
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        });
    }
    
    // Show login form
    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelector('[data-tab="login"]').classList.add('active');
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        });
    }
    
    // Close modal
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', hideAuthModal);
    }
    
    // Close modal when clicking outside
    authModal.addEventListener('click', function(e) {
        if (e.target === authModal) {
            hideAuthModal();
        }
    });
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            
            if (!username || !password) {
                showSuccessModal('Please enter both username and password');
                return;
            }
            
            const users = getUsers();
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                loginUser(username);
                hideAuthModal();
                showSuccessModal(`Welcome back, ${username}!`);
                updateUserInterface();
            } else {
                showSuccessModal('Invalid username or password');
            }
        });
    }
    
    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('regUsername').value.trim();
            const password = document.getElementById('regPassword').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            const usernameError = document.getElementById('usernameError');
            const passwordError = document.getElementById('passwordError');
            
            // Clear errors
            usernameError.textContent = '';
            passwordError.textContent = '';
            
            // Validation
            let isValid = true;
            
            if (username.length < 3) {
                usernameError.textContent = 'Username must be at least 3 characters';
                isValid = false;
            }
            
            if (password.length < 6) {
                passwordError.textContent = 'Password must be at least 6 characters';
                isValid = false;
            }
            
            if (password !== confirmPassword) {
                passwordError.textContent = 'Passwords do not match';
                isValid = false;
            }
            
            // Check if username already exists
            const users = getUsers();
            if (users.find(u => u.username === username)) {
                usernameError.textContent = 'Username already exists';
                isValid = false;
            }
            
            if (isValid) {
                // Create new user
                const newUser = {
                    username: username,
                    password: password,
                    createdAt: new Date().toISOString(),
                    registeredCourses: [],
                    completedCourses: []
                };
                
                users.push(newUser);
                localStorage.setItem('codeCraftsUsers', JSON.stringify(users));
                
                // Login the new user
                loginUser(username);
                hideAuthModal();
                showSuccessModal(`Account created successfully! Welcome, ${username}`);
                updateUserInterface();
            }
        });
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logoutUser();
            showSuccessModal('Logged out successfully');
            updateUserInterface();
            showAuthModal();
        });
    }
}

function showAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset forms
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('regUsername').value = '';
        document.getElementById('regPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        document.getElementById('usernameError').textContent = '';
        document.getElementById('passwordError').textContent = '';
    }
}

function hideAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// User Session Management
function initUserSession() {
    updateUserInterface();
}

function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    const username = localStorage.getItem('currentUser');
    if (!username) return null;
    
    const users = getUsers();
    return users.find(u => u.username === username) || null;
}

function getUsers() {
    const usersJson = localStorage.getItem('codeCraftsUsers');
    return usersJson ? JSON.parse(usersJson) : [];
}

function loginUser(username) {
    localStorage.setItem('currentUser', username);
    updateUserInterface();
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    updateUserInterface();
}

function updateUserInterface() {
    const currentUser = getCurrentUser();
    const userInfo = document.getElementById('userInfo');
    const currentUserElement = document.getElementById('currentUser');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (currentUser) {
        if (currentUserElement) {
            currentUserElement.textContent = currentUser.username;
        }
        
        if (userInfo) {
            userInfo.style.display = 'flex';
        }
        
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
        }
    } else {
        if (currentUserElement) {
            currentUserElement.textContent = 'Guest';
        }
        
        if (userInfo) {
            userInfo.style.display = 'flex';
        }
        
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
        }
    }
}

// Courses
function initCourses() {
    const courses = [
        {
            id: 1,
            title: "Web Development Fundamentals",
            description: "Learn HTML, CSS, and JavaScript from scratch. Build responsive websites and understand web architecture.",
            price: "₹1,299",
            duration: "6 weeks",
            icon: "fas fa-code"
        },
        {
            id: 2,
            title: "Python Programming",
            description: "Master Python programming language. Learn data structures, algorithms, and build real-world applications.",
            price: "₹1,599",
            duration: "8 weeks",
            icon: "fas fa-python"
        },
        {
            id: 3,
            title: "React JS Masterclass",
            description: "Build modern web applications with React. Learn hooks, context API, and state management.",
            price: "₹1,899",
            duration: "10 weeks",
            icon: "fab fa-react"
        },
        {
            id: 4,
            title: "Data Structures & Algorithms",
            description: "Essential computer science concepts for coding interviews and efficient programming.",
            price: "₹1,799",
            duration: "12 weeks",
            icon: "fas fa-project-diagram"
        },
        {
            id: 5,
            title: "Full Stack Development",
            description: "Complete course covering frontend, backend, databases, and deployment.",
            price: "₹2,499",
            duration: "16 weeks",
            icon: "fas fa-layer-group"
        },
        {
            id: 6,
            title: "Mobile App Development",
            description: "Build cross-platform mobile applications using React Native and Flutter.",
            price: "₹1,999",
            duration: "10 weeks",
            icon: "fas fa-mobile-alt"
        },
        {
            id: 7,
            title: "UI/UX Design Principles",
            description: "Learn user interface and user experience design for creating engaging digital products.",
            price: "₹1,499",
            duration: "6 weeks",
            icon: "fas fa-palette"
        },
        {
            id: 8,
            title: "Database Management",
            description: "Master SQL and NoSQL databases. Learn database design, optimization, and administration.",
            price: "₹1,699",
            duration: "8 weeks",
            icon: "fas fa-database"
        },
        {
            id: 9,
            title: "Cloud Computing Basics",
            description: "Introduction to cloud platforms, deployment, and serverless architecture.",
            price: "₹1,899",
            duration: "8 weeks",
            icon: "fas fa-cloud"
        },
        {
            id: 10,
            title: "DevOps Fundamentals",
            description: "Learn continuous integration, deployment, containerization, and infrastructure as code.",
            price: "₹2,199",
            duration: "10 weeks",
            icon: "fas fa-cogs"
        }
    ];
    
    const coursesContainer = document.getElementById('coursesContainer');
    
    if (coursesContainer) {
        coursesContainer.innerHTML = '';
        
        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.innerHTML = `
                <div class="course-image">
                    <i class="${course.icon}"></i>
                </div>
                <div class="course-content">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-description">${course.description}</p>
                    <div class="course-meta">
                        <div class="course-price">${course.price}</div>
                        <div class="course-duration">
                            <i class="fas fa-clock"></i>
                            <span>${course.duration}</span>
                        </div>
                    </div>
                    <div class="course-actions">
                        <button class="btn-enroll" data-course-id="${course.id}">Register Now</button>
                        <button class="btn-details">View Details</button>
                    </div>
                </div>
            `;
            
            coursesContainer.appendChild(courseCard);
        });
        
        // Add event listeners for enroll buttons
        const enrollButtons = document.querySelectorAll('.btn-enroll');
        enrollButtons.forEach(button => {
            button.addEventListener('click', function() {
                const courseId = parseInt(this.getAttribute('data-course-id'));
                registerForCourse(courseId);
            });
        });
        
        // Add event listeners for details buttons
        const detailsButtons = document.querySelectorAll('.btn-details');
        detailsButtons.forEach(button => {
            button.addEventListener('click', function() {
                const courseCard = this.closest('.course-card');
                const courseTitle = courseCard.querySelector('.course-title').textContent;
                showSuccessModal(`Details for "${courseTitle}" would be displayed here.`);
            });
        });
    }
}

function registerForCourse(courseId) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        showAuthModal();
        return;
    }
    
    const courses = [
        {id: 1, title: "Web Development Fundamentals", price: "₹1,299"},
        {id: 2, title: "Python Programming", price: "₹1,599"},
        {id: 3, title: "React JS Masterclass", price: "₹1,899"},
        {id: 4, title: "Data Structures & Algorithms", price: "₹1,799"},
        {id: 5, title: "Full Stack Development", price: "₹2,499"},
        {id: 6, title: "Mobile App Development", price: "₹1,999"},
        {id: 7, title: "UI/UX Design Principles", price: "₹1,499"},
        {id: 8, title: "Database Management", price: "₹1,699"},
        {id: 9, title: "Cloud Computing Basics", price: "₹1,899"},
        {id: 10, title: "DevOps Fundamentals", price: "₹2,199"}
    ];
    
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
        showSuccessModal('Course not found');
        return;
    }
    
    // Get users and update current user
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    
    if (userIndex === -1) {
        showSuccessModal('User not found');
        return;
    }
    
    // Check if already registered
    if (users[userIndex].registeredCourses.includes(courseId)) {
        showSuccessModal(`You are already registered for "${course.title}"`);
        return;
    }
    
    // Register for course
    users[userIndex].registeredCourses.push(courseId);
    localStorage.setItem('codeCraftsUsers', JSON.stringify(users));
    
    // Update current user object
    currentUser.registeredCourses.push(courseId);
    
    showSuccessModal(`Successfully registered for "${course.title}"!`);
    
    // Update dashboard if visible
    if (document.getElementById('dashboardPage').classList.contains('active')) {
        updateDashboard();
    }
}

// Dashboard
function initDashboard() {
    updateDashboard();
}

function updateDashboard() {
    const currentUser = getCurrentUser();
    const enrolledCount = document.getElementById('enrolledCount');
    const completedCount = document.getElementById('completedCount');
    const progressPercent = document.getElementById('progressPercent');
    const registeredCoursesList = document.getElementById('registeredCourses');
    const completedCoursesList = document.getElementById('completedCourses');
    
    const courses = [
        {id: 1, title: "Web Development Fundamentals", price: "₹1,299"},
        {id: 2, title: "Python Programming", price: "₹1,599"},
        {id: 3, title: "React JS Masterclass", price: "₹1,899"},
        {id: 4, title: "Data Structures & Algorithms", price: "₹1,799"},
        {id: 5, title: "Full Stack Development", price: "₹2,499"},
        {id: 6, title: "Mobile App Development", price: "₹1,999"},
        {id: 7, title: "UI/UX Design Principles", price: "₹1,499"},
        {id: 8, title: "Database Management", price: "₹1,699"},
        {id: 9, title: "Cloud Computing Basics", price: "₹1,899"},
        {id: 10, title: "DevOps Fundamentals", price: "₹2,199"}
    ];
    
    if (currentUser) {
        const registeredIds = currentUser.registeredCourses || [];
        const completedIds = currentUser.completedCourses || [];
        
        // Update counts
        if (enrolledCount) enrolledCount.textContent = registeredIds.length;
        if (completedCount) completedCount.textContent = completedIds.length;
        
        // Calculate progress
        const progress = registeredIds.length > 0 ? 
            Math.round((completedIds.length / registeredIds.length) * 100) : 0;
        if (progressPercent) progressPercent.textContent = `${progress}%`;
        
        // Update registered courses list
        if (registeredCoursesList) {
            registeredCoursesList.innerHTML = '';
            
            if (registeredIds.length === 0) {
                registeredCoursesList.innerHTML = '<p class="empty-message">No courses registered yet. <a href="#courses">Browse courses</a></p>';
            } else {
                registeredIds.forEach(courseId => {
                    const course = courses.find(c => c.id === courseId);
                    if (course) {
                        const isCompleted = completedIds.includes(courseId);
                        const courseItem = document.createElement('div');
                        courseItem.className = `course-item ${isCompleted ? 'completed' : ''}`;
                        courseItem.innerHTML = `
                            <div>
                                <h4>${course.title}</h4>
                                <p>${course.price}</p>
                            </div>
                            ${!isCompleted ? `<button class="btn-complete" data-course-id="${courseId}">Mark Complete</button>` : ''}
                        `;
                        registeredCoursesList.appendChild(courseItem);
                    }
                });
                
                // Add event listeners for complete buttons
                const completeButtons = registeredCoursesList.querySelectorAll('.btn-complete');
                completeButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const courseId = parseInt(this.getAttribute('data-course-id'));
                        markCourseComplete(courseId);
                    });
                });
            }
        }
        
        // Update completed courses list
        if (completedCoursesList) {
            completedCoursesList.innerHTML = '';
            
            if (completedIds.length === 0) {
                completedCoursesList.innerHTML = '<p class="empty-message">No courses completed yet.</p>';
            } else {
                completedIds.forEach(courseId => {
                    const course = courses.find(c => c.id === courseId);
                    if (course) {
                        const courseItem = document.createElement('div');
                        courseItem.className = 'course-item completed';
                        courseItem.innerHTML = `
                            <div>
                                <h4>${course.title}</h4>
                                <p>${course.price}</p>
                            </div>
                            <i class="fas fa-check" style="color: #00b09b;"></i>
                        `;
                        completedCoursesList.appendChild(courseItem);
                    }
                });
            }
        }
    } else {
        // Guest user
        if (enrolledCount) enrolledCount.textContent = '0';
        if (completedCount) completedCount.textContent = '0';
        if (progressPercent) progressPercent.textContent = '0%';
        
        if (registeredCoursesList) {
            registeredCoursesList.innerHTML = '<p class="empty-message">Please <a href="#" id="loginFromDashboard">login</a> to view your registered courses</p>';
            
            // Add login link
            const loginLink = registeredCoursesList.querySelector('#loginFromDashboard');
            if (loginLink) {
                loginLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    showAuthModal();
                });
            }
        }
        
        if (completedCoursesList) {
            completedCoursesList.innerHTML = '<p class="empty-message">Please login to view your completed courses</p>';
        }
    }
}

function markCourseComplete(courseId) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        showAuthModal();
        return;
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    
    if (userIndex === -1) {
        showSuccessModal('User not found');
        return;
    }
    
    // Check if already completed
    if (users[userIndex].completedCourses.includes(courseId)) {
        showSuccessModal('Course already marked as complete');
        return;
    }
    
    // Mark as complete
    users[userIndex].completedCourses.push(courseId);
    localStorage.setItem('codeCraftsUsers', JSON.stringify(users));
    
    // Update current user object
    currentUser.completedCourses.push(courseId);
    
    showSuccessModal('Course marked as complete!');
    updateDashboard();
    updateProfile();
}

// Profile
function initProfile() {
    updateProfile();
    
    // Edit profile button
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            showSuccessModal('Profile editing feature would be implemented here.');
        });
    }
}

function updateProfile() {
    const currentUser = getCurrentUser();
    const profileUsername = document.getElementById('profileUsername');
    const memberSince = document.getElementById('memberSince');
    const lastLogin = document.getElementById('lastLogin');
    const progressText = document.getElementById('progressText');
    const progressCircle = document.getElementById('progressCircle');
    const statEnrolled = document.getElementById('statEnrolled');
    const statCompleted = document.getElementById('statCompleted');
    const statInProgress = document.getElementById('statInProgress');
    
    if (currentUser) {
        // Update profile info
        if (profileUsername) profileUsername.textContent = currentUser.username;
        
        if (memberSince) {
            const createdDate = currentUser.createdAt ? new Date(currentUser.createdAt) : new Date();
            memberSince.textContent = createdDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        if (lastLogin) {
            lastLogin.textContent = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        // Update progress stats
        const registeredCount = currentUser.registeredCourses ? currentUser.registeredCourses.length : 0;
        const completedCount = currentUser.completedCourses ? currentUser.completedCourses.length : 0;
        const inProgressCount = registeredCount - completedCount;
        const progress = registeredCount > 0 ? Math.round((completedCount / registeredCount) * 100) : 0;
        
        if (statEnrolled) statEnrolled.textContent = `${registeredCount} courses`;
        if (statCompleted) statCompleted.textContent = `${completedCount} courses`;
        if (statInProgress) statInProgress.textContent = `${inProgressCount} courses`;
        if (progressText) progressText.textContent = `${progress}%`;
        
        // Update progress circle
        if (progressCircle) {
            progressCircle.style.background = `conic-gradient(var(--primary-color) 0% ${progress}%, #e0e0e0 ${progress}% 100%)`;
            if (document.body.classList.contains('dark-theme')) {
                progressCircle.style.background = `conic-gradient(var(--primary-color) 0% ${progress}%, #2d3748 ${progress}% 100%)`;
            }
        }
    } else {
        // Guest user
        if (profileUsername) profileUsername.textContent = 'Guest User';
        if (memberSince) memberSince.textContent = 'Not available';
        if (lastLogin) lastLogin.textContent = 'Not available';
        
        if (statEnrolled) statEnrolled.textContent = '0 courses';
        if (statCompleted) statCompleted.textContent = '0 courses';
        if (statInProgress) statInProgress.textContent = '0 courses';
        if (progressText) progressText.textContent = '0%';
        
        if (progressCircle) {
            progressCircle.style.background = `conic-gradient(var(--primary-color) 0% 0%, #e0e0e0 0% 100%)`;
            if (document.body.classList.contains('dark-theme')) {
                progressCircle.style.background = `conic-gradient(var(--primary-color) 0% 0%, #2d3748 0% 100%)`;
            }
        }
    }
}

// Contact Form
function initContactForm() {
    const messageForm = document.getElementById('messageForm');
    
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();
            
            if (!name || !email || !message) {
                showSuccessModal('Please fill in all fields');
                return;
            }
            
            // Simulate sending message
            showSuccessModal(`Thank you, ${name}! Your message has been sent. We'll get back to you at ${email} soon.`);
            
            // Reset form
            messageForm.reset();
        });
    }
}

// Success Modal
function initSuccessModal() {
    const successModal = document.getElementById('successModal');
    const closeSuccessModal = document.getElementById('closeSuccessModal');
    const okSuccessBtn = document.getElementById('okSuccessBtn');
    
    if (closeSuccessModal) {
        closeSuccessModal.addEventListener('click', hideSuccessModal);
    }
    
    if (okSuccessBtn) {
        okSuccessBtn.addEventListener('click', hideSuccessModal);
    }
    
    // Close modal when clicking outside
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                hideSuccessModal();
            }
        });
    }
}

function showSuccessModal(message) {
    const successModal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');
    
    if (successModal && successMessage) {
        successMessage.textContent = message;
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideSuccessModal() {
    const successModal = document.getElementById('successModal');
    
    if (successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Initialize success modal
initSuccessModal();