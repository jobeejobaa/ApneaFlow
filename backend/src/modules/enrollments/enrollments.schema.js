const { z } = require('zod');

const enrollSchema = z.object({
  withEquipment: z.boolean().optional().default(false),
});

module.exports = { enrollSchema };
