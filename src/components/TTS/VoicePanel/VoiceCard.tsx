'use client';

import { Box, Avatar, IconButton, Typography } from '@mui/material';
import { PlayCircle } from '@mui/icons-material';
import { Voice } from '../Types';

interface VoiceCardProps {
  voice: Voice;
  isSelected: boolean;
  onSelect: () => void;
}

export default function VoiceCard({ voice, isSelected, onSelect }: VoiceCardProps) {
  const handlePlayPreview = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发卡片选择
    // TODO: 实现语音预览播放功能
    console.log(`Play preview for ${voice.name}`);
  };

  return (
    <Box
      onClick={onSelect}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderRadius: 2,
        cursor: 'pointer',
        backgroundColor: isSelected ? 'rgba(255, 199, 0, 0.1)' : 'transparent',
        border: isSelected ? '1px solid' : 'none',
        borderColor: isSelected ? 'primary.main' : 'transparent',
        minHeight: 72, // 固定标准高度
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
        transition: 'all 0.3s',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={voice.avatar}
          sx={{
            width: 80,
            height: 80,
            // 选中状态的边框效果
            boxShadow: isSelected
              ? '0 0 0 2px #FFC700, 0 0 8px 3px rgba(255, 199, 0, 0.3)'
              : 'none',
          }}
        />
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'semibold', color: 'textLight.main' }}>
            {voice.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'subtleLight.main' }}>
            {voice.description}
          </Typography>
        </Box>
      </Box>
      <IconButton
        onClick={handlePlayPreview}
        sx={{
          color: 'subtleLight.main',
          '&:hover': {
            color: 'primary.main',
          },
        }}
      >
        <PlayCircle sx={{ fontSize: 32 }} />
      </IconButton>
    </Box>
  );
}