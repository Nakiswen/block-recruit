/**
 * API 生成配置文件的类型声明
 */
declare const config: {
  input: string;
  output: string;
  client: string;
  name: string;
  useOptions: boolean;
  useUnionTypes: boolean;
  exportSchemas: boolean;
  exportServices: boolean;
  indent: number;
  postfixServices: string;
  postfixModels: string;
  request: string;
  httpClient: string;
};

export = config;
