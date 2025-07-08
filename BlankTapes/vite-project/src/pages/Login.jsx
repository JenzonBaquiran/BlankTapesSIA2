import { useState } from "react"
import { TextField, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import "./Login.css"
import logoWhite from "../img/logowhite.png"
import { API_BASE } from "../config"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError("")
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.error || "Login failed.")
        return
      }
      if (data.user.status && data.user.status.toLowerCase() === "inactive") {
        setError("Your account is inactive. Please contact support.")
        return
      }
      localStorage.setItem("username", data.user.username)
      // Redirect based on role
      if (data.user.role === "admin") navigate("/admindashboard")
      else if (data.user.role === "staff") navigate("/staffsidebar")
      else navigate("/home")
    } catch (err) {
      setError("Server error.")
    }
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
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              className="login-input"
              InputProps={{
                classes: { notchedOutline: "input-outline" },
              }}
            />
            <TextField
              variant="outlined"
              placeholder="PASSWORD"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              className="login-input"
              InputProps={{
                classes: { notchedOutline: "input-outline" },
              }}
            />
            {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
            <div className="login-links">
              <Button className="login-link" variant="text" fullWidth={false}>
                FORGOT YOUR PASSWORD?
              </Button>
              <Button
                className="login-link"
                variant="text"
                fullWidth={false}
                onClick={() => navigate("/signup")}
              >
                NEW HERE? SIGN UP
              </Button>
            </div>
            <Button variant="contained" className="login-btn" fullWidth onClick={handleLogin}>
              LOGIN
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login