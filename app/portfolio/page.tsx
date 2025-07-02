'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Button, Grid } from '@arco-design/web-react';
import Link from 'next/link';

// 定义作品类型
type Assignment = {
  filename: string;
  name: string;
};

// 辅助函数，用于将文件名转换为更易读的标题
function formatAssignmentName(filename: string): string {
  return filename
    .replace('.html', '') // 移除扩展名
    .replace(/[-_]/g, ' ') // 将连字符和下划线替换为空格
    .replace(/\b\w/g, (char) => char.toUpperCase()); // 将每个单词的首字母大写
}

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const categories = ['all', 'web', 'practice', 'homework'];
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
  
  // 根据文件名前缀对作品进行分类
  const getAssignmentCategory = (filename: string): string => {
    if (filename.startsWith('练习')) return 'practice';
    if (filename.startsWith('作业')) return 'homework';
    return 'other';
  };

  // 根据文件名获取合适的渐变背景
  const getGradientBackground = (filename: string, index: number): string => {
    const gradients = [
      'bg-gradient-to-br from-primary/80 to-accent/80',
      'bg-gradient-to-tr from-secondary/80 to-primary/70',
      'bg-gradient-to-bl from-accent/70 to-secondary/80',
      'bg-gradient-to-tl from-primary/70 to-accent/60'
    ];
    
    if (filename.startsWith('练习')) {
      const num = parseInt(filename.replace('练习', '')) || 0;
      return gradients[num % gradients.length];
    }
    
    return gradients[index % gradients.length];
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-dark mb-4 font-cute">课程练习作品</h1>
        <p className="text-dark/70 max-w-2xl mx-auto">
          这里是我在学习过程中完成的各类练习和作业，包括HTML/CSS基础练习、网页设计和创意作品
        </p>
        
        {/* 分类筛选 */}
        <div className="flex justify-center mt-8 space-x-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full transition-all ${
                activeCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-dark/70 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? '全部' : 
               category === 'web' ? '网页' : 
               category === 'practice' ? '练习' : '作业'}
            </button>
          ))}
        </div>
      </div>
      
      {/* 加载中状态 */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-dark/70">正在加载作品...</p>
        </div>
      )}
      
      {/* 错误状态 */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">加载作品失败，请稍后再试</p>
        </div>
      )}
      
      {/* 作品网格 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 网页设计作品 - 保留原有的两个示例 */}
        {(activeCategory === 'all' || activeCategory === 'web') && (
          <>
            <Card
              className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow"
              cover={
                <div className="h-48 bg-gradient-to-br from-primary/80 to-accent/80 bg-cover bg-center relative">
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button type="primary" className="!bg-accent !border-none !text-dark">查看详情</Button>
                  </div>
                </div>
              }
            >
              <Typography.Title heading={5} className="!text-dark">
                响应式网页设计
              </Typography.Title>
              <Typography.Paragraph className="!text-dark/70">
                使用最新的CSS技术，创建适应各种屏幕尺寸的网页设计。
              </Typography.Paragraph>
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full">网页</span>
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">响应式</span>
                </div>
                <Link href="/portfolio/responsive-web">
                  <Button type="text" className="!text-primary">查看详情</Button>
                </Link>
              </div>
            </Card>
            
            <Card
              className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow"
              cover={
                <div className="h-48 bg-gradient-to-tr from-secondary/80 to-primary/70 bg-cover bg-center relative">
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button type="primary" className="!bg-accent !border-none !text-dark">查看详情</Button>
                  </div>
                </div>
              }
            >
              <Typography.Title heading={5} className="!text-dark">
                交互式动画
              </Typography.Title>
              <Typography.Paragraph className="!text-dark/70">
                使用CSS和JavaScript创建流畅的交互式动画效果。
              </Typography.Paragraph>
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full">动画</span>
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">交互</span>
                </div>
                <Link href="/portfolio/interactive-animation">
                  <Button type="text" className="!text-primary">查看详情</Button>
                </Link>
              </div>
            </Card>
          </>
        )}
        
        {/* 练习作品 */}
        {!loading && !error && assignments.length > 0 && assignments.map((assignment, index) => {
          const category = getAssignmentCategory(assignment.filename);
          
          if (activeCategory !== 'all' && activeCategory !== category) {
            return null;
          }
          
          return (
            <Card
              key={assignment.filename}
              className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow"
              cover={
                <div className={`h-48 ${getGradientBackground(assignment.filename, index)} bg-cover bg-center relative`}>
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button type="primary" className="!bg-accent !border-none !text-dark">查看详情</Button>
                  </div>
                </div>
              }
            >
              <Typography.Title heading={5} className="!text-dark">
                {assignment.name}
              </Typography.Title>
              <Typography.Paragraph className="!text-dark/70">
                {assignment.filename.startsWith('练习') ? 'HTML/CSS基础练习' : 
                 assignment.filename.startsWith('作业') ? '课程作业项目' : 
                 '其他网页设计作品'}
              </Typography.Paragraph>
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full">
                    {assignment.filename.startsWith('练习') ? '练习' : 
                     assignment.filename.startsWith('作业') ? '作业' : '其他'}
                  </span>
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">HTML/CSS</span>
                </div>
                <Link href={`/portfolio/${assignment.filename}`}>
                  <Button type="text" className="!text-primary">查看详情</Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 