const Joi = require('joi');

const cropListingSchema = Joi.object({
  cropName: Joi.string().required(),

  quantity: Joi.number().positive().required(),

  unit: Joi.string()
    .valid('Kg', 'Quintal', 'Ton')
    .required(),

  expectedPrice: Joi.number().optional(),

  harvestDate: Joi.date().optional(),

  qualityGrade: Joi.string()
    .valid('A', 'B', 'C')
    .optional(),

  isOrganic: Joi.boolean().optional(),

  pickupType: Joi.string()
    .valid('Farm Pickup', 'Market Drop')
    .optional()
});

module.exports = { cropListingSchema };
