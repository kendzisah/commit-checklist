export interface ChecklistItem {
  question: string;
  subItems?: ChecklistItem[];
}
export interface ChecklistGroup {
  title: string;
  note?: string;
  required?: boolean;
  preQuestion?: string; 
  items: ChecklistItem[];
}

  