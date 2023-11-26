import { format } from 'sql-formatter';

import { InsertBuilder } from './insert-builder';
describe('InsertBuilder', () => {
  let sut: InsertBuilder;

  beforeEach(() => {
    sut = new InsertBuilder();
  });

  it('Given a valid table, values and returning, when build is called, then should return a valid query', () => {
    const actual = sut
      .into('companies')
      .values({
        columnName: 'name',
        value: 'Giraffas',
      })
      .values({
        columnName: 'active',
        value: true,
      })
      .returning(['id', 'name'])
      .build();

    expect(actual).toBe(
      format(
        `insert into companies (name, active) values ('Giraffas', true) returning id, name`,
        {
          language: 'postgresql',
        },
      ),
    );
  });

  it('Given a valid table and values, when build is called, then should return a valid query', () => {
    const actual = sut
      .into('companies')
      .returning(['id', 'name'])
      .values({
        columnName: 'name',
        value: 'Giraffas',
      })
      .values({
        columnName: 'active',
        value: true,
      })
      .values({
        columnName: 'trade_name',
        value: 'Giraffas Brazil',
      })
      .returning(['trade_name'])
      .build();

    expect(actual).toBe(
      format(
        `insert into companies (name, active, trade_name) values ('Giraffas', true, 'Giraffas Brazil') returning id, name, trade_name`,
        { language: 'postgresql' },
      ),
    );
  });
});
