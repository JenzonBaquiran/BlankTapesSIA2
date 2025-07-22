import { useState } from "react"
import { TextField, Button, IconButton, InputAdornment, CircularProgress } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import "./Login.css"
import logoWhite from "../img/logowhite.png"
import { API_BASE } from "../config"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false) // <-- Add loading state
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      // Prolong loading for 1.5 seconds
      await new Promise(resolve => setTimeout(resolve, 1500))
      if (!data.success) {
        setError(data.error || "Login failed.")
        setLoading(false)
        return
      }
      if (data.user.status && data.user.status.toLowerCase() === "inactive") {
        setError("Your account is inactive. Please contact support.")
        setLoading(false)
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
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              className="login-input"
              InputProps={{
                classes: { notchedOutline: "input-outline" },
              }}
              onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
              disabled={loading} // <-- Disable while loading
            />
            <TextField
              variant="outlined"
              placeholder="PASSWORD"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              className="login-input"
              InputProps={{
                classes: { notchedOutline: "input-outline" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((show) => !show)}  
                      edge="end"
                      disabled={loading} // <-- Disable while loading
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
              disabled={loading} // <-- Disable while loading
            />
            {loading && (
              <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
                <CircularProgress size={32} style={{ color: "#fff" }} />
              </div>
            )}
            {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
            <div className="login-links">
              <Button
                className="login-link"
                variant="text"
                fullWidth={false}
                onClick={() => navigate("/forgotpassword")}
                disabled={loading} // <-- Disable while loading
              >
                FORGOT YOUR PASSWORD?
              </Button>
              <Button
                className="login-link"
                variant="text"
                fullWidth={false}
                onClick={() => navigate("/signup")}
                disabled={loading} // <-- Disable while loading
              >
                NEW HERE? SIGN UP
              </Button>
            </div>
            <Button
              variant="contained"
              className="login-btn"
              fullWidth
              onClick={handleLogin}
              disabled={loading} // <-- Disable while loading
            >
              {loading ? "Logging in..." : "LOGIN"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login