import React from 'react';
import { Task } from '../types';

interface DeleteConfirmationModalProps {
  task: Task | undefined;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ task, onClose, onConfirm }) => {
  if (!task) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="delete-confirm-title" className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Confirmar Eliminación</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          ¿Estás seguro de que quieres eliminar la tarea: <strong className="font-semibold">"{task.activity}"</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-white font-semibold bg-red-600 hover:bg-red-500 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
