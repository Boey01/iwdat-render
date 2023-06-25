import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { connect } from "react-redux";
import { activateAcc } from "../../redux/actions/auth_actions";
import { useParams } from "react-router-dom";

export const ActivateAccount = ({activateAcc}) =>{
  const { uid, token } = useParams();

    const handleSubmit = (event) => {
        event.preventDefault();
      activateAcc(uid, token);
      };

  return (
    <div className="make-center">
      <Container component="main">
        <Typography variant="h3" align="center">
          Verify and activate your account now!
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
          <Button
            type="submit"
            variant="contained"
            align="center"
            sx={{ mt: 3, mb: 2, width: "34%" }}
          >
            Verify
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default connect(null, { activateAcc })(ActivateAccount);
