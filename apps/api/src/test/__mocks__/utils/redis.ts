import { jest } from '@jest/globals';

// 定义redis mock的类型，避免类型推断错误
interface RedisMock {
  get: jest.MockedFunction<() => Promise<null>>;
  set: jest.MockedFunction<() => Promise<string>>;
  flushall: jest.MockedFunction<() => Promise<string>>;
  quit: jest.MockedFunction<() => Promise<string>>;
}

const redisMock: RedisMock = {
  get: jest.fn(() => Promise.resolve(null)),
  set: jest.fn(() => Promise.resolve('OK')),
  flushall: jest.fn(() => Promise.resolve('OK')),
  quit: jest.fn(() => Promise.resolve('OK')),
};

export default redisMock; 