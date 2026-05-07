const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const scoreDisplay = document.getElementById('score');
const holdTimerDisplay = document.getElementById('hold-timer');
const posOverlay = document.getElementById('position-overlay');
const videoWrapper = document.querySelector('.video-wrapper');
const posInstructionText = document.getElementById('pos-instruction-text');
const posInstructionBanner = document.getElementById('position-instruction');

// Audio elements
const bgMusic = document.getElementById('bg-music');
const startChime = document.getElementById('start-chime');
const successSound = document.getElementById('success-sound');
let isSoundOn = true;

// Game State
let score = 0;
let isGameRunning = false;
let isDetectedBody = false;

// ท่าฤๅษีดัดตนที่ต้องการตรวจสอบ (ตัวอย่าง: ท่าชูมือ)
const POSE_TYPE = {
    RAISE_HANDS: 'RAISE_HANDS' // ชูมือสองข้างเหนือจมูก
};

let currentPoseType = POSE_TYPE.RAISE_HANDS;
let isHoldingCurrentPose = false;
let currentTimeHoldingMsec = 0; // มิลลิวินาที
const REQUIRED_HOLD_TIME_MSEC = 3000; // 3 วินาที

// ฟังก์ชันเมื่อ MediaPipe ประมวลผลเสร็จสิ้น
function onResults(results) {
    if (!isGameRunning) return;

    // ปรับขนาดพื้นที่วาดให้พอดีกับความละเอียดจริงของกล้อง
    if (videoElement.videoWidth) {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.poseLandmarks) {
        // วาดจุดร่างกาย
        drawPose(results.poseLandmarks);
        
        // 1. วิเคราะห์ตำแหน่งและทิศทาง (Proximity & Center)
        isDetectedBody = providePositionFeedback(results.poseLandmarks);

        // 2. ถ้าตรวจจับได้สมบูรณ์ (Ready)
        if (isDetectedBody) {
            updateUIReady();

            // 3. ตรวจสอบเงื่อนไขท่าทางฤๅษีดัดตน
            const isPoseCorrect = checkPoseConditions(results.poseLandmarks, currentPoseType);
            
            // 4. การจัดการค้างท่า (Hold Logic)
            handleHoldLogic(isPoseCorrect, results.image);
        } else {
            updateUINotReady();
        }
    } else {
        updateUINotReady();
    }
    canvasCtx.restore();
}

function drawPose(landmarks) {
    canvasCtx.fillStyle = "#FFD700"; // จุดสีเหลืองทอง
    canvasCtx.strokeStyle = "#FFFFFF"; // ขอบจุดสีขาว
    canvasCtx.lineWidth = 2;

    landmarks.forEach(point => {
        canvasCtx.beginPath();
        canvasCtx.arc(point.x * canvasElement.width, point.y * canvasElement.height, 5, 0, 2 * Math.PI);
        canvasCtx.fill();
        canvasCtx.stroke();
    });
}

// 1. วิเคราะห์ตำแหน่ง: ออกห่าง เข้าใกล้ ซ้าย ขวา
function providePositionFeedback(landmarks) {
    const nose = landmarks[0];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    // ตรวจสอบ Proximity (ระยะห่าง): วัดความกว้างของไหล่เทียบกับความกว้างของเฟรม
    const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
    if (shoulderWidth > 0.7) { // ใกล้ไป
        setFeedbackText("🛑 เดินออกห่างอีกนิด เพื่อความแม่นยำ");
        return false;
    } else if (shoulderWidth < 0.2) { // ไกลไป
        setFeedbackText("🚶 เดินเข้าใกล้เฟรม เพื่อความแม่นยำ");
        return false;
    }

    // ตรวจสอบ Center (ซ้าย/ขวา): วัดพิกัด x ของจมูก
    // หมายเหตุ: หน้าจอสะท้อน (Mirrored) จึงต้องสลับซ้าย/ขวา
    if (nose.x < 0.35) { // ทางซ้ายของเฟรม
        setFeedbackText("🚶 เดินไปทางขวา เพื่อเข้ากรอบ");
        return false;
    } else if (nose.x > 0.65) { // ทางขวาของเฟรม
        setFeedbackText("🚶 เดินไปทางซ้าย เพื่อเข้ากรอบ");
        return false;
    }

    // ตรวจสอบความครบถ้วน: ต้องเห็น หัว-ไหล่-เอว (landmarks สำคัญ) เพื่อให้การจับท่าทางแม่นยำ
    if (nose.visibility > 0.7 && leftShoulder.visibility > 0.7 && leftHip.visibility > 0.7) {
        return true; // Ready
    } else {
        setFeedbackText("🛑 โปรดจัดร่างกายให้ตรงกับท่าที่กำหนด");
        return false;
    }
}

