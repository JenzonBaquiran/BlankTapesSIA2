import { useState } from "react"
import { TextField, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import "./Login.css"
import logoWhite from "../img/logowhite.png"
import { API_BASE } from "../config"

function SignUp() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [passwordStrength, setPasswordStrength] = useState("")
  const navigate = useNavigate()

  function checkPasswordStrength(pw) {
    if (pw.length < 6) return "Weak"
    if (pw.match(/[A-Z]/) && pw.match(/[0-9]/) && pw.match(/[^A-Za-z0-9]/)) return "Strong"
    if (pw.match(/[A-Z]/) && pw.match(/[0-9]/)) return "Medium"
    return "Weak"
  }

  const handlePasswordChange = (e) => {
    const pw = e.target.value
    setPassword(pw)
    setPasswordStrength(checkPasswordStrength(pw))
  }

  const handleSignUp = async () => {
    setError("")
    setSuccess("")
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (passwordStrength === "Weak") {
      setError("Please enter a stronger password (Medium or Strong).")
      return
    }
    try {
      const res = await fetch(`${API_BASE}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.error || "Sign up failed.")
        return
      }
      setSuccess("Sign up successful! Redirecting to login...")
      setTimeout(() => {
        navigate("/")
      }, 1500)
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
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              className="login-input"
              InputProps={{
                classes: { notchedOutline: "input-outline" },
              }}
            />
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
              onChange={handlePasswordChange}
              fullWidth
              className="login-input"
              InputProps={{
                classes: { notchedOutline: "input-outline" },
              }}
            />
            {password.length > 0 && (
              <div
                style={{
                  marginTop: 4,
                  fontSize: 13,
                  color: "#fff", // straight white
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              className="login-input"
              InputProps={{
                classes: { notchedOutline: "input-outline" },
              }}
            />
            {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
            {success && <div style={{ color: "green", marginBottom: 8 }}>{success}</div>}
            <div className="login-links">
              <Button
                className="login-link"
                variant="text"
                fullWidth={false}
                onClick={() => navigate("/")}
              >
                ALREADY HAVE AN ACCOUNT? LOGIN
              </Button>
            </div>
            <Button variant="contained" className="login-btn" fullWidth onClick={handleSignUp}>
              SIGN UP
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp