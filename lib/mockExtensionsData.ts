import type { ExtensionRow } from '@/types/extensions'

export const mockExtensionsData: ExtensionRow[] = [
  {
    id: '1',
    extension: '100',
    presence: 'Available',
    device: {
      sip: true,
      pc: true,
      mobile: false,
      web: true
    },
    callerIdName: 'John Smith',
    role: 'Agent',
    email: 'john.smith@company.com',
    mobile: '+1 555-0101',
    notes: 'Senior agent'
  },
  {
    id: '2',
    extension: '101',
    presence: 'Away',
    device: {
      sip: true,
      pc: false,
      mobile: true,
      web: false
    },
    callerIdName: 'Jane Doe',
    role: 'Supervisor',
    email: 'jane.doe@company.com',
    mobile: '+1 555-0102',
    notes: 'Team lead'
  },
  {
    id: '3',
    extension: '102',
    presence: 'DND',
    device: {
      sip: true,
      pc: true,
      mobile: true,
      web: true
    },
    callerIdName: 'Mike Johnson',
    role: 'Agent',
    email: 'mike.johnson@company.com',
    mobile: '+1 555-0103',
    notes: ''
  },
  {
    id: '4',
    extension: '103',
    presence: 'Offline',
    device: {
      sip: false,
      pc: false,
      mobile: false,
      web: false
    },
    callerIdName: 'Sarah Wilson',
    role: 'Manager',
    email: 'sarah.wilson@company.com',
    mobile: '+1 555-0104',
    notes: 'Department manager'
  },
  {
    id: '5',
    extension: '104',
    presence: 'Available',
    device: {
      sip: true,
      pc: true,
      mobile: false,
      web: false
    },
    callerIdName: 'David Brown',
    role: 'Agent',
    email: 'david.brown@company.com',
    mobile: '+1 555-0105',
    notes: 'New hire'
  }
]