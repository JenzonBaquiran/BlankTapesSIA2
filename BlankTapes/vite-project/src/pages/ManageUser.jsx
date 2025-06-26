import React, { useState, useEffect } from 'react';
import AdminSidebar from '../pages/AdminSidebar';
import './AdminDashboard.css';
import './ManageUser.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'customer', status: 'active' });
  const [formError, setFormError] = useState("");

  // Fetch users from backend
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:1337/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setForm({ username: '', email: '', password: '', role: 'customer', status: 'active' });
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setForm({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
      id: user.id
    });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleDeleteUser = async (id) => {
    const res = await fetch(`http://localhost:1337/api/users/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      fetchUsers();
    } else {
      alert(data.error || "Failed to delete user.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (modalMode === 'add') {
      const res = await fetch("http://localhost:1337/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
        setShowModal(false);
      } else {
        setFormError(data.error || "Failed to add user.");
      }
    } else if (modalMode === 'edit') {
      const res = await fetch(`http://localhost:1337/api/users/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
        setShowModal(false);
      } else {
        setFormError(data.error || "Failed to update user.");
      }
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div className="user-management-container">
        {/* Header */}
        <div className="user-management-header">
          <div className="user-management-title">USER MANAGEMENT</div>
          <button className="add-user-btn" onClick={openAddModal}>+ Add User</button>
        </div>

        {/* Table */}
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role}`}>{u.role?.toUpperCase()}</span>
                  </td>
                  <td>
                    <span className={`status-badge${u.status === 'inactive' ? ' inactive' : ''}`}>
                      {u.status?.toUpperCase()}
                    </span>
                  </td>
                  <td>{u.created}</td>
                  <td>{u.lastLogin}</td>
                  <td className="user-actions">
                    <button className="action-btn edit" onClick={() => openEditModal(u)}>
                      <EditIcon />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeleteUser(u.id)}>
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="user-modal-overlay">
            <div className="user-modal">
              <div className="user-modal-title">
                {modalMode === 'add' ? 'Add New User' : 'Edit User'}
              </div>
              <form className="user-modal-form" onSubmit={handleSubmit}>
                <label>Username</label>
                <input
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  required
                />
                <label>Email</label>
                <input
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
                <label>Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required={modalMode === 'add'}
                  placeholder={modalMode === 'edit' ? "Leave blank to keep current password" : ""}
                />
                <label>Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
                <label>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {formError && <div style={{ color: "red", marginBottom: 8 }}>{formError}</div>}
                <div className="user-modal-actions">
                  <button type="button" className="user-modal-cancel" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="user-modal-submit">
                    {modalMode === 'add' ? 'Add User' : 'Update User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUser;