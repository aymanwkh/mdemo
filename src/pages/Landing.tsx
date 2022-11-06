import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import AppBar from "@mui/material/AppBar";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import { Link as RouterLink } from "react-router-dom";
import Footer from "../components/Footer";
import Logo from "../components/Logo";
import labels from "../utils/labels.json";
import { useTheme } from "@mui/material/styles";

const features = ["واجهة جميلة", "سهولة استخدام", "احدث تقنية", "اجراءات مرنة", "ذكاء في عرض البيانات", "تدرج في التطوير"];

const Landing = () => {
  const theme = useTheme();

  return (
    <Paper square>
      <AppBar color="transparent" position="relative">
        <Toolbar>
          <Logo size={24} sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            {labels.appTitle}
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Box
          sx={{
            py: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              variant="h1"
              align="center"
              color="text.primary"
              marginBottom={4}
            >
              {labels.landingPage}
            </Typography>
            <Stack
              sx={{ pt: 3 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button
                component={RouterLink}
                to="/main"
                rel="noopener noreferrer"
                variant="outlined"
              >
                {labels.loginDemo}
              </Button>
                <Button
                  component={RouterLink}
                  to='/login'
                  variant="contained"
                >
                  {labels.loginTitle}
                </Button>
              {/* )} */}
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 6 }} maxWidth="md">
          <img
            alt="Application demo"
            src={`img/template-${theme.palette.mode}.png`}
            style={{
              borderRadius: 24,
              borderStyle: "solid",
              borderWidth: 4,
              borderColor: theme.palette.background.default,
              width: "100%",
            }}
          />
        </Container>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Stack alignItems="center">
            <Typography
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              {labels.features}
            </Typography>
            <List sx={{ pt: 3 }}>
              {features.map((f, i) => (
                <ListItem key={i}>
                  <ListItemAvatar>
                    <Avatar>
                      <StarIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={f} />
                </ListItem>
              ))}
            </List>
          </Stack>
        </Container>
      </main>
      <Footer />
    </Paper>

  );
};

export default Landing;
