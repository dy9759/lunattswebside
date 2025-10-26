'use client';

import { Typography } from '@mui/material';

interface GenerationCounterProps {
  remaining: number;
}

export function GenerationCounter({ remaining }: GenerationCounterProps) {
  return (
    <Typography
      variant="body2"
      sx={{
        color: 'subtleLight.main',
        textAlign: 'right',      // 右对齐，让文本靠近button
        pl: 2,                   // 保持16px左侧padding
        pr: 1,                   // 添加8px右侧padding，防止文本贴着button
        width: '100%',           // 确保文本占满容器宽度
        boxSizing: 'border-box', // 包含padding在宽度计算中
      }}
    >
      {remaining} generations remaining today
    </Typography>
  );
}