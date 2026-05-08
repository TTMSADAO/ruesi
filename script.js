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

// UI ตัวแปรอ้างอิง
const poseGuide = document.getElementById('pose-guide');
const poseImage = document.getElementById('pose-image');
const poseName = document.getElementById('pose-name');
const poseDesc = document.getElementById('pose-desc');
const timerFill = document.getElementById('timer-fill');

let poseLandmarker = undefined;
let isGameRunning = false;
let lastVideoTime = -1;

// --- ลอจิกตัวช่วยคำนวณ ---
// ฟังก์ชันเช็คว่าผู้เล่น "ประสานมือ" หรือไม่ (ข้อมือซ้าย-ขวาอยู่ใกล้กัน)
const checkHandsClasped = (landmarks) => {
    if (landmarks[15].visibility < 0.5 || landmarks[16].visibility < 0.5) return false;
    const distanceX = Math.abs(landmarks[15].x - landmarks[16].x);
    const distanceY = Math.abs(landmarks[15].y - landmarks[16].y);
    return distanceX < 0.15 && distanceY < 0.15; // ระยะห่างต้องน้อยกว่า 15% ของจอ
};

// --- คลังท่าฤๅษีดัดตน (ท่าแก้เกียจ 4 ทิศทาง) ---
const POSES = [
    {
        id: 0,
        name: 'ท่าแก้เกียจ (ด้านหน้า)',
        desc: 'ประสานมือ เหยียดแขนทั้งสองข้างไปด้านหน้า',
        image: 'https://img.youtube.com/vi/-jXm7wgOtYs/hqdefault.jpg',
        check: (landmarks) => {
            if (!checkHandsClasped(landmarks)) return false;
            // ข้อมือต้องอยู่ระดับเดียวกับไหล่ (สูงกว่าเอว ต่ำกว่าหน้า)
            const wristY = (landmarks[15].y + landmarks[16].y) / 2;
            const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
            // เช็คว่ามืออยู่ตรงกลางลำตัว (ไม่บิดซ้ายขวา)
            const wristX = (landmarks[15].x + landmarks[16].x) / 2;
            
            const isAtShoulderLevel = Math.abs(wristY - shoulderY) < 0.2;
            // x ของมือต้องอยู่ระหว่างไหล่ซ้าย(11) และขวา(12) 
            const isCentered = wristX > landmarks[12].x && wristX < landmarks[11].x; 

            return isAtShoulderLevel && isCentered;
        }
    },
    {
        id: 1,
        name: 'ท่าแก้เกียจ (บิดขวา)',
        desc: 'ประสานมือ บิดลำตัวเหยียดแขนไปทางขวา',
        image: 'https://img.youtube.com/vi/-jXm7wgOtYs/maxresdefault.jpg', // ภาพชั่วคราว
        check: (landmarks) => {
            if (!checkHandsClasped(landmarks)) return false;
            const wristX = (landmarks[15].x + landmarks[16].x) / 2;
            const wristY = (landmarks[15].y + landmarks[16].y) / 2;
            const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
            
            // หมายเหตุ: ไหล่ขวาของผู้เล่น (12) ในกล้องกระจกจะอยู่ฝั่งซ้ายของจอ (ค่า X น้อย)
            // มือต้องบิดไปทางขวาของผู้เล่น = ค่า X ต้องน้อยกว่าไหล่ขวา
            const isTwistedRight = wristX < landmarks[12].x + 0.05; 
            const isAtShoulderLevel = Math.abs(wristY - shoulderY) < 0.3;

            return isTwistedRight && isAtShoulderLevel;
        }
    },
    {
        id: 2,
        name: 'ท่าแก้เกียจ (บิดซ้าย)',
        desc: 'ประสานมือ บิดลำตัวเหยียดแขนไปทางซ้าย',
        image: 'https://img.youtube.com/vi/-jXm7wgOtYs/maxresdefault.jpg', // ภาพชั่วคราว
        check: (landmarks) => {
            if (!checkHandsClasped(landmarks)) return false;
            const wristX = (landmarks[15].x + landmarks[16].x) / 2;
            const wristY = (landmarks[15].y + landmarks[16].y) / 2;
            const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
            
            // ไหล่ซ้ายของผู้เล่น (11) ในกล้องกระจกจะอยู่ฝั่งขวาของจอ (ค่า X มาก)
            // มือต้องบิดไปทางซ้ายของผู้เล่น = ค่า X ต้องมากกว่าไหล่ซ้าย
            const isTwistedLeft = wristX > landmarks[11].x - 0.05;
            const isAtShoulderLevel = Math.abs(wristY - shoulderY) < 0.3;

            return isTwistedLeft && isAtShoulderLevel;
        }
    },
    {
        id: 3,
        name: 'ท่าแก้เกียจ (ด้านบน)',
        desc: 'ประสานมือ เหยียดแขนขึ้นเหนือศีรษะ',
        image: 'https://img.youtube.com/vi/-jXm7wgOtYs/maxresdefault.jpg',
        check: (landmarks) => {
            if (!checkHandsClasped(landmarks)) return false;
            const noseY = landmarks[0].y;
            const wristY = (landmarks[15].y + landmarks[16].y) / 2;
            
            // มือต้องอยู่สูงกว่าจมูกอย่างชัดเจน
            return wristY < noseY - 0.05;
        }
    }
];

