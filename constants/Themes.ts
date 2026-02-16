
export type { ThemeId } from "./Types";

export const THEMES = [
    { id: 'dark', name: 'Midnight', bg: '#0f0f0f', text: '#e0e0e0', accent: '#a855f7' },
    { id: 'light', name: 'Paper', bg: '#f5f5f5', text: '#2d2d2d', accent: '#3b82f6' },
    { id: 'sepia', name: 'Coffee', bg: '#fdf6e3', text: '#5c4b37', accent: '#d97706' },
    { id: 'navy', name: 'Deep Sea', bg: '#0a192f', text: '#cbd5e1', accent: '#64ffda' },
] as const;

export type ThemeType = typeof THEMES[number];
