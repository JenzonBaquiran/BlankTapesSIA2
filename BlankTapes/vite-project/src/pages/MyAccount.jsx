import React, { useState, useEffect } from "react";
import "./MyAccount.css";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const statusColors = {
  PROCESSING: "#222",
  SHIPPED: "#222",
  DELIVERED: "#222",
  PENDING: "#222",
  CANCELLED: "#222",
};

export default function MyAccount() {
  const [details, setDetails] = useState({ name: "", email: "" });
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalBalance, setTotalBalance] = useState("₱0");
  const [totalCheckedOutItems, setTotalCheckedOutItems] = useState(0);

  useEffect(() => {
    // Fetch user details based on username in localStorage
    const username = localStorage.getItem("username");
    if (!username) return;

    fetch("http://localhost:1337/api/users")
      .then((res) => res.json())
      .then((users) => {
        const user = users.find((u) => u.username === username);
        if (user) {
          setDetails({
            name: user.username,
            email: user.email,
          });
        }
      })
      .catch(() => {});

    // Fetch recent orders for this user
    fetch(`http://localhost:1337/api/orders/customer/${username}`)
      .then((res) => res.json())
      .then((data) => {
        setTotalOrders(data.length);
        setRecentOrders(
          (data || [])
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3)
        );
        // Calculate total checked out items
        const totalItems = (data || []).reduce(
          (sum, order) =>
            sum +
            (order.items
              ? order.items.reduce((s, item) => s + (item.quantity || item.qty || 0), 0)
              : 0),
          0
        );
        setTotalCheckedOutItems(totalItems);

        // Optionally, calculate total balance from delivered orders
        const delivered = data.filter((o) => o.status === "DELIVERED");
        const balance = delivered.reduce((sum, o) => sum + (o.total || 0), 0);
        setTotalBalance("₱" + balance.toLocaleString());
      })
      .catch(() => {
        setRecentOrders([]);
        setTotalOrders(0);
        setTotalCheckedOutItems(0);
        setTotalBalance("₱0");
      });

    // Fetch total products (optional)
    fetch("http://localhost:1337/api/products")
      .then((res) => res.json())
      .then((data) => setTotalProducts(data.length))
      .catch(() => setTotalProducts(0));
  }, []);

  return (
    <div className="my-account-dashboard">
      <Navbar />
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon">
            <ShoppingCartIcon fontSize="inherit" />
          </div>
          <div className="summary-value">{totalOrders}</div>
          <div className="summary-label">Total Orders</div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <InventoryIcon fontSize="inherit" />
          </div>
          <div className="summary-value">{totalCheckedOutItems}</div>
          <div className="summary-label">Products Checked Out</div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <AttachMoneyIcon fontSize="inherit" />
          </div>
          <div className="summary-value">{totalBalance}</div>
          <div className="summary-label">Total Balance</div>
        </div>
      </div>
      <div className="dashboard-section">
        <div className="details-card">
          <h3>Account Details</h3>
          <p>
            <strong>Name:</strong> {details.name}
          </p>
          <p>
            <strong>Email:</strong> {details.email}
          </p>
        </div>
      </div>
      <div className="transactions-card">
        <h3>Recent Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.orderId || order._id}>
                <td>{order.orderId || order._id}</td>
                <td>₱{(order.total || 0).toLocaleString()}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{
                      background: statusColors[order.status] || "#222",
                      color: "#fff",
                      padding: "4px 16px",
                      borderRadius: 16,
                      fontWeight: 700,
                      fontSize: 14,
                      display: "inline-block",
                    }}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  {order.date
                    ? new Date(order.date).toLocaleDateString()
                    : ""}
                </td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: "center", color: "#888" }}
                >
                  No recent orders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}