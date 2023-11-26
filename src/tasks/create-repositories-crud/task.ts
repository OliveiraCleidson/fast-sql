import { DatabaseTS } from '~/database/contracts';
import { Task } from '~/types/task';

type Command = {
  database: DatabaseTS;
  table: string;
  settings: {
    findAll?: {
      fields: string[];
      join?: {
        table: string;
        column: string;
      }[];
    };
    findAllWithPagination?: {
      fields: string[];
      join?: {
        table: string;
        column: string;
      }[];
    };
    findOneById?: {
      fields: string[];
      join?: {
        table: string;
        column: string;
      }[];
    };
    create?: {
      fields: string[];
    };
    updateById?: {
      fields: string[];
    };
    deleteById?: {
      isLogical: boolean;
    };
    findOneBy?: {
      byColumns: string[];
      fields: string[];
    }[];
  };
  destinationPath: string;
};

export class CreateRepositoriesCrud implements Task<Command, void> {
  async execute(input: Command): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
