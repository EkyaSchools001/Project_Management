const fs = require('fs');

const mainSchemaPath = 'c:/Users/Admin/Documents/ekya/testing/server/prisma/schema.prisma';
const additionPath = 'c:/Users/Admin/Documents/ekya/testing/scripts/pdi_schema_addition.prisma';

const addition = fs.readFileSync(additionPath, 'utf8');

fs.appendFileSync(mainSchemaPath, '\n// ─── PDI INTEGRATION MODELS ───────────────────────────────────────────────────\n' + addition);
