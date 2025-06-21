import { exec } from 'child_process';

// Check if the migration name is missing
if (process.argv.length > 2) {
  const command = `npm run typeorm -- --dataSource=src/app/database/cli-data-source.ts migration:generate src/app/database/migrations/${
    process.argv[process.argv.length - 1]
  }`;

  (() =>
    exec(command, (error, stdout, stderr) => {
      if (error !== null) {
        console.error(stderr);
      }
      console.log(stdout);
    }))();
} else {
  console.error(
    '\x1b[41m',
    'Missing migration file name. Example: create_model_table'
  );
}
