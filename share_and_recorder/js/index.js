const VIDEO_CONFIG = {
  audio: true,
  video: true,
};
let recorder;
let chunks = [];

const backgroundImg = document.querySelector(".no-signal");
const videoEle = document.getElementById("video-screen");
const labelRecord = document.getElementById("record-label");
const [btnStop, btnStart, btnRecord, btnPinP] =
  document.querySelectorAll(".action div");

btnStart.addEventListener("click", async () => {
  try {
    const sharedScreen =
      (await navigator.mediaDevices.getDisplayMedia(VIDEO_CONFIG)) || null;
    videoEle.srcObject = sharedScreen;

    if (!backgroundImg.classList.contains("d-none")) {
      backgroundImg.classList.add("d-none");
    }
  } catch (error) {
    console.log(error.message);
  }
});

btnStop.addEventListener("click", async () => {
  if (!videoEle.srcObject) {
    return;
  }
  let tracks = videoEle.srcObject.getTracks();
  tracks.forEach((track) => track.stop());
  videoEle.srcObject = null;

  if (backgroundImg.classList.contains("d-none")) {
    backgroundImg.classList.remove("d-none");
  }
});

btnRecord.addEventListener("click", async (e) => {
  const isRecording = btnRecord.classList.contains("recording");
  if (!videoEle.srcObject) {
    return;
  }

  if (isRecording) {
    btnRecord.classList.remove("recording");
    labelRecord.innerText = "Processing...";
    stop();
    return;
  }
  btnRecord.classList.add("recording");
  labelRecord.innerText = "Recording...";
  start();
});

btnPinP.addEventListener("click", createPicInPic);

async function start() {
  console.log("recorder started");
  let stream;
  if (videoEle.srcObject) {
    stream = videoEle.srcObject;
  } else {
    stream = await navigator.mediaDevices.getDisplayMedia(VIDEO_CONFIG);
    videoEle.srcObject = sharedScreen;
  }
  recorder = new MediaRecorder(stream, {
    mimeType: "video/webm;codecs=vp8,opus",
  });

  recorder.start(1000);

  recorder.ondataavailable = ({ data }) => {
    console.log("Pushing data");
    if (data.size > 0) {
      chunks.push(data);
    }
  };
  recorder.onstop = confirmDownload;
}

function stop() {
  if (!recorder) {
    return;
  }
  console.log("recorder stopped");
  recorder.stop();
}

function confirmDownload() {
  const videoName =
    prompt("Enter a name for your video clip:")?.trim() ||
    `video-${new Date().getTime()}`;

  const blob = new Blob(chunks);

  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.style = "display: none";
  link.href = blobUrl;
  link.download = `${videoName}.webm`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(blobUrl);
  chunks = [];

  labelRecord.innerText = "Record";

  if (recorder) {
    recorder.ondataavailable = undefined;
    recorder.onstop = undefined;
    recorder = undefined;
  }
}

function createPicInPic() {
  if (!videoEle.srcObject) {
    return;
  }

  videoEle.requestPictureInPicture();
}
