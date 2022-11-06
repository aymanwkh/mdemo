import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormLabel from "@mui/material/FormLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import TextField from "@mui/material/TextField"
import LoadingButton from "@mui/lab/LoadingButton"
import { useMemo, useState } from "react"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Switch from "@mui/material/Switch"
import Button from "@mui/material/Button"
import { genderList } from "../utils/config"
import useStore from "../utils/store"
import { editEmployee } from "../utils/actions"
import { useParams } from "react-router-dom"
import Header from "../components/Header"
import labels_a from "../utils/labels.json"
import labels_e from "../utils/labels_e.json"
import { useNavigate } from "react-router-dom"
import { useTheme } from '@mui/material/styles';

const labels = process.env.REACT_APP_LANG === 'en' ? labels_e : labels_a

type Params = {
  id: string
}
export default function EmployeeEdit() {
  const params = useParams<Params>()
  const navigate = useNavigate()
  const theme = useTheme()
  const success = useStore((state) => state.success)
  const error = useStore((state) => state.error)
  const [isLoading, setIsLoading] = useState(false)
  const user = useStore((state) => state.user)
  const departments = useStore((state) => state.departments)
  const employees = useStore((state) => state.employees)
  const employee = useMemo(() => employees.find(e => e.id === params.id), [employees, params.id])
  const [name, setName] = useState(employee?.name || '')
  const [gender, setGender] = useState(employee?.gender || '')
  const [departmentId, setDepartmentId] = useState(employee?.departmentId || '')
  const [job, setJob] = useState(employee?.job || '')
  const [salary, setSalary] = useState(employee?.salary || '')
  const [mobile, setMobile] = useState(employee?.mobile || '')
  const [email, setEmail] = useState(employee?.email || '')
  const [address, setAddress] = useState(employee?.address || '')
  const [isActive, setIsActive] = useState(employee?.isActive || false)
  const [errors, setErrors] = useState<string[]>([])
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      const errorsArray = []
      if (!name) errorsArray.push('name')
      if (!gender) errorsArray.push('gender')
      if (!departmentId) errorsArray.push('departmentId')
      if (!job) errorsArray.push('job')
      if (!salary) errorsArray.push('salary')
      if (!mobile) errorsArray.push('mobile')
      if (!email) errorsArray.push('email')
      if (!address) errorsArray.push('address')
      if (errorsArray.length > 0) {
        setErrors(errorsArray)
        throw new Error(labels.requiredFields)
      }
      if (mobile.length !== 10 || mobile.substring(0, 2) !== '07') {
        errorsArray.push('mobile')
        setErrors(errorsArray)
        throw new Error(labels.invalidMobile)
      }
      const newData = {
        ...employee,
        name,
        gender,
        departmentId,
        job,
        salary: +salary,
        mobile,
        email,
        address,
        image: gender === 'm' ? 'male.png' : 'female.png',
        isActive
      }
      setIsLoading(true)
      await editEmployee(newData)
      setIsLoading(false)
      success(!employee ? labels.addSuccess : labels.editSuccess)
      navigate(-1)
    } catch (err) {
      setIsLoading(false)
      const message =  (err instanceof Error) ? err.message : labels.error
      error(message)
    }
  }
  const handleSetName = (value: string) => {
    setName(value)
    if (errors.includes('name')) {
      errors.splice(errors.indexOf('name'), 1)
      setErrors(errors)
    }
  }
  const handleSetGender = (value: string) => {
    setGender(value)
    if (errors.includes('gender')) {
      errors.splice(errors.indexOf('gender'), 1)
      setErrors(errors)
    }
  }
  const handleSetDepartmentId = (value: string) => {
    setDepartmentId(value)
    if (errors.includes('departmentId')) {
      errors.splice(errors.indexOf('departmentId'), 1)
      setErrors(errors)
    }
  }
  const handleSetJob = (value: string) => {
    setJob(value)
    if (errors.includes('job')) {
      errors.splice(errors.indexOf('job'), 1)
      setErrors(errors)
    }
  }
  const handleSetSalary = (value: string) => {
    if (value && !(/[0-9]/.test(value))) return
    setSalary(value)
    if (errors.includes('salary')) {
      errors.splice(errors.indexOf('salary'), 1)
      setErrors(errors)
    }
  }
  const handleSetMobile = (value: string) => {
    if (value && !(/[0-9]/.test(value))) return
    setMobile(value)
    if (errors.includes('mobile')) {
      errors.splice(errors.indexOf('mobile'), 1)
      setErrors(errors)
    }
  }
  const handleSetAddress = (value: string) => {
    setAddress(value)
    if (errors.includes('address')) {
      errors.splice(errors.indexOf('address'), 1)
      setErrors(errors)
    }
  }
  const handleSetEmail = (value: string) => {
    setEmail(value)
    if (errors.includes('email')) {
      errors.splice(errors.indexOf('email'), 1)
      setErrors(errors)
    }
  }
  return (
    <>
      <Header pageTitle={params.id === '0' ? labels.addEmployee : labels.editEmployee} />
      <form onSubmit={handleSubmit} noValidate>
        <Card>
          <CardContent>
            <TextField
              error={errors.includes('name')}
              margin="normal"
              required
              fullWidth
              id="name"
              label={labels.name}
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={e => handleSetName(e.target.value)}
            />
            <FormControl 
              error={errors.includes('gender')}
              component="fieldset" 
              fullWidth 
              required 
              margin="normal"
              sx={{ 
                borderWidth: 1, 
                borderColor: `${errors.includes('gender') ? 'red' : theme.palette.grey[300]}`, 
                borderStyle: 'solid', 
                borderRadius: 1, 
                mt: 0
              }}
            >
              <FormLabel component="legend" sx={{ ml: 1, fontSize: '0.8rem' }}>
                {labels.gender}
              </FormLabel>
              <RadioGroup
                row
                aria-label="gender"
                name="gender"
                value={gender}
                onChange={e => handleSetGender(e.target.value)}
                sx={{ pl: 1 }}
              >
                {genderList.map(g => (
                  <FormControlLabel
                    key={g.id}
                    value={g.id}
                    control={<Radio />}
                    label={process.env.REACT_APP_LANG === 'en' ? g.ename : g.name}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <FormControl 
              error={errors.includes('departmentId')}
              fullWidth 
              required
              margin="normal"
            >
              <InputLabel id="deptIdLabel">{labels.department}</InputLabel>
              <Select
                labelId="deptIdLabel"
                id="departmentId"
                value={departmentId}
                label="departmentId"
                onChange={e => handleSetDepartmentId(e.target.value)}
              >
                {departments.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              error={errors.includes('job')}
              margin="normal"
              required
              fullWidth
              id="job"
              label={labels.job}
              name="job"
              autoComplete="job"
              value={job}
              onChange={e => handleSetJob(e.target.value)}
            />
            <TextField
              error={errors.includes('salary')}
              margin="normal"
              required
              fullWidth
              id="salary"
              label={labels.salary}
              name="salary"
              autoComplete="salary"
              value={salary}
              onChange={e => handleSetSalary(e.target.value)}
            />
            <TextField
              error={errors.includes('mobile')}
              margin="normal"
              required
              fullWidth
              id="mobile"
              label={labels.mobile}
              name="mobile"
              autoComplete="mobile"
              value={mobile}
              onChange={e => handleSetMobile(e.target.value)}
            />
            <TextField
              error={errors.includes('address')}
              margin="normal"
              required
              fullWidth
              id="address"
              label={labels.address}
              name="address"
              autoComplete="address"
              value={address}
              onChange={e => handleSetAddress(e.target.value)}
            />
            <TextField
              error={errors.includes('email')}
              margin="normal"
              required
              fullWidth
              id="email"
              label={labels.email}
              name="email"
              autoComplete="email"
              value={email}
              onChange={e => handleSetEmail(e.target.value)}
            />
            <FormControl 
              component="fieldset" 
              fullWidth 
              required 
              sx={{ 
                borderWidth: 1, 
                borderColor: `${theme.palette.grey[300]}`, 
                borderStyle: 'solid', 
                borderRadius: 1, 
                mt: 0, 
                mb: 2,
                height: '4.2rem'
              }}
            >
              <FormLabel component="legend" sx={{ ml: 1, fontSize: '0.8rem' }}>
                {labels.status}
              </FormLabel>
              <FormControlLabel control={<Switch checked={isActive} onChange={() => setIsActive(prevState => !prevState)} />} label={isActive ? labels.isActive : labels.inActive} sx={{ pl: 1 }}/>
            </FormControl>
          </CardContent>
          <CardActions>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              {labels.return}
            </Button>
            {user && 
              <LoadingButton loading={isLoading} type="submit" variant="contained">
                {labels.submit}
              </LoadingButton>
            }
          </CardActions>
        </Card>
      </form>
    </>
  )
}

