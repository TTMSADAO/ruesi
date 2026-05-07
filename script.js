const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const scoreDisplay = document.getElementById('score');
const accDisplay = document.getElementById('accuracy');

let score = 0;
let isGameRunning = false;

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.poseLandmarks) {
        // วาดจุดร่างกาย
        drawPose(results.poseLandmarks);
        
        // ลอจิกการให้คะแนน: ตรวจสอบท่าทาง (เช่น ท่าแก้ปวดเมื่อยไหล่)
        checkPose(results.poseLandmarks);
    }
    canvasCtx.restore();
}

function drawPose(landmarks) {
    // วาดจุดที่สำคัญแบบมินิมอล
    canvasCtx.fillStyle = "#5d8aa8";
    landmarks.forEach(point => {
        canvasCtx.beginPath();
        canvasCtx.arc(point.x * canvasElement.width, point.y * canvasElement.height, 4, 0, 2 * Math.PI);
        canvasCtx.fill();
    });
}

function checkPose(landmarks) {
    // ตัวอย่าง: วัดความกว้างของไหล่เทียบกับระดับมือ (ใช้เป็นท่าตัวอย่าง)
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const nose = landmarks[0];

    // ถ้ามือทั้งสองข้างอยู่สูงกว่าจมูก (ท่าชูมือแก้ปวดเมื่อย)
    if (leftWrist.y < nose.y && rightWrist.y < nose.y) {
        score += 1;
        scoreDisplay.innerText = Math.floor(score / 10);
        accDisplay.innerText = "95"; // จำลองค่าความแม่นยำ
    }
}

const pose = new Pose({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`});
pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5 });
pose.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => { await pose.send({image: videoElement}); },
    width: 640, height: 480
});

document.getElementById('start-btn').addEventListener('click', () => {
    camera.start();
    isGameRunning = true;
});
