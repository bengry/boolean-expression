export class BooleanExpression<T> {
  private constructor(
    public readonly operator: "AND" | "OR",
    public readonly values: readonly (T | BooleanExpression<T>)[]
  ) {}

  static And<T>(...values: (T | BooleanExpression<T>)[]): BooleanExpression<T> {
    return new BooleanExpression("AND", values);
  }

  static Or<T>(...values: (T | BooleanExpression<T>)[]): BooleanExpression<T> {
    return new BooleanExpression("OR", values);
  }

  /**
   * Wrap a value with a BooleanExpression if it is not already one.
   */
  static Wrap<T>(value: T | BooleanExpression<T>): BooleanExpression<T> {
    return value instanceof BooleanExpression<T>
      ? value
      : // Either And or Or will be fine here, since we only have one value.
        BooleanExpression.And(value);
  }

  evaluate(validator: (value: T) => boolean): boolean {
    const fn = {
      AND: Array.prototype.every,
      OR: Array.prototype.some,
    }[this.operator];

    return fn.call(this.values, (value: T | BooleanExpression<T>) => {
      if (value instanceof BooleanExpression<T>) {
        return value.evaluate(validator);
      }

      return validator(value);
    });
  }
}
