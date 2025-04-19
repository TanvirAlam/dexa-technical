import { serviceFactory } from '../services/serviceFactory';
import { GraphQLScalarType } from 'graphql';

// Define JSON scalar type
const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast: any) {
    return ast.value;
  },
});

export const resolvers = {
  JSON: JSONScalar,
  
  Query: {
    // GitHub specific queries
    githubIssues: async (_: any, { owner, repo, limit }: { owner: string; repo: string; limit?: number }) => {
      const github = serviceFactory.getService('github');
      return github.getIssues({ owner, repo, limit });
    },
    
    githubRepositories: async (_: any, { owner, limit }: { owner: string; limit?: number }) => {
      const github = serviceFactory.getService('github');
      return github.getRepositories({ owner, limit });
    },
    
    // GitLab specific queries
    gitlabIssues: async (_: any, { projectId, limit }: { projectId: string; limit?: number }) => {
      const gitlab = serviceFactory.getService('gitlab');
      return gitlab.getIssues({ projectId, limit });
    },
    
    gitlabRepositories: async (_: any, { userId, limit }: { userId?: string; limit?: number }) => {
      const gitlab = serviceFactory.getService('gitlab');
      return gitlab.getRepositories({ userId, limit });
    },
    
    // Aggregated queries
    allIssues: async (_: any, { limit = 10 }: { limit?: number }) => {
      const services = serviceFactory.getAllServices();
      const allIssuesPromises = services.map(async (service) => {
        try {
          // This is a simplified implementation
          // In a real application, you would need to handle the different parameters for each service
          if (service.name === 'github') {
            return service.getIssues({ owner: 'dummy-owner', repo: 'dummy-repo', limit });
          } else if (service.name === 'gitlab') {
            return service.getIssues({ projectId: 'dummy-project-id', limit });
          }
          return [];
        } catch (error) {
          console.error(`Error fetching issues from ${service.name}:`, error);
          return [];
        }
      });
      
      const issuesArrays = await Promise.all(allIssuesPromises);
      return issuesArrays.flat();
    },
    
    allRepositories: async (_: any, { limit = 10 }: { limit?: number }) => {
      const services = serviceFactory.getAllServices();
      const allReposPromises = services.map(async (service) => {
        try {
          // This is a simplified implementation
          if (service.name === 'github') {
            return service.getRepositories({ owner: 'dummy-owner', limit });
          } else if (service.name === 'gitlab') {
            return service.getRepositories({ limit });
          }
          return [];
        } catch (error) {
          console.error(`Error fetching repositories from ${service.name}:`, error);
          return [];
        }
      });
      
      const reposArrays = await Promise.all(allReposPromises);
      return reposArrays.flat();
    },
    
    // Generic query for custom operations
    executeQuery: async (_: any, { service, query, variables }: { service: string; query: string; variables?: Record<string, any> }) => {
      const serviceAdapter = serviceFactory.getService(service);
      return serviceAdapter.executeQuery(query, variables);
    },
  },
  
  Mutation: {
    // GitHub specific mutations
    createGithubIssue: async (_: any, { owner, repo, input }: { owner: string; repo: string; input: { title: string; body: string } }) => {
      const github = serviceFactory.getService('github');
      return github.createIssue({ owner, repo, title: input.title, body: input.body });
    },
    
    // GitLab specific mutations
    createGitlabIssue: async (_: any, { projectId, input }: { projectId: string; input: { title: string; body: string } }) => {
      const gitlab = serviceFactory.getService('gitlab');
      return gitlab.createIssue({ projectId, title: input.title, description: input.body });
    },
  },
};
