import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  signal,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <div
      class="cursor-dot"
      [style.transform]="'translate(' + dotX() + 'px, ' + dotY() + 'px)'"
    ></div>
    <div
      class="cursor-ring"
      [style.transform]="'translate(' + ringX() + 'px, ' + ringY() + 'px)'"
      [class.cursor-ring--hover]="isHovering()"
    ></div>
  `,
  styles: [`
    :host {
      pointer-events: none;
      position: fixed;
      inset: 0;
      z-index: 9999;
      will-change: transform;
    }

    .cursor-dot {
      position: fixed;
      top: -3px;
      left: -3px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #F2F2F2;
      pointer-events: none;
      will-change: transform;
      transition: width 0.2s, height 0.2s, top 0.2s, left 0.2s, background 0.2s;
    }

    .cursor-ring {
      position: fixed;
      top: -12px;
      left: -12px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid rgba(242, 242, 242, 0.4);
      pointer-events: none;
      will-change: transform;
      transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                  height 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                  top 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                  left 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                  border-color 0.3s;
    }

    .cursor-ring--hover {
      width: 40px;
      height: 40px;
      top: -20px;
      left: -20px;
      border-color: rgba(37, 99, 235, 0.7);
    }

    @media (hover: none) and (pointer: coarse) {
      :host { display: none; }
    }
  `],
})
export class CursorComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  dotX = signal(0);
  dotY = signal(0);
  ringX = signal(0);
  ringY = signal(0);
  isHovering = signal(false);

  private ringXVal = 0;
  private ringYVal = 0;
  private dotXVal = 0;
  private dotYVal = 0;
  private rafId = 0;
  private isBrowser = isPlatformBrowser(this.platformId);

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.startRingLerp();
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    this.dotXVal = e.clientX;
    this.dotYVal = e.clientY;
    this.dotX.set(e.clientX);
    this.dotY.set(e.clientY);
  }

  @HostListener('document:mouseover', ['$event'])
  onMouseOver(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    this.isHovering.set(
      !!target.closest('a, button, [role="button"], [data-cursor-hover]')
    );
  }

  private startRingLerp(): void {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      this.ringXVal = lerp(this.ringXVal, this.dotXVal, 0.1);
      this.ringYVal = lerp(this.ringYVal, this.dotYVal, 0.1);
      this.ringX.set(Math.round(this.ringXVal * 10) / 10);
      this.ringY.set(Math.round(this.ringYVal * 10) / 10);
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }
}
