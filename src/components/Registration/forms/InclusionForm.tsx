import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

interface InclusionData {
  inclusion_tags: string[];
  additional_inclusion: string[];
}

interface InclusionFormProps {
  data: Partial<InclusionData>;
  onDataChange: (data: InclusionData) => void;
}

const INCLUSION_OPTIONS = [
  'Architectural accessibility',
  'Partial accessibility',
  'Audio describer',
  'Audio description',
  'Libras interpreter',
  'Monitor who knows Libras',
  'Braille interpreter',
  'Hire professional',
  'No accessibility resources',
  'Staff make the visit accessible',
  'Staff do not make the visit accessible',
];

export const InclusionForm: React.FC<InclusionFormProps> = ({
  data,
  onDataChange,
}) => {
  const [inclusionTags, setInclusionTags] = useState<string[]>(data.inclusion_tags || []);
  const [additionalItems, setAdditionalItems] = useState<string[]>(data.additional_inclusion || ['']);

  // Memoize filtered additional items to prevent unnecessary recalculations
  const filteredAdditionalItems = React.useMemo(
    () => additionalItems.filter(item => item.trim() !== ''),
    [additionalItems]
  );

  // Use a ref to track the previous form data
  const prevFormDataRef = React.useRef<InclusionData>();

  useEffect(() => {
    const formData = {
      inclusion_tags: inclusionTags,
      additional_inclusion: filteredAdditionalItems,
    };

    // Only update if the form data has actually changed
    if (JSON.stringify(prevFormDataRef.current) !== JSON.stringify(formData)) {
      onDataChange(formData);
      prevFormDataRef.current = formData;
    }
  }, [inclusionTags, filteredAdditionalItems, onDataChange]);

  const toggleInclusionTag = (tag: string) => {
    setInclusionTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addAdditionalItem = () => {
    setAdditionalItems([...additionalItems, '']);
  };

  const updateAdditionalItem = (index: number, value: string) => {
    const updated = [...additionalItems];
    updated[index] = value;
    setAdditionalItems(updated);
  };

  const removeAdditionalItem = (index: number) => {
    setAdditionalItems(additionalItems.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Check the tags about the aspects involving inclusion: *
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {INCLUSION_OPTIONS.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={inclusionTags.includes(option)}
                onChange={() => toggleInclusionTag(option)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add other inclusion aspects:
        </label>
        <div className="space-y-3">
          {additionalItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                value={item}
                onChange={(e) => updateAdditionalItem(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter additional inclusion aspect"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeAdditionalItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addAdditionalItem}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            <span>Add another</span>
          </button>
        </div>
      </div>

      {inclusionTags.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Selected Inclusion Features:</h4>
          <div className="flex flex-wrap gap-2">
            {inclusionTags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};