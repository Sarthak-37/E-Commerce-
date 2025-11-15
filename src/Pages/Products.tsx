import React, { useState } from 'react';
import { useRef, useEffect } from 'react';
import Card from '../components/Card';
import type { Product } from '../components/Card';



// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface FilterState {
  categories: string[];
  priceSort: 'asc' | 'desc' | null;
}

interface AppliedFilter {
  type: 'category' | 'price';
  value: string;
  label: string;
}

interface ProductsProps {
  onAddToCart: (product: Product) => void;
}

// ============================================================================
// PRODUCTS COMPONENT (with integrated Filters)
// ============================================================================

const Products: React.FC<ProductsProps> = ({ onAddToCart }) => {
  // Mock product data
  const [allProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Wireless Headphones',
      category: 'Electronics',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      details: 'Premium sound quality with noise cancellation'
    },
    {
      id: '2',
      name: 'Smart Watch',
      category: 'Electronics',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      details: 'Track your fitness and stay connected'
    },
    {
      id: '3',
      name: 'Leather Wallet',
      category: 'Accessories',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop',
      details: 'Genuine leather with RFID protection'
    },
    {
      id: '4',
      name: 'Running Shoes',
      category: 'Footwear',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
      details: 'Lightweight and breathable for maximum comfort'
    },
    {
      id: '5',
      name: 'Backpack',
      category: 'Accessories',
      price: 65.00,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
      details: 'Durable and spacious with laptop compartment'
    },
    {
      id: '6',
      name: 'Bluetooth Speaker',
      category: 'Electronics',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
      details: 'Portable with 20-hour battery life'
    },
    {
      id: '7',
      name: 'Sunglasses',
      category: 'Accessories',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
      details: 'UV protection with polarized lenses'
    },
    {
      id: '8',
      name: 'Desk Lamp',
      category: 'Home',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
      details: 'Adjustable LED with USB charging port'
    }
  ]);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  
  // Filter state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract unique categories
  const categories = Array.from(new Set(allProducts.map(p => p.category)));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceSortChange = (sort: 'asc' | 'desc') => {
    setPriceSort(prev => prev === sort ? null : sort);
  };

  const handleApply = () => {
    // Build applied filters array
    const filters: AppliedFilter[] = [
      ...selectedCategories.map(cat => ({
        type: 'category' as const,
        value: cat,
        label: cat
      })),
      ...(priceSort ? [{
        type: 'price' as const,
        value: priceSort,
        label: `Price: ${priceSort === 'asc' ? 'Low to High' : 'High to Low'}`
      }] : [])
    ];

    setAppliedFilters(filters);
    
    // Apply filters
    let filtered = [...allProducts];

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    // Apply price sort
    if (priceSort === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
    setIsOpen(false);
  };

  const handleRemoveFilter = (filter: AppliedFilter) => {
    if (filter.type === 'category') {
      const newCategories = selectedCategories.filter(c => c !== filter.value);
      setSelectedCategories(newCategories);
      
      // Re-apply filters
      let filtered = [...allProducts];
      if (newCategories.length > 0) {
        filtered = filtered.filter(p => newCategories.includes(p.category));
      }
      if (priceSort === 'asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (priceSort === 'desc') {
        filtered.sort((a, b) => b.price - a.price);
      }
      setFilteredProducts(filtered);
    } else {
      setPriceSort(null);
      
      // Re-apply filters
      let filtered = [...allProducts];
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(p => selectedCategories.includes(p.category));
      }
      setFilteredProducts(filtered);
    }

    setAppliedFilters(prev => prev.filter(f => 
      !(f.type === filter.type && f.value === filter.value)
    ));
  };

  return (
    <div style={styles.productsContainer}>
      {/* Filters Section */}
      <div style={styles.filterContainer}>
        <div style={styles.filterHeader}>
          <div style={styles.filterButtonGroup}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={styles.filterButton}
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: '8px' }}
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Apply Filters
            </button>

            {/* Applied Filter Tags */}
            {appliedFilters.map((filter, index) => (
              <div key={`${filter.type}-${filter.value}-${index}`} style={styles.filterTag}>
                <span style={styles.filterTagText}>{filter.label}</span>
                <button
                  onClick={() => handleRemoveFilter(filter)}
                  style={styles.filterTagClose}
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div ref={dropdownRef} style={styles.dropdown}>
            {/* Category Section */}
            <div style={styles.filterSection}>
              <h3 style={styles.filterSectionTitle}>Category</h3>
              {categories.map(category => (
                <label key={category} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxText}>{category}</span>
                </label>
              ))}
            </div>

            {/* Price Sort Section */}
            <div style={styles.filterSection}>
              <h3 style={styles.filterSectionTitle}>Price</h3>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={priceSort === 'asc'}
                  onChange={() => handlePriceSortChange('asc')}
                  style={styles.checkbox}
                />
                <span style={styles.checkboxText}>Ascending (Low to High)</span>
              </label>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={priceSort === 'desc'}
                  onChange={() => handlePriceSortChange('desc')}
                  style={styles.checkbox}
                />
                <span style={styles.checkboxText}>Descending (High to Low)</span>
              </label>
            </div>

            {/* Apply Button */}
            <div style={styles.dropdownFooter}>
              <button onClick={handleApply} style={styles.applyButton}>
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div style={styles.productsGrid} className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Card
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))
        ) : (
          <div style={styles.emptyState}>
            <p style={styles.emptyStateText}>No products found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles: { [key: string]: React.CSSProperties } = {
  productsContainer: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    minHeight: '100vh',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    boxSizing: 'border-box'
    
  },
  filterContainer: {
    position: 'relative',
    marginBottom: '30px'
  },
  filterHeader: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  filterButtonGroup: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px'
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  filterTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#1e40af'
  },
  filterTagText: {
    fontWeight: '500'
  },
  filterTagClose: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#1e40af',
    transition: 'color 0.2s'
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: '0',
    marginTop: '8px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '16px',
    minWidth: '280px',
    zIndex: 1000
  },
  filterSection: {
    marginBottom: '20px'
  },
  filterSectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '12px',
    marginTop: '0'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151'
  },
  checkbox: {
    marginRight: '10px',
    cursor: 'pointer',
    width: '16px',
    height: '16px'
  },
  checkboxText: {
    userSelect: 'none' as const
  },
  dropdownFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '12px',
    borderTop: '1px solid #e5e7eb'
  },
  applyButton: {
    padding: '8px 24px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginTop: '20px'
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyStateText: {
    fontSize: '16px',
    color: '#6b7280'
  }
};

// Add media queries via inline style for responsive grid
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 1200px) {
      .products-grid {
        grid-template-columns: repeat(3, 1fr) !important;
      }
    }
    @media (max-width: 900px) {
      .products-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    @media (max-width: 600px) {
      .products-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(style);
}

export default Products;