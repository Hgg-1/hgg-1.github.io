'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { List, Card, Typography, Space, Tag, Divider } from '@arco-design/web-react';

type Assignment = {
  filename: string;
  name: string;
};

export default function PortfolioList() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const response = await fetch('/api/assignments');
        if (!response.ok) {
          throw new Error('Failed to fetch assignments');
        }
        const data = await response.json();
        setAssignments(data);
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchAssignments();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg border border-primary/20">
          <Typography.Title heading={3} className="!text-dark text-center">练习清单</Typography.Title>
          <Typography.Paragraph className="!text-primary text-center">加载练习列表失败，请稍后再试</Typography.Paragraph>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg border border-primary/20">
          <Typography.Title heading={3} className="!text-dark text-center">加载中...</Typography.Title>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-lg border border-primary/20">
        <Divider className="my-4 border-secondary/20" />
        
        {assignments.length > 0 ? (
          <List
            className="custom-scrollbar"
            style={{ maxHeight: 'calc(100vh - 22rem)', overflow: 'auto' }}
            grid={{ 
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3
            }}
            dataSource={assignments}
            render={(assignment, index) => (
              <List.Item key={assignment.filename}>
                <Link href={`/portfolio/${assignment.filename}`} style={{ display: 'block', width: '100%' }}>
                  <Card
                    className="group transition-all duration-300 transform hover:scale-[1.02]"
                    style={{ 
                      background: 'white',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}
                    hoverable
                  >
                    <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
                    <Space direction="vertical" style={{ width: '100%', padding: '0.5rem 0' }}>
                      <Typography.Title heading={5} className="!text-dark !m-0">
                        {assignment.name}
                      </Typography.Title>
                      <Typography.Paragraph className="!text-dark/70 !my-1">
                        点击查看详情
                      </Typography.Paragraph>
                      <div className="flex gap-2">
                        <Tag color="arcoblue" bordered={false}>练习</Tag>
                        <Tag color="green" bordered={false}>HTML/CSS</Tag>
                      </div>
                    </Space>
                  </Card>
                </Link>
              </List.Item>
            )}
          />
        ) : (
          <Card style={{ background: 'white', border: '2px dashed rgba(0,0,0,0.1)' }}>
            <Typography.Title heading={4} className="!text-dark text-center">暂无练习</Typography.Title>
            <Typography.Paragraph className="!text-dark/70 text-center">
              这里什么都还没有呢，快去添加一些练习吧！
            </Typography.Paragraph>
          </Card>
        )}
      </div>
    </div>
  );
} 