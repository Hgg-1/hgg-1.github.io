import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 格式化作业名称
function formatAssignmentName(filename: string): string {
  // 移除文件扩展名
  const nameWithoutExtension = filename.replace(/\.[^/.]+$/, '');
  
  // 移除数字前缀和多余空格
  return nameWithoutExtension
    .replace(/^\d+-\w+-\d+\s*/, '')
    .trim();
}

export async function GET() {
  try {
    const assignmentsDirectory = path.join(process.cwd(), 'public', 'assignments');
    const filenames = fs.readdirSync(assignmentsDirectory);
    
    const assignments = filenames
      .filter((file) => file.endsWith('.html'))
      .map((filename) => ({
        filename,
        name: formatAssignmentName(filename),
      }));
    
    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error reading assignments directory:', error);
    return NextResponse.json(
      { error: 'Failed to load assignments' },
      { status: 500 }
    );
  }
} 