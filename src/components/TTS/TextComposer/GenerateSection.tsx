'use client';

import { Box, Button, Typography } from '@mui/material';
import { GenerationCounter } from './GenerationCounter';
import { GenerateButton } from './GenerateButton';

interface GenerateSectionProps {
  onGenerate: () => void;
  canGenerate: boolean;
  remainingGenerations: number;
}

export default function GenerateSection({
  onGenerate,
  canGenerate,
  remainingGenerations,
}: GenerateSectionProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // 改为space-between确保在同一行
        gap: 1, // 减少gap让文本更靠近button
        flexShrink: 0, // 防止被压缩
        marginTop: 'auto', // 推到底部
        width: '100%', // 确保占满宽度
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <GenerationCounter remaining={remainingGenerations} />
      </Box>
      <GenerateButton
        onGenerate={onGenerate}
        disabled={!canGenerate}
      />
    </Box>
  );
}