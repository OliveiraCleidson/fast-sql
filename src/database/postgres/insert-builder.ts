import { handleQueryReturn } from './utils';

export class InsertBuilder {
  private _into: {
    table: string;
  };
  private _values: {
    columnName: string;
    value: any;
  }[];
  private _returning: string[];

  constructor() {
    this._into = {
      table: '',
    };
    this._values = [];
    this._returning = [];
  }

  into(table: string) {
    this._into = {
      table,
    };
    return this;
  }

  values(values: { columnName: string; value: any }) {
    this._values.push(values);
    return this;
  }

  returning(returning: string[]) {
    this._returning = [...this._returning, ...returning];
    return this;
  }

  build() {
    const columns = this._values.map((value) => value.columnName).join(', ');
    const values = this._values
      .map((value) => {
        if (typeof value.value === 'string') {
          return `'${value.value}'`;
        }

        return value.value;
      })
      .join(', ');

    const returning = this._returning.join(', ');

    return handleQueryReturn(
      `insert into ${this._into.table} (${columns}) values (${values}) returning ${returning}`,
    );
  }
}
