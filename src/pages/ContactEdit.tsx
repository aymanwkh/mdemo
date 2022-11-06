import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useMemo, useState } from "react";
import labels from "../utils/labels.json";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { contactTypes } from "../utils/config";
import useStore from "../utils/store";
import { editContact } from "../utils/actions";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { Contact } from "../utils/types";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

type Params = {
  id: string
}
export default function ContactEdit() {
  const navigate = useNavigate()
  const params = useParams<Params>()
  const success = useStore((state) => state.success)
  const error = useStore((state) => state.error)
  const [isLoading, setIsLoading] = useState(false)
  const contacts = useStore((state) => state.contacts)
  const contact = useMemo(() => contacts.find(e => e.id === params.id), [contacts, params.id])
  const [name, setName] = useState(contact?.name || '')
  const [type, setType] = useState(contact?.type || 0)
  const [link, setLink] = useState(contact?.link || '')
  const [open, setOpen] = useState(false)
  const [newAddress, setNewAddress] = useState('')
  const [address, setAddress] = useState(contact?.addresses.find(a => a.status === contact?.status)?.value || '')
  const addresses = useMemo(() => contacts.flatMap(c => c.addresses.map(a => ({
    contactId: c.id,
    value: a.value
  }))), [contacts])

  const hasChanged = useMemo(() => {
    if (name !== contact?.name || 
      link !== contact?.link ||
      type !== contact?.type) return true
    else return false
  }, [contact, name, link, type])
  const validateAddress = (address: string) => {
    if (address.includes(' ')) {
      throw new Error(labels.addressNotValid)
    }
    if (addresses.find(a => a.value.toLocaleLowerCase() === address.toLocaleLowerCase())) {
      throw new Error(labels.addressFound)      
    }
    const type = address.replace(/[0-9]/g, '').length === 0 ? 'm' : 'e'
    if (type === 'm' && address.length !== 10) {
      throw new Error(labels.addressNotValid)
    } else if (type === 'e' && !address.includes('@')) {
      throw new Error(labels.addressNotValid)
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      let newData: Contact
      if (!link || !address || (!name && type !== 0)) {
        throw new Error(labels.requiredFields)
      }
      if (type !== 0 && contacts.find(c => c.id !== params.id && c.name === name)) {
        throw new Error(labels.contactFound)
      }
      if (!contact) {
        validateAddress(address)
        const ids = contacts.map(c => +c.id)
        const maxId = ids.length === 0 ? -1 : Math.max(...ids)
        newData = {
          id: (maxId + 1).toString(),
          name,
          type,
          link,
          sendingDate: 0,
          status: 'n',
          newAdvert: false,
          addresses: [{value: address, status: 'n'}]
        }
      } else {
        newData = {
          ...contact,
          name,
          type,
          link,
        }
      }
      setIsLoading(true)
      await editContact(newData)
      setIsLoading(false)
      success(labels.editSuccess)
      navigate('/main/contacts', { replace: true })
    } catch (err: any) {
      setIsLoading(false)
      error(err.message)
    }
  };
  const handleStatus= async () => {
    try {
      if (!contact) return
      if (contact.status === 'n') await editContact({ ...contact, status: 'i' })
      else await editContact({ ...contact, status: 'n' })
      success(labels.editSuccess)
      navigate('/main/contacts', { replace: true })
    } catch (err: any) {
      error(err.message)
    }
  }  
  const handleSend = async () => {
    try {
      if (!contact) return
      let newData
      let addressIndex = contact.addresses.findIndex(a => a.value === address)
      if (contact.status === 's') {
        contact.addresses.splice(addressIndex, 1, {value: address, status: 'f'})
        newData = {
          ...contact,
          sendingDate: 0,
          status: 'n',
          newAdvert: false
        }
      } else {
        contact.addresses.splice(addressIndex, 1, {value: address, status: 's'})
        newData = {
          ...contact,
          sendingDate: Date.now(),
          status: 's',
          newAdvert: true
        }  
      }
      await editContact(newData)
      navigate('/main/contacts', { replace: true })
    } catch (err: any) {
      error(err.message)
    }
  }
  const handleAddAddress = async () => {
    try{
      if (!contact) return
      if (!newAddress) {
        throw new Error(labels.requiredFields)
      }
      validateAddress(newAddress)
      const newData = {...contact, addresses: [...contact.addresses, {value: newAddress, status: 'n'}]}
      await editContact(newData)
      success(labels.editSuccess)
      setOpen(false)
      setNewAddress('')
    } catch (err: any) {
      error(err.message)
    }
  }
  const handleCloseDialog = () => {
    setOpen(false)
    setNewAddress('')
  }
  return (
    <>
      <Header pageTitle={labels.editContact} />
      <form onSubmit={handleSubmit} noValidate>
        <Card>
          <CardContent>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label={labels.name}
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="typeLabel">{labels.type}</InputLabel>
              <Select
                labelId="typeLabel"
                id="type"
                value={type}
                label="type"
                onChange={e => setType(Number(e.target.value))}
              >
                {contactTypes.map((d, i) => <MenuItem key={i} value={i}>{d}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              id="link"
              label={labels.link}
              name="link"
              autoComplete="link"
              value={link}
              onChange={e => setLink(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              required
              id="address"
              label={labels.address}
              name="address"
              autoComplete="address"
              value={address}
              disabled={!!contact}
              onChange={e => setAddress(e.target.value)}
            />
          </CardContent>
          <CardActions>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              {labels.return}
            </Button>
            {contact && !address && 
              <Button variant="contained" onClick={handleStatus} color="error">
                {contact?.status === 'n' ? labels.inActivate : labels.activate}
              </Button>
            }
            <Button variant="outlined" component={NavLink} to={`/main/addresses/${params.id}`} sx={{ ml: 1 }}>
              {`${labels.addresses} (${contact?.addresses.length || 0})`}
            </Button>
            {!hasChanged &&
              <Button variant="outlined" onClick={() => setOpen(true)}>
                {labels.addAddress}
              </Button>
            }
            {address && !hasChanged &&
              <Button variant="outlined" onClick={handleSend}>
                {contact?.status === 's' ? labels.failed : labels.send}
              </Button>
            }
            <LoadingButton loading={isLoading} variant="contained" onClick={handleSubmit}>
              {labels.submit}
            </LoadingButton>
          </CardActions>
        </Card>
      </form>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{labels.addAddress}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="newAddress"
            label={labels.address}
            fullWidth
            value={newAddress}
            variant="standard"
            onChange={e => setNewAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{labels.cancel}</Button>
          <Button onClick={handleAddAddress}>{labels.submit}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

