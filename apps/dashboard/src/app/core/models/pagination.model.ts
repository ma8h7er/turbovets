export class Pagination {
  total?: number;
  from?: number;
  to?: number;
  skip = 0;
  take = 20;
  last_page?: number;
}
