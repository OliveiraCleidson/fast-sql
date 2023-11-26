import { format } from 'sql-formatter';

import { UpdateBuilder } from './update-builder';
describe('Update Builder - Unit Test', () => {
  let sut: UpdateBuilder;

  beforeEach(() => {
    sut = new UpdateBuilder();
  });

  it('Given valid table, when build is called, then should return valid query', () => {
    // Arrange
    const table = 'companies';

    // Act
    const actual = sut
      .table(table)
      .set({
        columnName: 'name',
        value: 'Giraffas',
      })
      .where({
        columnName: 'id',
        value: 1,
      })
      .build();

    // Assert
    expect(actual).toBe(
      format(`update ${table} set name = 'Giraffas' where id = 1`, {
        language: 'postgresql',
      }),
    );
  });

  it('Given valid table and returning, when build is called, then should return valid query', () => {
    // Arrange
    const table = 'companies';

    // Act
    const actual = sut
      .table(table)
      .set({
        columnName: 'name',
        value: 'Giraffas',
      })
      .set({
        columnName: 'active',
        value: true,
      })
      .where({
        columnName: 'id',
        value: 1,
      })
      .where({
        columnName: 'active',
        value: false,
      })
      .returning(['id', 'name'])
      .build();

    // Assert
    expect(actual).toBe(
      format(
        `update ${table} set name = 'Giraffas', active = true where id = 1 and active = false returning id, name`,
        {
          language: 'postgresql',
        },
      ),
    );
  });
});
