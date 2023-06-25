import React, {useState} from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { connect } from "react-redux";
import { signup } from "../../redux/actions/auth_actions";

export const Signup = ({signup}) => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    signup( data.get("name"),
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
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handlePasswordChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="re-password"
            label="Confirm New Password"
            type="password"
            id="re-password"
            helperText={passwordMatch ? "" : "Passwords do not match"}
            onChange={handleRePasswordChange}
            FormHelperTextProps={{
              style: {
                color: rePasswordColor,
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
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
export default connect(null, { signup })(Signup);
