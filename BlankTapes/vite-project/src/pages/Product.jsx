import React, { useState } from 'react';
import './Product.css';
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import hoodieBlack from '../img/hoodie-black.png';
import hoodieAshGrey from '../img/hoodie-ash-grey.png';
import hoodieCobalt from '../img/hoodie-cobalt.png';
import hoodieRacingGreen from '../img/hoodie-racing-green.png';
import hoodieStorm from '../img/hoodie-storm.png';
import hoodieMidPurple from '../img/hoodie-mid-purple.png';
import shirtAgedBlack from '../img/shirt-aged-black.png';
import shirtBlack from '../img/shirt-black.png';
import shirtCobalt from '../img/shirt-cobalt.png';
import shortAgedBlack from '../img/short-aged-black.png';
import shortMidPurple from '../img/short-mid-purple.png';
import shortButterCream from '../img/short-butter-cream.png';

// Add color and type to each product
const products = [
  {
    img: hoodieBlack,
    title: "BLKTPS © HOODIE BLACK",
    price: "₱2,800.00 PHP",
    color: "Black",
    type: "hoodie",
    available: true
  },
  {
    img: shortButterCream,
    title: "BLKTPS © SHORT BUTTER CREAM",
    price: "₱950.00 PHP",
    color: "Butter Cream",
    type: "short",
    available: true
  },
  {
    img: hoodieAshGrey,
    title: "BLKTPS © HOODIE ASH GREY",
    price: "₱2,800.00 PHP",
    color: "Ash Grey",
    type: "hoodie",
    available: true
  },
  {
    img: hoodieCobalt,
    title: "BLKTPS © HOODIE COBALT",
    price: "₱2,800.00 PHP",
    color: "Cobalt",
    type: "hoodie",
    available: true
  },
  {
    img: hoodieRacingGreen,
    title: "BLKTPS © HOODIE RACING GREEN",
    price: "₱2,800.00 PHP",
    color: "Racing Green",
    type: "hoodie",
    available: true
  },
  {
    img: hoodieStorm,
    title: "BLKTPS © HOODIE STORM",
    price: "₱2,800.00 PHP",
    color: "Storm",
    type: "hoodie",
    available: true
  },
  {
    img: hoodieMidPurple,
    title: "BLKTPS © HOODIE MID PURPLE",
    price: "₱2,800.00 PHP",
    color: "Mid Purple",
    type: "hoodie",
    available: true
  },
  {  
    img: shirtAgedBlack,
    title: "BLKTPS © SHIRT AGED BLACK",
    price: "₱900.00 PHP",
    color: "Aged Black",
    type: "shirt",
    available: true
  },
  {
    img: shirtBlack,
    title: "BLKTPS © SHIRT BLACK",
    price: "₱900.00 PHP",
    color: "Black",
    type: "shirt",
    available: true
  },
  {
    img: shirtCobalt,
    title: "BLKTPS © SHIRT COBALT",
    price: "₱900.00 PHP",
    color: "Cobalt",
    type: "shirt",
    available: true
  },
  {
    img: shortButterCream,
    title: "BLKTPS © SHORT BUTTER CREAM",
    price: "₱950.00 PHP",
    color: "Butter Cream",
    type: "short",
    available: true
  },
  {
    img: shortAgedBlack,
    title: "BLKTPS © SHORT AGED BLACK",
    price: "₱950.00 PHP",
    color: "Aged Black",
    type: "short",
    available: true
  },
  {
    img: shortMidPurple,
    title: "BLKTPS © SHORT MID PURPLE",
    price: "₱950.00 PHP",
    color: "Mid Purple",
    type: "short",
    available: true
  },
  {
    img: shortButterCream,
    title: "BLKTPS © SHORT BUTTER CREAM",
    price: "₱950.00 PHP",
    color: "Butter Cream",
    type: "short",
    available: true
  },
];

// Color options for each type
const colorOptions = {
  hoodie: [
    { img: hoodieBlack, color: "Black" },
    { img: hoodieAshGrey, color: "Ash Grey" },
    { img: hoodieCobalt, color: "Cobalt" },
    { img: hoodieRacingGreen, color: "Racing Green" },
    { img: hoodieStorm, color: "Storm" },
    { img: hoodieMidPurple, color: "Mid Purple" },
  ],
  shirt: [
    { img: shirtAgedBlack, color: "Aged Black" },
    { img: shirtBlack, color: "Black" },
    { img: shirtCobalt, color: "Cobalt" },
  ],
  short: [
    { img: shortAgedBlack, color: "Aged Black" },
    { img: shortMidPurple, color: "Mid Purple" },
    { img: shortButterCream, color: "Butter Cream" },
  ]
};

