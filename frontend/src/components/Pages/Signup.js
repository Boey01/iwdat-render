import React, {useState} from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import KeyboardCapslockIcon from '@mui/icons-material/KeyboardCapslock';

import { connect } from "react-redux";
import { redux_signup } from "../../redux/actions/auth_actions";

export const Signup = ({redux_signup}) => {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordMatch(event.target.value === rePassword);
  };

  const handleRePasswordChange = (event) => {
    setRePassword(event.target.value);
    setPasswordMatch(event.target.value === password);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyDown = (event) => {
    if (event.getModifierState("CapsLock")) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    redux_signup( data.get("name"),
                  data.get("email"),
                  data.get("password"),
                  data.get("re-password"));
  };

  const rePasswordColor = passwordMatch ? "inherit" : "red";

  return (
    <div className="make-center">
    <Container component="main" maxWidth="xs">
      <Box
        sx={{  
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Your Full Name"
            name="name"
            autoComplete="name"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <>
                {capsLockOn && <KeyboardCapslockIcon  edge="end"/>}
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
                </>
              ),
            }}
            onKeyDown={handleKeyDown}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="re-password"
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            id="re-password"
            helperText={passwordMatch ? "" : "Passwords do not match"}
            onChange={handleRePasswordChange}
            FormHelperTextProps={{
              style: {
                color: rePasswordColor,
              },
            }}
            InputProps={{
              endAdornment: (
                <>
                {capsLockOn && <KeyboardCapslockIcon  edge="end"/>}
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
                </>
              ),
            }}
            onKeyDown={handleKeyDown}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled= {!passwordMatch}
          >
            Sign Up
          </Button>

            <Link to="/login">
                Back To Login
              </Link>
        </Box>
      </Box>
    </Container>
    </div>
  );

}
export default connect(null, { redux_signup })(Signup);
