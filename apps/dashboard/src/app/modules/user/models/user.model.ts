import { Organization } from './organization.model';
import { Role } from './role.model';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  organization: Organization;
  roles: Role[];
}
