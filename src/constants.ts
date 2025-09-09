import { Task, Category } from './types';

// FIX: Added 'notificationsEnabled: true' to each task object to match the required type.
export const SCHEDULE_DATA: Omit<Task, 'id' | 'completed'>[] = [
  {"startTime": "08:00", "endTime": "08:15", "emoji": "⏰", "activity": "Despertar, Agua, Cama", "category": Category.Personal, "notificationsEnabled": true},
  {"startTime": "08:15", "endTime": "08:30", "emoji": "🤸", "activity": "Ejercicios", "category": Category.Personal, "notificationsEnabled": true},
  {"startTime": "08:30", "endTime": "08:45", "emoji": "🥣", "activity": "Desayuno", "category": Category.Personal, "notificationsEnabled": true},
  {"startTime": "08:45", "endTime": "09:00", "emoji": "📚", "activity": "Lectura", "category": Category.Estudio, "notificationsEnabled": true},
  {"startTime": "09:00", "endTime": "10:30", "emoji": "💻", "activity": "Work", "category": Category.Work, "notificationsEnabled": true},
  {"startTime": "10:30", "endTime": "11:00", "emoji": "👨‍🎓", "activity": "Estudio", "category": Category.Estudio, "notificationsEnabled": true},
  {"startTime": "11:00", "endTime": "12:30", "emoji": "💻", "activity": "Work", "category": Category.Work, "notificationsEnabled": true},
  {"startTime": "12:30", "endTime": "13:00", "emoji": "👨‍🎓", "activity": "Estudio", "category": Category.Estudio, "notificationsEnabled": true},
  {"startTime": "13:00", "endTime": "13:15", "emoji": "🍳", "activity": "Cocinar", "category": Category.Personal, "notificationsEnabled": true},
  {"startTime": "13:15", "endTime": "13:30", "emoji": "🍽", "activity": "Almorzar", "category": Category.Personal, "notificationsEnabled": true},
  {"startTime": "13:30", "endTime": "14:00", "emoji": "👨‍👩‍👧", "activity": "Familia", "category": Category.Familia, "notificationsEnabled": true},
  {"startTime": "14:00", "endTime": "15:00", "emoji": "💻", "activity": "Work", "category": Category.Work, "notificationsEnabled": true},
  {"startTime": "15:00", "endTime": "15:30", "emoji": "👨‍🎓", "activity": "Estudio", "category": Category.Estudio, "notificationsEnabled": true},
  {"startTime": "15:30", "endTime": "16:30", "emoji": "💻", "activity": "Work", "category": Category.Work, "notificationsEnabled": true},
  {"startTime": "16:30", "endTime": "17:00", "emoji": "👨‍🎓", "activity": "Estudio", "category": Category.Estudio, "notificationsEnabled": true},
  {"startTime": "17:00", "endTime": "17:15", "emoji": "☕", "activity": "Merienda", "category": Category.Personal, "notificationsEnabled": true},
  {"startTime": "17:15", "endTime": "19:30", "emoji": "💻", "activity": "Work", "category": Category.Work, "notificationsEnabled": true},
  {"startTime": "19:30", "endTime": "19:45", "emoji": "🏋", "activity": "Ejercicios", "category": Category.Personal, "notificationsEnabled": true},
  {"startTime": "19:45", "endTime": "20:15", "emoji": "📖", "activity": "Lectura", "category": Category.Estudio, "notificationsEnabled": true},
  {"startTime": "20:15", "endTime": "20:30", "emoji": "🧑‍🍳", "activity": "Cocinar", "category": Category.Personal, "notificationsEnabled": true},
  {"startTime": "20:30", "endTime": "20:45", "emoji": "🍲", "activity": "Cenar", "category": Category.Personal, "notificationsEnabled": true},
  {"startTime": "20:45", "endTime": "21:30", "emoji": "💻", "activity": "Work", "category": Category.Work, "notificationsEnabled": true},
  {"startTime": "21:30", "endTime": "21:45", "emoji": "👨‍👩‍👧", "activity": "Familia", "category": Category.Familia, "notificationsEnabled": true},
  {"startTime": "21:45", "endTime": "22:00", "emoji": "😌", "activity": "Relajación/Respiración", "category": Category.Descanso, "notificationsEnabled": true},
  {"startTime": "22:00", "endTime": "22:15", "emoji": "🛀", "activity": "Baño/ducha", "category": Category.Personal, "notificationsEnabled": true},
  {"startTime": "22:15", "endTime": "22:30", "emoji": "📱", "activity": "Tiempo libre (redes, ocio)", "category": Category.Personal, "notificationsEnabled": true},
  {"startTime": "22:30", "endTime": "22:45", "emoji": "📖", "activity": "Lectura ligera", "category": Category.Estudio, "notificationsEnabled": true},
  {"startTime": "22:45", "endTime": "23:00", "emoji": "🧘", "activity": "Meditación/Reflexión", "category": Category.Descanso, "notificationsEnabled": true},
  {"startTime": "23:00", "endTime": "23:30", "emoji": "📱", "activity": "Ocio", "category": Category.Personal, "notificationsEnabled": true},
  {"startTime": "23:30", "endTime": "23:45", "emoji": "👨‍👩‍👧", "activity": "Familia", "category": Category.Familia, "notificationsEnabled": true},
  {"startTime": "23:45", "endTime": "00:00", "emoji": "📋", "activity": "Preparar próximo día y descanso", "category": Category.Descanso, "notificationsEnabled": true}
];

export const CATEGORY_STYLES: Record<Category, {
  block: string;
  button: string;
  buttonActive: string;
}> = {
  [Category.Work]: {
    block: 'bg-sky-100 border-sky-300 dark:bg-sky-900/60 dark:border-sky-700',
    button: 'border-sky-500 text-sky-700 dark:text-sky-300 hover:bg-sky-500/10',
    buttonActive: 'bg-sky-500 text-white border-sky-500'
  },
  [Category.Estudio]: {
    block: 'bg-emerald-100 border-emerald-300 dark:bg-emerald-900/60 dark:border-emerald-700',
    button: 'border-emerald-500 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10',
    buttonActive: 'bg-emerald-500 text-white border-emerald-500'
  },
  [Category.Personal]: {
    block: 'bg-orange-100 border-orange-300 dark:bg-orange-900/60 dark:border-orange-700',
    button: 'border-orange-500 text-orange-700 dark:text-orange-300 hover:bg-orange-500/10',
    buttonActive: 'bg-orange-500 text-white border-orange-500'
  },
  [Category.Familia]: {
    block: 'bg-pink-100 border-pink-300 dark:bg-pink-900/60 dark:border-pink-700',
    button: 'border-pink-500 text-pink-700 dark:text-pink-300 hover:bg-pink-500/10',
    buttonActive: 'bg-pink-500 text-white border-pink-500'
  },
  [Category.Descanso]: {
    block: 'bg-indigo-100 border-indigo-300 dark:bg-indigo-900/60 dark:border-indigo-700',
    button: 'border-indigo-500 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/10',
    buttonActive: 'bg-indigo-500 text-white border-indigo-500'
  },
};
