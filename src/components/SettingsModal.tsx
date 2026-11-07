import React from 'react';
import { GameSettings } from '../types/game';
import { Volume2, VolumeX, Sliders, Monitor, Sparkles, X, RotateCcw, Play } from 'lucide-react';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const handleVolumeChange = (vol: number) => {
    onUpdateSettings({ ...settings, masterVolume: vol });
    sound.setVolume(vol / 100);
  };

  const handleMuteToggle = () => {
    const nextMute = !settings.isMuted;
    onUpdateSettings({ ...settings, isMuted: nextMute });
    sound.setMuted(nextMute);
    if (!nextMute) {
      sound.pickup();
    }
  };

  const handleResetDefaults = () => {
    const defaults: GameSettings = {
      masterVolume: 75,
      isMuted: false,
      screenShake: true,
      scanlines: true,
      particleQuality: 'high',
    };
    onUpdateSettings(defaults);
    sound.setVolume(0.75);
    sound.setMuted(false);
    sound.pickup();
  };

  const testAudio = () => {
    sound.pickup();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col font-sans">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-mono">환경 설정 (SYSTEM SETTINGS)</h2>
              <p className="text-xs text-slate-400">코스모 본드 나노-결합기 시스템 파라미터 조정</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-6 text-sm text-slate-200">
          
          {/* Sound & Audio Group */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Volume2 className="w-4 h-4" /> 오디오 및 사운드 효과
              </span>
              <button
                onClick={testAudio}
                className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3" /> 사운드 테스트
              </button>
            </div>

            {/* Volume Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">마스터 볼륨 (Master Volume)</span>
                <span className="font-mono text-cyan-400 font-bold">{settings.masterVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.masterVolume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                disabled={settings.isMuted}
                className="w-full accent-cyan-500 cursor-pointer disabled:opacity-40"
              />
            </div>

            {/* Mute Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2.5">
                {settings.isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
                <div>
                  <div className="text-xs font-semibold text-white">음소거 모드 (Mute Audio)</div>
                  <div className="text-[11px] text-slate-400">모든 신디사이저 효과음 및 환경음 차단</div>
                </div>
              </div>
              <button
                onClick={handleMuteToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  settings.isMuted ? 'bg-rose-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.isMuted ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Graphics & Effects Group */}
          <div className="space-y-3">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Monitor className="w-4 h-4" /> 디스플레이 & 시각 효과
              </span>
            </div>

            {/* Screen Shake */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-white">화면 흔들림 효과 (Screen Shake)</div>
                <div className="text-[11px] text-slate-400">폭발(H₂) 및 충격 반응 시 카메라 진동 연출</div>
              </div>
              <button
                onClick={() =>
                  onUpdateSettings({ ...settings, screenShake: !settings.screenShake })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  settings.screenShake ? 'bg-cyan-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.screenShake ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Scanlines Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-white">레트로 CRT 주사선 (Scanlines)</div>
                <div className="text-[11px] text-slate-400">나노 현미경 관측 모니터 스타일 스캔라인 필터</div>
              </div>
              <button
                onClick={() =>
                  onUpdateSettings({ ...settings, scanlines: !settings.scanlines })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  settings.scanlines ? 'bg-cyan-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.scanlines ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Particle Density */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-semibold text-white">화학 반응 파티클 품질</div>
                  <div className="text-[11px] text-slate-400">화재, 불티, 수증기 파티클 생성 밀도</div>
                </div>
              </div>
              <div className="flex gap-1">
                {(['low', 'normal', 'high'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => onUpdateSettings({ ...settings, particleQuality: q })}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded cursor-pointer transition-colors ${
                      settings.particleQuality === q
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {q.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>기본값 초기화</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            설정 저장 및 닫기
          </button>
        </div>

      </div>
    </div>
  );
};
