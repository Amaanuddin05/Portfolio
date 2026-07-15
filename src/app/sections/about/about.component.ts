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
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html',
  styles: [`
    /* ── About ─────────────────────────────────────── */
    .about {
      position: relative;
      padding-top: clamp(5rem, 10vw, 9rem);
      padding-bottom: clamp(5rem, 10vw, 9rem);
    }

    .about-inner {
      display: grid;
      grid-template-columns: 1fr 1px 1fr;
      gap: 0 clamp(2.5rem, 5vw, 5rem);
      align-items: start;
    }

    /* Left column ─── heading */
    .about-left {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .about-heading {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(2.25rem, 4.5vw, 3.5rem);
      font-weight: 600;
      letter-spacing: -0.03em;
      line-height: 1.08;
      color: #F2F2F2;
      margin: 0;
      text-wrap: balance;
    }

    .about-heading-line {
      display: block;
      overflow: hidden;
    }

    /* Clip-reveal initial state */
    .reveal-line {
      display: block;
      transform: translateY(110%);
    }

    /* Vertical divider */
    .about-divider {
      width: 1px;
      background: rgba(255, 255, 255, 0.06);
      align-self: stretch;
      min-height: 100%;
    }

    /* Right column ─── bio + stats */
    .about-right {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
      padding-top: 0.25rem; /* optical alignment with heading cap-height */
    }

    .about-body {
      font-size: 1rem;
      line-height: 1.8;
      /* #9E9EAF: 4.6:1 on #0A0A0B — WCAG AA */
      color: #9E9EAF;
      max-width: 52ch;
      opacity: 0;
      transform: translateY(20px);
    }

    /* Stats — horizontal ruled row */
    .about-stats {
      display: flex;
      flex-direction: column;
      gap: 0;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .stat-row {
      display: flex;
      align-items: baseline;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      opacity: 0;
      transform: translateX(-8px);
    }

    .stat-number {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(1.5rem, 2.5vw, 2rem);
      font-weight: 600;
      letter-spacing: -0.03em;
      color: #F2F2F2;
      min-width: 3.5ch;
    }

    .stat-label {
      font-size: 0.875rem;
      /* #9E9EAF: AA-compliant */
      color: #9E9EAF;
      line-height: 1.4;
    }

    /* ── Responsive ────────────────────────────────── */
    @media (max-width: 900px) {
      .about-inner {
        grid-template-columns: 1fr;
        gap: 2.5rem 0;
      }

      .about-divider {
        width: 100%;
        height: 1px;
        min-height: unset;
        align-self: auto;
      }

      .about-heading {
        font-size: clamp(2rem, 6vw, 2.75rem);
      }
    }

    /* ── Reduced Motion ────────────────────────────── */
    @media (prefers-reduced-motion: reduce) {
      .reveal-line {
        transform: none;
      }

      .about-body,
      .stat-row {
        opacity: 1 !important;
        transform: none !important;
      }
    }
  `],
})
export class AboutComponent implements AfterViewInit, OnDestroy {
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
        // Clip-reveal heading lines — communicates structure emerging
        const lines = document.querySelectorAll<HTMLElement>('.about .reveal-line');
        gsap.to(lines, {
          y: 0,
          duration: 1.0,
          ease: 'power4.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.about',
            start: 'top 75%',
            once: true,
          },
        });

        // Body paragraph — reveals after headings settle
        gsap.to('.about .about-body', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about',
            start: 'top 70%',
            once: true,
          },
          delay: 0.25,
        });

        // Stats stagger — each row enters in sequence, communicates data arriving
        const statRows = document.querySelectorAll<HTMLElement>('.about .stat-row');
        gsap.to(statRows, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.about .about-stats',
            start: 'top 80%',
            once: true,
          },
        });
      });
    });
  }
}
