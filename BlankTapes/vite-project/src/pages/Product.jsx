import React, { useState, useEffect } from 'react';
import './Product.css';
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { API_BASE } from "../config"

const API_URL = `${API_BASE}/api/products`; // <-- add /api

function Product() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("XS");
  const [sort, setSort] = useState(null);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  // Fetch products from backend and only show active ones (case-insensitive)
  useEffect(() => {
    fetch(API_URL) // Use the correct API endpoint
      .then(res => res.json())
      .then(data => {
        setProducts(data.filter(p => (p.status || '').toLowerCase() === 'active'));
      });
  }, []);

  // Filtering and sorting logic
  let filteredProducts = [...products];
  if (availabilityFilter === 'inStock') {
    filteredProducts = filteredProducts.filter(p => p.stock > 0);
  }
  if (sort === 'alphabetical') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'price') {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === 'type') {
    const typeOrder = { hoodie: 1, shirt: 2, short: 3 };
    filteredProducts.sort((a, b) => {
      return (typeOrder[a.category?.toLowerCase()] || 99) - (typeOrder[b.category?.toLowerCase()] || 99);
    });
  }

  const displayedProducts = filteredProducts;

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedSize("XS");
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setSelectedSize("XS");
  };

  // Add to cart function
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const key = `${selectedProduct._id}-${selectedSize}`;
    setCart(prev => {
      const existing = prev.find(item => item.key === key);
      if (existing) {
        return prev.map(item =>
          item.key === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            key,
            name: selectedProduct.name,
            img: selectedProduct.imageUrl
              ? selectedProduct.imageUrl.startsWith('/uploads/')
                ? `${API_BASE}${selectedProduct.imageUrl}`
                : selectedProduct.imageUrl
              : '/default-image.png',
            price: selectedProduct.price,
            quantity: 1,
            size: selectedSize
          }
        ];
      }
    });
    setCartOpen(true);
    handleCloseModal();
  };

  // Remove from cart
  const handleRemoveFromCart = (key) => {
    setCart(cart.filter(item => item.key !== key));
  };

  // Change quantity
  const handleChangeQuantity = (key, delta) => {
    setCart(cart =>
      cart.map(item =>
        item.key === key
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // Calculate total
  const cartTotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + price * item.quantity;
  }, 0);

  return (
    <div>
      <Navbar
        onCartClick={() => setCartOpen(true)}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="cart-sidebar-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
            <button className="cart-close-btn" onClick={() => setCartOpen(false)}>&times;</button>
            <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 12 }}>YOUR CART</h2>
            <div style={{ borderTop: "2px solid #eee", marginBottom: 16 }} />
            {cart.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "#888" }}>Your cart is empty.</div>
            ) : (
              <>
                <div>
                  {cart.map(item => (
                    <div key={item.key} className="cart-item">
                      <img src={item.img} alt={item.name} />
                      <div className="cart-item-details">
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: 14, color: "#555" }}>Size: {item.size}</div>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>₱{Number(item.price).toLocaleString()}</div>
                        <div className="cart-qty">
                          <button onClick={() => handleChangeQuantity(item.key, -1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => handleChangeQuantity(item.key, 1)}>+</button>
                        </div>
                        <button className="cart-remove-btn" onClick={() => handleRemoveFromCart(item.key)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "2px solid #eee", margin: "18px 0" }} />
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>
                  CART TOTAL: ₱{cartTotal.toLocaleString()}
                </div>
                <button
                  className="secure-checkout-btn"
                  onClick={async () => {
                    const username = localStorage.getItem("username");
                    if (!username) {
                      alert("Please log in to checkout.");
                      return;
                    }
                    // Fetch user details for name/email
                    const users = await fetch(`${API_BASE}/api/users`).then(r => r.json());
                    const user = users.find(u => u.username === username);
                    if (!user) {
                      alert("User not found.");
                      return;
                    }
                    // Prepare order payload
                    const orderPayload = {
                      customer: {
                        name: user.username,
                        email: user.email,
                      },
                      items: cart.map(item => ({
                        productId: item.key.split("-")[0], // assuming _id is in key
                        name: item.name,
                        quantity: item.quantity,
                        price: Number(item.price),
                        size: item.size,
                        img: item.img,
                      })),
                      total: cartTotal,
                      status: "PENDING",
                    };
                    // Send to backend
                    const res = await fetch(`${API_BASE}/api/orders`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(orderPayload),
                    });
                    const data = await res.json();
                    if (data.success) {
                      setCart([]);
                      window.location.href = "/customerorder";
                    } else {
                      alert("Checkout failed: " + (data.error || "Unknown error"));
                    }
                  }}
                >
                  Secure Checkout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main content container */}
      <div className="container">
        <div className="product-header">
          <div className="product-title-main">Fall Collection VOL.1</div>
          <div className="product-header-top">
            <div className="product-header-left">
              <button className="filter-btn" onClick={() => { setAvailabilityFilter('all'); setSort(null); }}>All</button>
              <button className="filter-btn" onClick={() => setAvailabilityFilter('inStock')}>Availability &#9662;</button>
              <button className="filter-btn" onClick={() => setSort('type')}>Type &#9662;</button>
            </div>
            <div className="product-header-right">
              <span>Sort by:</span>
              <button className="sort-btn" onClick={() => setSort('alphabetical')}>Alphabetically, A-Z &#9662;</button>
              <button className="sort-btn" onClick={() => setSort('price')}>Price &#9662;</button>
            </div>
          </div>
        </div>
        <div className="product-list">
          {displayedProducts.map((product, idx) => (
            <div
              className="product-card"
              key={product._id || idx}
              onClick={() => handleProductClick(product)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  product.imageUrl
                    ? product.imageUrl.startsWith('/uploads/')
                      ? `${API_BASE}${product.imageUrl}` // Use API_BASE for images
                      : product.imageUrl
                    : '/default-image.png'
                }
                alt={product.name}
                onError={e => { e.target.onerror = null; e.target.src = '/default-image.png'; }}
              />
              <div className="product-card-overlay">
                <h3>{product.name}</h3>
                <p>₱{Number(product.price).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedProduct && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="modal-close" onClick={handleCloseModal}>
                &times;
              </button>
              <div className="modal-body" style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={
                    selectedProduct.imageUrl
                      ? selectedProduct.imageUrl.startsWith('/uploads/')
                        ? `${API_BASE}${selectedProduct.imageUrl}` // Use API_BASE for images
                        : selectedProduct.imageUrl
                      : '/default-image.png'
                  }
                  alt={selectedProduct.name}
                  style={{ width: "350px", marginRight: "40px" }}
                  onError={e => { e.target.onerror = null; e.target.src = '/default-image.png'; }}
                />
                <div>
                  <h2 style={{ marginBottom: 0 }}>{selectedProduct.name}</h2>
                  <h3 style={{ marginTop: 0 }}>₱{Number(selectedProduct.price).toLocaleString()}</h3>
                  <div>
                    <b>Category:</b> {selectedProduct.category}
                  </div>
                  <div>
                    <b>Description:</b> {selectedProduct.description}
                  </div>
                  <div>
                    <b>Stock:</b> {selectedProduct.stock}
                  </div>
                  <div>
                    <b>Availability:</b> {selectedProduct.stock > 0 ? "In Stock" : "Out of Stock"}
                  </div>
                  <div>
                    <b>Shipping:</b> Express Philippines Shipping
                  </div>
                  <div>
                    <b>Select Size:</b>
                  </div>
                  <div style={{ margin: "10px 0", display: "flex", gap: "10px" }}>
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          width: 56,
                          height: 56,
                          border: selectedSize === size ? "2.5px solid #000" : "1.5px solid #222",
                          background: selectedSize === size ? "#222" : "#fff",
                          color: selectedSize === size ? "#fff" : "#222",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                          fontWeight: 500,
                          transition: "all 0.15s"
                        }}
                        type="button"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <button
                    style={{
                      marginTop: 20,
                      width: "100%",
                      background: "#000",
                      color: "#fff",
                      padding: "15px 0",
                      fontSize: "18px",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <Footer />
        </div>
      </div>
      {/* End container */}
    </div>
  );
}

export default Product;