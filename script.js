import { PoseLandmarker, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const btnStart = document.getElementById('btn-start');
const statusText = document.getElementById('status-text');
const statusBanner = document.getElementById('status-banner');
const cameraContainer = document.getElementById('camera-container');

// UI Components
const currentScoreDisplay = document.getElementById('current-score');
const highScoreDisplay = document.getElementById('high-score');
let currentScore = 0;
let highScore = localStorage.getItem('ruesi_highscore_desktop') || 0;
highScoreDisplay.innerText = highScore;

const poseGuide = document.getElementById('pose-guide');
const poseImage = document.getElementById('pose-image');
const poseName = document.getElementById('pose-name');
const poseDesc = document.getElementById('pose-desc');
const timerFill = document.getElementById('timer-fill');
const directionArrow = document.getElementById('direction-arrow');

let poseLandmarker = undefined;
let isGameRunning = false;
let lastVideoTime = -1;

// ==========================================
// GAME STATES
// ==========================================
const STATE_CALIBRATING = 'CALIBRATING';
const STATE_PLAYING = 'PLAYING';
let gameState = STATE_CALIBRATING; 

let isCalibrationReady = false;
let calibrationStartTime = 0;
const CALIBRATION_DURATION = 2000; // ยืนรอ 2 วินาที

// ==========================================
// 3D Mathematics & Anti-Cheat
// ==========================================
const getDistance3D = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
const getAngle = (a, b, c) => {
    let radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
};

const checkHandsClasped3D = (landmarks) => {
    const lWrist = landmarks[15]; const rWrist = landmarks[16];
    const lElbow = landmarks[13]; const rElbow = landmarks[14];
    
    // ลดความเข้มงวดของ visibility ลง
    if (lWrist.visibility < 0.3 || rWrist.visibility < 0.3) return false;
    
    const dist3D = getDistance3D(lWrist, rWrist);
    if (dist3D > 0.15) return false; 
    
    const elbowDist = Math.abs(lElbow.x - rElbow.x);
    const shoulderDist = Math.abs(landmarks[11].x - landmarks[12].x);
    if (elbowDist > shoulderDist * 1.5) return false; 
    
    return true;
};

const POSES = [
    {
        id: 0, name: 'ท่าแก้เกียจ (ด้านบน)', desc: 'ประสานมือ เหยียดแขนตึงขึ้นเหนือศีรษะ', arrow: '',
        image: 'https://img.youtube.com/vi/-jXm7wgOtYs/maxresdefault.jpg',
        check: (landmarks) => {
            if (!checkHandsClasped3D(landmarks)) return false;
            const lAngle = getAngle(landmarks[11], landmarks[13], landmarks[15]);
            const rAngle = getAngle(landmarks[12], landmarks[14], landmarks[16]);
            if (lAngle < 140 || rAngle < 140) return false;
            const wristY = (landmarks[15].y + landmarks[16].y) / 2;
            const chinY = landmarks[152].y;
            return wristY < chinY - 0.05; 
        }
    },
    {
        id: 1, name: 'ท่าแก้เกียจ (ด้านหน้า)', desc: 'ประสานมือ เหยียดแขนตึงตรงไปข้างหน้า', arrow: '',
        image: 'https://img.youtube.com/vi/-jXm7wgOtYs/hqdefault.jpg',
        check: (landmarks) => {
            if (!checkHandsClasped3D(landmarks)) return false;
            const lAngle = getAngle(landmarks[11], landmarks[13], landmarks[15]);
            const rAngle = getAngle(landmarks[12], landmarks[14], landmarks[16]);
            if (lAngle < 140 || rAngle < 140) return false;
            const wristY = (landmarks[15].y + landmarks[16].y) / 2;
            const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
            const isAtShoulderLevel = Math.abs(wristY - shoulderY) < 0.35; 
            const wristX = (landmarks[15].x + landmarks[16].x) / 2;
            const isCentered = wristX > landmarks[12].x && wristX < landmarks[11].x;
            const wristZ = (landmarks[15].z + landmarks[16].z) / 2;
            const shoulderZ = (landmarks[11].z + landmarks[12].z) / 2;
            const isExtendedForward = wristZ < shoulderZ - 0.15; 
            return isAtShoulderLevel && isCentered && isExtendedForward;
        }
    },
    {
        id: 2, name: 'ท่าแก้เกียจ (บิดขวา)', desc: 'บิดเอวและแขนตึงไปทางขวา', arrow: '👉 บิดขวา', 
        image: 'https://img.youtube.com/vi/-jXm7wgOtYs/maxresdefault.jpg', 
        check: (landmarks) => {
            if (!checkHandsClasped3D(landmarks)) return false;
            const lAngle = getAngle(landmarks[11], landmarks[13], landmarks[15]);
            const rAngle = getAngle(landmarks[12], landmarks[14], landmarks[16]);
            if (lAngle < 120 && rAngle < 120) return false;
            const wristX = (landmarks[15].x + landmarks[16].x) / 2;
            const nose = landmarks[0];
            const isTwistedRight = wristX < (nose.x - 0.15); 
            const wristY = (landmarks[15].y + landmarks[16].y) / 2;
            const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
            const isLevelOk = Math.abs(wristY - shoulderY) < 0.45;
            return isTwistedRight && isLevelOk;
        }
    },
    {
        id: 3, name: 'ท่าแก้เกียจ (บิดซ้าย)', desc: 'บิดเอวและแขนตึงไปทางซ้าย', arrow: '👈 บิดซ้าย',
        image: 'https://img.youtube.com/vi/-jXm7wgOtYs/maxresdefault.jpg',
        check: (landmarks) => {
            if (!checkHandsClasped3D(landmarks)) return false;
            const lAngle = getAngle(landmarks[11], landmarks[13], landmarks[15]);
            const rAngle = getAngle(landmarks[12], landmarks[14], landmarks[16]);
            if (lAngle < 120 && rAngle < 120) return false;
            const wristX = (landmarks[15].x + landmarks[16].x) / 2;
            const nose = landmarks[0];
            const isTwistedLeft = wristX > (nose.x + 0.15); 
            const wristY = (landmarks[15].y + landmarks[16].y) / 2;
            const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
            const isLevelOk = Math.abs(wristY - shoulderY) < 0.45;
            return isTwistedLeft && isLevelOk;
        }
    }
];

let currentPoseIndex = 0;
let roundTimeLeft = 15; 
let roundTimerInterval;
const HOLD_DURATION = 3000;
let isHoldingPose = false;
let holdStartTime = 0;
let playerFinishedRound = false;

// Audio System
let isSoundOn = true;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq, type, dur) { if(!isSoundOn) return; const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain(); osc.type = type; osc.frequency.setValueAtTime(freq, audioCtx.currentTime); gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur); osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + dur); }
function soundTick() { playTone(800, 'sine', 0.1); }
function soundSuccess() { playTone(523.25, 'sine', 0.1); setTimeout(() => playTone(659.25, 'sine', 0.1), 100); setTimeout(() => playTone(783.99, 'sine', 0.3), 200); }
function soundNextRound() { playTone(440, 'triangle', 0.3); setTimeout(() => playTone(880, 'triangle', 0.4), 150); }
function soundFail() { playTone(300, 'sawtooth', 0.5); } 

