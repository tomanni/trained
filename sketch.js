var mic, fft, beat;

var ycellsize = 10;
var xcellsize;

var cell;

var pg;

var bgcol = 0;

var threshold = 125;
var audio;
var button;

function preload(){
  audio = loadSound('./images/tbmachines_audio_01.mp3');

}

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

      // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  pg = createGraphics(width, height);
  audio.loop();
  console.log(getMobileOperatingSystem());
  if(getMobileOperatingSystem() == "iOS") {
  button = createButton("Tap To Begin");
  button.position(windowWidth/4, windowHeight/2);
  button.mousePressed(dismissButton);
}

  cell = width / 3;

  xcellsize = width / 5;

  // mic = new p5.AudioIn();
  // mic.start();
  fft = new p5.FFT(0.01);
  fft.setInput(audio);
  beat = new p5.PeakDetect(60, 100, 0.05);
  setTimeout(videoRedirect, 20000);

}

function dismissButton(){

  button.hide();
}

function videoRedirect() {
  window.location.href = "https://vimeo.com/241888886";

}
function draw() {
  background(bgcol);
  if(!audio.isPlaying){
    fill(255);
    textSize(32);
    text("Tap to start", 50, 150);
  }

  var spectrum = fft.analyze();
  beat.update(fft);

  pg.clear();

  var i = 0;
  var yc = ycellsize;
  for (var y = 0; y < height; y += ycellsize) {
    if (spectrum[i%spectrum.length-1] > threshold) pg.fill(255-bgcol);
    else pg.noFill();

    pg.noStroke();
    pg.rectMode(CORNER);
    pg.rect(xcellsize / 2, y, xcellsize, ycellsize);

    i++;
  }

  i = 0;
  for (var y = 0; y < height; y += ycellsize) {
    if (spectrum[i%spectrum.length-1] > threshold) pg.fill(255-bgcol);
    else pg.noFill();

    pg.noStroke();
    pg.rectMode(CORNER);
    pg.rect((width / 2) - xcellsize / 2, y, xcellsize, ycellsize);
    i++;
  }

  i = 0;
  for (var y = height; y > 0; y -= ycellsize) {
    if (spectrum[i%spectrum.length-1] > threshold) pg.fill(255-bgcol);
    else pg.noFill();

    pg.noStroke();
    pg.rectMode(CORNER);
    pg.rect(width / 2, y, xcellsize / 2, ycellsize);
    i++;
  }

  i = 0;
  for (var y = height; y > 0; y -= ycellsize) {
    if (spectrum[i%spectrum.length-1] > threshold) pg.fill(255-bgcol);
    else pg.noFill();

    pg.noStroke();
    pg.rectMode(CORNER);
    pg.rect(width - xcellsize - xcellsize / 2, y, xcellsize, ycellsize);
    i++;
  }

  for (var x = 0; x < width; x += width / 3) {
    for (var y = 0; y < height; y += height / 3) {
      imageMode(CORNER);
      image(pg, x, y, width / 3, height / 3);
    }
  }

  if (beat.isDetected) {
    bgcol = 255;
    /*pushMatrix();
    pushStyle();
    blendMode(EXCLUSION);
    fill(255);
    noStroke();
    rectMode(CENTER);
    rect(width / 2, height / 2, width, height);
    popMatrix();
    popStyle();*/
  } else {
    bgcol = 0;
  }
}
