import React, { useState, useEffect } from 'react';
import StaffSidebar from '../pages/StaffSidebar';
import './StaffManageOrder.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE } from "../config"

const API_URL = `${API_BASE}/api/orders`; // <-- add /api

const ORDER_STATUS = [
  'All Status',
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

function getOrderTotal(items) {
  return items.reduce((sum, item) => sum + (item.quantity || item.qty) * item.price, 0);
}

function StaffManageOrder() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Status');
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  // Fetch orders from backend
  useEffect(() => {

    fetch(`${API_BASE}/api/orders`) // <-- fixed endpoint
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(() => setOrders([]));
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      (order.orderId || order.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.customer?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.customer?.email || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'All Status' || (order.status || '').toLowerCase() === status.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Update order status in backend
  const handleStatusUpdate = async (orderId, newStatus) => {
    await fetch(`${API_BASE}/api/orders/${orderId}`, { // <-- fixed endpoint
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setOrders(orders =>
      orders.map(order =>
        (order.orderId || order.id) === orderId ? { ...order, status: newStatus } : order
      )
    );
    setEditOrder(null);
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    await fetch(`${API_BASE}/api/orders/${orderId}`, { // <-- fixed endpoint
      method: "DELETE",
    });
    setOrders(orders => orders.filter(order => (order.orderId || order.id) !== orderId));
  };

  return (
    <>
      <StaffSidebar />
      <div className="order-management-container">
        <div className="order-management-header">
          <div className="order-management-title">ORDER MANAGEMENT</div>
        </div>
        <div className="order-filters-container">
          <input
            className="order-search-input"
            placeholder="Search orders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="order-filter-select"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            {ORDER_STATUS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="order-table-container">
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th> {/* Added Payment column */}
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.orderId || order.id}>
                  <td>{order.orderId || order.id}</td>
                  <td>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600 }}>{order.customer?.name}</div>
                      <div style={{ fontSize: '0.97em', color: '#6b7280' }}>{order.customer?.email}</div>
                    </div>
                  </td>
                  <td>{order.items?.reduce((sum, i) => sum + (i.quantity || i.qty), 0)} item(s)</td>
                  <td>₱{getOrderTotal(order.items || []).toLocaleString()}</td>
                  <td>
                    <span
                      className={`status-badge ${((order.status || '').toLowerCase())}`}
                    >
                      {(order.status || '').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`payment-badge ${order.paid ? 'paid' : 'unpaid'}`}
                    >
                      {order.paid ? 'PAID' : 'UNPAID'}
                    </span>
                  </td>
                  <td>{order.date ? (new Date(order.date).toLocaleDateString()) : ''}</td>
                  <td>
                    <div className="order-actions">
                      <button
                        className="action-btn"
                        title="View"
                        onClick={() => setViewOrder(order)}
                      >
                        <RemoveRedEyeIcon />
                      </button>
                      <button
                        className="action-btn edit"
                        title="Edit"
                        onClick={() => setEditOrder(order)}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="action-btn delete"
                        title="Delete"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this order?")) {
                            handleDeleteOrder(order.orderId || order.id);
                          }
                        }}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* View Order Modal */}
        {viewOrder && (
          <div className="order-modal-overlay">
            <div className="order-modal" style={{ maxWidth: 500 }}>
              <div className="order-modal-title">
                Order Details - {viewOrder.orderId || viewOrder.id}
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Customer Information</div>
                <div><b>Name:</b> {viewOrder.customer?.name}</div>
                <div><b>Email:</b> {viewOrder.customer?.email}</div>
                {/* <div><b>Shipping Address:</b> {viewOrder.customer?.address}</div> */}
              </div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Order Items</div>
              <table className="order-table" style={{ background: '#f7f9fb', borderRadius: 12, marginBottom: 8 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(viewOrder.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: 'left' }}>{item.name}</td>
                      <td>{item.quantity || item.qty}</td>
                      <td>₱{item.price?.toLocaleString()}</td>
                      <td>₱{((item.quantity || item.qty) * item.price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.1em' }}>
                Total: ₱{getOrderTotal(viewOrder.items || []).toLocaleString()}
              </div>
              <div className="order-modal-actions">
                <button className="order-modal-cancel" onClick={() => setViewOrder(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Status Modal */}
        {editOrder && (
          <div className="order-modal-overlay">
            <div className="order-modal" style={{ maxWidth: 400 }}>
              <div className="order-modal-title">
                Update Order Status - {editOrder.orderId || editOrder.id}
              </div>
              <form
                className="order-modal-form"
                onSubmit={e => {
                  e.preventDefault();
                  const newStatus = e.target.status.value;
                  handleStatusUpdate(editOrder.orderId || editOrder.id, newStatus);
                }}
              >
                <label>Order Status</label>
                <select
                  name="status"
                  defaultValue={editOrder.status}
                  style={{ marginBottom: 18 }}
                >
                  {ORDER_STATUS.filter(s => s !== 'All Status').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="order-modal-actions">
                  <button
                    type="button"
                    className="order-modal-cancel"
                    onClick={() => setEditOrder(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="order-modal-submit">
                    Update Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default StaffManageOrder;