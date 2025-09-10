import React, { useState } from 'react';

interface OnboardingModalProps {
  onClose: () => void;
}

const onboardingSteps = [
  {
    icon: '👋',
    title: '¡Te damos la bienvenida a Focus Block!',
    description: 'Una app diseñada para ayudarte a organizar tu día en bloques de tiempo y potenciar tu concentración.',
  },
  {
    icon: '↔️',
    title: 'Gestos Principales',
    description: 'Desliza una tarea hacia la DERECHA para completarla. Deslízala hacia la IZQUIERDA para eliminarla.',
  },
  {
    icon: '👆',
    title: 'Edita y Reordena',
    description: 'Haz DOBLE CLIC en una tarea para editar sus detalles. Mantén PRESIONADO y arrastra para cambiar su orden.',
  },
  {
    icon: '🔍',
    title: 'Filtra y Busca',
    description: 'Usa los controles en la parte superior para buscar y filtrar tus tareas por categoría o estado (completas/incompletas).',
  },
  {
    icon: '🗓️',
    title: 'Prepara tu Día',
    description: 'Al final de la jornada, haz clic en "Preparar Día" para ver tu resumen y reiniciar las tareas para el día siguiente.',
  },
  {
    icon: '🚀',
    title: '¡Todo Listo!',
    description: 'Ya conoces lo esencial. ¡Esperamos que Focus Block te ayude a tener días súper productivos! Mucho éxito, Jere.',
  },
];

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-md mx-auto flex flex-col text-center transform transition-all duration-300 scale-100"
      >
        <div className="text-6xl mb-4">{step.icon}</div>
        <h2 id="onboarding-title" className="text-2xl font-bold mb-3 text-cyan-600 dark:text-cyan-300">{step.title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 min-h-[72px]">{step.description}</p>
        
        <div className="flex justify-center items-center space-x-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                index === currentStep ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            ></div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {currentStep > 0 ? (
             <button
              onClick={handlePrev}
              className="w-1/3 px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold transition-colors"
            >
              Atrás
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-1/3 px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold transition-colors"
            >
              Omitir
            </button>
          )}

          <button
            onClick={handleNext}
            className="w-2/3 px-4 py-2.5 rounded-lg text-white font-semibold bg-cyan-600 hover:bg-cyan-500 transition-colors focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-700"
          >
            {isLastStep ? '¡Entendido!' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
