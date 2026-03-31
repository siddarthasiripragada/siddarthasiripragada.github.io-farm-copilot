(function () {
  const config = {
    supabaseUrl: 'https://gxzdsgfwdwnixupvmisa.supabase.co',
    supabaseKey: 'REPLACE_WITH_FULL_SUPABASE_PUBLISHABLE_KEY',
    redirectTo: window.location.origin + '/auth.html',
    postLoginRedirect: window.location.origin + '/dashboard.html'
  };

  const missing = [];
  if (!config.supabaseUrl) missing.push('supabaseUrl');
  if (!config.supabaseKey || config.supabaseKey.includes('REPLACE_WITH_FULL')) missing.push('supabaseKey');

  window.FARM_COPILOT_CONFIG = config;
  window.FARM_COPILOT_CONFIG_ERROR = missing.length
    ? 'Missing config values: ' + missing.join(', ')
    : null;
})();
