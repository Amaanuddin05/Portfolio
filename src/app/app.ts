import { Component, ChangeDetectionStrategy } from '@angular/core';

import { CursorComponent } from './shared/cursor/cursor.component';
import { PageLoaderComponent } from './shared/page-loader/page-loader.component';
import { CommandPaletteComponent } from './shared/command-palette/command-palette.component';
import { NavComponent } from './layout/nav/nav.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeroComponent } from './sections/hero/hero.component';
import { AboutComponent } from './sections/about/about.component';
import { WorkComponent } from './sections/work/work.component';
import { SkillsComponent } from './sections/skills/skills.component';
import { ProcessComponent } from './sections/process/process.component';
import { ContactComponent } from './sections/contact/contact.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CursorComponent,
    PageLoaderComponent,
    CommandPaletteComponent,
    NavComponent,
    FooterComponent,
    HeroComponent,
    AboutComponent,
    WorkComponent,
    SkillsComponent,
    ProcessComponent,
    ContactComponent,
  ],
  templateUrl: './app.html',
  styles: [`
    :host {
      display: block;
    }

    main {
      outline: none;
    }
  `],
})
export class App {
  onLoaded(): void {
    // Page loader has dismissed, focus main content for accessibility
    const main = document.getElementById('main-content');
    main?.focus();
  }
}
