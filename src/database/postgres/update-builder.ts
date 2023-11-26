import { handleQueryReturn } from './utils';

export class UpdateBuilder {
  private _table: {
    table: string;
  };
  private _set: {
    columnName: any;
    value: any;
  }[];
  private _where: {
    columnName: any;
    value: any;
  }[];

  private _returning: string[];

  constructor() {
    this._table = {
      table: '',
    };
    this._set = [];
    this._where = [];
    this._returning = [];
  }

  table(table) {
    this._table = {
      table,
    };
    return this;
  }

  set(set: { columnName: string; value: any }) {
    this._set.push(set);
    return this;
  }

  where(where: { columnName: string; value: any }) {
    this._where.push(where);
    return this;
  }

  returning(returning) {
    this._returning = returning;
    return this;
  }

  build() {
    const set = this._set
      .map(
        (set) =>
          `${set.columnName} = ${
            typeof set.value === 'string' ? `'${set.value}'` : set.value
          }`,
      )
      .join(', ');

    const where = this._where
      .map(
        (where) =>
          `${where.columnName} = ${
            typeof where.value === 'string' ? `'${where.value}'` : where.value
          }`,
      )
      .join(' and ');
    const returning = this._returning.join(', ');
    return handleQueryReturn(`
      update ${this._table.table}
      set ${set}
      ${where ? `where ${where}` : ''}
      ${returning ? `returning ${returning}` : ''}
    `);
  }
}
