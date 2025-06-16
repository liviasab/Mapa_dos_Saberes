import React, { useState, useEffect } from 'react';
import { Plus, Info, X } from 'lucide-react';
import { InterdisciplinarityData } from '../../../types';

interface InterdisciplinarityFormProps {
  data: Partial<InterdisciplinarityData>;
  onDataChange: (data: InterdisciplinarityData) => void;
}

const DISCIPLINE_OPTIONS = ['Mathematics', 'Physics', 'Chemistry'];

export const InterdisciplinarityForm: React.FC<InterdisciplinarityFormProps> = ({
  data,
  onDataChange,
}) => {
  const [disciplines, setDisciplines] = useState<string[]>(data.disciplines || []);
  const [mainTheme, setMainTheme] = useState(data.main_theme || '');
  const [otherThemes, setOtherThemes] = useState<string[]>(data.other_themes || ['']);
  const [associations, setAssociations] = useState(data.interdisciplinary_associations || [{ response: '', disciplines: [] }]);
  const [additionalInfo, setAdditionalInfo] = useState(data.additional_info || '');
  const [showContext, setShowContext] = useState(false);

  // Memoize filtered arrays to prevent unnecessary recalculations
  const filteredOtherThemes = React.useMemo(
    () => otherThemes.filter(theme => theme.trim() !== ''), 
    [otherThemes]
  );
  
  const filteredAssociations = React.useMemo(
    () => associations.filter(assoc => assoc.response.trim() !== ''),
    [associations]
  );

  // Use a ref to track the previous form data
  const prevFormDataRef = React.useRef<InterdisciplinarityData>();

  useEffect(() => {
    const formData = {
      disciplines,
      main_theme: mainTheme,
      other_themes: filteredOtherThemes,
      interdisciplinary_associations: filteredAssociations,
      additional_info: additionalInfo,
    };

    // Only update if the form data has actually changed
    if (JSON.stringify(prevFormDataRef.current) !== JSON.stringify(formData)) {
      onDataChange(formData);
      prevFormDataRef.current = formData;
    }
  }, [
    disciplines, 
    mainTheme, 
    filteredOtherThemes, 
    filteredAssociations, 
    additionalInfo, 
    onDataChange
  ]);

  const toggleDiscipline = (discipline: string) => {
    setDisciplines(prev =>
      prev.includes(discipline)
        ? prev.filter(d => d !== discipline)
        : [...prev, discipline]
    );
  };

  const addOtherTheme = () => {
    setOtherThemes([...otherThemes, '']);
  };

  const updateOtherTheme = (index: number, value: string) => {
    const updated = [...otherThemes];
    updated[index] = value;
    setOtherThemes(updated);
  };

  const removeOtherTheme = (index: number) => {
    setOtherThemes(otherThemes.filter((_, i) => i !== index));
  };

  const addAssociation = () => {
    setAssociations([...associations, { response: '', disciplines: [] }]);
  };

  const updateAssociation = (index: number, field: 'response' | 'disciplines', value: string | string[]) => {
    const updated = [...associations];
    updated[index] = { ...updated[index], [field]: value };
    setAssociations(updated);
  };

  const removeAssociation = (index: number) => {
    setAssociations(associations.filter((_, i) => i !== index));
  };

  const toggleAssociationDiscipline = (assocIndex: number, discipline: string) => {
    const assoc = associations[assocIndex];
    const newDisciplines = assoc.disciplines.includes(discipline)
      ? assoc.disciplines.filter(d => d !== discipline)
      : [...assoc.disciplines, discipline];
    updateAssociation(assocIndex, 'disciplines', newDisciplines);
  };

  return (
    <div className="space-y-8">
      {/* Disciplines Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Check the tags of the disciplines that can be worked on: *
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DISCIPLINE_OPTIONS.map((discipline) => (
            <label
              key={discipline}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={disciplines.includes(discipline)}
                onChange={() => toggleDiscipline(discipline)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">{discipline}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Context Button */}
      <div>
        <button
          type="button"
          onClick={() => setShowContext(true)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <Info className="w-5 h-5" />
          <span>Context</span>
        </button>
      </div>

      {/* Main Theme */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What is the main theme of the visited space? *
        </label>
        <input
          value={mainTheme}
          onChange={(e) => setMainTheme(e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter the main theme"
        />
      </div>

      {/* Other Themes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What other themes can be worked on in the visited space?
        </label>
        <div className="space-y-3">
          {otherThemes.map((theme, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 w-8">{index + 1} -</span>
              <input
                value={theme}
                onChange={(e) => updateOtherTheme(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter theme"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeOtherTheme(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOtherTheme}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Example Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Example: Nuclear Science Museum</h4>
        <p className="text-sm text-gray-600">
          This serves as a reference for how to structure your responses about interdisciplinary themes and connections.
        </p>
      </div>

      {/* Interdisciplinary Associations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          According to the theme, associate the discipline and topics that can be worked on in the space: *
        </label>
        <div className="space-y-4">
          {associations.map((assoc, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-2 mb-3">
                <span className="text-sm text-gray-500 mt-2 w-8">{index + 1} -</span>
                <div className="flex-1">
                  <textarea
                    value={assoc.response}
                    onChange={(e) => updateAssociation(index, 'response', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the topic or concept"
                    rows={2}
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeAssociation(index)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="ml-10">
                <p className="text-sm text-gray-600 mb-2">Associate with disciplines:</p>
                <div className="flex space-x-3">
                  {DISCIPLINE_OPTIONS.map((discipline) => (
                    <label key={discipline} className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={assoc.disciplines.includes(discipline)}
                        onChange={() => toggleAssociationDiscipline(index, discipline)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{discipline}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addAssociation}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Still about interdisciplinarity, present any additional relevant information:
        </label>
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          rows={4}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Any additional relevant information about interdisciplinarity..."
        />
      </div>

      {/* Context Modal */}
      {showContext && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Context Information</h3>
              <button
                onClick={() => setShowContext(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                This section focuses on understanding how different academic disciplines can be integrated 
                within the educational space you're registering.
              </p>
              <p>
                Consider how the space facilitates connections between Mathematics, Physics, and Chemistry 
                through its content, activities, and learning opportunities.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};