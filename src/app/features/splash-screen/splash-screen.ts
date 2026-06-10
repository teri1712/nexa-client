import {Component, input} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [],
  template: `
    <div class="splash-overlay" @fadeOut>
      <div class="logo-container" @scaleUp>
        <svg width="120" height="120" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="512" height="512" rx="64" fill="url(#paint0_linear)"/>
          <path d="M150 362V150H210L302 284V150H362V362H302L210 228V362H150Z" fill="white"/>
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
              <stop stop-color="#0F172A"/>
              <stop offset="1" stop-color="#2563EB"/>
            </linearGradient>
          </defs>
        </svg>
        <h1 class="brand-name">Nexa</h1>
        <div class="loader">
          <div class="pulse"></div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
    }

    .splash-overlay {
      width: 100%;
      height: 100%;
      background: #020617; /* Deep Midnight */
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .brand-name {
      color: white;
      font-family: 'Inter', sans-serif;
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.05em;
      margin: 0;
      background: linear-gradient(135deg, #22D3EE, #2563EB);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .loader {
      width: 40px;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
      position: relative;
    }

    .pulse {
      position: absolute;
      width: 40%;
      height: 100%;
      background: #22D3EE; /* Luminous Cyan */
      border-radius: 2px;
      animation: loading 1.5s infinite ease-in-out;
    }

    @keyframes loading {
      0% { left: -40%; }
      50% { left: 100%; }
      100% { left: -40%; }
    }
  `,
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('400ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('scaleUp', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('600ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class SplashScreenComponent {}
