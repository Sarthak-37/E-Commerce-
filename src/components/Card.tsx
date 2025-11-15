import React, { useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  details: string;
}

interface CardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

// ============================================================================
// CARD COMPONENT
// ============================================================================

const Card: React.FC<CardProps> = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div style={styles.cardImageContainer}>
        <img
          src={product.image}
          alt={product.name}
          style={styles.cardImage}
        />
      </div>

      {/* Product Details */}
      <div style={styles.cardContent}>
        <h3 style={styles.cardTitle}>{product.name}</h3>
        <p style={styles.cardDetails}>{product.details}</p>
        <div style={styles.cardFooter}>
          <span style={styles.cardPrice}>${product.price.toFixed(2)}</span>
          <button
            onClick={() => onAddToCart(product)}
            style={styles.addToCartButton}
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  },
  cardImageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6'
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  cardContent: {
    padding: '16px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginTop: '0',
    marginBottom: '8px'
  },
  cardDetails: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '0',
    marginBottom: '16px',
    lineHeight: '1.5'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardPrice: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2563eb'
  },
  addToCartButton: {
    padding: '8px 16px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

export default Card;