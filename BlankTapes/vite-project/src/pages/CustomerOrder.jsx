import React, { useState, useEffect } from 'react';
import Navbar from "./navbar.jsx";
import Footer from "./Footer.jsx";
import './CustomerOrder.css';
import { API_BASE } from "../config"

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
  const [orders, setOrders] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All Orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showBankDisabledModal, setShowBankDisabledModal] = useState(false);
  const BANK_API_BASE = "http://192.168.8.201:5000/api";
  const ADMIN_ACCOUNT_NUMBER = "229548608885";
  const [customerBankInfo, setCustomerBankInfo] = useState(null);
  const [bankFetchError, setBankFetchError] = useState("");

  // Fetch orders for logged-in customer
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) return;
    const API_URL = `${API_BASE}/api/orders/customer/${username}`;
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setOrders(
          (data || []).map(order => ({
            id: order.orderId || order._id,
            date: new Date(order.date).toLocaleDateString(),
            items: order.items?.reduce((sum, i) => sum + (i.quantity || i.qty), 0),
            status: order.status?.charAt(0).toUpperCase() + order.status?.slice(1).toLowerCase(),
            price: "₱" + (order.total || 0).toLocaleString() + " PHP",
            tracking: order.orderId || order._id,
            img: order.items?.[0]?.img
              ? order.items[0].img.startsWith('/uploads/')
                ? `${API_BASE}${order.items[0].img}`
                : order.items[0].img
              : "https://i.imgur.com/2nCt3Sbl.jpg",
            details: order.items || [],
            paid: order.paid || false, // <-- Add paid info from backend (default false)
            raw: order
          }))
        );
      });
  }, []);

  const filteredOrders = selectedStatus === "All Orders"
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  const handleCancelOrder = async () => {
    // Update status in backend
    await fetch(`${API_BASE}/api/orders/${selectedOrder.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Cancelled' }),
    });

    // Update status in UI
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === selectedOrder.id ? { ...order, status: 'Cancelled' } : order
      )
    );
    setSelectedOrder(prev =>
      prev ? { ...prev, status: 'Cancelled' } : prev
    );
  };

  // Fetch customer info when account number changes
  useEffect(() => {
    if (!accountNumber || accountNumber.length < 6) {
      setCustomerBankInfo(null);
      setBankFetchError("");
      setShowBankDisabledModal(false);
      return;
    }
    fetch(`${BANK_API_BASE}/users`)
      .then(res => res.json())
      .then(users => {
        const found = users.find(u => u.accountNumber === accountNumber);
        if (found) {
          setCustomerBankInfo(found);
          setAccountName(found.name || "");
          setBankFetchError("");
          // Check if bank account is disabled
          if (found.status && found.status.toLowerCase() === "disabled") {
            setShowBankDisabledModal(true);
          } else {
            setShowBankDisabledModal(false);
          }
        } else {
          setCustomerBankInfo(null);
          setBankFetchError("Account not found.");
          setShowBankDisabledModal(false);
        }
      })
      .catch(() => {
        setBankFetchError("Bank connection error.");
        setShowBankDisabledModal(false);
      });
  }, [accountNumber]);

  // Payment handler
  const handleBankPayment = async () => {
    setBankFetchError("");
    if (!customerBankInfo) {
      setBankFetchError("Please enter a valid account number.");
      return;
    }
    const amount = Number(
      (selectedOrder.price || "0")
        .replace(/[^\d.]/g, "")
    );
    try {
      const res = await fetch(`${BANK_API_BASE}/users/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUserId: customerBankInfo._id || customerBankInfo.id,
          toAccountNumber: ADMIN_ACCOUNT_NUMBER,
          amount,
          description: `Order payment for ${selectedOrder.id}`,
        }),
      });
      const data = await res.json();
      if (
        data.success ||
        data.status === "ok" ||
        data.transactionId ||
        data.amountDeducted ||
        (data.message && data.message.toLowerCase().includes("success"))
      ) {
        setShowPayModal(false);
        setShowSuccessModal(true);
        await fetch(`${API_BASE}/api/orders/${selectedOrder.id}/pay`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paid: true }),
        });
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === selectedOrder.id ? { ...order, paid: true } : order
          )
        );
        setSelectedOrder(prev =>
          prev ? { ...prev, paid: true } : prev
        );
      } else {
        setBankFetchError(data.error || "Payment failed.");
      }
    } catch {
      setBankFetchError("Bank connection error.");
    }
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
                <div className={`order-paid-status ${order.paid ? "paid" : "unpaid"}`}>
                  {order.paid ? "Paid" : "Unpaid"}
                </div>
              </div>
              <span
                className={`order-status ${order.status === "Cancelled" ? "cancelled" : "shipped"}`}
              >
                {order.status}
              </span>
            </div>
            <div className="order-summary-body">
              <img src={order.img} alt="Product" className="item-img" />
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
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span className={`order-status ${selectedOrder.status === "Cancelled" ? "cancelled" : "shipped"}`}>{selectedOrder.status}</span>
          </div>
        </div>
        <div className="order-main">
          <div className="order-status-section">
            <div className="status-progress">
              {["Pending", "Confirmed", "Processing", "Shipped", "Delivered"].map((label, index, arr) => (
                <div className="status-step-wrapper" key={label}>
                  <div className={`status-step ${label === selectedOrder.status ? "completed" : ""}`}>
                    <span className="circle">{label === selectedOrder.status ? "✓" : index + 1}</span>
                    <span className={label === "Delivered" ? "delivered" : ""}>{label}</span>
                  </div>
                  {index < arr.length - 1 && (
                    <div className={`status-bar ${label === selectedOrder.status ? "completed" : ""}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="order-details-section">
            <div className="order-card">
              <h4>Order Items</h4>
              {selectedOrder.details.map((item, idx) => (
                <div className="item-row" key={idx}>
                  <img
                    src={
                      item.img
                        ? item.img.startsWith('/uploads/')
                          ? `${API_BASE}${item.img}`
                          : item.img
                        : "https://i.imgur.com/2nCt3Sbl.jpg"
                    }
                    alt={item.name}
                    className="item-img"
                    onError={e => { e.target.src = "https://i.imgur.com/2nCt3Sbl.jpg"; }}
                  />
                  <div>
                    <div className="item-title">{item.name}</div>
                    <div className="item-desc">Size: {item.size || "N/A"}</div>
                    <div className="item-qty">Quantity: {item.quantity || item.qty}</div>
                  </div>
                  <div className="item-price">₱{Number(item.price).toLocaleString()}</div>
                </div>
              ))}
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
                <div>
                  Payment Status:{" "}
                  <span className={`order-paid-status ${selectedOrder.paid ? "paid" : "unpaid"}`}>
                    {selectedOrder.paid ? "Paid" : "Unpaid"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {selectedOrder.status !== "Cancelled" && (
          <div className="pay-btn-container">
            <button
              className="pay-btn"
              onClick={() => setShowPayModal(true)}
              disabled={selectedOrder.paid}
            >
              Pay Now
            </button>
            <button
              className="cancel-order-btn"
              onClick={handleCancelOrder}
              disabled={selectedOrder.paid}
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>
      {/* Payment Modal */}
      {showPayModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close-btn"
              onClick={() => setShowPayModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3>Payment Details</h3>
            <div className="modal-fields">
              <label>Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                className="modal-input"
                placeholder="Enter account number"
              />
              {bankFetchError && (
                <div style={{ color: "red", fontSize: 13, marginBottom: 4 }}>{bankFetchError}</div>
              )}
              {customerBankInfo && (
                <>
                  <label>Account Name</label>
                  <input
                    type="text"
                    value={customerBankInfo.name}
                    className="modal-input"
                    disabled
                  />
                </>
              )}
            </div>
            <button
              className="modal-submit-btn"
              onClick={handleBankPayment}
              disabled={!customerBankInfo || showBankDisabledModal}
            >
              Submit Payment
            </button>
          </div>
        </div>
      )}
      {/* Bank Disabled Modal */}
      {showBankDisabledModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: "center" }}>
            <h2 style={{ color: "red", marginBottom: 16 }}>Bank Account Disabled</h2>
            <p>Your bank account is disabled. Please contact your bank for assistance.</p>
            <button
              className="modal-submit-btn"
              style={{ marginTop: 24 }}
              onClick={() => setShowBankDisabledModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: 16 }}>Payment Successful!</h2>
            <p>Your payment has been processed and your order is now marked as paid.</p>
            <button
              className="modal-submit-btn"
              style={{ marginTop: 24 }}
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );

  return showDetails ? orderDetails : orderSummary;
}

export default CustomerOrder;