(function () {
  if (!localStorage.getItem('sb_user')) {
    window.location.href = 'auth.html';
  }
})();
