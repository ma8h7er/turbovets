import { User } from '../../user/models/user.model';

export interface Task {
  id: number;
  title: string;
  description?: string;
  user?: User;
  status?: Status;
  createdAt?: string;
}

export interface Status {
  id: number;
  name: string;
}

export const taskStatuses: Status[] = [
  { id: 1, name: 'Created' },
  { id: 2, name: 'In Progress' },
  { id: 3, name: 'Completed' },
];
