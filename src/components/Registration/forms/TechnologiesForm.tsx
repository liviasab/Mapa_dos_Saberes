import React, { useState, useEffect } from "react";
import { Plus, X, Info } from "lucide-react";

interface TechnologiesData {
  digital_technologies: string[];
  didactic_strategies: string[];
  technology_relationships: Array<{
    technologyName: string;
    physics: string;
    chemistry: string;
    mathematics: string;
  }>;
  technology_developments: string[];
}

interface TechnologiesFormProps {
  data: Partial<TechnologiesData>;
  onDataChange: (data: TechnologiesData) => void;
}

export const TechnologiesForm: React.FC<TechnologiesFormProps> = ({
  data,
  onDataChange,
}) => {
  const [digitalTechs, setDigitalTechs] = useState<string[]>(
    data.digital_technologies || [""]
  );
  const [didacticStrategies, setDidacticStrategies] = useState<string[]>(
    data.didactic_strategies || [""]
  );
  const [techRelationships, setTechRelationships] = useState<
    Array<{
      technologyName: string;
      physics: string;
      chemistry: string;
      mathematics: string;
    }>
  >(
    data.technology_relationships || [
      { technologyName: "", physics: "", chemistry: "", mathematics: "" },
    ]
  );
  const [techDevelopments, setTechDevelopments] = useState<string[]>(
    data.technology_developments || [""]
  );
  const [showContext1, setShowContext1] = useState(false);
  const [showContext2, setShowContext2] = useState(false);

  // Memoize filtered arrays to prevent unnecessary recalculations
  const filteredDigitalTechs = React.useMemo(
    () => digitalTechs.filter((tech: string) => tech.trim() !== ""),
    [digitalTechs]
  );

  const filteredDidacticStrategies = React.useMemo(
    () =>
      didacticStrategies.filter((strategy: string) => strategy.trim() !== ""),
    [didacticStrategies]
  );

  const filteredTechRelationships = React.useMemo(
    () =>
      techRelationships.filter(
        (rel: { technologyName: string }) => rel.technologyName.trim() !== ""
      ),
    [techRelationships]
  );

  const filteredTechDevelopments = React.useMemo(
    () => techDevelopments.filter((dev: string) => dev.trim() !== ""),
    [techDevelopments]
  );

  // Use a ref to track the previous form data
  const prevFormDataRef = React.useRef<TechnologiesData>();

  useEffect(() => {
    const formData = {
      digital_technologies: filteredDigitalTechs,
      didactic_strategies: filteredDidacticStrategies,
      technology_relationships: filteredTechRelationships,
      technology_developments: filteredTechDevelopments,
    };

    // Only update if the form data has actually changed
    if (JSON.stringify(prevFormDataRef.current) !== JSON.stringify(formData)) {
      onDataChange(formData);
      prevFormDataRef.current = formData;
    }
  }, [
    filteredDigitalTechs,
    filteredDidacticStrategies,
    filteredTechRelationships,
    filteredTechDevelopments,
    onDataChange,
  ]);

  const addDigitalTech = () => {
    setDigitalTechs([...digitalTechs, ""]);
  };

  const updateDigitalTech = (index: number, value: string) => {
    const updated = [...digitalTechs];
    updated[index] = value;
    setDigitalTechs(updated);
  };

  const removeDigitalTech = (index: number) => {
    setDigitalTechs(digitalTechs.filter((_: string, i: number) => i !== index));
  };

  const addDidacticStrategy = () => {
    setDidacticStrategies([...didacticStrategies, ""]);
  };

  const updateDidacticStrategy = (index: number, value: string) => {
    const updated = [...didacticStrategies];
    updated[index] = value;
    setDidacticStrategies(updated);
  };

  const removeDidacticStrategy = (index: number) => {
    setDidacticStrategies(
      didacticStrategies.filter((_: string, i: number) => i !== index)
    );
  };

  const addTechRelationship = () => {
    setTechRelationships([
      ...techRelationships,
      { technologyName: "", physics: "", chemistry: "", mathematics: "" },
    ]);
  };

  const updateTechRelationship = (
    index: number,
    field: keyof (typeof techRelationships)[number],
    value: string
  ) => {
    const updated = [...techRelationships];
    updated[index] = { ...updated[index], [field]: value };
    setTechRelationships(updated);
  };

  const removeTechRelationship = (index: number) => {
    setTechRelationships(
      techRelationships.filter((_: unknown, i: number) => i !== index)
    );
  };

  const addTechDevelopment = () => {
    setTechDevelopments([...techDevelopments, ""]);
  };

  const updateTechDevelopment = (index: number, value: string) => {
    const updated = [...techDevelopments];
    updated[index] = value;
    setTechDevelopments(updated);
  };

  const removeTechDevelopment = (index: number) => {
    setTechDevelopments(
      techDevelopments.filter((_: string, i: number) => i !== index)
    );
  };

  return (
    <div className="space-y-8">
      {/* Digital Technologies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter what digital technologies the space has (Applications, Internet,
          QR Code, among others):
        </label>
        <div className="space-y-3">
          {digitalTechs.map((tech, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 w-8">{index + 1} -</span>
              <input
                value={tech}
                onChange={(e) => updateDigitalTech(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter digital technology"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeDigitalTech(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addDigitalTech}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Context Button 1 */}
      <div>
        <button
          type="button"
          onClick={() => setShowContext1(true)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <Info className="w-5 h-5" />
          <span>Context</span>
        </button>
      </div>

      {/* Didactic Strategies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          From this perspective, does the visited space use technologies as
          didactic strategies for teaching? How are they used?
        </label>
        <div className="space-y-3">
          {didacticStrategies.map((strategy, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-sm text-gray-500 w-8 mt-2">
                {index + 1} -
              </span>
              <textarea
                value={strategy}
                onChange={(e) => updateDidacticStrategy(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe how technologies are used as didactic strategies"
                rows={2}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeDidacticStrategy(index)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addDidacticStrategy}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Technology Relationships */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What is the relationship between the technologies used in the space
          and content from Physics, Chemistry, and Mathematics?
        </label>
        <div className="space-y-4">
          {techRelationships.map((rel, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-2 mb-3">
                <span className="text-sm text-gray-500 mt-2 w-8">
                  {index + 1} -
                </span>
                <div className="flex-1 space-y-3">
                  <input
                    value={rel.technologyName}
                    onChange={(e) =>
                      updateTechRelationship(
                        index,
                        "technologyName",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Technology name"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Physics:
                      </label>
                      <textarea
                        value={rel.physics}
                        onChange={(e) =>
                          updateTechRelationship(
                            index,
                            "physics",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        placeholder="Describe relationship"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Chemistry:
                      </label>
                      <textarea
                        value={rel.chemistry}
                        onChange={(e) =>
                          updateTechRelationship(
                            index,
                            "chemistry",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        placeholder="Describe relationship"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Mathematics:
                      </label>
                      <textarea
                        value={rel.mathematics}
                        onChange={(e) =>
                          updateTechRelationship(
                            index,
                            "mathematics",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        placeholder="Describe relationship"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeTechRelationship(index)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addTechRelationship}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Context Button 2 */}
      <div>
        <button
          type="button"
          onClick={() => setShowContext2(true)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <Info className="w-5 h-5" />
          <span>Context</span>
        </button>
      </div>

      {/* Technology Developments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          In the visited space, was it possible to notice any technology that
          was developed with the aim of improving practices or performance of
          productions and daily use for society? *
        </label>
        <div className="space-y-3">
          {techDevelopments.map((dev, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-sm text-gray-500 w-8 mt-2">
                {index + 1} -
              </span>
              <textarea
                value={dev}
                onChange={(e) => updateTechDevelopment(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe technology developments for society"
                rows={2}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeTechDevelopment(index)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTechDevelopment}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Context Modals */}
      {showContext1 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Context Information</h3>
              <button onClick={() => setShowContext1(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                Consider digital technologies that enhance the learning
                experience, facilitate access to information, or provide
                interactive elements within the educational space.
              </p>
            </div>
          </div>
        </div>
      )}

      {showContext2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Context Information</h3>
              <button onClick={() => setShowContext2(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                Focus on technologies that have been developed or adapted to
                benefit society, improve daily life practices, or enhance
                productivity in various sectors.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
