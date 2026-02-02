import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('primaryColor') || 'blue';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const [sidebarPosition, setSidebarPosition] = useState(() => {
    return localStorage.getItem('sidebarPosition') || 'left';
  });

  const [density, setDensity] = useState(() => {
    return localStorage.getItem('density') || 'normal';
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || 'medium';
  });

  const [animations, setAnimations] = useState(() => {
    const saved = localStorage.getItem('animations');
    return saved ? JSON.parse(saved) : true;
  });

  const [roundedCorners, setRoundedCorners] = useState(() => {
    const saved = localStorage.getItem('roundedCorners');
    return saved ? JSON.parse(saved) : true;
  });

  const colorPalette = {
    blue: {
      primary: '#3b82f6',
      primaryDark: '#2563eb',
      primaryLight: '#60a5fa',
      gradient: 'from-blue-600 to-indigo-600'
    },
    green: {
      primary: '#10b981',
      primaryDark: '#059669',
      primaryLight: '#34d399',
      gradient: 'from-green-600 to-emerald-600'
    },
    purple: {
      primary: '#8b5cf6',
      primaryDark: '#7c3aed',
      primaryLight: '#a78bfa',
      gradient: 'from-purple-600 to-violet-600'
    },
    orange: {
      primary: '#f97316',
      primaryDark: '#ea580c',
      primaryLight: '#fb923c',
      gradient: 'from-orange-600 to-amber-600'
    },
    pink: {
      primary: '#ec4899',
      primaryDark: '#db2777',
      primaryLight: '#f472b6',
      gradient: 'from-pink-600 to-rose-600'
    },
    indigo: {
      primary: '#6366f1',
      primaryDark: '#4f46e5',
      primaryLight: '#818cf8',
      gradient: 'from-indigo-600 to-blue-600'
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    const colors = colorPalette[primaryColor];
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-dark', colors.primaryDark);
    root.style.setProperty('--color-primary-light', colors.primaryLight);
    
    localStorage.setItem('theme', theme);
    localStorage.setItem('primaryColor', primaryColor);
  }, [theme, primaryColor]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('sidebarPosition', sidebarPosition);
  }, [sidebarPosition]);

  useEffect(() => {
    localStorage.setItem('density', density);
  }, [density]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('animations', JSON.stringify(animations));
  }, [animations]);

  useEffect(() => {
    localStorage.setItem('roundedCorners', JSON.stringify(roundedCorners));
  }, [roundedCorners]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setLightTheme = () => {
    setTheme('light');
  };

  const setDarkTheme = () => {
    setTheme('dark');
  };

  const setSystemTheme = () => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(systemTheme);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const getPrimaryColor = () => {
    return colorPalette[primaryColor];
  };

  const getThemeClasses = () => {
    const classes = [];
    
    classes.push(`theme-${theme}`);
    classes.push(`color-${primaryColor}`);
    classes.push(`density-${density}`);
    classes.push(`font-${fontSize}`);
    
    if (!animations) classes.push('no-animations');
    if (!roundedCorners) classes.push('no-rounded');
    
    return classes.join(' ');
  };

  const getDensityClasses = () => {
    switch (density) {
      case 'compact':
        return {
          padding: 'p-2',
          gap: 'gap-2',
          text: 'text-sm',
          button: 'px-3 py-1.5'
        };
      case 'comfortable':
        return {
          padding: 'p-4',
          gap: 'gap-4',
          text: 'text-base',
          button: 'px-4 py-2'
        };
      case 'spacious':
        return {
          padding: 'p-6',
          gap: 'gap-6',
          text: 'text-lg',
          button: 'px-6 py-3'
        };
      default:
        return {
          padding: 'p-3',
          gap: 'gap-3',
          text: 'text-base',
          button: 'px-4 py-2'
        };
    }
  };

  const resetToDefaults = () => {
    setTheme('light');
    setPrimaryColor('blue');
    setSidebarCollapsed(false);
    setSidebarPosition('left');
    setDensity('normal');
    setFontSize('medium');
    setAnimations(true);
    setRoundedCorners(true);
  };

  const exportSettings = () => {
    const settings = {
      theme,
      primaryColor,
      sidebarCollapsed,
      sidebarPosition,
      density,
      fontSize,
      animations,
      roundedCorners,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `falcon-academy-settings-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (settings) => {
    if (settings.theme) setTheme(settings.theme);
    if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
    if (settings.sidebarCollapsed !== undefined) setSidebarCollapsed(settings.sidebarCollapsed);
    if (settings.sidebarPosition) setSidebarPosition(settings.sidebarPosition);
    if (settings.density) setDensity(settings.density);
    if (settings.fontSize) setFontSize(settings.fontSize);
    if (settings.animations !== undefined) setAnimations(settings.animations);
    if (settings.roundedCorners !== undefined) setRoundedCorners(settings.roundedCorners);
  };

  const value = {
    theme,
    primaryColor,
    sidebarCollapsed,
    sidebarPosition,
    density,
    fontSize,
    animations,
    roundedCorners,
    colorPalette,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    setPrimaryColor,
    toggleSidebar,
    setSidebarPosition,
    setDensity,
    setFontSize,
    setAnimations,
    setRoundedCorners,
    getPrimaryColor,
    getThemeClasses,
    getDensityClasses,
    resetToDefaults,
    exportSettings,
    importSettings
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;