import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap, { Power2 } from 'gsap'
import { hightlightsSlides } from '@/data'
import Image from 'next/image'
gsap.registerPlugin(ScrollTrigger);
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import { pauseImg, playImg, replayImg } from '@/app/utils'

interface VideoState {
  isEnd: boolean;
  startPlay: boolean;
  videoId: number;
  isLastVideo: boolean;
  isPlaying: boolean;
}

const VideoCarousel: React.FC = () => {
  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
  const videoDivRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [loadedData, setLoadedData] = useState<Event[]>([]);

  const [video, setVideo] = useState<VideoState>({
    isEnd: false,
    startPlay: false,
    videoId: 0, 
    isLastVideo: false,
    isPlaying: false
  });

  const { videoId, isPlaying, startPlay, isLastVideo } = video;

  useGSAP(() => {
    gsap.to("#slider", { 
      transform: `translateX(${-100 * videoId}%)`, 
      duration: 2, 
      ease: Power2.easeInOut 
    });
    
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video", 
        start: "top center", 
        toggleActions: "restart none none none"
      },
      onComplete: () => setVideo(prev => ({ ...prev, startPlay: true, isPlaying: true }))
    });
  }, [videoId]);

  useEffect(() => {
    if (loadedData.length > 3) {
      const currentVideo = videoRef.current[videoId];
      if (currentVideo) {
        isPlaying && startPlay ? currentVideo.play() : currentVideo.pause();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  useEffect(() => {
    const anim = gsap.to(videoSpanRef.current[videoId], {
      onUpdate: () => {
        const progress = Math.ceil(anim.progress() * 100);
        const width = window.innerWidth < 760 ? "10vw" : window.innerWidth < 1200 ? "10vw" : "4vw";
        
        gsap.to(videoDivRef.current[videoId], { width });
        gsap.to(videoSpanRef.current[videoId], { 
          width: `${progress}%`, 
          backgroundColor: 'white' 
        });
      },
      onComplete: () => {
        if (isPlaying) {
          gsap.to(videoDivRef.current[videoId], { width: "12px" });
          gsap.to(videoSpanRef.current[videoId], { backgroundColor: "#afafaf" });
        }
      }
    });

    const animUpdate = () => {
      const currentVideo = videoRef.current[videoId];
      if (currentVideo) {
        anim.progress(currentVideo.currentTime / hightlightsSlides[videoId].videoDuration);
      }
    };

    if (isPlaying) gsap.ticker.add(animUpdate);
    else gsap.ticker.remove(animUpdate);

    return () => {
      gsap.ticker.remove(animUpdate);
    };
  }, [videoId, startPlay, isPlaying]);

  const processActions = {
    "video-end": (i: number) => ({ isEnd: true, videoId: i + 1 }),
    "video-last": () => ({ isLastVideo: true }),
    "video-reset": () => ({ videoId: 0, isLastVideo: false }),
    "pause": () => ({ isPlaying: false }),
    "play": () => ({ isPlaying: true })
  } as const;

  const handleProcess = (type: keyof typeof processActions, i?: number) => {
    const action = processActions[type];
    const update = typeof action === 'function' 
      ? action(i !== undefined ? i : 0) 
      : action;
    
    setVideo(prev => ({ ...prev, ...update }));
  };

  const handleLoadedMetaData = (i: number, e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setLoadedData(prev => [...prev, e.nativeEvent]);
  };

  return (
    <>
      <div className='flex overflow-hidden pt-24 pb-16'>
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className='sm:pr-0 pr-0 pl-14 md:pl-40 pointer-events-none'>
            <div className='video-carousel_container'>
              <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                <video
                  id='video'
                  playsInline
                  className={`${list.id === 2 ? 'translate-x-44' : ''} pointer-events-none`}
                  muted
                  ref={(el) => { videoRef.current[i] = el }}
                  onEnded={() => i !== 3 ? handleProcess("video-end", i) : handleProcess("video-last")}
                  onPlay={() => setVideo(prev => ({ ...prev, isPlaying: true }))}
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>
              <div className='absolute top-12 left-[5%] z-10'>
                {list.textLists.map((text, textIndex) => (
                  <p key={textIndex} className='md:text-2xl text-xl font-medium'>{text}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='relative flex-center mt-3 pb-16'>
        <div className='flex-center py-5 px-7 bg-gray-800 backdrop-blur rounded-full'>
          {videoRef.current.map((_, i) => (
            <span 
              key={i} 
              className='mx-2 w-3 h-3 bg-gray-400 rounded-full relative cursor-pointer' 
              ref={(el) => { videoDivRef.current[i] = el }}
            >
              <span 
                className='absolute h-full w-full rounded-full' 
                ref={(el) => { videoSpanRef.current[i] = el }} 
              />
            </span>
          ))}
        </div>
        <button className='control-btn text-black'>
          <Image 
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={() => 
              isLastVideo 
                ? handleProcess("video-reset") 
                : handleProcess(!isPlaying ? "play" : "pause")
            }
          />
        </button>
      </div>
    </>
  );
}

export default VideoCarousel;