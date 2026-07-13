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
    .contact {
      position: relative;
      overflow: hidden;
    }

    .contact::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.4), transparent);
    }

    .contact-inner {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      position: relative;
    }

    /* Kinetic ghost text */
    .contact-headline {
      position: relative;
      overflow: hidden;
      height: clamp(4rem, 10vw, 9rem);
      pointer-events: none;
    }

    .headline-ghost {
      position: absolute;
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(4rem, 10vw, 9rem);
      font-weight: 700;
      letter-spacing: -0.04em;
      color: transparent;
      -webkit-text-stroke: 1px rgba(255, 255, 255, 0.06);
      line-height: 1;
      white-space: nowrap;
      will-change: transform;
    }

    .contact-body {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 560px;
      opacity: 0;
      transform: translateY(30px);
    }

    .contact-title {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(1.75rem, 3.5vw, 2.75rem);
      font-weight: 600;
      letter-spacing: -0.035em;
      color: #F2F2F2;
      line-height: 1.1;
      margin: 0;
    }

    .contact-desc {
      font-size: 1rem;
      line-height: 1.75;
      color: #8A8A9A;
    }

    /* Availability indicator */
    .contact-avail {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: #3A3A4A;
    }

    .avail-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5);
      animation: avail-pulse 2s ease infinite;
    }

    @keyframes avail-pulse {
      0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
      70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
      100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
    }

    .avail-text {
      font-weight: 500;
      color: #22c55e;
      letter-spacing: 0.01em;
    }

    /* Full-width email CTA */
    .contact-email-cta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.375rem 1.75rem;
      background: rgba(37, 99, 235, 0.06);
      border: 1px solid rgba(37, 99, 235, 0.2);
      border-radius: 16px;
      text-decoration: none;
      color: #60A5FA;
      transition: background 0.3s, border-color 0.3s, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s;
      max-width: 540px;
    }

    .contact-email-cta:hover {
      background: rgba(37, 99, 235, 0.12);
      border-color: rgba(37, 99, 235, 0.4);
      transform: translateY(-3px);
      box-shadow: 0 16px 40px rgba(37, 99, 235, 0.12);
    }

    .email-text {
      font-size: 0.9375rem;
      font-weight: 500;
      letter-spacing: -0.01em;
    }

    .email-arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(37, 99, 235, 0.15);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s;
      flex-shrink: 0;
    }

    .contact-email-cta:hover .email-arrow {
      transform: translateX(3px) translateY(-3px);
      background: rgba(37, 99, 235, 0.3);
    }

    .contact-socials {
      display: flex;
      gap: 0.75rem;
    }

    .social-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 10px;
      text-decoration: none;
      color: #5A5A6A;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color 0.25s, border-color 0.25s, background 0.25s, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .social-link:hover {
      color: #F2F2F2;
      border-color: rgba(255, 255, 255, 0.18);
      background: rgba(255, 255, 255, 0.04);
      transform: translateY(-2px);
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal-contact {
        opacity: 1 !important;
        transform: none !important;
      }
      .avail-dot { animation: none; }
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
        // Ghost headline parallax
        gsap.to('.headline-ghost', {
          x: '-8%',
          ease: 'none',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        // Body reveal
        gsap.to('.reveal-contact', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 70%',
            once: true,
          },
        });
      });
    });

    // Ensure visible for reduced-motion
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.reveal-contact', { opacity: 1, y: 0 });
    });
  }
}
