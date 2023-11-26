import { handleQueryReturn } from './utils';

export class QueryBuilder {
  private _from: {
    table: string;
    tableAlias: string;
  };
  private _joins: {
    type: 'INNER' | 'LEFT' | 'RIGHT';
    table: string;
    on: string;
    tableAlias: string;
  }[];
  private _where: string[];
  private _select: string[];
  private _take?: number;
  private _skip?: number;

  constructor() {
    this._from = {
      table: '',
      tableAlias: '',
    };
    this._joins = [];
    this._where = [];
    this._select = [];
  }

  select(select: string) {
    this._select.push(select);
    return this;
  }

  from(table: string, tableAlias: string) {
    this._from = {
      table,
      tableAlias,
    };
    return this;
  }

  innerJoin(table: string, tableAlias: string, on: string) {
    this._joins.push({
      type: 'INNER',
      table,
      tableAlias,
      on,
    });
    return this;
  }

  leftJoin(table: string, tableAlias: string, on: string) {
    this._joins.push({
      type: 'LEFT',
      table,
      tableAlias,
      on,
    });
    return this;
  }

  rightJoin(table: string, tableAlias: string, on: string) {
    this._joins.push({
      type: 'RIGHT',
      table,
      tableAlias,
      on,
    });
    return this;
  }

  where(where: string) {
    this._where.push(where);
    return this;
  }

  takeAndSkip(take: number, skip: number) {
    this._take = take;
    this._skip = skip;
    return this;
  }

  build(): string {
    const select = this._select.join(', ');
    const from = `from ${this._from.table} as ${this._from.tableAlias}`;
    const joins = this._joins
      .map(
        (join) =>
          `${join.type === 'INNER' ? '' : join.type.toLowerCase()} join ${
            join.table
          } as ${join.tableAlias} on ${join.on}`,
      )
      .join(' ');
    const where =
      this._where.length > 0 ? `where ${this._where.join(' ')}` : '';

    if (this._take && this._skip) {
      return handleQueryReturn(
        `select ${select} ${from} ${joins} ${where} limit ${this._take} offset ${this._skip}`,
      );
    }

    return handleQueryReturn(`select ${select} ${from} ${joins} ${where}`);
  }
}
