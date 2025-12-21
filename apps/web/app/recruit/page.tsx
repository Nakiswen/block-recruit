'use client';

import { Form, Input, Select, Button, InputNumber, message, Card } from 'antd';
import {
  RiseOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  FileTextOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  BankOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { jobServices } from '../../lib/api';

const { TextArea } = Input;
const { Option } = Select;

export default function RecruitPage() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values: any) => {
    try {
      // 构建接口所需的数据结构
      const apiData = {
        positionName: values.positionName,
        company: values.company,
        description: values.description || '',
        responsibilities: values.responsibilities || '',
        requirements: values.requirements || '',
        benefits: values.benefits || '',
        minSalary: values.minSalary ? Number(values.minSalary) : undefined,
        maxSalary: values.maxSalary ? Number(values.maxSalary) : undefined,
        location: values.location || '',
        workTypeName: values.workTypeName || '',
        officeModeName: values.officeModeName || '',
        leverName: values.leverName || '',
        companyIntroduction: values.companyIntroduction || '',
        companyWebsite: values.companyWebsite || '',
        email: values.email || '',
        phone: values.phone || '',
        tags: values.tags || [],
      };

      // 调用uploadJob接口
      const response = await jobServices.uploadJob(apiData);

      if (response.code === 200 || response.code === 0) {
        messageApi.success('招聘信息发布成功！');
        form.resetFields();
      } else {
        messageApi.error('发布失败');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      messageApi.error(error.response?.data?.message || error.message || '发布失败，请重试');
    }
  };

  return (
    <div className="min-h-screen from-background via-background to-muted/20 py-12 px-4">
      {contextHolder}
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-6 px-6 py-4 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-2xl border border-primary/20 shadow-sm">
            <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <RiseOutlined
                className="h-7 w-7 text-primary-foreground"
                style={{ fontSize: '28px' }}
              />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-foreground text-balance">发布招聘信息</h1>
              <p className="text-muted-foreground mt-1 text-lg">
                填写职位信息，吸引优秀人才加入团队
              </p>
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-border/50 rounded-2xl overflow-hidden">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            requiredMark="optional"
            className="p-8"
          >
            {/* 基本信息 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-primary/20">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileTextOutlined className="h-5 w-5 text-primary" style={{ fontSize: '20px' }} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">基本信息</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Form.Item
                  label={<span className="text-base font-semibold">职位名称</span>}
                  name="positionName"
                  rules={[{ required: true, message: '请输入职位名称' }]}
                >
                  <Input size="large" placeholder="如：高级前端工程师" className="rounded-lg" />
                </Form.Item>

                <Form.Item
                  label={<span className="text-base font-semibold">公司名称</span>}
                  name="company"
                  rules={[{ required: true, message: '请输入公司名称' }]}
                >
                  <Input size="large" placeholder="请输入公司全称" className="rounded-lg" />
                </Form.Item>
              </div>
            </div>

            {/* 工作信息 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-accent/20">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <EnvironmentOutlined
                    className="h-5 w-5 text-accent"
                    style={{ fontSize: '20px' }}
                  />
                </div>
                <h2 className="text-2xl font-bold text-foreground">工作信息</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Form.Item
                  label={<span className="text-base font-semibold">工作地点</span>}
                  name="location"
                  rules={[{ required: true, message: '请输入工作地点' }]}
                >
                  <Input size="large" placeholder="如：北京、上海、远程" className="rounded-lg" />
                </Form.Item>

                <Form.Item
                  label={<span className="text-base font-semibold">工作类型</span>}
                  name="workTypeName"
                  rules={[{ required: true, message: '请选择工作类型' }]}
                >
                  <Select size="large" placeholder="选择类型" className="rounded-lg">
                    <Option value="全职">全职</Option>
                    <Option value="兼职">兼职</Option>
                    <Option value="实习">实习</Option>
                    <Option value="合同">合同</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<span className="text-base font-semibold">办公模式</span>}
                  name="officeModeName"
                  rules={[{ required: true, message: '请选择办公模式' }]}
                >
                  <Select size="large" placeholder="选择办公模式" className="rounded-lg">
                    <Option value="办公室">办公室</Option>
                    <Option value="远程">远程</Option>
                    <Option value="混合">混合</Option>
                    <Option value="灵活">灵活</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<span className="text-base font-semibold">级别</span>}
                  name="leverName"
                  rules={[{ required: true, message: '请选择级别' }]}
                >
                  <Select size="large" placeholder="选择级别" className="rounded-lg">
                    <Option value="初级">初级</Option>
                    <Option value="中级">中级</Option>
                    <Option value="高级">高级</Option>
                    <Option value="专家">专家</Option>
                    <Option value="管理">管理</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            {/* 薪资福利 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-primary/20">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <DollarOutlined className="h-5 w-5 text-primary" style={{ fontSize: '20px' }} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">薪资福利</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Form.Item
                  label={<span className="text-base font-semibold">薪资范围（月薪/元）</span>}
                >
                  <div className="flex items-center gap-2">
                    <Form.Item
                      name="minSalary"
                      rules={[{ required: true, message: '请输入最低薪资' }]}
                      className="mb-0 flex-1"
                    >
                      <InputNumber
                        size="large"
                        min={0}
                        placeholder="最低"
                        className="w-full rounded-l-lg rounded-r-none"
                      />
                    </Form.Item>

                    <div className="px-3 text-gray-400">~</div>

                    <Form.Item
                      name="maxSalary"
                      rules={[{ required: true, message: '请输入最高薪资' }]}
                      className="mb-0 flex-1"
                    >
                      <InputNumber
                        size="large"
                        min={0}
                        placeholder="最高"
                        className="w-full rounded-r-lg rounded-l-none"
                      />
                    </Form.Item>
                  </div>
                </Form.Item>

                <Form.Item
                  label={<span className="text-base font-semibold">福利待遇</span>}
                  name="benefits"
                  rules={[{ required: true, message: '请输入福利待遇' }]}
                >
                  <TextArea rows={2} placeholder="请描述公司的福利待遇..." className="rounded-lg" />
                </Form.Item>
              </div>
            </div>

            {/* 职位描述 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-accent/20">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <TeamOutlined className="h-5 w-5 text-accent" style={{ fontSize: '20px' }} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">职位详情</h2>
              </div>

              <Form.Item
                label={<span className="text-base font-semibold">职位描述</span>}
                name="description"
                rules={[{ required: true, message: '请输入职位描述' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="请简要描述职位..."
                  showCount
                  maxLength={500}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-base font-semibold">工作职责</span>}
                name="responsibilities"
                rules={[{ required: true, message: '请输入工作职责' }]}
              >
                <TextArea
                  rows={6}
                  placeholder="请详细描述工作内容、职责范围等..."
                  showCount
                  maxLength={2000}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-base font-semibold">任职要求</span>}
                name="requirements"
                rules={[{ required: true, message: '请输入任职要求' }]}
              >
                <TextArea
                  rows={6}
                  placeholder="请列出岗位所需的技能、经验等要求..."
                  showCount
                  maxLength={2000}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-base font-semibold">技能标签</span>}
                name="tags"
              >
                <Select
                  mode="tags"
                  size="large"
                  placeholder="输入技能后按回车添加"
                  tokenSeparators={[',']}
                  className="rounded-lg"
                />
              </Form.Item>
            </div>

            {/* 公司信息 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-primary/20">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BankOutlined className="h-5 w-5 text-primary" style={{ fontSize: '20px' }} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">公司信息</h2>
              </div>

              <Form.Item
                label={<span className="text-base font-semibold">公司介绍</span>}
                name="companyIntroduction"
                rules={[{ required: true, message: '请输入公司介绍' }]}
              >
                <TextArea
                  rows={5}
                  placeholder="请介绍公司背景、业务范围、企业文化、发展历程等..."
                  showCount
                  maxLength={2000}
                  className="rounded-lg"
                />
              </Form.Item>

              <div className="grid md:grid-cols-2 gap-6">
                <Form.Item
                  label={<span className="text-base font-semibold">公司官网</span>}
                  name="companyWebsite"
                >
                  <Input
                    size="large"
                    placeholder="https://www.example.com"
                    className="rounded-lg"
                    prefix={<GlobalOutlined className="text-gray-400" />}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-base font-semibold">邮箱</span>}
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入正确的邮箱格式' },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="接收简历的邮箱"
                    className="rounded-lg"
                    prefix={<MailOutlined className="text-gray-400" />}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-base font-semibold">电话</span>}
                  name="phone"
                >
                  <Input
                    size="large"
                    placeholder="联系电话"
                    className="rounded-lg"
                    prefix={<PhoneOutlined className="text-gray-400" />}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-base font-semibold">投递说明</span>}
                  name="applicationInstructions"
                  extra="选填：请说明简历投递方式、格式要求等"
                >
                  <TextArea
                    rows={2}
                    placeholder="请说明投递方式和注意事项..."
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>
            </div>

            {/* 提交按钮 */}
            <Form.Item className="mb-0">
              <div className="flex gap-4 pt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="flex-1 h-12 rounded-xl font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                  icon={<ThunderboltOutlined />}
                >
                  立即发布
                </Button>
                <Button
                  size="large"
                  onClick={() => form.resetFields()}
                  className="px-8 h-12 rounded-xl font-semibold text-base"
                >
                  重置表单
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>

        <div className="mt-6 p-6 bg-muted/30 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            💡 温馨提示：详细的职位描述和清晰的任职要求能够帮助您吸引到更合适的候选人
          </p>
        </div>
      </div>
    </div>
  );
}
