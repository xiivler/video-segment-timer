var video1 = document.getElementById('video1');
var video2 = document.getElementById('video2');
var source1 = document.createElement('source');
var source2 = document.createElement('source');

video1.appendChild(source1);
video2.appendChild(source2);

document.getElementById('browse').style.display = "none";

//for testing
//source1.setAttribute('src', 'https://video.twimg.com/dm_video/1452366978186821633/vid/1280x720/YFuM5KvsQsxVMKO58CrwW_d-dGhTxgcnXzWNGbeVsbY.mp4?tag=1');
//source2.setAttribute('src', 'https://video.twimg.com/dm_video/1452366978186821633/vid/1280x720/YFuM5KvsQsxVMKO58CrwW_d-dGhTxgcnXzWNGbeVsbY.mp4?tag=1');

var framerate = 30;

setInterval(update, 100);

var currentStartTime = 0.5 / framerate;
var currentEndTime = 0.5 / framerate;

var cooldown = 0;

function getVideoURL() {
  parseURL(document.getElementById('URL').value);
}

function parseURL(url) {
	let srcUrl = url.replace('twitter.com', 'fxtwitter.com/dir');
  loadVideo(srcUrl);
}

var uploadVideo = function (event) {
    var file = this.files[0];
    loadVideo(URL.createObjectURL(file));
  }

document.getElementById('browse').addEventListener('change', uploadVideo, false);

function loadVideo(url) {
	source1.setAttribute('src', url);
  source2.setAttribute('src', url);
  video1.load();
  video2.load();
  currentStartTime = 0.5 / framerate;
  currentEndTime = 0.5 / framerate;
}

function update () {
	//document.getElementById('debug').innerHTML = currentStartTime + ", " + currentEndTime;
	if (cooldown > 0) {
  	cooldown--;
  }
  else {
    if (video1.paused && Math.abs(currentStartTime - video1.currentTime) > 0.001) {
      currentStartTime = Math.ceil(video1.currentTime * framerate) / framerate + 0.5 / framerate;
    	video1.currentTime = currentStartTime;
    	cooldown = 5;
      calculate();
    }
    if (video2.paused && Math.abs(currentEndTime - video2.currentTime) > 0.001) {
      currentEndTime = Math.ceil(video2.currentTime * framerate) / framerate + 0.5 / framerate;
      video2.currentTime = currentEndTime;
      cooldown = 5;
      calculate();
    }
    if (currentEndTime < currentStartTime) {
    	currentEndTime = currentStartTime;
      video2.currentTime = currentEndTime;
      cooldown = 5;
      calculate();
    }  
  } 
}

function calculate() {
  
  //get times in frames
  let rawStartFrames = Math.floor(currentStartTime * framerate);
  let rawEndFrames = Math.floor(currentEndTime * framerate);
  let rawFrames = rawEndFrames - rawStartFrames;
  
  let startSeconds = Math.floor(rawStartFrames / framerate);
  let startFrames = rawStartFrames % framerate;
  
  let startFrameTime = String(startSeconds).padStart(2, '0') + ':' + String(startFrames).padStart(2, '0');
  document.getElementById('startFrameTime').value = startFrameTime;
  
  let endSeconds = Math.floor(rawEndFrames / framerate);
  let endFrames = rawEndFrames % framerate;
  
  let endFrameTime = String(endSeconds).padStart(2, '0') + ':' + String(endFrames).padStart(2, '0');
  document.getElementById('endFrameTime').value = endFrameTime;
  
  let seconds = Math.floor(rawFrames / framerate);
  let frames = rawFrames % framerate;
  
  let frameTime = String(seconds).padStart(2, '0') + ':' + String(frames).padStart(2, '0');
  document.getElementById('frameTime').value = frameTime;
  
  if (framerate != 60) {
  	let frames60FPS = Math.round(frames / framerate * 60);
    let frameTime60FPS = String(seconds).padStart(2, '0') + ':' + String(frames60FPS).padStart(2, '0');
  	document.getElementById('frameTime60FPS').value = frameTime60FPS;
  }
  
  let hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  let milliseconds = Math.round(frames / framerate * 1000);
  
  let msTime = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0') + '.' + String(milliseconds).padStart(3, '0');
  document.getElementById('msTime').value = msTime;
}

//false for video 1, true for video 2
function frameAdvance(isVideo2, frames) {
  if (isVideo2) {
  	if (!video2.paused)
  		video2.pause();
    currentEndTime += frames / framerate;
 	  video2.currentTime = currentEndTime;
  }
  else {
  	if (!video1.paused)
  		video1.pause();
    currentStartTime += frames / framerate;
 	  video1.currentTime = currentStartTime;
  }
  calculate();
}

function secondAdvance(isVideo2, seconds) {
  if (isVideo2) {
  	if (!video2.paused)
  		video2.pause();
    currentEndTime += seconds;
 	  video2.currentTime = currentEndTime;
  }
  else {
  	if (!video1.paused)
  		video1.pause();
    currentStartTime += seconds;
 	  video1.currentTime = currentStartTime;
  }
  calculate();
}

function setStartToEnd() {
	currentStartTime = currentEndTime
  video1.currentTime = currentStartTime;
  cooldown = 5;
  calculate();
}

function changeFPS() {
	if (document.getElementById('30FPS').checked) {
  	framerate = 30;
    document.getElementById('60frameTimeParagraph').style.display = "block";
  }
  else {
  	framerate = 60;
    document.getElementById('60frameTimeParagraph').style.display = "none";
  }
  document.getElementById('FPSlabel').innerHTML = "<code>" + framerate + " FPS (ss:ff)</code>";
  currentStartTime = Math.floor(video1.currentTime * framerate) / framerate + 0.5 / framerate;
  video1.currentTime = currentStartTime;
  currentEndTime = Math.floor(video2.currentTime * framerate) / framerate + 0.5 / framerate;
  video2.currentTime = currentEndTime;
  cooldown = 5;
  calculate();
}

function changeVideoType() {
	if (document.getElementById('useURL').checked) {
  	document.getElementById('URLParagraph').style.display = "block";
    document.getElementById('browse').style.display = "none";
  }
  else {
  	document.getElementById('URLParagraph').style.display = "none";
    document.getElementById('browse').style.display = "block";
  }
}

window.addEventListener('keydown', function (evt) {
	let isVideo1 = (document.activeElement.id == 'video1');
	let isVideo2 = (document.activeElement.id == 'video2');
  if (!(isVideo1 || isVideo2))
  	return;
  if (evt.key == ',')
    frameAdvance(isVideo2, -1);
  else if (evt.key == ".")
  	frameAdvance(isVideo2, 1);  
  else if (evt.key == "<")
  	frameAdvance(isVideo2, -5);
  else if (evt.key == ">")
  	frameAdvance(isVideo2, 5);
  else if (evt.keyCode === 37) {
    if (evt.shiftKey)
    	secondAdvance(isVideo2, -5);
    else
    	secondAdvance(isVideo2, -1)
  }
  else if (evt.keyCode === 39)
  	if (evt.shiftKey)
    	secondAdvance(isVideo2, 5);
    else
    	secondAdvance(isVideo2, 1) 
});

console.log("4")
var query = window.location.search.substring(1);
var param = query.split("url=")[1];
console.log(param);

if (param !== undefined) {
	document.getElementById('URL').value = param;
  parseURL(param);
}
