import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styles: [`
    /* ── Contact ─────────────────────────────────────── */
    .contact {
      position: relative;
      padding-top: clamp(5rem, 10vw, 9rem);
      padding-bottom: clamp(5rem, 10vw, 9rem);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      overflow: hidden;
    }

    /* Subtle blue radial — signals warmth at the close without shouting */
    .contact::before {
      content: '';
      position: absolute;
      top: -10%;
      left: 50%;
      transform: translateX(-50%);
      width: 700px;
      height: 400px;
      background: radial-gradient(ellipse, rgba(37, 99, 235, 0.06) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .contact-inner {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      position: relative;
      z-index: 1;
    }

    /* ── Heading ─────────────────────────────────────── */
    .contact-heading {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(2.75rem, 6vw, 5rem);
      font-weight: 600;
      letter-spacing: -0.04em;
      line-height: 1.0;
      color: #F2F2F2;
      margin: 0;
      text-wrap: balance;
      overflow: hidden;
    }

    .heading-line {
      display: block;
      overflow: hidden;
    }

    .heading-inner {
      display: block;
      transform: translateY(110%);
    }

    /* ── Subtext + availability ──────────────────────── */
    .contact-sub {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      opacity: 0;
      transform: translateY(16px);
    }

    .contact-desc {
      font-size: 1rem;
      line-height: 1.75;
      color: #9E9EAF;
      max-width: 44ch;
    }

    /* Availability indicator */
    .contact-avail {
      display: inline-flex;
      align-items: center;
      gap: 0.625rem;
    }

    .avail-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5);
      animation: avail-pulse 2.4s ease infinite;
      flex-shrink: 0;
    }

    @keyframes avail-pulse {
      0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
      60% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
      100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
    }

    .avail-text {
      font-size: 0.875rem;
      font-weight: 500;
      color: #22c55e;
      letter-spacing: 0.01em;
    }

    /* ── Email CTA — large interactive block ─────────── */
    .contact-email-block {
      opacity: 0;
      transform: translateY(20px);
    }

    .contact-email-link {
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
      color: #F2F2F2;
      padding: 1.5rem 0;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      width: 100%;
      max-width: 680px;
      transition: color 0.25s;
      position: relative;
      overflow: hidden;
    }

    /* Hover reveal underline sweep — communicates the link is alive */
    .contact-email-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 1px;
      background: #2563EB;
      transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .contact-email-link:hover::after {
      width: 100%;
    }

    .contact-email-link:hover {
      color: #60A5FA;
    }

    .contact-email-link:focus-visible {
      outline: 2px solid #2563EB;
      outline-offset: 4px;
    }

    .email-address {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(1.25rem, 2.5vw, 1.875rem);
      font-weight: 600;
      letter-spacing: -0.02em;
      line-height: 1;
    }

    .email-arrow-icon {
      flex-shrink: 0;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      color: #9E9EAF;
    }

    .contact-email-link:hover .email-arrow-icon {
      transform: translate(4px, -4px);
      color: #60A5FA;
    }

    /* ── Social links ────────────────────────────────── */
    .contact-links {
      display: flex;
      align-items: center;
      gap: 0;
      opacity: 0;
      transform: translateY(12px);
    }

    .contact-link {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      color: #9E9EAF;
      transition: color 0.2s;
      position: relative;
    }

    .contact-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 1px;
      background: currentColor;
      transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .contact-link:hover {
      color: #F2F2F2;
    }

    .contact-link:hover::after {
      width: 100%;
    }

    .contact-link:focus-visible {
      outline: 2px solid #2563EB;
      outline-offset: 2px;
      border-radius: 2px;
    }

    .link-sep {
      margin: 0 1.25rem;
      /* #9E9EAF: AA */
      color: #9E9EAF;
      font-size: 0.75rem;
      user-select: none;
    }

    /* ── Closing line ────────────────────────────────── */
    .contact-closing {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      /* #9E9EAF: AA */
      color: #9E9EAF;
      opacity: 0;
    }

    /* ── Responsive ──────────────────────────────────── */
    @media (max-width: 640px) {
      .contact-links {
        flex-wrap: wrap;
        gap: 0.5rem 0;
      }

      .link-sep {
        display: none;
      }

      .contact-link {
        width: 100%;
      }

      .email-address {
        font-size: clamp(1rem, 4vw, 1.375rem);
      }
    }

    /* ── Reduced Motion ──────────────────────────────── */
    @media (prefers-reduced-motion: reduce) {
      .heading-inner {
        transform: none;
      }

      .contact-sub,
      .contact-email-block,
      .contact-links,
      .contact-closing {
        opacity: 1 !important;
        transform: none !important;
      }

      .avail-dot {
        animation: none;
      }

      .contact-email-link::after,
      .contact-link::after {
        transition: none;
      }
    }
  `],
})
export class ContactComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initAnimations();
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  private initAnimations(): void {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      this.ctx = gsap.context(() => {
        // Heading clip-reveal — large statement lands with presence
        const headingLines = document.querySelectorAll('.contact .heading-inner');
        gsap.to(headingLines, {
          y: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.contact',
            start: 'top 75%',
            once: true,
          },
        });

        // Sub content
        gsap.to('.contact .contact-sub', {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact',
            start: 'top 68%',
            once: true,
          },
          delay: 0.3,
        });

        // Email block
        gsap.to('.contact .contact-email-block', {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact',
            start: 'top 65%',
            once: true,
          },
          delay: 0.45,
        });

        // Links
        gsap.to('.contact .contact-links', {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact',
            start: 'top 62%',
            once: true,
          },
          delay: 0.6,
        });

        // Closing line
        gsap.to('.contact .contact-closing', {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.contact',
            start: 'top 58%',
            once: true,
          },
          delay: 0.75,
        });
      });
    });
  }
}
