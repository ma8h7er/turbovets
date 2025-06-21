export class FindTasksDto {
  search?: string;
  orderBy?: 'id' | 'title' | 'createdAt';
  order?: 'ASC' | 'DESC';
  take?: number;
  skip?: number;
}
