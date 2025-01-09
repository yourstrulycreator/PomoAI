'use client';

import { useState, useEffect } from 'react';
import { Settings, RotateCcw, Volume2, X } from 'lucide-react';
import { CircularProgress } from './CircularProgress';

interface TimerSettings {
  workTime: number;
  shortBreak: number;
  longBreak: number;
}

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [totalSessions] = useState(4);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>({
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  // Calculate progress percentage
  const totalSeconds = minutes * 60 + seconds;
  const initialSeconds = settings.workTime * 60;
  const progress = ((initialSeconds - totalSeconds) / initialSeconds) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            setCurrentSession(prev => Math.min(prev + 1, totalSessions));
            setMinutes(settings.workTime);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, settings.workTime]);

  const handleSettingsChange = (key: keyof TimerSettings, value: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const applySettings = () => {
    setMinutes(settings.workTime);
    setSeconds(0);
    setShowSettings(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a]">
      <div className="w-[320px] bg-[#2a2a2a] rounded-2xl p-6 shadow-xl relative">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => setShowSettings(true)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <span className="text-gray-400 text-sm">
            {currentSession} of {totalSessions} sessions
          </span>
          <div className="w-5" />
        </div>

        {/* Center the timer and progress bar */}
        <div className="flex justify-center items-center my-4">
          <CircularProgress progress={progress} size={240}>
            <div className="text-6xl font-mono text-white select-none">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </CircularProgress>
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className="bg-[#3a3a3a] text-white px-8 py-2 rounded-lg hover:bg-[#4a4a4a] transition-colors"
          >
            {isActive ? '❚❚' : '▶'}
          </button>
          <button
            onClick={() => {
              setIsActive(false);
              setMinutes(settings.workTime);
              setSeconds(0);
            }}
            className="bg-[#3a3a3a] text-white px-4 py-2 rounded-lg hover:bg-[#4a4a4a] transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button className="text-gray-400 hover:text-white transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
          <span className="text-gray-400 text-sm">PomoAI</span>
          <div className="w-5" />
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="absolute inset-0 bg-[#2a2a2a] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-lg font-semibold">Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm mb-1">Work time</label>
                <input
                  type="number"
                  value={settings.workTime}
                  onChange={(e) => handleSettingsChange('workTime', parseInt(e.target.value))}
                  className="bg-[#3a3a3a] text-white px-3 py-2 rounded-lg"
                  min="1"
                  max="60"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm mb-1">Short break</label>
                <input
                  type="number"
                  value={settings.shortBreak}
                  onChange={(e) => handleSettingsChange('shortBreak', parseInt(e.target.value))}
                  className="bg-[#3a3a3a] text-white px-3 py-2 rounded-lg"
                  min="1"
                  max="30"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm mb-1">Long break</label>
                <input
                  type="number"
                  value={settings.longBreak}
                  onChange={(e) => handleSettingsChange('longBreak', parseInt(e.target.value))}
                  className="bg-[#3a3a3a] text-white px-3 py-2 rounded-lg"
                  min="1"
                  max="45"
                />
              </div>
              <button
                onClick={applySettings}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors mt-4"
              >
                Apply Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 