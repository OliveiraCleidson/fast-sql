import { format } from 'sql-formatter';

import { QueryBuilder } from './query-builder';

describe('Query Builder - Unit Test', () => {
  let sut: QueryBuilder;

  beforeEach(() => {
    sut = new QueryBuilder();
  });

  it('Given valid table, when build is called, then should return valid query', () => {
    const table = 'companies';

    const actual = sut.select('c.name').from(table, 'c').build();

    expect(actual).toBe(
      format(`select c.name from ${table} as c`, { language: 'postgresql' }),
    );
  });

  it('Given valid table and where, when build is called, then should return valid query', () => {
    const table = 'companies';

    const actual = sut
      .select('c.name')
      .from(table, 'c')
      .where('c.id = 1')
      .build();

    expect(actual).toBe(
      format(`select c.name from ${table} as c where c.id = 1`, {
        language: 'postgresql',
      }),
    );
  });

  it('Given valid table, where and joins, when build is called, then should return valid query', () => {
    const table = 'companies';

    const actual = sut
      .select('c.name, c.id')
      .select('u.name, u.id')
      .from(table, 'c')
      .innerJoin('users', 'u', 'u.company_id = c.id')
      .leftJoin('user_avatar', 'ua', 'ua.user_id = u.id')
      .where('c.id = 1')
      .select('ua.avatar')
      .build();

    expect(actual).toBe(
      format(
        `select c.name, c.id, u.name, u.id, ua.avatar from ${table} as c join users as u on u.company_id = c.id left join user_avatar as ua on ua.user_id = u.id where c.id = 1`,
        { language: 'postgresql' },
      ),
    );
  });
});
