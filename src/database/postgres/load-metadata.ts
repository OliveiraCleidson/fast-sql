import { Pool } from 'pg';

import {
  ColumnTS,
  ConstraintTS,
  DatabaseTS,
  ForeignKeyTS,
  SchemaTS,
  TableTS,
} from '../contracts/metadata';

type DbConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export async function loadMetadata(config: DbConfig): Promise<DatabaseTS> {
  const pool = new Pool({
    ...config,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Create SchemaTS with Constraints
  const schemas = await getSchemas(pool);
  const schemaNames = schemas.rows.map((schema) => schema.schema_name);
  const schemaConstraints = await getSchemaConstraints(pool, schemaNames);
  const schemasTs: Map<string, SchemaTS> = new Map(
    schemaNames.map((schemaName) => [
      schemaName,
      {
        schemaName,
        tables: [],
        constraints: [],
      },
    ]),
  );
  schemaConstraints.rows.reduce((constraintMap, value) => {
    const constraint = constraintMap.get(value.constraint_name);
    if (constraint) {
      if (constraint.constraintType === 'UNIQUE') {
        const set = new Set(constraint.columnNames);
        set.add(value.column_name);
        constraint.columnNames = Array.from(set);
      }
      return constraintMap;
    }

    if (value.constraint_type === 'FOREIGN KEY') {
      constraintMap.set(value.constraint_name, {
        constraintName: value.constraint_name,
        constraintType: value.constraint_type as any,
        tableName: value.table_name,
        columnName: value.column_name,
        referencedSchema: value.foreign_table_schema,
        referencedTable: value.foreign_table_name,
        referencedColumn: value.foreign_column_name,
      } as ForeignKeyTS);
    }

    if (value.constraint_type === 'PRIMARY KEY') {
      constraintMap.set(value.constraint_name, {
        constraintName: value.constraint_name,
        constraintType: value.constraint_type as any,
        tableName: value.table_name,
        columnName: value.column_name,
      });
    }

    if (value.constraint_type === 'UNIQUE') {
      constraintMap.set(value.constraint_name, {
        constraintName: value.constraint_name,
        constraintType: value.constraint_type as any,
        columnNames: [value.column_name],
      });
    }

    const schema = schemasTs.get(value.table_schema);
    if (schema) {
      schema.constraints.push(constraintMap.get(value.constraint_name)!);
    }

    return constraintMap;
  }, new Map<string, ConstraintTS>());

  // Addes Tables and Columns to SchemaTS
  const tables = await getTables(pool, schemaNames);
  const tablesName = tables.rows.map((table) => table.table_name);
  const columns = await getColumnsFromTables(pool, tablesName);
  const tableMap = tables.rows.reduce((map, value) => {
    map.set(value.table_name, {
      tableName: value.table_name,
      schemaName: value.table_schema,
      typescriptName: value.table_name,
      columns: [],
    } as TableTS);

    const schema = schemasTs.get(value.table_schema);
    if (schema) {
      schema.tables.push(map.get(value.table_name)!);
    }
    return map;
  }, new Map());

  columns.rows.forEach((column) => {
    const table = tableMap.get(column.table_name);
    if (!table) return;

    const schema = schemasTs.get(column.table_schema);
    const isPrimaryKey =
      schema?.constraints.some(
        (constraint) =>
          constraint.constraintType === 'PRIMARY KEY' &&
          constraint.columnName === column.column_name &&
          constraint.tableName === column.table_name,
      ) ?? false;
    table.columns.push({
      typescriptName: column.column_name,
      columnName: column.column_name,
      columnType: column.data_type,
      isOptional: column.is_nullable === 'YES',
      isPrimaryKey,
      isLogicalDelete: false,
    } as ColumnTS);
  });

  await pool.end();

  return {
    databaseName: config.database,
    schemas: Array.from(schemasTs.values()),
  };
}

async function getSchemas(pool: Pool) {
  return pool.query(`
    select
      schema_name
    from
      information_schema.schemata
    where schema_name not in ('pg_catalog', 'information_schema', 'pg_toast');
  `);
}

function getSchemaConstraints(pool: Pool, schemaNames: string[]) {
  return pool.query<{
    constraint_name: string;
    table_name: string;
    constraint_type: string;
    column_name: string;
    foreign_table_name: string;
    foreign_column_name: string;
    foreign_table_schema: string;
    table_schema: string;
  }>(
    `
    select
      tc.constraint_name,
      tc.table_name,
      tc.constraint_type,
      kcu.column_name,
      ccu.table_name as foreign_table_name,
      ccu.column_name as foreign_column_name,
      ccu.table_schema as foreign_table_schema,
      kcu.table_name,
      kcu.table_schema
    from
      information_schema.table_constraints as tc
    join information_schema.key_column_usage as kcu
          on
      tc.constraint_name = kcu.constraint_name
    join information_schema.constraint_column_usage as ccu
          on
      ccu.constraint_name = tc.constraint_name
    where tc.table_schema in (${schemaNames
      .map((_, i) => `$${i + 1}`)
      .join(', ')});
  `,
    schemaNames,
  );
}

async function getTables(pool: Pool, schemaNames: string[]) {
  return pool.query(
    `
    select
      table_name, table_schema
    from
      information_schema.tables
    where table_schema in (${schemaNames
      .map((_, i) => `$${i + 1}`)
      .join(', ')});
  `,
    schemaNames,
  );
}

async function getColumnsFromTables(pool: Pool, tablesName: string[]) {
  return pool.query(
    `
    -- Get all columns and types from a table
    select
      c.table_schema,
      c.column_name,
      c.udt_name as "data_type",
      c.table_name,
      c.is_nullable
    from
      information_schema.columns c
    where
      c.table_name in (${tablesName.map((_, i) => `$${i + 1}`).join(', ')});
  `,
    tablesName,
  );
}
