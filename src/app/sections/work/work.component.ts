import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  signal,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface Project {
  id: string;
  number: string;
  title: string;
  role: string;
  status: string;
  tags: string[];
  description: string;
  accent: string;
  accentRgb: string;
  mockup: string;
  links: { label: string; url: string }[];
}

@Component({
  selector: 'app-work',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './work.component.html',
  styles: [`
    /* ── Work ───────────────────────────────────────── */
    .work {
      position: relative;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* Section header — above the pinned track */
    .work-header {
      padding-top: clamp(5rem, 10vw, 9rem);
      padding-bottom: 3rem;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 2rem;
    }

    .work-title {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(2.25rem, 4.5vw, 3.5rem);
      font-weight: 600;
      letter-spacing: -0.03em;
      line-height: 1.08;
      color: #F2F2F2;
      margin: 0;
      overflow: hidden;
    }

    .work-title-inner {
      display: block;
      transform: translateY(110%);
    }

    .work-count {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      letter-spacing: 0.12em;
      /* #9E9EAF: 4.6:1 – AA */
      color: #9E9EAF;
      white-space: nowrap;
      flex-shrink: 0;
      opacity: 0;
    }

    /* ── Horizontal Track (Desktop) ─────────────────── */
    .work-track-wrapper {
      display: block;
      overflow: hidden;
    }

    .work-track-wrapper:focus-visible {
      outline: 2px solid #2563EB;
      outline-offset: -2px;
    }

    .work-track {
      display: flex;
      width: max-content;
    }

    @media (min-width: 1025px) {
      .work-track-wrapper,
      .work-track {
        will-change: transform;
      }
    }

    /* ── Project Card ────────────────────────────────── */
    .project-card {
      display: grid;
      grid-template-columns: 55% 45%;
      width: 100vw;
      min-height: 76vh;
      padding: 0 clamp(1.5rem, 5vw, 5rem) 3rem;
      gap: 4rem;
      align-items: center;
      contain: layout style;
    }

    /* ── Mockup Visual ───────────────────────────────── */
    .project-visual {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      height: 60vh;
      min-height: 340px;
      background: #121216;
      /* Outer bezel: thin border + top highlight */
      border: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }

    /* Accent top edge: communicates project identity */
    .project-visual::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--accent);
      opacity: 0.7;
      z-index: 2;
    }

    .project-mockup {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
      display: block;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .project-card:hover .project-mockup {
      transform: scale(1.02);
    }

    /* Subtle gradient overlay at bottom — prevents hard edge */
    .project-visual::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(to top, #121216 0%, transparent 100%);
      pointer-events: none;
      z-index: 1;
    }

    /* ── Project Meta ────────────────────────────────── */
    .project-meta {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .project-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .project-status {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.625rem;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent);
      opacity: 0.9;
    }

    .project-num-sm {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      letter-spacing: 0.1em;
      /* #9E9EAF: AA */
      color: #9E9EAF;
    }

    .project-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .project-title {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(1.75rem, 3vw, 2.5rem);
      font-weight: 600;
      letter-spacing: -0.03em;
      color: #F2F2F2;
      line-height: 1.1;
      margin: 0;
    }

    .project-role {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.06em;
      /* #9E9EAF: AA */
      color: #9E9EAF;
      font-weight: 400;
    }

    .project-desc {
      font-size: 0.9375rem;
      line-height: 1.75;
      /* #9E9EAF: AA-compliant */
      color: #9E9EAF;
      max-width: 44ch;
    }

    /* Tags — horizontal list, clean */
    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.625rem;
      letter-spacing: 0.06em;
      /* #9E9EAF: AA */
      color: #9E9EAF;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 4px;
      padding: 0.2rem 0.5rem;
    }

    /* Links */
    .project-links {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-top: 0.25rem;
    }

    .project-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #F2F2F2;
      text-decoration: none;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
      padding: 0.5rem 1.125rem;
      transition: color 0.2s, border-color 0.2s, background 0.2s, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
    }

    .project-link:hover {
      border-color: var(--accent);
      background: rgba(var(--accent-rgb), 0.06);
      transform: translateY(-2px);
    }

    .project-link:focus-visible {
      outline: 2px solid #2563EB;
      outline-offset: 2px;
    }

    .project-link--primary {
      background: rgba(var(--accent-rgb), 0.08);
      border-color: rgba(var(--accent-rgb), 0.2);
      color: var(--accent);
    }

    /* ── Progress Bar ────────────────────────────────── */
    .work-progress {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem clamp(1.5rem, 5vw, 5rem);
    }

    .progress-track {
      flex: 1;
      height: 1px;
      background: rgba(255, 255, 255, 0.05);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      width: 25%;
      background: #2563EB;
      transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .progress-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.5625rem;
      letter-spacing: 0.14em;
      /* #9E9EAF: AA */
      color: #9E9EAF;
      text-transform: uppercase;
      white-space: nowrap;
    }

    /* ── Mobile cards ────────────────────────────────── */
    .work-mobile {
      display: none;
    }

    .mobile-card {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding: 2rem 0;
    }

    .mobile-card:last-child {
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .mobile-mockup-wrap {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 1.5rem;
      aspect-ratio: 16 / 9;
      background: #121216;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .mobile-mockup-wrap::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--accent);
      z-index: 1;
    }

    .mobile-mockup {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
      display: block;
    }

    .mobile-meta {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .mobile-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* ── Responsive ──────────────────────────────────── */
    @media (max-width: 1024px) {
      .work-track-wrapper,
      .work-progress {
        display: none;
      }

      .work-mobile {
        display: block;
        padding-bottom: clamp(5rem, 10vw, 9rem);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .work-title-inner {
        transform: none;
      }

      .work-count {
        opacity: 1;
      }

      .project-card:hover .project-mockup {
        transform: none;
      }
    }
  `],
})
export class WorkComponent implements AfterViewInit, OnDestroy {
  @ViewChild('trackWrapper') private trackWrapper!: ElementRef<HTMLElement>;
  @ViewChild('track') private track!: ElementRef<HTMLElement>;
  @ViewChild('progressFill') private progressFill!: ElementRef<HTMLElement>;

