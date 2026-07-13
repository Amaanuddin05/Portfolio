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
  templateUrl: './nav.component.html',
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
