document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    hamburger.addEventListener('click', function() {
        mobileMenu.classList.toggle('show');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            mobileMenu.classList.remove('show');
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize form steps
    updateStepProgress(1);
    
    // Add input validation
    setupValidation();
});

// Form navigation functions
function nextStep(currentStep) {
    if (!validateStep(currentStep)) return;
    
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.form-step[data-step="${currentStep + 1}"]`).classList.add('active');
    
    updateStepProgress(currentStep + 1);
    
    // Scroll to top of form
    const formSection = document.querySelector('.form-container');
    formSection.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(currentStep) {
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.form-step[data-step="${currentStep - 1}"]`).classList.add('active');
    
    updateStepProgress(currentStep - 1);
    
    // Scroll to top of form
    const formSection = document.querySelector('.form-container');
    formSection.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepProgress(activeStep) {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach(step => {
        const stepNumber = parseInt(step.getAttribute('data-step'));
        
        step.classList.remove('active', 'completed');
        
        if (stepNumber < activeStep) {
            step.classList.add('completed');
        } else if (stepNumber === activeStep) {
            step.classList.add('active');
        }
    });
}

// Form validation
function setupValidation() {
    const form = document.getElementById('multiStepForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateStep(4)) {
            showSummary();
            showSuccessMessage();
        }
    });
}

function validateStep(stepNumber) {
    let isValid = true;
    const stepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    
    // Clear previous error messages
    stepElement.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    // Step 1 validation
    if (stepNumber === 1) {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const dob = document.getElementById('dob').value;
        
        if (!firstName) {
            showError('firstName', 'First name is required');
            isValid = false;
        }
        
        if (!lastName) {
            showError('lastName', 'Last name is required');
            isValid = false;
        }
        
        if (!dob) {
            showError('dob', 'Date of birth is required');
            isValid = false;
        } else {
            const dobDate = new Date(dob);
            const today = new Date();
            const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            
            if (dobDate > minAgeDate) {
                showError('dob', 'You must be at least 18 years old');
                isValid = false;
            }
        }
    }
    
    // Step 2 validation
    if (stepNumber === 2) {
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!phone) {
            showError('phone', 'Phone number is required');
            isValid = false;
        } else if (!isValidPhone(phone)) {
            showError('phone', 'Please enter a valid phone number');
            isValid = false;
        }
    }
    
    // Step 3 validation
    if (stepNumber === 3) {
        const referral = document.getElementById('referral').value;
        const interests = document.querySelectorAll('input[name="interests"]:checked');
        
        if (!referral) {
            showError('referral', 'Please select how you heard about us');
            isValid = false;
        }
        
        if (interests.length === 0) {
            showError(document.querySelector('input[name="interests"]').parentElement.parentElement, 'Please select at least one interest');
            isValid = false;
        }
    }
    
    // Step 4 validation
    if (stepNumber === 4) {
        const terms = document.getElementById('terms').checked;
        
        if (!terms) {
            showError('terms', 'You must agree to the terms and conditions');
            isValid = false;
        }
    }
    
    return isValid;
}

function showError(fieldId, message) {
    let errorElement;
    
    if (typeof fieldId === 'string') {
        const field = document.getElementById(fieldId);
        errorElement = field.nextElementSibling;
    } else {
        // For checkbox groups or other complex fields
        errorElement = fieldId.querySelector('.error-message') || 
                      fieldId.parentElement.querySelector('.error-message');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const re = /^[\d\s\-+()]{10,}$/;
    return re.test(phone);
}

// Form submission
function showSummary() {
    const summaryContent = document.getElementById('summary-content');
    summaryContent.innerHTML = '';
    
    // Personal Info
    addSummaryItem('First Name', document.getElementById('firstName').value.trim());
    addSummaryItem('Last Name', document.getElementById('lastName').value.trim());
    addSummaryItem('Date of Birth', document.getElementById('dob').value);
    
    // Contact Details
    addSummaryItem('Email', document.getElementById('email').value.trim());
    addSummaryItem('Phone', document.getElementById('phone').value.trim());
    addSummaryItem('Address', document.getElementById('address').value.trim() || 'Not provided');
    
    // Preferences
    addSummaryItem('Referral Source', document.getElementById('referral').options[document.getElementById('referral').selectedIndex].text);
    
    const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
        .map(el => el.value.charAt(0).toUpperCase() + el.value.slice(1))
        .join(', ');
    addSummaryItem('Interests', interests || 'None selected');
    
    addSummaryItem('Newsletter Subscription', document.getElementById('newsletter').checked ? 'Yes' : 'No');
}

function addSummaryItem(label, value) {
    const summaryContent = document.getElementById('summary-content');
    const item = document.createElement('div');
    item.className = 'summary-item';
    item.innerHTML = `
        <div class="summary-label">${label}</div>
        <div class="summary-value">${value}</div>
    `;
    summaryContent.appendChild(item);
}

function showSuccessMessage() {
    document.querySelector('.form-step.active').classList.remove('active');
    document.querySelector('.form-success').style.display = 'block';
    
    // Mark all steps as completed
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
        step.classList.add('completed');
    });
}

function restartForm() {
    // Reset form
    document.getElementById('multiStepForm').reset();
    document.querySelector('.form-success').style.display = 'none';
    
    // Show first step
    document.querySelector('.form-step[data-step="1"]').classList.add('active');
    
    // Reset progress
    updateStepProgress(1);
    
    // Clear all error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
