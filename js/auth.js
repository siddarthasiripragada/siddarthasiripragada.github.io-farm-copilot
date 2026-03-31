/* ═══════════════════════════════════════════════
   Canadian Farm Copilot — Authentication Module
   ═══════════════════════════════════════════════ */

'use strict';

/**
 * Authentication System
 * Handles sign-in, sign-up, password reset, and session management
 */
const Auth = {
  // Configuration
  STORAGE_KEY: 'farmCopilotAuth',
  SESSION_TIMEOUT: 7 * 24 * 60 * 60 * 1000, // 7 days
  PASSWORD_MIN_LENGTH: 8,

  /**
   * Load session from localStorage
   */
  loadSession() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return null;
      
      const session = JSON.parse(data);
      // Check if session expired
      if (session.expiresAt && Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }
      return session;
    } catch (e) {
      console.error('Failed to load session:', e);
      return null;
    }
  },

  /**
   * Save session to localStorage
   */
  saveSession(user) {
    try {
      const session = {
        id: user.email,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        province: user.province || '',
        createdAt: Date.now(),
        expiresAt: Date.now() + this.SESSION_TIMEOUT,
        token: this.generateToken(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
      
      // Also update Profile object for compatibility
      if (Profile && Profile.save) {
        Profile.save(session);
      }
      
      return session;
    } catch (e) {
      console.error('Failed to save session:', e);
      return null;
    }
  },

  /**
   * Clear session
   */
  clearSession() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      if (Profile && Profile.save) {
        Profile.save(null);
      }
    } catch (e) {
      console.error('Failed to clear session:', e);
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.loadSession() !== null;
  },

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.loadSession();
  },

  /**
   * Generate a simple token (in production, use actual JWT)
   */
  generateToken() {
    return btoa(Date.now() + Math.random()).slice(0, 32);
  },

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  validatePassword(password) {
    return password && password.length >= this.PASSWORD_MIN_LENGTH;
  },

  /**
   * Get or create user database (simulated with localStorage)
   */
  getUserDatabase() {
    try {
      const dbKey = 'farmCopilotUserDB';
      const existing = localStorage.getItem(dbKey);
      if (existing) {
        return JSON.parse(existing);
      }
      return {};
    } catch {
      return {};
    }
  },

  /**
   * Save user database
   */
  saveUserDatabase(db) {
    try {
      const dbKey = 'farmCopilotUserDB';
      localStorage.setItem(dbKey, JSON.stringify(db));
    } catch (e) {
      console.error('Failed to save user database:', e);
    }
  },

  /**
   * Hash password (simple implementation - use bcrypt in production)
   */
  hashPassword(password) {
    return btoa(password); // Base64 encoding for demo purposes
  },

  /**
   * Verify password
   */
  verifyPassword(password, hash) {
    return this.hashPassword(password) === hash;
  },

  /**
   * Sign up new user
   */
  async signUp(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validate input
        if (!userData.firstName || !userData.firstName.trim()) {
          return reject(new Error('First name is required.'));
        }
        if (!userData.lastName || !userData.lastName.trim()) {
          return reject(new Error('Last name is required.'));
        }
        if (!this.validateEmail(userData.email)) {
          return reject(new Error('Please enter a valid email address.'));
        }
        if (!userData.province) {
          return reject(new Error('Please select your province.'));
        }
        if (!this.validatePassword(userData.password)) {
          return reject(new Error(`Password must be at least ${this.PASSWORD_MIN_LENGTH} characters.`));
        }

        // Check if user already exists
        const db = this.getUserDatabase();
        if (db[userData.email]) {
          return reject(new Error('An account with this email already exists.'));
        }

        // Create new user
        const newUser = {
          id: userData.email,
          email: userData.email,
          firstName: userData.firstName.trim(),
          lastName: userData.lastName.trim(),
          province: userData.province,
          passwordHash: this.hashPassword(userData.password),
          role: 'farmer',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        db[userData.email] = newUser;
        this.saveUserDatabase(db);

        // Create session
        const session = this.saveSession(newUser);
        resolve(session);
      }, 1000); // Simulate network delay
    });
  },

  /**
   * Sign in user
   */
  async signIn(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validate input
        if (!this.validateEmail(email)) {
          return reject(new Error('Please enter a valid email address.'));
        }
        if (!password) {
          return reject(new Error('Password is required.'));
        }

        // Find user
        const db = this.getUserDatabase();
        const user = db[email];

        if (!user) {
          return reject(new Error('Email or password is incorrect.'));
        }

        // Verify password
        if (!this.verifyPassword(password, user.passwordHash)) {
          return reject(new Error('Email or password is incorrect.'));
        }

        // Create session
        const session = this.saveSession(user);
        resolve(session);
      }, 1000); // Simulate network delay
    });
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.validateEmail(email)) {
          return reject(new Error('Please enter a valid email address.'));
        }

        const db = this.getUserDatabase();
        if (!db[email]) {
          // Don't reveal if email exists (security best practice)
          return resolve({
            success: true,
            message: 'If an account exists, you\'ll receive a reset link shortly.',
          });
        }

        // In production: send email with reset link
        // For demo: store reset token
        const resetToken = this.generateToken();
        const resetKey = `farmCopilotReset_${email}`;
        localStorage.setItem(resetKey, JSON.stringify({
          token: resetToken,
          expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
        }));

        log('Demo: Reset token for', email, ':', resetToken);
        resolve({
          success: true,
          message: 'If an account exists, you\'ll receive a reset link shortly.',
        });
      }, 1000);
    });
  },

  /**
   * Reset password with token
   */
  async resetPassword(email, token, newPassword) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.validateEmail(email)) {
          return reject(new Error('Invalid email.'));
        }

        if (!this.validatePassword(newPassword)) {
          return reject(new Error(`Password must be at least ${this.PASSWORD_MIN_LENGTH} characters.`));
        }

        // Verify reset token
        const resetKey = `farmCopilotReset_${email}`;
        const resetData = localStorage.getItem(resetKey);
        
        if (!resetData) {
          return reject(new Error('Reset link has expired or is invalid.'));
        }

        try {
          const parsed = JSON.parse(resetData);
          if (parsed.token !== token || Date.now() > parsed.expiresAt) {
            return reject(new Error('Reset link has expired or is invalid.'));
          }
        } catch {
          return reject(new Error('Reset link has expired or is invalid.'));
        }

        // Update password
        const db = this.getUserDatabase();
        const user = db[email];
        if (!user) {
          return reject(new Error('User not found.'));
        }

        user.passwordHash = this.hashPassword(newPassword);
        user.updatedAt = Date.now();
        db[email] = user;
        this.saveUserDatabase(db);

        // Clear reset token
        localStorage.removeItem(resetKey);

        resolve({ success: true, message: 'Password reset successfully.' });
      }, 1000);
    });
  },

  /**
   * Sign out user
   */
  signOut() {
    this.clearSession();
    window.location.href = 'index.html';
  },
};

