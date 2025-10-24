export interface Voice {
  id: string;
  name: string;
  description: string;
  avatar: string;
}

export interface VoiceScene {
  id: number;
  name: string;
  icon: string;
  description: string;
}

export interface TextComposerProps {
  text: string;
  onTextChange: (text: string) => void;
  onGenerate: () => void;
  canGenerate: boolean;
  remainingGenerations: number;
}

export interface VoicePanelProps {
  selectedVoice: Voice;
  voices: Voice[];
  onVoiceSelect: (voice: Voice) => void;
  onOpenSceneModal: () => void;
}

export interface AudioStreamProps {
  currentVoice: Voice;
  audioUrl?: string;
}