import React, { useState, useRef, useEffect } from "react";
import {PlayIcon, PauseIcon} from "@/icons/Icons"; // Import Play and Pause icons


export const VideoPreview = () => {
  const [progress, setProgress] = useState(0); // Progress in percentage
  const [volume, setVolume] = useState(0); // Volume in percentage
  const [isDraggingProgress, setIsDraggingProgress] = useState(false); // Track dragging state for progress
  const [isDraggingVolume, setIsDraggingVolume] = useState(false); // Track dragging state for volume
  const [isPlaying, setIsPlaying] = useState(false); // Track play/pause state
  const progressRef = useRef<HTMLDivElement>(null); // Reference to the progress bar
  const volumeRef = useRef<SVGSVGElement>(null); // Reference to the volume SVG
  const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element
  const [totalDuration, setTotalDuration] = useState(0); // Total duration in seconds
  const [currentTime, setCurrentTime] = useState(0); // Current time in seconds

  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Initialize video duration and volume on load
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setTotalDuration(video.duration);
      setVolume(Math.floor(video.volume * 100)); // Set initial volume (0-100)
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

  // Handle play/pause toggle
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

  // Handle progress bar click for seeking
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

  // Handle progress drag start
  const handleProgressMouseDown = () => {
    setIsDraggingProgress(true);
  };

  // Handle progress drag movement
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

  // Handle progress drag end
  const handleProgressMouseUp = () => {
    setIsDraggingProgress(false);
  };

  // Handle volume click
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

  // Handle volume drag start
  const handleVolumeMouseDown = () => {
    setIsDraggingVolume(true);
  };

  // Handle volume drag movement
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

  // Handle volume drag end
  const handleVolumeMouseUp = () => {
    setIsDraggingVolume(false);
  };

  // Add event listeners for dragging
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
  }, [isDraggingProgress, isDraggingVolume]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative">
        <video
          ref={videoRef}
          src="/images/videoPreview.mp4"
          width={1086}
          height={628}
          autoPlay
          loop
          className="rounded-none w-[799px] object-cover"
          controls={false}
          muted={volume === 0}
        />
        {/* Play/Pause Button Overlay */}
        <div className="absolute top-1/2 left-1/2 cursor-pointer flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 bg-[#fefefe] rounded-[100px] w-[50px] h-[50px]">
          <button
            onClick={togglePlayPause}
            className="focus:outline-none bg-transparent border-none cursor-pointer"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
      </div>
      <div className="relative -top-1.5 w-full rounded-b-[5px] max-w-[1086px] bg-[#2b2b2b] flex items-center justify-between gap-[3rem] py-2">
        {/* Progress and Timers */}
        <div className="flex-1 flex items-center justify-between p-[0.890rem]">
          {/* Left Timer */}
          <span className="text-xs text-[#fefefe] font-medium">
            {formatTime(currentTime)}
          </span>
          {/* Progress Bar */}
          <div
            className="flex-1 h-[4px] bg-[#f1f1f1] rounded-full mx-3 cursor-pointer relative"
            onClick={handleProgressClick}
            ref={progressRef}
          >
            <div
              className="h-[4px] bg-[#538e53] rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              {/* Draggable Thumb with Current Time Inside */}
              <div
                className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-12 h-6 bg-[#538e53] rounded-full flex items-center justify-center cursor-pointer shadow-md"
                onMouseDown={handleProgressMouseDown}
              >
                <span className="text-white text-xs font-medium">
                  {formatTime(currentTime)}
                </span>
              </div>
            </div>
          </div>
          {/* Right Timer */}
          <span className="text-xs text-[#fefefe] font-medium">
            {formatTime(totalDuration)}
          </span>
        </div>
        {/* Volume Control */}
        <div className="mr-[3rem] flex items-center gap-2">
          <span className="text-sm text-[#fefefe] font-medium">Volume</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="8"
            viewBox="0 0 80 8"
            fill="none"
            ref={volumeRef}
            className="cursor-pointer"
            onClick={handleVolumeClick}
            onMouseDown={handleVolumeMouseDown}
          >
            <rect y="2" width="80" height="4" rx="2" fill="#E2E2E2" />
            <rect
              y="2"
              width={`${(volume / 100) * 80}`}
              height="4"
              rx="2"
              fill="#538E53"
            />
            <circle
              cx={`${(volume / 100) * 80}`}
              cy="4"
              r="4"
              fill="#538E53"
              className="shadow-sm"
            />
          </svg>
          <span className="text-sm text-[#fefefe] font-medium">{volume}%</span>
        </div>
      </div>
    </div>
  );
};
