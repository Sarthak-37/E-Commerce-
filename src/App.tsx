import React, { useState } from 'react';
import Navbar from './Pages/Navbar';
import Products from './Pages/Products';
import MyCart from './Pages/MyCart';
import type { CartItem } from './Pages/MyCart';
import type { Product } from './components/Card';


// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const App: React.FC = () => {
  // Current page state
  const [currentPage, setCurrentPage] = useState<'products' | 'cart'>('products');
  
  // Cart items state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  /**
   * Add product to cart
   * If product already exists, increase quantity
   * Otherwise, add new item with quantity 1
   */
  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Item already in cart, increase quantity
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // New item, add to cart
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    
    // Show feedback to user
    alert(`"${product.name}" added to cart!`);
  };

  /**
   * Update quantity of item in cart
   */
  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Don't allow quantity less than 1
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  /**
   * Remove item from cart
   */
  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  /**
   * Clear all items from cart
   * Called after successful payment
   */
  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div style={styles.appContainer}>
      {/* Navigation Bar */}
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
      />
      
      {/* Page Content with smooth transition */}
      <div style={styles.pageContainer} className="page-container">
        {currentPage === 'products' ? (
          <Products onAddToCart={handleAddToCart} />
        ) : (
          <MyCart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />
        )}
      </div>
    </div>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles: { [key: string]: React.CSSProperties } = {
  appContainer: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  pageContainer: {
    opacity: 1,
    transition: 'opacity 0.3s ease'
  }
};

// Add global animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    /* Smooth page transitions */
    .page-container {
      animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Navigation button hover effect */
    .nav-button:hover {
      background-color: #1e40af !important;
      transform: scale(1.05) !important;
    }
    
    .nav-button:active {
      transform: scale(0.98) !important;
    }
    
    /* Text animation in nav button */
    .nav-text {
      display: inline-block;
      transition: transform 0.3s ease;
    }
    
    .nav-button:hover .nav-text {
      transform: translateX(2px);
    }
  `;
  document.head.appendChild(style);
}

export default App;