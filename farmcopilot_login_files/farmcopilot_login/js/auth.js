(function () {
  const config = window.FARM_COPILOT_CONFIG || {};
  const configError = window.FARM_COPILOT_CONFIG_ERROR;

  const msgEl = document.getElementById('auth-msg');
  const authWrap = document.getElementById('auth-form-wrap');
  const sessionCard = document.getElementById('session-card');
  const sessionName = document.getElementById('session-name');
  const sessionEmail = document.getElementById('session-email');

  function showMsg(text, type) {
    msgEl.textContent = text;
    msgEl.className = 'auth-msg ' + (type || 'error');
    msgEl.style.display = 'block';
  }

  function hideMsg() {
    msgEl.style.display = 'none';
  }

  function setLoading(buttonId, loading, idleText) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? 'Please wait…' : idleText;
  }

  function setTab(tab) {
    document.getElementById('tab-signin').style.display = tab === 'signin' ? '' : 'none';
    document.getElementById('tab-signup').style.display = tab === 'signup' ? '' : 'none';
    document.querySelectorAll('.auth-tab').forEach((button) => {
      button.classList.toggle('active', button.dataset.tab === tab);
    });
    hideMsg();
  }

  document.querySelectorAll('.auth-tab').forEach((button) => {
    button.addEventListener('click', function () {
      setTab(button.dataset.tab);
    });
  });

  if (configError) {
    showMsg(configError + '. Update js/supabase-config.js before deploying.', 'error');
    return;
  }

  if (!window.supabase || !window.supabase.createClient) {
    showMsg('Supabase library failed to load.', 'error');
    return;
  }

  const sb = window.supabase.createClient(config.supabaseUrl, config.supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  function persistUser(user) {
    localStorage.setItem('sb_user', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Farmer'
    }));
  }

  function clearUser() {
    localStorage.removeItem('sb_user');
  }

  function showSession(user) {
    persistUser(user);
    authWrap.style.display = 'none';
    sessionCard.style.display = '';
    sessionEmail.textContent = user.email || '';
    sessionName.textContent = user.user_metadata?.full_name || 'Welcome back';
  }

  function showAuthForm() {
    sessionCard.style.display = 'none';
    authWrap.style.display = '';
  }

  async function handleSignIn() {
    hideMsg();
    const email = document.getElementById('si-email').value.trim();
    const password = document.getElementById('si-password').value;

    if (!email || !password) {
      showMsg('Please enter your email and password.', 'error');
      return;
    }

    setLoading('btn-signin', true, 'Sign In →');
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    setLoading('btn-signin', false, 'Sign In →');

    if (error) {
      showMsg(error.message, 'error');
      return;
    }

    if (data && data.user) {
      showSession(data.user);
      window.location.href = config.postLoginRedirect;
    }
  }

  async function handleSignUp() {
    hideMsg();
    const name = document.getElementById('su-name').value.trim();
    const email = document.getElementById('su-email').value.trim();
    const password = document.getElementById('su-password').value;

    if (!name || !email || !password) {
      showMsg('Please fill in all fields.', 'error');
      return;
    }

    if (password.length < 8) {
      showMsg('Password must be at least 8 characters.', 'error');
      return;
    }

    setLoading('btn-signup', true, 'Create Account →');
    const { error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: config.redirectTo
      }
    });
    setLoading('btn-signup', false, 'Create Account →');

    if (error) {
      showMsg(error.message, 'error');
      return;
    }

    showMsg('Account created. Check your email to confirm, then sign in.', 'success');
    setTab('signin');
    document.getElementById('si-email').value = email;
  }

  async function handleGoogle() {
    hideMsg();
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: config.postLoginRedirect
      }
    });

    if (error) {
      showMsg(error.message, 'error');
    }
  }

  async function handleResetPassword() {
    hideMsg();
    const email = document.getElementById('si-email').value.trim();

    if (!email) {
      showMsg('Enter your email above first, then click Forgot password.', 'info');
      return;
    }

    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: config.redirectTo
    });

    if (error) {
      showMsg(error.message, 'error');
      return;
    }

    showMsg('Password reset email sent. Check your inbox.', 'success');
  }

  async function handleSignOut() {
    await sb.auth.signOut();
    clearUser();
    showAuthForm();
    showMsg('You have been signed out.', 'info');
  }

  document.getElementById('btn-signin').addEventListener('click', handleSignIn);
  document.getElementById('btn-signup').addEventListener('click', handleSignUp);
  document.getElementById('btn-google-signin').addEventListener('click', handleGoogle);
  document.getElementById('btn-google-signup').addEventListener('click', handleGoogle);
  document.getElementById('forgot-link').addEventListener('click', handleResetPassword);
  document.getElementById('btn-signout').addEventListener('click', handleSignOut);

  document.getElementById('si-password').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleSignIn();
  });
  document.getElementById('su-password').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleSignUp();
  });

  sb.auth.onAuthStateChange(function (event, session) {
    if (event === 'SIGNED_IN' && session?.user) {
      showSession(session.user);
    }

    if (event === 'SIGNED_OUT') {
      clearUser();
      showAuthForm();
    }
  });

  (async function init() {
    try {
      const { data, error } = await sb.auth.getSession();
      if (error) {
        showMsg(error.message, 'error');
        return;
      }
      if (data?.session?.user) {
        showSession(data.session.user);
      }
    } catch (err) {
      showMsg(err.message || 'Unable to initialize login.', 'error');
    }
  })();
})();
