import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const CategoryTabs = ({ categories, activeCategory, onCategoryChange, playerCounts }) => {
  const { language } = useLanguage();

  return (
    <div className="category-tabs">
      {categories.map(category => (
        <button
          key={category.key}
          className={`category-tab ${activeCategory === category.key ? 'active' : ''}`}
          onClick={() => onCategoryChange(category.key)}
        >
          <span className="tab-label">{category.label}</span>
          <span className="tab-count">({playerCounts[category.key] || 0})</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;