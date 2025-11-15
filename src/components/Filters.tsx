import React from 'react';

export interface FilterState {
  categories: string[];
  priceSort: 'asc' | 'desc' | null;
}

interface FiltersProps {
  categories: string[];
  onFilterChange: (filters: FilterState) => void;
}

// Minimal filters UI — lightweight and non-intrusive. This keeps the
// rest of the app working and avoids import errors while preserving the
// intended API used by `Products`.
const Filters: React.FC<FiltersProps> = ({ categories, onFilterChange }) => {
  // For now render a small header and allow clearing filters
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <strong style={{ marginRight: 8 }}>Filters</strong>
        <span style={{ color: '#6b7280' }}>({categories.length} categories)</span>
        <button
          onClick={() => onFilterChange({ categories: [], priceSort: null })}
          style={{ padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Filters;
