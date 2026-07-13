import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer" role="contentinfo">
      <div class="footer-inner">
        <span class="footer-name">Designed &amp; Developed by Md Amaanuddin</span>
        <span class="footer-divider" aria-hidden="true">—</span>
        <span class="footer-stack">
          Angular <span class="dot" aria-hidden="true">•</span>
          GSAP <span class="dot" aria-hidden="true">•</span>
          Tailwind <span class="dot" aria-hidden="true">•</span>
          TypeScript
        </span>
        <span class="footer-year" aria-label="Year 2025">2025</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      padding: 2rem clamp(1.5rem, 5vw, 5rem);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .footer-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .footer-name {
      font-size: 0.8125rem;
      color: #8A8A9A;
      font-weight: 500;
    }

    .footer-divider {
      color: #4A4A5A;
    }

    .footer-stack {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #4A4A5A;
      letter-spacing: 0.02em;
    }

    .dot {
      margin: 0 0.25rem;
      color: #2563EB;
    }

    .footer-year {
      margin-left: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #4A4A5A;
    }

    @media (max-width: 640px) {
      .footer-inner {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .footer-year {
        margin-left: 0;
      }

      .footer-divider {
        display: none;
      }
    }
  `],
})
export class FooterComponent {}
