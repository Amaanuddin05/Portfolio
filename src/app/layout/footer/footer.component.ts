import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
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
