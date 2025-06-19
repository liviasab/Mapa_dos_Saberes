import React, { useState, useEffect } from 'react';
import { Plus, X, Info } from 'lucide-react';
import { PedagogicalData } from '../../../types';

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
          className="flex items-center space-x-2 text-[#12557B] hover:text-[#12557B]/90"
        >
          <Info className="w-5 h-5" />
          <span>Contexto</span>
        </button>
      </div>

      {/* Example Area */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Leia o contexto acima:</h4>
        <p className="text-sm text-gray-600">
            Entendendo que todo espaço não formal pode ser dividido por áreas, onde cada uma possui temas distintos e abordam diversos conteúdos de forma interdisciplinar e que utilizam metodologia específica, no espaço visitado identifique suas respectivas áreas:
          "Cite o nome de cada uma em formas de tópicos" e fale didaticamente sobre os “conteúdos”,  "objetivos", “metodologia”, "avaliação" e “pontos de interdisciplinaridade” presente em cada área.
        </p>
      </div>

      {/* Contents */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Responda o tópico referente ao "conteúdo" do espaço visitado. *
        </label>
        <div className="space-y-3">
          {contents.map((content, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-sm text-gray-500 w-8 mt-2">{index + 1} -</span>
              <textarea
                value={content}
                onChange={(e) => updateItem(setContents, contents, index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12557B] focus:border-transparent"
                placeholder="Descreva o conteúdo disponível nesta área"
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
            className="flex items-center space-x-2 text-[#12557B] hover:text-[#12557B]/90"
          >
            <Plus className="w-4 h-4" />
            <span>Mais</span>
          </button>
        </div>
      </div>

      {/* Objectives */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Responda o tópico referente aos "objetivos" do espaço visitado. *
        </label>
        <div className="space-y-3">
          {objectives.map((objective, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-sm text-gray-500 w-8 mt-2">{index + 1} -</span>
              <textarea
                value={objective}
                onChange={(e) => updateItem(setObjectives, objectives, index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12557B] focus:border-transparent"
                placeholder="Descreva os objetivos desta área"
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
            className="flex items-center space-x-2 text-[#12557B] hover:text-[#12557B]/90"
          >
            <Plus className="w-4 h-4" />
            <span>Mais</span>
          </button>
        </div>
      </div>

      {/* Methodologies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Responda o tópico referente às "metodologias" do espaço visitado. *
        </label>
        <div className="space-y-3">
          {methodologies.map((methodology, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-sm text-gray-500 w-8 mt-2">{index + 1} -</span>
              <textarea
                value={methodology}
                onChange={(e) => updateItem(setMethodologies, methodologies, index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12557B] focus:border-transparent"
                placeholder="Descreva as metodologias utilizadas nesta área"
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
            className="flex items-center space-x-2 text-[#12557B] hover:text-[#12557B]/90"
          >
            <Plus className="w-4 h-4" />
            <span>Mais</span>
          </button>
        </div>
      </div>

      {/* Evaluations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Responda o tópico referente à "avaliação" do espaço visitado. *
        </label>
        <div className="space-y-3">
          {evaluations.map((evaluation, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-sm text-gray-500 w-8 mt-2">{index + 1} -</span>
              <textarea
                value={evaluation}
                onChange={(e) => updateItem(setEvaluations, evaluations, index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12557B] focus:border-transparent"
                placeholder="Descreva como a avaliação será conduzida"
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
            className="flex items-center space-x-2 text-[#12557B] hover:text-[#12557B]/90"
          >
            <Plus className="w-4 h-4" />
            <span>Mais</span>
          </button>
        </div>
      </div>

      {/* Additional Questions */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
          Qual o objetivo de aprendizagem na visita deste espaço? *
          </label>
          <textarea
            value={learningObjective}
            onChange={(e) => setLearningObjective(e.target.value)}
            rows={3}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12557B] focus:border-transparent"
            placeholder="Descreva o objetivo de aprendizado do espaço visitado"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
          Qual a metodologia geral utilizada na visita deste espaço não formal? *
          </label>
          <textarea
            value={generalMethodology}
            onChange={(e) => setGeneralMethodology(e.target.value)}
            rows={3}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12557B] focus:border-transparent"
            placeholder="Descreva a metodologia geral"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
          Qual a relação que este espaço não formal visitado possui com a sociedade? *
          </label>
          <textarea
            value={societyRelationship}
            onChange={(e) => setSocietyRelationship(e.target.value)}
            rows={3}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12557B] focus:border-transparent"
            placeholder="Descreva a relação com a sociedade"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
          Qual a contribuição do espaço visitado para a formação de professores? E para sua aprendizagem pessoal? *
          </label>
          <textarea
            value={teacherContribution}
            onChange={(e) => setTeacherContribution(e.target.value)}
            rows={3}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12557B] focus:border-transparent"
            placeholder="Descreva as contribuições para a formação docente e para o seu aprendizado pessoal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
        Referências indicadas para trabalhar temáticas e temas abordados no espaço não formal visitado: *
          </label>
          <textarea
            value={recommendedReferences}
            onChange={(e) => setRecommendedReferences(e.target.value)}
            rows={4}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12557B] focus:border-transparent"
            placeholder="Liste referências, recursos e materiais"
          />
        </div>
      </div>

      {/* Context Modal */}
      {showContext && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Informações Contextuais</h3>
              <button onClick={() => setShowContext(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
              Exemplo: No Museu de Ciências Nucleares do Recife temos quatro áreas, porém vamos citar como exemplo uma delas como modelo:
              </p>
              <p>
              Área 1 - Painéis:
              </p>
              <p>
              Conteúdos: Nessa primeira área do museu são abordados vários conteúdos relacionados com a radioatividade, tais como: história da radioatividade, medicina nuclear, definição de radioatividade, radiação de alimentos, radiação ambiental, tecnologias radioativas e engenharia nuclear;
              </p>
              <p>
              Objetivo: Como o objetivo dessa área é fazer uma introdução do que vai ser apresentado no museu, o professor pode se utilizar do mesmo objetivo para mostrar aos discentes o que vai ser apresentado, e verificar o nível de conhecimento que os estudantes já possuem acerca da radioatividade;
              </p>
              <p>
              Metodologia: como nessa área é feito uma introdução dos conteúdos que vão se apresentados no museu, o professor poderá fazer perguntas junto com o monitor e verificar o nível de conhecimento que os alunos já possuem sobre a radioatividade além de verificar a criatividade dos estudantes em relacionar os conteúdos abordados e o cotidiano;
              </p>
              <p>
              Avaliação: o professor poderá ver o nível de participação dos estudantes além de posteriormente aplicar um questionário ou pedir um relatório sobre o que os estudantes aprenderam em cada parte do museu;
              </p>
              <p>
              Pontos de interdisciplinaridade: Nessa área podemos notar que os pontos de interdisciplinaridade que podem ser trabalhados são os próprios conteúdos presentes no museu, pois em cada um temos vários temas presentes nas áreas de física, química e matemática.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};