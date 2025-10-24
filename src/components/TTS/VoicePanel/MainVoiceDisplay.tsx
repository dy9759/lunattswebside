'use client';

import { Card, Box, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Voice } from '../Types';

interface MainVoiceDisplayProps {
  voice: Voice;
  isSelected: boolean;
  onClick: () => void;
}

export default function MainVoiceDisplay({ voice, isSelected, onClick }: MainVoiceDisplayProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        position: 'relative',
        backgroundColor: 'transparent',
        borderRadius: 2,
        border: '1px solid',
        borderColor: isSelected ? 'primary.main' : 'borderLight.main',
        cursor: 'pointer',
        transition: 'all 0.3s',
        minHeight: 150, // 固定最小高度
        height: 200, // 固定高度，防止被压缩
        overflow: 'hidden',
        boxShadow: isSelected
          ? '0 0 0 2px rgba(255, 199, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.12)'
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        },
        flexShrink: 0, // 关键：防止被flex压缩
      }}
    >
      {/* 背景图片 - 充满整个Card */}
      <Box
        component="img"
        src={voice.avatar}
        alt={voice.name}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
        }}
      />

      {/* 半透明遮罩层 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: isSelected
            ? 'rgba(255, 199, 0, 0.2)'
            : 'rgba(0, 0, 0, 0.3)',
          zIndex: 2,
        }}
      />

      {/* 内容覆盖层 */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          minHeight: 150,
        }}
      >
        {/* 顶部内容 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'semibold',
              color: 'white',
              borderRadius: 1,
              p: 1,
              textAlign: 'right'
            }}
          >
            {voice.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'white',
              borderRadius: 1,
              p: 0.5,
              textAlign: 'right'
            }}
          >
            {voice.description}
          </Typography>
        </Box>

        {/* 底部箭头 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ExpandMore sx={{ color: 'white', fontSize: 30 }} />
        </Box>
      </Box>
    </Card>
  );
}