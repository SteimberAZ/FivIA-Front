import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(true); // Default to dark mode
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    // Check localStorage or default to dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setDarkMode(savedTheme === 'dark');
    } else {
      this.setDarkMode(true);
    }
  }

  toggleTheme() {
    this.setDarkMode(!this.darkModeSubject.value);
  }

  setDarkMode(isDark: boolean) {
    this.darkModeSubject.next(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-[#0b1110]', 'text-[#e2e8f0]');
      document.body.classList.remove('bg-gray-50', 'text-gray-800');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-gray-50', 'text-gray-800');
      document.body.classList.remove('bg-[#0b1110]', 'text-[#e2e8f0]');
    }
  }
}
