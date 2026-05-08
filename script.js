import { PoseLandmarker, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const btnStart = document.getElementById('btn-start');
const statusText = document.getElementById('status-text');
const statusBanner = document.getElementById('status-banner');
const cameraContainer = document.getElementById('camera-container');

// UI ของคะแนน
const currentScoreDisplay = document.getElementById('current-score');
const highScoreDisplay = document.getElementById('high-score');
let currentScore = 0;
let highScore = localStorage.getItem('ruesi_highscore') || 0;
highScoreDisplay.innerText = highScore;

// UI ของท่าทาง
const poseGuide = document.getElementById('pose-guide');
const poseImage = document.getElementById('pose-image');
const poseName = document.getElementById('pose-name');
const poseDesc = document.getElementById('pose-desc');
const timerFill = document.getElementById('timer-fill');
const directionArrow = document.getElementById('direction-arrow');

let poseLandmarker = undefined;
let isGameRunning = false;
let lastVideoTime = -1;

// --- Logic คำนวณความลึก (Depth Proxy) และระยะประสานมือ ---
const checkHandsClaspedFlexible = (landmarks) => {
    const lWrist = landmarks[15]; const rWrist = landmarks[16];
    const lElbow = landmarks[13]; const rElbow = landmarks[14];

    // 1. ต้องเห็นข้อมือ
    if (lWrist.visibility < 0.5 || rWrist.visibility < 0.5) return false;

    // 2. ระยะห่างข้อมือต้องใกล้กัน
    const distXY = Math.sqrt(Math.pow(lWrist.x - rWrist.x, 2) + Math.pow(lWrist.y - rWrist.y, 2));
    if (distXY > 0.12) return false; 

    // 3. แก้ปัญหา "เหยียดแขนแต่ไม่ประสานมือ" (เช็คความกว้างศอกเทียบกับไหล่)
    const elbowDist = Math.abs(lElbow.x - rElbow.x);
    const shoulderDist = Math.abs(landmarks[11].x - landmarks[12].x);
    if (elbowDist > shoulderDist * 1.5) return false; // ถ้าศอกกางกว้างไป แสดงว่าไม่ได้ประสานมือ

    return true;
};

// --- คลังท่าฤๅษีดัดตน (V.4 - Smart Tracking) ---
const POSES = [
    {
        id: 0, name: 'ท่าแก้เกียจ (ด้านบน)', desc: 'ประสานมือ เหยียดแขนขึ้นให้สุด', arrow: '',
        image: 'https://img.youtube.com/vi/-jXm7wgOtYs/maxresdefault.jpg',
        check: (landmarks) => {
            if (!checkHandsClaspedFlexible(landmarks)) return false;
            const wristY = (landmarks[15].y + landmarks[16].y) / 2;
            const eyeY = (landmarks[2].y + landmarks[5].y) / 2;
            return wristY < eyeY - 0.05; // ข้อมือต้องสูงกว่าระดับสายตา
        }
    },
    {
        id: 1, name: 'ท่าแก้เกียจ (ด้านหน้า)', desc: 'ประสานมือ เหยียดแขนตรงไปข้างหน้า', arrow: '',
        image: 'https://img.youtube.com/vi/-jXm7wgOtYs/hqdefault.jpg',
        check: (landmarks) => {
            if (!checkHandsClaspedFlexible(landmarks)) return false;
            const wristY = (landmarks[15].y + landmarks[16].y) / 2;
            const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
            
            // ขยาย Tolerance ความสูงให้อยู่ระดับอก-คาง
            const isAtShoulderLevel = Math.abs(wristY - shoulderY) < 0.35; 
            
            const wristX = (landmarks[15].x + landmarks[16].x) / 2;
            const isCentered = wristX > landmarks[12].x && wristX < landmarks[11].x;

            return isAtShoulderLevel && isCentered;
        }
    },
    {
        id: 2, name: 'ท่าแก้เกียจ (บิดขวา)', desc: 'บิดลำตัวและยืดแขนไปทางขวาให้สุด', arrow: '👉 บิดขวา', 
        image: 'https://img.youtube.com/vi/-jXm7wgOtYs/maxresdefault.jpg', 
        check: (landmarks) => {
            const lWrist = landmarks[15]; const rWrist = landmarks[16];
            const nose = landmarks[0];
            
            // ใช้ "แขนนำ" (มือที่ยื่นไปทางซ้ายของจอภาพ) ช่วยแก้ปัญหาบังกัน
            const leadingWrist = (lWrist.x < rWrist.x) ? lWrist : rWrist;
            if (leadingWrist.visibility < 0.4) return false;

            // แขนนำต้องยืดเลยจมูกไปพอสมควร
            const isTwistedRight = leadingWrist.x < (nose.x - 0.1);

            const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
            const isLevelOk = Math.abs(leadingWrist.y - shoulderY) < 0.4;

            // ถ้าเห็นมือทั้งสองข้างชัดเจน มันต้องอยู่ใกล้กัน
            let isHandsTogether = true;
            if (lWrist.visibility > 0.6 && rWrist.visibility > 0.6) {
                const distXY = Math.sqrt(Math.pow(lWrist.x - rWrist.x, 2) + Math.pow(lWrist.y - rWrist.y, 2));
                if (distXY > 0.25) isHandsTogether = false; 
            }

            return isTwistedRight && isLevelOk && isHandsTogether;
        }
    },
    {
        id: 3, name: 'ท่าแก้เกียจ (บิดซ้าย)', desc: 'บิดลำตัวและยืดแขนไปทางซ้ายให้สุด', arrow: '👈 บิดซ้าย',
        image: 'https://img.youtube.com/vi/-jXm7wgOtYs/maxresdefault.jpg',
        check: (landmarks) => {
            const lWrist = landmarks[15]; const rWrist = landmarks[16];
            const nose = landmarks[0];
            
            // ใช้ "แขนนำ" (มือที่ยื่นไปทางขวาของจอภาพ)
            const leadingWrist = (lWrist.x > rWrist.x) ? lWrist : rWrist;
            if (leadingWrist.visibility < 0.4) return false;

            // แขนนำต้องยืดเลยจมูกไปพอสมควร
            const isTwistedLeft = leadingWrist.x > (nose.x + 0.1);

            const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
            const isLevelOk = Math.abs(leadingWrist.y - shoulderY) < 0.4;

            let isHandsTogether = true;
            if (lWrist.visibility > 0.6 && rWrist.visibility > 0.6) {
                const distXY = Math.sqrt(Math.pow(lWrist.x - rWrist.x, 2) + Math.pow(lWrist.y - rWrist.y, 2));
                if (distXY > 0.25) isHandsTogether = false; 
            }

            return isTwistedLeft && isLevelOk && isHandsTogether;
        }
    }
];

let currentPoseIndex = 0;
let roundTimeLeft = 15; 
let roundTimerInterval;

const HOLD_DURATION = 3000; // ค้าง 3 วินาที
let isHoldingPose = false;
let holdStartTime = 0;
let playerFinishedRound = false;

// --- ระบบเสียง (Synth) ---
let isSoundOn = true;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq, type, dur) { if(!isSoundOn) return; const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain(); osc.type = type; osc.frequency.setValueAtTime(freq, audioCtx.currentTime); gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur); osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + dur); }
function soundTick() { playTone(800, 'sine', 0.1); }
function soundSuccess() { playTone(523.25, 'sine', 0.1); setTimeout(() => playTone(659.25, 'sine', 0.1), 100); setTimeout(() => playTone(783.99, 'sine', 0.3), 200); }
function soundNextRound() { playTone(440, 'triangle', 0.3); setTimeout(() => playTone(880, 'triangle', 0.4), 150); }
function soundFail() { playTone(300, 'sawtooth', 0.5); } 

