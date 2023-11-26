import * as fs from 'fs';

import { loadMetadata } from './database/postgres';

loadMetadata({
  database: 'mvp-backend',
  host: 'host.docker.internal',
  password: 'Password123',
  user: 'postgres',
  port: 5432,
}).then((r) => fs.writeFileSync('metadata.json', JSON.stringify(r, null, 2)));
