import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { AboutPlaceForm } from './forms/AboutPlaceForm';
import { CharacteristicsForm } from './forms/CharacteristicsForm';
import { InterdisciplinarityForm } from './forms/InterdisciplinarityForm';
import { InclusionForm } from './forms/InclusionForm';
import { TechnologiesForm } from './forms/TechnologiesForm';
import { PedagogicalForm } from './forms/PedagogicalForm';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface SpaceFormData {
  [key: string]: any;
}

const FORM_STEPS = [
  { title: 'About the Place', component: AboutPlaceForm },
  { title: 'Characteristics', component: CharacteristicsForm },
  { title: 'Interdisciplinarity', component: InterdisciplinarityForm },
  { title: 'Inclusion & Accessibility', component: InclusionForm },
  { title: 'Technologies', component: TechnologiesForm },
  { title: 'Pedagogical Information', component: PedagogicalForm },
];

const getInitialStepData = (stepIndex: number): SpaceFormData => {
  const step = FORM_STEPS[stepIndex];
  if (step.component === AboutPlaceForm) {
    return {
      name: '',
      visit_date: '',
      address: '',
      contact: '',
      email: '',
      description: '',
      media_urls: [],
    };
  }
  return {};
};

export const RegistrationCarousel: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<SpaceFormData[]>(() =>
    FORM_STEPS.map((_, index) => getInitialStepData(index))
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const initialStepDataString = JSON.stringify(FORM_STEPS.map((_, index) => getInitialStepData(index)));

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const currentStepDataString = JSON.stringify(stepData);
      if (currentStepDataString !== initialStepDataString) {
        event.preventDefault();
        event.returnValue = 'Você tem alterações não salvas. Tem certeza que deseja sair? As informações inseridas serão perdidas.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [stepData, initialStepDataString]);

  const handleNext = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoBackToList = () => {
    navigate('/spaces');
  };

  const handleStepData = useCallback(
    (stepIndex: number) => (newData: SpaceFormData) => {
      setStepData((prev) => {
        const newStepData = [...prev];
        newStepData[stepIndex] = { ...newStepData[stepIndex], ...newData };
        return newStepData;
      });
    },
    []
  );

  const handleSubmit = async () => {
    if (!user) {
      alert('Authentication error. Please log in again.');
      return;
    }

    setLoading(true);

    try {
      const completeData = stepData.reduce(
        (acc, step) => ({ ...acc, ...step }),
        { user_id: user.id }
      );

      const { error: dbError } = await supabase
        .from('spaces')
        .insert([completeData]);

      if (dbError) {
        throw new Error('Error saving space to database: ' + dbError.message);
      }

      alert('Space registered successfully!');
      navigate('/spaces');
    } catch (error: any) {
      console.error('Error during submission:', error.message);
      alert('An error occurred during submission. Please try again. ' + error.message);
    } finally {
      setLoading(false);
      stepData.forEach((step) => {
        if (step.media_urls) {
          step.media_urls.forEach((url: string) => {
            if (url.startsWith('blob:')) {
              URL.revokeObjectURL(url);
            }
          });
        }
      });
    }
  };

  const CurrentFormComponent = FORM_STEPS?.[currentStep]?.component;
  const isLastStep = currentStep === FORM_STEPS.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Botão com ícone de casinha */}
            <button
              onClick={handleGoBackToList}
              className="text-gray-500 hover:text-blue-600 transition-colors"
              title="Back to List"
            >
              <Home className="w-6 h-6" />
            </button>

            <h1 className="text-2xl font-bold text-gray-900">Register New Space</h1>

            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {FORM_STEPS.length}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center">
              {FORM_STEPS.map((_, index) => (
                <React.Fragment key={index}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < FORM_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {FORM_STEPS.map((step, index) => (
                <span
                  key={index}
                  className={`text-xs ${
                    index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {FORM_STEPS?.[currentStep]?.title}
          </h2>

          {CurrentFormComponent && (
            <CurrentFormComponent
              data={stepData[currentStep]}
              onDataChange={handleStepData(currentStep)}
            />
          )}

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-4">
              {!isLastStep ? (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
