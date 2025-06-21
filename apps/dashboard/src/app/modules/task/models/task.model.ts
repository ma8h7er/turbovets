import { User } from '../../user/models/user.model';

export interface Task {
  id: number;
  title: string;
  description?: string;
  user?: User;
  status?: number;
  createdAt?: string;
}
