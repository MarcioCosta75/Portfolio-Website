document.getElementById('theme-switch').addEventListener('click', function() {
    document.body.classList.toggle('light-mode');
    this.innerHTML = document.body.classList.contains('light-mode') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

document.getElementById('lang-switch').addEventListener('click', function() {
    const lang = document.documentElement.lang === 'en' ? 'pt' : 'en';
    document.documentElement.lang = lang;
    this.innerHTML = lang === 'en' ? '<img src="static/icons/flag-pt.png" alt="PT">' : '<img src="static/icons/gb.png" alt="EN">';
    switchLanguage();
});

function switchLanguage() {
    const lang = document.documentElement.lang;
    document.querySelectorAll('[data-lang-en]').forEach(element => {
        element.textContent = lang === 'en' ? element.getAttribute('data-lang-en') : element.getAttribute('data-lang-pt');
    });
}
