# GitHub API workbench

## Step 1: Use with the GitHub CLI (`gh`)

First, [install the GitHub CLI](https://cli.github.com/)

Then, authenticate to GitHub:

```shell
gh auth login
```

You are ready to make requests:

```shell
gh api graphql -F query=@src/demo.graphql -f owner="octokit" -f repo="graphql.js"
```

You can point the query flag to other graphql files, and change the parameters as you wish. However, this will mean some back and forth between [the GitHub GraphQL docs](https://docs.github.com/en/graphql/overview/public-schema) and your editor, so you might want to set up a richer IDE support.

## Step 2: IDE Setup

If you are using VSCode, it should prompt you to install the GraphQL syntax support and language server extensions. Otherwise, install the GraphQL extensions that seem appropriate for your editor.

You can download the latest version of [the GitHub schema](https://docs.github.com/public/fpt/schema.docs.graphql). Place it under `schema.docs.graphql`, where `graphql.config.ts` is configured to pick it up for IDE features such as autocomplete and type-checking.

Open `src/demo.graphql` and you should now have a full IDE experience. You can edit and keep developing with this and the GitHub CLI. Or, if you want to tinker with JavaScript/TypeSript, follow on to the next step.

## Step 3: Local TypeScript Setup

To use the TypeScript scripts, you will need Node 22 and pnpm. I recommend [nvm for managing your node distribution](https://github.com/nvm-sh/nvm).

In a shell, run:

```shell
nvm use
corepack enable
pnpm install
```

### Generate a GitHub token

While the GitHub CLI manages its own access tokens, you will need a separate one for any custom scripting and requests.

[Follow GitHub's documentation for generating a relevant acces
token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).
You can use either classic access tokens, or fine-grained ones, depending on the
scopes that you want to access. Remember to keep your tokens secure, and to give
them the narrowest scope/least privilege possible.

### Use the GitHub token

You can set the token as the `GH_TOKEN` environment variable prior to executing the script.

Alternatively, you can copy the example env into `.env`

```shell
cp .env.example .env
```

...then fill out `GH_TOKEN` in it:

```env
export GH_TOKEN=""
```

There are methods for keeping keys secure, without storing them in a file or lugging them around in shell history. For example, I use [1Password's secret reference feature](https://developer.1password.com/docs/cli/secret-references) to fill out environment variables on demand.

### Run the workbench script

The scripts under `src/workbench.ts` contain some scaffolding for making type-safe API requests. This works hand-in-hand with the `graphql-codegen` script.

While editing files actively, you will probably want to keep graphql-codegen running in watch mode, so that you get the correct parameter and return types for your queries:

```shell
pnpm codegen:watch
```

Finally, run the workbench script (one-off):

```shell
pnpm workbench
```

Or run the script in watch mode (do be mindful of API usage though):

```shell
pnpm workbench:watch
```
