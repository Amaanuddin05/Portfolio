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
  template: `
    <section
      id="contact"
      class="contact section-padding"
      aria-label="Contact Amaan"
    >
      <div class="contact-inner container-max">
        <!-- Kinetic ghost text -->
        <div class="contact-headline" aria-hidden="true">
          <span class="headline-ghost">Let's Build</span>
        </div>

        <div class="contact-body reveal-contact">
          <div class="eyebrow">Get in touch</div>
          <h2 class="contact-title">
            Have something<br>to build?
          </h2>
          <p class="contact-desc">
            Open to full-time roles, freelance, and collaborations.
            If you have an interesting problem, let's talk.
          </p>

          <!-- Availability indicator -->
          <div class="contact-avail">
            <span class="avail-dot"></span>
            <span class="avail-text">Available for new opportunities</span>
          </div>

          <!-- Primary email CTA -->
          <a
            href="mailto:amaanuddin.dev@gmail.com"
            class="contact-email-cta"
            aria-label="Send Amaan an email"
          >
            <span class="email-text">amaanuddin.dev&#64;gmail.com</span>
            <span class="email-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M5 19 L19 5 M10 5 h9 v9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </a>

          <!-- Social links -->
          <div class="contact-socials" role="list">
            <a
              href="https://github.com/Amaanuddin05"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              role="listitem"
              aria-label="Amaan on GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.09.682-.217.682-.48 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.07-.608.07-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.09-.645.35-1.087.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.254-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.376.202 2.392.1 2.646.64.699 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/amaanuddin"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              role="listitem"
              aria-label="Amaan on LinkedIn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
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
