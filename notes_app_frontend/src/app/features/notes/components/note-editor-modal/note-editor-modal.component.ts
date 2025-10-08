import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from '../../../../shared/models/note.model';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-note-editor-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './note-editor-modal.component.html',
  styleUrls: ['./note-editor-modal.component.scss'],
})
export class NoteEditorModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() open = false;
  @Input() note: Note | null = null;

  @Output() save = new EventEmitter<{ title: string; content?: string; tags?: string[] }>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('titleInput') titleInput!: ElementRef<any>;

  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    content: [''],
    tags: [''],
  });

  ngOnInit(): void {
    this.fillForm();
    if (this.open && typeof globalThis !== 'undefined' && (globalThis as any).setTimeout) {
      (globalThis as any).setTimeout(() => this.focusTitle(), 10);
    }
    if (typeof globalThis !== 'undefined' && (globalThis as any).document) {
      (globalThis as any).document.addEventListener('keydown', this.escHandler as any);
    }
  }

  ngOnDestroy(): void {
    if (typeof globalThis !== 'undefined' && (globalThis as any).document) {
      (globalThis as any).document.removeEventListener('keydown', this.escHandler as any);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['note'] || changes['open']) {
      this.fillForm();
      if (this.open && typeof globalThis !== 'undefined' && (globalThis as any).setTimeout) {
        (globalThis as any).setTimeout(() => this.focusTitle(), 10);
      }
    }
  }

  private escHandler = (e: any) => {
    if (this.open && e?.key === 'Escape') {
      this.onCancel();
    }
  };

  private focusTitle() {
    if (this.titleInput?.nativeElement) {
      this.titleInput.nativeElement.focus();
    }
  }

  private fillForm() {
    if (this.note) {
      this.form.patchValue({
        title: this.note.title,
        content: this.note.content || '',
        tags: (this.note.tags || []).join(', '),
      });
    } else {
      this.form.reset();
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  onSubmit() {
    if (this.form.invalid) return;
    const rawTags = (this.form.value.tags || '').toString();
    const tags = rawTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    this.save.emit({
      title: (this.form.value.title || '').toString(),
      content: (this.form.value.content || '').toString(),
      tags,
    });
  }
}
