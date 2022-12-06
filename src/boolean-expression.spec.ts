import { describe, expect, it } from "vitest";
import { BooleanExpression } from "./boolean-expression";

describe(`BooleanExpression`, () => {
  describe(`Wrap`, () => {
    it(`should allow simple expressions`, () => {
      const value = BooleanExpression.Wrap(1).evaluate(isPositive);

      expect(value).toBe(true);
    });
  });

  describe(`And`, () => {
    it(`should evaluate to true when all values satisfy the constraint`, () => {
      const value = BooleanExpression.And(1, 2).evaluate(isPositive);

      expect(value).toBe(true);
    });

    it(`should evaluate to false when some values don't satisfy the constraint`, () => {
      const value = BooleanExpression.And(1, -1).evaluate(isPositive);

      expect(value).toBe(false);
    });
  });

  describe(`Composite expressions`, () => {
    it(`should evaluate composite Or-ed expressions`, () => {
      const value = BooleanExpression.Or(
        BooleanExpression.Or(1, 2), // when evaluating with `isPositive`, this evaluates to `true`
        BooleanExpression.And(-1, -2) // when evaluated with `isPositive`, this will be `false`
      ).evaluate(isPositive); // Or between `true` and `false`, so this will be true

      expect(value).toBe(true);
    });

    it(`should evaluate composite And-ed expressions`, () => {
      const value = BooleanExpression.And(
        BooleanExpression.Or(1, 2), // when evaluating with `isPositive`, this evaluates to `true`
        BooleanExpression.And(-1, -2) // when evaluated with `isPositive`, this will be `false`
      ).evaluate(isPositive); // And between `true` and `false`, so this will be false

      expect(value).toBe(false);
    });
  });

  describe(`Or`, () => {
    it(`should evaluate to true when all values satisfy the constraint`, () => {
      const value = BooleanExpression.Or(1, 2).evaluate(isPositive);

      expect(value).toBe(true);
    });

    it(`should evaluate to true when some values satisfy the constraint`, () => {
      const value = BooleanExpression.Or(1, -1).evaluate(isPositive);

      expect(value).toBe(true);
    });
  });
});

/** Simple helper functions to test `BooleanExpression` with. **/

const isPositive = (n: number) => n > 0;
