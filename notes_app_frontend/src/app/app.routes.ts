import { Routes } from '@angular/router';
import { NotesListComponent } from './features/notes/components/notes-list/notes-list.component';
import { NoteDetailsComponent } from './features/notes/components/note-details/note-details.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'notes' },
  { path: 'notes', component: NotesListComponent },
  { path: 'notes/:id', component: NoteDetailsComponent },
  { path: '**', redirectTo: 'notes' },
];
