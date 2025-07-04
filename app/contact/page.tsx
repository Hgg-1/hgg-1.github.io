'use client';

import { useState } from 'react';
import { Form, Input, Button, Message, Typography, Space } from '@arco-design/web-react';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

export default function ContactPage() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    
    // 模拟表单提交
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    Message.success('留言已成功发送！');
    form.resetFields();
    setSubmitting(false);
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-dark mb-4 font-cute">联系我</h1>
        <p className="text-dark/70 max-w-2xl mx-auto">
          有任何问题、建议或合作意向，都可以通过以下方式联系我
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12">
        {/* 联系表单 */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-primary/10">
          <Typography.Title heading={4} className="!text-dark mb-6">留言板</Typography.Title>
          
          <Form
            form={form}
            layout="vertical"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <FormItem 
              label="姓名" 
              field="name" 
              rules={[{ required: true, message: '请输入您的姓名' }]}
            >
              <Input placeholder="请输入您的姓名" />
            </FormItem>
            
            <FormItem 
              label="邮箱" 
              field="email" 
              rules={[
                { required: true, message: '请输入您的邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入您的邮箱" />
            </FormItem>
            
            <FormItem 
              label="主题" 
              field="subject"
            >
              <Input placeholder="留言主题" />
            </FormItem>
            
            <FormItem 
              label="留言内容" 
              field="message" 
              rules={[{ required: true, message: '请输入留言内容' }]}
            >
              <TextArea placeholder="请输入您的留言内容" rows={5} />
            </FormItem>
            
            <FormItem>
              <Button 
                type="primary" 
                htmlType="submit" 
                long 
                loading={submitting}
                className="!bg-primary !border-none hover:!opacity-90"
              >
                发送留言
              </Button>
            </FormItem>
          </Form>
        </div>
        
        {/* 联系信息 */}
        <div>
          <div className="bg-white p-8 rounded-xl shadow-lg border border-primary/10 mb-8">
            <Typography.Title heading={4} className="!text-dark mb-6">联系方式</Typography.Title>
            
            <Space direction="vertical" size="large" className="w-full">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-primary" viewBox="0 0 16 16">
                    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                  </svg>
                </div>
                <div>
                  <Typography.Text className="!text-dark font-bold block">电话</Typography.Text>
                  <Typography.Text className="!text-dark/70">123-456-7890</Typography.Text>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-primary" viewBox="0 0 16 16">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                  </svg>
                </div>
                <div>
                  <Typography.Text className="!text-dark font-bold block">邮箱</Typography.Text>
                  <Typography.Text className="!text-dark/70">hello@works.com</Typography.Text>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-primary" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                  </svg>
                </div>
                <div>
                  <Typography.Text className="!text-dark font-bold block">微信</Typography.Text>
                  <Typography.Text className="!text-dark/70">collection_works</Typography.Text>
                </div>
              </div>
            </Space>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg border border-primary/10">
            <Typography.Title heading={4} className="!text-dark mb-6">工作时间</Typography.Title>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <Typography.Text className="!text-dark font-medium">周一 - 周五</Typography.Text>
                <Typography.Text className="!text-primary font-bold">9:00 - 18:00</Typography.Text>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <Typography.Text className="!text-dark font-medium">周六</Typography.Text>
                <Typography.Text className="!text-primary font-bold">10:00 - 16:00</Typography.Text>
              </div>
              
              <div className="flex justify-between items-center pb-2">
                <Typography.Text className="!text-dark font-medium">周日</Typography.Text>
                <Typography.Text className="!text-primary font-bold">休息</Typography.Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 