import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './ManageOrder.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const ORDER_STATUS = [

  'All Status',
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

const STATUS_COLORS = {
  Pending: { bg: '#fef3c7', color: '#f59e1b' },
  Processing: { bg: '#e0e7ff', color: '#2563eb' },
  Shipped: { bg: '#ede9fe', color: '#6366f1' },
  Delivered: { bg: '#dcfce7', color: '#22c55e' },
  Cancelled: { bg: '#fdeaea', color: '#ef4444' },
};

const ORDERS = [
  {
    id: 'ORD-001',
    customer: { name: 'Mike Customer', email: 'mike@email.com', address: '123 Main St, Manila, Philippines' },
    items: [
      { name: 'BLKTPS © HOODIE BLACK', qty: 2, price: 2800 },
      { name: 'BLKTPS © HOODIE COBALT', qty: 1, price: 2800 },
    ],
    status: 'Processing',
    date: '12/18/2024',
  },
  {
    id: 'ORD-002',
    customer: { name: 'Emma Wilson', email: 'emma@email.com', address: '456 Oak St, Manila, Philippines' },
    items: [
      { name: 'BLKTPS © HOODIE COBALT', qty: 1, price: 2800 },
    ],
    status: 'Shipped',
    date: '12/17/2024',
  },
  {
    id: 'ORD-003',
    customer: { name: 'David Brown', email: 'david@email.com', address: '789 Pine St, Manila, Philippines' },
    items: [
      { name: 'BLKTPS © HOODIE BLACK', qty: 1, price: 4400 },
    ],
    status: 'Delivered',
    date: '12/15/2024',
  },
  {
    id: 'ORD-004',
    customer: { name: 'Lisa Garcia', email: 'lisa@email.com', address: '321 Elm St, Manila, Philippines' },
    items: [
      { name: 'BLKTPS © HOODIE COBALT', qty: 2, price: 2800 },
    ],
    status: 'Pending',
    date: '12/20/2024',
  },
];

function getOrderTotal(items) {
  return items.reduce((sum, item) => sum + item.qty * item.price, 0);
}

function ManageOrder() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Status');
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [orders, setOrders] = useState(ORDERS);

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'All Status' || order.status === status;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(orders =>
      orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setEditOrder(null);
  };

  return (
    <>
      <AdminSidebar />
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
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600 }}>{order.customer.name}</div>
                      <div style={{ fontSize: '0.97em', color: '#6b7280' }}>{order.customer.email}</div>
                    </div>
                  </td>
                  <td>{order.items.reduce((sum, i) => sum + i.qty, 0)} item(s)</td>
                  <td>₱{getOrderTotal(order.items).toLocaleString()}</td>
                  <td>
                    <span
                      className="status-badge"
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{order.date}</td>
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
                        onClick={() => alert('Delete not implemented')}
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
                Order Details - {viewOrder.id}
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Customer Information</div>
                <div><b>Name:</b> {viewOrder.customer.name}</div>
                <div><b>Email:</b> {viewOrder.customer.email}</div>
                <div><b>Shipping Address:</b> {viewOrder.customer.address}</div>
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
                  {viewOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: 'left' }}>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>₱{item.price.toLocaleString()}</td>
                      <td>₱{(item.qty * item.price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.1em' }}>
                Total: ₱{getOrderTotal(viewOrder.items).toLocaleString()}
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
                Update Order Status - {editOrder.id}
              </div>
              <form
                className="order-modal-form"
                onSubmit={e => {
                  e.preventDefault();
                  const newStatus = e.target.status.value;
                  handleStatusUpdate(editOrder.id, newStatus);
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

export default ManageOrder;