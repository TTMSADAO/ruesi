// --- การตั้งค่าตัวแปรอ้างอิง UI ---
const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const scoreDisplay = document.getElementById('score-display');
const statusBanner = document.getElementById('status-banner');
const statusText = document.getElementById('status-text');
const cameraContainer = document.getElementById('camera-container');

// --- สถานะเกม ---
let score = 0;
let isSoundOn = true;
let isHoldingPose = false;
let holdStartTime = 0;
const HOLD_DURATION = 3000; // ต้องค้างท่า 3 วินาที (3000 ms)

// --- ระบบเสียงสังเคราะห์ (ไม่ต้องใช้ไฟล์ .mp3) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(frequency, type, duration) {
    if (!isSoundOn) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}
// เสียงเตือนต่างๆ
function soundTick() { playTone(600, 'sine', 0.1); }
function soundSuccess() { 
    playTone(523.25, 'sine', 0.1); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.1), 100); // E5
    setTimeout(() => playTone(783.99, 'sine', 0.3), 200); // G5
}

// --- ฟังก์ชันอัปเดต UI ---
function setStatus(text, type = '') {
    statusText.innerText = text;
    statusBanner.className = 'status-banner ' + type;
    cameraContainer.className = 'camera-container ' + (type === 'success' ? 'ready' : (type === 'warning' ? 'error' : ''));
}

// --- การประมวลผล MediaPipe AI ---
function onResults(results) {
    // ปรับขนาด Canvas ให้พอดีกับ Video เสมอ
    canvasElement.width = videoElement.clientWidth;
    canvasElement.height = videoElement.clientHeight;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.poseLandmarks) {
        drawSkeleton(results.poseLandmarks);
        analyzePose(results.poseLandmarks);
    } else {
        setStatus("ไม่พบร่างกาย กรุณาเข้ากล้อง", "warning");
        resetHold();
    }
    canvasCtx.restore();
}

// --- วาดโครงร่างร่างกาย ---
function drawSkeleton(landmarks) {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.strokeStyle = "#4a90e2";
    canvasCtx.lineWidth = 4;

    // เส้นเชื่อมข้อต่อหลัก (แขนและไหล่)
    const connections = [
        [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // แขนและไหล่
        [11, 23], [12, 24], [23, 24] // ลำตัว
    ];

    connections.forEach(([i, j]) => {
        const p1 = landmarks[i]; const p2 = landmarks[j];
        if (p1.visibility > 0.5 && p2.visibility > 0.5) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(p1.x * canvasElement.width, p1.y * canvasElement.height);
            canvasCtx.lineTo(p2.x * canvasElement.width, p2.y * canvasElement.height);
            canvasCtx.stroke();
        }
    });

    // วาดจุดข้อต่อ
    landmarks.forEach((point, index) => {
        if (point.visibility > 0.5 && (index > 10)) { // วาดตั้งแต่ไหล่ลงไป
            canvasCtx.beginPath();
            canvasCtx.arc(point.x * canvasElement.width, point.y * canvasElement.height, 6, 0, 2 * Math.PI);
            canvasCtx.fill();
            canvasCtx.stroke();
        }
    });
}

// --- วาดวงแหวนจับเวลา (Progress Ring) ---
function drawProgressRing(x, y, progress) {
    const radius = 50;
    const centerX = x * canvasElement.width;
    const centerY = y * canvasElement.height;

    // วงแหวนพื้นหลัง
    canvasCtx.beginPath();
    canvasCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    canvasCtx.strokeStyle = 'rgba(255,255,255,0.3)';
    canvasCtx.lineWidth = 10;
    canvasCtx.stroke();

    // วงแหวนความคืบหน้า (สีเขียว)
    canvasCtx.beginPath();
    canvasCtx.arc(centerX, centerY, radius, -Math.PI / 2, (-Math.PI / 2) + (2 * Math.PI * progress));
    canvasCtx.strokeStyle = '#4CAF50';
    canvasCtx.lineCap = 'round';
    canvasCtx.lineWidth = 10;
    canvasCtx.stroke();

    // ข้อความวินาทีตรงกลาง
    canvasCtx.fillStyle = '#FFF';
    canvasCtx.font = 'bold 24px Arial';
    canvasCtx.textAlign = 'center';
    canvasCtx.textBaseline = 'middle';
    canvasCtx.fillText(`${Math.ceil(progress * 3)}s`, centerX, centerY);
}