// Init AI
const createPoseLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, { 
        baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`, delegate: "GPU" }, 
        runningMode: "VIDEO", numPoses: 1 
    });
    btnStart.innerText = "เริ่มเกมจับท่าทาง!";
    btnStart.disabled = false;
};
createPoseLandmarker();

function addScore() {
    currentScore += 10;
    currentScoreDisplay.innerText = currentScore;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreDisplay.innerText = highScore;
        localStorage.setItem('ruesi_highscore_desktop', highScore);
    }
}

// ==========================================
// 💡 ระบบตรวจสอบ Calibration (แก้ไขใหม่ 100%)
// ==========================================
function processCalibration(landmarks) {
    const lShoulder = landmarks[11]; 
    const rShoulder = landmarks[12];
    
    // ตัดการประเมิน Visibility ทิ้งไปเลย ถ้า AI เจอจุด = เจอคน
    if (lShoulder && rShoulder) {
        
        // 1. ตรวจสอบระยะห่าง (ขยายช่วงให้กว้างมาก 10% - 60% ของจอ)
        const shoulderWidth = Math.abs(lShoulder.x - rShoulder.x);
        const isGoodDistance = shoulderWidth > 0.10 && shoulderWidth < 0.60;

        // 2. ตรวจสอบกึ่งกลาง (หาจุดกึ่งกลางระหว่างไหล่ 2 ข้าง)
        const midX = (lShoulder.x + rShoulder.x) / 2;
        const isCentered = midX > 0.30 && midX < 0.70; // ให้อยู่ช่วงกลางจอ

        if (isGoodDistance && isCentered) {
            // ยืนถูกต้อง!
            drawCalibrationGuide(true);
            if (!isCalibrationReady) {
                isCalibrationReady = true;
                calibrationStartTime = Date.now();
                soundTick();
                updateStatusUI("✅ ยืนเข้าที่แล้ว! รอสักครู่...", 'success');
            } else {
                const elapsed = Date.now() - calibrationStartTime;
                const progress = Math.min(elapsed / CALIBRATION_DURATION, 1);
                drawProgressRing(0.5, 0.5, progress, 'ยืนนิ่งๆ'); 

                if (progress >= 1) {
                    gameState = STATE_PLAYING; // เข้าเกม
                    soundSuccess();
                    startNextRound(); 
                }
            }
        } else {
            drawCalibrationGuide(false);
            isCalibrationReady = false;
            if (!isGoodDistance) {
                updateStatusUI(shoulderWidth >= 0.60 ? "⚠️ กรุณาถอยหลังอีกนิด" : "⚠️ ขยับเข้าใกล้กล้องอีกนิด", 'warning');
            } else {
                updateStatusUI("⚠️ ขยับตัวให้อยู่ตรงกลางจอ", 'warning');
            }
        }
    } else {
        drawCalibrationGuide(false);
        isCalibrationReady = false;
        updateStatusUI("⚠️ ไม่พบผู้ใช้งาน", 'warning');
    }
}

function drawCalibrationGuide(isReady) {
    const width = canvasElement.width * 0.7;
    const height = canvasElement.height * 0.8;
    const x = canvasElement.width * 0.15;
    const y = canvasElement.height * 0.1;

    canvasCtx.beginPath();
    canvasCtx.rect(x, y, width, height);
    canvasCtx.lineWidth = 6;
    canvasCtx.setLineDash([20, 15]); 
    canvasCtx.strokeStyle = isReady ? '#27ae60' : 'rgba(243, 156, 18, 0.6)'; 
    canvasCtx.stroke();
    canvasCtx.setLineDash([]); 
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
        if(playerFinishedRound || gameState === STATE_CALIBRATING) return; 
        
        roundTimeLeft--;
        timerFill.style.width = `${(roundTimeLeft / 15) * 100}%`;
        if(roundTimeLeft <= 5) timerFill.style.background = '#e74c3c';
        else timerFill.style.background = '#27ae60';

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
        cameraContainer.style.borderColor = '#27ae60';
    } else if (state === 'warning') {
        statusBanner.className = 'status-banner glass-panel';
        cameraContainer.classList.remove('correct-pose');
        cameraContainer.style.borderColor = '#f39c12';
    } else {
        statusBanner.className = 'status-banner glass-panel';
        cameraContainer.classList.remove('correct-pose');
        cameraContainer.style.borderColor = 'transparent';
    }
}

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
                
                if (gameState === STATE_CALIBRATING) {
                    processCalibration(landmarks);
                    drawSkeleton(landmarks, 'rgba(255,255,255,0.5)'); 
                } else if (gameState === STATE_PLAYING) {
                    if(!playerFinishedRound) {
                        analyzePose(landmarks);
                    } else {
                        drawSkeleton(landmarks, '#27ae60'); 
                        drawStatusText(landmarks, "สุดยอด! ได้รับ 10 คะแนน 🌟");
                    }
                }
            } else {
                if (gameState === STATE_CALIBRATING) {
                    drawCalibrationGuide(false);
                    updateStatusUI("⚠️ ไม่พบผู้ใช้งาน กรุณาเข้ากล้อง", 'warning');
                } else if(!playerFinishedRound) {
                    updateStatusUI("ไม่พบร่างกายในกล้อง", 'normal');
                }
                isHoldingPose = false;
                isCalibrationReady = false;
            }
            canvasCtx.restore();
        });
    }
    window.requestAnimationFrame(renderLoop);
}

function drawSkeleton(landmarks, color) {
    const drawingUtils = new DrawingUtils(canvasCtx);
    drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color: color, lineWidth: 6 });
    drawingUtils.drawLandmarks(landmarks, { color: '#ffffff', lineWidth: 3, radius: 6 });
}

function drawStatusText(landmarks, text) {
    const chestY = (landmarks[11].y + landmarks[12].y) / 2;
    canvasCtx.fillStyle = '#FFF'; canvasCtx.font = 'bold 40px Prompt'; canvasCtx.textAlign = 'center';
    canvasCtx.shadowColor = "rgba(0,0,0,0.8)"; canvasCtx.shadowBlur = 15;
    canvasCtx.fillText(text, landmarks[0].x*canvasElement.width, chestY*canvasElement.height);
    canvasCtx.shadowBlur = 0; 
}

function drawProgressRing(xNorm, yNorm, progress, overrideText = null) {
    const cX = xNorm * canvasElement.width; const cY = yNorm * canvasElement.height;
    canvasCtx.beginPath(); canvasCtx.arc(cX, cY, 80, 0, 2*Math.PI); canvasCtx.strokeStyle='rgba(0,0,0,0.5)'; canvasCtx.lineWidth=15; canvasCtx.stroke();
    canvasCtx.beginPath(); canvasCtx.arc(cX, cY, 80, -Math.PI/2, (-Math.PI/2)+(2*Math.PI*progress)); canvasCtx.strokeStyle='#27ae60'; canvasCtx.lineCap='round'; canvasCtx.lineWidth=15; canvasCtx.stroke();
    
    canvasCtx.fillStyle = '#FFF'; canvasCtx.font = 'bold 50px Prompt'; canvasCtx.textAlign = 'center'; canvasCtx.textBaseline = 'middle';
    canvasCtx.shadowColor = "rgba(0,0,0,0.8)"; canvasCtx.shadowBlur = 10;
    
    if(overrideText) {
         canvasCtx.font = 'bold 25px Prompt';
         canvasCtx.fillText(overrideText, cX, cY);
    } else {
         canvasCtx.fillText(Math.ceil(3 - (progress*3)), cX, cY);
    }
    canvasCtx.shadowBlur = 0;
}

function analyzePose(landmarks) {
    const isCorrectPose = POSES[currentPoseIndex].check(landmarks);

    if (isCorrectPose) {
        drawSkeleton(landmarks, '#27ae60'); 
        
        if (!isHoldingPose) {
            isHoldingPose = true;
            holdStartTime = Date.now();
            soundTick();
            updateStatusUI("✅ ท่าถูกต้อง! เหยียดตึงค้างไว้...", 'success');
        } else {
            const elapsed = Date.now() - holdStartTime;
            const progress = Math.min(elapsed / HOLD_DURATION, 1);
            
            const chestX = (landmarks[11].x+landmarks[12].x)/2;
            const chestY = (landmarks[11].y+landmarks[12].y)/2;
            drawProgressRing(chestX, chestY, progress);

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

btnStart.addEventListener('click', () => {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    document.getElementById('start-overlay').classList.add('hidden');
    navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: "user" } })
        .then((stream) => {
            videoElement.srcObject = stream;
            videoElement.addEventListener("loadeddata", () => {
                isGameRunning = true;
                gameState = STATE_CALIBRATING; 
                renderLoop();
            });
        }).catch(err => { statusText.innerText = "ไม่สามารถเข้าถึงกล้องได้"; });
});

const btnSound = document.getElementById('btn-sound');
btnSound.addEventListener('click', () => {
    isSoundOn = !isSoundOn;
    btnSound.innerText = isSoundOn ? "🔊 เปิด/ปิด เสียง" : "🔇 เปิด/ปิด เสียง";
    if(isSoundOn && audioCtx.state === 'suspended') audioCtx.resume();
});
