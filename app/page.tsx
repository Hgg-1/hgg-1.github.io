'use client';

import Link from 'next/link';
import { Button, Card, Typography, Divider } from '@arco-design/web-react';
import { useState, useRef, useEffect } from 'react';

// 定义聊天消息的角色和内容
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// AI聊天组件
function AIChat() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是你的AI助手，有什么可以帮助你的吗？' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 滚动到底部的函数
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  // 在消息更新后滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: question };
    
    // 添加用户消息和一个空的助手消息占位符
    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = question;
    setQuestion('');
    setIsLoading(true);
    setDebugInfo('');

    try {
      const res = await fetch('/api/qanything', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          history: [],
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error('API request failed');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let responseContent = '';

      // 添加一个空的助手消息
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        // 添加调试信息 (仅在内部记录，不显示)
        setDebugInfo(prev => prev + '\n收到数据: ' + chunk.substring(0, 50) + (chunk.length > 50 ? '...' : ''));
        
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          if (line.startsWith('data:')) {
            const jsonStr = line.substring(5).trim();
            if (jsonStr) {
              try {
                const parsed = JSON.parse(jsonStr);
                setDebugInfo(prev => prev + '\n解析JSON: ' + JSON.stringify(parsed).substring(0, 50) + '...');
                
                if (parsed.result?.response) {
                  const newText = parsed.result.response;
                  responseContent += newText;
                  
                  // 处理响应文本
                  let cleanedContent = responseContent;
                  
                  // 移除<think>标签内容
                  cleanedContent = cleanedContent.replace(/<think>[\s\S]*?<\/think>/g, '');
                  
                  // 提取<response>标签内容，如果有的话
                  const responseMatch = cleanedContent.match(/<response>([\s\S]*?)<\/response>/);
                  if (responseMatch && responseMatch[1]) {
                    cleanedContent = responseMatch[1].trim();
                  } else {
                    // 如果没有<response>标签，使用整个内容
                    cleanedContent = cleanedContent.trim();
                  }
                  
                  setDebugInfo(prev => prev + '\n处理后内容: ' + cleanedContent.substring(0, 50) + (cleanedContent.length > 50 ? '...' : ''));
                  
                  // 更新最后一条消息
                  setMessages(prevMessages => {
                    const newMessages = [...prevMessages];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage && lastMessage.role === 'assistant') {
                      lastMessage.content = cleanedContent;
                      setDebugInfo(prev => prev + '\n更新消息成功');
                    } else {
                      setDebugInfo(prev => prev + '\n未找到助手消息，添加新消息');
                      newMessages.push({ role: 'assistant', content: cleanedContent });
                    }
                    return newMessages;
                  });
                }
              } catch (e) {
                console.error("解析JSON失败:", e, "原始数据:", jsonStr);
                setDebugInfo(prev => prev + '\n解析JSON失败: ' + (e as Error).message);
              }
            }
          }
        }
      }
      
      // 如果最终没有收到任何内容，添加一个默认回复
      setMessages(prevMessages => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.content) {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1].content = '收到您的消息，但我暂时无法回复具体内容。';
          return newMessages;
        }
        return prevMessages;
      });
      
    } catch (error: any) {
      console.error('Fetch error:', error);
      setDebugInfo(prev => prev + '\n请求错误: ' + error.message);
      
      // 添加错误消息
      setMessages(prev => [...prev, { role: 'assistant', content: `抱歉，请求出错了：${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-white rounded-xl shadow-lg border border-primary/10 overflow-hidden">
      <div className="bg-primary p-4 text-white">
        <Typography.Title heading={5} className="!text-white !m-0">AI 助手</Typography.Title>
      </div>
      
      {/* 聊天消息区域 */}
      <div 
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-gray-100 text-dark rounded-tl-none'
              }`}
            >
              <Typography.Text className={msg.role === 'user' ? '!text-white' : '!text-dark'}>
                {msg.content || (msg.role === 'assistant' && isLoading && index === messages.length - 1 ? '正在思考...' : '')}
              </Typography.Text>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 rounded-tl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 输入区域 */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 flex">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="输入你的问题..."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:border-primary"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="bg-primary text-white px-4 py-2 rounded-r-lg hover:opacity-90 disabled:opacity-50"
        >
          发送
        </button>
      </form>
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  return (
    <div className="flex flex-col items-center">
      {/* 顶部横幅 */}
      <div className="w-full relative overflow-hidden rounded-xl mb-12 bg-gradient-to-r from-primary to-secondary">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent rounded-full opacity-50"></div>
        <div className="absolute -left-10 -top-10 w-20 h-20 bg-primary rounded-full opacity-30"></div>
        
        <div className="container mx-auto py-16 px-6 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-cute animate-float">
              Collection of Works
            </h1>
            <p className="text-white/90 text-xl mb-8">
              创意无限，灵感无界 —— 欢迎来到我的作品集！
            </p>
            <div className="flex space-x-4">
              <Link href="/portfolio">
                <Button type="primary" size="large" className="!bg-accent !border-none !text-dark hover:!opacity-90">
                  浏览作品
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="large" className="!bg-white/20 !border-white !text-white hover:!bg-white/30">
                  联系我
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI聊天和精选作品 */}
      <div className="w-full mb-16 grid md:grid-cols-2 gap-8">
        {/* AI聊天部分 */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-dark mb-2 font-cute">AI助手</h2>
            <p className="text-dark/70">有任何问题，都可以向我的AI助手咨询</p>
          </div>
          <AIChat />
        </div>
        
        {/* 精选作品部分 */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-dark mb-2 font-cute">精选作品</h2>
            <p className="text-dark/70">这里展示了我最引以为傲的一些创作</p>
          </div>
          
          <div className="grid gap-6">
            <Card
              className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow"
              cover={
                <div className="h-48 bg-gradient-to-br from-primary/80 to-accent/80 bg-cover bg-center"></div>
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
                <div className="h-48 bg-gradient-to-tr from-secondary/80 to-primary/70 bg-cover bg-center"></div>
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
          </div>
          
          <div className="text-center mt-6">
            <Link href="/portfolio">
              <Button type="outline" className="!border-primary !text-primary hover:!bg-primary/5">
                查看全部作品
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* 联系部分 */}
      <div className="w-full bg-light rounded-xl p-8 shadow-inner border border-primary/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-dark mb-4 font-cute">有想法？联系我！</h2>
          <p className="text-dark/70 mb-6">
            无论是项目合作、咨询建议，还是仅仅想打个招呼，都欢迎随时联系我
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/contact">
              <Button type="primary" size="large" className="!bg-primary !border-none hover:!opacity-90">
                发送消息
              </Button>
            </Link>
            <Button size="large" className="!bg-white !border-primary/30 !text-primary hover:!bg-primary/5">
              123-456-7890
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

