export type Status = 'Not Started' | 'In Progress' | 'Completed';
export type Priority = 'Low' | 'Medium' | 'High';

export interface Update {
  timestamp: string;
  description: string;
}

export interface Todo {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  buildingId: string;
  userId: string;
  description: string;
  openedOn: string; // ISO date
  inProgressOn?: string;
  completedOn?: string;
  updates: Update[];
}

export interface User {
  id: string;
  userType: 'Admin' | 'Manager' | 'User';
  fullName: string;
  department: 'Residential' | 'Condominiums' | 'Commercial' | 'Others';
  role: 'Property Manager' | 'Assist. Property Manager' | 'Others';
  email: string;
  relatedProperties: string[]; // Building IDs
}

export interface Building {
  id: string;
  buildingNum: string;
  name: string;
  address: string;
  relatedUsers: string[]; // User IDs
}
