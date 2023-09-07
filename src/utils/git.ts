import { execa } from 'execa';


const excludeFromDiff = (path: string) => `:(exclude)${path}`;

const filesToExclude = [
    'package-lock.json',
    'pnpm-lock.yaml',

    // yarn.lock, Cargo.lock, Gemfile.lock, Pipfile.lock, etc.
    '*.lock',
].map(excludeFromDiff);

export const getStagedDiff = async () => {
    const diffCached = ['diff', '--cached', '--diff-algorithm=minimal'];
    const { stdout: files } = await execa(
        'git',
        [...diffCached,
            "--name-only",
        ...filesToExclude,
        ]
    );

    if (!files) {
        return;
    }

    const { stdout: diff } = await execa(
        'git',
        [
            ...diffCached,
            ...filesToExclude,
        ]
    )

    return {
        files: files.split('\n'),
        diff,
    }
}