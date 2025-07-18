import { useState } from "react"
import { TextField, Button } from "@mui/material"
import "./Login.css"
import logoWhite from "../img/logowhite.png"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

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
            <div className="login-links">
              <span className="login-link">FORGOT YOUR PASSWORD?</span>
              <span className="login-link">NEW HERE? SIGN UP</span>
            </div>
            <Button variant="contained" className="login-btn" fullWidth>
              LOGIN
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login