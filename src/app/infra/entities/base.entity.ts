import { MODEL_IDENTITY_META_KEY } from '../decorators/identity.decorator';

export class BaseEntity {
  static getIdPropertyName() {
    const key = Reflect.getMetadata(
      MODEL_IDENTITY_META_KEY,
      this,
      MODEL_IDENTITY_META_KEY,
    );
    return key;
  }
}
