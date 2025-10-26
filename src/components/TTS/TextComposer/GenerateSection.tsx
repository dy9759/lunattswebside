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
        justifyContent: 'flex-end',
        gap: 2,
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