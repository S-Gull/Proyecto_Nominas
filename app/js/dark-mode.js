class ThemeToggle_vc_ga {
  constructor() {
    this.btnColorModo_vc_ga = document.getElementById("cambio-color");
    this.icon_vc_ga = this.btnColorModo_vc_ga.querySelector('i');
    this.currentTheme_vc_ga = null;
    this.mediaQuery_vc_ga = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Bindear métodos para mantener el contexto
    this.handleSystemThemeChange_vc_ga = this.handleSystemThemeChange_vc_ga.bind(this);
    this.toggleTheme_vc_ga = this.toggleTheme_vc_ga.bind(this);
  }

  getSystemTheme_vc_ga() {
    return this.mediaQuery_vc_ga.matches ? 'dark' : 'light';
  }

  applyTheme_vc_ga(theme_vc_ga) {
    document.documentElement.classList.toggle('dark', theme_vc_ga === 'dark');
    
    this.icon_vc_ga.classList.replace(
      theme_vc_ga === 'dark' ? 'fa-sun' : 'fa-moon',
      theme_vc_ga === 'dark' ? 'fa-moon' : 'fa-sun'
    );
  }

  saveThemePreference_vc_ga(theme_vc_ga) {
    localStorage.setItem('themePreference_vc_ga', theme_vc_ga);
  }

  loadTheme_vc_ga() {
    const savedTheme_vc_ga = localStorage.getItem('themePreference_vc_ga');
    const systemTheme_vc_ga = this.getSystemTheme_vc_ga();
    const themeToApply_vc_ga = savedTheme_vc_ga || systemTheme_vc_ga;
    
    this.applyTheme_vc_ga(themeToApply_vc_ga);
    return themeToApply_vc_ga;
  }

  handleSystemThemeChange_vc_ga(e_vc_ga) {
    const newTheme_vc_ga = e_vc_ga.matches ? 'dark' : 'light';
    
    if (!localStorage.getItem('themePreference_vc_ga')) {
      this.applyTheme_vc_ga(newTheme_vc_ga);
    } else {
      const currentSavedTheme_vc_ga = localStorage.getItem('themePreference_vc_ga');
      if (currentSavedTheme_vc_ga === this.getSystemTheme_vc_ga()) {
        this.saveThemePreference_vc_ga(newTheme_vc_ga);
      }
    }
  }

  toggleTheme_vc_ga() {
    this.currentTheme_vc_ga = this.currentTheme_vc_ga === 'dark' ? 'light' : 'dark';
    this.applyTheme_vc_ga(this.currentTheme_vc_ga);
    this.saveThemePreference_vc_ga(this.currentTheme_vc_ga);
  }

  init_vc_ga() {
    this.mediaQuery_vc_ga.addEventListener('change', this.handleSystemThemeChange_vc_ga);
    this.currentTheme_vc_ga = this.loadTheme_vc_ga();
    this.btnColorModo_vc_ga.addEventListener('click', this.toggleTheme_vc_ga);
  }
}

// Función simple para mantener la misma interfaz
const setupThemeToggle_vc_ga = () => {
  const themeToggle_vc_ga = new ThemeToggle_vc_ga();
  themeToggle_vc_ga.init_vc_ga();
};

module.exports = { setupThemeToggle_vc_ga };
