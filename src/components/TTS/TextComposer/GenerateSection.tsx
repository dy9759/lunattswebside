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
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 1,
        flexShrink: 0, // 防止被压缩
        marginTop: 'auto', // 推到底部
      }}
    >
      <GenerationCounter remaining={remainingGenerations} />
      <GenerateButton
        onGenerate={onGenerate}
        disabled={!canGenerate}
      />
    </Box>
  );
}