// --- วิเคราะห์ท่าทาง (Logic) ---
function analyzePose(landmarks) {
    const nose = landmarks[0];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];

    // 1. ตรวจสอบระยะห่าง (Proximity)
    const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
    if (shoulderWidth > 0.6) {
        setStatus("ถอยหลังออกไปอีกนิด", "warning"); resetHold(); return;
    } else if (shoulderWidth < 0.15) {
        setStatus("เดินเข้ามาใกล้กล้องอีกนิด", "warning"); resetHold(); return;
    }

    // 2. ตรวจสอบท่าทาง: ชูมือสองข้างขึ้นเหนือหัว (ท่าแก้เกียจ)
    const isHandsUp = (leftWrist.y < nose.y) && (rightWrist.y < nose.y) && 
                      (leftWrist.visibility > 0.6) && (rightWrist.visibility > 0.6);

    if (isHandsUp) {
        // ทำท่าถูกต้อง เริ่มจับเวลา
        if (!isHoldingPose) {
            isHoldingPose = true;
            holdStartTime = Date.now();
            soundTick();
            setStatus("เยี่ยมมาก! ค้างท่าไว้...", "success");
        } else {
            // คำนวณความคืบหน้า
            const elapsedTime = Date.now() - holdStartTime;
            const progress = Math.min(elapsedTime / HOLD_DURATION, 1);
            
            // วาดวงแหวนตรงกลางหน้าอก (กึ่งกลางระหว่างไหล่ 2 ข้าง)
            const chestX = (leftShoulder.x + rightShoulder.x) / 2;
            const chestY = (leftShoulder.y + rightShoulder.y) / 2;
            drawProgressRing(chestX, chestY, progress);

            if (progress >= 1) {
                // สำเร็จ!
                score += 10; // ได้ 10 คะแนนต่อครั้ง
                scoreDisplay.innerText = score;
                soundSuccess();
                setStatus("สุดยอด! ได้รับ 10 คะแนน 🌟", "success");
                resetHold();
                
                // ดีเลย์ไม่ให้คะแนนเด้งรัวๆ
                setTimeout(() => resetHold(), 2000); 
            }
        }
    } else {
        setStatus("จัดท่า: ชูมือทั้งสองข้างขึ้นเหนือศีรษะ");
        resetHold();
    }
}

function resetHold() {
    isHoldingPose = false;
    holdStartTime = 0;
}

// --- เริ่มต้นระบบ ---
const pose = new Pose({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}` });
pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });
pose.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => { await pose.send({image: videoElement}); },
    width: 640, height: 480
});

// กดปุ่มเริ่ม
document.getElementById('btn-start').addEventListener('click', () => {
    // ต้องปลุก AudioContext ด้วยการคลิกของ User เสมอ (ข้อกำหนดของเบราว์เซอร์)
    if(audioCtx.state === 'suspended') audioCtx.resume();
    document.getElementById('start-overlay').classList.add('hidden');
    document.getElementById('btn-start').innerText = "กำลังเชื่อมต่อกล้อง...";
    camera.start();
});

// ปุ่มปิด/เปิดเสียง
const btnSound = document.getElementById('btn-sound');
btnSound.addEventListener('click', () => {
    isSoundOn = !isSoundOn;
    btnSound.innerText = isSoundOn ? "🔊" : "🔇";
    if(isSoundOn && audioCtx.state === 'suspended') audioCtx.resume();
});
