// 客户端安全API
export * from './src/api';
export * from './src/types';
export * from './src/utils';

// 仅服务器端组件 - 确保这些只在服务器端使用
export { Web3KnowledgeManager } from './src/knowledge-manager';
export * from './src/resume-evaluator'; 