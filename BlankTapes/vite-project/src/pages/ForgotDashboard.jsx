import React, { useEffect, useState } from 'react'
import AdminSidebar from './AdminSidebar'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault'
import DeleteIcon from '@mui/icons-material/Delete'
import { API_BASE } from "../config"
import './ForgotDashboard.css'

function ForgotDashboard() {
  const [requests, setRequests] = useState([])

  // Example: Fetch password reset requests (replace endpoint as needed)
  useEffect(() => {
    fetch(`${API_BASE}/api/forgot-requests`)
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(() => setRequests([]))
  }, [])

  // Approve handler
  const handleApprove = async (id) => {
    await fetch(`${API_BASE}/api/forgot-requests/${id}/approve`, { method: 'POST' })
    setRequests(reqs =>
      reqs.map(r => r._id === id ? { ...r, status: "approved" } : r)
    )
  }

  // Decline handler
  const handleDecline = async (id) => {
    await fetch(`${API_BASE}/api/forgot-requests/${id}/decline`, { method: 'POST' })
    setRequests(reqs =>
      reqs.map(r => r._id === id ? { ...r, status: "declined" } : r)
    )
  }

  // Delete handler
  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/api/forgot-requests/${id}`, { method: 'DELETE' })
    setRequests(reqs => reqs.filter(r => r._id !== id))
  }

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      <main className="admin-dashboard-main">
        <h2 className="dashboard-title">FORGOT PASSWORD REQUESTS</h2>
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Requested At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#888" }}>No requests.</td>
                </tr>
              )}
              {requests.map(req => (
                <tr key={req._id}>
                  <td>{req.username}</td>
                  <td>{req.email}</td>
                  <td>{req.requestedAt ? new Date(req.requestedAt).toLocaleString() : ""}</td>
                  <td>
                    <span className="status-badge">
                      {req.status ? req.status.toUpperCase() : "PENDING"}
                    </span>
                  </td>
                  <td>
                    <button
                      title="Approve"
                      className="action-btn"
                      onClick={() => req.status === "pending" && handleApprove(req._id)}
                      disabled={req.status !== "pending"}
                    >
                      <CheckBoxIcon className="action-icon" />
                    </button>
                    <button
                      title="Decline"
                      className="action-btn"
                      onClick={() => req.status === "pending" && handleDecline(req._id)}
                      disabled={req.status !== "pending"}
                    >
                      <DisabledByDefaultIcon className="action-icon" />
                    </button>
                    <button
                      title="Delete"
                      className="action-btn"
                      onClick={() => handleDelete(req._id)}
                    >
                      <DeleteIcon className="action-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default ForgotDashboard