/**
 * Base service adapter interface that all service adapters must implement
 */
export interface ServiceAdapter {
    name: string;
    getIssues(params: any): Promise<any[]>;
    getRepositories(params: any): Promise<any[]>;
    createIssue(params: any): Promise<any>;
    // Generic method for custom operations
    executeQuery(query: string, variables?: Record<string, any>): Promise<any>;
  }
  
  export abstract class BaseServiceAdapter implements ServiceAdapter {
    abstract name: string;
    abstract getIssues(params: any): Promise<any[]>;
    abstract getRepositories(params: any): Promise<any[]>;
    abstract createIssue(params: any): Promise<any>;
    abstract executeQuery(query: string, variables?: Record<string, any>): Promise<any>;
  }
  