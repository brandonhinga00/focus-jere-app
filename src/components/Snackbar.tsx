import React, { useEffect, useState } from 'react';

interface SnackbarProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, onUndo, onDismiss, duration = 5000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 50); // Short delay to allow mounting before transition
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // Allow time for fade-out animation
    }, duration);

    return () => {
        clearTimeout(showTimer);
        clearTimeout(dismissTimer);
    };
  }, [onDismiss, duration]);

  const handleUndoClick = () => {
    setVisible(false);
    setTimeout(onUndo, 300); // Allow time for fade-out before calling undo
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-800 dark:bg-gray-700 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[320px] transition-all duration-300 transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <span>{message}</span>
      <button
        onClick={handleUndoClick}
        className="ml-4 font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        Deshacer
      </button>
    </div>
  );
};

export default Snackbar;
