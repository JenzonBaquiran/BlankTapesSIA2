import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login"; 
import Home from "./pages/Home";
import Product from "./pages/Product";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUser from "./pages/ManageUser";
import ManageProduct from "./pages/ManageProduct";
import ManageOrder from "./pages/ManageOrder";
import StaffManageProduct from "./pages/StaffManageProduct";
import StaffManageOrder from "./pages/StaffManageOrder";
import StaffSidebar from "./pages/StaffSidebar";
import CustomerOrder from "./pages/CustomerOrder";


function App() {
  return (
    <BrowserRouter>

      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/product" element={<Product />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admindashboard" element={<AdminDashboard />} />
      <Route path="/manageuser" element={<ManageUser />} />
      <Route path="/manageproduct" element={<ManageProduct />} />
      <Route path="/manageorder" element={<ManageOrder />} />
      <Route path="/staffmanageproduct" element={<StaffManageProduct />} />
      <Route path="/staffmanageorder" element={<StaffManageOrder />} />
      <Route path="/staffsidebar" element={<StaffSidebar />} />
      <Route path="/customerorder" element={<CustomerOrder />} />

      </Routes>
    </BrowserRouter>
  );
}
  export default App;
