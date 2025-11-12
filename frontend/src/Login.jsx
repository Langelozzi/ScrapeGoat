import { useState } from 'react';
import { Box, Paper, TextField, Typography, Button, Tabs, Tab, Divider, Alert, Stack } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from "@mui/icons-material";
import { useUser } from "./context/UserContext.jsx";

function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const { login, register, error, loading } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mode === "login") await login(email, password)
    else await register(email, password, firstName, lastName)

    navigate("/")
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0f0a 0%, #112a17 100%)",
        color: "white",
        p: 3,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: { xs: 4, sm: 6 },
          width: "100%",
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "background.light",
          gap: 3,
        }}
      >
        {/* Header + Tabs */}
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 600, mb: 1, letterSpacing: 0.3 }}
          >
            {mode === "login" ? "Welcome Back" : "Create An Account"}
          </Typography>

          <Tabs
            value={mode}
            onChange={(_, val) => setMode(val)}
            centered
            sx={{
              "& .MuiTabs-flexContainer": {
                justifyContent: "center",
              },
            }}
          >
            <Tab label="Log In" value="login" sx={{ flex: 1, fontSize: 16 }} />
            <Tab label="Register" value="register" sx={{ flex: 1, fontSize: 16 }} />
          </Tabs>
          <Divider sx={{ mt: 1 }} />
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            mt: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {mode === "register" && (
            <Stack spacing={2}>
              <TextField
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                fullWidth
                variant="outlined"
                slotProps={{
                  input: {
                    sx: {
                      bgcolor: "#f0fff5",  // pale mint background
                      color: "#001a00",    // near-black text
                    },
                  },
                  inputLabel: {
                    sx: { color: "#2e7d32" }, // medium green label
                  },
                }}
              />
              <TextField
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                fullWidth
                slotProps={{
                  input: {
                    sx: {
                      bgcolor: "#f0fff5",  // pale mint background
                      color: "#001a00",    // near-black text
                    },
                  },
                  inputLabel: {
                    sx: { color: "#2e7d32" }, // medium green label
                  },
                }}
              />
            </Stack>
          )}

          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            slotProps={{
              input: {
                sx: {
                  bgcolor: "#f0fff5",  // pale mint background
                  color: "#001a00",    // near-black text
                },
              },
              inputLabel: {
                sx: { color: "#2e7d32" }, // medium green label
              },
            }}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            slotProps={{
              input: {
                sx: {
                  bgcolor: "#f0fff5",  // pale mint background
                  color: "#001a00",    // near-black text
                },
              },
              inputLabel: {
                sx: { color: "#2e7d32" }, // medium green label
              },
            }}
          />

          {error && (
            <Alert
              severity="error"
              sx={{
                bgcolor: "rgba(255,0,0,0.1)",
                color: "#ff6b6b",
                border: "1px solid rgba(255,0,0,0.2)",
                fontSize: 14,
              }}
            >
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{
              mt: 1,
              py: 1.3,
              fontSize: "1rem",
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              background: "linear-gradient(90deg, #00c853, #33ff99)",
              color: "#000",
              "&:hover": {
                background: "linear-gradient(90deg, #00e676, #66ffb2)",
              },
            }}
          >
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Register"}
          </Button>

          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
            sx={{
              mt: 1,
              py: 1.2,
              fontSize: "0.95rem",
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
              color: "#66ffb2",
              borderColor: "rgba(102,255,178,0.4)",
              "&:hover": {
                borderColor: "#66ffb2",
                backgroundColor: "rgba(102,255,178,0.05)",
              },
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;