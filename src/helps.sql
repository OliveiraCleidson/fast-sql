-- Get all schemas
select
	schema_name
from
	information_schema.schemata;

-- Get all tables from a schema
select
	table_name
from
	information_schema.tables
where
	table_schema = 'business';

-- Get all columns and types from a table
select
	column_name,
	data_type
from
	information_schema.columns
where
	table_name = 'companies';

-- Get all relations from a table
select
	tc.constraint_name,
	tc.table_name,
	kcu.column_name,
	ccu.table_name as foreign_table_name,
	ccu.column_name as foreign_column_name
from
	information_schema.table_constraints as tc
join information_schema.key_column_usage as kcu
      on
	tc.constraint_name = kcu.constraint_name
join information_schema.constraint_column_usage as ccu
      on
	ccu.constraint_name = tc.constraint_name
where
	constraint_type = 'FOREIGN KEY'
	and tc.table_name = 'company_events';