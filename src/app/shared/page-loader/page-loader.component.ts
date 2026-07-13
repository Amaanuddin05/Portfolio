import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  signal,
  output,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-page-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-loader.component.html',
  styles: [`
    .loader-overlay {
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: #0A0A0B;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: opacity 0.8s cubic-bezier(0.76, 0, 0.24, 1),
                  transform 0.8s cubic-bezier(0.76, 0, 0.24, 1),
                  clip-path 0.8s cubic-bezier(0.76, 0, 0.24, 1);
    }

    .loader-overlay--exit {
      opacity: 0;
      transform: scale(1.06);
      pointer-events: none;
    }

    /* Subtle grid bg */
    .loader-bg-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 48px 48px;
      mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 80%);
      pointer-events: none;
    }

    .loader-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      position: relative;
      z-index: 1;
    }

    .loader-monogram {
      width: 80px;
      height: 80px;
      position: relative;
    }

    .loader-monogram::after {
      content: '';
      position: absolute;
      inset: -12px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%);
      animation: glow-ring 2s ease-in-out infinite;
    }

    @keyframes glow-ring {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.2); opacity: 1; }
    }

    .mono-ring {
      animation: ring-appear 0.4s ease forwards;
      stroke-dasharray: 213;
      stroke-dashoffset: 213;
    }

    @keyframes ring-appear {
      to { stroke-dashoffset: 0; }
    }

    .mono-path {
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      animation: draw-path 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
    }

    .mono-path--cross {
      animation-delay: 0.65s;
    }

    @keyframes draw-path {
      to { stroke-dashoffset: 0; }
    }

    .mono-glow {
      opacity: 0;
      animation: mono-glow-pulse 1s ease 0.8s forwards;
    }

    @keyframes mono-glow-pulse {
      0% { opacity: 0; transform: scale(0.5); }
      50% { opacity: 1; transform: scale(2.5); }
      100% { opacity: 0; transform: scale(4); }
    }

    .loader-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8125rem;
      letter-spacing: 0.3em;
      color: rgba(242, 242, 242, 0.5);
      text-transform: uppercase;
      animation: fade-in 0.6s ease 0.5s forwards;
      opacity: 0;
    }

    .loader-sub {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.5625rem;
      letter-spacing: 0.15em;
      color: rgba(242, 242, 242, 0.15);
      text-transform: uppercase;
      animation: fade-in 0.6s ease 0.8s forwards;
      opacity: 0;
    }

    @keyframes fade-in {
      to { opacity: 1; }
    }

    /* Bottom progress bar */
    .loader-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(255, 255, 255, 0.04);
    }

    .loader-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, transparent, #2563EB, #60A5FA, transparent);
      animation: progress-sweep 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
      width: 0%;
    }

    @keyframes progress-sweep {
      0% { width: 0%; opacity: 0; }
      10% { opacity: 1; }
      100% { width: 100%; opacity: 0.6; }
    }

    @media (prefers-reduced-motion: reduce) {
      .mono-path { animation: none; stroke-dashoffset: 0; }
      .mono-ring { animation: none; stroke-dashoffset: 0; }
      .loader-label { animation: none; opacity: 0.5; }
      .loader-sub { animation: none; opacity: 0.15; }
      .loader-overlay { transition: none; }
      .loader-progress-fill { animation: none; width: 100%; }
    }
  `],
})
export class PageLoaderComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  loaded = output<void>();

  visible = signal(true);
  exiting = signal(false);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.visible.set(false);
      return;
    }
    // Progress bar takes 1.4s. Add 0.3s settle before exit.
    setTimeout(() => {
      this.exiting.set(true);
      setTimeout(() => {
        this.visible.set(false);
        this.loaded.emit();
      }, 850);
    }, 1700);
  }
}
