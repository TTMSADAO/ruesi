import {
    PoseLandmarker,
    FilesetResolver,
    DrawingUtils
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const btnStart = document.getElementById('btn-start');
const statusText = document.getElementById('status-text');

// UI ของท่าต้นแบบ
const poseGuide = document.getElementById('pose-guide');
const poseImage = document.getElementById('pose-image');
const poseName = document.getElementById('pose-name');
const poseDesc = document.getElementById('pose-desc');
const timerFill = document.getElementById('timer-fill');

let poseLandmarker = undefined;
let isGameRunning = false;
let lastVideoTime = -1;

// --- คลังท่าฤๅษีดัดตน (Poses Library) ---
// *คำแนะนำ: คุณสามารถเซฟรูปถ่ายของคุณหรือเจ้าหน้าที่ตั้งชื่อว่า pose1.jpg, pose2.jpg อัปโหลดลง GitHub แล้วเอาลิงก์มาใส่ตรง image: ได้เลยครับ*
const POSES = [
    {
        id: 0,
        name: 'ท่าแก้เกียจ',
        desc: 'ชูมือทั้งสองข้างขึ้นเหนือศีรษะ',
        image: 'https://cdn-icons-png.flaticon.com/512/3043/3043253.png', 
        check: (landmarks) => {
            return landmarks[15].y < landmarks[0].y && landmarks[16].y < landmarks[0].y && 
                   landmarks[15].visibility > 0.5 && landmarks[16].visibility > 0.5;
        }
    },
    {
        id: 1,
        name: 'ท่ากางแขน',
        desc: 'กางแขนเหยียดตรงระดับหัวไหล่',
        image: 'https://cdn-icons-png.flaticon.com/512/3043/3043248.png',
        check: (landmarks) => {
            // เช็คว่าข้อมือ(15,16) อยู่ในแนวนอนระดับเดียวกับไหล่(11,12)
            const isLeftHorizontal = Math.abs(landmarks[15].y - landmarks[11].y) < 0.15;
            const isRightHorizontal = Math.abs(landmarks[16].y - landmarks[12].y) < 0.15;
            // เช็คว่ากางแขนออก (ข้อมืออยู่ห่างกว่าศอก)
            const isSpread = Math.abs(landmarks[15].x - landmarks[16].x) > 0.5;
            return isLeftHorizontal && isRightHorizontal && isSpread;
        }
    },
    {
        id: 2,
        name: 'ท่าเท้าเอว',
        desc: 'นำมือทั้งสองข้างวางพักที่เอว',
        image: 'https://cdn-icons-png.flaticon.com/512/3043/3043261.png',
        check: (landmarks) => {
            // เช็คว่าข้อมือ(15,16) อยู่ใกล้ระดับสะโพก(23,24)
            const leftOnHip = Math.abs(landmarks[15].y - landmarks[23].y) < 0.2 && Math.abs(landmarks[15].x - landmarks[23].x) < 0.2;
            const rightOnHip = Math.abs(landmarks[16].y - landmarks[24].y) < 0.2 && Math.abs(landmarks[16].x - landmarks[24].x) < 0.2;
            return leftOnHip && rightOnHip;
        }
    }
];

let currentPoseIndex = 0;
let roundTimeLeft = 15; // 15 วินาทีต่อ 1 ท่า
let roundTimerInterval;

// --- ตั้งค่าระบบ Multiplayer ---
const MAX_PLAYERS = 4;
const HOLD_DURATION = 3000;
const playerColors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63'];

let playerScores = new Array(MAX_PLAYERS).fill(0);
let isHoldingPose = new Array(MAX_PLAYERS).fill(false);
let holdStartTime = new Array(MAX_PLAYERS).fill(0);
let playerFinishedRound = new Array(MAX_PLAYERS).fill(false); // เช็คว่าคนนี้ผ่านท่านี้ไปแล้วหรือยัง

// --- ระบบเสียง ---
let isSoundOn = true;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq, type, dur) {
    if (!isSoundOn) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + dur);
}
function soundTick() { playTone(600, 'sine', 0.1); }
function soundSuccess() { playTone(523.25, 'sine', 0.1); setTimeout(() => playTone(659.25, 'sine', 0.1), 100); }
function soundNextRound() { playTone(440, 'triangle', 0.3); setTimeout(() => playTone(880, 'triangle', 0.4), 150); }

