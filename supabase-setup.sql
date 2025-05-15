-- 启用pgvector扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建存储向量的表
CREATE TABLE job_vectors (
   id SERIAL PRIMARY KEY,
   job_id TEXT NOT NULL,
   type TEXT NOT NULL, -- 'skills', 'responsibilities', 或 'web3'
   embedding VECTOR(1536), -- 向量维度，如果使用OpenAI，是1536维
   metadata JSONB,
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 为job_id和type创建复合索引，以便快速查找
CREATE INDEX job_vectors_job_id_type_idx ON job_vectors (job_id, type);

-- 为向量创建HNSW索引以提高查询性能
CREATE INDEX job_vectors_embedding_idx ON job_vectors 
USING hnsw (embedding vector_cosine_ops);

-- 创建用于相似性搜索的函数
CREATE OR REPLACE FUNCTION match_job_vectors(
  query_embedding VECTOR(1536),
  job_id TEXT,
  vector_type TEXT,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
) RETURNS TABLE (
  id INT,
  job_id TEXT,
  type TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    job_vectors.id,
    job_vectors.job_id,
    job_vectors.type,
    job_vectors.metadata,
    1 - (job_vectors.embedding <=> query_embedding) AS similarity
  FROM job_vectors
  WHERE 
    (job_id IS NULL OR job_vectors.job_id = job_id) AND
    (vector_type IS NULL OR job_vectors.type = vector_type) AND
    (1 - (job_vectors.embedding <=> query_embedding)) > match_threshold
  ORDER BY job_vectors.embedding <=> query_embedding
  LIMIT match_count;
END;
$$; 