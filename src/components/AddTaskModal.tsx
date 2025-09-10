import React, { useState, useEffect } from 'react';
import { Task, Category } from '../types';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onSave }) => {
  const [formData, setFormData] = useState<Task>(task);
  const [timeError, setTimeError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(task);
  }, [task]);

  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      if (formData.endTime <= formData.startTime) {
        setTimeError('La hora de fin debe ser posterior a la hora de inicio.');
      } else {
        setTimeError(null);
      }
    }
  }, [formData.startTime, formData.endTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
     if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timeError) {
      return;
    }
    onSave(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="edit-task-title" className="text-2xl font-bold mb-6 text-cyan-600 dark:text-cyan-300">Editar Tarea</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="activity" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Actividad</label>
            <input
              type="text"
              id="activity"
              name="activity"
              value={formData.activity}
              onChange={handleChange}
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              required
              maxLength={50}
            />
            <div className={`text-right text-xs mt-1 ${formData.activity.length >= 50 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
              {formData.activity.length} / 50
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="emoji" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Emoji</label>
              <input
                type="text"
                id="emoji"
                name="emoji"
                value={formData.emoji}
                onChange={handleChange}
                maxLength={2}
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="category" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Categoría</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                {Object.values(Category).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Hora Inicio</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Hora Fin</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>
            </div>
            {timeError && <p className="text-red-500 text-sm mt-2">{timeError}</p>}
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Activar notificaciones</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="notificationsEnabled"
                name="notificationsEnabled"
                checked={formData.notificationsEnabled}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!!timeError}
              className="px-4 py-2 rounded-md text-white font-semibold bg-cyan-600 hover:bg-cyan-500 transition-colors disabled:bg-cyan-300 dark:disabled:bg-cyan-800 disabled:cursor-not-allowed"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;