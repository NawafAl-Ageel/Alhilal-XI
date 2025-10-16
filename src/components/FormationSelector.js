import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './FormationSelector.css';

const FormationSelector = ({ selectedFormation, onFormationChange }) => {
  const { t } = useLanguage();
  
  const formations = [
    { id: '4-3-3', name: '4-3-3', description: t('attacking') },
    { id: '4-4-2', name: '4-4-2', description: t('balanced') },
    { id: '3-5-2', name: '3-5-2', description: t('wing_play') },
    { id: '4-2-3-1', name: '4-2-3-1', description: t('control') },
    { id: '3-4-3', name: '3-4-3', description: t('aggressive') },
    { id: '5-3-2', name: '5-3-2', description: t('defensive') }
  ];

  return (
    <div className="formation-selector-modern">
      <div className="formation-tabs">
        {formations.map(formation => (
          <button
            key={formation.id}
            className={`formation-tab ${selectedFormation === formation.id ? 'active' : ''}`}
            onClick={() => onFormationChange(formation.id)}
          >
            <span className="formation-name">{formation.name}</span>
            <span className="formation-desc">{formation.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormationSelector;