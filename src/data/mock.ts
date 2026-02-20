import { Building, Todo, User } from '../types';

export const mockBuildings: Building[] = [
  { id: 'b1', buildingNum: 'B-01', name: 'Sunset Apartments', address: '123 Sunset Blvd', relatedUsers: ['u1', 'u2'] },
  { id: 'b2', buildingNum: 'B-02', name: 'Oceanview Condos', address: '456 Ocean Ave', relatedUsers: ['u1', 'u3'] },
  { id: 'b3', buildingNum: 'B-03', name: 'Downtown Commercial', address: '789 Main St', relatedUsers: ['u2'] },
  { id: 'b4', buildingNum: 'B-04', name: 'The Heights', address: '101 Hilltop Rd', relatedUsers: ['u3'] },
];

export const mockUsers: User[] = [
  { id: 'u1', userType: 'Admin', fullName: 'Kristin Watson', department: 'Residential', role: 'Property Manager', email: 'kristin@example.com', relatedProperties: ['b1', 'b2'] },
  { id: 'u2', userType: 'Manager', fullName: 'Cody Fisher', department: 'Commercial', role: 'Property Manager', email: 'cody@example.com', relatedProperties: ['b1', 'b3'] },
  { id: 'u3', userType: 'User', fullName: 'Esther Howard', department: 'Condominiums', role: 'Assist. Property Manager', email: 'esther@example.com', relatedProperties: ['b2', 'b4'] },
];

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const mockTodos: Todo[] = [
  {
    id: 't1',
    title: 'Fix leaky faucet in Apt 4B',
    status: 'In Progress',
    priority: 'Medium',
    buildingId: 'b1',
    userId: 'u1',
    description: 'Tenant reported a constant drip from the kitchen faucet.',
    openedOn: daysAgo(5),
    inProgressOn: daysAgo(4),
    updates: [
      { timestamp: daysAgo(4), description: 'Plumber contacted, scheduled for tomorrow.' },
      { timestamp: daysAgo(3), description: 'Plumber arrived, needs a replacement part.' }
    ]
  },
  {
    id: 't2',
    title: 'HVAC Maintenance',
    status: 'Not Started',
    priority: 'Low',
    buildingId: 'b3',
    userId: 'u2',
    description: 'Annual HVAC maintenance for the entire building.',
    openedOn: daysAgo(2),
    updates: []
  },
  {
    id: 't3',
    title: 'Replace lobby lightbulbs',
    status: 'Completed',
    priority: 'Low',
    buildingId: 'b2',
    userId: 'u3',
    description: 'Several bulbs are out in the main lobby.',
    openedOn: daysAgo(15),
    inProgressOn: daysAgo(14),
    completedOn: daysAgo(14),
    updates: [
      { timestamp: daysAgo(14), description: 'All bulbs replaced with LEDs.' }
    ]
  },
  {
    id: 't4',
    title: 'Repair broken window',
    status: 'In Progress',
    priority: 'High',
    buildingId: 'b4',
    userId: 'u3',
    description: 'Window in common area 2nd floor is cracked.',
    openedOn: daysAgo(10),
    inProgressOn: daysAgo(8),
    updates: [
      { timestamp: daysAgo(8), description: 'Glass ordered.' }
    ]
  },
  {
    id: 't5',
    title: 'Paint exterior trim',
    status: 'Not Started',
    priority: 'Medium',
    buildingId: 'b1',
    userId: 'u1',
    description: 'Touch up peeling paint on the south side.',
    openedOn: daysAgo(1),
    updates: []
  },
  {
    id: 't6',
    title: 'Fix elevator button',
    status: 'Completed',
    priority: 'High',
    buildingId: 'b3',
    userId: 'u2',
    description: 'Button for 5th floor is sticking.',
    openedOn: daysAgo(20),
    inProgressOn: daysAgo(19),
    completedOn: daysAgo(18),
    updates: [
      { timestamp: daysAgo(19), description: 'Technician dispatched.' },
      { timestamp: daysAgo(18), description: 'Button replaced.' }
    ]
  },
  {
    id: 't7',
    title: 'Clean gutters',
    status: 'Completed',
    priority: 'Medium',
    buildingId: 'b2',
    userId: 'u1',
    description: 'Clear leaves from all gutters before rainy season.',
    openedOn: daysAgo(25),
    inProgressOn: daysAgo(24),
    completedOn: daysAgo(22),
    updates: [
      { timestamp: daysAgo(22), description: 'Gutters cleaned and flushed.' }
    ]
  },
  {
    id: 't8',
    title: 'Inspect roof',
    status: 'Not Started',
    priority: 'High',
    buildingId: 'b4',
    userId: 'u3',
    description: 'Annual roof inspection.',
    openedOn: daysAgo(0),
    updates: []
  }
];
