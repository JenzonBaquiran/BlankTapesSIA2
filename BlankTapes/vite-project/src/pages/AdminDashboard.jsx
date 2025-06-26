import React from 'react'
import './AdminDashboard.css'
import AdminSidebar from '../pages/AdminSidebar'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';

function AdminDashboard() {
  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      <main className="admin-dashboard-main">
        <h2 className="dashboard-title">DASHBOARD OVERVIEW</h2>
        <div className="dashboard-cards">
          <div className="dashboard-card users">
            <div className="icon"><PersonIcon /></div>

            <div>
              <div className="card-value">5</div>
              <div className="card-label">Total Users</div>
            </div>
          </div>
          <div className="dashboard-card orders">
            <div className="icon"><ShoppingCartIcon /></div>
            <div>
              <div className="card-value">4</div>
              <div className="card-label">Total Orders</div>
            </div>
          </div>
          <div className="dashboard-card products">
            <div className="icon"><InventoryIcon /></div>
            <div>
              <div className="card-value">5</div>
              <div className="card-label">Total Products</div>
            </div>
          </div>
          <div className="dashboard-card revenue">
            <div className="icon"><AttachMoneyIcon /></div>
            <div>
              <div className="card-value">₱21,200</div>
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
                <tr>
                  <td>ORD-001</td>
                  <td>Mike Customer</td>
                  <td>₱8,400</td>
                  <td><span className="status processing">PROCESSING</span></td>
                  <td>12/18/2024</td>
                </tr>
                <tr>
                  <td>ORD-002</td>
                  <td>Emma Wilson</td>
                  <td>₱2,800</td>
                  <td><span className="status shipped">SHIPPED</span></td>
                  <td>12/17/2024</td>
                </tr>
                <tr>
                  <td>ORD-003</td>
                  <td>David Brown</td>
                  <td>₱4,400</td>
                  <td><span className="status delivered">DELIVERED</span></td>
                  <td>12/15/2024</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard