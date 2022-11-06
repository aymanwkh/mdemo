import Box from "@mui/material/Box"
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import LoadingButton from "@mui/lab/LoadingButton"
import { NavLink, useNavigate } from "react-router-dom"
import BoxedLayout from "../components/BoxedLayout"
import { saveToken, signIn } from "../utils/actions"
import { useState, FormEvent } from "react"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Alert from "@mui/material/Alert"
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FilledInput from '@mui/material/FilledInput';
import IconButton from '@mui/material/IconButton';
import labels_a from "../utils/labels.json"
import labels_e from "../utils/labels_e.json"
import axios, { AxiosError } from 'axios'
import useStore from "../utils/store";

const labels = process.env.REACT_APP_LANG === 'en' ? labels_e : labels_a

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const setUserId = useStore((state) => state.setUserId)
  const handleRegister = async (e: FormEvent) => {
    try {
      e.preventDefault()
      setIsLoading(true)
      if (process.env.REACT_APP_LANG === 'ar' && name === 'demo') throw new Error('failed')
      const response = await axios.post('/auth/register', {name, email, password})
      saveToken(response.data.token)
      setUserId(response.data.userId)
      axios.defaults.headers.common = {'Authorization': `Bearer ${response.data.token}`}
      // await signIn(username, password)
      setIsLoading(false)
      if (process.env.REACT_APP_LANG === 'en') navigate('/main/dashboard', { replace: true })
      else navigate('/main', { replace: true })
    } catch (err) {
      if (err instanceof AxiosError) console.log('error === ', err.response)
      setIsLoading(false)
      setPassword('')
      setError(labels.loginError)
    }
  }
  const handleNameChange = (value: string) => {
    setName(value)
    setError('')
  }
  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setError('')
  }
  const handleEmailChange = (value: string) => {
    setEmail(value)
    setError('')
  }
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }
  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(./img/startup.svg)",
          backgroundRepeat: "no-repeat",
          bgcolor: "background.default",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid xs={12} sm={8} md={5} component={Paper} square>
        <BoxedLayout>
          <Typography component="h1" variant="h5">
            {labels.register}
          </Typography>
          {error && 
            <Alert variant="filled" severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          }
          <Box
            component="form"
            marginTop={3}
            noValidate
            onSubmit={handleRegister}
          >
            <TextField
              margin="normal"
              variant="filled"
              required
              fullWidth
              id="name"
              label={labels.name}
              name="name"
              autoComplete="name"
              autoFocus
              disabled={isLoading}
              value={name}
              onChange={e => handleNameChange(e.target.value)}
            />
            <TextField
              margin="normal"
              variant="filled"
              required
              fullWidth
              id="email"
              label={labels.email}
              name="email"
              autoComplete="email"
              disabled={isLoading}
              value={email}
              onChange={e => handleEmailChange(e.target.value)}
            />
            <FormControl variant="filled" fullWidth required margin="normal">
              <InputLabel htmlFor="outlined-adornment-password">{labels.password}</InputLabel>
              <FilledInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => handlePasswordChange(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(prevState => !prevState)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Stack spacing={2} direction="row" sx={{ py: 2}}>
              <Button variant="outlined" onClick={() => navigate(-1)}>
                {labels.back}
              </Button>
              <LoadingButton
                type="submit"
                loading={isLoading}
                variant="contained"
                sx={{ mt: 3, flexGrow: 1 }}
              >
                {labels.register}
              </LoadingButton>
            </Stack>
          </Box>
        </BoxedLayout>
      </Grid>
    </Grid>
  )
}

