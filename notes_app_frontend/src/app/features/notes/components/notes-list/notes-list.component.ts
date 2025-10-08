import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotesService } from '../../../../core/services/notes.service';
import { Note } from '../../../../shared/models/note.model';
import { NoteCardComponent } from '../note-card/note-card.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NoteEditorModalComponent } from '../note-editor-modal/note-editor-modal.component';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NoteCardComponent, NavbarComponent, SidebarComponent, NoteEditorModalComponent],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})
export class NotesListComponent {
  private notesService = inject(NotesService);

  search = signal('');
  activeTag = signal<string | null>(null);
  modalOpen = signal(false);
  editingNote = signal<Note | null>(null);

  notes = signal<Note[]>(this.notesService.getAll());

  constructor() {
    effect(() => {
      // update list when service emits
      this.notes.set(this.notesService.getAll());
    });
  }

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    const tag = this.activeTag();
    return this.notes()
      .filter(n => {
        const matchesQuery = !q || n.title.toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q);
        const matchesTag = !tag || (n.tags || []).map(t => t.toLowerCase()).includes(tag.toLowerCase());
        return matchesQuery && matchesTag;
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  });

  openCreate() {
    this.editingNote.set(null);
    this.modalOpen.set(true);
  }

  openEdit(note: Note) {
    this.editingNote.set(note);
    this.modalOpen.set(true);
  }

  handleSave(payload: { title: string; content?: string; tags?: string[] }) {
    const editing = this.editingNote();
    if (editing) {
      this.notesService.update(editing.id, payload);
    } else {
      this.notesService.create(payload);
    }
    this.modalOpen.set(false);
    this.editingNote.set(null);
  }

  handleCancel() {
    this.modalOpen.set(false);
    this.editingNote.set(null);
  }

  deleteNote(note: Note) {
    const ok =
      typeof globalThis !== 'undefined' && (globalThis as any).confirm
        ? (globalThis as any).confirm(`Delete note "${note.title}"? This cannot be undone.`)
        : true;
    if (ok) {
      this.notesService.delete(note.id);
    }
  }
}
