import React, { useState, useContext } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { Grid, Toolbar } from "@mui/material";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import { connect } from 'react-redux';
import { logout } from "../redux/actions/auth_actions";
import { DrawerHeader, AppBar, Drawer} from "./SideBarStyle";
import { useNavigate } from "react-router-dom";
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { GlobalTableContext } from "./contexts/TableContext";

export function MiniDrawer({saveLocalFunction, isAuthenticated, user, logout}) {
  const {saveState} = useContext(GlobalTableContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(!open);
  };
 
  const handleHeaderTextClick =() => {
    if(saveState !==0){
      const leavePage = window.confirm('Are you sure you want to leave this page, something not saved yet?');
    if (leavePage) {
        navigate("/login");
      }
      saveLocalFunction();
    }else{
      navigate("/login");
    }
  }

  const renderSideBarItem = ({ text, icon }) => {
    return (
      <ListItem key={text} disablePadding sx={{ display: "block" }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar open={open}>
      <Toolbar >
  <Grid container spacing={1} alignItems="center">
    <Grid item xs={10}>
      <Typography variant="h6" noWrap component="div">
        IWDAT
      </Typography>
    </Grid>
    <Grid item xs={1}>
      <Typography variant="subtitle1" noWrap component="div">
      {saveState === 0 && "Saved"}
    {saveState === 1 && "Not Saved"}
    {saveState === 2 && "Saving..."}
      </Typography>
    </Grid>
    <Grid item xs={1}>
      <Button variant="contained" color="secondary" disabled={saveState !== 1} onClick={saveLocalFunction}>
        Save
        <SaveRoundedIcon/>
      </Button>
    </Grid>
  </Grid>
</Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <button className="menu-icon" onClick={handleDrawerOpen}>
            <MenuIcon fontSize="small" />
          </button>
          {isAuthenticated ? (
            user && user.name ? (
              <ListItemText
                primary={user.name}
                secondary={user.email}
                sx={{
                  opacity: open ? 1 : 0,
                  transition: "opacity 0.3s",
                }}
              />
            ) : null
          ) : (
            
              <ListItemText
                primary="Not Logged In"
                secondary="Press here to login"
                sx={{
                  opacity: open ? 1 : 0,
                  transition: "opacity 0.3s",
                }}
                onClick={handleHeaderTextClick}
                className="not-logged-in"
              />
            
          )}
          <IconButton onClick={handleDrawerOpen}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Typography
          variant="overline"
          display="block"
          className="drawer-description"
        >
          PAGES
        </Typography>
        <List
          sx={{
            padding: "0",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          {renderSideBarItem({ text: "Workspace", icon: <SelectAllIcon /> })}
          {renderSideBarItem({ text: "Dashboard", icon: <DashboardIcon /> })}
          <div style={{ flexGrow: 1 }}></div>{" "}
          {/* Empty div to push the last item to the bottom */}
          <Divider />
          { isAuthenticated &&
            <div onClick={logout}>
              {renderSideBarItem({ text: "Logout", icon: <LogoutIcon /> })}
            </div>
          }
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
      </Box>
    </Box>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
});

export default connect(mapStateToProps, {logout})(MiniDrawer);
