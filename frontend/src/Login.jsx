import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Tabs,
  Tab,
  Divider,
  Alert,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";
import { useUser } from "./context/UserContext.jsx";

function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const { login, register, error, loading } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mode === "login") await login(email, password);
    else await register(email, password, firstName, lastName);

    navigate("/");
  };

  return (
    <Box
      sx={{
        height: "90vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "text.primary",
        bgcolor: "background.default",
      }}
    >
      <Paper
        sx={{
          p: { xs: 4, sm: 6 },
          width: "100%",
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "background.paper",
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
            <Tab
              label="Log In"
              value="login"
              sx={{ flex: 1, fontSize: 16, color: "text.secondary" }}
            />
            <Tab
              label="Register"
              value="register"
              sx={{ flex: 1, fontSize: 16, color: "text.secondary" }}
            />
          </Tabs>
          <Divider sx={{ mt: 1, borderColor: "divider" }} />
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
                    sx: (theme) => ({
                      bgcolor: theme.palette.background.default,
                      color: theme.palette.text.primary,
                    }),
                  },
                  inputLabel: {
                    sx: (theme) => ({
                      color: theme.palette.text.secondary,
                    }),
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
                    sx: (theme) => ({
                      bgcolor: theme.palette.background.default,
                      color: theme.palette.text.primary,
                    }),
                  },
                  inputLabel: {
                    sx: (theme) => ({
                      color: theme.palette.text.secondary,
                    }),
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
                sx: (theme) => ({
                  bgcolor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                }),
              },
              inputLabel: {
                sx: (theme) => ({
                  color: theme.palette.text.secondary,
                }),
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
                sx: (theme) => ({
                  bgcolor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                }),
              },
              inputLabel: {
                sx: (theme) => ({
                  color: theme.palette.text.secondary,
                }),
              },
            }}
          />

          {error && (
            <Alert
              severity="error"
              sx={(theme) => ({
                bgcolor: alpha(theme.palette.error.main, 0.12),
                color: theme.palette.error.main,
                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                fontSize: 14,
              })}
            >
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={(theme) => ({
              mt: 1,
              py: 1.3,
              fontSize: "1rem",
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: theme.palette.primary.contrastText,
              "&:hover": {
                background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              },
            })}
          >
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Register"}
          </Button>

          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
            sx={(theme) => ({
              mt: 1,
              py: 1.2,
              fontSize: "0.95rem",
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
              color: theme.palette.primary.main,
              borderColor: alpha(theme.palette.primary.main, 0.5),
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            })}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
