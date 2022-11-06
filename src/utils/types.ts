export type Department = {
  id: string,
  name: string
}

export type Err = {
  code: string,
  message: string
}

export type Employee = {
  id?: string,
  name: string,
  departmentId: string,
  job: string,
  gender: string,
  salary: number,
  mobile: string,
  email: string,
  address: string,
  image: string,
  isActive: boolean
}


export type Contact = {
  id: string,
  name: string,
  type: number,
  link: string,
  sendingDate: number,
  status: string,
  newAdvert?: boolean,
  addresses: Address[],
}

export type Address = {
  value: string,
  status: string,
  contactId?: string
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start: number;
  end: number;
  color?: EventColor;
}

export const eventColors = ["primary", "warning", "error", "success"] as const;

export type EventColor = typeof eventColors[number];

export type Snackbar = {
  severity: 'success' | 'error' | 'warning',
  message: string,
  isOpen: boolean
}