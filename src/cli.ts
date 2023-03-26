import { Command } from 'commander';

import { readJSON } from './lib/readJSON.js';
import validateBranchName from './lib/validateBranchName.js';

export interface PackageJSON {
  version: string;
}

const { argv, cwd } = process;

const root = cwd();
const configFile = readJSON<PackageJSON>(`${root}/package.json`);

if (configFile) {
  const program = new Command();
  const { version } = configFile;

  program
    .name('git-names')
    .alias('gn')
    .version(version, '-v, --version', 'Output current version')
    .description('Validates branch names and creates commit messages')
    .usage('validate-branch-name|vbn, prepare-commit-message|pcm');

  program
    .command('validate-branch-name')
    .alias('vbn')
    .usage('-c [config-file]')
    .description('Validate branch name to match provided pattern')
    .option('-c, --config [config]', 'Pass path to the config file')
    .action(options => {
      const { config } = options;
      validateBranchName(typeof config === 'string' ? config : null);
    });

  program.parse(argv);
}