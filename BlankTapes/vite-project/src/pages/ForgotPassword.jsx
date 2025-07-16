import React, { useState, useEffect } from 'react'
import { TextField, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import "./Login.css"
import logoWhite from "../img/logowhite.png"
import { API_BASE } from "../config"

function ForgotPassword() {
  const [username, setUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [status, setStatus] = useState("") // "none", "pending", "approved"
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState("")
  const navigate = useNavigate()

  function checkPasswordStrength(pw) {
    if (pw.length < 6) return "Weak";
    if (pw.match(/[A-Z]/) && pw.match(/[0-9]/) && pw.match(/[^A-Za-z0-9]/)) return "Strong";
    if (pw.match(/[A-Z]/) && pw.match(/[0-9]/)) return "Medium";
    return "Weak";
  }

  const handleNewPasswordChange = (e) => {
    const pw = e.target.value;
    setNewPassword(pw);
    setPasswordStrength(checkPasswordStrength(pw));
  };

  // Polling for approval if pending
  useEffect(() => {
    let interval;
    if (status === "pending" && username) {
      interval = setInterval(async () => {
        const reqRes = await fetch(`${API_BASE}/api/forgot-requests/status/${username}`);
        const reqData = await reqRes.json();
        if (reqData.status === "approved") {
          setStatus("approved");
          setSuccess("Request approved! Please enter your new password.");
          setError("");
          clearInterval(interval);
        }
      }, 2000); // Poll every 2 seconds
    }
    return () => clearInterval(interval);
  }, [status, username, API_BASE]);

  // Check request status or submit new request
  const handleCheckOrRequest = async () => {
    setError("")
    setSuccess("")
    setStatus("")
    if (!username) {
      setError("Username is required.")
      return
    }
    setLoading(true)
    // Check if user exists
    const userRes = await fetch(`${API_BASE}/api/users/${username}`)
    if (userRes.status !== 200) {
      setError("Username not found.")
      setLoading(false)
      return
    }
    // Check if there's a request
    const reqRes = await fetch(`${API_BASE}/api/forgot-requests/status/${username}`)
    const reqData = await reqRes.json()
    if (reqData.status === "pending") {
      setStatus("pending")
      setSuccess("Request is not yet approved. Please wait for admin approval.")
    } else if (reqData.status === "approved") {
      setStatus("approved")
      setSuccess("Request approved! Please enter your new password.")
    } else {
      // No request, create one
      await fetch(`${API_BASE}/api/forgot-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })
      setStatus("pending")
      setSuccess("Request sent. Please wait for admin approval.")
    }
    setLoading(false)
  }

  // Reset password after approval
  const handleReset = async () => {
    setError("")
    setSuccess("")
    if (!newPassword || !confirmPassword) {
      setError("All fields are required.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setLoading(true)
    // Double-check approval
    const reqRes = await fetch(`${API_BASE}/api/forgot-requests/status/${username}`)
    const reqData = await reqRes.json()
    if (reqData.status !== "approved") {
      setError("Admin has not approved your request yet.")
      setLoading(false)
      return
    }
    // Reset password
    const resetRes = await fetch(`${API_BASE}/api/users/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, newPassword }),
    })
    const resetData = await resetRes.json()
    if (!resetData.success) {
      setError(resetData.error || "Password reset failed.")
      setLoading(false)
      return
    }
    setSuccess("Password reset successful! Redirecting to login...")
    setTimeout(() => navigate("/"), 1500)
    setLoading(false)
  }

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-form">
          <div className="login-form-content">
            <div className="logo-container">
              <img src={logoWhite || "/placeholder.svg"} alt="BLANKTAPES" className="brand-logo" />
            </div>
            <TextField
              variant="outlined"
              placeholder="USERNAME"
              value={username}
              onChange={e => setUsername(e.target.value)}
              fullWidth
              className="login-input"
              InputProps={{
                classes: { notchedOutline: "input-outline" },
              }}
              disabled={status === "approved"}
            />
            {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
            {success && <div style={{ color: "lightgreen", marginBottom: 8 }}>{success}</div>}
            {/* Show check/request button if not approved */}
            {status !== "approved" && (
              <Button
                variant="contained"
                className="login-btn"
                fullWidth
                onClick={handleCheckOrRequest}
                disabled={loading}
                style={{ marginTop: 16 }}
              >
                {loading ? "Please wait..." : "REQUEST RESET"}
              </Button>
            )}
            {/* Show password fields if approved */}
            {status === "approved" && (
              <>
                <TextField
                  variant="outlined"
                  placeholder="NEW PASSWORD"
                  type="password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  fullWidth
                  className="login-input"
                  InputProps={{
                    classes: { notchedOutline: "input-outline" },
                  }}
                  style={{ marginTop: 16 }}
                />
                {newPassword.length > 0 && (
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 13,
                      color: "#fff",
                      padding: "2px 10px",
                      borderRadius: 8,
                      width: "fit-content",
                    }}
                  >
                    Password strength: {passwordStrength}
                  </div>
                )}
                <TextField
                  variant="outlined"
                  placeholder="CONFIRM PASSWORD"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  fullWidth
                  className="login-input"
                  InputProps={{
                    classes: { notchedOutline: "input-outline" },
                  }}
                  style={{ marginTop: 16 }}
                />
                <Button
                  variant="contained"
                  className="login-btn"
                  fullWidth
                  onClick={handleReset}
                  disabled={loading}
                  style={{ marginTop: 16 }}
                >
                  {loading ? "Please wait..." : "RESET PASSWORD"}
                </Button>
              </>
            )}
            <div className="login-links">
              <Button
                className="login-link"
                variant="text"
                fullWidth={false}
                onClick={() => navigate("/")}
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword