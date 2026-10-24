import { ColorThemePreset, SystemSettings } from '../types';

export interface ThemeConfig {
  id: ColorThemePreset;
  name: string;
  description: string;
  primary: string;
  hover: string;
  lightBg: string;
  textLight: string;
  border: string;
  previewColor: string;
}

export const THEME_PRESETS: Record<Exclude<ColorThemePreset, 'custom'>, ThemeConfig> = {
  cyan: {
    id: 'cyan',
    name: 'Ciano Tecnológico (Padrão)',
    description: 'Estilo high-tech SEINFRA com alto contraste em modo escuro',
    primary: '#0891b2',
    hover: '#0e7490',
    lightBg: 'rgba(6, 182, 212, 0.15)',
    textLight: '#22d3ee',
    border: 'rgba(6, 182, 212, 0.35)',
    previewColor: '#06b6d4'
  },
  blue: {
    id: 'blue',
    name: 'Azul Corporativo / Governamental',
    description: 'Tom institucional sóbrio para órgãos públicos e corporações',
    primary: '#2563eb',
    hover: '#1d4ed8',
    lightBg: 'rgba(37, 99, 235, 0.15)',
    textLight: '#60a5fa',
    border: 'rgba(37, 99, 235, 0.35)',
    previewColor: '#3b82f6'
  },
  emerald: {
    id: 'emerald',
    name: 'Verde Esmeralda Sustentável',
    description: 'Foco em fiscalização ambiental, eficiência e conformidade',
    primary: '#059669',
    hover: '#047857',
    lightBg: 'rgba(5, 150, 105, 0.15)',
    textLight: '#34d399',
    border: 'rgba(5, 150, 105, 0.35)',
    previewColor: '#10b981'
  },
  amber: {
    id: 'amber',
    name: 'Âmbar Operacional / Logística',
    description: 'Visual vibrante para almoxarifado, campo e operações de alerta',
    primary: '#d97706',
    hover: '#b45309',
    lightBg: 'rgba(217, 119, 6, 0.15)',
    textLight: '#fbbf24',
    border: 'rgba(217, 119, 6, 0.35)',
    previewColor: '#f59e0b'
  },
  purple: {
    id: 'purple',
    name: 'Roxo Deep Tech / Inovação',
    description: 'Elegante e moderno para centros de P&D e tecnologia avançada',
    primary: '#7c3aed',
    hover: '#6d28d9',
    lightBg: 'rgba(124, 58, 237, 0.15)',
    textLight: '#a78bfa',
    border: 'rgba(124, 58, 237, 0.35)',
    previewColor: '#8b5cf6'
  },
  slate: {
    id: 'slate',
    name: 'Dark Titanium / Minimalista',
    description: 'Paleta monocromática neutra com acabamento industrial',
    primary: '#475569',
    hover: '#334155',
    lightBg: 'rgba(100, 116, 139, 0.15)',
    textLight: '#94a3b8',
    border: 'rgba(100, 116, 139, 0.35)',
    previewColor: '#64748b'
  }
};

/**
 * Apply theme variables to root document
 */
export function applySystemTheme(settings: SystemSettings): void {
  const root = document.documentElement;
  const themePreset = settings.colorTheme || 'cyan';

  let primary = '#0891b2';
  let hover = '#0e7490';
  let lightBg = 'rgba(6, 182, 212, 0.15)';
  let textLight = '#22d3ee';
  let border = 'rgba(6, 182, 212, 0.35)';

  if (themePreset === 'custom' && settings.customPrimaryColor) {
    primary = settings.customPrimaryColor;
    hover = adjustBrightness(settings.customPrimaryColor, -15);
    lightBg = hexToRgba(settings.customPrimaryColor, 0.15);
    textLight = adjustBrightness(settings.customPrimaryColor, 20);
    border = hexToRgba(settings.customPrimaryColor, 0.35);
  } else if (THEME_PRESETS[themePreset as Exclude<ColorThemePreset, 'custom'>]) {
    const preset = THEME_PRESETS[themePreset as Exclude<ColorThemePreset, 'custom'>];
    primary = preset.primary;
    hover = preset.hover;
    lightBg = preset.lightBg;
    textLight = preset.textLight;
    border = preset.border;
  }

  root.style.setProperty('--theme-primary', primary);
  root.style.setProperty('--theme-hover', hover);
  root.style.setProperty('--theme-light', lightBg);
  root.style.setProperty('--theme-text', textLight);
  root.style.setProperty('--theme-border', border);
  
  // Set theme data attribute for CSS selectors
  root.setAttribute('data-theme', themePreset);
}

function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return `rgba(6, 182, 212, ${alpha})`;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function adjustBrightness(hex: string, percent: number): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return hex;
  let r = parseInt(cleanHex.substring(0, 2), 16);
  let g = parseInt(cleanHex.substring(2, 4), 16);
  let b = parseInt(cleanHex.substring(4, 6), 16);

  r = Math.min(255, Math.max(0, Math.round(r + (r * percent) / 100)));
  g = Math.min(255, Math.max(0, Math.round(g + (g * percent) / 100)));
  b = Math.min(255, Math.max(0, Math.round(b + (b * percent) / 100)));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
