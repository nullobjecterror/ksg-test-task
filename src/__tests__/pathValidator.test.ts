import { userPurchasePathSchema } from "../validators/validator";

describe('userPurchasePathSchema', () => {
  it('should validate correct path params', () => {
    const path = { id: '730' };
    const { error } = userPurchasePathSchema.validate(path);
    expect(error).toBeUndefined();
  });

  it('should invalidate path params with incorrect types', () => {
    const path = { id: '25458b44-bfda-4c2e-b24e-aa01da1a1ca2' };
    const { error } = userPurchasePathSchema.validate(path);
    expect(error).toBeDefined();
  });
});
