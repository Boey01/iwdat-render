import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { reset_password_req } from "../../redux/actions/auth_actions";
import { connect } from "react-redux";
  
export const ResetPassReq = ({reset_password_req}) =>{
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        reset_password_req(data.get("email"));
      };

  return (
    <div className="make-center">
      <Container component="main">
        <Typography variant="h4" align="center">
          Send Reset Password Request.
        </Typography>
        <Typography variant="subtitle1" align="center">
          Please enter your registered email.
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
            <TextField
            margin="normal"
            required
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            sx ={{width: '50%'}}
          />
          <Button
            type="submit"
            variant="contained"
            align="center"
            sx={{ mx: 0, ml: 1, height: 52, mt:1}}
          >
            Verify
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default connect(null, { reset_password_req })(ResetPassReq);
