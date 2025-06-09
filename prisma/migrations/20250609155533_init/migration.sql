-- CreateTable
CREATE TABLE "job_posting" (
    "topic_id" BIGINT NOT NULL,
    "content" TEXT,
    "content2" TEXT,
    "content3" TEXT,
    "content5" TEXT,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "wechat" VARCHAR(50),
    "telegram" VARCHAR(50),
    "position_name" VARCHAR(100) NOT NULL,
    "position_id" BIGINT,
    "view_count" INTEGER DEFAULT 0,
    "applied" BOOLEAN DEFAULT false,
    "apply_count" INTEGER DEFAULT 0,
    "create_time" BIGINT,
    "url" TEXT,
    "work_type_id" INTEGER,
    "work_type_name" VARCHAR(50),
    "office_mode_id" INTEGER,
    "office_mode_name" VARCHAR(50),
    "company" VARCHAR(100) NOT NULL,
    "company_introduction" TEXT,
    "company_size_name" VARCHAR(50),
    "company_logo" TEXT,
    "company_website" TEXT,
    "company_id" BIGINT,
    "min_salary" DECIMAL(10,2),
    "max_salary" DECIMAL(10,2),
    "lever_id" INTEGER,
    "lever_name" VARCHAR(50),
    "location" VARCHAR(255),
    "base" VARCHAR(50),
    "ffrom" VARCHAR(50),
    "status" INTEGER DEFAULT 0,

    CONSTRAINT "job_posting_pkey" PRIMARY KEY ("topic_id")
);

-- CreateTable
CREATE TABLE "job_tag_relation" (
    "topic_id" BIGINT NOT NULL,
    "tag_id" BIGINT NOT NULL,
    "ffrom" VARCHAR(50),

    CONSTRAINT "job_tag_relation_pkey" PRIMARY KEY ("topic_id","tag_id")
);

-- CreateTable
CREATE TABLE "tag" (
    "tag_id" BIGINT NOT NULL,
    "tag_name" VARCHAR(100) NOT NULL,
    "ffrom" VARCHAR(50),

    CONSTRAINT "tag_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "user_info" (
    "id" BIGINT NOT NULL,
    "nickname" VARCHAR(255) NOT NULL,
    "avatar" TEXT,
    "small_avatar" TEXT,
    "topic_count" INTEGER DEFAULT 0,
    "comment_count" INTEGER DEFAULT 0,
    "fans_count" INTEGER DEFAULT 0,
    "follow_count" INTEGER DEFAULT 0,
    "score" INTEGER,
    "description" TEXT,
    "create_time" BIGINT,
    "wallet_address" VARCHAR(255),
    "ffrom" VARCHAR(50),
    "followed" BOOLEAN DEFAULT false,

    CONSTRAINT "user_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "nickname" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "weights" JSONB NOT NULL,
    "parsedRequirements" JSONB NOT NULL,
    "vectorMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeAnalysis" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "resumeContent" TEXT NOT NULL,
    "parsedResume" JSONB NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "skillScore" DOUBLE PRECISION NOT NULL,
    "experienceScore" DOUBLE PRECISION NOT NULL,
    "matchingPoints" JSONB NOT NULL,
    "suggestions" JSONB NOT NULL,
    "recommended" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResumeAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NFTProof" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nftType" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "mintedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NFTProof_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- AddForeignKey
ALTER TABLE "ResumeAnalysis" ADD CONSTRAINT "ResumeAnalysis_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTProof" ADD CONSTRAINT "NFTProof_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
