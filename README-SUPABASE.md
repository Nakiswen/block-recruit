# Supabase设置指南

## 1. 获取Supabase凭证

1. 登录[Supabase控制台](https://app.supabase.io/)
2. 选择你的项目 (如果没有，创建一个新项目)
3. 找到并复制以下凭证:
   - **Project URL**: 在"设置" > "API" > "URL"下
   - **API Keys**:
     - **anon/public**: 在"设置" > "API" > "Project API keys"下
     - **service_role**: 在同一位置，具有更高权限

## 2. 设置环境变量

创建或编辑项目根目录下的`.env.local`文件:

```
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
SUPABASE_SERVICE_ROLE_KEY=你的service_role密钥
SUPABASE_ANON_KEY=你的anon/public密钥
OPENROUTER_API_KEY=你的OpenRouter API密钥
```

## 3. 创建数据库表

1. 在Supabase控制台，进入"SQL编辑器"
2. 复制`supabase-tables.sql`文件中的SQL代码
3. 粘贴到SQL编辑器中并执行

或者，使用Supabase CLI直接从终端执行:

```bash
supabase db execute -f supabase-tables.sql
```

## 4. 安装pgvector扩展

如果你使用的是Supabase云服务，pgvector扩展已预先安装。如果使用本地开发：

1. 在"数据库" > "扩展"中，搜索"vector"
2. 启用pgvector扩展

## 5. 验证设置

执行以下查询来验证表是否创建成功:

```sql
SELECT * FROM pg_tables WHERE tablename IN ('job_vectors', 'resume_vectors');
```

应该看到两个表的记录。

## 故障排除

- **表不存在错误**: 确保你已经正确执行了SQL脚本
- **向量操作错误**: 确保pgvector扩展已启用
- **连接错误**: 检查环境变量是否正确设置 