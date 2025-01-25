import pauseimg from "@/public/assets/images/pause.svg"
import playimg from "@/public/assets/images/play.svg"
import replayimg from "@/public/assets/images/replay.svg"
import { hightlightsSlides } from '@/data'
import { useGSAP } from '@gsap/react'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Power2 } from 'gsap'

const VideoCarousel = () => {

  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
  const videoDivRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0, 
    isLastVideo: false,
    isPlaying: false
  })

  const [loadedData, setLoadedData] = useState<(Event | React.SyntheticEvent<HTMLVideoElement, Event>)[]>([]);
  const { isEnd, startPlay, videoId, isLastVideo, isPlaying} = video

  useGSAP(()=>(
    gsap.to(("#slider"),{
      transform : `translateX(${-100*videoId}%)`,
      duration: 2,
      ease: Power2.easeInOut
    }),

    gsap.to(("#video"),{
      scrollTrigger:{
        trigger: "#video",
        start: "top center",
        toggleActions: "restart none none none"
      },
      onComplete : ()=>{
        setVideo((pre)=>({
          ...pre,
          startPlay: true,
          isPlaying: true
        }))
      }
    })
  ),[isEnd, videoId])

  useEffect(()=>{
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if(span[videoId]){

      let anim = gsap.to(span[videoId],{
        onUpdate: () => {
          
          const progress = Math.ceil(anim.progress()*100);

          if(progress!=currentProgress){
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                ? "10vw"
                : window.innerWidth <1200 
                ? "10vw"
                : "4vw"
            });

            gsap.to(span[videoId],{
              width: `${currentProgress}%`,
              backgroundColor: 'white'
            });
          }
        },

        onComplete: () => {
          if(isPlaying){
            gsap.to(videoDivRef.current[videoId],{
              width: "12px"
            });
            gsap.to(span[videoId],{
              backgroundColor: "#afafaf",
            })
          }
        }
      });

      if(videoId == 0) {
        anim.restart()
      }

      const animUpdate = ()=>{
        const currentVideo = videoRef.current[videoId]

        if(currentVideo){
          anim.progress(
            currentVideo.currentTime / hightlightsSlides[videoId].videoDuration
          );
        }
      }

      if(isPlaying) {
        gsap.ticker.add(animUpdate)
      } else {
        gsap.ticker.remove(animUpdate)
      }
    }
  }, [videoId, startPlay])

  useEffect(()=>{
    if(loadedData.length>3){
      const currentVideo = videoRef.current[videoId]
      if(currentVideo){
      if(!isPlaying){        
        currentVideo.pause();
      } else {
        startPlay && currentVideo.play()
      }
    }
    }
  }, [startPlay, videoId, isPlaying, loadedData])

  const handleProcess = (type: 'video-end' | 'video-last' | 'video-reset' | 'pause' | 'play', i?: number) =>{
    switch(type) {
      case "video-end":
        if(i !== undefined){
        setVideo((pre) => ({...pre, isEnd: true, videoId: i + 1}))};
        break;
      
      case "video-last":
        setVideo((pre)=>({...pre, isLastVideo: true}))
        break;
      
      case "video-reset":
        setVideo((pre)=>({...pre, videoId:0, isLastVideo: false}))
        break;

      case "pause":
        setVideo((pre)=>({...pre, isPlaying: !pre.isPlaying}))
        break;

      case "play":
        setVideo((pre)=>({...pre, isPlaying: !pre.isPlaying}))
        break;

      default:
        return video;
      }
    }

    const handleLoadedMetaData = (i: number, e: Event | React.SyntheticEvent<HTMLVideoElement, Event>) => setLoadedData((pre)=>[...pre, e])

  return (
  <>
    <div className='flex overflow-hidden pt-24 pb-16'>
      {hightlightsSlides.map((list, i)=>(
        <div key={list.id} id="slider" className='sm:pr-0 pr-0 pl-14 sm:pl-40 pointer-events-none'>
          <div className='video-carousel_container'>
            <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
              <video
                id='video'
                playsInline={true}
                className={`${list.id == 2 && 'translate-x-44'} pointer-events-none`}
                preload='auto'
                muted
                ref={(el)=>{videoRef.current[i] = el}}
                onEnded={()=>
                  i !== 3
                    ? handleProcess("video-end", i)
                    : handleProcess("video-last")
                }
                onPlay={()=>
                  setVideo((pre)=>({...pre, isPlaying: true}))
                }
                onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
              >
                <source src={list.video} type="video/mp4"/>
              </video>
            </div>

            <div className='absolute top-12 left-[5%] z-10'>
              {list.textLists.map((text, i)=>(
                <p key={i} className='md:text-2xl text-xl font-medium'>
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className='relative flex-center mt-3 pb-16'>
      <div className='flex-center py-5 px-7 bg-gray-800 backdrop-blur rounded-full'>
        {videoRef.current.map((_, i)=>(
          <span
            key={i}
            className='mx-2 w-3 h-3 bg-gray-400 rounded-full relative cursor-pointer'
            ref = {(el)=>{videoDivRef.current[i] = el}}
          >
            <span 
              className='absolute h-full w-full rounded-full'
              ref = {(el)=>{videoSpanRef.current[i]=el}}
            />
          </span>
        ))}
      </div>

      <button className='control-btn text-black'>
        <img 
          src={isLastVideo? replayimg : !isPlaying? playimg: pauseimg}
          alt={isLastVideo? "replay" : !isPlaying? "play" : "pause"}
          onClick={
            isLastVideo
            ? () => handleProcess("video-reset")
            : !isPlaying
            ? () => handleProcess("play")
            : () => handleProcess("pause")
          }  
        />
      </button>

    </div>
  </>
  )
}

export default VideoCarousel