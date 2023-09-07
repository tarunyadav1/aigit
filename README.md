# aigit

**Auto AI commits messages**

`aigit` is a command-line tool that leverages the power of AI to automatically generate commit messages for your Git repositories. It detects staged files and uses OpenAI's GPT-3.5 model to analyze the changes and suggest relevant commit messages.

## Features

- **AI-Powered Commit Messages**: Generate concise and relevant commit messages based on the code diff.
- **Customizable**: Options to generate multiple commit suggestions, exclude specific files, and even include emojis in commit messages.
- **Easy Configuration**: Set up your OpenAI API key with ease and get started in no time.

## Installation

```bash
npm install -g @tarunyadav9761/aigit
```

## Usage

Navigate to your Git repository.
Stage the files you want to commit.
Run the aigit command.
Review the AI-generated commit message and confirm.

## Configuration

You can configure aigit by setting the OpenAI API key:

```bash
aigit config set <YOUR_OPENAI_API_KEY>
```

## Setup

> The minimum supported version of Node.js is the latest v14. Check your Node.js version with `node --version`.

1. Install _aigit_:

   ```sh
   npm install -g @tarunyadav9761/aigit
   ```

2. Retrieve your API key from [OpenAI](https://platform.openai.com/account/api-keys)

   > Note: If you haven't already, you'll have to create an account and set up billing.

3. Set the key so aigit can use it:

   ```sh
   aigit config set <YOUR_OPENAI_API_KEY>
   ```

   This will create a `.aigit` file in your home directory.

## Dependencies

- [openai](https://www.npmjs.com/package/openai): OpenAI's official client library for JavaScript.
- [cleye](https://www.npmjs.com/package/cleye): A lightweight CLI framework.
- [execa](https://www.npmjs.com/package/execa): A better child_process.
- [kolorist](https://www.npmjs.com/package/kolorist): A tiny utility for terminal output styling.

... and more. Check the `package.json`` for a full list.

## License

This project is licensed under the ISC License.
