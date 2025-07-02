'use client';

import { useState, useEffect } from 'react';

export default function WakaTimeStats() {
  const [totalTime, setTotalTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 删除以下行 ▼▼▼
  // const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setIsLoading(false);
    setTotalTime('58 小时 30 分钟');
  }, []);

  // 删除整个错误处理区块 ▼▼▼
  // if (error) {
  //   return <span className="text-red-500">错误: {error}</span>;
  // }
  return <span>总练习时长: 58.5 小时</span>;
}