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
          rows={4} // 设置合理的最小行数
          maxRows={12} // 设置最大行数限制
          fullWidth
          placeholder="Enter your text here to generate natural, expressive speech. Our AI brings your words to life!"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          variant="standard"
          sx={{
            flexGrow: 1, // 让 TextField 填充 CardContent 剩余空间
            display: 'flex',
            flexDirection: 'column',
            // 限制TextField最大高度
            maxHeight: '300px', // 设置最大高度限制
          }}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: '1rem',
              lineHeight: 1.4,
              flexGrow: 1, // 让输入区域填充 TextField 空间
              display: 'flex',
              flexDirection: 'column',
              // textarea关键修复
              '& textarea': {
                resize: 'none',
                overflowY: 'auto', // 允许滚动
                maxHeight: '280px', // 限制textarea最大高度
                boxSizing: 'border-box',
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

        {/* 字符计数和范例按钮区域 */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mt: 2,
          px: 0.5,
          flexShrink: 0, // 防止被压缩
        }}>
          <CharCounter currentLength={text.length} maxLength={500} />
          <SampleButton />
        </Box>
      </CardContent>
    </Card>
  );
}