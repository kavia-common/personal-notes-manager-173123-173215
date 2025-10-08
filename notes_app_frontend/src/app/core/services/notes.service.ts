import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Note } from '../../shared/models/note.model';
import { Router } from '@angular/router';

const STORAGE_KEY = 'pnm.notes.v1';

function uuid(): string {
  // Simple UUID generator using crypto if available, fallback to Math.random
  const hasCrypto = typeof globalThis !== 'undefined' && (globalThis as any).crypto && (globalThis as any).crypto.getRandomValues;
  const getRandom = (max: number) => {
    if (hasCrypto) {
      const arr = new Uint8Array(1);
      (globalThis as any).crypto.getRandomValues(arr);
      return arr[0] % max;
    }
    return Math.floor(Math.random() * max);
  };
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = getRandom(16);
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

@Injectable({ providedIn: 'root' })
export class NotesService {
  private router = inject(Router);
  private notesSubject = new BehaviorSubject<Note[]>(this.load());
  notes$ = this.notesSubject.asObservable();

  private load(): Note[] {
    try {
      const ls = typeof globalThis !== 'undefined' ? (globalThis as any).localStorage : undefined;
      if (ls) {
        const raw = ls.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Note[];
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch {
      // ignore storage failures
    }
    // seed with a sample note
    const now = new Date().toISOString();
    return [
      {
        id: uuid(),
        title: 'Welcome to Personal Notes',
        content:
          'This is a demo note. Use the + New Note button to create notes. Click a note to edit, or use the menu to delete.',
        tags: ['Getting Started', 'Info'],
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  private persist(): void {
    try {
      const ls = typeof globalThis !== 'undefined' ? (globalThis as any).localStorage : undefined;
      if (ls) {
        ls.setItem(STORAGE_KEY, JSON.stringify(this.notesSubject.value));
      }
    } catch {
      // ignore storage failures
    }
  }

  // PUBLIC_INTERFACE
  getAll(): Note[] {
    /** Returns a snapshot of all notes. */
    return this.notesSubject.value;
  }

  // PUBLIC_INTERFACE
  getById(id: string): Note | undefined {
    /** Returns a single note by id if present. */
    return this.notesSubject.value.find(n => n.id === id);
  }

  // PUBLIC_INTERFACE
  create(partial: { title: string; content?: string; tags?: string[] }): Note {
    /** Creates a new note and returns it. */
    const now = new Date().toISOString();
    const newNote: Note = {
      id: uuid(),
      title: partial.title.trim(),
      content: partial.content?.trim() ?? '',
      tags: partial.tags ?? [],
      createdAt: now,
      updatedAt: now,
    };
    const next = [newNote, ...this.notesSubject.value];
    this.notesSubject.next(next);
    this.persist();
    return newNote;
  }

  // PUBLIC_INTERFACE
  update(id: string, update: { title: string; content?: string; tags?: string[] }): Note | undefined {
    /** Updates an existing note, returns the updated note if found. */
    let updated: Note | undefined;
    const next = this.notesSubject.value.map(n => {
      if (n.id === id) {
        updated = {
          ...n,
          title: update.title.trim(),
          content: update.content?.trim() ?? '',
          tags: update.tags ?? [],
          updatedAt: new Date().toISOString(),
        };
        return updated;
      }
      return n;
    });
    this.notesSubject.next(next);
    this.persist();
    return updated;
  }

  // PUBLIC_INTERFACE
  delete(id: string): void {
    /** Deletes a note by id. */
    const next = this.notesSubject.value.filter(n => n.id !== id);
    this.notesSubject.next(next);
    this.persist();
    // if currently viewing this note, navigate back to /notes
    const currentUrl = this.router.url || '';
    if (currentUrl.includes(`/notes/${id}`)) {
      this.router.navigate(['/notes']);
    }
  }

  // PUBLIC_INTERFACE
  getAllTags(): string[] {
    /** Returns a list of unique tags across all notes. */
    const set = new Set<string>();
    this.notesSubject.value.forEach(n => (n.tags ?? []).forEach(t => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }
}
