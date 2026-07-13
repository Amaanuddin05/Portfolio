import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ElementRef,
  signal,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="nav-host"
      [class.nav-host--scrolled]="scrolled()"
      role="banner"
    >
      <nav class="nav-pill" aria-label="Main navigation">
        <!-- Logo -->
        <a
          href="#hero"
          class="nav-logo"
          aria-label="Amaan — go to top"
          (click)="scrollToTop($event)"
        >
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="28" height="28">
            <path d="M4 26 L16 6 L28 26" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M9 19 L23 19" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="nav-logo-name">Amaan</span>
        </a>

        <!-- Desktop Links -->
        <div class="nav-links" role="list">
          @for (link of navLinks; track link.href) {
            <a
              [href]="link.href"
              class="nav-link"
              role="listitem"
              (click)="onNavClick($event, link.href)"
            >{{ link.label }}</a>
          }
        </div>

        <!-- CTA -->
        <a
          href="#contact"
          class="nav-cta"
          (click)="onNavClick($event, '#contact')"
          aria-label="Get in touch"
        >
          <span>Get in touch</span>
          <span class="nav-cta-icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </a>

        <!-- Mobile Hamburger -->
        <button
          class="nav-hamburger"
          [class.nav-hamburger--open]="menuOpen()"
          (click)="toggleMenu()"
          [attr.aria-expanded]="menuOpen()"
          aria-label="Toggle navigation menu"
          aria-controls="mobile-menu"
        >
          <span class="ham-line ham-line--top"></span>
          <span class="ham-line ham-line--bottom"></span>
        </button>
      </nav>

      <!-- Mobile Menu -->
      @if (menuOpen()) {
        <div
          class="mobile-menu"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div class="mobile-links">
            @for (link of navLinks; track link.href; let i = $index) {
              <a
                [href]="link.href"
                class="mobile-link"
                [style.animation-delay]="(i * 60) + 'ms'"
                (click)="onNavClick($event, link.href)"
              >{{ link.label }}</a>
            }
            <a
              href="#contact"
              class="mobile-link mobile-link--cta"
              [style.animation-delay]="(navLinks.length * 60) + 'ms'"
              (click)="onNavClick($event, '#contact')"
            >Get in touch</a>
          </div>

          <div class="mobile-footer">
            <a href="https://github.com/Amaanuddin05" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.09.682-.217.682-.48 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.07-.608.07-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.09-.645.35-1.087.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.254-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.376.202 2.392.1 2.646.64.699 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
            </a>
            <a href="https://linkedin.com/in/amaanuddin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      }
    </header>
  `,
  styles: [`
    .nav-host {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      display: flex;
      justify-content: center;
      padding: 1.25rem 1.5rem;
      pointer-events: none;
      transition: padding 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .nav-host--scrolled {
      padding: 0.75rem 1.5rem;
    }

    .nav-pill {
      pointer-events: all;
      display: flex;
      align-items: center;
      gap: 0;
      background: rgba(18, 18, 22, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 9999px;
      padding: 0.5rem 0.5rem 0.5rem 1.25rem;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      max-width: 720px;
      width: 100%;
      transition: box-shadow 0.3s;
    }

    .nav-host--scrolled .nav-pill {
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      flex-shrink: 0;
    }

    .nav-logo-name {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: #F2F2F2;
      letter-spacing: -0.02em;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .nav-link {
      position: relative;
      font-size: 0.875rem;
      font-weight: 500;
      color: #8A8A9A;
      text-decoration: none;
      padding: 0.5rem 0.75rem;
      border-radius: 9999px;
      transition: color 0.2s;
      white-space: nowrap;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 6px;
      left: 0.75rem;
      right: 0.75rem;
      height: 1px;
      background: #2563EB;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .nav-link:hover {
      color: #F2F2F2;
    }

    .nav-link:hover::after {
      transform: scaleX(1);
    }

    .nav-cta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #F2F2F2;
      text-decoration: none;
      background: #2563EB;
      border-radius: 9999px;
      padding: 0.5rem 1.125rem;
      white-space: nowrap;
      transition: background 0.2s, transform 0.15s;
      flex-shrink: 0;
    }

    .nav-cta:hover {
      background: #1D4ED8;
      transform: scale(1.02);
    }

    .nav-cta:active {
      transform: scale(0.98);
    }

    .nav-cta-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      transition: transform 0.2s;
    }

    .nav-cta:hover .nav-cta-icon {
      transform: translateX(2px) translateY(-1px);
    }

    .nav-hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      padding: 0.625rem;
      background: transparent;
      border: none;
      cursor: pointer;
      border-radius: 9999px;
      transition: background 0.2s;
      margin-left: 0.5rem;
    }

    .nav-hamburger:hover {
      background: rgba(255, 255, 255, 0.06);
    }

    .ham-line {
      display: block;
      width: 18px;
      height: 1.5px;
      background: #F2F2F2;
      border-radius: 2px;
      transform-origin: center;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s;
    }

    .nav-hamburger--open .ham-line--top {
      transform: translateY(3.25px) rotate(45deg);
    }

    .nav-hamburger--open .ham-line--bottom {
      transform: translateY(-3.25px) rotate(-45deg);
    }

    /* Mobile menu */
    .mobile-menu {
      position: fixed;
      inset: 0;
      background: rgba(10, 10, 11, 0.96);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      z-index: 999;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 2rem;
      animation: menu-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes menu-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .mobile-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .mobile-link {
      font-family: 'ClashDisplay', sans-serif;
      font-size: 2.5rem;
      font-weight: 600;
      letter-spacing: -0.03em;
      color: #F2F2F2;
      text-decoration: none;
      opacity: 0;
      transform: translateY(20px);
      animation: link-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      transition: color 0.2s;
    }

    .mobile-link:hover {
      color: #2563EB;
    }

    .mobile-link--cta {
      color: #2563EB;
      margin-top: 1rem;
    }

    @keyframes link-in {
      to { opacity: 1; transform: translateY(0); }
    }

    .mobile-footer {
      display: flex;
      gap: 1.5rem;
      margin-top: 3rem;
      color: #4A4A5A;
    }

    .mobile-footer a {
      color: #4A4A5A;
      text-decoration: none;
      transition: color 0.2s;
    }

    .mobile-footer a:hover {
      color: #F2F2F2;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .nav-links,
      .nav-cta {
        display: none;
      }

      .nav-hamburger {
        display: flex;
      }

      .nav-pill {
        padding: 0.5rem 0.5rem 0.5rem 1.25rem;
        justify-content: space-between;
      }
    }
  `],
})
export class NavComponent implements OnInit, OnDestroy {
  private elRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  scrolled = signal(false);
  menuOpen = signal(false);

  readonly navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#work' },
    { label: 'Skills', href: '#skills' },
    { label: 'Process', href: '#process' },
  ];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('scroll', this.onScroll);
    ScrollTrigger.getAll().forEach((t) => t.kill());
  }

  private onScroll = (): void => {
    this.scrolled.set(window.scrollY > 60);
    if (this.menuOpen()) {
      this.menuOpen.set(false);
    }
  };

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  onNavClick(e: Event, href: string): void {
    e.preventDefault();
    this.menuOpen.set(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToTop(e: Event): void {
    e.preventDefault();
    this.menuOpen.set(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
