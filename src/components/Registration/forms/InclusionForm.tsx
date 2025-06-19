import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { InclusionData } from '../../../types';

interface InclusionFormProps {
  data: Partial<InclusionData>;
  onDataChange: (data: InclusionData) => void;
}

const INCLUSION_OPTIONS = [
  

"Possui acessibilidade arquitetônica (rampas, piso tátil, etc…) para PcD",
"Possui parcial acessibilidade arquitetônica (rampas, piso tátil, etc…)para PcD",
"Possui profissional áudio descritor",
"Faz uso de algum recurso equivalente à audiodescrição",
"Possui tradutor intérprete de Libras ou faz uso de recurso equivalente para acesso a interpretação de libras",
"Possui tradutor intérprete de Braille ou faz uso de recurso equivalente para acesso de deficientes visuais",
"Possui algum funcionário/ monitor com conhecimento da linguagem de Libras",
"No agendamento da visita se for comunicada a ida de um visitante, com deficiência, o espaço se organiza (contrata profissional de Libras, audiodescritor, etc…) para receber e incluí-la da melhor maneira possível",
"No agendamento da visita se for comunicada a ida de um visitante surdo, o espaço se organiza (contrata profissional de Libras, audiodescritor, etc…) para receber e incluí-la da melhor maneira possível",
"No agendamento da visita se for comunicada a ida de um visitantede baixa visão, o espaço se organiza (contrata profissional de Braille, ou se utiliza de outros recursos) para receber e incluí-la da melhor maneira possível",
"Na visita se houver entre os visitantes pessoas com deficiência é de inteira responsabilidade do grupo ou responsável providenciar os recursos de acessibilidade",
"Os funcionários/ monitores do espaço demonstram sensibilidade e interesse para tornar a visita acessível",
"Os funcionários/ monitores demonstram resistência no recebimento de visitantes com deficiência",

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
          Marque as tags sobre os aspectos que envolve a inclusão: *
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
                className="w-5 h-5 text-[#12557B] border-gray-300 rounded focus:ring-[#12557B]"
              />
              <span className="text-gray-700 text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Adicione outros aspectos de inclusão não listados que você observou no espaço :
        </label>
        <div className="space-y-3">
          {additionalItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                value={item}
                onChange={(e) => updateAdditionalItem(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12557B] focus:border-transparent"
                placeholder="Adicione outro aspecto de inclusão"
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
            className="flex items-center space-x-2 text-[#12557B] hover:text-[#12557B]/90"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar outro</span>
          </button>
        </div>
      </div>

      {inclusionTags.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Aspectos de inclusão selecionados:</h4>
          <div className="flex flex-wrap gap-2">
            {inclusionTags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#40B873] text-white text-sm rounded-full"
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