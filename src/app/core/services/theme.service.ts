import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'nexa-theme';
  currentTheme = signal<ThemeMode>(this.getStoredTheme());

  constructor() {
    this.applyTheme(this.currentTheme());
  }

  cycleTheme() {
    const modes: ThemeMode[] = ['system', 'light', 'dark'];
    const currentIdx = modes.indexOf(this.currentTheme());
    const nextMode = modes[(currentIdx + 1) % modes.length];
    
    this.setTheme(nextMode);
  }

  setTheme(mode: ThemeMode) {
    localStorage.setItem(this.THEME_KEY, mode);
    this.currentTheme.set(mode);
    this.applyTheme(mode);
  }

  private applyTheme(mode: ThemeMode) {
    const html = document.documentElement;
    html.classList.remove('light-theme', 'dark-theme');
    
    if (mode === 'light') {
      html.classList.add('light-theme');
    } else if (mode === 'dark') {
      html.classList.add('dark-theme');
    }
  }

  private getStoredTheme(): ThemeMode {
    return (localStorage.getItem(this.THEME_KEY) as ThemeMode) || 'system';
  }
}