  private platformId = inject(PLATFORM_ID);
  private ctx?: gsap.Context;

  activeIndex = signal(0);

  readonly projects: Project[] = [
    {
      id: 'autoresearch',
      number: '01',
      title: 'AutoResearch Agent',
      role: 'Full Stack + AI · 2024',
      status: 'Hero Project',
      accent: '#60A5FA',
      accentRgb: '96, 165, 250',
      description:
        'An autonomous AI research agent that compiles, summarizes, and cross-references academic sources using LangChain, Ollama, and ChromaDB for RAG-powered retrieval.',
      tags: ['Python', 'LangChain', 'Ollama', 'ChromaDB', 'RAG', 'FastAPI', 'Angular'],
      mockup: '/mockup-autoresearch.png',
      links: [
        { label: 'GitHub', url: 'https://github.com/Amaanuddin05' },
        { label: 'Demo', url: '#' },
      ],
    },
    {
      id: 'resumeassist',
      number: '02',
      title: 'ResumeAssist',
      role: 'Full Stack Engineer · 2024',
      status: 'Live',
      accent: '#a78bfa',
      accentRgb: '167, 139, 250',
      description:
        'AI-powered resume tailoring tool that analyzes job descriptions and rewrites resume bullets for ATS optimization using LLM chains and context-aware scoring.',
      tags: ['Angular', 'Node.js', 'LangChain', 'OpenAI', 'MongoDB', 'REST API'],
      mockup: '/mockup-resumeassist.png',
      links: [
        { label: 'GitHub', url: 'https://github.com/Amaanuddin05' },
      ],
    },
    {
      id: 'penndora',
      number: '03',
      title: 'Penndora',
      role: 'Frontend Engineer · 2023',
      status: 'Live',
      accent: '#34d399',
      accentRgb: '52, 211, 153',
      description:
        'A collaborative writing platform with real-time co-editing, AI-assisted suggestions, and smart formatting — built with Angular and Firebase for sub-100ms sync.',
      tags: ['Angular', 'Firebase', 'TypeScript', 'GSAP', 'Tailwind'],
      mockup: '/mockup-penndora.png',
      links: [
        { label: 'GitHub', url: 'https://github.com/Amaanuddin05' },
        { label: 'Live', url: '#' },
      ],
    },
    {
      id: 'devkit',
      number: '04',
      title: 'DevKit CLI',
      role: 'Backend Engineer · 2023',
      status: 'Open Source',
      accent: '#fb923c',
      accentRgb: '251, 146, 60',
      description:
        'A developer productivity CLI toolkit that scaffolds Angular projects, manages Docker environments, and automates deployment pipelines with a single command.',
      tags: ['Node.js', 'TypeScript', 'Docker', 'AWS', 'CLI', 'Express'],
      mockup: '/mockup-devkit.png',
      links: [
        { label: 'GitHub', url: 'https://github.com/Amaanuddin05' },
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

  onTrackKeydown(event: KeyboardEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const total = this.projects.length;
    const current = this.activeIndex();
    let targetIndex = current;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        targetIndex = Math.min(current + 1, total - 1);
        event.preventDefault();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        targetIndex = Math.max(current - 1, 0);
        event.preventDefault();
        break;
      case 'Home':
        targetIndex = 0;
        event.preventDefault();
        break;
      case 'End':
        targetIndex = total - 1;
        event.preventDefault();
        break;
      default:
        return;
    }

    if (targetIndex === current) return;
    this.scrollToProject(targetIndex);
  }

  private scrollToProject(index: number): void {
    const st = ScrollTrigger.getById('work-track');
    if (!st || !this.track?.nativeElement) return;

    const cardWidth = window.innerWidth;
    const totalScroll = this.track.nativeElement.scrollWidth - window.innerWidth;
    const progress = (index / (this.projects.length - 1));
    const targetScroll = st.start + progress * totalScroll;

    gsap.to(window, {
      scrollTo: targetScroll,
      duration: 0.8,
      ease: 'power3.inOut',
    });
  }

  private initAnimations(): void {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      this.ctx = gsap.context(() => {
        // Header reveal — heading clips up, count fades in
        gsap.to('.work .work-title-inner', {
          y: 0,
          duration: 1.0,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.work',
            start: 'top 75%',
            once: true,
          },
        });

        gsap.to('.work .work-count', {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.work',
            start: 'top 72%',
            once: true,
          },
          delay: 0.3,
        });

        // Desktop: Horizontal pan — pinned scroll, scrubbed
        if (window.innerWidth > 1024 && this.track?.nativeElement && this.trackWrapper?.nativeElement) {
          const distance = this.track.nativeElement.scrollWidth - window.innerWidth;

          const workST = gsap.to(this.track.nativeElement, {
            x: -distance,
            ease: 'none',
            scrollTrigger: {
              id: 'work-track',
              trigger: this.trackWrapper.nativeElement,
              start: 'top top',
              end: () => `+=${distance}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                // Sync active index and progress bar — communicates position
                const idx = Math.round(self.progress * (this.projects.length - 1));
                this.activeIndex.set(idx);

                if (this.progressFill?.nativeElement) {
                  const pct = (self.progress * 100).toFixed(1);
                  this.progressFill.nativeElement.style.width = `${pct}%`;
                }
              },
            },
          });
        }
      });
    });
  }
}