// --- AI Engine Load ---
const createPoseLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`, delegate: "GPU" },
        runningMode: "VIDEO", numPoses: MAX_PLAYERS
    });
    btnStart.innerText = "เริ่มต้นทดสอบ";
    btnStart.disabled = false;
};
createPoseLandmarker();

// --- ระบบเปลี่ยนท่า (Game Flow) ---
function startNextRound() {
    // สุ่มท่าถัดไป (ที่ไม่ซ้ำเดิม)
    let newIndex;
    do { newIndex = Math.floor(Math.random() * POSES.length); } while (newIndex === currentPoseIndex && POSES.length > 1);
    currentPoseIndex = newIndex;
    
    const pose = POSES[currentPoseIndex];
    poseImage.src = pose.image;
    poseName.innerText = pose.name;
    poseDesc.innerText = pose.desc;
    
    // รีเซ็ตสถานะ
    roundTimeLeft = 15;
    playerFinishedRound.fill(false);
    isHoldingPose.fill(false);
    
    soundNextRound();
    poseGuide.classList.remove('hidden');

    // เริ่มนับถอยหลัง 15 วินาที
    clearInterval(roundTimerInterval);
    roundTimerInterval = setInterval(() => {
        roundTimeLeft--;
        const percentage = (roundTimeLeft / 15) * 100;
        timerFill.style.width = `${percentage}%`;
        
        // เปลี่ยนสีหลอดเวลาเมื่อใกล้หมด
        if(roundTimeLeft <= 5) timerFill.style.background = '#FF5252';
        else timerFill.style.background = '#FFC107';

        if (roundTimeLeft <= 0) startNextRound(); // หมดเวลาเปลี่ยนท่า
    }, 1000);
}

// --- Render Loop ---
async function renderLoop() {
    if (!isGameRunning) return;
    canvasElement.width = videoElement.clientWidth; canvasElement.height = videoElement.clientHeight;

    let startTimeMs = performance.now();
    if (videoElement.currentTime !== lastVideoTime) {
        lastVideoTime = videoElement.currentTime;
        poseLandmarker.detectForVideo(videoElement, startTimeMs, (result) => {
            canvasCtx.save(); canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

            if (result.landmarks && result.landmarks.length > 0) {
                statusText.innerText = `กำลังตรวจจับท่า: ${POSES[currentPoseIndex].name}`;
                for (let i = 0; i < result.landmarks.length; i++) {
                    const color = playerColors[i % playerColors.length];
                    drawSkeleton(result.landmarks[i], color);
                    
                    // วิเคราะห์เฉพาะคนที่ยังทำท่านี้ไม่ผ่าน
                    if(!playerFinishedRound[i]) {
                        analyzePoseForPlayer(result.landmarks[i], i, color);
                    } else {
                        drawStatus(result.landmarks[i], i, color, "ผ่านแล้ว! ✅");
                    }
                    drawPlayerScore(result.landmarks[i], i, color);
                }
            } else {
                statusText.innerText = "ไม่พบร่างกาย กรุณาเข้ากล้อง";
                isHoldingPose.fill(false);
            }
            canvasCtx.restore();
        });
    }
    window.requestAnimationFrame(renderLoop);
}

// --- วาด UI ของผู้เล่น ---
function drawSkeleton(landmarks, color) {
    const drawingUtils = new DrawingUtils(canvasCtx);
    drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color: color, lineWidth: 3 });
    drawingUtils.drawLandmarks(landmarks, { color: '#ffffff', lineWidth: 2, radius: 4 });
}

function drawPlayerScore(landmarks, pIndex, color) {
    const nose = landmarks[0];
    canvasCtx.fillStyle = color;
    canvasCtx.beginPath(); canvasCtx.roundRect((nose.x*canvasElement.width)-25, (nose.y*canvasElement.height)-60, 50, 50, 10); canvasCtx.fill();
    canvasCtx.fillStyle = '#FFF'; canvasCtx.font = 'bold 20px Arial'; canvasCtx.textAlign = 'center'; canvasCtx.textBaseline = 'middle';
    canvasCtx.fillText(playerScores[pIndex], nose.x*canvasElement.width, (nose.y*canvasElement.height)-35);
}

function drawStatus(landmarks, pIndex, color, text) {
    const chestY = (landmarks[11].y + landmarks[12].y) / 2;
    canvasCtx.fillStyle = '#FFF'; canvasCtx.font = 'bold 24px Arial'; canvasCtx.textAlign = 'center';
    canvasCtx.fillText(text, landmarks[0].x*canvasElement.width, (chestY*canvasElement.height));
}

function drawProgressRing(x, y, progress, color) {
    const cX = x * canvasElement.width; const cY = y * canvasElement.height;
    canvasCtx.beginPath(); canvasCtx.arc(cX, cY, 40, 0, 2*Math.PI); canvasCtx.strokeStyle='rgba(255,255,255,0.4)'; canvasCtx.lineWidth=8; canvasCtx.stroke();
    canvasCtx.beginPath(); canvasCtx.arc(cX, cY, 40, -Math.PI/2, (-Math.PI/2)+(2*Math.PI*progress)); canvasCtx.strokeStyle=color; canvasCtx.lineCap='round'; canvasCtx.lineWidth=8; canvasCtx.stroke();
}

// --- วิเคราะห์ท่าทาง ---
function analyzePoseForPlayer(landmarks, pIndex, color) {
    // นำเงื่อนไขการเช็คท่าทางมาจาก POSES array
    const isCorrectPose = POSES[currentPoseIndex].check(landmarks);

    if (isCorrectPose) {
        if (!isHoldingPose[pIndex]) {
            isHoldingPose[pIndex] = true;
            holdStartTime[pIndex] = Date.now();
            if(pIndex === 0) soundTick();
        } else {
            const elapsed = Date.now() - holdStartTime[pIndex];
            const progress = Math.min(elapsed / HOLD_DURATION, 1);
            
            drawProgressRing((landmarks[11].x+landmarks[12].x)/2, (landmarks[11].y+landmarks[12].y)/2, progress, color);

            if (progress >= 1) {
                playerScores[pIndex] += 1;
                playerFinishedRound[pIndex] = true; // บันทึกว่าคนนี้ผ่านท่านี้แล้ว
                soundSuccess();
            }
        }
    } else {
        isHoldingPose[pIndex] = false;
    }
}

// --- เริ่มทำงาน ---
btnStart.addEventListener('click', () => {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    document.getElementById('start-overlay').classList.add('hidden');
    
    navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
        .then((stream) => {
            videoElement.srcObject = stream;
            videoElement.addEventListener("loadeddata", () => {
                isGameRunning = true;
                startNextRound(); // เริ่มสุ่มท่าแรก
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
