# Cross Repository Pipeline Trigger Action

## Description

The Cross Repository Pipeline Trigger Action is a GitHub Action that allows you to initiate a workflow in a different repository and automatically post the execution results in the associated pull request comments.

## Inputs

### Required Inputs

- `pat-token`: Personal Access Token (PAT) for the repository initiating the workflow.
- `owner`: Owner of the repository where the workflow will be triggered.
- `repo`: Repository where the workflow will be triggered.

### Outputs

- `message`: Result of the pipeline execution.

## Secrets

This action uses the following secrets:

- `PAT_TOKEN`: Personal Access Token (PAT) for the repository initiating the workflow.

## Example Usage

```yaml
name: Trigger Cross Repository Pipeline

on:
  pull_request:
    branches:
      - main
      - qa

jobs:
  cross-repo-pipeline:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Pipeline in Another Repository
        uses: action-username/action-repo@v1
        with:
          pat-token: ${{ secrets.PAT_TOKEN }}
          owner: 'owner'
          repo: 'target-repo'
```