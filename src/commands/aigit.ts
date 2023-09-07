
import {
    black, dim, green, red, bgCyan,
} from 'kolorist';
import {
    intro, outro, spinner, select, confirm, isCancel,
    log
} from '@clack/prompts';
import { execa } from 'execa';

import { getStagedDiff } from '../utils/git.js';
import { generateCommitMessage } from '../utils/openai.js';

export const assertGitRepo = async () => {
    const { stdout, failed } = await execa('git', ['rev-parse', '--show-toplevel'], { reject: false });

    if (failed) {
        console.error('The current directory must be a Git repository!');
    }

    return stdout;
};

export const getDetectedMessage = (files: string[]) => `Detected ${files.length.toLocaleString()} staged file${files.length > 1 ? 's' : ''}`;


export default async (
    generate: number | undefined,
    excludeFiles: string[],
    stageAll: boolean,
    emoji: boolean,
    rawArgv: string[],
) => (
    async () => {
        intro(bgCyan(black(' aicommits ')));
        await assertGitRepo();

        const detectingFiles = spinner();

        if (stageAll) {
            await execa('git', ['add', '--update']);
        }

        detectingFiles.start('Detecting staged files');
        const staged = await getStagedDiff()

        if (!staged) {
            detectingFiles.stop('Detecting staged files');
            console.error('No staged files found!');
        }

        detectingFiles.stop(`${getDetectedMessage(staged?.files || [])}:\n${staged?.files.map(file => `     ${file}`).join('\n')
            }`);

        const s = spinner()
        s.start('The AI is analyzing your changes');
        let messages;
        try {
            messages = await generateCommitMessage(
                'en',
                staged?.diff || '',
                1,
                50,
                emoji
            );
        } finally {
            s.stop('Changes analyzed');
        }



        if (messages.length === 0) {
            console.error('No commit messages were generated. Try again.');
        }

        let message: string;

        message = messages[0];

        const confirmed = await confirm({
            message: `Use this commit message?\n\n   ${message}\n`,
        })

        if (!confirmed || isCancel(confirmed)) {
            outro('Commit cancelled');
            return;
        }


        await execa('git', ['commit', '-m', message, ...rawArgv]);

        outro(`${green('✔')} Successfully committed!`);


    })().catch((error) => {
        console.error(`${error.message}`);
        process.exit(1);
    }
    )
