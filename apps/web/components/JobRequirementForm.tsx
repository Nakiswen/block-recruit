'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from 'ui';

interface JobPosition {
  title: string;
  level: 'junior' | 'mid' | 'senior';
}

interface JobRequirementFormProps {
  defaultPositions: JobPosition[];
  onChange: (requirements: any) => void;
  initialValues?: any;
}

const JobRequirementForm: React.FC<JobRequirementFormProps> = ({
  defaultPositions,
  onChange,
  initialValues = {
    title: '',
    level: 'mid',
    skills: { required: [], preferred: [] },
    experience: { minYears: 2, requiredFields: [] },
  },
}) => {
  const [selectedPosition, setSelectedPosition] = useState('');
  const [customPosition, setCustomPosition] = useState('');
  const [experienceYears, setExperienceYears] = useState(initialValues.experience.minYears);
  const [level, setLevel] = useState(initialValues.level);
  const [requiredSkills, setRequiredSkills] = useState<string>(initialValues.skills.required.join(', '));
  const [preferredSkills, setPreferredSkills] = useState<string>(initialValues.skills.preferred.join(', '));
  const [requiredFields, setRequiredFields] = useState<string>(initialValues.experience.requiredFields.join(', '));
  const [isCustom, setIsCustom] = useState(false);
  
  // 使用useRef来存储最新的状态，避免闭包陷阱
  const stateRef = useRef({
    requiredSkills,
    preferredSkills,
    experienceYears,
    requiredFields,
    customPosition,
    level,
    isCustom
  });

  // 更新ref的值
  useEffect(() => {
    stateRef.current = {
      requiredSkills,
      preferredSkills,
      experienceYears,
      requiredFields,
      customPosition,
      level,
      isCustom
    };
  }, [requiredSkills, preferredSkills, experienceYears, requiredFields, customPosition, level, isCustom]);

  // 预定义的Web3相关技能
  const suggestedSkills = [
    'Solidity', 'Rust', 'Smart Contracts', 'EVM', 'Layer 2', 
    'Web3.js', 'ethers.js', 'React', 'DeFi', 'NFT', 'DAO',
    'Gas Optimization', 'MetaMask', 'Hardhat', 'Truffle',
    'Security Auditing', 'Consensus Mechanisms'
  ];

  // Web3相关的经验领域
  const suggestedFields = [
    'DeFi', 'NFT', 'DAO', 'Layer 1', 'Layer 2', 'DEX',
    'Lending Protocols', 'Gaming', 'Cross-chain', 'Wallets',
    'Infrastructure', 'Security'
  ];

  // 使用useCallback优化函数
  const handleCustomChange = useCallback(() => {
    const { isCustom, customPosition, selectedPosition, level, requiredSkills, preferredSkills, experienceYears, requiredFields } = stateRef.current;
    
    const title = isCustom ? customPosition : selectedPosition;
    const requirements = {
      title,
      level,
      skills: {
        required: requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        preferred: preferredSkills.split(',').map(s => s.trim()).filter(s => s),
      },
      experience: {
        minYears: experienceYears,
        requiredFields: requiredFields.split(',').map(s => s.trim()).filter(s => s),
      },
    };
    onChange(requirements);
  }, [onChange]);

  // 当选择预定义职位时更新表单
  useEffect(() => {
    if (selectedPosition && !isCustom) {
      // 模拟根据职位获取相关技能和要求
      let skillsRequired: string[] = [];
      let skillsPreferred: string[] = [];
      let yearsRequired = 2;
      let fieldsRequired: string[] = [];
      let positionLevel = 'mid';

      // 根据不同职位设置不同的要求
      switch (selectedPosition) {
        case '智能合约开发工程师':
          skillsRequired = ['Solidity', 'Smart Contracts', 'EVM'];
          skillsPreferred = ['Gas Optimization', 'Security Auditing', 'DeFi'];
          fieldsRequired = ['智能合约开发', 'DeFi'];
          break;
        case '区块链前端开发工程师':
          skillsRequired = ['React', 'Web3.js', 'ethers.js'];
          skillsPreferred = ['TypeScript', 'MetaMask', 'WalletConnect'];
          fieldsRequired = ['前端开发', 'DApp'];
          break;
        case '区块链安全分析师':
          skillsRequired = ['Smart Contracts', 'Security Auditing', 'Solidity'];
          skillsPreferred = ['Static Analysis', 'Formal Verification'];
          fieldsRequired = ['安全审计', 'DeFi'];
          yearsRequired = 3;
          positionLevel = 'senior';
          break;
        case '密码学研究员':
          skillsRequired = ['Cryptography', 'Zero-Knowledge Proofs', 'Consensus Algorithms'];
          skillsPreferred = ['Privacy Tech', 'Formal Verification'];
          fieldsRequired = ['密码学', '研究'];
          yearsRequired = 4;
          positionLevel = 'senior';
          break;
        case 'Web3产品经理':
          skillsRequired = ['Product Management', 'DeFi', 'Tokenomics'];
          skillsPreferred = ['DAO', 'NFT', 'Community Building'];
          fieldsRequired = ['产品管理', 'Web3'];
          break;
      }

      setRequiredSkills(skillsRequired.join(', '));
      setPreferredSkills(skillsPreferred.join(', '));
      setExperienceYears(yearsRequired);
      setRequiredFields(fieldsRequired.join(', '));
      setLevel(positionLevel as any);

      // 使用setTimeout避免State更新还未完成就调用onChange
      const timer = setTimeout(() => {
        onChange({
          title: selectedPosition,
          level: positionLevel,
          skills: {
            required: skillsRequired,
            preferred: skillsPreferred,
          },
          experience: {
            minYears: yearsRequired,
            requiredFields: fieldsRequired,
          },
        });
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [selectedPosition, isCustom, onChange]);

  // 当自定义字段变化时更新要求，使用防抖处理
  useEffect(() => {
    if (!isCustom) return;
    
    const timer = setTimeout(() => {
      handleCustomChange();
    }, 300);

    return () => clearTimeout(timer);
  }, [customPosition, level, requiredSkills, preferredSkills, experienceYears, requiredFields, isCustom, handleCustomChange]);

  // 添加推荐技能，使用useCallback优化函数
  const addSuggestedSkill = useCallback((skill: string, type: 'required' | 'preferred') => {
    if (type === 'required') {
      setRequiredSkills(prevSkills => {
        const skills = prevSkills ? prevSkills.split(',').map(s => s.trim()) : [];
        if (!skills.includes(skill)) {
          return prevSkills ? `${prevSkills}, ${skill}` : skill;
        }
        return prevSkills;
      });
      setIsCustom(true);
    } else {
      setPreferredSkills(prevSkills => {
        const skills = prevSkills ? prevSkills.split(',').map(s => s.trim()) : [];
        if (!skills.includes(skill)) {
          return prevSkills ? `${prevSkills}, ${skill}` : skill;
        }
        return prevSkills;
      });
      setIsCustom(true);
    }
  }, []);

  // 添加推荐领域，使用useCallback优化函数
  const addSuggestedField = useCallback((field: string) => {
    setRequiredFields(prevFields => {
      const fields = prevFields ? prevFields.split(',').map(s => s.trim()) : [];
      if (!fields.includes(field)) {
        return prevFields ? `${prevFields}, ${field}` : field;
      }
      return prevFields;
    });
    setIsCustom(true);
  }, []);

  // 处理职位选择变更
  const handlePositionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPosition(value);
    setIsCustom(value === 'custom');
  }, []);

  // 处理自定义职位名称变更
  const handleCustomPositionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomPosition(e.target.value);
    setIsCustom(true);
  }, []);

  // 处理职位级别变更
  const handleLevelChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(e.target.value as any);
    setIsCustom(true);
  }, []);

  // 处理必备技能变更
  const handleRequiredSkillsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRequiredSkills(e.target.value);
    setIsCustom(true);
  }, []);

  // 处理加分技能变更
  const handlePreferredSkillsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPreferredSkills(e.target.value);
    setIsCustom(true);
  }, []);

  // 处理经验年限变更
  const handleExperienceYearsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExperienceYears(parseInt(e.target.value, 10) || 0);
    setIsCustom(true);
  }, []);

  // 处理相关领域变更
  const handleRequiredFieldsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRequiredFields(e.target.value);
    setIsCustom(true);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">选择职位</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          value={selectedPosition}
          onChange={handlePositionChange}
        >
          <option value="">-- 选择职位 --</option>
          {defaultPositions.map((position) => (
            <option key={position.title} value={position.title}>
              {position.title} ({position.level === 'junior' ? '初级' : position.level === 'mid' ? '中级' : '高级'})
            </option>
          ))}
          <option value="custom">自定义职位</option>
        </select>
      </div>

      {selectedPosition === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">自定义职位名称</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={customPosition}
            onChange={handleCustomPositionChange}
            placeholder="例如：区块链开发工程师"
          />
        </div>
      )}

      {(selectedPosition || customPosition) && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">职位级别</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={level}
              onChange={handleLevelChange}
            >
              <option value="junior">初级</option>
              <option value="mid">中级</option>
              <option value="senior">高级</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">必备技能</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              value={requiredSkills}
              onChange={handleRequiredSkillsChange}
              placeholder="输入必备技能，用逗号分隔"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestedSkills.slice(0, 8).map((skill) => (
                <span
                  key={skill}
                  className="inline-block px-2 py-1 bg-gray-100 text-xs rounded-full cursor-pointer hover:bg-gray-200"
                  onClick={() => addSuggestedSkill(skill, 'required')}
                >
                  + {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">加分技能</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              value={preferredSkills}
              onChange={handlePreferredSkillsChange}
              placeholder="输入加分技能，用逗号分隔"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestedSkills.slice(8, 16).map((skill) => (
                <span
                  key={skill}
                  className="inline-block px-2 py-1 bg-gray-100 text-xs rounded-full cursor-pointer hover:bg-gray-200"
                  onClick={() => addSuggestedSkill(skill, 'preferred')}
                >
                  + {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">最低经验年限</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={experienceYears}
              onChange={handleExperienceYearsChange}
              min="0"
              max="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">相关领域经验</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              value={requiredFields}
              onChange={handleRequiredFieldsChange}
              placeholder="输入相关领域，用逗号分隔"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestedFields.slice(0, 8).map((field) => (
                <span
                  key={field}
                  className="inline-block px-2 py-1 bg-gray-100 text-xs rounded-full cursor-pointer hover:bg-gray-200"
                  onClick={() => addSuggestedField(field)}
                >
                  + {field}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JobRequirementForm; 