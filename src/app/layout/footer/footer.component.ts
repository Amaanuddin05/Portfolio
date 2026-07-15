import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer" role="contentinfo">
      <div
        class="footer-inner container-max"
        style="padding-left: clamp(1.5rem, 5vw, 5rem); padding-right: clamp(1.5rem, 5vw, 5rem);"
      >
        <!-- Left: Identity -->
        <div class="footer-identity">
          <span class="footer-name">Amaan</span>
          <span class="footer-role">Full Stack Engineer</span>
          <span class="footer-built">Built with Angular, GSAP & TypeScript</span>
        </div>

        <!-- Center: Nav -->
        <nav class="footer-nav" aria-label="Footer navigation">
          <a href="#about" class="footer-nav-link">About</a>
          <a href="#work" class="footer-nav-link">Work</a>
          <a href="#skills" class="footer-nav-link">Skills</a>
          <a href="#process" class="footer-nav-link">Process</a>
          <a href="#contact" class="footer-nav-link">Contact</a>
        </nav>

        <!-- Right: Social + year -->
        <div class="footer-right">
          <div class="footer-socials">
            <a
              href="https://github.com/Amaanuddin05"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-social-link"
              aria-label="GitHub"
            >GitHub</a>
            <a
              href="https://linkedin.com/in/amaanuddin"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-social-link"
              aria-label="LinkedIn"
            >LinkedIn</a>
          </div>
          <span class="footer-year" aria-label="Year 2025">© 2025</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* ── Footer ──────────────────────────────────────── */
    .footer {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding: 2rem 0 2.5rem;
    }

    .footer-inner {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 2rem;
    }

    /* Left */
    .footer-identity {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .footer-name {
      font-family: 'ClashDisplay', 'Plus Jakarta Sans', sans-serif;
      font-size: 0.9375rem;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: #F2F2F2;
    }

    .footer-role {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.625rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      /* #9E9EAF: AA */
      color: #9E9EAF;
    }

    .footer-built {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.5625rem;
      letter-spacing: 0.06em;
      color: rgba(158, 158, 175, 0.5);
      margin-top: 0.25rem;
    }

    /* Center */
    .footer-nav {
      display: flex;
      gap: 1.75rem;
    }

    .footer-nav-link {
      font-size: 0.8125rem;
      /* #9E9EAF: AA */
      color: #9E9EAF;
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-nav-link:hover {
      color: #F2F2F2;
    }

    .footer-nav-link:focus-visible {
      outline: 2px solid #2563EB;
      outline-offset: 2px;
      border-radius: 2px;
    }

    /* Right */
    .footer-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .footer-socials {
      display: flex;
      gap: 1.25rem;
    }

    .footer-social-link {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      letter-spacing: 0.06em;
      /* #9E9EAF: AA */
      color: #9E9EAF;
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-social-link:hover {
      color: #F2F2F2;
    }

    .footer-social-link:focus-visible {
      outline: 2px solid #2563EB;
      outline-offset: 2px;
      border-radius: 2px;
    }

    .footer-year {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.5625rem;
      letter-spacing: 0.08em;
      color: rgba(158, 158, 175, 0.4);
    }

    /* ── Responsive ──────────────────────────────────── */
    @media (max-width: 768px) {
      .footer-inner {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        text-align: center;
      }

      .footer-identity {
        align-items: center;
      }

      .footer-nav {
        justify-content: center;
        flex-wrap: wrap;
        gap: 1rem 1.5rem;
      }

      .footer-right {
        align-items: center;
      }
    }
  `],
})
export class FooterComponent {}
