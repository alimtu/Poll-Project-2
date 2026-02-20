import Joi from 'joi';
import FA_MESSAGES from './joi-messages-fa.json';

export default function buildFormSchema(steps) {
  const shape = {};

  for (const step of steps) {
    const allSections = [...(step.sections || []), ...(step.sections2 || [])];

    for (const section of allSections) {
      const key = `section_${section.sectionId}`;
      const isRequired = !!section.required;

      shape[key] = buildRule(section, isRequired);
    }
  }

  return Joi.object(shape).messages(FA_MESSAGES).options({ abortEarly: false });
}

function buildRule(section, isRequired) {
  switch (section.type) {
    case 0:
    case 1:
      return isRequired
        ? Joi.string().required().disallow('', null).label(section.title)
        : Joi.string().allow('', null).label(section.title);

    case 3:
      return isRequired
        ? Joi.number().required().label(section.title)
        : Joi.number().allow(null, '').label(section.title);

    case 4:
      return isRequired
        ? Joi.string().required().disallow('', null).label(section.title)
        : Joi.string().allow('', null).label(section.title);

    case 5:
      return isRequired
        ? Joi.array().items(Joi.string()).min(1).required().label(section.title)
        : Joi.array().items(Joi.string()).label(section.title);

    case 6:
      return isRequired
        ? Joi.any().required().invalid(null).label(section.title)
        : Joi.any().label(section.title);

    case 7:
    case 8:
    case 9:
      return isRequired
        ? Joi.any().required().invalid(null, '').label(section.title)
        : Joi.any().label(section.title);

    case 14:
      return isRequired
        ? Joi.string().required().disallow('', null).label(section.title)
        : Joi.string().allow('', null).label(section.title);

    case 10:
      return isRequired
        ? Joi.object({
            category: Joi.string()
              .required()
              .disallow('', null)
              .label('دسته')
              .messages(FA_MESSAGES),
            sub: Joi.string().required().disallow('', null).label('زیر‌دسته').messages(FA_MESSAGES),
          })
            .required()
            .label(section.title)
        : Joi.object({
            category: Joi.string().allow('', null).label('دسته'),
            sub: Joi.string().allow('', null).label('زیر‌دسته'),
          }).label(section.title);

    default:
      return isRequired
        ? Joi.any().required().label(section.title)
        : Joi.any().label(section.title);
  }
}
