'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Input, Button, Card, Typography, Divider, Avatar, Empty } from '@arco-design/web-react';

// 定义消息源信息的接口
interface Source {
  fileId: string;
  fileName: string;
  content: string;
  score: string;
}

// 定义聊天消息的角色和内容
interface Message {
  role: 'user' | 'assistant';
  content: string;
  thinkContent?: string; // 可选的思考过程内容
  sources?: Source[]; // 可选的消息源信息
}

/**
 * 处理API返回的消息内容，提取<response>标签中的内容
 */
function processApiResponse(text: string): string {
  // 如果包含<response>标签，则只显示<response>标签内的内容
  if (text.includes('<response>')) {
    const responseMatch = text.match(/<response>([\s\S]*?)<\/response>/);
    if (responseMatch && responseMatch[1]) {
      return responseMatch[1].trim();
    }
  }
  
  // 如果包含<think>标签但没有<response>标签，则过滤掉<think>标签内容
  if (text.includes('<think>')) {
    return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  }
  
  // 如果没有任何标签，则返回原始文本
  return text;
}

/**
 * 加载动画组件
 */
function LoadingIndicator() {
  return (
    <div className="flex justify-center items-center py-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-kuromi-pink rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-kuromi-pink rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-kuromi-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
}

/**
 * 消息源信息组件
 */
function SourceInfo({ sources }: { sources: Source[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!sources || sources.length === 0) return null;
  
  return (
    <div className="mt-2 text-xs">
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="text-kuromi-dark hover:text-black flex items-center font-semibold"
      >
        <span>{isExpanded ? '收起秘密' : '查看秘密'}</span>
        <svg 
          className={`w-4 h-4 ml-1 transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isExpanded && (
        <div className="mt-2 p-3 bg-kuromi-purple/70 rounded-lg border border-kuromi-pink/30">
          {sources.map((source, index) => (
            <div key={index} className="mb-2 pb-2 border-b border-kuromi-pink/20 last:border-b-0">
              <div className="font-bold text-kuromi-dark">秘密卷宗: {source.fileName}</div>
              <div className="mt-1 text-kuromi-dark/90 whitespace-pre-wrap bg-white/50 p-2 rounded">{source.content}</div>
              <div className="mt-1 text-kuromi-dark/60">相关度: {parseFloat(source.score).toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function QAnythingPage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    
    // 构建历史记录 (使用上一次的 messages 状态)
    const historyMessages = messages.reduce((acc: { question: string; response: string }[], msg, index) => {
      if (msg.role === 'user' && messages[index + 1]?.role === 'assistant') {
        acc.push({ question: msg.content, response: messages[index + 1].content });
      }
      return acc;
    }, []);

    // 添加用户消息和助手的空"占位"消息
    const assistantPlaceholder: Message = { role: 'assistant', content: '', thinkContent: '' };
    setMessages([...messages, userMessage, assistantPlaceholder]);
    setQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/qanything', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question,
          history: historyMessages.slice(-2),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error('API request failed');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponseText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          if (line.startsWith('data:')) {
            const jsonStr = line.substring(5).trim();
            if (jsonStr) {
              try {
                const parsed = JSON.parse(jsonStr);
                
                if (parsed.result?.response) {
                  fullResponseText += parsed.result.response;
                }
                
                const sources = parsed.result?.source;

                // --- 全新的、更健壮的解析逻辑 ---
                const thinkMatch = fullResponseText.match(/<think>([\s\S]*?)<\/think>/);
                const responseMatch = fullResponseText.match(/<response>([\s\S]*?)<\/response>/);

                const thinkContent = thinkMatch ? thinkMatch[1].trim() : '';
                let content = '';

                if (responseMatch) {
                  content = responseMatch[1].trim();
                } else {
                  content = fullResponseText.replace(/<think>[\s\S]*?<\/think>/, '').trim();
                }

                // --- 持续更新最后一条消息（占位符） ---
                setMessages(prevMessages => {
                  const newMessages = [...prevMessages];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content = content;
                    lastMessage.thinkContent = thinkContent;
                    lastMessage.sources = sources;
                  }
                  return newMessages;
                });

              } catch (e) {
                console.error("无法解析收到的JSON:", jsonStr, e);
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Fetch error:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.content = `抱歉，请求出错了：\n${error.message}`;
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] max-w-4xl mx-auto p-4 bg-kuromi-purple/70 rounded-2xl shadow-2xl border border-kuromi-pink/20 backdrop-blur-md relative">
      {/* 角落装饰 */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-kuromi-pink/30 rounded-tl-xl -translate-x-1 -translate-y-1"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-kuromi-pink/30 rounded-tr-xl translate-x-1 -translate-y-1"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-kuromi-pink/30 rounded-bl-xl -translate-x-1 translate-y-1"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-kuromi-pink/30 rounded-br-xl translate-x-1 translate-y-1"></div>
      
      {/* 聊天消息区域 */}
      <div 
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto space-y-6 p-6 scrollbar-thin scrollbar-thumb-kuromi-pink/50 scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <Empty
            className="h-full flex flex-col justify-center"
            description={
              <Typography.Paragraph style={{ color: '#3a2d4b' }}>
                想聊点什么吗？<br />
                本小姐随时奉陪哦！
              </Typography.Paragraph>
            }
            icon={
              <div className="text-6xl">💜</div>
            }
          />
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-2xl ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar
                    className={`flex-shrink-0 ${msg.role === 'user' ? 'bg-kuromi-pink' : 'bg-kuromi-dark'}`}
                  >
                    {msg.role === 'user' ? '你' : '酷'}
                  </Avatar>
                  <div className={`p-4 rounded-2xl shadow-md ${
                    msg.role === 'user' 
                      ? 'bg-white/80 text-kuromi-dark rounded-br-none' 
                      : 'bg-white/90 text-kuromi-dark rounded-bl-none'
                  }`}>
                    {/* 思考过程 */}
                    {msg.thinkContent && (
                      <div className="mb-2 p-3 border border-dashed border-kuromi-pink/40 rounded-lg bg-kuromi-purple/30">
                        <p className="text-xs font-mono text-kuromi-dark/70 whitespace-pre-wrap">{msg.thinkContent}</p>
                      </div>
                    )}
                    
                    {/* 主要内容 */}
                    <Typography.Paragraph className="text-base whitespace-pre-wrap mb-0">
                      {msg.content || <LoadingIndicator />}
                    </Typography.Paragraph>

                    {/* 消息源 */}
                    {msg.sources && <SourceInfo sources={msg.sources} />}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <Divider className="my-0 border-t-kuromi-pink/20" />

      {/* 输入区域 */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <Input.TextArea
            value={question}
            onChange={setQuestion}
            placeholder={isLoading ? "让我想想..." : "在这里输入你想说的话..."}
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={isLoading}
            className="flex-1 !bg-white/80 !text-kuromi-dark placeholder:!text-kuromi-dark/50 border !border-kuromi-pink/30 focus:!border-kuromi-pink focus:!ring-kuromi-pink/50 rounded-lg"
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          />
          <Button 
            htmlType="submit" 
            loading={isLoading}
            className="!bg-kuromi-pink hover:!bg-kuromi-dark !border-none !text-white !font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            发送
          </Button>
        </form>
      </div>
    </div>
  );
} 