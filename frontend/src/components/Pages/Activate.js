import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
import { activateAcc } from "../../redux/actions/auth_actions";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";

export const ActivateAccount = ({ activateAcc }) => {
  const { uid, token } = useParams();

  const handleSubmit = (event) => {
    event.preventDefault();
    activateAcc(uid, token);
  };

  return (
    <div className="make-center">
      <Grid coontainer>
        <Grid item xs={12}>
          <Typography variant="h3" align="center">
            Verify and activate your account now!
          </Typography>
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Link to="/login">Back To Login</Link>
        </Grid>
      </Grid>
    </div>
  );
};

export default connect(null, { activateAcc })(ActivateAccount);
