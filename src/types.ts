
export enum Category {
  Work = 'Work',
  Estudio = 'Estudio',
  Personal = 'Personal',
  Familia = 'Familia',
  Descanso = 'Descanso',
}

export interface Task {
  id: number;
  startTime: string;
  endTime: string;
  emoji: string;
  activity: string;
  category: Category;
  completed: boolean;
  notificationsEnabled: boolean;
}