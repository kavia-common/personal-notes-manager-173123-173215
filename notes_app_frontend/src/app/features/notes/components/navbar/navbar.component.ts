import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  /** Two-way bound search text */
  @Input({ alias: 'model' }) search: string = '';
  @Output() modelChange = new EventEmitter<string>();
  @Output() add = new EventEmitter<void>();

  onInput(event: any) {
    const target = event?.target as any;
    const value = target && typeof target.value === 'string' ? target.value : '';
    this.modelChange.emit(value);
  }

  onAdd() {
    this.add.emit();
  }
}
