export interface Tag {
  id: string;
  name: string;
}

// PUBLIC_INTERFACE
export interface Note {
  /** Unique identifier for the note */
  id: string;
  /** Required title for the note */
  title: string;
  /** Optional content/body for the note */
  content?: string;
  /** Optional tags for filtering */
  tags?: string[];
  /** ISO timestamp of creation */
  createdAt: string;
  /** ISO timestamp of last update */
  updatedAt: string;
}
