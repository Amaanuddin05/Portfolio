import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ElementRef,
  AfterViewInit,
  signal,
  PLATFORM_ID,
  inject,
  ViewChild,
  HostListener,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(mousemove)': 'onMouseMove($event)',
  },
  templateUrl: './hero.component.html',
  styles: [`
    .hero {
      position: relative;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
    }

    /* ── Background ── */
    .hero-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }

    .hero-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
      background-size: 56px 56px;
      mask-image: radial-gradient(ellipse 90% 70% at 60% 40%, black 30%, transparent 100%);
    }

    /* Light beams — diagonal, more visible */
    .hero-beam {
      position: absolute;
      border-radius: 9999px;
      filter: blur(0px);
    }

    .hero-beam--1 {
      width: 1px;
      height: 60%;
      top: -5%;
      left: 55%;
      background: linear-gradient(to bottom,
        transparent 0%,
        rgba(96, 165, 250, 0.7) 35%,
        rgba(37, 99, 235, 0.4) 65%,
        transparent 100%
      );
      transform: rotate(-8deg);
      transform-origin: top center;
      animation: beam-flicker 5s ease-in-out infinite;
    }

    .hero-beam--2 {
      width: 1px;
      height: 40%;
      top: 0%;
      left: 70%;
      background: linear-gradient(to bottom,
        transparent 0%,
        rgba(37, 99, 235, 0.5) 40%,
        rgba(96, 165, 250, 0.3) 70%,
        transparent 100%
      );
      transform: rotate(-4deg);
      transform-origin: top center;
      animation: beam-flicker 7s ease-in-out infinite 1.5s;
    }

    .hero-beam--3 {
      width: 1px;
      height: 30%;
      top: 5%;
      left: 82%;
      background: linear-gradient(to bottom,
        transparent 0%,
        rgba(96, 165, 250, 0.35) 50%,
        transparent 100%
      );
      transform: rotate(-12deg);
      transform-origin: top center;
      animation: beam-flicker 4s ease-in-out infinite 0.8s;
    }

    @keyframes beam-flicker {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    /* Volumetric glows */
    .hero-glow--1 {
      position: absolute;
      top: -10%;
      right: 5%;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 70%);
      animation: glow-pulse 8s ease-in-out infinite;
    }

    .hero-glow--2 {
      position: absolute;
      bottom: 20%;
      right: 25%;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(96, 165, 250, 0.06) 0%, transparent 70%);
      animation: glow-pulse 10s ease-in-out infinite 2s;
    }

    @keyframes glow-pulse {
      0%, 100% { transform: scale(1); opacity: 0.7; }
      50% { transform: scale(1.15); opacity: 1; }
    }

    /* Edge vignette */
    .hero-vignette {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, #0A0A0B 100%),
        linear-gradient(to bottom, #0A0A0B 0%, transparent 8%, transparent 92%, #0A0A0B 100%);
    }

    /* ── Content ── */
    .hero-content {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 4rem;
      padding: 8rem clamp(1.5rem, 5vw, 5rem) 5rem;
    }

    /* ── Text block ── */
    .hero-text {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.875rem;
      border-radius: 9999px;
      border: 1px solid rgba(37, 99, 235, 0.3);
      background: rgba(37, 99, 235, 0.06);
      font-size: 0.75rem;
      font-weight: 500;
      color: #60A5FA;
      width: fit-content;
      opacity: 0;
      backdrop-filter: blur(8px);
      transition: border-color 0.3s, background 0.3s;
    }

    .hero-badge:hover {
      border-color: rgba(37, 99, 235, 0.5);
      background: rgba(37, 99, 235, 0.1);
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5);
      animation: dot-pulse 2s ease-in-out infinite;
    }

    @keyframes dot-pulse {
      0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
      70% { box-shadow: 0 0 0 5px rgba(34, 197, 94, 0); }
      100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
    }

    .hero-name {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(3.75rem, 8vw, 7rem);
      font-weight: 600;
      letter-spacing: -0.045em;
      line-height: 1.0;
      color: #F2F2F2;
      margin: 0;
    }

    .hero-name-line {
      background: linear-gradient(135deg, #F2F2F2 20%, rgba(242,242,242,0.85) 60%, #60A5FA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(1.125rem, 2.2vw, 1.5rem);
      font-weight: 400;
      letter-spacing: -0.01em;
      color: #5A5A6A;
      margin: 0;
    }

    .hero-manifesto {
      font-size: clamp(0.9375rem, 1.5vw, 1.0625rem);
      line-height: 1.75;
      color: #4A4A5A;
      max-width: 40ch;
      opacity: 0;
      margin-top: -0.5rem;
    }

    /* CTAs */
    .hero-ctas {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      flex-wrap: wrap;
      opacity: 0;
    }

    /* Primary CTA — button in button architecture */
    .cta-primary {
      display: inline-flex;
      align-items: center;
      gap: 0;
      padding: 0.625rem 0.625rem 0.625rem 1.375rem;
      background: #2563EB;
      color: #F2F2F2;
      text-decoration: none;
      font-size: 0.9375rem;
      font-weight: 600;
      border-radius: 9999px;
      transition: background 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s;
      white-space: nowrap;
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4);
      letter-spacing: -0.01em;
    }

    .cta-primary:hover {
      background: #1D4ED8;
      box-shadow: 0 0 30px rgba(37, 99, 235, 0.35), 0 0 60px rgba(37, 99, 235, 0.15);
    }

    .cta-primary:active {
      transform: scale(0.97);
    }

    .cta-icon-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.18);
      margin-left: 0.875rem;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s;
      flex-shrink: 0;
    }

    .cta-primary:hover .cta-icon-wrap {
      transform: translateX(3px) translateY(-2px) scale(1.05);
      background: rgba(255, 255, 255, 0.25);
    }

    .cta-secondary {
      font-size: 0.9375rem;
      font-weight: 500;
      color: #6A6A7A;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 9999px;
      transition: color 0.25s, border-color 0.25s, background 0.25s;
      white-space: nowrap;
      letter-spacing: -0.01em;
    }

    .cta-secondary:hover {
      color: #F2F2F2;
      border-color: rgba(255, 255, 255, 0.18);
      background: rgba(255, 255, 255, 0.03);
    }

    /* Keyboard hint */
    .hero-kbd-hint {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      color: #3A3A4A;
      opacity: 0;
    }

    .hero-kbd-hint kbd {
      padding: 0.15rem 0.45rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-bottom: 2px solid rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      font-family: inherit;
      font-size: 0.625rem;
      color: #5A5A6A;
    }

    /* ── Visual (right col) ── */
    .hero-visual {
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transform: translateY(30px);
    }

    .hero-card-stack {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      max-width: 400px;
    }

    /* Code card — premium glass */
    .hero-code-card {
      position: relative;
      background: rgba(12, 12, 18, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 18px;
      overflow: hidden;
      box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.03),
        0 32px 64px rgba(0, 0, 0, 0.5),
        0 0 80px rgba(37, 99, 235, 0.04);
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s;
      animation: float-card 6s ease-in-out infinite;
      will-change: transform;
    }

    .hero-code-card:hover {
      box-shadow:
        0 0 0 1px rgba(37, 99, 235, 0.15),
        0 32px 64px rgba(0, 0, 0, 0.5),
        0 0 80px rgba(37, 99, 235, 0.1);
    }

    @keyframes float-card {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    /* Inner top highlight */
    .card-inner-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.5), rgba(96, 165, 250, 0.5), transparent);
      z-index: 2;
    }

    .code-header {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.875rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      background: rgba(255, 255, 255, 0.015);
    }

    .code-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      opacity: 0.85;
    }

    .code-filename {
      margin-left: 0.5rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      color: #3A3A4A;
      letter-spacing: 0.02em;
    }

    .code-cursor-blink {
      margin-left: auto;
      width: 6px;
      height: 12px;
      background: #60A5FA;
      border-radius: 1px;
      animation: cursor-blink 1.2s step-end infinite;
      opacity: 0.7;
    }

    @keyframes cursor-blink {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 0; }
    }

    .code-body {
      padding: 1.125rem 1.25rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .code-line {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8125rem;
      line-height: 1.7;
      color: #5A5A7A;
    }

    .code-indent { padding-left: 1.5rem; }

    .c-purple { color: #c792ea; }
    .c-blue { color: #82b1ff; }
    .c-key { color: #89ddff; }
    .c-green { color: #a5e844; }
    .c-orange { color: #f78c6c; }
    .c-gray { color: #4A4A6A; }

    /* Stats card */
    .hero-stats-card {
      display: flex;
      align-items: center;
      gap: 0;
      background: rgba(12, 12, 18, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 1.375rem 1.5rem;
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.02), 0 12px 32px rgba(0, 0, 0, 0.35);
      transition: box-shadow 0.4s;
    }

    .hero-stats-card:hover {
      box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.1), 0 12px 32px rgba(0, 0, 0, 0.35);
    }

    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
    }

    .stat-num {
      font-family: 'ClashDisplay', sans-serif;
      font-size: 1.875rem;
      font-weight: 600;
      color: #F2F2F2;
      letter-spacing: -0.04em;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.625rem;
      color: #3A3A4A;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .stat-divider {
      width: 1px;
      height: 32px;
      background: rgba(255, 255, 255, 0.05);
      margin: 0 0.5rem;
    }

    /* ── Scroll indicator — left side, vertical ── */
    .hero-scroll-indicator {
      position: absolute;
      bottom: 2.5rem;
      left: clamp(1.5rem, 5vw, 5rem);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.625rem;
      opacity: 0;
      animation: scroll-fade-in 0.8s ease 2.8s forwards;
    }

    @keyframes scroll-fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .scroll-line-v {
      width: 1px;
      height: 40px;
      background: linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 100%);
      animation: scroll-drip 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      transform-origin: top;
    }

    @keyframes scroll-drip {
      0% { transform: scaleY(0); opacity: 0; }
      40% { transform: scaleY(1); opacity: 1; }
      100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
    }

    .scroll-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.5625rem;
      letter-spacing: 0.25em;
      color: #3A3A4A;
      text-transform: uppercase;
      writing-mode: vertical-lr;
      transform: rotate(180deg);
    }

    /* ── Responsive ── */
    @media (max-width: 1024px) {
      .hero-content {
        grid-template-columns: 1fr;
        gap: 3rem;
        padding-top: 8rem;
      }

      .hero-visual {
        justify-content: center;
      }

      .hero-card-stack {
        max-width: 480px;
        margin: 0 auto;
      }
    }

    @media (max-width: 768px) {
      .hero-visual {
        display: none;
      }

      .hero-scroll-indicator {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .hero-badge,
      .hero-manifesto,
      .hero-ctas,
      .hero-kbd-hint,
      .hero-visual {
        opacity: 1 !important;
        transform: none !important;
      }

      .hero-scroll-indicator { animation: none; opacity: 0.5; }
      .scroll-line-v { animation: none; }
      .badge-dot { animation: none; }
      .hero-beam { animation: none; }
      .hero-glow--1, .hero-glow--2 { animation: none; }
      .hero-code-card { animation: none; }
      .code-cursor-blink { animation: none; }
    }
  `],
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroSection') private heroSection!: ElementRef<HTMLElement>;
  @ViewChild('heroBadge') private heroBadge!: ElementRef<HTMLElement>;
  @ViewChild('nameLine1') private nameLine1!: ElementRef<HTMLElement>;
  @ViewChild('titleLine') private titleLine!: ElementRef<HTMLElement>;
  @ViewChild('heroManifesto') private heroManifesto!: ElementRef<HTMLElement>;
  @ViewChild('heroCtas') private heroCtas!: ElementRef<HTMLElement>;
  @ViewChild('heroKbd') private heroKbd!: ElementRef<HTMLElement>;
  @ViewChild('heroVisual') private heroVisual!: ElementRef<HTMLElement>;
  @ViewChild('codeCard') private codeCard!: ElementRef<HTMLElement>;

  private platformId = inject(PLATFORM_ID);
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.animateEntrance();
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  // Magnetic button micro-interaction
  onBtnEnter(e: MouseEvent): void {
    const btn = e.currentTarget as HTMLElement;
    btn.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)';
  }

  onBtnLeave(e: MouseEvent): void {
    const btn = e.currentTarget as HTMLElement;
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  }

  onMouseMove(e: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Magnetic effect on nearby buttons
    const btns = this.heroSection?.nativeElement?.querySelectorAll('.magnetic-btn');
    btns?.forEach((btn) => {
      const rect = (btn as HTMLElement).getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const threshold = 90;
      if (dist < threshold) {
        const strength = (1 - dist / threshold) * 10;
        gsap.to(btn, { x: dx * strength / dist, y: dy * strength / dist, duration: 0.3, ease: 'power2.out' });
      }
    });
  }

  // 3D card tilt on hover
  onCardMove(e: MouseEvent): void {
    const card = this.codeCard?.nativeElement;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 10,
      transformPerspective: 800,
      duration: 0.4,
      ease: 'power2.out',
    });
  }

  onCardLeave(e: MouseEvent): void {
    const card = this.codeCard?.nativeElement;
    if (!card) return;
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.6)',
    });
  }

  private animateEntrance(): void {
    const mm = gsap.matchMedia();

    mm.add(
      { isDesktop: '(min-width: 768px)', reduceMotion: '(prefers-reduced-motion: reduce)' },
      (context) => {
        const { reduceMotion } = context.conditions as { isDesktop: boolean; reduceMotion: boolean };

        if (reduceMotion) {
          gsap.set([
            this.heroBadge.nativeElement,
            this.nameLine1.nativeElement,
            this.titleLine.nativeElement,
            this.heroManifesto.nativeElement,
            this.heroCtas.nativeElement,
            this.heroKbd.nativeElement,
            this.heroVisual?.nativeElement,
          ].filter(Boolean), { opacity: 1, y: 0, clipPath: 'none' });
          return;
        }

        this.ctx = gsap.context(() => {
          const tl = gsap.timeline({ delay: 1.6 }); // wait for page loader

          // Badge fades in with scale
          tl.fromTo(this.heroBadge.nativeElement,
            { opacity: 0, scale: 0.85, y: 8 },
            { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(2)' }
          );

          // Name line rises from clip
          tl.to(this.nameLine1.nativeElement,
            { y: 0, duration: 1.0, ease: 'power4.out' },
            '-=0.2'
          );

          // Title
          tl.to(this.titleLine.nativeElement,
            { y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.7'
          );

          // Manifesto
          tl.fromTo(this.heroManifesto.nativeElement,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
            '-=0.5'
          );

          // CTAs
          tl.fromTo(this.heroCtas.nativeElement,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.4'
          );

          // Kbd hint
          tl.to(this.heroKbd.nativeElement,
            { opacity: 1, duration: 0.5, ease: 'power2.out' },
            '-=0.2'
          );

          // Visual (right col) — staggered reveal
          if (this.heroVisual?.nativeElement) {
            tl.fromTo(this.heroVisual.nativeElement,
              { opacity: 0, y: 40, scale: 0.96 },
              { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
              '-=0.7'
            );
          }
        });
      }
    );
  }

  scrollToWork(e: Event): void {
    e.preventDefault();
    document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollToContact(e: Event): void {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
