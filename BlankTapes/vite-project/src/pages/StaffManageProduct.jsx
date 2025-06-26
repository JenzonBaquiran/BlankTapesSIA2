import React, { useState } from 'react';
import StaffSidebar from '../pages/StaffSidebar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const initialProducts = [
  {
    id: 1,
    name: "BLKTPS © HOODIE BLACK",
    description: "Premium black hoodie with embroidered logo",
    image: "https://images.pexels.com/photos/3714894/pexels-photo-3714894.jpeg",
    category: "Hoodies",
    price: 2800,
    stock: 25,
    status: "active",
    created: "2024-01-10"
  }
  // Add more products as needed
];

// Set categories to Hoodies, Short, and T-Shirts
const categories = ["Hoodies", "Short", "T-Shirts"];

function StaffManageProduct() {
  const [products, setProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    status: 'active',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);

  // Open Add Modal
  const openAddModal = () => {
    setModalMode('add');
    setForm({
      name: '',
      category: '',
      price: '',
      stock: '',
      status: 'active',
      image: ''
    });
    setImageFile(null);
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setModalMode('edit');
    // Ensure category is one of the allowed categories
    let category = product.category;
    if (!categories.includes(category)) {
      category = "";
    }
    setForm({
      name: product.name,
      category: category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      image: product.image
    });
    setImageFile(null);
    setShowModal(true);
  };

  // Close Modal
  const closeModal = () => setShowModal(false);

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    let imageUrl = form.image;
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    }
    if (modalMode === 'add') {
      setProducts([
        ...products,
        {
          id: products.length + 1,
          ...form,
          image: imageUrl,
          created: new Date().toISOString().slice(0, 10)
        }
      ]);
    } else if (modalMode === 'edit') {
      setProducts(products.map(p =>
        p.name === form.name ? { ...p, ...form, image: imageUrl } : p
      ));
    }
    setShowModal(false);
  };

  // Handle file upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setForm({ ...form, image: URL.createObjectURL(file) });
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
            <option>Hoodies</option>
            <option>Short</option>
            <option>T-Shirts</option>
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
                <tr key={idx}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                    <img src={p.image} alt={p.name} style={{ width: 40, height: 40, borderRadius: 5, objectFit: 'cover', marginRight: 8 }} />
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
                  <td>{p.created}</td>
                  <td className="user-actions">
                    <button className="action-btn edit" title="Edit" onClick={() => openEditModal(p)}>
                      <EditIcon />
                    </button>
                    <button className="action-btn delete" title="Delete">
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
                    src={form.image}
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

export default StaffManageProduct;