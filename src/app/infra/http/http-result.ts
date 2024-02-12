export class Result<T> {
  public isSuccessful: boolean;
  public isFaliure: boolean;
  private _errors?: T | string;
  private _props?: T;

  constructor(isSuccesful: boolean, props?: T, errors?: T) {
    if (isSuccesful && errors) throw new Error('Invalid Operation');

    if (!isSuccesful && !errors) throw new Error('Invalid Operation');

    this.isSuccessful = isSuccesful;
    this.isFaliure = !isSuccesful;
    this._props = props;
    this._errors = errors;
  }

  get value() {
    if (!this._props) throw new Error('Missing Props Value');

    return this._props;
  }

  get error() {
    if (!this._errors) throw new Error('Missing Errors Value');

    return this._errors;
  }

  public static success<T>(props: T): Result<T> {
    return new Result<T>(true, props, null);
  }

  public static fail<T>(errors: any): Result<T> {
    return new Result<T>(false, null, errors);
  }
}
