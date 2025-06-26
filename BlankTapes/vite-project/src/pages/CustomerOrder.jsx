import React, { useState } from 'react';
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import './CustomerOrder.css';

const initialOrders = [
  {
    id: "BT-2024-002",
    date: "January 22, 2024",
    items: 1,
    status: "Shipped",
    price: "₱2,800.00 PHP",
    tracking: "BT987654321",
    img: "https://i.imgur.com/2nCt3Sbl.jpg"
  },
  {
    id: "BT-2024-003",
    date: "February 10, 2024",
    items: 2,
    status: "Shipped",
    price: "₱5,600.00 PHP",
    tracking: "BT123456789",
    img: "https://i.imgur.com/2nCt3Sbl.jpg"
  },
  {
    id: "BT-2024-004",
    date: "February 15, 2024",
    items: 3,
    status: "Shipped",
    price: "₱8,400.00 PHP",
    tracking: "BT987654322",
    img: "https://i.imgur.com/2nCt3Sbl.jpg"
  }
];

const statusOptions = [
  "All Orders",
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled"
];

function CustomerOrder() {
  const [orders, setOrders] = useState(initialOrders);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Shipped");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = selectedStatus === "All Orders"
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  const handleCancelOrder = () => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== selectedOrder.id));
    setShowDetails(false);
    setSelectedOrder(null);
  };

  const orderSummary = (
    <div className="customer-order-page">
      <Navbar />
      <div className="order-list-searchbar">
        <input className="order-search" placeholder="Search orders by number, product name..." />
        <select
          className="order-filter-select"
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
        >
          {statusOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="order-list-container">
        {filteredOrders.map(order => (
          <div className="order-summary-card" key={order.id + order.tracking}>
            <div className="order-summary-header">
              <div>
                <div className="order-summary-title">Order {order.id}</div>
                <div className="order-summary-date">
                  {order.date} &nbsp; <span role="img" aria-label="item">📦</span> {order.items} item{order.items > 1 ? "s" : ""}
                </div>
              </div>
              <span className={`order-status shipped`}>{order.status}</span>
            </div>
            <div className="order-summary-body">
              <img src={order.img} alt="BLKTPS @ HOODIE BLUE" className="item-img" />
              <div>
                <div className="order-summary-price">{order.price}</div>
                <div className="order-summary-tracking">Tracking: {order.tracking}</div>
              </div>
              <button
                className="view-details-btn"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowDetails(true);
                }}
              >
                Details <span>&#8594;</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );

  const orderDetails = selectedOrder && (
    <div className="customer-order-page">
      <Navbar />
      <div className="order-container">
        <a
          href="#"
          className="back-link"
          onClick={e => {
            e.preventDefault();
            setShowDetails(false);
            setSelectedOrder(null);
          }}
        >
          &lt; Back to Orders
        </a>
        <div className="order-header">
          <div>
            <h2>Order {selectedOrder.id}</h2>
            <span className="order-date">Placed on {selectedOrder.date}</span>
          </div>
          <span className="order-status shipped">{selectedOrder.status}</span>
        </div>
        <div className="order-main">
          <div className="order-status-section">
            <div className="status-progress">
              {[
                { label: "Pending", completed: true },
                { label: "Confirmed", completed: true },
                { label: "Processing", completed: true },
                { label: "Shipped", completed: true },
                { label: "Delivered", completed: false },
              ].map((step, index, arr) => (
                <div className="status-step-wrapper" key={step.label}>
                  <div className={`status-step ${step.completed ? "completed" : ""}`}>
                    <span className="circle">{step.completed ? "✓" : index + 1}</span>
                    <span className={step.label === "Delivered" ? "delivered" : ""}>{step.label}</span>
                  </div>
                  {index < arr.length - 1 && (
                    <div className={`status-bar ${step.completed ? "completed" : ""}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="order-details-section">
            <div className="order-card">
              <h4>Order Items</h4>
              <div className="item-row">
                <img src={selectedOrder.img} alt="BLKTPS @ HOODIE BLUE" className="item-img" />
                <div>
                  <div className="item-title">BLKTPS @ HOODIE BLUE</div>
                  <div className="item-desc">Color: Royal Blue · Size: XL</div>
                  <div className="item-qty">Quantity: {selectedOrder.items}</div>
                </div>
                <div className="item-price">{selectedOrder.price}</div>
              </div>
              <div className="order-total">
                <span>Total</span>
                <span className="total-amount">{selectedOrder.price}</span>
              </div>
            </div>
            <div className="order-card">
              <h4>Tracking Information</h4>
              <div>
                <div>Tracking Number: <strong>{selectedOrder.tracking}</strong></div>
                <div>Estimated Delivery: <strong>{selectedOrder.date}</strong></div>
              </div>
            </div>
            <button
              className="cancel-order-btn"
              onClick={handleCancelOrder}
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  return showDetails ? orderDetails : orderSummary;
}

export default CustomerOrder;