function Product() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("XS");
  const [sort, setSort] = useState(null);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  // Filtering and sorting logic
  let filteredProducts = [...products];
  if (availabilityFilter === 'inStock') {
    filteredProducts = filteredProducts.filter(p => p.available);
  }
  if (sort === 'alphabetical') {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'price') {
    filteredProducts.sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
      return priceA - priceB;
    });
  } else if (sort === 'type') {
    const typeOrder = { hoodie: 1, shirt: 2, short: 3 };
    filteredProducts.sort((a, b) => {
      return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
    });
  }

  // Filter products by type if a modal is open
  const displayedProducts = selectedProduct
    ? filteredProducts.filter(p => p.type === selectedProduct.type)
    : filteredProducts;

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedColor(product.color);
    setSelectedSize("XS"); // Reset size on open
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setSelectedColor(null);
    setSelectedSize("XS");
  };

  // Find the color options for the current product type
  const currentType = selectedProduct ? selectedProduct.type : null;
  const currentColors = currentType ? colorOptions[currentType] : [];

  // Find the product for the selected color
  const getProductByColor = (color) => {
    return products.find(
      (p) => p.type === currentType && p.color === color
    );
  };

  // Add to cart function
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const key = `${selectedProduct.title}-${selectedColor}-${selectedSize}`;
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
            title: selectedProduct.title,
            color: selectedColor,
            img: getProductByColor(selectedColor)?.img || selectedProduct.img,
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
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
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
                      <img src={item.img} alt={item.title} />
                      <div className="cart-item-details">
                        <div style={{ fontWeight: 600 }}>{item.title}</div>
                        <div style={{ fontSize: 14, color: "#555" }}>Color: {item.color}</div>
                        <div style={{ fontSize: 14, color: "#555" }}>Size: {item.size}</div>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>{item.price}</div>
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
                  onClick={() => {
                    // Prepare new order object(s)
                    const now = new Date();
                    const orderId = `BT-${now.getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`;
                    const newOrder = {
                      id: orderId,
                      date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                      items: cart.reduce((sum, item) => sum + item.quantity, 0),
                      status: "Pending",
                      price: `₱${cartTotal.toLocaleString()} PHP`,
                      tracking: "BT" + Math.floor(Math.random() * 1000000000),
                      img: cart[0]?.img || "",
                    };
                    // Get existing orders from localStorage
                    const existingOrders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
                    // Add new order
                    localStorage.setItem("customerOrders", JSON.stringify([newOrder, ...existingOrders]));
                    // Optionally clear cart
                    setCart([]);
                    // Redirect to CustomerOrder page
                    window.location.href = "/customerorder";
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
              key={idx}
              onClick={() => handleProductClick(product)}
              style={{ cursor: "pointer" }}
            >
              <img src={product.img} alt={product.title} />
              <div className="product-card-overlay">
                <h3>{product.title}</h3>
                <p>{product.price}</p>
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
                  src={getProductByColor(selectedColor)?.img || selectedProduct.img}
                  alt={selectedProduct.title}
                  style={{ width: "350px", marginRight: "40px" }}
                />
                <div>
                  <h2 style={{ marginBottom: 0 }}>{selectedProduct.title}</h2>
                  <h3 style={{ marginTop: 0 }}>{selectedProduct.price}</h3>
                  <div>
                    <b>Color:</b> {selectedColor}
                  </div>
                  <div style={{ margin: "10px 0", display: "flex", gap: 16 }}>
                    {currentColors.map((c) => (
                      <span
                        key={c.color}
                        onClick={() => {
                          setSelectedColor(c.color);
                          // Change modal product if color is different
                          const prod = getProductByColor(c.color);
                          if (prod) setSelectedProduct(prod);
                        }}
                        style={{
                          display: "inline-block",
                          borderRadius: "100%",
                          border: selectedColor === c.color ? "3px solid #000" : "2px solid #eee",
                          padding: 3,
                          background: "#fff",
                          cursor: "pointer",
                          marginRight: 8,
                          transition: "border 0.2s"
                        }}
                      >
                        <img src={c.img} alt={c.color} width={40} style={{ borderRadius: "50%" }} />
                      </span>
                    ))}
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
                  <div>
                    <b>Availability:</b> In Stock
                  </div>
                  <div>
                    <b>Shipping:</b> Express Philippines Shipping
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