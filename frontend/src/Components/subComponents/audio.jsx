import React, { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause } from "lucide-react";

function AudioPlayer({ audioUrl }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00')
  const [duration, setDuration] = useState('00:00')

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#3b82f6",
        progressColor: "#2563eb",
        cursorColor: "transparent",
        barWidth: 2,
        barRadius: 3,
        barGap: 3,
        height: 32,
        responsive: true,
      });

      wavesurfer.current.load(audioUrl);

      wavesurfer.current.on("ready", () => {
        const audioDuration = wavesurfer.current?.getDuration() || 0;
        setDuration(formatTime(audioDuration));
      });

      wavesurfer.current.on("finish", () => {
        setIsPlaying(false);
      });

      return () => {
        wavesurfer.current?.destroy();
      };
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center space-x-4 bg-sky-100 rounded-full p-2 w-full max-w-md">
      <button
        onClick={togglePlayPause}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <div className="flex-grow" ref={waveformRef} />
      <div className="flex-shrink-0 text-sm text-gray-600">{duration}</div>
    </div>
  );
}

export default AudioPlayer;