import { BaseServiceAdapter } from './baseService';

export class GitLabServiceAdapter extends BaseServiceAdapter {
  name = 'gitlab';
  private token: string;
  private apiUrl = 'https://gitlab.com/api/v4';

  constructor(token: string) {
    super();
    this.token = token;
  }

  async getIssues({ projectId, limit = 10 }: { projectId: string | number; limit?: number }): Promise<any[]> {
    const url = `${this.apiUrl}/projects/${encodeURIComponent(projectId)}/issues?per_page=${limit}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    const issues = await response.json();
    
    if (!Array.isArray(issues)) {
      throw new Error(`GitLab API Error: ${JSON.stringify(issues)}`);
    }
    
    return issues.map((issue: any) => ({
      id: issue.id.toString(),
      number: issue.iid,
      title: issue.title,
      body: issue.description,
      state: issue.state,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      author: issue.author?.username,
      source: this.name,
    }));
  }

  async getRepositories({ userId, limit = 10 }: { userId?: string | number; limit?: number }): Promise<any[]> {
    const url = userId 
      ? `${this.apiUrl}/users/${encodeURIComponent(userId)}/projects?per_page=${limit}`
      : `${this.apiUrl}/projects?per_page=${limit}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    const repos = await response.json();
    
    if (!Array.isArray(repos)) {
      throw new Error(`GitLab API Error: ${JSON.stringify(repos)}`);
    }
    
    return repos.map((repo: any) => ({
      id: repo.id.toString(),
      name: repo.name,
      description: repo.description,
      url: repo.web_url,
      stars: repo.star_count,
      forks: repo.forks_count,
      createdAt: repo.created_at,
      updatedAt: repo.last_activity_at,
      source: this.name,
    }));
  }

  async createIssue({ projectId, title, description }: { projectId: string | number; title: string; description: string }): Promise<any> {
    const url = `${this.apiUrl}/projects/${encodeURIComponent(projectId)}/issues`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    const issue = await response.json();
    
    if (issue.error) {
      throw new Error(`GitLab API Error: ${JSON.stringify(issue)}`);
    }
    
    return {
      id: issue.id.toString(),
      number: issue.iid,
      title: issue.title,
      body: issue.description,
      state: issue.state,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      author: issue.author?.username,
      source: this.name,
    };
  }

  async executeQuery(query: string, variables?: Record<string, any>): Promise<any> {
    // GitLab doesn't have a native GraphQL API like GitHub
    // This is a simplified implementation that would need to be expanded
    // based on the specific query needs
    
    if (query.includes('getIssues')) {
      return this.getIssues(variables as any);
    } else if (query.includes('getRepositories')) {
      return this.getRepositories(variables as any);
    } else if (query.includes('createIssue')) {
      return this.createIssue(variables as any);
    }
    
    throw new Error(`Unsupported query for GitLab: ${query}`);
  }
}