let currentPoseIndex = 0;
let roundTimeLeft = 15; // เวลา 15 วินาทีต่อท่า
let roundTimerInterval;

// --- ระบบ Multiplayer 4 คน ---
const MAX_PLAYERS = 4;
const HOLD_DURATION = 3000; // ต้องค้างท่า 3 วินาที
const playerColors = ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c'];

let playerScores = new Array(MAX_PLAYERS).fill(0);
let isHoldingPose = new Array(MAX_PLAYERS).fill(false);
let holdStartTime = new Array(MAX_PLAYERS).fill(0);
let playerFinishedRound = new Array(MAX_PLAYERS).fill(false);

// --- ระบบเสียง Synth อัจฉริยะ ---
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

// --- โหลด AI Engine ---
const createPoseLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`, delegate: "GPU" },
        runningMode: "VIDEO", numPoses: MAX_PLAYERS
    });
    btnStart.innerText = "เริ่มต้นความสนุก";
    btnStart.disabled = false;
};
createPoseLandmarker();

// --- ลอจิกการเปลี่ยนท่าทาง ---
function startNextRound() {
    let newIndex;
    // สุ่มท่าที่ไม่ซ้ำกับท่าเดิม
    do { newIndex = Math.floor(Math.random() * POSES.length); } while (newIndex === currentPoseIndex && POSES.length > 1);
    currentPoseIndex = newIndex;
    
    const pose = POSES[currentPoseIndex];
    poseImage.src = pose.image;
    poseName.innerText = pose.name;
    poseDesc.innerText = pose.desc;
    
    roundTimeLeft = 15;
    playerFinishedRound.fill(false);
    isHoldingPose.fill(false);
    
    soundNextRound();
    poseGuide.classList.remove('hidden');

    clearInterval(roundTimerInterval);
    roundTimerInterval = setInterval(() => {
        roundTimeLeft--;
        const percentage = (roundTimeLeft / 15) * 100;
        timerFill.style.width = `${percentage}%`;
        
        if(roundTimeLeft <= 5) timerFill.style.background = '#e74c3c';
        else timerFill.style.background = '#2ecc71';

        // เช็คว่าผู้เล่นทุกคนที่อยู่ในกล้อง ผ่านท่านี้หมดแล้วหรือยัง?
        // (ส่วนนี้สามารถพัฒนาเพิ่มได้ ถ้าอยากให้เปลี่ยนท่าทันทีที่ทุกคนทำเสร็จ)

        if (roundTimeLeft <= 0) startNextRound(); // หมดเวลาเปลี่ยนท่าอัตโนมัติ
    }, 1000);
}

// --- Render Loop (วงจรกล้อง) ---
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
                    
                    if(!playerFinishedRound[i]) {
                        analyzePoseForPlayer(result.landmarks[i], i, color);
                    } else {
                        drawStatus(result.landmarks[i], color, "สำเร็จ! ✅");
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

// --- ฟังก์ชันวาดกราฟิก ---
function drawSkeleton(landmarks, color) {
    const drawingUtils = new DrawingUtils(canvasCtx);
    drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color: color, lineWidth: 3 });
    drawingUtils.drawLandmarks(landmarks, { color: 'rgba(255,255,255,0.8)', lineWidth: 2, radius: 4 });
}

function drawPlayerScore(landmarks, pIndex, color) {
    const nose = landmarks[0];
    if(nose.visibility < 0.5) return;
    
    const x = nose.x * canvasElement.width;
    const y = nose.y * canvasElement.height - 60; // ลอยขึ้นเหนือหัว
    
    // กล่องคะแนนสไตล์ Glass
    canvasCtx.fillStyle = color;
    canvasCtx.globalAlpha = 0.8;
    canvasCtx.beginPath(); canvasCtx.roundRect(x-25, y-25, 50, 50, 12); canvasCtx.fill();
    canvasCtx.globalAlpha = 1.0;
    
    canvasCtx.fillStyle = '#FFF'; 
    canvasCtx.font = 'bold 22px Prompt, Arial'; 
    canvasCtx.textAlign = 'center'; canvasCtx.textBaseline = 'middle';
    canvasCtx.fillText(playerScores[pIndex], x, y);
}

function drawStatus(landmarks, color, text) {
    const nose = landmarks[0];
    if(nose.visibility < 0.5) return;
    canvasCtx.fillStyle = color; 
    canvasCtx.font = 'bold 26px Prompt, Arial'; 
    canvasCtx.textAlign = 'center';
    canvasCtx.fillText(text, nose.x*canvasElement.width, nose.y*canvasElement.height + 60);
}

function drawProgressRing(x, y, progress, color) {
    const cX = x * canvasElement.width; const cY = y * canvasElement.height;
    // วงแหวนพื้นหลัง
    canvasCtx.beginPath(); canvasCtx.arc(cX, cY, 45, 0, 2*Math.PI); 
    canvasCtx.strokeStyle='rgba(255,255,255,0.3)'; canvasCtx.lineWidth=10; canvasCtx.stroke();
    // วงแหวนสีเต็ม
    canvasCtx.beginPath(); canvasCtx.arc(cX, cY, 45, -Math.PI/2, (-Math.PI/2)+(2*Math.PI*progress)); 
    canvasCtx.strokeStyle=color; canvasCtx.lineCap='round'; canvasCtx.lineWidth=10; canvasCtx.stroke();
}

// --- วิเคราะห์การจับเวลาของแต่ละคน ---
function analyzePoseForPlayer(landmarks, pIndex, color) {
    const isCorrectPose = POSES[currentPoseIndex].check(landmarks);

    if (isCorrectPose) {
        if (!isHoldingPose[pIndex]) {
            isHoldingPose[pIndex] = true;
            holdStartTime[pIndex] = Date.now();
            if(pIndex === 0) soundTick(); // ให้เสียงเตือนแค่คนแรก
        } else {
            const elapsed = Date.now() - holdStartTime[pIndex];
            const progress = Math.min(elapsed / HOLD_DURATION, 1);
            
            // วาดวงแหวนจับเวลาที่กลางหน้าอก
            const chestX = (landmarks[11].x+landmarks[12].x)/2;
            const chestY = (landmarks[11].y+landmarks[12].y)/2;
            drawProgressRing(chestX, chestY, progress, color);

            if (progress >= 1) {
                playerScores[pIndex] += 1;
                playerFinishedRound[pIndex] = true; // ล็อกว่าผ่านท่านี้แล้ว
                soundSuccess();
            }
        }
    } else {
        isHoldingPose[pIndex] = false;
    }
}

// --- การควบคุมปุ่มกด ---
btnStart.addEventListener('click', () => {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    document.getElementById('start-overlay').classList.add('hidden');
    
    // ตั้งค่ากล้องความละเอียดสูง
    navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: "user" } })
        .then((stream) => {
            videoElement.srcObject = stream;
            videoElement.addEventListener("loadeddata", () => {
                isGameRunning = true;
                startNextRound(); // เริ่มลุยท่าแรก
                renderLoop();
            });
        }).catch(err => { 
            statusText.innerText = "ไม่สามารถเข้าถึงกล้องได้ กรุณาตรวจสอบสิทธิ์"; 
            console.error(err);
        });
});

const btnSound = document.getElementById('btn-sound');
btnSound.addEventListener('click', () => {
    isSoundOn = !isSoundOn;
    btnSound.innerText = isSoundOn ? "🔊" : "🔇";
    if(isSoundOn && audioCtx.state === 'suspended') audioCtx.resume();
});
