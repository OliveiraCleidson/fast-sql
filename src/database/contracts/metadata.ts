export type ColumnTS = {
  typescriptName: string;
  columnName: string;
  columnType: string;
  isOptional: boolean;
  isPrimaryKey: boolean;
  isLogicalDelete: boolean;
};

export type TableTS = {
  typescriptName: string;
  tableName: string;
  schemaName: string;
  columns: ColumnTS[];
};

export type BaseConstraintTS = {
  constraintName: string;
};

export type ForeignKeyTS = BaseConstraintTS & {
  constraintType: 'FOREIGN KEY';
  tableName: string;
  columnName: string;
  referencedSchema: string;
  referencedTable: string;
  referencedColumn: string;
};

export type PrimaryKeyTS = BaseConstraintTS & {
  constraintType: 'PRIMARY KEY';
  columnName: string;
  tableName: string;
};

export type UniqueTS = BaseConstraintTS & {
  constraintType: 'UNIQUE';
  columnNames: string[];
};

export type ConstraintTS = ForeignKeyTS | PrimaryKeyTS | UniqueTS;

export type SchemaTS = {
  schemaName: string;
  tables: TableTS[];
  constraints: ConstraintTS[];
};

export type DatabaseTS = {
  databaseName: string;
  schemas: SchemaTS[];
};
