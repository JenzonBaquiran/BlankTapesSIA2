import React, { useEffect, useState } from 'react'
import './AdminDashboard.css'
import AdminSidebar from '../pages/AdminSidebar'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';

function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetch("http://localhost:1337/api/users")
      .then(res => res.json())
      .then(data => setTotalUsers(data.length))
      .catch(() => setTotalUsers(0));

    fetch("http://localhost:1337/api/products")
      .then(res => res.json())
      .then(data => setTotalProducts(data.length))
      .catch(() => setTotalProducts(0));

    fetch("http://localhost:1337/api/orders")
      .then(res => res.json())
      .then(data => {
        setTotalOrders(data.length);
        setRecentOrders(data.slice(0, 3)); // latest 3 orders
        // Calculate total revenue from delivered orders
        const revenue = data
          .filter(order => order.status === "DELIVERED")
          .reduce((sum, order) => sum + (order.total || 0), 0);
        setTotalRevenue(revenue);
      })
      .catch(() => {
        setTotalOrders(0);
        setRecentOrders([]);
        setTotalRevenue(0);
      });
  }, []);

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      <main className="admin-dashboard-main">
        <h2 className="dashboard-title">DASHBOARD OVERVIEW</h2>
        <div className="dashboard-cards">
          <div className="dashboard-card users">
            <div className="icon"><PersonIcon /></div>
            <div>
              <div className="card-value">{totalUsers}</div>
              <div className="card-label">Total Users</div>
            </div>
          </div>
          <div className="dashboard-card orders">
            <div className="icon"><ShoppingCartIcon /></div>
            <div>
              <div className="card-value">{totalOrders}</div>
              <div className="card-label">Total Orders</div>
            </div>
          </div>
          <div className="dashboard-card products">
            <div className="icon"><InventoryIcon /></div>
            <div>
              <div className="card-value">{totalProducts}</div>
              <div className="card-label">Total Products</div>
            </div>
          </div>
          <div className="dashboard-card revenue">
            <div className="icon"><AttachMoneyIcon /></div>
            <div>
              <div className="card-value">₱{totalRevenue.toLocaleString()}</div>
              <div className="card-label">Total Revenue</div>
            </div>
          </div>
        </div>
        <section className="recent-orders-section">
          <h3>Recent Orders</h3>
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.orderId || order._id}>
                    <td>{order.orderId || order._id}</td>
                    <td>{order.customer?.name}</td>
                    <td>₱{(order.total || 0).toLocaleString()}</td>
                    <td>
                      <span className={`status ${order.status?.toLowerCase()}`}>{order.status}</span>
                    </td>
                    <td>{order.date ? new Date(order.date).toLocaleDateString() : ""}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "#888" }}>No recent orders.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard