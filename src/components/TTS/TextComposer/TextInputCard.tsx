'use client';

import { Card, CardContent, TextField, Button, Box, Typography } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { CharCounter } from './CharCounter';
import { SampleButton } from './SampleButton';

interface TextInputCardProps {
  text: string;
  onTextChange: (text: string) => void;
}

export default function TextInputCard({ text, onTextChange }: TextInputCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 'soft',
        backgroundColor: 'surfaceLight.main',
        flexGrow: 1, // 让卡片填充剩余空间
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0, // 允许flex收缩
      }}
    >
      <CardContent
        sx={{
          p: 2,
          width: '100%',
          boxSizing: 'border-box',
          flexGrow: 1, // 让 CardContent 填充父容器剩余空间
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0, // 允许 flexbox 正确收缩
        }}
      >
        <TextField
          multiline
          fullWidth
          placeholder="Enter your text here to generate natural, expressive speech. Our AI brings your words to life!"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          variant="standard"
          sx={{
            flexGrow: 1, // 完全填充剩余空间
            display: 'flex',
            flexDirection: 'column',
            minHeight: 160, // 设置合理的最小高度
            // 完全自适应 - 不设置固定高度限制
          }}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: '1rem',
              lineHeight: 1.4,
              flexGrow: 1, // 让输入区域完全填充
              display: 'flex',
              flexDirection: 'column',
              height: '100%', // 确保填充父容器高度
              '& textarea': {
                resize: 'none',
                overflowY: 'auto',
                boxSizing: 'border-box',
                height: '100% !important', // 强制填充父容器
                minHeight: '120px', // 最小高度确保可用性
                // 自适应高度关键 - 移除固定高度，让内容决定
                // 美观的滚动条样式
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(255, 199, 0, 0.3)',
                  borderRadius: '3px',
                  '&:hover': {
                    background: 'rgba(255, 199, 0, 0.5)',
                  },
                },
              },
            },
          }}
        />

        {/* 字符计数和范例按钮区域 - 精确24px间距 */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 2,
          px: 0.5,
          flexShrink: 0,
          mt: 3, // 精确24px上边距 (8px × 3 = 24px)
        }}>
          <CharCounter currentLength={text.length} maxLength={500} />
          <SampleButton />
        </Box>
      </CardContent>
    </Card>
  );
}