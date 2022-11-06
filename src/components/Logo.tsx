import Box, { BoxProps } from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import { ReactComponent as LogoSvg } from "../assets/logo.svg";
import { ReactComponent as ELogoSvg } from "../assets/elogo.svg";

type LogoProps = {
  colored?: boolean;
  size?: number;
} & BoxProps;

const Logo = ({ colored = false, size = 40, ...boxProps }: LogoProps) => {
  return (
    <NavLink to="/">
      <Box {...boxProps}>
        {process.env.REACT_APP_LANG === 'en' ? 
          <ELogoSvg height={size} width={size} />
        : <LogoSvg height={size} width={size} />
        }
      </Box>
    </NavLink>
  );
};

export default Logo;
