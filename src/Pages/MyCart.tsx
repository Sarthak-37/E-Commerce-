import React, { useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  details: string;
  quantity: number;
}

interface MyCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

// ============================================================================
// MYCART COMPONENT
// ============================================================================

const MyCart: React.FC<MyCartProps> = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Calculate total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Load Razorpay script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle payment
  const handleProceedToPay = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsProcessingPayment(true);

    // Load Razorpay script
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      alert('Failed to load payment gateway. Please try again.');
      setIsProcessingPayment(false);
      return;
    }

    const totalAmount = calculateTotal();

    // Razorpay options
    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // Demo test key (replace with your actual key)
      amount: Math.round(totalAmount * 100), // Amount in paise
      currency: 'INR',
      name: 'Learline E-commerce',
      description: 'Purchase of items from cart',
      image: 'https://cdn-icons-png.flaticon.com/512/3144/3144456.png',
      handler: function (response: any) {
        // Payment successful
        console.log('Payment successful:', response);
        setIsProcessingPayment(false);
        setShowSuccessModal(true);
        
        // Clear cart after 2 seconds
        setTimeout(() => {
          onClearCart();
          setShowSuccessModal(false);
        }, 2000);
      },
      prefill: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#2563eb'
      },
      modal: {
        ondismiss: function() {
          setIsProcessingPayment(false);
        }
      }
    };

    // @ts-ignore - Razorpay is loaded via script
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        {/* Left Side - Cart Items List */}
        <div style={styles.leftSection}>
          <h1 style={styles.title}>My Cart</h1>
          
          {cartItems.length === 0 ? (
            <div style={styles.emptyCart}>
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d1d5db"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p style={styles.emptyCartText}>Your cart is empty</p>
              <p style={styles.emptyCartSubtext}>Add some products to get started!</p>
            </div>
          ) : (
            <div style={styles.cartItemsList}>
              {cartItems.map((item) => (
                <div key={item.id} style={styles.cartItem}>
                  {/* Product Image */}
                  <div style={styles.itemImageContainer}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={styles.itemImage}
                    />
                  </div>

                  {/* Product Details */}
                  <div style={styles.itemDetails}>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    <p style={styles.itemDescription}>{item.details}</p>
                    <p style={styles.itemPrice}>${item.price.toFixed(2)}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div style={styles.itemActions}>
                    <div style={styles.quantityControls}>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        style={styles.quantityButton}
                        disabled={item.quantity <= 1}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <span style={styles.quantityDisplay}>{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        style={styles.quantityButton}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Subtotal */}
                    <p style={styles.itemSubtotal}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      style={styles.removeButton}
                      aria-label={`Remove ${item.name}`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Order Summary */}
        <div style={styles.rightSection}>
          <div style={styles.summaryCard}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>
            
            {cartItems.length === 0 ? (
              <p style={styles.emptySummary}>No items in cart</p>
            ) : (
              <>
                <div style={styles.summaryItems}>
                  {cartItems.map((item) => (
                    <div key={item.id} style={styles.summaryItem}>
                      <span style={styles.summaryItemName}>
                        {item.name}
                        {item.quantity > 1 && (
                          <span style={styles.summaryQuantity}> x{item.quantity}</span>
                        )}
                      </span>
                      <span style={styles.summaryItemPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={styles.summaryDivider} />

                <div style={styles.summaryTotal}>
                  <span style={styles.totalLabel}>Total</span>
                  <span style={styles.totalAmount}>${calculateTotal().toFixed(2)}</span>
                </div>

                <button
                  onClick={handleProceedToPay}
                  style={{
                    ...styles.proceedButton,
                    ...(isProcessingPayment ? styles.proceedButtonDisabled : {})
                  }}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <>
                      <span style={styles.spinner}></span>
                      Processing...
                    </>
                  ) : (
                    'Proceed to Pay'
                  )}
                </button>

                <div style={styles.securePayment}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span style={styles.securePaymentText}>Secure payment powered by Razorpay</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.successIcon}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 style={styles.modalTitle}>Payment Successful!</h2>
            <p style={styles.modalText}>Your order has been placed successfully.</p>
            <p style={styles.modalSubtext}>Cart will be cleared automatically...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  contentWrapper: {
    display: 'flex',
    gap: '30px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  leftSection: {
    flex: '1',
    minWidth: '0'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827',
    marginTop: '0',
    marginBottom: '24px'
  },
  cartItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  cartItem: {
    display: 'flex',
    gap: '20px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    alignItems: 'flex-start'
  },
  itemImageContainer: {
    width: '120px',
    height: '120px',
    flexShrink: 0,
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6'
  },
  itemImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  itemDetails: {
    flex: '1',
    minWidth: '0'
  },
  itemName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginTop: '0',
    marginBottom: '8px'
  },
  itemDescription: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '0',
    marginBottom: '12px'
  },
  itemPrice: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2563eb',
    marginTop: '0',
    marginBottom: '0'
  },
  itemActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '12px'
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '4px'
  },
  quantityButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#374151',
    transition: 'background-color 0.2s'
  },
  quantityDisplay: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    minWidth: '30px',
    textAlign: 'center'
  },
  itemSubtotal: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    marginTop: '0',
    marginBottom: '0'
  },
  removeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#ef4444',
    transition: 'background-color 0.2s'
  },
  rightSection: {
    width: '400px',
    flexShrink: 0
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: '20px'
  },
  summaryTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginTop: '0',
    marginBottom: '20px'
  },
  summaryItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    fontSize: '14px',
    gap: '12px'
  },
  summaryItemName: {
    color: '#374151',
    flex: '1'
  },
  summaryQuantity: {
    color: '#6b7280',
    fontSize: '13px'
  },
  summaryItemPrice: {
    color: '#111827',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  summaryDivider: {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '20px 0'
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  totalLabel: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827'
  },
  totalAmount: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2563eb'
  },
  proceedButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  proceedButtonDisabled: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite'
  },
  securePayment: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '16px',
    color: '#6b7280',
    fontSize: '13px'
  },
  securePaymentText: {
    fontSize: '13px'
  },
  emptyCart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    textAlign: 'center'
  },
  emptyCartText: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#374151',
    marginTop: '20px',
    marginBottom: '8px'
  },
  emptyCartSubtext: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '0'
  },
  emptySummary: {
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center',
    padding: '20px 0'
  },
  modalOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '16px',
    textAlign: 'center',
    maxWidth: '400px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  successIcon: {
    marginBottom: '20px'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginTop: '0',
    marginBottom: '12px'
  },
  modalText: {
    fontSize: '16px',
    color: '#374151',
    marginTop: '0',
    marginBottom: '8px'
  },
  modalSubtext: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '0'
  }
};

// Add spinner animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @media (max-width: 1024px) {
      .content-wrapper {
        flex-direction: column !important;
      }
      .right-section {
        width: 100% !important;
      }
    }
  `;
  document.head.appendChild(style);
}

export default MyCart;