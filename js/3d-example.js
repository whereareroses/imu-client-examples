let modelObj; // setup initializes this to a p5.js 3D model
let sensorData;
let samples = [];
let pre;
let rightcount  = 0;
let leftcount = 0;

function preload() {
    modelObj = loadModel('models/stickman.obj', true);
    arrowr = loadImage("arrow.png")
    arrowl = loadImage('arrow2.png')
    sound = loadSound('ding.mp3')
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    imuConnection.onSensorData((device) => {
        sensorData = device.data;

        if(samples.length < 200){
          samples.push(sensorData.euler[2])
        }
        else{
          pre = samples.shift()
          samples.push(sensorData.euler[2])
        }
    });
}

function draw() {
    background("navy");
    noStroke();
    lights();
    orbitControl();

    let locX = mouseX - height / 2;
    let locY = mouseY - width / 2;
    ambientLight(50);
    directionalLight(255, 0, 0, 0.25, 0.25, 0);
    pointLight(0, 0, 255, locX, locY, 250);

    if (!sensorData) {
        return;
    }

    applyMatrix.apply(null, sensorData.orientationMatrix);
    if(samples.length == 200){
      if( (samples[0] - samples[199]) < -90){
        leftcount +=1
        samples.length = 0
        sound.play()
      }
      if( (samples[0] - samples[199]) > 90){
        rightcount +=1
        samples.length = 0
        sound.play()
      }
    }
    (0,windowWidth/4),(0,windowHeight/2)
    for(let i=0;i<=leftcount;i++){
      if (50*i+10 < windowWidth/4){image(arrowl,10 + 50*i,10,30,30)}
      else if(50*i+10 < windowWidth/2){image(arrowl,10 + 50*i - windowWidth/4,60,30,30)}
      else if(50*i+10 < windowWidth/4*3){image(arrowl,10 + 50*i - windowWidth/2,110,30,30)}
      else{
        image(arrowl,10 + 50*i - windowWidth/4*3,160,30,30)
      }
      }
    for(let i=0;i<=rightcount;i++){
      if (50*i+10 < windowWidth/4){image(arrowr,-(10 + 50*i),10,30,30)}
      else if(50*i+10 < windowWidth/2){image(arrowr,- (10 + 50*i - windowWidth/4),60,30,30)}
      else if(50*i+10 < windowWidth/4*3){image(arrowr,- (10 + 50*i - windowWidth/2),110,30,30)}
      else{
        image(arrowr,- (10 + 50*i - windowWidth/4*3),160,30,30)
      }

    }



    // Fade the model out, if the sensor data is stale
    let currentTime = new Date();
    let age = max(0, currentTime - sensorData.receivedAt - 250);
    let alpha = max(5, 255 - age / 10);
    fill(255, 255, 255, alpha);

    // Render the model
    noStroke();
    ambientMaterial(250);
    model(modelObj);
}
