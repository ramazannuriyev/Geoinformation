export interface PagedResponse<T> {
  data: T[];
  metadata: {
    currentOffset: number;
    totalCount: number;
  };
}