// --- โหลด MediaPipe AI ---
const createPoseLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`, delegate: "GPU" }, runningMode: "VIDEO", numPoses: 1 });
    btnStart.innerText = "เริ่มเกมจับท่าทาง!";
    btnStart.disabled = false;
};
createPoseLandmarker();

// --- ระบบเกมเพลย์ ---
function addScore() {
    currentScore += 10;
    currentScoreDisplay.innerText = currentScore;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreDisplay.innerText = highScore;
        localStorage.setItem('ruesi_highscore', highScore);
    }
}

function startNextRound() {
    let newIndex;
    do { newIndex = Math.floor(Math.random() * POSES.length); } while (newIndex === currentPoseIndex && POSES.length > 1);
    currentPoseIndex = newIndex;
    
    const pose = POSES[currentPoseIndex];
    poseImage.src = pose.image;
    poseName.innerText = pose.name;
    poseDesc.innerText = pose.desc;
    
    if(pose.arrow !== '') { directionArrow.innerText = pose.arrow; directionArrow.classList.remove('hidden'); } 
    else { directionArrow.classList.add('hidden'); }
    
    roundTimeLeft = 15;
    playerFinishedRound = false;
    isHoldingPose = false;
    
    soundNextRound();
    poseGuide.classList.remove('hidden');
    updateStatusUI(`ทำท่า: ${pose.name} (15 วิ)`, 'normal');

    clearInterval(roundTimerInterval);
    roundTimerInterval = setInterval(() => {
        if(playerFinishedRound) return; 
        roundTimeLeft--;
        timerFill.style.width = `${(roundTimeLeft / 15) * 100}%`;
        if(roundTimeLeft <= 5) timerFill.style.background = '#e74c3c';
        else timerFill.style.background = '#2ecc71';

        if (roundTimeLeft <= 0) {
            soundFail();
            updateStatusUI("หมดเวลา! เปลี่ยนท่าถัดไป", 'danger');
            setTimeout(startNextRound, 2000);
        }
    }, 1000);
}

function updateStatusUI(text, state) {
    statusText.innerText = text;
    if (state === 'success') {
        statusBanner.className = 'status-banner glass-panel success';
        cameraContainer.classList.add('correct-pose');
    } else {
        statusBanner.className = 'status-banner glass-panel';
        cameraContainer.classList.remove('correct-pose');
    }
}

// --- วงจรการทำงานของกล้อง (Render Loop) ---
async function renderLoop() {
    if (!isGameRunning) return;
    canvasElement.width = videoElement.clientWidth; canvasElement.height = videoElement.clientHeight;

    let startTimeMs = performance.now();
    if (videoElement.currentTime !== lastVideoTime) {
        lastVideoTime = videoElement.currentTime;
        poseLandmarker.detectForVideo(videoElement, startTimeMs, (result) => {
            canvasCtx.save(); canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

            if (result.landmarks && result.landmarks.length > 0) {
                const landmarks = result.landmarks[0]; 
                if(!playerFinishedRound) {
                    analyzePose(landmarks);
                } else {
                    drawSkeleton(landmarks, '#2ecc71'); 
                    drawStatusText(landmarks, "สุดยอด! ได้รับ 10 คะแนน 🌟");
                }
            } else {
                if(!playerFinishedRound) updateStatusUI("ไม่พบร่างกายในกล้อง", 'normal');
                isHoldingPose = false;
            }
            canvasCtx.restore();
        });
    }
    window.requestAnimationFrame(renderLoop);
}

// --- การวาดกราฟิก ---
function drawSkeleton(landmarks, color) {
    const drawingUtils = new DrawingUtils(canvasCtx);
    drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color: color, lineWidth: 4 });
    drawingUtils.drawLandmarks(landmarks, { color: '#ffffff', lineWidth: 2, radius: 5 });
}

function drawStatusText(landmarks, text) {
    const chestY = (landmarks[11].y + landmarks[12].y) / 2;
    canvasCtx.fillStyle = '#FFF'; canvasCtx.font = 'bold 30px Prompt'; canvasCtx.textAlign = 'center';
    canvasCtx.shadowColor = "rgba(0,0,0,0.8)"; canvasCtx.shadowBlur = 10;
    canvasCtx.fillText(text, landmarks[0].x*canvasElement.width, chestY*canvasElement.height);
    canvasCtx.shadowBlur = 0; 
}

function drawProgressRing(x, y, progress) {
    const cX = x * canvasElement.width; const cY = y * canvasElement.height;
    canvasCtx.beginPath(); canvasCtx.arc(cX, cY, 50, 0, 2*Math.PI); canvasCtx.strokeStyle='rgba(255,255,255,0.4)'; canvasCtx.lineWidth=12; canvasCtx.stroke();
    canvasCtx.beginPath(); canvasCtx.arc(cX, cY, 50, -Math.PI/2, (-Math.PI/2)+(2*Math.PI*progress)); canvasCtx.strokeStyle='#2ecc71'; canvasCtx.lineCap='round'; canvasCtx.lineWidth=12; canvasCtx.stroke();
    canvasCtx.fillStyle = '#FFF'; canvasCtx.font = 'bold 30px Prompt'; canvasCtx.textAlign = 'center'; canvasCtx.textBaseline = 'middle';
    canvasCtx.fillText(Math.ceil(3 - (progress*3)), cX, cY);
}

function analyzePose(landmarks) {
    const isCorrectPose = POSES[currentPoseIndex].check(landmarks);

    if (isCorrectPose) {
        drawSkeleton(landmarks, '#2ecc71'); 
        
        if (!isHoldingPose) {
            isHoldingPose = true;
            holdStartTime = Date.now();
            soundTick();
            updateStatusUI("✅ ท่าถูกต้อง! ค้างไว้...", 'success');
        } else {
            const elapsed = Date.now() - holdStartTime;
            const progress = Math.min(elapsed / HOLD_DURATION, 1);
            drawProgressRing((landmarks[11].x+landmarks[12].x)/2, (landmarks[11].y+landmarks[12].y)/2, progress);

            if (progress >= 1) {
                playerFinishedRound = true; 
                addScore();
                soundSuccess();
                directionArrow.classList.add('hidden');
                updateStatusUI("🎉 สำเร็จ! เตรียมตัวท่าถัดไป", 'success');
                setTimeout(startNextRound, 2000); 
            }
        }
    } else {
        drawSkeleton(landmarks, '#e74c3c'); 
        isHoldingPose = false;
        updateStatusUI(`ทำท่า: ${POSES[currentPoseIndex].name}`, 'normal');
    }
}

// --- ควบคุมปุ่มเริ่มและเสียง ---
btnStart.addEventListener('click', () => {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    document.getElementById('start-overlay').classList.add('hidden');
    navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: "user" } })
        .then((stream) => {
            videoElement.srcObject = stream;
            videoElement.addEventListener("loadeddata", () => {
                isGameRunning = true;
                startNextRound(); 
                renderLoop();
            });
        }).catch(err => { statusText.innerText = "ไม่สามารถเข้าถึงกล้องได้"; });
});

const btnSound = document.getElementById('btn-sound');
btnSound.addEventListener('click', () => {
    isSoundOn = !isSoundOn;
    btnSound.innerText = isSoundOn ? "🔊" : "🔇";
    if(isSoundOn && audioCtx.state === 'suspended') audioCtx.resume();
});
