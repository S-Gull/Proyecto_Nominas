class ThemeToggle {
  constructor() {
    this.btnColorModo = document.getElementById("cambio-color");
    this.icon = this.btnColorModo.querySelector('i');
    this.currentTheme = null;
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Bindear métodos para mantener el contexto
    this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
  }

  getSystemTheme() {
    return this.mediaQuery.matches ? 'dark' : 'light';
  }

  applyTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    this.icon.classList.replace(
      theme === 'dark' ? 'fa-sun' : 'fa-moon',
      theme === 'dark' ? 'fa-moon' : 'fa-sun'
    );
  }

  saveThemePreference(theme) {
    localStorage.setItem('themePreference', theme);
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('themePreference');
    const systemTheme = this.getSystemTheme();
    const themeToApply = savedTheme || systemTheme;
    
    this.applyTheme(themeToApply);
    return themeToApply;
  }

  handleSystemThemeChange(e) {
    const newTheme = e.matches ? 'dark' : 'light';
    
    if (!localStorage.getItem('themePreference')) {
      this.applyTheme(newTheme);
    } else {
      const currentSavedTheme = localStorage.getItem('themePreference');
      if (currentSavedTheme === this.getSystemTheme()) {
        this.saveThemePreference(newTheme);
      }
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.currentTheme);
    this.saveThemePreference(this.currentTheme);
  }

  init() {
    this.mediaQuery.addEventListener('change', this.handleSystemThemeChange);
    this.currentTheme = this.loadTheme();
    this.btnColorModo.addEventListener('click', this.toggleTheme);
  }
}

// Función simple para mantener la misma interfaz
const setupThemeToggle_vc_ga = () => {
  const themeToggle = new ThemeToggle();
  themeToggle.init();
};

module.exports = { setupThemeToggle_vc_ga };