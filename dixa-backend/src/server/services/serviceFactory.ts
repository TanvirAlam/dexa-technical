import { ServiceAdapter } from './baseService';
import { GitHubServiceAdapter } from './githubService';
import { GitLabServiceAdapter } from './gitlabService';

export class ServiceFactory {
  private services: Map<string, ServiceAdapter> = new Map();

  constructor() {
    // Initialize with dummy credentials
    // In a real application, these would be loaded from environment variables or a secure store
    this.registerGitHub('ghp_dummyGitHubToken123456789abcdefghijklmno');
    this.registerGitLab('glpat-dummyGitLabToken123456789abcdefghijklmno');
  }

  registerGitHub(token: string): void {
    this.services.set('github', new GitHubServiceAdapter(token));
  }

  registerGitLab(token: string): void {
    this.services.set('gitlab', new GitLabServiceAdapter(token));
  }

  registerService(name: string, service: ServiceAdapter): void {
    this.services.set(name, service);
  }

  getService(name: string): ServiceAdapter {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service;
  }

  getAllServices(): ServiceAdapter[] {
    return Array.from(this.services.values());
  }
}

// Create a singleton instance
export const serviceFactory = new ServiceFactory();
