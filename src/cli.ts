import { Command } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';

import { getGitMessageFileName, prepareCommitMessage } from './lib/index.js';
import { readJSON } from './lib/readJSON.js';
import validateBranchName from './lib/validateBranchName.js';

const { resolve, dirname } = path;
export interface PackageJSON {
  version: string;
}

export interface ProgramOptions {
  config?: string;
}

const { argv } = process;
const cliArguments = argv.slice(2);
const pkgJson = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../package.json'
);

const configFile = readJSON<PackageJSON>(pkgJson);
const { version = '' } = configFile ? configFile : {};

const program = new Command();

program
  .version(version, '-v, --version', 'Output current version')
  .description('Validates branch names and creates commit messages')
  .usage('validate-branch-name|vbn, prepare-commit-message|pcm');

program
  .command('validate-branch-name')
  .alias('vbn')
  .usage('-c [config-file]')
  .description('Validate branch name to match provided pattern')
  .option('-c, --config [config]', 'Pass path to the config file')
  .action((options: ProgramOptions) => {
    const { config } = options;
    validateBranchName(typeof config === 'string' ? config : null);
  });

program
  .command('prepare-commit-message')
  .alias('pcm')
  .usage('-c [config-file]')
  .description('Validate branch name to match provided pattern')
  .option('-c, --config [config]', 'Pass path to the config file')
  .action((options: ProgramOptions) => {
    const { config } = options;
    const gitMessafeFile = getGitMessageFileName(cliArguments);
    prepareCommitMessage(config, gitMessafeFile);
  });

program.parse(argv);