/**
 * UI Helper functions for auth.html
 */

/**
 * Show/hide auth form tabs
 */
function showTab(tabName) {
  const views = document.querySelectorAll('[id^="view-"]');
  views.forEach(v => v.style.display = 'none');
  
  const view = document.getElementById('view-' + tabName);
  if (view) view.style.display = 'block';

  // Update tab buttons
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById('tab-' + tabName)?.classList.add('active');

  // Clear messages
  clearAlert();
}

/**
 * Toggle password visibility
 */
function togglePw(inputId, button) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    button.textContent = '🙈';
  } else {
    input.type = 'password';
    button.textContent = '👁';
  }
}

/**
 * Show error/success alert
 */
function showAlert(message, type = 'error', duration = 5000) {
  const alertEl = document.getElementById('auth-alert');
  if (!alertEl) return;

  alertEl.className = `auth-alert ${type} show`;
  alertEl.textContent = message;

  if (type === 'success') {
    // Keep success longer or until user navigates
    return;
  }

  if (duration > 0) {
    setTimeout(clearAlert, duration);
  }
}

/**
 * Clear alert
 */
function clearAlert() {
  const alertEl = document.getElementById('auth-alert');
  if (alertEl) {
    alertEl.classList.remove('show');
    alertEl.className = 'auth-alert';
  }
}

/**
 * Set button loading state
 */
function setButtonLoading(buttonId, isLoading) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  if (isLoading) {
    btn.classList.add('loading');
    btn.disabled = true;
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

/**
 * Format field error
 */
function getFieldErrorId(fieldId) {
  return fieldId + '-err';
}

/**
 * Show field error
 */
function showFieldError(fieldId) {
  const errorEl = document.getElementById(getFieldErrorId(fieldId));
  const inputEl = document.getElementById(fieldId);
  if (errorEl) errorEl.classList.add('show');
  if (inputEl) inputEl.classList.add('error');
}

/**
 * Clear field error
 */
function clearFieldError(fieldId) {
  const errorEl = document.getElementById(getFieldErrorId(fieldId));
  const inputEl = document.getElementById(fieldId);
  if (errorEl) errorEl.classList.remove('show');
  if (inputEl) inputEl.classList.remove('error');
}

/**
 * Show forgot password view
 */
function showForgot(event) {
  event.preventDefault();
  const views = document.querySelectorAll('[id^="view-"]');
  views.forEach(v => v.style.display = 'none');
  
  const view = document.getElementById('view-forgot');
  if (view) view.style.display = 'block';

  // Update tab visual state
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  clearAlert();
}

/**
 * Handle sign in
 */
async function handleSignIn() {
  clearAlert();

  // Get form values
  const email = document.getElementById('si-email')?.value.trim();
  const password = document.getElementById('si-pass')?.value;

  // Validate
  let hasError = false;

  if (!Auth.validateEmail(email)) {
    showFieldError('si-email');
    hasError = true;
  } else {
    clearFieldError('si-email');
  }

  if (!password) {
    showFieldError('si-pass');
    hasError = true;
  } else {
    clearFieldError('si-pass');
  }

  if (hasError) return;

  // Attempt sign in
  setButtonLoading('btn-signin', true);

  try {
    const session = await Auth.signIn(email, password);
    
    showAlert('✓ Signed in successfully!', 'success');

    // Redirect after short delay
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 800);
  } catch (error) {
    showAlert(error.message || 'Sign in failed. Please try again.', 'error');
  } finally {
    setButtonLoading('btn-signin', false);
  }
}

