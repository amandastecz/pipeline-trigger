# Cross Repository Pipeline Trigger Action

## Description

The Cross Repository Pipeline Trigger Action is a GitHub Action that allows you to initiate a workflow in a different repository (target repo) and automatically post the workflow execution results in the original repository's pull request comments.

## Inputs

### Required Inputs

- `pat-token`: Personal Access Token (PAT) within the secrets of the repository initiating the workflow.
- `owner`: Owner of the target repository where the workflow will be triggered.
- `repo`: Name of the target pepository where the workflow will be triggered.

## Outputs
- `message`:  Message within the original repository containing the workflow results of the target repository.

## Example Usage

Setup this yml file within the origin repository, which means the repository who wants to trigger another one:

```yaml
name: Origin Repository Workflow

on:
  pull_request:
    branches:
      - main

jobs:
  cross-repo-pipeline:
    runs-on: ubuntu-latest
    steps: #here starts the action's setup
      - name: cross-repo-pipeline-trigger
        uses: amandastecz/pipeline-trigger@v1.1
        with:
          pat-token: ${{ secrets.PAT_TOKEN }} # add a secret called PAT_TOKEN
          owner: target-owner #changeme
          repo: target-repo #changeme
```

Inside the yml file of the target repository, please enable the "repository_dispatch" event, example:

```yml
name: Target Repository Workflow
on:
  pull_request:
    branches:
      - main
  workflow_dispatch:
  repository_dispatch: #add this
jobs:
  test: ...
```


## Secrets

This action uses the following secrets:

- `PAT_TOKEN`: Personal Access Token (PAT) classic.

### Personal Access Token (PAT)

1. Create a `PAT Token` (classic) by [following the GitHub instructions](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic).
2. Select the necessary scopes for the personal token:
- [X] repo - full control of private repositories
- [X] workflow - update GitHub Action workflows
- [X] admin:repo_hook - full control of repository hooks
3. Add the `PAT_TOKEN` as a secret in the original repository. [Follow the GitHub instructions.](https://docs.github.com/pt/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository)