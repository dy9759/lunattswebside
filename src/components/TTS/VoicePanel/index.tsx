'use client';

import { Box, Typography, Card, CardContent } from '@mui/material';
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

      {/* 统一的底部容器 - 包装除标题外的所有内容 */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 'soft',
          backgroundColor: 'surfaceLight.main',
          flexGrow: 1, // 让Card填充剩余空间
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0, // 允许flex收缩
        }}
      >
        <CardContent
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            flexGrow: 1, // CardContent填充Card剩余空间
            minHeight: 0, // 允许flex收缩
          }}
        >
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
        </CardContent>
      </Card>
    </Box>
  );
}