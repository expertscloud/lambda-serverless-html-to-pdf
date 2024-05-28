
const Joi = require('joi');

const htmlToPDFValidator = Joi.object({
    htmlSourceKey: Joi.string().optional().messages({
      'string.base': 'htmlSourceKey must be a string'
    }),
    htmlBase64: Joi.string().optional().messages({
      'string.base': 'htmlBase64 must be a string'
    }),
    destinationKey: Joi.string().optional().messages({
      'string.base': 'destinationKey must be a string'
    })
  })
    .or('htmlSourceKey', 'htmlBase64')
    .when(Joi.object({ htmlBase64: Joi.exist() }), {
      then: Joi.object({ destinationKey: Joi.required() }).messages({
        'any.required': 'destinationKey is required when htmlBase64 is provided'
      })
    })
    .messages({
      'object.missing': 'At least one of htmlSourceKey or htmlBase64 is required'
    });

    module.exports={ htmlToPDFValidator }