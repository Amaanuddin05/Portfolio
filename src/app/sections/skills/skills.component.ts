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

interface SkillCategory {
  id: string;
  icon: string; // inline SVG path data
  name: string;
  skills: string[];
}

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills.component.html',
  styles: [`
    /* ── Skills ─────────────────────────────────────── */
    .skills {
      position: relative;
      padding-top: clamp(5rem, 10vw, 9rem);
      padding-bottom: clamp(5rem, 10vw, 9rem);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .skills-layout {
      display: grid;
      grid-template-columns: 1fr 1px 1fr;
      gap: 0 clamp(2.5rem, 5vw, 5rem);
      align-items: start;
    }

    /* Left ── list */
    .skills-left {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .skills-heading {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(2.25rem, 4.5vw, 3.5rem);
      font-weight: 600;
      letter-spacing: -0.03em;
      line-height: 1.08;
      color: #F2F2F2;
      margin: 0 0 2.5rem;
      overflow: hidden;
      text-wrap: balance;
    }

    .heading-inner {
      display: block;
      transform: translateY(110%);
    }

    /* Tier labels */
    .tier-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.625rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      /* #9E9EAF: 4.6:1 – AA */
      color: #9E9EAF;
      padding: 1.25rem 0 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      opacity: 0;
    }

    .tier-label:first-of-type {
      border-top: none;
      padding-top: 0;
    }

    /* Category row */
    .skill-row {
      display: flex;
      align-items: baseline;
      gap: 1.25rem;
      padding: 0.875rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      opacity: 0;
      transform: translateX(-12px);
    }

    .skill-row:last-child {
      border-bottom: none;
    }

    .row-icon {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      /* #9E9EAF: readable against surface */
      color: #9E9EAF;
      position: relative;
      top: 0.125rem; /* optical alignment with text cap-height */
    }

    .row-category {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      /* #9E9EAF: AA */
      color: #9E9EAF;
      min-width: 7.5rem;
      flex-shrink: 0;
    }

    .row-skills {
      font-size: 0.9375rem;
      color: #F2F2F2;
      line-height: 1.5;
    }

    /* Vertical divider */
    .skills-divider {
      width: 1px;
      background: rgba(255, 255, 255, 0.06);
      align-self: stretch;
    }

    /* Right ── statement */
    .skills-right {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding-top: 0.25rem;
    }

    .skills-statement {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(1.5rem, 2.75vw, 2.25rem);
      font-weight: 600;
      letter-spacing: -0.025em;
      line-height: 1.2;
      color: #F2F2F2;
      margin: 0;
      text-wrap: balance;
      overflow: hidden;
    }

    .statement-inner {
      display: block;
      transform: translateY(110%);
    }

    .skills-coda {
      font-size: 0.9375rem;
      line-height: 1.8;
      color: #9E9EAF;
      max-width: 44ch;
      opacity: 0;
      transform: translateY(12px);
    }

    /* Accent line under statement */
    .skills-accent-rule {
      width: 2rem;
      height: 2px;
      background: #2563EB;
      margin-top: 0.25rem;
      transform: scaleX(0);
      transform-origin: left;
    }

    /* ── Responsive ─────────────────────────────────── */
    @media (max-width: 900px) {
      .skills-layout {
        grid-template-columns: 1fr;
        gap: 3rem 0;
      }

      .skills-divider {
        width: 100%;
        height: 1px;
        align-self: auto;
      }

      .row-category {
        min-width: 6rem;
        font-size: 0.625rem;
      }
    }

    /* ── Reduced Motion ──────────────────────────────── */
    @media (prefers-reduced-motion: reduce) {
      .heading-inner,
      .statement-inner {
        transform: none;
      }

      .tier-label,
      .skill-row,
      .skills-coda {
        opacity: 1 !important;
        transform: none !important;
      }

      .skills-accent-rule {
        transform: scaleX(1) !important;
      }
    }
  `],
})
export class SkillsComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private ctx?: gsap.Context;

  // Primary stack — most-used, highest proficiency
  readonly primaryCategories: SkillCategory[] = [
    {
      id: 'frontend',
      icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
      name: 'Frontend',
      skills: ['Angular', 'TypeScript', 'GSAP', 'Tailwind CSS'],
    },
    {
      id: 'backend',
      icon: 'M5 12h14M12 5l7 7-7 7',
      name: 'Backend',
      skills: ['Node.js', 'Express', 'REST APIs', 'PostgreSQL'],
    },
    {
      id: 'ai',
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      name: 'AI / ML',
      skills: ['LangChain', 'Ollama', 'ChromaDB', 'RAG Pipelines'],
    },
  ];

  // Also working with — familiar, growing
  readonly alsoCategories: SkillCategory[] = [
    {
      id: 'database',
      icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
      name: 'Database',
      skills: ['MySQL', 'MongoDB', 'Firebase'],
    },
    {
      id: 'devops',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      name: 'DevOps',
      skills: ['Docker', 'Railway', 'GitHub Actions'],
    },
    {
      id: 'tools',
      icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      name: 'Tools',
      skills: ['Git', 'Python', 'Figma'],
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
        // Heading clip-reveal
        gsap.to('.skills .heading-inner', {
          y: 0,
          duration: 1.0,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.skills',
            start: 'top 75%',
            once: true,
          },
        });

        // Statement clip-reveal on right — after heading
        gsap.to('.skills .statement-inner', {
          y: 0,
          duration: 1.0,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.skills',
            start: 'top 70%',
            once: true,
          },
          delay: 0.15,
        });

        // Accent rule expands — signals the statement has landed
        gsap.to('.skills .skills-accent-rule', {
          scaleX: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.skills',
            start: 'top 65%',
            once: true,
          },
          delay: 0.5,
        });

        // Coda body text
        gsap.to('.skills .skills-coda', {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.skills',
            start: 'top 65%',
            once: true,
          },
          delay: 0.35,
        });

        // Tier labels
        const tierLabels = document.querySelectorAll('.skills .tier-label');
        gsap.to(tierLabels, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.skills',
            start: 'top 70%',
            once: true,
          },
        });

        // Skill rows stagger — each row slides in from left, communicating a list being constructed
        const rows = document.querySelectorAll('.skills .skill-row');
        gsap.to(rows, {
          opacity: 1,
          x: 0,
          duration: 0.55,
          ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: {
            trigger: '.skills .skills-left',
            start: 'top 75%',
            once: true,
          },
        });
      });
    });
  }
}
