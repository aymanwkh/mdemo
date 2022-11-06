import Header from "../components/Header";
import Container from "@mui/material/Container";
import { ReactComponent as WelcomeSvg } from "../assets/welcome.svg";
import SvgContainer from "../components/SvgContainer";
import labels from '../utils/labels.json'
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

export default function Home() {
  return (
    <>
      <Header pageTitle="" />
      <Container maxWidth="xs" sx={{ mt: 3 }}>
        <SvgContainer>
          <WelcomeSvg />
        </SvgContainer>
        <Typography
            variant="h1"
            align="center"
            color="text.primary"
            marginBottom={4}
          >
            {labels.landingPage}
          </Typography>
          <Stack alignItems="center" sx={{ pt: 3 }}>
            <Typography
              variant="h6"
              align="center"
              color="text.primary"
              gutterBottom
            >
              {labels.contactus}
            </Typography>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <EmailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="ayman.wkh@gmail.com" />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PhoneIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="0799982800" />
              </ListItem>
            </List>
          </Stack>
        </Container>

    </>
  );
};

