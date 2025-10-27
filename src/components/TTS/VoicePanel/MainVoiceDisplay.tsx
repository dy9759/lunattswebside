'use client';

import { Card, Box, Typography } from '@mui/material';
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
        height: 180, // 减少固定高度，为VoiceList留出更多空间
        overflow: 'hidden',
        flexShrink: 0, // 确保不会被压缩
        boxShadow: isSelected
          ? '0 0 0 2px rgba(255, 199, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.12)'
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        },
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
          width: '100%',
          aspectRatio: '2 / 1', // 宽高比2:1，高度为宽度的一半
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 120, // 确保最小可用高度
        }}
      >
        {/* 顶部占位 - 保持布局平衡 */}
        <Box />

        {/* 左下对齐的文字内容 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%' }}>
          {/* 标题和图标在同一行 */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'semibold',
                color: 'white',
                borderRadius: 1,
                p: 1,
                textAlign: 'left',
                fontSize: '18px'
              }}
            >
              {voice.name}
            </Typography>

            {/* Switch图标 */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 20,
                height: 20,
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                zIndex: 4, // 确保在最上层
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:active': {
                  borderRadius: '2px',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                }
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M5.24492 3.34774C5.4731 3.06615 5.42979 2.6529 5.1482 2.42472C4.8666 2.19654 4.45335 2.23985 4.22517 2.52144L2.14736 5.08569C1.98808 5.28227 1.95598 5.5529 2.06487 5.78127C2.17375 6.00965 2.40423 6.15509 2.65723 6.15509L11.5937 6.15509C11.9561 6.15509 12.2499 5.86128 12.2499 5.49884C12.2499 5.13641 11.9561 4.84259 11.5937 4.84259H4.03364L5.24492 3.34774Z"
                  fill="white"
                />
                <path
                  d="M9.00624 11.1097C8.77806 11.3913 8.82137 11.8045 9.10296 12.0327C9.38456 12.2609 9.79781 12.2176 10.026 11.936L12.1038 9.37173C12.2631 9.17516 12.2952 8.90453 12.1863 8.67615C12.0774 8.44778 11.8469 8.30233 11.5939 8.30233L2.65747 8.30233C2.29503 8.30233 2.00122 8.59615 2.00122 8.95858C2.00122 9.32102 2.29503 9.61483 2.65747 9.61483L10.2175 9.61483L9.00624 11.1097Z"
                  fill="white"
                />
              </svg>
            </Box>
          </Box>

          {/* 描述文字单独一行，左对齐 */}
          <Typography
            variant="body2"
            sx={{
              color: 'white',
              borderRadius: 1,
              p: 1, // 8px padding (MUI spacing: 8px × 1 = 8px)
              textAlign: 'left',
              fontSize: '12px',
              width: '100%', // 确保占满宽度
            }}
          >
            {voice.description}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}