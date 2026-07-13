import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
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
    .about {
      position: relative;
    }

    .about-inner {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 5rem;
      align-items: start;
    }

    .about-text {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .about-heading {
      display: flex;
      flex-direction: column;
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(2.25rem, 4.5vw, 3.5rem);
      font-weight: 600;
      letter-spacing: -0.04em;
      line-height: 1.1;
      color: #F2F2F2;
      margin: 0;
    }

    .about-heading-line {
      display: block;
      overflow: hidden;
    }

    .reveal-line {
      opacity: 0;
      transform: translateY(30px);
    }

    .about-body {
      font-size: 1rem;
      line-height: 1.85;
      color: #5A5A6A;
      max-width: 52ch;
    }

    .reveal-fade {
      opacity: 0;
      transform: translateY(20px);
    }

    /* Stats — stacked cards */
    .about-stats {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-top: 1rem;
    }

    .stat-card {
      position: relative;
      padding: 1.75rem 2rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      overflow: hidden;
      transition: border-color 0.35s, box-shadow 0.35s;
      cursor: default;
    }

    .stat-card:hover {
      border-color: rgba(37, 99, 235, 0.2);
      box-shadow: 0 0 40px rgba(37, 99, 235, 0.06);
    }

    .stat-inner {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
      margin-bottom: 0.5rem;
    }

    .stat-number {
      font-family: 'ClashDisplay', sans-serif;
      font-size: clamp(2.75rem, 5vw, 4rem);
      font-weight: 600;
      letter-spacing: -0.05em;
      color: #F2F2F2;
      line-height: 1;
    }

    .stat-unit {
      font-family: 'ClashDisplay', sans-serif;
      font-size: 1.5rem;
      font-weight: 500;
      color: #3A3A4A;
      line-height: 1;
      align-self: flex-end;
      padding-bottom: 0.2rem;
    }

    .stat-label-text {
      font-size: 0.8125rem;
      color: #3A3A4A;
      font-weight: 500;
      line-height: 1.5;
    }

    /* Subtle accent corner glow */
    .stat-card-glow {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 120px;
      height: 120px;
      background: radial-gradient(circle at bottom right, rgba(37, 99, 235, 0.08), transparent 70%);
      pointer-events: none;
    }

    @media (max-width: 1024px) {
      .about-inner {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .about-stats {
        flex-direction: row;
        padding-top: 0;
      }

      .stat-card {
        flex: 1;
      }
    }

    @media (max-width: 640px) {
      .about-stats {
        flex-direction: column;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal-line,
      .reveal-fade {
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
    this.animateSection();
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  private animateSection(): void {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      this.ctx = gsap.context(() => {
        // Heading lines
        gsap.to('.reveal-line', {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-heading',
            start: 'top 82%',
            once: true,
          },
        });

        // Body + stats
        gsap.to('.reveal-fade', {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 72%',
            once: true,
          },
        });

        // Animated counters for stat numbers
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card) => {
          const numEl = card.querySelector('.stat-number') as HTMLElement | null;
          if (!numEl) return;
          const target = parseInt(numEl.dataset['target'] || '0', 10);

          ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              const proxy = { val: 0 };
              gsap.to(proxy, {
                val: target,
                duration: 1.8,
                ease: 'power2.out',
                onUpdate() {
                  numEl.textContent = Math.round(proxy.val) + '+';
                },
              });
            },
          });
        });

        // Spotlight card mouse-tracking
        document.querySelectorAll<HTMLElement>('.stat-card').forEach((card) => {
          card.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
          });
        });
      });
    });
  }
}
