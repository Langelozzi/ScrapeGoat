import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useUser } from "../context/UserContext"

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useUser()


  // Redirect to home when user is logged out
  useEffect(() => {
    if (!user) {
      navigate("/")
    }
  }, [user, navigate])

  return (
    <AppBar position="static" sx={{ backgroundColor: "#2e0f45" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Scrapegoat
          </Typography>

          
          <Box sx={{ display: "flex", gap: 2 }}>
            {user ? ( 
              <>
                <Button color="inherit" onClick={() => navigate("/my-scripts")}>
                  My Scripts
                </Button>
                <Button color="inherit" onClick={() => logout()}>
                  Logout
                </Button>
              </>
              ) : (
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
  );
}
