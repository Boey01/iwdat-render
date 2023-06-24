import React, {useState} from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { reset_password } from "../../redux/actions/auth_actions";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
  
export const ChangePassword = ({reset_password}) =>{
  const { uid, token } = useParams();
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
        const new_password = data.get("password");
        const re_new_password = data.get("re-password");

        reset_password(uid, token, new_password, re_new_password);

      };

      const rePasswordColor = passwordMatch ? "inherit" : "red";
  return (
    <div className="make-center">
      <Container component="main" maxWidth='xs'>
        <Typography variant="h4" align="center">
          Reset Password.
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, display: "flex",
          flexDirection: "column",
          alignItems: "center", }}       
        >
            <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Your New Password"
            type="password"
            id="password"
            autoFocus
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
            variant="contained"
            align="center"
            sx={{ mt:1}}
            disabled= {!passwordMatch}
          >
           Confirm Reset Password
          </Button>
        </Box>
      </Container>
    </div>
  );
};
  
export default connect(null, { reset_password })(ChangePassword);

