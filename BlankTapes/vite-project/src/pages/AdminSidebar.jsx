import { Link, useNavigate } from 'react-router-dom';
import './AdminSidebar.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import logoWhite from "../img/logowhite.png"


function AdminSidebar() {
  const [openAddModalSidebarLogout, setOpenAddModalSidebarLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("User logged out");
    setOpenAddModalSidebarLogout(false);
    navigate('/');
  };

  return (
    <div className="sidebar-main">
         <div className="logo-container">
        <img src={logoWhite || "/placeholder.svg"} alt="BLANKTAPES" className="brand-logo" />
    
        </div>
      <div className="sidebar-links">
        <Link to="/admindashboard">
          <DashboardIcon /> DASHBOARD
        </Link>
        <Link to="/manageuser">
          <PersonIcon /> USERS
        </Link>
        <Link to="/manageproduct">
          <InventoryIcon /> PRODUCTS
        </Link>
        <Link to="/manageorder">
          <ShoppingCartIcon /> ORDERS
        </Link>
        <div className="sidebar-link-logout" onClick={() => setOpenAddModalSidebarLogout(true)}>
          <LogoutIcon /> LOGOUT
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal className='modalsidebarlogout' open={openAddModalSidebarLogout} onClose={() => setOpenAddModalSidebarLogout(false)}>
        <Box className="modal-box">
          <Typography variant="h6" gutterBottom>
            Are you sure you want to logout?
          </Typography>
          <Button variant="contained" color="error" onClick={handleLogout} sx={{ mr: 2 }}>
            Logout
          </Button>
          <Button variant="outlined" onClick={() => setOpenAddModalSidebarLogout(false)}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default AdminSidebar;
