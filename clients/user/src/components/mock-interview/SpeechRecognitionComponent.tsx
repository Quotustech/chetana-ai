"use client"

import React, { useEffect } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const SpeechRecognitionComponent = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // useEffect(()=>{
  //   console.log("transcript ", transcript);
  //   console.log("listening ", listening);
  //   console.log("browserSupportsSpeechRecognition ", browserSupportsSpeechRecognition);
  // },[])

  // useEffect(()=>{
  //   // console.log("transcript ", transcript);
  // },[transcript])
  

  const start = ()=>{
    SpeechRecognition.startListening({ continuous: true, language : "en-US" })
  }

  const stop = ()=>{
    SpeechRecognition.stopListening();
    resetTranscript();
  }

  return (
    <>
      SpeechRecognitionComponent
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      {/* <button onClick={resetTranscript}>Reset</button> */}
      <p className="text-white">Transcript:{transcript}</p>

       <div className="">
      
       </div>
    </>
  )
}


export default SpeechRecognitionComponent
