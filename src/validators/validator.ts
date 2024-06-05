import Joi from 'joi';

export const userPurchaseBodySchema = Joi.object({
  amount: Joi.number().integer().positive().required(),
});

export const userPurchasePathSchema = Joi.object({
  id: Joi.string().regex(/^[1-9]\d*$/).required(),
});
