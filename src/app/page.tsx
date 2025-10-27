'use client';

import { useState } from 'react';
import {
  Box,
  Grid,
  Modal,
  useTheme,
  Typography,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  Close,
} from '@mui/icons-material';
import AudioPlayer from '@/components/AudioPlayer/AudioPlayer';
import TextComposer from '@/components/TTS/TextComposer';
import VoicePanel from '@/components/TTS/VoicePanel';
import { Voice, VoiceScene } from '@/components/TTS/Types';

export default function Home() {
  const theme = useTheme();
  const [selectedModel, setSelectedModel] = useState('Luna-2.6-Pro');
  const [text, setText] = useState('');
  const [remainingGenerations] = useState(10); // 剩余生成次数

  // 语音数据
  const voiceOptions: Voice[] = [
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

  const [currentVoice, setCurrentVoice] = useState<Voice>(voiceOptions[0]);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | undefined>('https://lunalab-res.oss-cn-hangzhou.aliyuncs.com/userAudio/female_m7SBz8yb.wav');
  const [selectedModalVoice, setSelectedModalVoice] = useState<Voice | null>(null);
  const [selectedSceneTab, setSelectedSceneTab] = useState<number>(0);
  const [selectedSceneId, setSelectedSceneId] = useState<number | null>(null);

  // 定义使用场景数据 - 12个场景，包含背景图片URL（英文版本）
  const voiceScenes: VoiceScene[] = [
    {
      id: 0,
      name: 'Advertisement Voice-over',
      icon: '📢🎬',
      description: 'Professional advertising voice services',
      imageUrl: 'https://images.unsplash.com/photo-1591115765375-afa55b8a6c77?w=400&h=225&fit=crop' // 专业录音棚
    },
    {
      id: 1,
      name: 'Audiobook Narration',
      icon: '📚📖',
      description: 'Professional audiobook narration',
      imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop' // 书籍阅读
    },
    {
      id: 2,
      name: 'Customer Service',
      icon: '🎧📞',
      description: 'Customer service voice solutions',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop' // 呼叫中心
    },
    {
      id: 3,
      name: 'Game Commentary',
      icon: '🎮🎤',
      description: 'Game narration and commentary',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop' // 游戏设备
    },
    {
      id: 4,
      name: 'Film Narration',
      icon: '🎬📽️',
      description: 'Film and program narration services',
      imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=225&fit=crop' // 电影拍摄
    },
    {
      id: 5,
      name: 'Documentary Voice-over',
      icon: '📹🌍',
      description: 'Documentary and nature narration',
      imageUrl: 'https://images.unsplash.com/photo-1603796846097-bee99e4a601f?w=400&h=225&fit=crop' // 自然风光
    },
    {
      id: 6,
      name: 'News Broadcasting',
      icon: '📰📺',
      description: 'Professional news anchor services',
      imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=225&fit=crop' // 新闻演播室
    },
    {
      id: 7,
      name: 'Educational Content',
      icon: '🎓📋',
      description: 'Educational content voice-over',
      imageUrl: 'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=400&h=225&fit=crop' // 教室场景
    },
    {
      id: 8,
      name: 'Metro Announcements',
      icon: '🚇📢',
      description: 'Metro station announcements',
      imageUrl: 'https://images.unsplash.com/photo-1473218688616-78ac61ab5ec9?w=400&h=225&fit=crop' // 地铁站
    },
    {
      id: 9,
      name: 'Bus Stop Announcements',
      icon: '🚌📍',
      description: 'Public transportation announcements',
      imageUrl: 'https://images.unsplash.com/photo-1573504945404-b36343227a43?w=400&h=225&fit=crop' // 公交车
    },
    {
      id: 10,
      name: 'Special Feature Voice-over',
      icon: '📊📽️',
      description: 'Special program and feature narration',
      imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=225&fit=crop' // 纪录片制作
    },
    {
      id: 11,
      name: 'AI Assistant Voice',
      icon: '🤖💬',
      description: 'AI assistant and smart voice solutions',
      imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=225&fit=crop' // AI科技
    }
  ];

  const handleVoiceSelect = (voice: Voice) => {
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

  const handleOpenSceneModal = () => {
    setSelectedModalVoice(currentVoice);
  };

  const handleSceneSelect = (sceneId: number, scene: VoiceScene) => {
    setSelectedSceneId(sceneId);
    console.log(`Selected scene: ${scene.name} (ID: ${sceneId})`);
    // 这里可以添加更多的场景选择逻辑
  };

  return (
    <Box sx={{
      height: '100%', // 填充父容器(Layout main)的完整高度
      maxWidth: '100vw',
      overflow: 'hidden', // 防止内容溢出
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 主要内容区域 - Grid布局 */}
      <Grid
        container
        spacing={{ xs: 2, sm: 2, md: 3 }}
        alignItems="stretch"
        sx={{
          flexGrow: 1, // 让Grid填充剩余空间
          minHeight: 0, // 允许flex收缩
          maxHeight: '100%', // 限制Grid最大高度，防止溢出
          overflow: 'hidden', // 防止Grid溢出
        }}
      >
        {/* Text-to-Speech Section - 左侧8/12 */}
        <Grid item xs={12} lg={8}>
          <TextComposer
            text={text}
            onTextChange={setText}
            onGenerate={handleGenerateAudio}
            canGenerate={text.trim().length > 0}
            remainingGenerations={remainingGenerations}
          />
        </Grid>

        {/* Voice Selection Section - 右侧4/12 */}
        <Grid
          item
          xs={12}
          lg={4}
          sx={{
            maxHeight: '100%', // 限制Grid item最大高度
            overflow: 'hidden', // 防止溢出
          }}
        >
          <VoicePanel
            selectedVoice={currentVoice}
            voices={voiceOptions}
            onVoiceSelect={handleVoiceSelect}
            onOpenSceneModal={handleOpenSceneModal}
          />
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
            width: '75vw', // 设置为页面宽度的3/4
            height: '75vh', // 设置为页面高度的3/4
            maxWidth: '95vw',
            maxHeight: '95vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: '20px',
            p: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
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
              <Button
                onClick={() => setSelectedModalVoice(null)}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'grey.200',
                  },
                }}
              >
                <Close />
              </Button>
            </Box>
          </Box>

          {/* Scene Selection Grid - 动态响应布局 */}
          <Box sx={{
            p: {
              xs: 2,
              sm: 3,
              md: 4
            },
            flex: 1, // 占据剩余的可用空间
            overflowY: 'auto',
            backgroundColor: 'grey.50',
            minHeight: 0, // 确保可以正确收缩
          }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(3, 1fr)',
                },
                gap: {
                  xs: '16px',
                  sm: '18px',
                  md: '20px',
                },
                width: '100%',
              }}
            >
              {voiceScenes.map((scene) => (
                <Card
                  key={scene.id}
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '16 / 9', // 改为更宽屏的比例
                    minHeight: '120px', // 增加最小高度以容纳背景图片
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: selectedSceneId === scene.id ? '2px solid' : 'none',
                    borderColor: 'primary.main',
                    borderRadius: 3,
                    overflow: 'hidden', // 关键：确保内容不会超出边界
                    backgroundColor: 'background.paper',

                    // 选中状态的样式
                    ...(selectedSceneId === scene.id && {
                      boxShadow: `
                        0 0 0 3px ${theme.palette.primary.main}33,
                        0 8px 24px rgba(0, 0, 0, 0.15),
                        0 0 0 1px rgba(255, 255, 255, 0.1),
                        0 0 0 1px rgba(255, 199, 0, 0.2)
                      `,
                      transform: 'translateY(-4px) scale(1.02)',
                    }),

                    // 非选中状态的悬停效果
                    ...(selectedSceneId !== scene.id && {
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 6,
                      },
                    }),

                    // 选中状态的悬停效果
                    ...(selectedSceneId === scene.id && {
                      '&:hover': {
                        transform: 'translateY(-6px) scale(1.03)',
                        boxShadow: `
                          0 0 0 4px ${theme.palette.primary.main}40,
                          0 12px 32px rgba(0, 0, 0, 0.2),
                          0 0 0 2px rgba(255, 255, 255, 0.15),
                          0 0 0 1px rgba(255, 199, 0, 0.3)
                        `,
                      },
                    }),

                    '@supports not (aspect-ratio: 16/9)': {
                      // 降级方案：不支持aspect-ratio的浏览器
                      height: '120px',
                      minHeight: '120px',
                    },
                  }}
                  onClick={() => handleSceneSelect(scene.id, scene)}
                >
                  {/* 背景图片 */}
                  <Box
                    component="img"
                    src={scene.imageUrl}
                    alt={scene.name}
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

                  {/* 半透明遮罩层 - 确保文字可读性 */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)',
                      zIndex: 2,
                    }}
                  />

                  {/* 文字内容覆盖层 */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      right: 16,
                      zIndex: 3,
                      textAlign: 'left',
                    }}
                  >
                    {/* Scene Name */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        mb: 0.5,
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                        fontSize: {
                          xs: '16px',
                          sm: '17px',
                          md: '18px',
                        },
                      }}
                    >
                      {scene.name}
                    </Typography>

                    {/* Scene Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: {
                          xs: '12px',
                          sm: '13px',
                          md: '14px',
                        },
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                        lineHeight: 1.4,
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
          <Box sx={{
            height: '25%', // 动态高度：父容器（模态框）高度的1/4
            borderTop: 'none',
            backgroundColor: 'grey.50',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0, // 防止被压缩
            minHeight: 0, // 确保flex可以正确收缩
          }}>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedModalVoice(null);
                if (selectedModalVoice) {
                  setCurrentVoice(selectedModalVoice);
                }
              }}
              sx={(theme) => ({
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: 'white',
                borderRadius: '16px', // 使用固定圆角值而不是50%
                height: '50%', // 动态高度：父容器的1/2
                width: 'auto', // 宽度由aspect-ratio自动计算
                aspectRatio: '2 / 1', // 宽高比2:1，确保宽度是高度的2倍
                '@supports not (aspect-ratio: 2/1)': {
                  // 降级方案：不支持aspect-ratio的浏览器
                  height: '50%',
                  width: '100%', // 高度的2倍 (50% * 2 = 100%)
                },
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(255, 199, 0, 0.3)',
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover': {
                  background: 'linear-gradient(45deg, #B38B00, #FF6B35)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 25px rgba(255, 199, 0, 0.4)',
                  '&:before': {
                    left: '100%',
                  },
                },
                '&:active': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 15px rgba(255, 199, 0, 0.3)',
                },
                transition: 'all 0.3s ease',
              })}
            >
              确认
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}