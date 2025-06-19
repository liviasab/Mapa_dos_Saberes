import React, { useState, useEffect } from 'react';
import { Plus, Info, X } from 'lucide-react';
import { InterdisciplinarityData } from '../../../types';

interface InterdisciplinarityFormProps {
  data: Partial<InterdisciplinarityData>;
  onDataChange: (data: InterdisciplinarityData) => void;
}

const DISCIPLINE_OPTIONS = ['Matemática', 'Física', 'Química'];

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
        Disciplinas que podem ser trabalhadas no espaço visitado:
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
                className="w-5 h-5 text-[#12557B] border-gray-300 rounded focus:ring-[#12557B]"
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
          className="flex items-center space-x-2 text-[#12557B] hover:text-[#12557B]/90"
        >
          <Info className="w-5 h-5" />
          <span>Contexto</span>
        </button>
      </div>

      {/* Main Theme */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
        Semelhante ao exemplo citado no contexto, neste espaço visitado qual(is) a(s) temática(s) abordada(s)?
        </label>
        <input
          value={mainTheme}
          onChange={(e) => setMainTheme(e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12557B] focus:border-transparent"
          placeholder="Digite o(s) tema(s) principal(is)"
        />
      </div>

      {/* Other Themes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
        E quais os possíveis temas que estão inseridos explicitamente no espaço? 
        </label>
        <div className="space-y-3">
          {otherThemes.map((theme, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 w-8">{index + 1} -</span>
              <input
                value={theme}
                onChange={(e) => updateOtherTheme(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12557B] focus:border-transparent"
                placeholder="Digite o tema"
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
            className="flex items-center space-x-2 text-[#12557B] hover:text-[#12557B]/90"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar mais</span>
          </button>
        </div>
      </div>

      {/* Example Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Exemplo: Museu da Ciências Nucleares do Recife</h4>
        <p className="text-sm text-gray-600">
        Tema abordado: Irradiação e Radiação, dentro desse tema qual o possível assunto que podemos trabalhar concomitantemente com as disciplinas citadas?
        </p>
      </div>

      {/* Interdisciplinary Associations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
        A partir da visita ao espaço não formal, cite os pontos interdisciplinares encontrados dentro dos temas trabalhados que contemplem as disciplinas Química, Física e Matemática, citando, preferencialmente, as referências pedagógicas.*
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12557B] focus:border-transparent"
                    placeholder="Descreva o tópico ou conceito"
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
                <p className="text-sm text-gray-600 mb-2">Associe com disciplinas:</p>
                <div className="flex space-x-3">
                  {DISCIPLINE_OPTIONS.map((discipline) => (
                    <label key={discipline} className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={assoc.disciplines.includes(discipline)}
                        onChange={() => toggleAssociationDiscipline(index, discipline)}
                        className="w-4 h-4 text-[#12557B] border-gray-300 rounded"
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
            className="flex items-center space-x-2 text-[#12557B] hover:text-[#12557B]/90"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar mais</span>
          </button>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Apresente algumas informações adicionais que julgue relevante:
        </label>
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          rows={4}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12557B] focus:border-transparent"
          placeholder="Qualquer informação adicional relevante sobre interdisciplinaridade..."
        />
      </div>

      {/* Context Modal */}
      {showContext && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Informação sobre Contexto</h3>
              <button
                onClick={() => setShowContext(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Para responder as próximas questões:</p>
              <p>No Museu de Ciências Nucleares do Recife,  temos como a nossa principal temática a Radioatividade, e dentro do museu existem áreas que trabalham temas que estão diretamente ligados com a temática principal,
                 exemplo: Segurança e radioproteção, Irradiação e radiação, Medicina nuclear e Geração Nucleoelétrica.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};