/**
 * Handle sign up
 */
async function handleSignUp() {
  clearAlert();

  // Get form values
  const firstName = document.getElementById('su-first')?.value.trim();
  const lastName = document.getElementById('su-last')?.value.trim();
  const email = document.getElementById('su-email')?.value.trim();
  const province = document.getElementById('su-province')?.value;
  const password = document.getElementById('su-pass')?.value;

  // Validate
  let hasError = false;

  if (!firstName) {
    showFieldError('su-first');
    hasError = true;
  } else {
    clearFieldError('su-first');
  }

  if (!lastName) {
    showFieldError('su-last');
    hasError = true;
  } else {
    clearFieldError('su-last');
  }

  if (!Auth.validateEmail(email)) {
    showFieldError('su-email');
    hasError = true;
  } else {
    clearFieldError('su-email');
  }

  if (!province) {
    showFieldError('su-province');
    hasError = true;
  } else {
    clearFieldError('su-province');
  }

  if (!Auth.validatePassword(password)) {
    showFieldError('su-pass');
    hasError = true;
  } else {
    clearFieldError('su-pass');
  }

  if (hasError) return;

  // Attempt sign up
  setButtonLoading('btn-signup', true);

  try {
    const session = await Auth.signUp({
      firstName,
      lastName,
      email,
      province,
      password,
    });

    showAlert('✓ Account created successfully!', 'success');

    // Redirect after short delay
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  } catch (error) {
    showAlert(error.message || 'Sign up failed. Please try again.', 'error');
  } finally {
    setButtonLoading('btn-signup', false);
  }
}

/**
 * Handle forgot password
 */
async function handleForgot() {
  clearAlert();

  const email = document.getElementById('fp-email')?.value.trim();

  if (!Auth.validateEmail(email)) {
    showFieldError('fp-email');
    return;
  } else {
    clearFieldError('fp-email');
  }

  const btn = document.querySelector('#view-forgot .auth-submit');
  setButtonLoading(btn.id || 'btn-forgot', true);

  try {
    const result = await Auth.requestPasswordReset(email);
    showAlert(result.message, 'success');
    
    // Show instruction
    setTimeout(() => {
      showTab('signin');
    }, 3000);
  } catch (error) {
    showAlert(error.message || 'Request failed. Please try again.', 'error');
  } finally {
    setButtonLoading(btn.id || 'btn-forgot', false);
  }
}

/**
 * Handle OAuth sign in (placeholder)
 */
async function handleOAuth(provider) {
  console.log('OAuth sign in with', provider);
  
  // Placeholder: In production, this would redirect to OAuth provider
  showAlert(`${provider} sign-in is not configured yet.`, 'error', 3000);

  // Example implementation:
  // if (provider === 'Google') {
  //   window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?...';
  // } else if (provider === 'Apple') {
  //   appleid.auth.init({...});
  // }
}

/**
 * Redirect authenticated users away from auth page
 */
function redirectIfAuthenticated() {
  if (Auth.isAuthenticated()) {
    window.location.href = 'dashboard.html';
  }
}

/**
 * Initialize on page load
 */
function initAuth() {
  // Redirect if already logged in
  redirectIfAuthenticated();

  // Check if nav should show dashboard link
  const user = Auth.getCurrentUser();
  if (user) {
    document.getElementById('nav-dashboard')?.style.removeProperty('display');
    document.getElementById('drawer-dashboard')?.style.removeProperty('display');
  }

  // Add keyboard support
  document.getElementById('form-signin')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSignIn();
    }
  });

  document.getElementById('form-signup')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSignUp();
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}

// Simple logging function
const log = (...args) => {
  console.log('[Farm Copilot Auth]', ...args);
};
