import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography  from "@mui/material/Typography";
import MenuIcon from '@mui/icons-material/Menu'
import useStore from "../utils/store";

type Props = {
  pageTitle: string
}

export default function Header(props: Props) {
  const drawerWidth = 240
  const toggleDrawer = useStore((state) => state.toggleDrawer)
  return (
    <AppBar
      color="default"
      position="static"
      // sx={{
      //   width: { lg: `calc(100% - ${drawerWidth}px)` },
      //   // ml: { sm: `${drawerWidth}px` },
      // }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleDrawer}
          sx={{ mr: 2, display: { lg: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {props.pageTitle}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}