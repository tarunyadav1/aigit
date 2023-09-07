import { cli, command } from 'cleye'
import { green, red } from 'kolorist'
import fs from 'fs/promises'
import ini from 'ini'
import path from 'path'
import os from 'os'
import {
	intro, outro, spinner, select, confirm, isCancel,
	log,
	text
} from '@clack/prompts';

import { description } from '../package.json'
import aitgit from './commands/aigit.js'

const configPath = path.join(os.homedir(), '.aigit')

const rawArgv = process.argv.slice(2)

cli(
	{
		name: 'aigit',
		version: '0.1',

		// Define flags/options
		flags: {
			generate: {
				type: Number,
				description: 'Generate a number of commits',
				alias: 'g',
				default: 1,
			},
			exclude: {
				type: [String],
				description: 'Exclude files',
				alias: 'x',
			},
			all: {
				type: Boolean,
				description:
					'Automatically stage changes in tracked files for the commit',
				alias: 'a',
				default: false,
			},
			emoji: {
				type: Boolean,
				description: 'Use emoji in commit messages',
				alias: 'e',
				default: false,
			},
		},

		commands: [
			command(
				{
					// Command name
					name: 'config',
					parameters: ['<mode>', '<key=value...>'],
				},
				(argv) => {
					; (async () => {
						// Do something
						const { mode, keyValue: keyValues } = argv._

						// if (mode === 'get') {
						// 	const fileContent = await fs.readFile(configPath, 'utf8');
						// 	const config = ini.parse(fileContent);
						// 	outro(`${config.API}`);

						// 	return;
						// }

						if (mode === 'set') {
							const apiKey = keyValues[0]

							await fs.writeFile(
								configPath,
								ini.stringify({ API: apiKey }),
								'utf8'
							)

							outro(`${green('✔')} Successfully save!`);

							return
						}

						if (mode === 'get') {
							const fileContent = await fs.readFile(configPath, 'utf8')
							const config = ini.parse(fileContent)
							console.log(config.API)
							return
						}

						console.error(`Invalid mode: ${mode}`)
					})().catch((error) => {
						console.error(`${red('✖')} ${error.message}`)
						process.exit(1)
					})
				}
			),
		],

		help: {
			description,
		},
		ignoreArgv: (type) => type === 'unknown-flag' || type === 'argument',
	},
	(argv) => {
		aitgit(
			argv.flags.generate,
			argv.flags.exclude,
			argv.flags.all,
			argv.flags.emoji,
			rawArgv
		)
	},
	rawArgv
)
