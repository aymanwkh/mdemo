import * as React from 'react';
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu'
import useStore from "../utils/store";
import useScrollTrigger from '@mui/material/useScrollTrigger';
// import { Container } from '@mui/system';
import Container from '@mui/material/Container';

type Props = {
  title: string
  children: React.ReactElement;
}

function ElevationScroll(props: Props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function Page(props: Props) {
  const drawerWidth = 240
  const toggleDrawer = useStore((state) => state.toggleDrawer)

  return (
    <>
      {/* <ElevationScroll {...props}> */}
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
              {props.title}
            </Typography>
          </Toolbar>
        </AppBar>
      {/* </ElevationScroll> */}
      <Container>
        {props.children}
      </Container>
    </>
  )
}