import { Component, effect, inject, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../../../core/services/notes.service';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private notesService = inject(NotesService);

  @Input() active: string | null = null;
  @Output() activeChange = new EventEmitter<string | null>();

  tagsSig = signal<string[]>([]);

  constructor() {
    // refresh tag list whenever notes change
    effect(() => {
      const tags = this.notesService.getAllTags();
      this.tagsSig.set(tags);
    });
  }

  // PUBLIC_INTERFACE
  choose(tag: string | null) {
    /** Select a tag to filter by (or All when null). */
    this.active = tag;
    this.activeChange.emit(tag);
  }

  isActive(tag: string | null) {
    return this.active === tag;
  }
}
