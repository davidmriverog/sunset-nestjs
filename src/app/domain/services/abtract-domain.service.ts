import { IPortInbound } from '../ports/inbound.port';
import { IPortOutbound } from '../ports/outbound.port';

export abstract class AbstractDomainService<I> implements IPortInbound<I> {
  constructor(private readonly repository: IPortOutbound<I>) {
    //
  }

  async getAll(): Promise<I[]> {
    return await this.repository.getAll();
  }

  async getById(id: number): Promise<I> {
    return await this.repository.getById(id);
  }

  async create(entityDto: any): Promise<I> {
    return await this.repository.create(entityDto);
  }

  async update(id: number, entityDto: any): Promise<I> {
    return await this.repository.update(id, entityDto);
  }

  async remove(id: number): Promise<boolean> {
    return await this.repository.remove(id);
  }
}
