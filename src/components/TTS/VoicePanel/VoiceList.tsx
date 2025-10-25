'use client';

import { Box } from '@mui/material';
import VoiceCard from './VoiceCard';
import { Voice } from '../Types';

interface VoiceListProps {
  voices: Voice[];
  selectedVoiceId: string;
  onVoiceSelect: (voice: Voice) => void;
}

export default function VoiceList({ voices, selectedVoiceId, onVoiceSelect }: VoiceListProps) {
  return (
    <Box
      sx={{
        flexGrow: 1, // 填充剩余空间
        minHeight: 0, // 允许flex收缩
        overflowY: 'auto', // 纵向滚动
        overflowX: 'hidden', // 隐藏横向滚动
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        pr: 1, // 右侧padding为滚动条留空间
        // 美观的滚动条样式
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 199, 0, 0.4)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(255, 199, 0, 0.6)',
          },
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(255, 199, 0, 0.8)',
        },
        // Firefox滚动条样式
        '&::-moz-scrollbar': {
          width: '8px',
        },
        '&::-moz-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '4px',
        },
        '&::-moz-scrollbar-thumb': {
          background: 'rgba(255, 199, 0, 0.4)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(255, 199, 0, 0.6)',
          },
        },
        // 平滑滚动效果
        scrollBehavior: 'smooth',
        // hover时增强滚动条可见性
        '&:hover': {
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 199, 0, 0.5)',
          },
          '&::-moz-scrollbar-thumb': {
            background: 'rgba(255, 199, 0, 0.5)',
          },
        },
      }}
    >
      {voices.map((voice) => (
        <VoiceCard
          key={voice.id}
          voice={voice}
          isSelected={selectedVoiceId === voice.id}
          onSelect={() => onVoiceSelect(voice)}
        />
      ))}
    </Box>
  );
}