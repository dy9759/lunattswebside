'use client';

import { Box, Typography } from '@mui/material';
import TextInputCard from './TextInputCard';
import GenerateSection from './GenerateSection';
import { TextComposerProps } from '../Types';

export default function TextComposer({
  text,
  onTextChange,
  onGenerate,
  canGenerate,
  remainingGenerations,
}: TextComposerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        flexGrow: 1, // 填充父容器剩余空间
        minHeight: 0, // 允许flex收缩
        height: '100%', // 确保占满可用高度
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '40px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'textLight.main', display: 'flex', alignItems: 'center' }}>
          Text-to-Speech
        </Typography>
      </Box>

      {/* Text Input Card - 自适应填充剩余空间 */}
      <TextInputCard
        text={text}
        onTextChange={onTextChange}
      />

      {/* Generate Section - 固定在底部 */}
      <GenerateSection
        onGenerate={onGenerate}
        canGenerate={canGenerate}
        remainingGenerations={remainingGenerations}
      />
    </Box>
  );
}