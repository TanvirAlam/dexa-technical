import { BaseServiceAdapter } from './baseService';

export class GitHubServiceAdapter extends BaseServiceAdapter {
  name = 'github';
  private token: string;
  private apiUrl = 'https://api.github.com/graphql';

  constructor(token: string) {
    super();
    this.token = token;
  }

  async getIssues({ owner, repo, limit = 10 }: { owner: string; repo: string; limit?: number }): Promise<any[]> {
    const query = `
      query($owner: String!, $repo: String!, $limit: Int!) {
        repository(owner: $owner, name: $repo) {
          issues(first: $limit) {
            nodes {
              id
              number
              title
              body
              state
              createdAt
              updatedAt
              author {
                login
              }
            }
          }
        }
      }
    `;

    const response = await this.executeQuery(query, { owner, repo, limit });
    return response.repository.issues.nodes.map((issue: any) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body,
      state: issue.state,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
      author: issue.author?.login,
      source: this.name,
    }));
  }

  async getRepositories({ owner, limit = 10 }: { owner: string; limit?: number }): Promise<any[]> {
    const query = `
      query($owner: String!, $limit: Int!) {
        user(login: $owner) {
          repositories(first: $limit) {
            nodes {
              id
              name
              description
              url
              stargazerCount
              forkCount
              createdAt
              updatedAt
            }
          }
        }
      }
    `;

    const response = await this.executeQuery(query, { owner, limit });
    return response.user.repositories.nodes.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.url,
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      createdAt: repo.createdAt,
      updatedAt: repo.updatedAt,
      source: this.name,
    }));
  }

  async createIssue({ owner, repo, title, body }: { owner: string; repo: string; title: string; body: string }): Promise<any> {
    const mutation = `
      mutation($input: CreateIssueInput!) {
        createIssue(input: $input) {
          issue {
            id
            number
            title
            body
            state
            createdAt
            updatedAt
          }
        }
      }
    `;

    const variables = {
      input: {
        repositoryId: await this.getRepositoryId(owner, repo),
        title,
        body,
      },
    };

    const response = await this.executeQuery(mutation, variables);
    const issue = response.createIssue.issue;
    
    return {
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body,
      state: issue.state,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
      source: this.name,
    };
  }

  async executeQuery(query: string, variables?: Record<string, any>): Promise<any> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GitHub API Error: ${JSON.stringify(data.errors)}`);
    }
    
    return data.data;
  }

  private async getRepositoryId(owner: string, repo: string): Promise<string> {
    const query = `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          id
        }
      }
    `;

    const response = await this.executeQuery(query, { owner, repo });
    return response.repository.id;
  }
}
