class GitService {
    constructor(repoOwner, repoName, apiKey) {
        this.repoOwner = repoOwner;
        this.repoName = repoName;
        this.apiKey = apiKey;
    }

    async makeRequest(method, apiUrl, body = {}){
        const response = await fetch(apiUrl, {
            method,
            headers: {
               'Authorization': `token ${this.apiKey}`,
            },
            body: (method === 'GET' || method === 'HEAD') ? null : JSON.stringify ({ body }),
        });
        const data = await response.json();
        if (data.message === 'Bad credentials') {
            throw new Error(data.message);
        }
        return data;
    }

    async fetchIssues() {
        const url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/issues`;
        const issuesResponse = await this.makeRequest('GET', url);
        return issuesResponse;
    }

    async fetchIssueComments(issue) {
        const url = issue.comments_url;
        const issueComments = await this.makeRequest('GET', url, {});
        return issueComments;
    }

    async addComment(issue, comment) {
        const url = issue.comments_url;
        await this.makeRequest('POST', url, comment); 
    }
}
