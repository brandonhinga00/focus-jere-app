import React from 'react';

interface DragToDeleteZoneProps {
  isVisible: boolean;
  isOver: boolean;
}

const DragToDeleteZone: React.FC<DragToDeleteZoneProps> = ({ isVisible, isOver }) => {
  const containerClasses = `
    fixed bottom-6 left-6 z-50 transition-all duration-300
    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}
  `;

  const iconContainerClasses = `
    w-20 h-20 rounded-full flex items-center justify-center
    transition-all duration-300
    ${isOver ? 'bg-red-500 scale-125' : 'bg-gray-700 dark:bg-gray-800 shadow-lg'}
  `;

  return (
    <div className={containerClasses} aria-hidden={!isVisible}>
      <div className={iconContainerClasses}>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 text-white transition-transform duration-300 ${isOver ? 'rotate-12' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

export default DragToDeleteZone;
