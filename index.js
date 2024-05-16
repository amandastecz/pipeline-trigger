const github = require('@actions/github');
const core = require('@actions/core');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dispatchWorkflow(octokit, owner, repo, context) {
    try {
        const response = await octokit.rest.repos.createDispatchEvent({
            owner,
            repo,
            event_type: `Trigger Workflow from ${context.repo.owner}/${context.repo.repo}`,
            client_payload: { repository: context.repo.owner + "/" + context.repo.repo }
        });
        return response.status === 204;
    } catch (error) {
        console.error("Error dispatching workflow:", error);
        throw error;
    }
}

async function waitForWorkflowCompletion(octokit, owner, repo, context) {
    try {
        await sleep(30000);
        let status = null;
        let conclusion = null;

        const getRuns = await octokit.rest.actions.listWorkflowRunsForRepo({
            owner,
            repo,
            per_page: 1,
            page: 1
        });
        const runId = getRuns.data.workflow_runs[0].id;

        while (conclusion === null && status !== "completed") {
            const runResponse = await octokit.rest.actions.getWorkflowRun({
                owner,
                repo,
                run_id: runId,
            });
            conclusion = runResponse.data.conclusion;
            status = runResponse.data.status;
            if (status !== "completed") {
                await sleep(30000);
            }
        }
        return { status, conclusion };
    } catch (error) {
        console.error("Error waiting for workflow completion:", error);
        throw error;
    }
}

async function createComment(octokit, context, message) {
    try {
        await octokit.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: message
        });
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
}

async function run() {
    try {
        const token = core.getInput('pat-token', { required: true });
        const owner = core.getInput('owner', { required: true });
        const repo = core.getInput('repo', { required: true });
        const octokit = github.getOctokit(token);
        const context = github.context;
        if (await dispatchWorkflow(octokit, owner, repo, context)) {
            console.log("Workflow dispatch initiated successfully.");
            const { status, conclusion } = await waitForWorkflowCompletion(octokit, owner, repo, context);
            const message = `The workflow ends execution. Status: ${status}. Conclusion: ${conclusion}. See more information here: ${url}`;
            await createComment(octokit, context, message);
            console.log(`[Cross Repository Pipeline Trigger] 🚀: ${message}`);
            core.setOutput('message', message);
        } else {
            console.error("Failed to dispatch workflow.");
            core.setFailed("Failed to dispatch workflow.");
        }
    } catch (error) {
        console.error("An error occurred:", error);
        core.setFailed(error.message);
    }
}

run();