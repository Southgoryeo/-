import React, { useEffect, useState } from 'react';
import { Terminal, FastForward, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';
import { sound } from '../utils/audio';

interface BootSequenceModalProps {
  onComplete: () => void;
}

export const BootSequenceModal: React.FC<BootSequenceModalProps> = ({ onComplete }) => {
  const [logIndex, setLogIndex] = useState(0);

  const bootLogs = [
    { text: '[KERNEL] Cosmo Bond Nano-OS v4.12.0-RTX Booting...', color: 'text-slate-400' },
    { text: '[INIT] 나노-결합기 객체 #CB-88204 메모리 로드 및 관절 모터 초기화 완료 (A/D walk, Space jump)', color: 'text-emerald-400' },
    { text: '[SENSORS] 광학 수용체 및 마이크로 액추에이터 동기화... 정상 (100%)', color: 'text-cyan-400' },
    { text: '[CHEM-BUS] H, O 원소 화학 공급망 링크 완료. (휴대용 키트 습득 전 결합창 대기)', color: 'text-indigo-400' },
    { text: '[ALERT] 경고: 3구역 배수구 알칼리 금속 투기로 인한 급격한 연소 반응 감지!', color: 'text-rose-400' },
    { text: '[RADIO LINK] 사수 "박 대리" 무전 채널 7.21MHz 자동 연결됨.', color: 'text-amber-400' },
    { text: '>> 박 대리: "아, 아. 마이크 테스트. 신입, 내 말 들리나? 관절에 기름칠 좀 하게 거기서 움직여봐."', color: 'text-amber-300 font-bold' },
    { text: '[STATUS] 현장 투입 준비 완료. 페트리 접시 표면에서 기동을 시작합니다.', color: 'text-cyan-300' },
  ];

  useEffect(() => {
    sound.pickup();
    const timer = setInterval(() => {
      setLogIndex((prev) => {
        if (prev < bootLogs.length) {
          sound.tick();
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 750);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (logIndex >= bootLogs.length) {
      const exitTimer = setTimeout(() => {
        sound.puzzleSolved();
        onComplete();
      }, 900);
      return () => clearTimeout(exitTimer);
    }
  }, [logIndex, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950 font-mono">
      <div className="max-w-2xl w-full bg-black/90 border border-cyan-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Terminal Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #000, #000 2px, transparent 2px, transparent 4px)',
          }}
        />

        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3 mb-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs">
            <Terminal className="w-4 h-4 animate-pulse" />
            <span className="font-bold tracking-wider">COSMO BOND NANO-BIOS v4.12 // COLD OPEN BOOT</span>
          </div>
          <button
            onClick={() => {
              sound.puzzleSolved();
              onComplete();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs transition-colors cursor-pointer"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>건너뛰기 (Skip)</span>
          </button>
        </div>

        {/* Boot Log Stream */}
        <div className="space-y-2 text-xs min-h-[220px]">
          {bootLogs.slice(0, logIndex).map((item, idx) => (
            <div key={idx} className={`${item.color} leading-relaxed animate-in fade-in duration-150`}>
              {item.text}
            </div>
          ))}
          {logIndex < bootLogs.length && (
            <div className="inline-block w-2.5 h-4 bg-cyan-400 animate-pulse align-middle ml-1" />
          )}
        </div>

        {/* Bottom Status Indicator */}
        <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>System State: INITIALIZING NANO-ASSEMBLER ({logIndex}/{bootLogs.length})</span>
          </div>
          <span className="text-slate-600">Press Space or Skip button to proceed</span>
        </div>

      </div>
    </div>
  );
};
