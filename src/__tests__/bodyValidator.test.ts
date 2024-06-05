import { userPurchaseBodySchema } from "../validators/validator";

describe('userPurchaseBodySchema', () => {
  it('should validate correct body params', () => {
    const body = { amount: 730 };
    const { error } = userPurchaseBodySchema.validate(body);
    expect(error).toBeUndefined();
  });

  it('should invalidate body params with incorrect types', () => {
    const body = { amount: '25458b44-bfda-4c2e-b24e-aa01da1a1ca2' };
    const { error } = userPurchaseBodySchema.validate(body);
    expect(error).toBeDefined();
  });
});
