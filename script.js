const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const scoreDisplay = document.getElementById('score');
const accDisplay = document.getElementById('accuracy');

let score = 0;
let isGameRunning = false;

function onResults(results) {
    // ปรับขนาดพื้นที่วาดให้พอดีกับความละเอียดจริงของกล้อง
    if (videoElement.videoWidth) {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // ไม่ต้องวาดวิดีโอซ้ำ เพราะเราใช้ <video> แสดงผลเป็นพื้นหลังอยู่แล้วเพื่อลดการกระตุก

    if (results.poseLandmarks) {
        drawPose(results.poseLandmarks);
        checkPose(results.poseLandmarks);
    }
    canvasCtx.restore();
}

function drawPose(landmarks) {
    canvasCtx.fillStyle = "#FFD700"; // เปลี่ยนสีจุดเป็นสีเหลืองทองให้ตัดกับเสื้อกาวน์
    canvasCtx.strokeStyle = "#FFFFFF"; // ขอบจุดสีขาว
    canvasCtx.lineWidth = 2;

    landmarks.forEach(point => {
        canvasCtx.beginPath();
        // ขยายขนาดจุดให้เห็นชัดเจนขึ้น
        canvasCtx.arc(point.x * canvasElement.width, point.y * canvasElement.height, 6, 0, 2 * Math.PI);
        canvasCtx.fill();
        canvasCtx.stroke();
    });
}

function checkPose(landmarks) {
    // ดึงตำแหน่งของข้อมือซ้าย(15), ข้อมือขวา(16) และ จมูก(0)
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const nose = landmarks[0];

    // เงื่อนไข: ถ้าผู้เล่นยกมือทั้งสองข้างสูงกว่าจมูก (จำลองท่ายืดเหยียด)
    if (leftWrist.y < nose.y && rightWrist.y < nose.y) {
        score += 1;
        scoreDisplay.innerText = Math.floor(score / 10); // นำคะแนนมาหารให้ค่อยๆ ขึ้น
        accDisplay.innerText = "99"; 
    } else {
        accDisplay.innerText = "0"; 
    }
}

// ตั้งค่า AI
const pose = new Pose({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`});
pose.setOptions({ 
    modelComplexity: 1, 
    smoothLandmarks: true, 
    minDetectionConfidence: 0.5, // ความมั่นใจในการเจอคน 50%
    minTrackingConfidence: 0.5 
});
pose.onResults(onResults);

// ตั้งค่ากล้อง
const camera = new Camera(videoElement, {
    onFrame: async () => { 
        if(isGameRunning) {
            await pose.send({image: videoElement}); 
        }
    },
    width: 640, 
    height: 480
});

// เริ่มเกมเมื่อกดปุ่ม
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-btn').innerText = "กำลังตรวจจับท่าทาง...";
    document.getElementById('start-btn').style.background = "#4a6f8a";
    isGameRunning = true;
    camera.start();
});
