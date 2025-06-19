import React, { useState, useEffect } from 'react';
import { CharacteristicsData } from '../../../types';

interface CharacteristicsFormProps {
  data: CharacteristicsData;
  onDataChange: (data: CharacteristicsData) => void;
}

const ACCESS_OPTIONS = [
  
"Possui fácil localização.",
"Possui difícil localização.",
"Precisa fazer agendamento prévio para as visitas.",
"Possui acessibilidade para PcD.",
"Possui flexibilidade para aplicação de uma aula interdisciplinar.",
"Possui monitores para a condução de visita guiada (orientação dentro do espaço).",
"Possui acesso ao Tour Virtual (visita on-line)",
];

const THEME_OPTIONS = [
  
"Divulgação científica e afins.",
"Divulgação da cultura local ou regional, abordando aspectos históricos, artísticos e musicais.",
"Sustentabilidade (visa equilibrar a preservação do meio ambiente e o que ele pode oferecer em consonância com a qualidade de vida da população).",
"Tecnologias interativas ou alternativas.",
"Natureza, preservação ambiental e conservação da biodiversidade",

];

export const CharacteristicsForm: React.FC<CharacteristicsFormProps> = ({
  data,
  onDataChange,
}) => {
  const [accessTags, setAccessTags] = useState<string[]>(data.access_tags || []);
  const [themeTags, setThemeTags] = useState<string[]>(data.theme_tags || []);

  // Only update when tags actually change
  const prevTagsRef = React.useRef({ accessTags, themeTags });
  
  useEffect(() => {
    if (prevTagsRef.current.accessTags !== accessTags || 
        prevTagsRef.current.themeTags !== themeTags) {
      onDataChange({
        access_tags: accessTags,
        theme_tags: themeTags,
      });
      prevTagsRef.current = { accessTags, themeTags };
    }
  }, [accessTags, themeTags, onDataChange]);

  const toggleAccessTag = (tag: string) => {
    setAccessTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleThemeTag = (tag: string) => {
    setThemeTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Marque as tags correspondentes ao acesso do espaço:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ACCESS_OPTIONS.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={accessTags.includes(option)}
                onChange={() => toggleAccessTag(option)}
                className="w-5 h-5 text-[#12557B] border-gray-300 rounded focus:ring-[#12557B]"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
        Qual dessas temáticas o espaço trabalha?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {THEME_OPTIONS.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={themeTags.includes(option)}
                onChange={() => toggleThemeTag(option)}
                className="w-5 h-5 text-[#12557B] border-gray-300 rounded focus:ring-[#12557B]"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {(accessTags.length > 0 || themeTags.length > 0) && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Selected Tags:</h4>
          <div className="flex flex-wrap gap-2">
            {[...accessTags, ...themeTags].map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#12557B] text-white text-sm rounded-full"
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