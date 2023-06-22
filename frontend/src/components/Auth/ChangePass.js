import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
  
export const ChangePassword = () =>{
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
          password: data.get("password"),
        });
      };

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
            autoComplete="current-password"
            autoFocus
          />

            <TextField
            margin="normal"
            required
            fullWidth
            name="re-password"
            label="Confirm New Password"
            type="password"
            id="re-password"
          />

          <Button
            type="submit"
            variant="contained"
            align="center"
            sx={{ mt:1}}
          >
           Confirm Reset Password
          </Button>
        </Box>
      </Container>
    </div>
  );
};
  
