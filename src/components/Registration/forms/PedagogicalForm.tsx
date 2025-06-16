import React, { useState, useEffect } from 'react';
import { Plus, X, Info } from 'lucide-react';

interface PedagogicalData {
  contents: string[];
  objectives: string[];
  methodologies: string[];
  evaluations: string[];
  learning_objective: string;
  general_methodology: string;
  society_relationship: string;
  teacher_contribution: string;
  recommended_references: string;
}

interface PedagogicalFormProps {
  data: Partial<PedagogicalData>;
  onDataChange: (data: PedagogicalData) => void;
  onSubmit?: (data: PedagogicalData) => void;
}

export const PedagogicalForm: React.FC<PedagogicalFormProps> = ({
  data,
  onDataChange
}) => {
  const [contents, setContents] = useState<string[]>(data.contents || ['']);
  const [objectives, setObjectives] = useState<string[]>(data.objectives || ['']);
  const [methodologies, setMethodologies] = useState<string[]>(data.methodologies || ['']);
  const [evaluations, setEvaluations] = useState<string[]>(data.evaluations || ['']);
  const [learningObjective, setLearningObjective] = useState(data.learning_objective || '');
  const [generalMethodology, setGeneralMethodology] = useState(data.general_methodology || '');
  const [societyRelationship, setSocietyRelationship] = useState(data.society_relationship || '');
  const [teacherContribution, setTeacherContribution] = useState(data.teacher_contribution || '');
  const [recommendedReferences, setRecommendedReferences] = useState(data.recommended_references || '');
  const [showContext, setShowContext] = useState(false);

  // Memoize the filtered arrays to prevent unnecessary recalculations
  const filteredContents = React.useMemo(() => contents.filter(item => item.trim() !== ''), [contents]);
  const filteredObjectives = React.useMemo(() => objectives.filter(item => item.trim() !== ''), [objectives]);
  const filteredMethodologies = React.useMemo(() => methodologies.filter(item => item.trim() !== ''), [methodologies]);
  const filteredEvaluations = React.useMemo(() => evaluations.filter(item => item.trim() !== ''), [evaluations]);

  // Use a ref to track the previous form data
  const prevFormDataRef = React.useRef<PedagogicalData>();

  useEffect(() => {
    const formData = {
      contents: filteredContents,
      objectives: filteredObjectives,
      methodologies: filteredMethodologies,
      evaluations: filteredEvaluations,
      learning_objective: learningObjective,
      general_methodology: generalMethodology,
      society_relationship: societyRelationship,
      teacher_contribution: teacherContribution,
      recommended_references: recommendedReferences,
    };

    // Only update if the form data has actually changed
    if (JSON.stringify(prevFormDataRef.current) !== JSON.stringify(formData)) {
      onDataChange(formData);
      prevFormDataRef.current = formData;
    }
  }, [
    filteredContents, 
    filteredObjectives, 
    filteredMethodologies, 
    filteredEvaluations, 
    learningObjective, 
    generalMethodology, 
    societyRelationship, 
    teacherContribution, 
    recommendedReferences, 
    onDataChange
  ]);

  const addItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, items: string[]) => {
    setter([...items, '']);
  };

  const updateItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, items: string[], index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    setter(updated);
  };

  const removeItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, items: string[], index: number) => {
    setter(items.filter((_, i) => i !== index));
  };

  // Removed unused handleSubmit function since it's not being used in the component

  return (
    <div className="space-y-8">
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

      {/* Example Area */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Example: Area 1 - Panels</h4>
        <p className="text-sm text-gray-600">
          This serves as a reference for structuring your pedagogical information across different areas of the space.
        </p>
      </div>

      {/* Contents */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Answer the topic referring to the "contents" of the visited space. *
        </label>
        <div className="space-y-3">
          {contents.map((content, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-sm text-gray-500 w-8 mt-2">{index + 1} -</span>
              <textarea
                value={content}
                onChange={(e) => updateItem(setContents, contents, index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the content available in this area"
                rows={2}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeItem(setContents, contents, index)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem(setContents, contents)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Objectives */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Answer the topic referring to the "Objectives" of the visited space. *
        </label>
        <div className="space-y-3">
          {objectives.map((objective, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-sm text-gray-500 w-8 mt-2">{index + 1} -</span>
              <textarea
                value={objective}
                onChange={(e) => updateItem(setObjectives, objectives, index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the objectives of this area"
                rows={2}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeItem(setObjectives, objectives, index)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem(setObjectives, objectives)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Methodologies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Answer the topic referring to the "Methodologies" of the visited space. *
        </label>
        <div className="space-y-3">
          {methodologies.map((methodology, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-sm text-gray-500 w-8 mt-2">{index + 1} -</span>
              <textarea
                value={methodology}
                onChange={(e) => updateItem(setMethodologies, methodologies, index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the methodologies used in this area"
                rows={2}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeItem(setMethodologies, methodologies, index)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem(setMethodologies, methodologies)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Evaluations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Answer the topic referring to how the "Evaluation" of the visited space will be done. *
        </label>
        <div className="space-y-3">
          {evaluations.map((evaluation, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-sm text-gray-500 w-8 mt-2">{index + 1} -</span>
              <textarea
                value={evaluation}
                onChange={(e) => updateItem(setEvaluations, evaluations, index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe how evaluation will be conducted"
                rows={2}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeItem(setEvaluations, evaluations, index)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem(setEvaluations, evaluations)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Additional Questions */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is the learning objective of visiting this space? *
          </label>
          <textarea
            value={learningObjective}
            onChange={(e) => setLearningObjective(e.target.value)}
            rows={3}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the main learning objective"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is the general methodology used in visiting this non-formal space? *
          </label>
          <textarea
            value={generalMethodology}
            onChange={(e) => setGeneralMethodology(e.target.value)}
            rows={3}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the general methodology"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is the relationship between this visited non-formal space and society? *
          </label>
          <textarea
            value={societyRelationship}
            onChange={(e) => setSocietyRelationship(e.target.value)}
            rows={3}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the relationship with society"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is the contribution of the visited space to teacher training? And to your personal learning? *
          </label>
          <textarea
            value={teacherContribution}
            onChange={(e) => setTeacherContribution(e.target.value)}
            rows={3}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe contributions to teacher training and personal learning"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recommended references for working on themes and topics covered in the visited non-formal space: *
          </label>
          <textarea
            value={recommendedReferences}
            onChange={(e) => setRecommendedReferences(e.target.value)}
            rows={4}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="List recommended references, resources, and materials"
          />
        </div>
      </div>

      {/* Context Modal */}
      {showContext && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Context Information</h3>
              <button onClick={() => setShowContext(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                This section focuses on the pedagogical aspects of the educational space, including learning objectives, 
                methodologies, content organization, and evaluation strategies.
              </p>
              <p>
                Consider how the space facilitates learning, what educational goals it serves, and how it can be 
                integrated into formal educational programs.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};