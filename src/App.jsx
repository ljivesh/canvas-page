import {
  Environment,
  Html,
  Image,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Model as Avatar } from "./Avatar";
import { useEffect, useState, useRef } from "react";
import { useSynthesize } from "./utils/synthesizer-hook";
import { useLoadFfmpeg } from "./utils/ffmpeg-hook";
// import { fetchFile } from "@ffmpeg/ffmpeg";
import { useQueue } from "@uidotdev/usehooks";
import axios from "axios";
import backgroundImage from "./assets/background.jpg";

const ssmlTemplate = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
<voice name="__VOICE__"  >
<mstts:viseme type="FacialExpression"/>

__TEXT__
</voice>
</speak>`;

function App() {
  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const { speechSynthesizer } = useSynthesize();

  // const {ready, ffmpeg} = useLoadFfmpeg();

  const [model, setModel] = useState();

  const {
    queue: frameQueue,
    add: enqueueFrame,
    remove: dequeueFrame,
    first: firstFrame,
  } = useQueue();

  const [bufferQueue, setBufferQueue] = useState([]);

  const [readyToPlay, setReadyToPlay] = useState(false);

  const [recording, setRecording] = useState(false);

  const playHandler = () => {
    bufferQueue.forEach((frame) => enqueueFrame(frame));
    pla
    // toggleRecording();
  };

  useEffect(() => {
    const fetchVideoData = async (id) => {
      try {
        const response = await axios.post("/get-video-data", { id });

        console.log(response.data);

        const data = response.data;

        if (data) {
          console.log(data.model);
          useGLTF.preload(data.model.url);
          useGLTF.preload(data.model.animations);
          setModel(data.model);
          const ssml = ssmlTemplate
            .replace("__TEXT__", data.script)
            .replace("__VOICE__", data.voice);

          speechSynthesizer.speakSsmlAsync(
            ssml,
            (result) => {
              const blob = new Blob([result.audioData], { type: "audio/mp3" });
              recordedAudioBlobsRef.current = blob;

              setReadyToPlay(true);
            },
            (error) => {
              console.error(error);
            }
          );
        }

        return data;
      } catch (error) {
        console.error(error);

        return null;
      }
    };

    if (speechSynthesizer) {
      speechSynthesizer.visemeReceived = (s, e) => {
        const blendShapes = JSON.parse(e.animation).BlendShapes;
        setBufferQueue((prev) => [...prev, ...blendShapes]);
      };

      const search = window.location.search;
      const params = new URLSearchParams(search);
      const id = params.get("id");

      console.log(id);

      if (id) {
        fetchVideoData(id);
      }
    }
  }, [speechSynthesizer]);

  const canvasRef = useRef();
  const videoRef = useRef();
  const audioRef = useRef();
  const audioStreamRef = useRef();

  const mediaSourceRef = useRef();
  const mediaRecorderRef = useRef();
  const recordedBlobsRef = useRef();
  const recordedAudioBlobsRef = useRef();
  const sourceBufferRef = useRef();
  const streamRef = useRef();

  const recordButtonRef = useRef();
  const playButtonRef = useRef();
  const downloadButtonRef = useRef();

  // function handleSourceOpen(event) {
  //   console.log('MediaSource opened');
  //   sourceBufferRef.current = mediaSourceRef.current.addSourceBuffer('video/mp4');
  //   console.log('Source buffer: ', sourceBufferRef.current);
  // }

  // function handleDataAvailable(event) {
  //   if (event.data && event.data.size > 0) {
  //     recordedBlobsRef.current.push(event.data);
  //   }

  //   if (audioStreamRef.current && audioStreamRef.current.active) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       recordedBlobsRef.current.push(reader.result);
  //     };
  //     reader.readAsArrayBuffer(event.data);
  //   }
  // }

  // function handleStop(event) {
  //   console.log('Recorder stopped: ', event);
  //   const superBuffer = new Blob(recordedBlobsRef.current, {type: 'video/mp4'});
  //   videoRef.current.src = window.URL.createObjectURL(superBuffer); // srcObject or src check
  //   // combine();
  // }

  // function toggleRecording() {
  //   if (!recording) {
  //     setRecording(true);
  //     startRecording();
  //   } else {
  //     stopRecording();
  //     setRecording(false);
  //     recordButtonRef.current.textContent = 'Start Recording';
  //     // playButtonRef.current.disabled = false;
  //     downloadButtonRef.current.disabled = false;
  //   }
  // }

  // function startRecording() {
  //   let options = {mimeType: 'video/webm'};
  //   recordedBlobsRef.current = [];
  //   // const combinedMediaStream = new MediaStream();
  //   try {
  //     mediaRecorderRef.current = new MediaRecorder(streamRef.current);
  //   } catch (e0) {
  //     console.log('Unable to create MediaRecorder with options Object: ', e0);
  //     try {
  //       options = {mimeType: 'video/webm,codecs=vp9'};
  //       mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
  //     } catch (e1) {
  //       console.log('Unable to create MediaRecorder with options Object: ', e1);
  //       try {
  //         options = 'video/vp8'; // Chrome 47
  //         mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
  //       } catch (e2) {
  //         alert('MediaRecorder is not supported by this browser.\n\n' +
  //           'Try Firefox 29 or later, or Chrome 47 or later, ' +
  //           'with Enable experimental Web Platform features enabled from chrome://flags.');
  //         console.error('Exception while creating MediaRecorder:', e2);
  //         return;
  //       }
  //     }
  //   }
  //   console.log('Created MediaRecorder', mediaRecorderRef.current, 'with options', options);
  //   recordButtonRef.current.textContent = 'Stop Recording';
  //   // playButtonRef.current.disabled = true;
  //   downloadButtonRef.current.disabled = true;
  //   mediaRecorderRef.current.onstop = handleStop;
  //   mediaRecorderRef.current.ondataavailable = handleDataAvailable;
  //   mediaRecorderRef.current.start(100); // collect 100ms of data
  //   console.log('MediaRecorder started', mediaRecorderRef.current);
  // }

  // function stopRecording() {
  //   mediaRecorderRef.current.stop();
  //   console.log('Recorded Blobs: ', recordedBlobsRef.current);
  //   videoRef.current.controls = true;
  // }

  // function play() {
  //   videoRef.current.play();
  // }

  // function download() {
  //   const blob = new Blob(recordedBlobsRef.current, {type: 'video/mp4'});
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.style.display = 'none';
  //   a.href = url;
  //   a.download = 'test.mp4';
  //   document.body.appendChild(a);
  //   a.click();
  //   setTimeout(() => {
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);
  //   }, 100);
  // }

  // async function combine() {
  //   const videoBlob = new Blob(recordedBlobsRef.current, {type: 'video/mp4'});
  //   // const audioBlob = new Blob(recordedAudioBlobsRef.current, {type: 'audio/mp3'});
  //   const audioBlob = recordedAudioBlobsRef.current;
  //   // const url = window.URL.createObjectURL(blob);

  //   ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(audioBlob));
  //   ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(videoBlob));

  //   await ffmpeg.run('-i', 'video.mp4', '-i', 'audio.mp3', '-c', 'copy', 'output.mkv');

  //   const data = ffmpeg.FS('readFile', 'output.mkv');

  //   videoRef.current.src = window.URL.createObjectURL(new Blob([data.buffer], {type: 'video/mkv'})); // srcObject or src check

  //   // await ffmpeg.FS('writeFile', 'temp.webm', await fetchFile(new Blob(recordedBlobsRef.current, {type: 'video/mp4'})));

  // }

  // useEffect(()=> {

  //   mediaSourceRef.current = new MediaSource();
  //   mediaSourceRef.current.addEventListener('sourceopen', handleSourceOpen, false);

  //   streamRef.current = canvasRef.current.captureStream();
  //   console.log('Started stream capture from canvas element: ', streamRef.current);

  //   // recordButtonRef.current.onclick = toggleRecording;
  //   // playButtonRef.current.onclick = play;
  //   downloadButtonRef.current.onclick = download;

  //   // videoRef.current.srcObject = stream;
  // }, [])

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: '100%',
        height: '100%'
      }}
    >
      <Canvas
        ref={canvasRef}
        style={{
          width: dimensions.width, // Use state for dynamic sizing
          height: dimensions.height, // Use state for dynamic sizing
          backgroundColor: "white",
        }}
        camera={{
          position: [0, 0, 10],
          fov: 11,
        }}
      >
        <Environment preset="sunset" />
        <Image url={backgroundImage} scale={2} />
        {/* <Html scale={0.05} occlude transform position={[-0.05, 0.22, 0.01]}>
          <video width="650" muted src={"https://video-rendering-service-bucket.s3.ap-south-1.amazonaws.com/videos/vivoad.mp4"} />
        </Html> */}
        {model && (
          <Avatar
            position={[-0.6, -0.6, 1]}
            scale={0.5}
            model={model}
            currentAnimation={currentAnimation}
            lipsync={{
              firstFrame,
              removeFrame: dequeueFrame,
            }}
            setReadyToPlay={setReadyToPlay}
          />
        )}
        {/* <OrbitControls /> */}
      </Canvas>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={playHandler}
          disabled={!readyToPlay}
          ref={recordButtonRef}
        >
          Play
        </button>
      </div>
      {/* {ready ? <h2>Ffmpeg ready</h2> : <h2>Ffmpeg not ready</h2>} */}

      {/* <video style={{width: 500, height: 500}}  ref={videoRef} /> */}
      {/* <button ref={downloadButtonRef} >Download</button> */}
    </div>
  );
}

export default App;
