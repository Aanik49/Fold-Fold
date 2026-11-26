export interface RisoPalette {
  newsprint: string;
  newsprintDark: string;
  paperWhite: string;
  paperShaded: string;
  red: string;
  blue: string;
  yellow: string;
  teal: string;
  ink: string;
  isDark: boolean;
  halftoneDark: string;
  halftoneBlue: string;
  halftoneRed: string;
  halftoneTeal: string;
  grainDark: string;
  grainLight: string;
  creaseInk: string;
  regMarkInk: string;
  previewTint: string;
  badgeTextOnRed: string;
  badgeTextOnBlue: string;
  badgeTextOnYellow: string;
  badgeTextOnTeal: string;
  badgeTextOnInk: string;
}

export interface RisoTheme {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  paperStock: string;
  requiredStars: number;
  palette: RisoPalette;
  undersidePalette: [string, string, string, string, string];
}

export const RISO_THEMES: RisoTheme[] = [
  {
    id: 'bauhaus',
    code: 'INK-01',
    name: 'Bauhaus Archival',
    subtitle: 'Weimar Newsprint · Signal Red & Cobalt',
    paperStock: '120gsm Uncoated Newsprint',
    requiredStars: 0,
    palette: {
      newsprint: '#F2EFE9',
      newsprintDark: '#E5E0D5',
      paperWhite: '#FAF8F5',
      paperShaded: '#EFECE4',
      red: '#E63946',
      blue: '#1D3557',
      yellow: '#F4A261',
      teal: '#1E6B5C',
      ink: '#141414',
      isDark: false,
      halftoneDark: 'rgba(20, 20, 20, 0.34)',
      halftoneBlue: 'rgba(29, 53, 87, 0.42)',
      halftoneRed: 'rgba(230, 57, 70, 0.42)',
      halftoneTeal: 'rgba(30, 107, 92, 0.42)',
      grainDark: 'rgba(20, 20, 20, 0.035)',
      grainLight: 'rgba(255, 255, 255, 0.045)',
      creaseInk: 'rgba(20, 20, 20, 0.34)',
      regMarkInk: 'rgba(20, 20, 20, 0.32)',
      previewTint: 'rgba(29, 53, 87, 0.11)',
      badgeTextOnRed: '#FAF8F5',
      badgeTextOnBlue: '#FAF8F5',
      badgeTextOnYellow: '#141414',
      badgeTextOnTeal: '#FAF8F5',
      badgeTextOnInk: '#FAF8F5',
    },
    undersidePalette: ['#1D3557', '#E63946', '#F4A261', '#1E6B5C', '#2B2D42'],
  },
  {
    id: 'kraft',
    code: 'INK-02',
    name: 'Kraft Cardboard',
    subtitle: 'Recycled Parcel Stock · Crimson & Espresso',
    paperStock: '240gsm Raw Kraft Board',
    requiredStars: 6,
    palette: {
      newsprint: '#D8BD96',
      newsprintDark: '#C4A57B',
      paperWhite: '#EBD9BC',
      paperShaded: '#E0C9A4',
      red: '#C1292E',
      blue: '#264653',
      yellow: '#E69F1E',
      teal: '#257055',
      ink: '#241812',
      isDark: false,
      halftoneDark: 'rgba(36, 24, 18, 0.34)',
      halftoneBlue: 'rgba(38, 70, 83, 0.42)',
      halftoneRed: 'rgba(193, 41, 46, 0.42)',
      halftoneTeal: 'rgba(37, 112, 85, 0.42)',
      grainDark: 'rgba(54, 34, 18, 0.055)',
      grainLight: 'rgba(255, 246, 224, 0.06)',
      creaseInk: 'rgba(36, 24, 18, 0.38)',
      regMarkInk: 'rgba(36, 24, 18, 0.38)',
      previewTint: 'rgba(38, 70, 83, 0.13)',
      badgeTextOnRed: '#FBF5EC',
      badgeTextOnBlue: '#FBF5EC',
      badgeTextOnYellow: '#241812',
      badgeTextOnTeal: '#FBF5EC',
      badgeTextOnInk: '#FBF5EC',
    },
    undersidePalette: ['#264653', '#C1292E', '#E69F1E', '#257055', '#422B1F'],
  },
  {
    id: 'kyoto',
    code: 'INK-03',
    name: 'Kyoto Matcha & Vermilion',
    subtitle: 'Washi Tea Paper · Torii Red & Aizome Indigo',
    paperStock: '140gsm Textured Matcha Washi',
    requiredStars: 15,
    palette: {
      newsprint: '#E1E8D5',
      newsprintDark: '#CDD8BC',
      paperWhite: '#F3F6EB',
      paperShaded: '#E6ECD8',
      red: '#D9381E',
      blue: '#1E3A5F',
      yellow: '#E59534',
      teal: '#2E6F40',
      ink: '#1A2418',
      isDark: false,
      halftoneDark: 'rgba(26, 36, 24, 0.32)',
      halftoneBlue: 'rgba(30, 58, 95, 0.42)',
      halftoneRed: 'rgba(217, 56, 30, 0.42)',
      halftoneTeal: 'rgba(46, 111, 64, 0.42)',
      grainDark: 'rgba(26, 36, 24, 0.04)',
      grainLight: 'rgba(255, 255, 245, 0.06)',
      creaseInk: 'rgba(26, 36, 24, 0.34)',
      regMarkInk: 'rgba(26, 36, 24, 0.34)',
      previewTint: 'rgba(30, 58, 95, 0.12)',
      badgeTextOnRed: '#F3F6EB',
      badgeTextOnBlue: '#F3F6EB',
      badgeTextOnYellow: '#1A2418',
      badgeTextOnTeal: '#F3F6EB',
      badgeTextOnInk: '#F3F6EB',
    },
    undersidePalette: ['#1E3A5F', '#D9381E', '#E59534', '#2E6F40', '#2E3D29'],
  },
  {
    id: 'cyanotype',
    code: 'INK-04',
    name: 'Blueprint Cyanotype',
    subtitle: 'Prussian Sun-Print · Chalk White & Coral Ink',
    paperStock: '180gsm Ferric Cyanotype Rag',
    requiredStars: 30,
    palette: {
      newsprint: '#0F2E54',
      newsprintDark: '#0A213D',
      paperWhite: '#184273',
      paperShaded: '#133660',
      red: '#FF5C63',
      blue: '#66E3E3',
      yellow: '#FFD166',
      teal: '#72F1B8',
      ink: '#F0F6FC',
      isDark: true,
      halftoneDark: 'rgba(4, 12, 26, 0.56)',
      halftoneBlue: 'rgba(102, 227, 227, 0.38)',
      halftoneRed: 'rgba(255, 92, 99, 0.42)',
      halftoneTeal: 'rgba(114, 241, 184, 0.38)',
      grainDark: 'rgba(4, 12, 26, 0.09)',
      grainLight: 'rgba(240, 246, 252, 0.055)',
      creaseInk: 'rgba(240, 246, 252, 0.44)',
      regMarkInk: 'rgba(240, 246, 252, 0.46)',
      previewTint: 'rgba(102, 227, 227, 0.18)',
      badgeTextOnRed: '#0A213D',
      badgeTextOnBlue: '#0A213D',
      badgeTextOnYellow: '#0A213D',
      badgeTextOnTeal: '#0A213D',
      badgeTextOnInk: '#0A213D',
    },
    undersidePalette: ['#0B2342', '#FF5C63', '#FFD166', '#215A99', '#103B66'],
  },
  {
    id: 'sakura',
    code: 'INK-05',
    name: 'Sakura Risograph',
    subtitle: 'Blush Cotton Stock · Fluo Rose & Ultramarine',
    paperStock: '150gsm Blossom Cotton Vellum',
    requiredStars: 50,
    palette: {
      newsprint: '#F4DFDF',
      newsprintDark: '#E6C6C7',
      paperWhite: '#FDF5F5',
      paperShaded: '#F5E6E7',
      red: '#E11D48',
      blue: '#2541B2',
      yellow: '#F59E0B',
      teal: '#0D9488',
      ink: '#26131C',
      isDark: false,
      halftoneDark: 'rgba(38, 19, 28, 0.3)',
      halftoneBlue: 'rgba(37, 65, 178, 0.4)',
      halftoneRed: 'rgba(225, 29, 72, 0.4)',
      halftoneTeal: 'rgba(13, 148, 136, 0.4)',
      grainDark: 'rgba(38, 19, 28, 0.035)',
      grainLight: 'rgba(255, 255, 255, 0.06)',
      creaseInk: 'rgba(38, 19, 28, 0.32)',
      regMarkInk: 'rgba(38, 19, 28, 0.34)',
      previewTint: 'rgba(37, 65, 178, 0.12)',
      badgeTextOnRed: '#FDF5F5',
      badgeTextOnBlue: '#FDF5F5',
      badgeTextOnYellow: '#26131C',
      badgeTextOnTeal: '#FDF5F5',
      badgeTextOnInk: '#FDF5F5',
    },
    undersidePalette: ['#2541B2', '#E11D48', '#F59E0B', '#0D9488', '#4A1D33'],
  },
  {
    id: 'nocturne',
    code: 'INK-06',
    name: 'Nocturne Gold Foil',
    subtitle: 'Obsidian Cardstock · Hot-Stamped Gold & Lacquer',
    paperStock: '300gsm Matte Obsidian Foil',
    requiredStars: 80,
    palette: {
      newsprint: '#13151B',
      newsprintDark: '#0A0B0F',
      paperWhite: '#1E212B',
      paperShaded: '#181B24',
      red: '#FF4D5A',
      blue: '#4EA8DE',
      yellow: '#F2C14E',
      teal: '#2EC4B6',
      ink: '#F3D999',
      isDark: true,
      halftoneDark: 'rgba(0, 0, 0, 0.65)',
      halftoneBlue: 'rgba(78, 168, 222, 0.4)',
      halftoneRed: 'rgba(255, 77, 90, 0.42)',
      halftoneTeal: 'rgba(46, 196, 182, 0.4)',
      grainDark: 'rgba(0, 0, 0, 0.12)',
      grainLight: 'rgba(243, 217, 153, 0.045)',
      creaseInk: 'rgba(243, 217, 153, 0.42)',
      regMarkInk: 'rgba(243, 217, 153, 0.45)',
      previewTint: 'rgba(242, 193, 78, 0.16)',
      badgeTextOnRed: '#13151B',
      badgeTextOnBlue: '#13151B',
      badgeTextOnYellow: '#13151B',
      badgeTextOnTeal: '#13151B',
      badgeTextOnInk: '#13151B',
    },
    undersidePalette: ['#4EA8DE', '#FF4D5A', '#F2C14E', '#2EC4B6', '#332A18'],
  },
];

