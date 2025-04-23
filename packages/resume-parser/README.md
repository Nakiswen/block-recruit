# 简历解析器（Resume Parser）

这个包提供了解析各种格式简历文件的功能，支持 PDF、DOCX 和纯文本格式。解析后的结构化数据可用于招聘流程中的筛选、匹配和评估。

## 功能特点

- 支持多种文件格式：PDF、DOCX、TXT
- 提取关键个人信息：姓名、联系方式等
- 识别工作经验、教育背景、技能等结构化信息
- 可靠的布局分析，提高信息提取准确性
- 与评估引擎集成，实现职位匹配分析

## 实现原理

### PDF 解析

PDF 解析使用 `pdfjs-dist` 库提取文本内容，并通过以下步骤处理：

1. 加载 PDF 文档并获取页面内容
2. 按照空间布局（x, y 坐标）对文本进行排序和分组
3. 重建文本行和段落，保留原始结构
4. 对提取的文本进行预处理，识别标题、章节和关键信息
5. 将处理后的文本传递给通用文本解析器进行结构化信息提取

### DOCX 解析

DOCX 解析使用 `mammoth` 库提取格式化内容，处理步骤如下：

1. 将 DOCX 文件转换为 HTML，保留原始文档的格式和结构
2. 自定义转换规则，确保保留标题、列表、表格等关键元素
3. 从 HTML 中提取结构化文本，保持语义和层次
4. 对提取的文本进行预处理，识别关键信息和格式
5. 将处理后的文本传递给通用文本解析器

### 文本解析

文本解析是所有格式解析的核心模块，它包括：

1. 识别文档章节（工作经验、教育、技能等）
2. 提取个人信息（姓名、电话、邮箱等）
3. 解析工作经历（公司、职位、时间段）
4. 识别教育背景（学校、学位、专业）
5. 提取技能列表和项目经验

## 使用方法

```typescript
import { parseResume } from 'resume-parser';

// 解析简历文件
const handleResumeUpload = async (file: File) => {
  const result = await parseResume(file);
  
  if (result.error) {
    console.error('解析失败:', result.error);
    return;
  }
  
  // 使用解析后的数据
  const resumeData = result.data;
  console.log('个人信息:', resumeData.personalInfo);
  console.log('技能:', resumeData.skills);
  console.log('工作经验:', resumeData.workExperience);
  // ...
};
```

## 依赖项

- `pdfjs-dist`: PDF 文件解析
- `mammoth`: DOCX 文件解析

## 注意事项

- PDF 解析需要在浏览器环境中运行
- 简历格式多样，解析结果可能需要进一步处理或验证
- 中英文简历均已支持，但复杂格式和非标准简历可能需要优化 