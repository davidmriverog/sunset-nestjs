import { QueryRunner } from 'typeorm';

export interface IPortOutbound<I> {
  getAll(): Promise<I[]>;
  getById(id: number): Promise<I>;
  create(entityDto: I, tr?: QueryRunner): Promise<I>;
  update(id: number, entityDto: I, tr?: QueryRunner): Promise<I>;
  remove(id: number, tr?: QueryRunner): Promise<boolean>;
}
