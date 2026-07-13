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
  name: string;
  skills: Skill[];
  colSpan: string;
  rowSpan?: string;
}

interface Skill {
  name: string;
  level: 'Expert' | 'Advanced' | 'Familiar';
  icon?: string;
}

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills.component.html',
  styles: [`
    .skills {
      position: relative;
    }

    .skills-header {
      margin-bottom: 3rem;
    }

    .skills-title {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 600;
      letter-spacing: -0.035em;
      color: #F2F2F2;
      margin-bottom: 0.5rem;
    }

    .skills-subtitle {
      font-size: 1rem;
      color: #4A4A5A;
    }

    .reveal-skills {
      opacity: 0;
      transform: translateY(20px);
    }

    /* ── Bento Grid ── */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 1rem;
    }

    .skill-cell {
      background: rgba(18, 18, 22, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 20px;
      padding: 1.5rem;
      transition: border-color 0.25s, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0;
      transform: scale(0.94) translateY(10px);
    }

    .skill-cell:hover {
      border-color: rgba(37, 99, 235, 0.18);
      box-shadow: 0 0 30px rgba(37, 99, 235, 0.06);
      transform: translateY(-3px);
    }

    /* Column spans */
    .col-1 { grid-column: span 1; }
    .col-2 { grid-column: span 2; }
    .col-3 { grid-column: span 3; }

    .cell-category {
      margin-bottom: 1rem;
      color: #4A4A5A;
    }

    .cell-skills {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }

    .skill-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .skill-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: #F2F2F2;
    }

    .skill-level {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.625rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border-radius: 9999px;
      padding: 0.15rem 0.5rem;
    }

    .level-expert {
      color: #34d399;
      background: rgba(52, 211, 153, 0.08);
      border: 1px solid rgba(52, 211, 153, 0.15);
    }

    .level-advanced {
      color: #60A5FA;
      background: rgba(96, 165, 250, 0.08);
      border: 1px solid rgba(96, 165, 250, 0.15);
    }

    .level-familiar {
      color: #8A8A9A;
      background: rgba(138, 138, 154, 0.08);
      border: 1px solid rgba(138, 138, 154, 0.1);
    }

    /* Accent cell */
    .skill-cell--accent {
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(37, 99, 235, 0.04));
      border-color: rgba(37, 99, 235, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .accent-quote {
      font-family: 'ClashDisplay', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.6;
      color: rgba(96, 165, 250, 0.7);
      letter-spacing: -0.01em;
      text-align: center;
    }

    .reveal-cell {
      /* set by GSAP */
    }

    @media (max-width: 1024px) {
      .skills-grid {
        grid-template-columns: repeat(4, 1fr);
      }

      .col-3 { grid-column: span 2; }
    }

    @media (max-width: 768px) {
      .skills-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }

      .col-1, .col-2, .col-3 { grid-column: span 1; }

      .skill-cell--accent {
        grid-column: span 2;
      }
    }

    @media (max-width: 480px) {
      .skills-grid {
        grid-template-columns: 1fr;
      }

      .skill-cell--accent { grid-column: span 1; }
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal-skills,
      .reveal-cell {
        opacity: 1 !important;
        transform: none !important;
      }

      .skill-cell:hover {
        transform: none;
      }
    }
  `],
})
export class SkillsComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private ctx?: gsap.Context;

  readonly categories: SkillCategory[] = [
    {
      name: 'Frontend',
      colSpan: '2',
      skills: [
        { name: 'Angular', level: 'Expert' },
        { name: 'TypeScript', level: 'Expert' },
        { name: 'JavaScript', level: 'Expert' },
        { name: 'Tailwind CSS', level: 'Expert' },
        { name: 'GSAP', level: 'Advanced' },
        { name: 'HTML5 / SCSS', level: 'Expert' },
      ],
    },
    {
      name: 'Backend',
      colSpan: '2',
      skills: [
        { name: 'Node.js', level: 'Advanced' },
        { name: 'Express.js', level: 'Advanced' },
        { name: 'REST APIs', level: 'Expert' },
        { name: 'MySQL', level: 'Advanced' },
        { name: 'MongoDB', level: 'Advanced' },
        { name: 'Firebase', level: 'Advanced' },
      ],
    },
    {
      name: 'AI / ML',
      colSpan: '2',
      skills: [
        { name: 'Python', level: 'Advanced' },
        { name: 'LangChain', level: 'Advanced' },
        { name: 'Ollama', level: 'Advanced' },
        { name: 'ChromaDB', level: 'Advanced' },
        { name: 'RAG Pipelines', level: 'Advanced' },
        { name: 'AI Agents', level: 'Advanced' },
      ],
    },
    {
      name: 'Cloud & DevOps',
      colSpan: '2',
      skills: [
        { name: 'Docker', level: 'Advanced' },
        { name: 'AWS', level: 'Familiar' },
      ],
    },
  ];

  onCellMove(e: MouseEvent, cell: HTMLElement): void {
    const rect = cell.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cell.style.setProperty('--mouse-x', `${x}%`);
    cell.style.setProperty('--mouse-y', `${y}%`);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.animateCells();
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  private animateCells(): void {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      this.ctx = gsap.context(() => {
        gsap.to('.reveal-skills', {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#skills',
            start: 'top 80%',
            once: true,
          },
        });

        gsap.to('.reveal-cell', {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%',
            once: true,
          },
        });
      });
    });
  }
}
