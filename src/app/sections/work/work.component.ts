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
  year: string;
  tags: string[];
  description: string;
  accent: string;
  accentRgb: string;
  status: string;
  links: { label: string; url: string }[];
  visualClass: string;
}

@Component({
  selector: 'app-work',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './work.component.html',
  styles: [`
    .work {
      position: relative;
    }

    .work-header {
      padding-top: clamp(5rem, 10vw, 9rem);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .work-title {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 600;
      letter-spacing: -0.035em;
      color: #F2F2F2;
      margin: 0;
    }

    .work-subtitle {
      font-size: 0.9375rem;
      color: #3A3A4A;
    }

    .reveal-fade-work {
      opacity: 0;
      transform: translateY(20px);
    }

    /* ── Horizontal Track (Desktop) ── */
    .work-track-wrapper {
      display: block;
      overflow: hidden;
      will-change: transform;
    }

    .work-track {
      display: flex;
      width: max-content;
      will-change: transform;
    }

    /* Project Card */
    .project-card {
      display: grid;
      grid-template-columns: 52% 48%;
      width: 100vw;
      min-height: 72vh;
      padding: 3rem clamp(1.5rem, 5vw, 5rem);
      gap: 4rem;
      align-items: center;
    }

    /* ── Project Visual — Rich CSS Art ── */
    .project-visual {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      height: 62vh;
      min-height: 320px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Themed backgrounds */
    .project-visual--blue {
      background: linear-gradient(145deg, #060d1f 0%, #071226 40%, #0A0A0B 100%);
    }
    .project-visual--purple {
      background: linear-gradient(145deg, #0d0618 0%, #110a20 40%, #0A0A0B 100%);
    }
    .project-visual--green {
      background: linear-gradient(145deg, #040e0a 0%, #06120c 40%, #0A0A0B 100%);
    }
    .project-visual--orange {
      background: linear-gradient(145deg, #0f0800 0%, #160d00 40%, #0A0A0B 100%);
    }

    /* Grid overlay */
    .visual-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(var(--accent-rgb), 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(var(--accent-rgb), 0.06) 1px, transparent 1px);
      background-size: 32px 32px;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%);
    }

    /* Accent orb */
    .visual-orb {
      position: absolute;
      width: 280px;
      height: 280px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(var(--accent-rgb), 0.2) 0%, transparent 70%);
      filter: blur(40px);
      bottom: -60px;
      right: -40px;
      animation: orb-breathe 6s ease-in-out infinite;
    }

    @keyframes orb-breathe {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.2); opacity: 1; }
    }

    /* Ghost project number */
    .project-num-large {
      font-family: 'ClashDisplay', sans-serif;
      font-size: clamp(7rem, 14vw, 13rem);
      font-weight: 700;
      color: transparent;
      -webkit-text-stroke: 1px rgba(var(--accent-rgb), 0.08);
      letter-spacing: -0.05em;
      line-height: 1;
      user-select: none;
      position: relative;
      z-index: 1;
    }

    /* Floating UI panels */
    .visual-panel {
      position: absolute;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(var(--accent-rgb), 0.12);
      border-radius: 10px;
      backdrop-filter: blur(8px);
      padding: 0.75rem;
      z-index: 2;
    }

    .visual-panel--a {
      top: 1.5rem;
      left: 1.5rem;
      width: 140px;
      animation: panel-float-a 7s ease-in-out infinite;
    }

    .visual-panel--b {
      bottom: 2rem;
      right: 1.5rem;
      width: 120px;
      animation: panel-float-b 5s ease-in-out infinite 1s;
    }

    @keyframes panel-float-a {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    @keyframes panel-float-b {
      0%, 100% { transform: translateY(0) translateX(0); }
      50% { transform: translateY(5px) translateX(-3px); }
    }

    .panel-header {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin-bottom: 0.6rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .panel-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: rgba(var(--accent-rgb), 0.7);
    }

    .panel-line {
      height: 2px;
      flex: 1;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 1px;
    }

    .panel-body {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .panel-row {
      height: 2px;
      border-radius: 1px;
      background: rgba(255, 255, 255, 0.07);
    }
    .panel-row--long { width: 100%; }
    .panel-row--med { width: 75%; }
    .panel-row--short { width: 50%; }

    .panel-code-line {
      height: 2px;
      border-radius: 1px;
      background: rgba(255, 255, 255, 0.07);
      margin-bottom: 0.4rem;
      width: 90%;
    }
    .panel-code-line--indent { width: 65%; margin-left: 0.5rem; }
    .panel-code-line.accent {
      background: rgba(var(--accent-rgb), 0.4);
      width: 50%;
    }

    /* Top accent glow line */
    .visual-glow-top {
      position: absolute;
      top: 0;
      left: 20%;
      right: 20%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb), 0.6), transparent);
      z-index: 3;
    }

    /* ── Right: Meta ── */
    .project-meta {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
      padding: 1rem 0;
    }

    .project-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .project-num-sm {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      color: #2A2A3A;
    }

    .project-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .project-title {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(1.75rem, 3.5vw, 2.75rem);
      font-weight: 600;
      letter-spacing: -0.035em;
      color: #F2F2F2;
      line-height: 1.1;
      margin: 0;
    }

    .project-role {
      font-size: 0.8125rem;
      color: #3A3A4A;
      font-weight: 500;
      letter-spacing: 0.02em;
    }

    .project-desc {
      font-size: 0.9375rem;
      line-height: 1.75;
      color: #6A6A7A;
      max-width: 44ch;
    }

    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }

    .tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.625rem;
      color: #3A3A4A;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 9999px;
      padding: 0.25rem 0.625rem;
      letter-spacing: 0.04em;
      transition: color 0.2s, border-color 0.2s;
    }

    .tag:hover {
      color: #8A8A9A;
      border-color: rgba(255, 255, 255, 0.1);
    }

    .project-links {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .project-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #8A8A9A;
      text-decoration: none;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 9999px;
      padding: 0.5rem 1.125rem;
      transition: color 0.2s, border-color 0.2s, background 0.2s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
    }

    .project-link:hover {
      color: #F2F2F2;
      border-color: rgba(var(--accent-rgb), 0.4);
      background: rgba(var(--accent-rgb), 0.06);
      transform: translateY(-2px);
    }

    /* ── Progress Bar ── */
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
      border-radius: 1px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      width: 25%;
      background: linear-gradient(90deg, #2563EB, #60A5FA);
      border-radius: 1px;
      transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .progress-label {
      font-size: 0.6875rem;
      color: #2A2A3A;
      min-width: 3rem;
      text-align: right;
    }

    /* ── Mobile ── */
    .work-mobile {
      display: none;
    }

    .project-card-mobile {
      display: grid;
      gap: 1.5rem;
      padding: 0 0 3rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }

    .project-card-mobile:last-child {
      border-bottom: none;
    }

    .pcm-visual {
      border-radius: 16px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }

    .pcm-num {
      font-family: 'ClashDisplay', sans-serif;
      font-size: 5rem;
      font-weight: 700;
      color: transparent;
      -webkit-text-stroke: 1px rgba(255, 255, 255, 0.06);
      letter-spacing: -0.05em;
      position: relative;
      z-index: 1;
    }

    .pcm-body {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }

    .pcm-title {
      font-family: 'ClashDisplay', sans-serif;
      font-size: 1.75rem;
      font-weight: 600;
      letter-spacing: -0.03em;
      color: #F2F2F2;
      margin: 0;
    }

    .pcm-desc {
      font-size: 0.9375rem;
      line-height: 1.7;
      color: #6A6A7A;
    }

    .pcm-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }

    .pcm-links {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    @media (max-width: 1024px) {
      .work-track-wrapper,
      .work-progress {
        display: none;
      }

      .work-mobile {
        display: block;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal-fade-work {
        opacity: 1 !important;
        transform: none !important;
      }
      .visual-orb { animation: none; }
      .visual-panel--a { animation: none; }
      .visual-panel--b { animation: none; }
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
      role: 'Full Stack + AI',
      year: '2024',
      status: '★ Hero Project',
      accent: '#60A5FA',
      accentRgb: '96, 165, 250',
      description:
        'An autonomous AI research agent that compiles, summarizes, and cross-references academic sources using LangChain, Ollama, and ChromaDB for RAG-powered retrieval.',
      tags: ['Python', 'LangChain', 'Ollama', 'ChromaDB', 'RAG', 'FastAPI', 'Angular'],
      links: [
        { label: 'GitHub', url: 'https://github.com/Amaanuddin05' },
        { label: 'Demo', url: '#' },
      ],
      visualClass: 'blue',
    },
    {
      id: 'resumeassist',
      number: '02',
      title: 'ResumeAssist',
      role: 'Full Stack Engineer',
      year: '2024',
      status: 'Live',
      accent: '#a78bfa',
      accentRgb: '167, 139, 250',
      description:
        'AI-powered resume tailoring tool that analyzes job descriptions and rewrites resume bullets for ATS optimization using LLM chains and context-aware scoring.',
      tags: ['Angular', 'Node.js', 'LangChain', 'OpenAI', 'MongoDB', 'REST API'],
      links: [
        { label: 'GitHub', url: 'https://github.com/Amaanuddin05' },
      ],
      visualClass: 'purple',
    },
    {
      id: 'penndora',
      number: '03',
      title: 'Penndora',
      role: 'Frontend Engineer',
      year: '2023',
      status: 'Live',
      accent: '#34d399',
      accentRgb: '52, 211, 153',
      description:
        'A collaborative writing platform with real-time co-editing, AI-assisted suggestions, and smart formatting — built with Angular and Firebase for sub-100ms sync.',
      tags: ['Angular', 'Firebase', 'TypeScript', 'GSAP', 'Tailwind'],
      links: [
        { label: 'GitHub', url: 'https://github.com/Amaanuddin05' },
        { label: 'Live', url: '#' },
      ],
      visualClass: 'green',
    },
    {
      id: 'devkit',
      number: '04',
      title: 'DevKit CLI',
      role: 'Backend Engineer',
      year: '2023',
      status: 'Open Source',
      accent: '#fb923c',
      accentRgb: '251, 146, 60',
      description:
        'A developer productivity CLI toolkit that scaffolds Angular projects, manages Docker environments, and automates deployment pipelines with a single command.',
      tags: ['Node.js', 'TypeScript', 'Docker', 'AWS', 'CLI', 'Express'],
      links: [
        { label: 'GitHub', url: 'https://github.com/Amaanuddin05' },
      ],
      visualClass: 'orange',
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

    // Section header reveal
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to('.reveal-fade-work', {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.work-header',
          start: 'top 80%',
          once: true,
        },
      });
    });

    // Horizontal pan (desktop ≥ 1025px)
    mm.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', () => {
      this.ctx = gsap.context(() => {
        const track = this.track.nativeElement;
        const wrapper = this.trackWrapper.nativeElement;
        const totalWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        const distance = totalWidth - viewportWidth;

        gsap.to(track, {
          x: -distance,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: () => `+=${distance}`,
            pin: true,
            scrub: 1.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;
              if (this.progressFill?.nativeElement) {
                this.progressFill.nativeElement.style.width = `${progress * 100}%`;
              }
              const idx = Math.round(progress * (this.projects.length - 1));
              this.activeIndex.set(Math.max(0, Math.min(idx, this.projects.length - 1)));
            },
          },
        });
      });
    });

    // Mobile: scroll reveal
    mm.add('(max-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.to('.project-card-mobile', {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.work-mobile',
          start: 'top 80%',
          once: true,
        },
      });
    });
  }
}
