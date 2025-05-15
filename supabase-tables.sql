-- 启用pgvector扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建职位向量表
CREATE TABLE IF NOT EXISTS job_vectors (
   id SERIAL PRIMARY KEY,
   job_id TEXT NOT NULL UNIQUE,
   description_vector VECTOR(1536),
   requirements_vector VECTOR(1536),
   responsibilities_vector VECTOR(1536),
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建简历向量表
CREATE TABLE IF NOT EXISTS resume_vectors (
   id SERIAL PRIMARY KEY,
   resume_id TEXT NOT NULL UNIQUE,
   skills_vector VECTOR(1536),
   experience_vector VECTOR(1536),
   web3_vector VECTOR(1536),
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS job_vectors_job_id_idx ON job_vectors (job_id);
CREATE INDEX IF NOT EXISTS resume_vectors_resume_id_idx ON resume_vectors (resume_id);

-- 创建向量比较函数
CREATE OR REPLACE FUNCTION cosine_similarity(a VECTOR, b VECTOR)
RETURNS FLOAT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 1 - (a <=> b);
END;
$$; 