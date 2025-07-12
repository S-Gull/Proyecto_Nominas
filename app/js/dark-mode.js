const setupThemeToggle_vc_ga = () => {
    const btnColorModo_vc_ga = document.getElementById("cambio-color");
    const icon_vc_ga = btnColorModo_vc_ga.querySelector('i');
    
    // Detectar tema del sistema
    const getSystemTheme_vc_ga = () => 
        window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    // Aplicar tema visual
    const applyTheme_vc_ga = (theme_vc_ga) => {
        document.documentElement.classList.toggle('dark', theme_vc_ga === 'dark');
        
        icon_vc_ga.classList.replace(
            theme_vc_ga === 'dark' ? 'fa-sun' : 'fa-moon',
            theme_vc_ga === 'dark' ? 'fa-moon' : 'fa-sun'
        );
    };
    
    // Guardar preferencia
    const saveThemePreference_vc_ga = (theme_vc_ga) => 
        localStorage.setItem('themePreference_vc_ga', theme_vc_ga);
    
    // Cargar tema guardado o del sistema
    const loadTheme_vc_ga = () => {
        const savedTheme_vc_ga = localStorage.getItem('themePreference_vc_ga');
        const systemTheme_vc_ga = getSystemTheme_vc_ga();
        const themeToApply_vc_ga = savedTheme_vc_ga || systemTheme_vc_ga;
        
        applyTheme_vc_ga(themeToApply_vc_ga);
        return themeToApply_vc_ga;
    };
    
    // Escuchar cambios del sistema
    const mediaQuery_vc_ga = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange_vc_ga = (e_vc_ga) => {
        if (!localStorage.getItem('themePreference_vc_ga')) {
            applyTheme_vc_ga(e_vc_ga.matches ? 'dark' : 'light');
        }
    };
    mediaQuery_vc_ga.addEventListener('change', handleSystemThemeChange_vc_ga);
    
    // Inicializar
    let currentTheme_vc_ga = loadTheme_vc_ga();
    // Evento click
    btnColorModo_vc_ga.addEventListener('click', () => {
        currentTheme_vc_ga = currentTheme_vc_ga === 'dark' ? 'light' : 'dark';
        applyTheme_vc_ga(currentTheme_vc_ga);
        saveThemePreference_vc_ga(currentTheme_vc_ga);
    });
};

module.exports = {setupThemeToggle_vc_ga }

