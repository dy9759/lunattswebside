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
        overflowY: 'auto', // 可滚动
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        pr: 1, // 右侧padding为滚动条留空间
        // 自定义滚动条样式
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 199, 0, 0.3)',
          borderRadius: '3px',
          '&:hover': {
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