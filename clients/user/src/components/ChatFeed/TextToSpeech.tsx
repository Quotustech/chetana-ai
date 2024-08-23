"use client"
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaPause, FaPlay, FaVolumeUp } from 'react-icons/fa';

interface TextToSpeechProps {
  text: string;
  autoPlay?: boolean;
}
// const apikey=process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    // console.log("APIKEY",apikey)

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text ,autoPlay = false }) => {
//   const handleSpeak = async () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [pausedTime, setPausedTime] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // const apikey=process.env.OPENAI_API_KEY;
    // console.log("APIKEY",apikey)

  
    const handleSpeak = async () => {
      if (isSpeaking) {
        // Stop previous speech
        if (audioRef.current) {
          audioRef.current.pause();
        //   audioRef.current.currentTime = 0;
          setPausedTime(audioRef.current.currentTime);
          setIsSpeaking(false);
        }
        return;
      }
      if (pausedTime > 0 && audioRef.current && !isFinished) {
        // Resume from paused position
        audioRef.current.currentTime = pausedTime;
        audioRef.current.play();
        setIsSpeaking(true);
        return;
      }
      if (isFinished) {
        // Replay from the beginning
        setPausedTime(0);
        setIsFinished(false);
      }
  
      setIsSpeaking(true);
    console.log('Speech that is received', text);
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/audio/speech',
        {
          model: 'tts-1',
          voice: 'alloy',
          input: text,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
    //   const audio = new Audio(audioUrl);
    //   audio.play();
    // } catch (error) {
    //   console.error('Error during TTS API request:', error);
    // }
    if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.currentTime = pausedTime;
        audioRef.current.play();
      } else {
        const newAudioRef = new Audio(audioUrl);
        newAudioRef.currentTime = pausedTime;
        newAudioRef.play();
        audioRef.current = newAudioRef;
      }

      audioRef.current.onended = () => {
        setIsSpeaking(false);
        setPausedTime(0); // Reset paused time when playback ends
        setIsFinished(true);
    };

    } catch (error) {
      console.error("Error in text-to-speech conversion:", error);
      setIsSpeaking(false);
    }
  };

  // Handle automatic playback if autoPlay is true
  useEffect(() => {
    if (autoPlay) {
      handleSpeak();
    }
  }, [text, autoPlay]);

  // return !autoPlay ? (

  return (
    <div>
      {/* {!autoPlay && ( */}
      {/* {autoPlay ? null : ( */}
      <button onClick={handleSpeak}>
        {/* 🔊 */}
      {isSpeaking ? <><FaPause /> Pause</> : pausedTime > 0 && !isFinished ? <><FaPlay /> Resume</> : (
        <>
          <FaVolumeUp /> Listen
        </>
      )}
      </button>
       {/* )} */}
    </div>
  );
  // ): null; //for retuen !autoPlay
};

export default TextToSpeech;