import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light-theme', 'dark-theme');
  });

  it('should be created with default system theme', () => {
    expect(service.currentTheme()).toBe('system');
  });

  it('should cycle theme: system -> light -> dark -> system', () => {
    service.cycleTheme();
    expect(service.currentTheme()).toBe('light');
    expect(localStorage.getItem('nexa-theme')).toBe('light');

    service.cycleTheme();
    expect(service.currentTheme()).toBe('dark');
    expect(localStorage.getItem('nexa-theme')).toBe('dark');

    service.cycleTheme();
    expect(service.currentTheme()).toBe('system');
    expect(localStorage.getItem('nexa-theme')).toBe('system');
  });

  it('should apply appropriate classes to the document element', () => {
    // Initial is system, so no classes by default (media query handles it)
    expect(document.documentElement.classList.contains('light-theme')).toBe(false);
    expect(document.documentElement.classList.contains('dark-theme')).toBe(false);

    service.cycleTheme(); // to light
    expect(document.documentElement.classList.contains('light-theme')).toBe(true);
    expect(document.documentElement.classList.contains('dark-theme')).toBe(false);

    service.cycleTheme(); // to dark
    expect(document.documentElement.classList.contains('light-theme')).toBe(false);
    expect(document.documentElement.classList.contains('dark-theme')).toBe(true);

    service.cycleTheme(); // back to system
    expect(document.documentElement.classList.contains('light-theme')).toBe(false);
    expect(document.documentElement.classList.contains('dark-theme')).toBe(false);
  });
});
