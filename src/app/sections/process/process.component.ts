import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChildren,
  QueryList,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  details: string[];
  accent: string;
}

@Component({
  selector: 'app-process',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './process.component.html',
  styles: [`
    /* ── Process ─────────────────────────────────────── */
    .process {
      position: relative;
      padding-top: clamp(5rem, 10vw, 9rem);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .process-header {
      padding-left: clamp(1.5rem, 5vw, 5rem);
      padding-right: clamp(1.5rem, 5vw, 5rem);
      max-width: 1400px;
      margin: 0 auto;
      margin-bottom: 3.5rem;
      overflow: hidden;
    }

    .process-heading {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(2.25rem, 4.5vw, 3.5rem);
      font-weight: 600;
      letter-spacing: -0.03em;
      line-height: 1.08;
      color: #F2F2F2;
      margin: 0 0 0.75rem;
      text-wrap: balance;
    }

    .heading-inner {
      display: block;
      transform: translateY(110%);
    }

    .process-sub {
      font-size: 0.9375rem;
      color: #9E9EAF;
      opacity: 0;
      transform: translateY(12px);
    }

    /* ── Sticky stack (desktop) ─────────────────────── */
    .process-stack {
      position: relative;
      display: flex;
      flex-direction: column;
      padding-bottom: clamp(5rem, 10vw, 9rem);
    }

    .process-card {
      position: sticky;
      top: 100px;
      margin-bottom: 1.5rem;
      will-change: transform, opacity;
      padding-left: clamp(1.5rem, 5vw, 5rem);
      padding-right: clamp(1.5rem, 5vw, 5rem);
      max-width: 1400px;
      margin-left: auto;
      margin-right: auto;
      width: 100%;
    }

    /* Outer bezel */
    .card-shell {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 20px;
      padding: 2px;
    }

    /* Inner surface */
    .card-inner {
      background: #121216;
      border-radius: 18px;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
      padding: 2.5rem 3rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
      min-height: 280px;
      position: relative;
    }

    /* Left accent rule — 2px precision blue bar, communicates step identity */
    .card-inner::before {
      content: '';
      position: absolute;
      left: 0;
      top: 2rem;
      bottom: 2rem;
      width: 2px;
      background: var(--step-accent, #2563EB);
      border-radius: 1px;
      opacity: 0.6;
    }

    /* Left column */
    .card-left {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-left: 1.5rem;
    }

    .step-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 500;
      color: var(--step-accent, #2563EB);
      opacity: 0.8;
    }

    .step-title {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(1.75rem, 3vw, 2.25rem);
      font-weight: 600;
      letter-spacing: -0.03em;
      color: #F2F2F2;
      line-height: 1.1;
      margin: 0;
    }

    .step-desc {
      font-size: 0.9375rem;
      line-height: 1.75;
      color: #9E9EAF;
      max-width: 40ch;
    }

    /* Right column: clean detail list */
    .card-right {
      display: flex;
      flex-direction: column;
      gap: 0;
      border-left: 1px solid rgba(255, 255, 255, 0.05);
      padding-left: 2.5rem;
    }

    .step-details {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .step-detail {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      font-size: 0.875rem;
      color: #9E9EAF;
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }

    .step-detail:last-child {
      border-bottom: none;
    }

    .detail-rule {
      width: 12px;
      height: 1px;
      background: var(--step-accent, #2563EB);
      flex-shrink: 0;
      opacity: 0.6;
    }

    /* ── Mobile ──────────────────────────────────────── */
    .process-mobile {
      display: none;
      flex-direction: column;
      gap: 0;
      padding: 0 clamp(1.5rem, 5vw, 5rem);
      padding-bottom: clamp(5rem, 10vw, 9rem);
      max-width: 1400px;
      margin: 0 auto;
    }

    .process-mobile-step {
      display: flex;
      gap: 1.5rem;
      padding: 2rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      opacity: 0;
      transform: translateY(16px);
    }

    .process-mobile-step:last-child {
      border-bottom: none;
    }

    .pm-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.625rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      flex-shrink: 0;
      padding-top: 0.25rem;
      min-width: 2rem;
    }

    .pm-body {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .pm-title {
      font-family: 'ClashDisplay', sans-serif;
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: #F2F2F2;
      margin: 0;
    }

    .pm-desc {
      font-size: 0.9375rem;
      line-height: 1.75;
      color: #9E9EAF;
    }

    /* ── Responsive ──────────────────────────────────── */
    @media (max-width: 1024px) {
      .process-stack {
        display: none;
      }

      .process-mobile {
        display: flex;
      }
    }

    @media (max-width: 768px) {
      .card-inner {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        padding: 1.75rem;
        min-height: auto;
      }

      .card-right {
        border-left: none;
        padding-left: 0;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        padding-top: 1.5rem;
      }
    }

    /* ── Reduced Motion ──────────────────────────────── */
    @media (prefers-reduced-motion: reduce) {
      .heading-inner {
        transform: none;
      }

      .process-sub,
      .process-mobile-step {
        opacity: 1 !important;
        transform: none !important;
      }
    }
  `],
})
export class ProcessComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('processCard') processCards!: QueryList<ElementRef<HTMLElement>>;

  private platformId = inject(PLATFORM_ID);
  private ctx?: gsap.Context;

  readonly steps: ProcessStep[] = [
    {
      number: '01',
      title: 'Research',
      accent: '#60A5FA',
      description:
        'I dig into the problem space before writing a line of code. Understanding users, constraints, and existing systems saves weeks later.',
      details: [
        'Define the problem, not just the feature',
        'Map existing systems and data flows',
        'Identify performance and scalability needs',
        'Clarify success metrics upfront',
      ],
    },
    {
      number: '02',
      title: 'Build',
      accent: '#a78bfa',
      description:
        'Ship a working version fast. Core functionality over polish in early iterations — real usage reveals what matters.',
      details: [
        'Architecture that can grow without rewrites',
        'Component-first Angular patterns',
        'API contracts defined before implementation',
        'Type safety end to end',
      ],
    },
    {
      number: '03',
      title: 'Optimize',
      accent: '#34d399',
      description:
        'Performance is not an afterthought. I profile, measure, and optimize — whether that is bundle size, query time, or LLM latency.',
      details: [
        'Profiling before assuming the bottleneck',
        'Angular OnPush + signal-based reactivity',
        'Lazy loading, tree shaking, code splitting',
        'Core Web Vitals: LCP < 1.5s target',
      ],
    },
    {
      number: '04',
      title: 'Ship',
      accent: '#fb923c',
      description:
        'Deployment is not the finish line. I set up monitoring, iterate on real feedback, and keep systems maintainable long-term.',
      details: [
        'CI/CD pipelines with Docker + Railway',
        'Error monitoring and performance tracking',
        'Documentation written for future teammates',
        'Post-ship iteration based on real data',
      ],
    },
  ];

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
        // Header reveal
        gsap.to('.process .heading-inner', {
          y: 0,
          duration: 1.0,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.process',
            start: 'top 75%',
            once: true,
          },
        });

        gsap.to('.process .process-sub', {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.process',
            start: 'top 72%',
            once: true,
          },
          delay: 0.2,
        });

        // Desktop sticky stack — cards pin and scale as next arrives
        if (window.innerWidth > 1024) {
          const cards = gsap.utils.toArray<HTMLElement>('.process-card');

          cards.forEach((card, i) => {
            if (i === cards.length - 1) return;

            // Pin each card until the last one has scrolled into place
            ScrollTrigger.create({
              trigger: card,
              start: 'top 100px',
              endTrigger: cards[cards.length - 1],
              end: 'top 100px',
              pin: true,
              pinSpacing: false,
            });

            // Scale + fade previous card as next one arrives
            gsap.to(card, {
              scale: 0.94,
              opacity: 0.5,
              ease: 'none',
              scrollTrigger: {
                trigger: cards[i + 1],
                start: 'top bottom',
                end: 'top 100px',
                scrub: true,
              },
            });
          });
        }

        // Mobile: simple stagger reveal
        const mobileSteps = gsap.utils.toArray<HTMLElement>('.process-mobile-step');
        gsap.to(mobileSteps, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.process-mobile',
            start: 'top 80%',
            once: true,
          },
        });
      });
    });
  }
}
