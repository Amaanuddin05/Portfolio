import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  signal,
  computed,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  action: () => void;
  icon: string;
}

@Component({
  selector: 'app-command-palette',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <div
        class="cp-backdrop"
        (click)="close()"
        role="presentation"
        aria-hidden="true"
      ></div>

      <!-- Palette -->
      <div
        class="cp-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div class="cp-header">
          <svg class="cp-search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M13 13 L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input
            #searchInput
            class="cp-input"
            type="text"
            placeholder="Search or navigate..."
            [value]="query()"
            (input)="onInput($event)"
            (keydown)="onKeyDown($event)"
            aria-label="Search commands"
            autocomplete="off"
            spellcheck="false"
          />
          <kbd class="cp-esc" (click)="close()">ESC</kbd>
        </div>

        <div class="cp-list" role="listbox">
          @for (item of filteredItems(); track item.id; let i = $index) {
            <button
              class="cp-item"
              [class.cp-item--active]="activeIndex() === i"
              role="option"
              [attr.aria-selected]="activeIndex() === i"
              (click)="execute(item)"
              (mouseenter)="activeIndex.set(i)"
            >
              <span class="cp-item-icon" [innerHTML]="item.icon" aria-hidden="true"></span>
              <span class="cp-item-content">
                <span class="cp-item-label">{{ item.label }}</span>
                <span class="cp-item-desc">{{ item.description }}</span>
              </span>
              <svg class="cp-item-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          }

          @if (filteredItems().length === 0) {
            <div class="cp-empty" role="status">No results for "{{ query() }}"</div>
          }
        </div>

        <div class="cp-footer">
          <span><kbd>↑↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Select</span>
          <span><kbd>ESC</kbd> Close</span>
        </div>
      </div>
    }
  `,
  styles: [`
    .cp-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      z-index: 9000;
      animation: cp-fade-in 0.15s ease;
    }

    .cp-panel {
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      width: min(600px, calc(100vw - 2rem));
      background: #121216;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.04),
        0 24px 60px rgba(0, 0, 0, 0.6),
        0 0 0 1px rgba(37, 99, 235, 0.1),
        0 0 40px rgba(37, 99, 235, 0.06);
      z-index: 9001;
      overflow: hidden;
      animation: cp-slide-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes cp-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes cp-slide-in {
      from { opacity: 0; transform: translateX(-50%) scale(0.96) translateY(-8px); }
      to { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
    }

    .cp-header {
      display: flex;
      align-items: center;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      gap: 0.75rem;
    }

    .cp-search-icon {
      width: 18px;
      height: 18px;
      color: #4A4A5A;
      flex-shrink: 0;
    }

    .cp-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #F2F2F2;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.9375rem;
      font-weight: 400;
    }

    .cp-input::placeholder {
      color: #4A4A5A;
    }

    .cp-esc {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      color: #4A4A5A;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      padding: 0.2rem 0.5rem;
      cursor: pointer;
      transition: color 0.15s, border-color 0.15s;
    }

    .cp-esc:hover {
      color: #8A8A9A;
      border-color: rgba(255, 255, 255, 0.15);
    }

    .cp-list {
      padding: 0.5rem;
      max-height: 320px;
      overflow-y: auto;
    }

    .cp-item {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      border: none;
      background: transparent;
      cursor: pointer;
      text-align: left;
      transition: background 0.1s;
      color: #F2F2F2;
    }

    .cp-item--active {
      background: rgba(37, 99, 235, 0.12);
    }

    .cp-item--active .cp-item-arrow {
      opacity: 1;
    }

    .cp-item-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 1rem;
      line-height: 1;
    }

    .cp-item-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .cp-item-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #F2F2F2;
    }

    .cp-item-desc {
      font-size: 0.75rem;
      color: #4A4A5A;
    }

    .cp-item-arrow {
      width: 16px;
      height: 16px;
      color: #2563EB;
      opacity: 0;
      transition: opacity 0.1s;
      flex-shrink: 0;
    }

    .cp-empty {
      padding: 2rem;
      text-align: center;
      color: #4A4A5A;
      font-size: 0.875rem;
    }

    .cp-footer {
      display: flex;
      gap: 1.5rem;
      padding: 0.75rem 1.25rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6875rem;
      color: #4A4A5A;
    }

    .cp-footer kbd {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      padding: 0.1rem 0.35rem;
      font-family: inherit;
      margin-right: 0.25rem;
    }

    @media (prefers-reduced-motion: reduce) {
      .cp-backdrop, .cp-panel { animation: none; }
    }
  `],
})
export class CommandPaletteComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  open = signal(false);
  query = signal('');
  activeIndex = signal(0);

  private readonly commands: CommandItem[] = [
    {
      id: 'about',
      label: 'About Amaan',
      description: 'Learn about me and my background',
      icon: '👤',
      action: () => this.scrollTo('#about'),
    },
    {
      id: 'work',
      label: 'Selected Work',
      description: 'View my featured projects',
      icon: '🎨',
      action: () => this.scrollTo('#work'),
    },
    {
      id: 'skills',
      label: 'Skills & Stack',
      description: 'Technologies and tools I use',
      icon: '⚡',
      action: () => this.scrollTo('#skills'),
    },
    {
      id: 'process',
      label: 'My Process',
      description: 'How I approach engineering problems',
      icon: '🔧',
      action: () => this.scrollTo('#process'),
    },
    {
      id: 'contact',
      label: 'Contact',
      description: 'Get in touch with me',
      icon: '✉️',
      action: () => this.scrollTo('#contact'),
    },
    {
      id: 'resume',
      label: 'Download Resume',
      description: 'Get my latest resume (PDF)',
      icon: '📄',
      action: () => window.open('/resume.pdf', '_blank'),
    },
    {
      id: 'github',
      label: 'GitHub',
      description: 'github.com/Amaanuddin05',
      icon: '💻',
      action: () => window.open('https://github.com/Amaanuddin05', '_blank'),
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      description: 'Connect on LinkedIn',
      icon: '🔗',
      action: () => window.open('https://linkedin.com/in/amaanuddin', '_blank'),
    },
  ];

  filteredItems = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.commands;
    return this.commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    if (!this.isBrowser) return;
    document.addEventListener('keydown', this.handleGlobalKeyDown);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    document.removeEventListener('keydown', this.handleGlobalKeyDown);
  }

  private handleGlobalKeyDown = (e: KeyboardEvent): void => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      this.open() ? this.close() : this.openPalette();
    }
  };

  openPalette(): void {
    this.open.set(true);
    this.query.set('');
    this.activeIndex.set(0);
    // Focus input on next tick
    setTimeout(() => {
      const input = document.querySelector('.cp-input') as HTMLInputElement;
      input?.focus();
    }, 50);
  }

  close(): void {
    this.open.set(false);
    this.query.set('');
  }

  onInput(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
    this.activeIndex.set(0);
  }

  onKeyDown(e: KeyboardEvent): void {
    const items = this.filteredItems();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.activeIndex.set((this.activeIndex() + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.activeIndex.set((this.activeIndex() - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = items[this.activeIndex()];
      if (item) this.execute(item);
    } else if (e.key === 'Escape') {
      this.close();
    }
  }

  execute(item: CommandItem): void {
    this.close();
    item.action();
  }

  private scrollTo(selector: string): void {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
