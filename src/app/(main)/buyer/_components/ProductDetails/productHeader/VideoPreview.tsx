import React, { useState, useRef, useEffect } from "react";
import { PlayIcon, PauseIcon } from "@/icons/Icons";

export const VideoPreview: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<SVGSVGElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVolume(Math.floor(video.volume * 100));
    };

    const handleTimeUpdate = () => {
      if (!isDraggingProgress) {
        setCurrentTime(video.currentTime);
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isDraggingProgress]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const width = rect.width;
    const newProgress = (clickPosition / width) * 100;
    setProgress(Math.min(Math.max(newProgress, 0), 100));
    const newTime = (newProgress / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressMouseDown = () => {
    setIsDraggingProgress(true);
  };

  const handleProgressMouseMove = (e: MouseEvent) => {
    if (!isDraggingProgress || !progressRef.current || !videoRef.current)
      return;
    const rect = progressRef.current.getBoundingClientRect();
    const mousePosition = e.clientX - rect.left;
    const width = rect.width;
    const newProgress = (mousePosition / width) * 100;
    const clampedProgress = Math.min(Math.max(newProgress, 0), 100);
    setProgress(clampedProgress);
    const newTime = (clampedProgress / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressMouseUp = () => {
    setIsDraggingProgress(false);
  };

  const handleVolumeClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!volumeRef.current || !videoRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const width = rect.width;
    const newVolume = (clickPosition / width) * 100;
    const clampedVolume = Math.floor(Math.min(Math.max(newVolume, 0), 100));
    setVolume(clampedVolume);
    videoRef.current.volume = clampedVolume / 100;
  };

  const handleVolumeMouseDown = () => {
    setIsDraggingVolume(true);
  };

  const handleVolumeMouseMove = (e: MouseEvent) => {
    if (!isDraggingVolume || !volumeRef.current || !videoRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const mousePosition = e.clientX - rect.left;
    const width = rect.width;
    const newVolume = (mousePosition / width) * 100;
    const clampedVolume = Math.floor(Math.min(Math.max(newVolume, 0), 100));
    setVolume(clampedVolume);
    videoRef.current.volume = clampedVolume / 100;
  };

  const handleVolumeMouseUp = () => {
    setIsDraggingVolume(false);
  };

  useEffect(() => {
    if (isDraggingProgress) {
      window.addEventListener("mousemove", handleProgressMouseMove);
      window.addEventListener("mouseup", handleProgressMouseUp);
    }
    if (isDraggingVolume) {
      window.addEventListener("mousemove", handleVolumeMouseMove);
      window.addEventListener("mouseup", handleVolumeMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleProgressMouseMove);
      window.removeEventListener("mouseup", handleProgressMouseUp);
      window.removeEventListener("mousemove", handleVolumeMouseMove);
      window.removeEventListener("mouseup", handleVolumeMouseUp);
    };
  });

  return (
    <div className="flex flex-col items-center w-[100%] mx-auto">
      <div className="relative w-full">
        <video
          ref={videoRef}
          src="/images/videoPreview.mp4"
          className="w-full h-auto rounded-none aspect-[16/9] object-cover"
          autoPlay
          loop
          controls={false}
          muted={volume === 0}
        />
        <div className="absolute top-1/2 left-1/2 cursor-pointer flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 bg-[#fefefe] rounded-full w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px]">
          <button
            onClick={togglePlayPause}
            className="focus:outline-none bg-transparent border-none cursor-pointer"
          >
            {isPlaying ? (
              <PauseIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            ) : (
              <PlayIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            )}
          </button>
        </div>
      </div>
      <div className="w-full rounded-b-[5px] bg-[#2b2b2b] flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 py-2 px-3 sm:px-4">
        <div className="w-[100%] flex items-center justify-between">
          <span className="text-[0.65rem] sm:text-xs text-[#fefefe] font-medium">
            {formatTime(currentTime)}
          </span>
          <div
            className="w-[100%] h-[3px] sm:h-[4px] bg-[#f1f1f1] rounded-full mx-2 sm:mx-3 cursor-pointer relative"
            onClick={handleProgressClick}
            ref={progressRef}
          >
            <div
              className="h-[3px] sm:h-[4px] bg-[#538e53] rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div
                className="absolute -right-5 sm:-right-6 top-1/2 transform -translate-y-1/2 w-8 sm:w-10 h-4 sm:h-5 bg-[#538e53] rounded-full flex items-center justify-center cursor-pointer shadow-md"
                onMouseDown={handleProgressMouseDown}
              >
                <span className="text-white text-[0.5rem] sm:text-[0.78rem] font-medium">
                  {formatTime(currentTime)}
                </span>
              </div>
            </div>
          </div>
          <span className="text-[0.65rem] sm:text-xs text-[#fefefe] font-medium">
            {formatTime(currentTime)}
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-[0.7rem] sm:text-sm text-[#fefefe] font-medium">
            Volume
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="6"
            viewBox="0 0 80 6"
            fill="none"
            ref={volumeRef}
            className="cursor-pointer w-[76px] sm:w-[95px] h-[5px] sm:h-[6px]"
            onClick={handleVolumeClick}
            onMouseDown={handleVolumeMouseDown}
          >
            <rect y="1" width="80" height="4" rx="2" fill="#E2E2E2" />
            <rect
              y="1"
              width={`${(volume / 100) * 80 }`}
              height="4"
              rx="2"
              fill="#538E53"
            />

            <circle
              cx={`${(volume / 100) * 80}`}
              cy="3"
              r="3"
              fill="#538E53"
              className="shadow-sm"
            />
          </svg>
          <span className="text-[0.7rem] sm:text-sm text-[#fefefe] font-medium">
            {volume}%
          </span>
        </div>
      </div>
    </div>
  );
};
