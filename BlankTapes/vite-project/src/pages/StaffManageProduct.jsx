import React, { useState, useEffect } from 'react';
import './ManageProduct.css';
import AdminSidebar from '../pages/AdminSidebar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StaffSidebar from './StaffSidebar';


const categories = ["Hoodies", "Short", "T-Shirts"];
const API_URL = "http://localhost:1337/api/products";

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    status: 'active',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterStatus, setFilterStatus] = useState('All Status');

  // Fetch products on mount
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  // Open Add Modal
  const openAddModal = () => {
    setModalMode('add');
    setForm({
      name: '',
      description: '',
      category: '',
      price: '',
      stock: '',
      status: 'active',
      image: ''
    });
    setImageFile(null);
    setShowModal(true);
    setEditId(null);
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setModalMode('edit');
    setEditId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      image: product.imageUrl || ''
    });
    setImageFile(null);
    setShowModal(true);
  };

  // Close Modal
  const closeModal = () => setShowModal(false);

  // Handle file upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setForm({ ...form, image: URL.createObjectURL(file) });
    }
  };

  // Add or Edit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("status", form.status);
    if (imageFile) formData.append("image", imageFile);

    const method = modalMode === "add" ? "POST" : "PUT";
    const url = modalMode === "add" ? API_URL : `${API_URL}/${editId}`;
    const res = await fetch(url, {
      method,
      body: formData
    });
    const data = await res.json();
    if (data.success || data._id) {
      // Refresh products
      fetch(API_URL)
        .then(res => res.json())
        .then(setProducts);
      setShowModal(false);
    } else {
      alert(data.error || "Error saving product");
    }
  };

  // Delete product
  const handleDelete = async (product) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`${API_URL}/${product._id}`, { method: "DELETE" });
    setProducts(products.filter(p => p._id !== product._id));
  };

  // Filtering logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'All Categories' || product.category === filterCategory;
    const matchesStatus =
      filterStatus === 'All Status' ||
      product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div style={{ display: 'flex' }}>
      <StaffSidebar />
      <div className="user-management-container">
        <div className="user-management-header">
          <div className="user-management-title">PRODUCT MANAGEMENT</div>
          <button className="add-user-btn" onClick={openAddModal}>+ Add Product</button>
        </div>

        <div className="user-filters-container">
          <input
            className="user-search-input"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="user-filter-select"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option>All Categories</option>
            <option>Hoodies</option>
            <option>Short</option>
            <option>T-Shirts</option>
          </select>
          <select
            className="user-filter-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="All Status">All Status</option>
            <option value="active">Active</option>
            <option value="out_of_stock">Out of Stock</option>
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
              {filteredProducts.map(product => (
                <tr key={product._id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {product.imageUrl && (
                      <img
                        src={`http://localhost:1337${product.imageUrl}`}
                        alt={product.name}
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }}
                      />
                    )}
                    {product.name}
                  </td>
                  <td>{product.category}</td>
                  <td>₱{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-badge${product.status === 'out_of_stock' ? ' inactive' : ''}`}>
                      {product.status === 'active' ? 'ACTIVE' : 'OUT OF STOCK'}
                    </span>
                  </td>
                  <td>{product.createdAt ? product.createdAt.slice(0,10) : ''}</td>
                  <td>
                    <div className="user-actions">
                      <button className="action-btn edit" onClick={() => openEditModal(product)} style={{ marginRight: 8 }}>
                        <EditIcon fontSize="small" />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(product)}>
                        <DeleteIcon fontSize="small" />
                      </button>
                    </div>
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
                />
                <label>Description</label>
                <input
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                />
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  required
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
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Stock</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={e => setForm({ ...form, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  required
                >
                  <option value="active">Active</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
                <label>Product Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ marginBottom: 18 }}
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

export default ManageProduct;