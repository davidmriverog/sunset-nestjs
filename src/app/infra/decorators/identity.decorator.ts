import 'reflect-metadata';
import { BaseEntity } from '../entities/base.entity';

export const MODEL_IDENTITY_META_KEY = 'MODEL_IDENTITY_META_KEY';

export const ModelIdentity = () => {
  return (target: BaseEntity, key: string) => {
    Reflect.defineMetadata(
      MODEL_IDENTITY_META_KEY,
      key,
      target.constructor,
      MODEL_IDENTITY_META_KEY,
    );
  };
};
