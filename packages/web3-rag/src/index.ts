// Web3 RAG (Retrieval Augmented Generation) Module
// Main exports for the Web3 knowledge base and related functionality

// Export the knowledge manager
export { Web3KnowledgeManager } from './knowledge-manager';

// Export types
export * from './types';

// Export embedding functions
export { embedText, mockEmbedding, simplifiedEmbedding } from './embeddings';

// Export Web3 resume evaluator
export { Web3ResumeEvaluator } from './resume-evaluator';

// Export the Web3 skills data and functions
export { 
  web3KnowledgeData,
  setupWeb3KnowledgeBase,
  queryRelevantSkills,
  extractWeb3Skills
} from './knowledge-data'; 