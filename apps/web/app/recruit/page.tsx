'use client';

import { Form, Input, Select, Button, InputNumber, message, Card } from 'antd';
import {
  RiseOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  BankOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

export default function RecruitPage() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async () => {
    try {
      messageApi.success('招聘信息发布成功！');
      form.resetFields();
    } catch (error) {
      messageApi.error('发布失败，请重试');
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
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-primary/20">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileTextOutlined className="h-5 w-5 text-primary" style={{ fontSize: '20px' }} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">基本信息</h2>
              </div>

              <Form.Item
                label={<span className="text-base font-semibold">职位名称</span>}
                name="jobTitle"
                rules={[{ required: true, message: '请输入职位名称' }]}
              >
                <Input size="large" placeholder="如：高级前端工程师" className="rounded-lg" />
              </Form.Item>
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
                  <Input size="large" placeholder="如：北京/上海/远程" className="rounded-lg" />
                </Form.Item>

                <Form.Item
                  label={<span className="text-base font-semibold">工作类型</span>}
                  name="jobType"
                  rules={[{ required: true, message: '请选择工作类型' }]}
                >
                  <Select size="large" placeholder="选择类型" className="rounded-lg">
                    <Option value="fulltime">全职</Option>
                    <Option value="parttime">兼职</Option>
                    <Option value="intern">实习</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<span className="text-base font-semibold">经验要求</span>}
                  name="experience"
                  rules={[{ required: true, message: '请选择经验要求' }]}
                >
                  <Select size="large" placeholder="选择经验要求" className="rounded-lg">
                    <Option value="fresh">应届生</Option>
                    <Option value="1-3">1-3年</Option>
                    <Option value="3-5">3-5年</Option>
                    <Option value="5+">5年以上</Option>
                    <Option value="unlimited">不限</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<span className="text-base font-semibold">学历要求</span>}
                  name="education"
                  rules={[{ required: true, message: '请选择学历要求' }]}
                >
                  <Select size="large" placeholder="选择学历要求" className="rounded-lg">
                    <Option value="highschool">高中</Option>
                    <Option value="college">大专</Option>
                    <Option value="bachelor">本科</Option>
                    <Option value="master">硕士</Option>
                    <Option value="phd">博士</Option>
                    <Option value="unlimited">不限</Option>
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
                  label={<span className="text-base font-semibold">薪资范围（月薪/千元）</span>}
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
                  label={<span className="text-base font-semibold">是否面议</span>}
                  name="salaryNegotiable"
                  rules={[{ required: true, message: '请选择是否面议' }]}
                >
                  <Select size="large" placeholder="选择" className="rounded-lg">
                    <Option value="yes">是</Option>
                    <Option value="no">否</Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item
                label={<span className="text-base font-semibold">福利待遇</span>}
                name="benefits"
              >
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="选择福利（可多选）"
                  className="rounded-lg"
                  options={[
                    { label: '五险一金', value: 'insurance' },
                    { label: '年终奖', value: 'bonus' },
                    { label: '股权期权', value: 'equity' },
                    { label: '弹性工作', value: 'flexible' },
                    { label: '带薪年假', value: 'vacation' },
                    { label: '团队建设', value: 'teambuilding' },
                    { label: '培训学习', value: 'training' },
                    { label: '免费午餐', value: 'meals' },
                    { label: '健身房', value: 'gym' },
                    { label: '通勤补助', value: 'transport' },
                  ]}
                />
              </Form.Item>
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
                name="skills"
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

            {/* ============ 新增：公司信息 ============ */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-primary/20">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BankOutlined className="h-5 w-5 text-primary" style={{ fontSize: '20px' }} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">公司信息</h2>
              </div>

              {/* 公司介绍 */}
              <Form.Item
                label={<span className="text-base font-semibold">公司介绍</span>}
                name="companyDescription"
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
            </div>
            {/* 其他信息 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-primary/20">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ClockCircleOutlined
                    className="h-5 w-5 text-primary"
                    style={{ fontSize: '20px' }}
                  />
                </div>
                <h2 className="text-2xl font-bold text-foreground">投递信息</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Form.Item
                  label={<span className="text-base font-semibold">联系方式</span>}
                  name="contact"
                  rules={[{ required: true, message: '请输入联系方式' }]}
                >
                  <Input
                    size="large"
                    placeholder="邮箱/tg/电话"
                    className="rounded-lg"
                    prefix={<MailOutlined className="text-gray-400" />}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={<span className="text-base font-semibold">投递说明</span>}
                name="applicationInstructions"
                extra="请说明简历投递方式、格式要求、筛选流程等信息"
              >
                <TextArea
                  rows={4}
                  placeholder="请详细说明投递方式，例如：
1. 简历请发送至上述邮箱，标题格式：职位+姓名+工作经验
2. 附件请使用PDF格式，大小不超过10MB
3. 初筛通过后，我们将在3个工作日内联系
4. 面试流程：HR初筛→技术面试→HR终面→录用通知"
                  maxLength={1000}
                  showCount
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-base font-semibold">备注说明</span>}
                name="notes"
              >
                <TextArea
                  rows={3}
                  placeholder="其他补充说明（选填）"
                  maxLength={500}
                  showCount
                  className="rounded-lg"
                />
              </Form.Item>
            </div>

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
