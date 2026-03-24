import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Music } from 'lucide-react'

interface Props {
  src: string        // đường dẫn file nhạc
  autoPlay?: boolean // tự phát khi vào web
}

export default function BackgroundMusic({ src, autoPlay = true }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [showVolume, setShowVolume] = useState(false)
  const [started, setStarted] = useState(false) // browser cần user interaction trước
  const volumeRef = useRef<HTMLDivElement>(null)

  // Autoplay sau khi user tương tác lần đầu
  useEffect(() => {
    if (!autoPlay) return
    const handleFirstInteraction = () => {
      if (!started) {
        setStarted(true)
        audioRef.current?.play()
          .then(() => setPlaying(true))
          .catch(() => {})
        // Chỉ cần trigger 1 lần
        document.removeEventListener('click', handleFirstInteraction)
        document.removeEventListener('keydown', handleFirstInteraction)
        document.removeEventListener('scroll', handleFirstInteraction)
      }
    }
    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('keydown', handleFirstInteraction)
    document.addEventListener('scroll', handleFirstInteraction)
    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
      document.removeEventListener('scroll', handleFirstInteraction)
    }
  }, [autoPlay, started])

  // Điều chỉnh volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Đóng volume slider khi click ra ngoài
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target as Node)) {
        setShowVolume(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
    setStarted(true)
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Widget nổi góc dưới trái */}
      <div className="fixed bottom-8 left-5 z-40 flex flex-col items-start gap-2">

        {/* Volume slider — hiện khi hover */}
        {showVolume && (
          <div ref={volumeRef}
            className="bg-brand-card border border-brand-border rounded-2xl px-4 py-3 shadow-2xl shadow-black/50 animate-fade-up">
            <p className="text-xs text-brand-muted mb-2 text-center">Âm lượng</p>
            <div className="flex items-center gap-2">
              <VolumeX size={12} className="text-brand-muted" />
              <input
                type="range" min="0" max="1" step="0.05"
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                className="w-24 accent-brand-yellow cursor-pointer"
              />
              <Volume2 size={12} className="text-brand-yellow" />
            </div>
            <p className="text-center text-xs text-brand-muted mt-1">{Math.round(volume * 100)}%</p>
          </div>
        )}

        {/* Main button */}
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 bg-brand-card border border-brand-border hover:border-brand-yellow/50 rounded-2xl px-3 py-2 transition-all duration-200 group shadow-lg"
            title={playing ? 'Tắt nhạc' : 'Bật nhạc'}
          >
            {/* Visualizer bars khi đang phát */}
            {playing ? (
              <div className="flex items-end gap-0.5 h-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i}
                    className="w-0.5 bg-brand-yellow rounded-full"
                    style={{
                      height: `${Math.random() * 60 + 40}%`,
                      animation: `musicBar 0.${4 + i}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <Music size={14} className="text-brand-muted group-hover:text-brand-yellow transition-colors" />
            )}
            <span className="text-xs text-brand-muted group-hover:text-white transition-colors">
              {playing ? 'Đang phát' : 'Nhạc nền'}
            </span>
          </button>

          {/* Volume button */}
          <button
            onClick={() => setShowVolume(s => !s)}
            className="w-8 h-8 rounded-xl bg-brand-card border border-brand-border hover:border-brand-yellow/50 flex items-center justify-center text-brand-muted hover:text-brand-yellow transition-colors shadow-lg"
            title="Âm lượng"
          >
            {volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
        </div>

        {/* Hint lần đầu */}
        {!started && autoPlay && (
          <p className="text-[10px] text-brand-muted ml-1 animate-pulse">
            Click bất kỳ để phát nhạc
          </p>
        )}
      </div>

      {/* CSS animation cho visualizer */}
      <style>{`
        @keyframes musicBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </>
  )
}