import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NotesService } from '../../../../core/services/notes.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { NoteEditorModalComponent } from '../note-editor-modal/note-editor-modal.component';
import { Note } from '../../../../shared/models/note.model';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-note-details',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, NavbarComponent, NoteEditorModalComponent],
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss'],
})
export class NoteDetailsComponent {
  private route = inject(ActivatedRoute);
  private notesService = inject(NotesService);

  search = signal('');
  note = signal<Note | null>(null);
  modalOpen = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.note.set(this.notesService.getById(id) ?? null);
  }

  openEdit() {
    this.modalOpen.set(true);
  }
  onCancel() {
    this.modalOpen.set(false);
  }
  onSave(payload: { title: string; content?: string; tags?: string[] }) {
    const n = this.note();
    if (!n) return;
    const updated = this.notesService.update(n.id, payload);
    if (updated) this.note.set(updated);
    this.modalOpen.set(false);
  }
  onDelete() {
    const n = this.note();
    if (!n) return;
    const ok =
      typeof globalThis !== 'undefined' && (globalThis as any).confirm
        ? (globalThis as any).confirm(`Delete "${n.title}"?`)
        : true;
    if (ok) {
      this.notesService.delete(n.id);
    }
  }
}