let currentTheme: RisoTheme = RISO_THEMES[0];

export function getThemeById(id: string): RisoTheme {
  return RISO_THEMES.find((t) => t.id === id) ?? RISO_THEMES[0];
}

export function getActiveTheme(): RisoTheme {
  return currentTheme;
}

export function getActivePalette(): RisoPalette {
  return currentTheme.palette;
}

export function isThemeUnlocked(theme: RisoTheme, totalStars: number): boolean {
  return totalStars >= theme.requiredStars;
}

export function getUnlockedThemes(totalStars: number): RisoTheme[] {
  return RISO_THEMES.filter((t) => totalStars >= t.requiredStars);
}

export function getNextLockedTheme(totalStars: number): RisoTheme | null {
  return RISO_THEMES.find((t) => totalStars < t.requiredStars) ?? null;
}

/**
 * Applies the selected Risograph Paper & Ink theme globally to CSS variables
 * and updates the module-level active theme for Canvas 2D and Share Card rendering.
 */
export function applyRisoTheme(themeId: string): RisoTheme {
  const theme = getThemeById(themeId);
  currentTheme = theme;

  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    const p = theme.palette;
    root.style.setProperty('--newsprint', p.newsprint);
    root.style.setProperty('--newsprint-dark', p.newsprintDark);
    root.style.setProperty('--paper-white', p.paperWhite);
    root.style.setProperty('--paper-shaded', p.paperShaded);
    root.style.setProperty('--signal-red', p.red);
    root.style.setProperty('--cobalt-blue', p.blue);
    root.style.setProperty('--mustard-yellow', p.yellow);
    root.style.setProperty('--riso-teal', p.teal);
    root.style.setProperty('--charcoal-ink', p.ink);
    root.style.setProperty('--on-red', p.badgeTextOnRed);
    root.style.setProperty('--on-blue', p.badgeTextOnBlue);
    root.style.setProperty('--on-yellow', p.badgeTextOnYellow);
    root.style.setProperty('--on-teal', p.badgeTextOnTeal);
    root.style.setProperty('--on-ink', p.badgeTextOnInk);
    root.style.setProperty(
      '--grain-dot',
      p.isDark ? 'rgba(243, 217, 153, 0.11)' : 'rgba(20, 20, 20, 0.08)'
    );
    root.dataset.theme = theme.id;
    root.dataset.themeMode = p.isDark ? 'dark' : 'light';
  }

  return theme;
}
