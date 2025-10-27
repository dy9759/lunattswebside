'use client';

import { useState } from 'react';
import { Box, Typography, Card, CardContent, CardHeader, useTheme } from '@mui/material';
import MainVoiceDisplay from './MainVoiceDisplay';
import VoiceList from './VoiceList';
import { VoicePanelProps } from '../Types';

export default function VoicePanel({
  selectedVoice,
  voices,
  onVoiceSelect,
  onOpenSceneModal,
}: VoicePanelProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'voice' | 'settings'>('voice');
  const handleMainVoiceClick = () => {
    onVoiceSelect(voices[0]); // Storyteller as default
    onOpenSceneModal();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        flexGrow: 1, // 添加自适应填充
        minHeight: 0, // 允许flex收缩
        height: '100%', // 确保占满可用高度
      }}
    >
      {/* 统一的语音选择容器 - 包含标题和所有内容 */}
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
        <CardHeader
          title={
            <Box sx={{ display: 'flex', width: '100%' }}>
              {/* 左侧选框 - Voice Selection */}
              <Box
                onClick={() => setActiveTab('voice')}
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  py: 1,
                  px: 2,
                  cursor: 'pointer',
                  borderBottom: activeTab === 'voice'
                    ? `2px solid ${theme.palette.primary.main}`
                    : `2px solid transparent`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: activeTab === 'voice' ? "textLight.main" : "subtleLight.main",
                    fontSize: "1.125rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "40px"
                  }}
                >
                  Voice Selection
                </Typography>
              </Box>

              {/* 右侧选框 - Settings */}
              <Box
                onClick={() => setActiveTab('settings')}
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  py: 1,
                  px: 2,
                  cursor: 'pointer',
                  borderBottom: activeTab === 'settings'
                    ? `2px solid ${theme.palette.primary.main}`
                    : `2px solid transparent`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: activeTab === 'settings' ? "textLight.main" : "subtleLight.main",
                    fontSize: "1.125rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "40px"
                  }}
                >
                  Settings
                </Typography>
              </Box>
            </Box>
          }
          sx={{
            px: 3,  // 匹配CardContent的padding
            pt: 2,  // 顶部padding调整
            pb: 1,  // 减少底部padding
            '& .MuiCardHeader-title': {
              width: '100%'  // 确保title占满整个宽度
            }
          }}
        />
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