export interface IPortInbound<I> {
  getAll(): Promise<I[]>;
  getById(id: number): Promise<I>;
  create(entityDto: any): Promise<I>;
  update(id: number, entityDto: any): Promise<I>;
  remove(id: number): Promise<boolean>;
}
