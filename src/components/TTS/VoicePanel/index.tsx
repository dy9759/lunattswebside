'use client';

import { Box, Typography } from '@mui/material';
import MainVoiceDisplay from './MainVoiceDisplay';
import VoiceList from './VoiceList';
import { VoicePanelProps } from '../Types';

export default function VoicePanel({
  selectedVoice,
  voices,
  onVoiceSelect,
  onOpenSceneModal,
}: VoicePanelProps) {
  const handleMainVoiceClick = () => {
    onVoiceSelect(voices[0]); // Storyteller as default
    onOpenSceneModal();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        flexGrow: 1, // 添加自适应填充
        minHeight: 0, // 允许flex收缩
        height: '100%', // 确保占满可用高度
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          color: 'textLight.main',
          height: '40px', // 匹配左侧Header的高度
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0, // 防止被压缩
        }}
      >
        Voice Selection
      </Typography>

      {/* 主语音卡片 - 固定高度 */}
      <MainVoiceDisplay
        voice={voices[0]}
        isSelected={selectedVoice.id === voices[0].id}
        onClick={handleMainVoiceClick}
      />

      {/* 语音列表 - 自适应剩余高度 */}
      <VoiceList
        voices={voices.slice(1)} // 排除第一个主语音
        selectedVoiceId={selectedVoice.id}
        onVoiceSelect={onVoiceSelect}
      />
    </Box>
  );
}