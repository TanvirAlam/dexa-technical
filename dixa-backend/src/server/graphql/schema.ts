import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Issue {
    id: ID!
    number: Int!
    title: String!
    body: String
    state: String!
    createdAt: String!
    updatedAt: String!
    author: String
    source: String!
  }

  type Repository {
    id: ID!
    name: String!
    description: String
    url: String!
    stars: Int
    forks: Int
    createdAt: String!
    updatedAt: String!
    source: String!
  }

  input IssueInput {
    title: String!
    body: String!
  }

  type Query {
    # GitHub specific queries
    githubIssues(owner: String!, repo: String!, limit: Int): [Issue!]!
    githubRepositories(owner: String!, limit: Int): [Repository!]!
    
    # GitLab specific queries
    gitlabIssues(projectId: ID!, limit: Int): [Issue!]!
    gitlabRepositories(userId: ID, limit: Int): [Repository!]!
    
    # Aggregated queries
    allIssues(limit: Int): [Issue!]!
    allRepositories(limit: Int): [Repository!]!
    
    # Generic query for custom operations
    executeQuery(service: String!, query: String!, variables: JSON): JSON
  }

  type Mutation {
    # GitHub specific mutations
    createGithubIssue(owner: String!, repo: String!, input: IssueInput!): Issue!
    
    # GitLab specific mutations
    createGitlabIssue(projectId: ID!, input: IssueInput!): Issue!
  }

  scalar JSON
`;
