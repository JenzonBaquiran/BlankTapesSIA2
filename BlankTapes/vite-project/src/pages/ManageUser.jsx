import React, { useState } from 'react';
import AdminSidebar from '../pages/AdminSidebar';
import './AdminDashboard.css';
import './ManageUser.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const initialUsers = [
  {
    id: 1,
    name: 'John Admin',
    email: 'john@blanktapes.com',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    created: '2024-01-15',
    lastLogin: '2024-12-20',
  },
  // Add more users as needed
];

function ManageUser() {
  const [users, setUsers] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', status: 'active' });

  const openAddModal = () => {
    setModalMode('add');
    setForm({ name: '', email: '', password: '', role: 'customer', status: 'active' });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setForm({
      name: user.name,
      email: user.email,
      password: user.password || '',
      role: user.role,
      status: user.status,
      id: user.id
    });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      setUsers([
        ...users,
        {
          ...form,
          id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
          created: new Date().toISOString().slice(0, 10),
          lastLogin: '',
        }
      ]);
    } else if (modalMode === 'edit') {
      setUsers(users.map(u =>
        u.id === form.id ? { ...u, ...form } : u
      ));
    }
    setShowModal(false);
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

        {/* Filters */}
        <div className="user-filters-container">
          <input className="user-search-input" placeholder="Search users..." />
          <select className="user-filter-select">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Staff</option>
            <option>Customer</option>
          </select>
          <select className="user-filter-select">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Password</th>
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
                  <td>
                    {/* <img src={u.avatar} alt={u.name} className="user-avatar" /> */}
                    {u.name}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span style={{ letterSpacing: '2px', fontFamily: 'monospace' }}>
                      {u.password ? '•'.repeat(u.password.length) : ''}
                    </span>
                  </td>
                  <td>
                    <span className={`role-badge ${u.role}`}>{u.role.toUpperCase()}</span>
                  </td>
                  <td>
                    <span className={`status-badge${u.status === 'inactive' ? ' inactive' : ''}`}>
                      {u.status.toUpperCase()}
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
                <label>Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
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
                  required
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