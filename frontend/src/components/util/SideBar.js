import React, { useState, useContext, useEffect } from "react";
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
import { connect } from "react-redux";
import { logout } from "../../redux/actions/auth_actions";
import { DrawerHeader, AppBar, Drawer } from "./SideBarStyle";
import { useNavigate } from "react-router-dom";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { GlobalTableContext } from "../contexts/TableContext";
import { useLocation } from "react-router-dom";
import { GlobalCardContext } from "../contexts/CardContext";
import { callDialog } from "./CustomDialog";

export function MiniDrawer({
  saveLocalFunction,
  isAuthenticated,
  user,
  logout,
}) {
  const { cardSaveState, addCards } = useContext(GlobalCardContext);
  const { tableSaveState, setGlobalTables } = useContext(GlobalTableContext);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Update the active tab whenever the pathname changes
    if (location.pathname === "/") {
      setActiveTab("Workspace");
    } else if (location.pathname === "/dashboard") {
      setActiveTab("Dashboard");
    }
  }, [location.pathname]);

  const handleAddCard = () => {
    addCards();
  };

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleHeaderTextClick = () => {
    if (tableSaveState !== 0) {
      callDialog("Unsaved progress", "You have unsaved progress to save, leaving now will lost the progress.", ()=>navigate("/login"))
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    setGlobalTables([]);
  };

  const handleWorkspaceButton = () => {
    navigate("/");
  };

  const handleDashboardButton = () => {
    navigate("/dashboard");
  };

   const renderSideBarItem = ({ text, icon, onClickFunction }) => {
    const isActiveTab = activeTab === text;

    return (
      <ListItem key={text} disablePadding sx={{ display: "block"}}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
            bgcolor: isActiveTab ? "#6350f2" : "transparent",
            color: isActiveTab ? "#ffffff" : "inherit", 
          }}
          onClick={onClickFunction}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
              color: isActiveTab ? "#ffffff" : "inherit", 
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
    );
  };

  const renderSaveState = () => {
    switch (location.pathname) {
      case "/":
        switch (tableSaveState) {
          case 0:
            return "Saved";
          case 1:
            return "Not Saved";
          case 2:
            return "Saving...";
          default:
            return null;
        }
      case "/dashboard":
        switch (cardSaveState) {
          case 0:
            return "Saved";
          case 1:
            return "Not Saved";
          case 2:
            return "Saving...";
          default:
            return null;
        }
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar open={open} color="one">
        <Toolbar>
          <Grid
            container
            spacing={1}
            alignItems="center"
            className="app-bar spread-items"
          >
            <Grid item sx={{ display: "flex", flexDirection: "row" }}>
              <Typography variant="h5" noWrap component="div">
                IWDAT 
              </Typography>
              <Typography variant="button" noWrap component="div" sx={{mx:2}}>
               {location.pathname ==="/" ? "workspace":"dashboard"}
              </Typography>
            </Grid>
            <Grid item>
           { location.pathname === "/dashboard" &&
           <Button
                variant="contained"
                color="five"
                onClick={handleAddCard}
              >
                Add New Card
              </Button>
              }
            </Grid>
            <Grid item sx={{ display: "flex", flexDirection: "row" }}>
              <Typography
                variant="subtitle1"
                noWrap
                component="div"
                align="justify"
                sx={{ display: "flex", alignItems: "center" }}
              >
              {renderSaveState()}
              </Typography>

              <Button
                variant="contained"
                color="five"
                disabled={(location.pathname === "/" && tableSaveState !== 1) ||
                (location.pathname === "/dashboard" && cardSaveState !== 1)}
                onClick={location.pathname === "/" ?() =>saveLocalFunction(0) : () =>saveLocalFunction(1)}
                sx={{ mx: 3, borderRadius:2 }}
              >
                Save
                <SaveRoundedIcon sx={{ml:0.5}} />
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerOpen} color="two" sx={{mr:1, ml:0.6}}>
            <MenuIcon fontSize="small" />
          </IconButton>
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
          {renderSideBarItem({
            text: "Workspace",
            icon: <SelectAllIcon />,
            onClickFunction: handleWorkspaceButton,
          })}
          {renderSideBarItem({
            text: "Dashboard",
            icon: <DashboardIcon />,
            onClickFunction: handleDashboardButton,
          })}
          <div style={{ flexGrow: 1 }}></div>{" "}
          {/* Empty div to push the last item to the bottom */}
          <Divider />
          {isAuthenticated && (
            <div onClick={handleLogout}>
              {renderSideBarItem({ text: "Logout", icon: <LogoutIcon /> })}
            </div>
          )}
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

export default connect(mapStateToProps, { logout })(MiniDrawer);
