import React, { useState } from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CheckoutModal from "./components/CheckoutModal";
import SuccessPage from "./components/SuccessPage";
import { motion, AnimatePresence } from "framer-motion";
const dummyProducts = [
  {
    id: 1,
    name: "Premium T-Shirt",
    price: 29.99,
    image: "https://via.placeholder.com/300x300.png?text=T-Shirt",
  },
  {
    id: 2,
    name: "Designer Jeans",
    price: 79.99,
    image: "https://via.placeholder.com/300x300.png?text=Jeans",
  },
  {
    id: 3,
    name: "Running Sneakers",
    price: 99.99,
    image: "https://via.placeholder.com/300x300.png?text=Sneakers",
  },
  {
    id: 4,
    name: "Trendy Hat",
    price: 24.99,
    image: "https://via.placeholder.com/300x300.png?text=Hat",
  },
];

function App() {
  const [cart, setCart] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };

  const handleCloseCheckoutModal = () => {
    setShowCheckoutModal(false);
  };

  const handleCompleteCheckout = (formData) => {
    setShowCheckoutModal(false);
    setShowSuccessPage(true);

    // Calculate the total transaction amount
    const transactionAmount = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Track the sale with Boostmate
    if (window.trackEvent) {
      window.trackEvent("sale", {
        customerKey: formData.email,
        transactionAmount: transactionAmount,
        amountUnits: "USD",
      });
    } else {
      console.error("Tracking function not available");
    }

    setCart([]);
  };

  const handleBackToShopping = () => {
    setShowSuccessPage(false);
  };

  if (showSuccessPage) {
    return <SuccessPage onBackToShopping={handleBackToShopping} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Bankuta</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row gap-8">
            <motion.div
              className="md:w-2/3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductList products={dummyProducts} addToCart={addToCart} />
            </motion.div>
            <motion.div
              className="md:w-1/3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Cart
                cart={cart}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                onCheckout={handleCheckout}
              />
            </motion.div>
          </div>
        </div>
      </main>
      <AnimatePresence>
        {showCheckoutModal && (
          <CheckoutModal
            cart={cart}
            onClose={handleCloseCheckoutModal}
            onComplete={handleCompleteCheckout}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
