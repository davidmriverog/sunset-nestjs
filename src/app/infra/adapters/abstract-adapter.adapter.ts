import { DataSource, QueryRunner, Repository } from 'typeorm';
import { IPortOutbound } from '../../domain/ports/outbound.port';
import { IMapper } from '../mappers/base.mapper';
import { BaseEntity } from '../entities/base.entity';

export function AbstractImplAdapter<I extends BaseEntity, D>(
  entity: typeof BaseEntity,
  bo,
) {
  abstract class AbstractAdapter implements IPortOutbound<D> {
    _dataSource: DataSource;
    _repository: Repository<I>;
    _mapper: IMapper<I, D>;
    _bo: any;

    constructor(
      dataSource: DataSource,
      engineRepsitory: Repository<I>,
      mapper: IMapper<I, D>,
    ) {
      this._dataSource = dataSource;
      this._repository = engineRepsitory;
      this._mapper = mapper;
      this._bo = bo;
    }

    async getAll(): Promise<D[]> {
      const entities: I[] = await this._repository
        .createQueryBuilder('c')
        .getMany();

      return entities.map(this._mapper.entityToBO);
    }

    async getById(id: number): Promise<D> {
      const resultEntity: I = await this._repository
        .createQueryBuilder('c')
        .where(`c.${entity.getIdPropertyName()} = :id`, { id })
        .getOne();

      if (!resultEntity) throw new Error(`${entity.name} not found!`);

      return this._mapper.entityToBO(resultEntity);
    }

    async create(entityDto: D, tr?: QueryRunner): Promise<D> {
      const queryRunner = tr ?? this._dataSource.createQueryRunner();

      if (!tr) {
        await queryRunner.connect();
        await queryRunner.startTransaction();
      }

      try {
        const convertMapper = this._mapper.dtoToEntity(entityDto);

        const result = await queryRunner.manager.save(convertMapper);

        if (!tr) await queryRunner.commitTransaction();

        return this._mapper.entityToBO(result);
      } catch (error) {
        if (!tr) await queryRunner.rollbackTransaction();

        throw error;
      } finally {
        if (!tr) await queryRunner.release();
      }
    }

    async update(id: number, entityDto: D, tr?: QueryRunner): Promise<D> {
      const queryRunner = tr ?? this._dataSource.createQueryRunner();

      if (!tr) {
        await queryRunner.connect();
        await queryRunner.startTransaction();
      }

      try {
        const convertMapper = this._mapper.dtoToEntity(entityDto);

        const result = await queryRunner.manager.update(
          entity,
          {
            [entity.getIdPropertyName()]: id,
          },
          convertMapper,
        );

        if (result.affected === 0)
          throw new Error('No Data Affected, cause Role does not exists');

        if (!tr) await queryRunner.commitTransaction();

        return this._mapper.entityToBO(convertMapper);
      } catch (error) {
        if (!tr) await queryRunner.rollbackTransaction();

        throw error;
      } finally {
        if (!tr) await queryRunner.release();
      }
    }

    async remove(id: number, tr?: QueryRunner): Promise<boolean> {
      const queryRunner = tr ?? this._dataSource.createQueryRunner();

      if (!tr) {
        await queryRunner.connect();
        await queryRunner.startTransaction();
      }

      try {
        const result = await queryRunner.manager
          .createQueryBuilder()
          .softDelete()
          .from(entity)
          .where(`${entity.getIdPropertyName()} = :id`, { id: id })
          .execute();

        if (result.affected === 0)
          throw new Error('No Data Affected, cause Role does not exists');

        if (!tr) await queryRunner.commitTransaction();

        return true;
      } catch (error) {
        if (!tr) await queryRunner.rollbackTransaction();

        throw error;
      } finally {
        if (!tr) await queryRunner.release();
      }
    }
  }

  return AbstractAdapter;
}
