'use client';

import { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Avatar,
  IconButton,
  Modal,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import {
  PlayCircle,
  Refresh,
  ExpandMore,
  Close,
  VolumeUp,
  Speed,
  SettingsVoice,
  Add,
} from '@mui/icons-material';
import AudioPlayer from '@/components/AudioPlayer/AudioPlayer';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState('Luna-2.6-Pro');
  const [text, setText] = useState('');
  const [currentVoice, setCurrentVoice] = useState({
    id: 'storyteller',
    name: 'Storyteller',
    description: 'Engaging & Warm',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqDTmRxce4NpOUiQPfRpPS1WJWQd12k6KhoO7sxELYV4W9plR-wwRd7QhbJ40kP6dLOdhJgLjC6EeBA8UVOtuqSds0CSebRQZROYruXs3kB89ovRGf_rrKI10amndrMpgNgJ1WYhxxOn87Hihxoc2FZmsRzpO-IvruKEJtOGE-Q-xq8fLX8hyIyLORo9-n39EXbUgEq7THgXM4hNDs4U5FRu1w98jR5Wu37qpEOIZloFkOWVBzR4wvVvHYDJ-DjaBwGdF15HU4F2DJ',
  });
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | undefined>('https://lunalab-res.oss-cn-hangzhou.aliyuncs.com/userAudio/female_m7SBz8yb.wav');
  const [selectedModalVoice, setSelectedModalVoice] = useState<any>(null);
  const [selectedSceneTab, setSelectedSceneTab] = useState<number>(0);

  // 定义使用场景数据 - 12个场景，符合图片要求
  const voiceScenes = [
    { id: 0, name: '广告配音', icon: '📢🎬', description: '专业广告配音服务' },
    { id: 1, name: '有声读物', icon: '📚📖', description: '有声书朗读' },
    { id: 2, name: '客服', icon: '🎧📞', description: '客户服务语音' },
    { id: 3, name: '游戏解说', icon: '🎮🎤', description: '游戏旁白解说' },
    { id: 4, name: '影视解说', icon: '🎬📽️', description: '影视节目解说' },
    { id: 5, name: '纪录片', icon: '📹🌍', description: '纪录片配音' },
    { id: 6, name: '新闻播报', icon: '📰📺', description: '新闻主播播报' },
    { id: 7, name: '教学课件', icon: '🎓📋', description: '教学内容配音' },
    { id: 8, name: '地铁广播', icon: '🚇📢', description: '地铁到站广播' },
    { id: 9, name: '公交到站广播', icon: '🚌📍', description: '公交车报站' },
    { id: 10, name: '专题片', icon: '📊📽️', description: '专题片配音' },
    { id: 11, name: '智能助手', icon: '🤖💬', description: 'AI智能助手语音' }
  ];

  const voiceOptions = [
    {
      id: 'storyteller',
      name: 'Storyteller',
      description: 'Engaging & Warm',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqDTmRxce4NpOUiQPfRpPS1WJWQd12k6KhoO7sxELYV4W9plR-wwRd7QhbJ40kP6dLOdhJgLjC6EeBA8UVOtuqSds0CSebRQZROYruXs3kB89ovRGf_rrKI10amndrMpgNgJ1WYhxxOn87Hihxoc2FZmsRzpO-IvruKEJtOGE-Q-xq8fLX8hyIyLORo9-n39EXbUgEq7THgXM4hNDs4U5FRu1w98jR5Wu37qpEOIZloFkOWVBzR4wvVvHYDJ-DjaBwGdF15HU4F2DJ',
    },
    {
      id: 'marcus',
      name: 'Marcus',
      description: 'Deep, authoritative, narrative',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc_q5lKI96x0VBlx739jZGNOTosws8ewD-vgIan_rAhVz-prn32Tbb1IXYuVNgSBksRLzZioP7ppJtkFuspsOo4n_MKd2P0JhylEQ8Yr3UGuo1_7XL2eh0OGBG1cOfhv-ECSSFwYP7pnN9hF15L5ecSnrgIYX27CXQN7OtqncyVAa4_q_UqkfznIu2wsKzPzWHy36KzZtFXnYK2CyQA9Jd2yGwdGvyN1ox5BaQiSd3QJPUSSp5FdHVjA7evdtlPwQbDmlUBTo7d-qa',
    },
    {
      id: 'aria',
      name: 'Aria',
      description: 'Clear, professional, corporate',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlpThoYNHFrLIBRbsVGrd_5ry_K_DKy4UW3m5LLa9pC7TUkGPzbUoDPlDjEWJXEyT1dofOklhP9tCHB-CsyuN5RS6WWvgro8g3-59fx1wRJZE3r8w96hpSAsOv0AdS0OnpJfu07PXrU2GmRu9YA8JYK6nMKs4jNFLy7oihMYa-MU7uZMnRg1UEeQxx54YUPQ_v6hBV2J-VMQ-D7Ehswt9V9gEyyJcuvxUq-8YvcikJLGbyMDMZZMXYrnrDT5tEwLoF9bzLE4hxoUhh',
    },
    {
      id: 'zoe',
      name: 'Zoe',
      description: 'Youthful, energetic, conversational',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUpv7D5u3r6RUso8r_8tsHd_o9_AlBNWBQAEzg3cLsBBHNSg2r0x7RVZqWqYgLjTAbh26pLigLve5BlXbdsDZHRSv1ZubxGtTVmovTerCEbkFFOG8pklmTgQ8MPmcfXegVn9qoYa_54BVeZebd9tpU2OuWMaAc7wRn86V-XZ5R8znk2BlIRX4UZL0a3nOjUQ7Lriofuyxb6piHJkFPF8JFSBDokLflLYisu0gqU2bJghyZVoG3ryp3TUA4oNOdcT4Co6iZYLkU4AV1',
    },
    {
      id: 'leo',
      name: 'Leo',
      description: 'Friendly, calm, explainer',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3_ukyNZI6oqZ_wWTmUN1YHHLqyt3N0amhgDMS7-K1bL_QznI8ySWdii63nVLOl7CSDfl-GjDWaDr1Ybx52dt_M4QwQwJ1r5OGrJTRo7JwcaOpYimmJDX0JAMXRSsaNSep_mtZP_8vQ_hIqFUF9RLqjn50p853xfTFdgr7GVtRCtf6Ngej8_DanY7iIb2NPbMUy4sdErbwH7B9fs-sbB_tAqSP8lXPClFXSd0tVdFlQylRAWjvsPbJXJp4W6a8-hTDClZWvL0pLnqN',
    },
  ];

  const handleVoiceSelect = (voice: any) => {
    setCurrentVoice(voice);
  };

  const handleGenerateAudio = () => {
    // 模拟音频生成，实际项目中这里会调用 API
    if (text.trim()) {
      // 使用一个示例音频 URL 来演示播放功能
      const demoAudioUrl = 'https://lunalab-res.oss-cn-hangzhou.aliyuncs.com/userAudio/female_m7SBz8yb.wav';
      setGeneratedAudioUrl(demoAudioUrl);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={4} alignItems="flex-start">
        {/* Text-to-Speech Section */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'textLight.main' }}>
                Text-to-Speech
              </Typography>
            </Box>

            {/* Text Input Card */}
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 'soft',
                backgroundColor: 'surfaceLight.main',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <TextField
                  multiline
                  rows={15}
                  fullWidth
                  placeholder="Enter your text here to generate natural, expressive speech. Our AI brings your words to life!"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      fontSize: '1rem',
                      '&::placeholder': {
                        color: 'subtleLight.main',
                      },
                    },
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, px: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'subtleLight.main' }}>
                    {text.length} / 500 characters
                  </Typography>
                  <Button
                    startIcon={<Refresh />}
                    sx={{
                      color: 'primary.main',
                      fontWeight: 'medium',
                      '&:hover': {
                        color: 'primary.dark',
                      },
                    }}
                  >
                    Sample Sentences
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: 'subtleLight.main' }}>
                10 generations remaining today
              </Typography>
              <Button
                variant="contained"
                onClick={handleGenerateAudio}
                disabled={!text.trim()}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'black',
                  fontWeight: 'semibold',
                  py: 2,
                  px: 4,
                  borderRadius: 8,
                  boxShadow: 2,
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    transform: 'scale(1.05)',
                  },
                  '&:disabled': {
                    backgroundColor: 'grey.300',
                    color: 'grey.500',
                  },
                  transition: 'all 0.3s',
                }}
              >
                Generate
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Voice Selection Section */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: 'textLight.main',
              height: '40px', // 匹配左侧Header的高度
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Voice Selection
          </Typography>

            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 'soft',
                backgroundColor: 'surfaceLight.main',
              }}
            >
              <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Selected Voice */}
                <Card
                  onClick={() => {
                    handleVoiceSelect(voiceOptions[0]);
                    setSelectedModalVoice(voiceOptions[0]);
                  }}
                  sx={{
                    position: 'relative',
                    backgroundColor: 'transparent',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: currentVoice.id === 'storyteller' ? 'primary.main' : 'borderLight.main',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    minHeight: 150,
                    overflow: 'hidden',
                    boxShadow: currentVoice.id === 'storyteller'
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
                    src={voiceOptions[0].avatar}
                    alt={voiceOptions[0].name}
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
                      backgroundColor: currentVoice.id === 'storyteller'
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
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          borderRadius: 1,
                          p: 1,
                          textAlign: 'center'
                        }}
                      >
                        {voiceOptions[0].name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'white',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          borderRadius: 1,
                          p: 0.5,
                          textAlign: 'center'
                        }}
                      >
                        {voiceOptions[0].description}
                      </Typography>
                    </Box>

                    {/* 底部箭头 */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <ExpandMore sx={{ color: 'white', fontSize: 30 }} />
                    </Box>
                  </Box>
                </Card>

                {/* Other Voices */}
                {voiceOptions.slice(1).map((voice) => (
                  <Box
                    key={voice.id}
                    onClick={() => handleVoiceSelect(voice)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: 2,
                      cursor: 'pointer',
                      backgroundColor: currentVoice.id === voice.id ? 'rgba(255, 199, 0, 0.1)' : 'transparent',
                      border: currentVoice.id === voice.id ? '1px solid' : 'none',
                      borderColor: currentVoice.id === voice.id ? 'primary.main' : 'transparent',
                      minHeight: 72,
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
                          width: 48,
                          height: 48,
                          // 恢复为圆形（默认50%）
                          boxShadow: currentVoice.id === voice.id
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
                ))}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Audio Player Component */}
      <AudioPlayer
        currentVoice={currentVoice}
        audioUrl={generatedAudioUrl}
      />

      {/* Voice Detail Modal */}
      <Modal
        open={!!selectedModalVoice}
        onClose={() => setSelectedModalVoice(null)}
        aria-labelledby="voice-modal-title"
        aria-describedby="voice-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 1500,
            maxWidth: '95vw',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: '20px',
            p: 0,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              borderBottom: 'none',
              backgroundColor: 'grey.50',
              color: 'text.primary',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h5" sx={{ flexGrow: 1, textAlign: 'left', pl: 1 }}>
                场景选择
              </Typography>
              <IconButton
                onClick={() => setSelectedModalVoice(null)}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'grey.200',
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>

          {/* Scene Selection Grid - 3列布局 */}
          <Box sx={{ p: 4, maxHeight: '60vh', overflowY: 'auto', backgroundColor: 'grey.50' }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '60px 24px',
              }}
            >
              {voiceScenes.map((scene) => (
                <Card
                  key={scene.id}
                  sx={{
                    p: 2,
                    height: 'auto',
                    minHeight: 160,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    borderRadius: 3,
                    backgroundColor: 'background.paper',
                    gap: 2,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                      backgroundColor: 'primary.50',
                    },
                    '&:active': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => {
                    // 这里可以添加选择场景的逻辑
                    console.log(`Selected scene: ${scene.name}`);
                  }}
                >
                  {/* 左侧图标区域 */}
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      flexShrink: 0,
                    }}
                  >
                    {scene.icon}
                  </Box>

                  {/* 右侧文字区域 */}
                  <Box sx={{ flexGrow: 1 }}>
                    {/* Scene Name */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                        mb: 0.5,
                      }}
                    >
                      {scene.name}
                    </Typography>

                    {/* Scene Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.875rem',
                      }}
                    >
                      {scene.description}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>

            </Box>

          {/* Action Buttons */}
          <Box sx={{ p: 9, borderTop: 'none', backgroundColor: 'grey.50', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedModalVoice(null);
                setCurrentVoice(selectedModalVoice);
              }}
              sx={{
                backgroundColor: 'primary.main',
                color: 'background.paper',
                borderRadius: '24px',
                px: 5,
                py: 1.75,
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              确认
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}