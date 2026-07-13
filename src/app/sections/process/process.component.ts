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
  icon: string;
}

@Component({
  selector: 'app-process',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './process.component.html',
  styles: [`
    .process {
      position: relative;
    }

    .process-header {
      margin-bottom: 3rem;
    }

    .process-title {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 600;
      letter-spacing: -0.035em;
      color: #F2F2F2;
      margin-bottom: 0.5rem;
    }

    .process-subtitle {
      font-size: 1rem;
      color: #4A4A5A;
    }

    .reveal-process {
      opacity: 0;
      transform: translateY(20px);
    }

    /* ── Stack (desktop) ── */
    .process-stack {
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .process-card {
      position: sticky;
      top: 100px;
      border-radius: 24px;
      margin-bottom: 1.5rem;
      will-change: transform, opacity;
    }

    .card-shell {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 22px;
      padding: 2px;
    }

    .card-inner {
      background: #121216;
      border-radius: 20px;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
      padding: 2.5rem 3rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
      min-height: 280px;
    }

    .card-left {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .step-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      font-weight: 500;
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
      line-height: 1.7;
      color: #8A8A9A;
      max-width: 40ch;
    }

    .card-right {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .step-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .step-details {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .step-detail {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      color: #8A8A9A;
    }

    .detail-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    /* ── Mobile ── */
    .process-mobile {
      display: none;
      flex-direction: column;
      gap: 0;
    }

    .process-mobile-step {
      display: flex;
      gap: 1.5rem;
      padding: 2rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      opacity: 0;
      transform: translateY(20px);
    }

    .process-mobile-step:last-child {
      border-bottom: none;
    }

    .pm-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      flex-shrink: 0;
      padding-top: 0.25rem;
      width: 2rem;
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
      line-height: 1.7;
      color: #8A8A9A;
    }

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
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal-process,
      .reveal-process-m {
        opacity: 1 !important;
        transform: none !important;
      }
    }
  `],
})
export class ProcessComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('processCard') processCards!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('processStack') processStack!: QueryList<ElementRef<HTMLElement>>;

  private platformId = inject(PLATFORM_ID);
  private ctx?: gsap.Context;

  readonly steps: ProcessStep[] = [
    {
      number: '01',
      title: 'Research',
      accent: '#60A5FA',
      icon: '🔍',
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
      icon: '⚙️',
      description:
        'Ship a working version fast. I prioritise core functionality over polish in early iterations — real usage reveals what matters.',
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
      icon: '⚡',
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
      icon: '🚀',
      description:
        'Deployment is not the finish line. I set up monitoring, iterate on real feedback, and keep systems maintainable long-term.',
      details: [
        'CI/CD pipelines with Docker + AWS',
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
      // Header reveal
      gsap.to('.reveal-process', {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#process',
          start: 'top 80%',
          once: true,
        },
      });

      // Mobile steps reveal
      gsap.to('.reveal-process-m', {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.process-mobile',
          start: 'top 80%',
          once: true,
        },
      });
    });

    // Desktop sticky-stack scale effect
    mm.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', () => {
      this.ctx = gsap.context(() => {
        const cards = this.processCards.toArray();
        cards.forEach((cardRef, i) => {
          if (i === cards.length - 1) return;
          const card = cardRef.nativeElement;
          const nextCard = cards[i + 1]?.nativeElement;
          if (!nextCard) return;

          gsap.to(card, {
            scale: 0.94,
            opacity: 0.5,
            ease: 'none',
            scrollTrigger: {
              trigger: nextCard,
              start: 'top 60%',
              end: 'top top+=100',
              scrub: 0.5,
            },
          });
        });
      });
    });
  }
}
