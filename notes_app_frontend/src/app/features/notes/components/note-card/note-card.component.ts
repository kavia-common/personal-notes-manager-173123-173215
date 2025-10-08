import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Note } from '../../../../shared/models/note.model';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss'],
})
export class NoteCardComponent {
  @Input() note!: Note;
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<Note>();

  onEdit(e: any) {
    if (e?.preventDefault) e.preventDefault();
    if (e?.stopPropagation) e.stopPropagation();
    this.edit.emit(this.note);
  }
  onDelete(e: any) {
    if (e?.preventDefault) e.preventDefault();
    if (e?.stopPropagation) e.stopPropagation();
    this.delete.emit(this.note);
  }
}
