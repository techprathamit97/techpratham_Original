import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  autoPlay?: boolean;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title = "Video",
  description = "Click to play",
  thumbnail,
  autoPlay = false,
  className = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleMouseEnter = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setTimeout(() => setShowControls(false), 2000);
    }
  };

  return (
    <div 
      className={`relative w-full h-80 rounded overflow-hidden border-4 border-red-600 shadow-lg ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isPlaying ? (
        // Thumbnail/Preview State
        <div className="relative w-full h-full cursor-pointer group" onClick={handlePlayClick}>
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              muted
              preload="metadata"
            />
          )}
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-full border border-white/40 group-hover:scale-110 transition-all duration-300 shadow-2xl">
              <Play className="text-white w-12 h-12 fill-white" />
            </div>
          </div>
          
          {/* Video Info */}
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-200">{description}</p>
          </div>
        </div>
      ) : (
        // Video Playing State
        <div className={`relative w-full h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
          <video
            src={videoUrl}
            controls={false}
            autoPlay
            muted={isMuted}
            className="w-full h-full object-cover"
            onEnded={handleVideoEnd}
          />
          
          {/* Custom Controls Overlay */}
          {showControls && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
              {/* Top Controls */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={toggleMute}
                  className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={toggleFullscreen}
                  className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setIsPlaying(false)}
                  className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200"
                >
                  ✕
                </button>
              </div>
              
              {/* Bottom Info */}
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;