// 3. ตรวจสอบเงื่อนไขท่าทางฤๅษีดัดตน
function checkPoseConditions(landmarks, poseType) {
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const nose = landmarks[0];

    // เงื่อนไข: ถ้าผู้เล่นยกมือทั้งสองข้างสูงกว่าจมูก (RAISE_HANDS)
    if (poseType === POSE_TYPE.RAISE_HANDS) {
        if (leftWrist.visibility > 0.5 && rightWrist.visibility > 0.5) {
            return (leftWrist.y < nose.y && rightWrist.y < nose.y);
        }
    }
    return false;
}

// 4. การจัดการค้างท่า (Hold Logic & Time)
function handleHoldLogic(isPoseCorrect, image) {
    if (isPoseCorrect) {
        // ท่าทางถูกต้อง ค้างท่า
        if (!isHoldingCurrentPose) {
            // เพิ่งเริ่มค้างท่า
            isHoldingCurrentPose = true;
            currentTimeHoldingMsec = 0;
            setFeedbackText("✅ ค้างท่าไว้! 3 วินาที");
            posInstructionBanner.classList.add('active-mode'); // เขียว
        } else {
            // ค้างท่าต่อไป: บวกเพิ่มเวลา (โดยประมาณ)
            currentTimeHoldingMsec += 100; // บวก 100ms ในแต่ละ loop (ปรับตามความเสถียรของกล้อง)

            if (currentTimeHoldingMsec >= REQUIRED_HOLD_TIME_MSEC) {
                // ค้างท่าครบกำหนด!
                score += 1;
                scoreDisplay.innerText = score;
                playSuccessSound(); // เสียงเฮ้/สำเร็จ
                resetHoldState();
                
                // แจ้งเตือนสั้นๆ และReset
                setFeedbackText("🏆 สำเร็จ! ทำได้ดีมาก");
                setTimeout(() => { if(isGameRunning && isDetectedBody) setFeedbackText("✅ ค้างท่าไว้! 3 วินาที"); }, 1500);
            }
        }
    } else {
        // ท่าทางผิด หรือไม่ได้ยกมือ
        if (isHoldingCurrentPose) {
            resetHoldState();
            if(isGameRunning && isDetectedBody) setFeedbackText("🛑 จัดร่างกายให้ตรงกับท่าที่กำหนด");
        }
    }
    
    // อัปเดต Timer บนหน้าจอ
    holdTimerDisplay.innerText = Math.floor(currentTimeHoldingMsec / 1000);
}

function resetHoldState() {
    isHoldingCurrentPose = false;
    currentTimeHoldingMsec = 0;
    holdTimerDisplay.innerText = "0";
    posInstructionBanner.classList.remove('active-mode'); // ไม่เขียว
}

// update UI
function updateUIReady() {
    videoWrapper.classList.add('detected'); // ขอบเขียว
    posInstructionBanner.classList.remove('hidden'); // แสดงคำแนะนำ
}

function updateUINotReady() {
    videoWrapper.classList.remove('detected'); // ไม่เขียว
    if(isGameRunning && isDetectedBody) {
        // เมื่อ AI ตรวจจับได้แล้ว แต่ผู้เล่นเดินออกนอกกรอบ
        setFeedbackText("🛑 โปรดจัดร่างกายให้ตรงกรอบ");
    }
}

function setFeedbackText(text) {
    posInstructionText.innerText = text;
}

// Audio logic
function playStartChime() { if (isSoundOn) { startChime.currentTime = 0; startChime.play(); } }
function playSuccessSound() { if (isSoundOn) { successSound.currentTime = 0; successSound.play(); } }
function toggleBackgroundMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
        document.getElementById('sound-toggle').innerText = "🔊";
    } else {
        bgMusic.pause();
        document.getElementById('sound-toggle').innerText = "🔇";
    }
}

// ตั้งค่า AI
const pose = new Pose({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`});
pose.setOptions({ 
    modelComplexity: 1, smoothLandmarks: true, 
    minDetectionConfidence: 0.6, // ความมั่นใจในการเจอคน 60%
    minTrackingConfidence: 0.6
});
pose.onResults(onResults);

// เริ่มเกมเมื่อกดปุ่ม (ใน Overlay)
document.getElementById('start-app-btn').addEventListener('click', () => {
    // ซ่อน Overlay
    posOverlay.classList.add('hidden');
    
    // เปิดกล้อง และ AI
    isGameRunning = true;
    const camera = new Camera(videoElement, {
        onFrame: async () => { if(isGameRunning) await pose.send({image: videoElement}); },
        width: 640, height: 480
    });
    camera.start();

    // เล่นเสียงเริ่มงาน (Chime)
    playStartChime();
});

// เปิด/ปิดเสียง
document.getElementById('sound-toggle').addEventListener('click', toggleBackgroundMusic);
