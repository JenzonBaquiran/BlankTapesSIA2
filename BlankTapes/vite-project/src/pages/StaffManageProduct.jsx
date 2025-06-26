import React, { useState, useEffect } from 'react';
import StaffSidebar from '../pages/StaffSidebar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const categories = ["Hoodies", "Short", "T-Shirts"];

function StaffManageProduct() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    status: 'active',
    image: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);

  // Fetch products from backend
  const fetchProducts = () => {
    fetch('http://localhost:1337/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setForm({
      name: '',
      category: '',
      price: '',
      stock: '',
      status: 'active',
      image: '',
      description: ''
    });
    setImageFile(null);
    setShowModal(true);
    setEditId(null);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setEditId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      image: product.imageUrl || product.image || '',
      description: product.description || ''
    });
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setForm({ ...form, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('category', form.category);
    formData.append('price', form.price);
    formData.append('stock', form.stock);
    formData.append('status', form.status);
    formData.append('description', form.description);
    if (imageFile) formData.append('image', imageFile);

    if (modalMode === 'add') {
      await fetch('http://localhost:1337/api/products', {
        method: 'POST',
        body: formData
      });
    } else if (modalMode === 'edit' && editId) {
      await fetch(`http://localhost:1337/api/products/${editId}`, {
        method: 'PUT',
        body: formData
      });
    }
    fetchProducts();
    setShowModal(false);
  };

  // Mark as out_of_stock (do not delete from DB)
  const handleDelete = async (product) => {
    if (window.confirm('Mark this product as out of stock?')) {
      // Use the correct endpoint for soft delete
      await fetch(`http://localhost:1337/api/products/${product._id}/out_of_stock`, {
        method: 'PUT'
      });
      fetchProducts();
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <StaffSidebar />
      <div className="user-management-container">
        <div className="user-management-header">
          <div className="user-management-title">PRODUCT MANAGEMENT</div>
          <button className="add-user-btn" onClick={openAddModal}>+ Add Product</button>
        </div>
        <div className="user-filters-container">
          <input className="user-search-input" placeholder="Search products..." />
          <select className="user-filter-select">
            <option>All Categories</option>
            {categories.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <select className="user-filter-select">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Out of Stock</option>
          </select>
        </div>
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => (
                <tr key={p._id || idx}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                    <img
                      src={
                        p.imageUrl
                          ? p.imageUrl.startsWith('/uploads/')
                            ? `http://localhost:1337${p.imageUrl}`
                            : p.imageUrl
                          : '/default-image.png'
                      }
                      alt={p.name}
                      style={{ width: 40, height: 40, borderRadius: 5, objectFit: 'cover', marginRight: 8 }}
                      onError={e => { e.target.onerror = null; e.target.src = '/default-image.png'; }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, marginTop: 10 }}>{p.name}</div>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>₱{Number(p.price).toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td>
                    {p.status === "active" ? (
                      <span className="status-badge">ACTIVE</span>
                    ) : (
                      <span className="status-badge inactive">OUT OF STOCK</span>
                    )}
                  </td>
                  <td>{(p.createdAt || p.created || '').slice(0, 10)}</td>
                  <td className="user-actions">
                    <button className="action-btn edit" title="Edit" onClick={() => openEditModal(p)}>
                      <EditIcon />
                    </button>
                    <button className="action-btn delete" title="Delete" onClick={() => handleDelete(p)}>
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
                {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
              </div>
              <form className="user-modal-form" onSubmit={handleSubmit}>
                <label>Product Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
                <label>Description</label>
                <input
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  required
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label>Price (₱)</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      required
                      style={{ fontFamily: 'Arial, sans-serif' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Stock</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={e => setForm({ ...form, stock: e.target.value })}
                      required
                      style={{ fontFamily: 'Arial, sans-serif' }}
                    />
                  </div>
                </div>
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  required
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  <option value="active">Active</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
                <label>Product Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ fontFamily: 'Arial, sans-serif', marginBottom: 18 }}
                />
                {form.image && (
                  <img
                    src={
                      typeof form.image === "string" && form.image.startsWith('/uploads/')
                        ? `http://localhost:1337${form.image}`
                        : form.image
                    }
                    alt="Preview"
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
                    onError={e => { e.target.onerror = null; e.target.src = '/default-image.png'; }}
                  />
                )}
                <div className="user-modal-actions">
                  <button type="button" className="user-modal-cancel" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="user-modal-submit">
                    {modalMode === 'add' ? 'Add Product' : 'Update Product'}
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

export default StaffManageProduct;