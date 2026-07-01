export interface Scene {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  sceneFile: string;
  compFile: string;
  renderFolder: string;
  version: string;
  duration: number; // in seconds
  cost: number;
  estimatedHours?: number;
  bookedHours?: number;
  estimatedHours3D?: number;
  bookedHours3D?: number;
  estimatedHoursComp?: number;
  bookedHoursComp?: number;
  color: string;
  progress: {
    stage3D: number; // 0-100
    lighting: number;
    rendering: number;
    compositing: number;
  };
  status: {
    stage3D: { completed: boolean; hasNotes: boolean };
    lighting: { completed: boolean; hasNotes: boolean };
    rendering: { completed: boolean; hasNotes: boolean };
    compositing: { completed: boolean; hasNotes: boolean };
  };
  references: {
    images: string[];
    modelLink: string;
  };
  audio: {
    title: string;
    file: string;
    description?: string;
  };
  renderPasses: {
    name: string;
    progress: number;
    color: string;
  }[];
  assets: {
    name: string;
    type: 'model' | 'texture' | 'sim' | 'other';
    cost?: number;
    status?: 'purchase' | 'create' | 'existing' | 'provided';
    sourceUrl?: string;
  }[];
  budgetCategories?: string[];
  schedule: {
    stage3D: { start: number; duration: number };
    lighting: { start: number; duration: number };
    rendering: { start: number; duration: number };
    compositing: { start: number; duration: number };
  };
  history: {
    version: string;
    date: string;
    update: string;
    note: string;
    categories?: string[];
    type?: 'note' | 'update';
  }[];
  nodeEditorData?: {
    nodes: EditorNode[];
  };
}

export interface EditorNode {
  id: string;
  type: 'shape' | 'text' | 'arrow' | 'note' | 'image' | 'line';
  x: number;
  y: number;
  x2?: number; // For lines and arrows
  y2?: number; // For lines and arrows
  width?: number;
  height?: number;
  content?: string;
  src?: string;
  color?: string;
  rotation?: number;
  shapeType?: 'square' | 'circle' | 'triangle';
  toId?: string;
}

export type TabType = 'Project' | 'Budget' | 'Schedule' | 'References' | 'Nodes' | 'Settings';

export interface Assignment {
  id: string;
  sceneId: string;
  hours: number;
  type: '3D' | 'Comp';
  description: string;
}

