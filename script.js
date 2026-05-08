<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=no">
  <title>Sadao Hospital Queue</title>
  <link rel="icon" type="image/png" href="https://img2.pic.in.th/0031fa6940ff58a50b9.png">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#2e7d32">
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  
  <style>
    :root { --primary: #2e7d32; --primary-light: #e8f5e9; --primary-dark: #1b5e20; --bg-color: #f4f7f6; }
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body { font-family: 'Prompt', sans-serif; background-color: var(--bg-color); margin: 0; padding: 0; min-height: 100vh; color: #1e293b; }
    .hidden { display: none !important; }
    .fade-in { animation: fadeIn 0.4s ease-in-out; }

    .lang-toggle-btn { position: absolute; top: 15px; right: 15px; background: linear-gradient(135deg, #ff7e5f, #feb47b); border: 2px solid rgba(255,255,255,0.8); color: white; padding: 8px 16px; border-radius: 25px; font-size: 0.95rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; z-index: 10; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); box-shadow: 0 4px 15px rgba(255, 126, 95, 0.4); animation: pulseGlow 2s infinite; }
    .lang-toggle-btn i { font-size: 1.1rem; } .lang-toggle-btn:hover { transform: translateY(-2px) scale(1.05); box-shadow: 0 6px 20px rgba(255, 126, 95, 0.6); } .lang-toggle-btn:active { transform: scale(0.95); animation: none; }
    @keyframes pulseGlow { 0% { box-shadow: 0 0 0 0 rgba(255, 126, 95, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(255, 126, 95, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 126, 95, 0); } }

    .home-container { max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding-bottom: 40px; position: relative; }
    .hero-banner { width: 100%; height: 260px; background-image: url('https://img2.pic.in.th/pic/2e56ebb3c838125fd55c9db5dcd51baf.png'); background-size: cover; background-position: center; position: relative; border-radius: 0 0 30px 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); margin-bottom: 20px; overflow: hidden; }
    .hero-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(46,125,50,0.35), rgba(27,94,32,0.95)); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: white; padding: 20px; }
    .main-logo { width: 80px; height: 80px; object-fit: contain; margin-bottom: 12px; background: white; border-radius: 50%; padding: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); cursor: pointer; transition: transform 0.1s; } .main-logo:active { transform: scale(0.9); }
    .online-badge { background: rgba(0,0,0,0.3); padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(4px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-top:12px; }
    .online-dot { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 8px #4ade80; animation: pulseDot 2s infinite; }

    .premium-glass-card { width: 90%; max-width: 560px; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,1); border-radius: 24px; padding: 20px; position: relative; overflow: hidden; box-shadow: 0 10px 30px rgba(31, 38, 135, 0.1); margin-top: -50px; margin-bottom: 25px; z-index: 5; }
    .mu-profile-list { display: flex; flex-direction: column; gap: 10px; }
    .mu-profile { display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.9); padding: 12px 15px; border-radius: 16px; border: 1px solid #e2e8f0; cursor: pointer; transition: 0.2s; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
    .mu-profile:hover { border-color: var(--primary); background: #f0fdf4; transform: translateY(-2px); box-shadow: 0 6px 15px rgba(74, 222, 128, 0.15); }
    .mu-info { display: flex; align-items: center; gap: 12px; }
    .mu-avatar { width: 40px; height: 40px; background: linear-gradient(135deg, var(--primary-light), #bbf7d0); color: var(--primary-dark); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; box-shadow: inset 0 2px 4px rgba(255,255,255,0.8); }
    .mu-name { font-weight: 700; color: #1e293b; font-size: 1rem; } .mu-name span { display: block; font-size: 0.75rem; color: #64748b; font-weight: 400; margin-top: 2px;}
    .mu-delete { color: #ef4444; padding: 8px; font-size: 1.1rem; cursor: pointer; opacity: 0.5; transition: 0.2s; } .mu-delete:hover { opacity: 1; transform: scale(1.1); }
    .btn-add-user { background: rgba(255,255,255,0.6); border: 2px dashed #cbd5e1; color: #64748b; width: 100%; padding: 12px; border-radius: 16px; font-weight: 700; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top:10px;}
    .btn-add-user:hover { background: white; border-color: var(--primary); color: var(--primary); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .aps-history { background: rgba(255, 255, 255, 0.7); border-radius: 16px; padding: 15px; margin-top: 15px; border: 1px solid rgba(46, 125, 50, 0.15); box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
    .btn-cancel-q { background: #fee2e2; color: #ef4444; border: 1px solid #f87171; padding: 10px; border-radius: 12px; font-size: 0.9rem; font-weight: 700; cursor:pointer; width:100%; margin-top:12px; transition:0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; }
    .btn-cancel-q:hover { background: #fecaca; color: #b91c1c; border-color: #ef4444; }
    .btn-cancel-q:active { transform: scale(0.97); }

    .menu-container { width: 100%; padding: 0 20px; z-index: 2; }
    .dept-card { background: white; border-radius: 22px; padding: 20px; margin-bottom: 16px; display: flex; align-items: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.05); position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.8); transition: transform 0.2s; }
    .dept-card:active { transform: scale(0.97); }
    .dept-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; border-radius: 6px 0 0 6px; }
    .card-ttm::before { background: #2e7d32; } .card-tcm::before { background: #c62828; } .card-postpartum::before { background: #ec4899; } .card-steam::before { background: #0288d1; }
    .dept-icon { width: 65px; height: 65px; border-radius: 18px; margin-right: 18px; object-fit: cover; background: #f8fafc; padding: 2px; }
    .dept-info h3 { margin: 0 0 4px 0; font-size: 1.15rem; font-weight: 700; color: #1e293b; } .dept-info p { margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.4; }
    .arrow-btn { margin-left: auto; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #cbd5e1; font-size: 1.1rem; }

    .top-section { background: var(--primary); color: white; padding: 15px 0 10px 0; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 15px rgba(0,0,0,0.15); transition: background 0.3s; }
    .header-top-row { display: flex; align-items: center; justify-content: center; position: relative; padding: 0 15px; margin-bottom: 8px; }
    .back-btn { position: absolute; left: 15px; background: rgba(255,255,255,0.2); width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.1rem; }
    .header-logo-title { display: flex; align-items: center; gap: 10px; } .header-logo-title img { width: 36px; height: 36px; background: white; border-radius: 50%; padding: 2px; object-fit: contain; } .header-logo-title h1 { margin: 0; font-size: 1.3rem; font-weight: 700; text-shadow: 0 1px 3px rgba(0,0,0,0.2); }
    .sync-status-container { display: flex; justify-content: center; margin-bottom: 5px; } .sync-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0, 0, 0, 0.2); padding: 4px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
    .spin-active { animation: spin 1s linear infinite; color: #fde047; }
    .date-scroller { display: flex; overflow-x: auto; padding: 10px 15px 5px 15px; gap: 10px; scrollbar-width: none; } .date-scroller::-webkit-scrollbar { display: none; }
    .date-chip { background: rgba(255,255,255,0.15); color: white; border-radius: 14px; padding: 10px 0; min-width: 60px; text-align: center; cursor: pointer; flex-shrink: 0; position: relative; transition: 0.2s; }
    .date-chip small { font-size: 0.7rem; display: block; margin-bottom: 2px; opacity: 0.9; } .date-chip span { font-size: 1.15rem; display: block; font-weight: 700; line-height: 1; }
    .date-chip.active { background: white; color: var(--primary); transform: scale(1.05); border: none; } .date-chip.active::after { content:''; position: absolute; bottom: 0; left: 0; right: 0; height: 5px; background: #e040fb; border-radius: 0 0 14px 14px; }

    .container { max-width: 600px; margin: 0 auto; padding: 0 15px 80px; }
    .selected-date-header { font-size: 1.1rem; font-weight: 700; color: #1e293b; padding: 20px 5px 15px; display: flex; align-items: center; } .header-bar { width: 5px; height: 20px; border-radius: 5px; margin-right: 12px; background-color: var(--primary); }
    .grid-container { display: flex; flex-direction: column; gap: 14px; }
    .slot-card { display: flex; justify-content: space-between; align-items: center; background: white; border-radius: 16px; padding: 12px 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #f1f5f9; position: relative; overflow: hidden; animation: slideUp 0.3s forwards; opacity: 0; transition: transform 0.2s; border-left: 6px solid var(--primary); cursor: pointer; }
    .slot-card:active { transform: scale(0.98); } .slot-card.is-full { border-left-color: #cbd5e1; background: #f8fafc; opacity: 0.85; pointer-events: none; cursor: default; }
    .theme-tcm { border-left-color: #c62828 !important; } .theme-postpartum { border-left-color: #ec4899 !important; } .slot-male { border-left-color: #3b82f6 !important; background: #eff6ff !important; } .slot-female { border-left-color: #ec4899 !important; background: #fdf2f8 !important; }
    .time-wrap { display: flex; align-items: center; gap: 14px; } .icon-status { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; background: var(--primary-light); color: var(--primary); } .is-full .icon-status { background: #e2e8f0; color: #94a3b8; }
    .time-text { font-weight: 700; font-size: 1.15rem; color: #1e293b; display: flex; flex-direction: column; line-height: 1.2; } .time-text small { font-size: 0.7rem; color: #64748b; font-weight: 500; margin-top: 2px; }
    .slot-info-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
    .status-capsule { display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 8px; background: var(--primary-light); padding: 8px 16px; border-radius: 14px; min-width: 90px; border: 1px solid rgba(76, 175, 80, 0.2); } .is-full .status-capsule { background: #e2e8f0; border-color: transparent; }
    .queue-icons { display: flex; gap: 3px; color: var(--primary); font-size: 0.9rem; opacity: 0.9; align-items: center;} .status-text { font-size: 0.95rem; font-weight: 700; color: var(--primary); line-height: 1; } .is-full .status-text { color: #64748b; }
    .badge-2hr { background: #f59e0b; color: white; font-size: 0.7rem; padding: 2px 8px; border-radius: 10px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }

    .loading-screen, .page-loader { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.95); z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: 0.3s; backdrop-filter: blur(5px); } 
    .loading-screen.hidden, .page-loader.hidden { opacity: 0; pointer-events: none; }
    .circle-wrap { position: relative; width: 120px; height: 120px; margin-bottom: 20px; }
    .circle-wrap svg { transform: rotate(-90deg); width: 120px; height: 120px; }
    .circle-bg { fill: none; stroke: #e2e8f0; stroke-width: 8; }
    .circle-progress { fill: none; stroke: var(--primary); stroke-width: 8; stroke-dasharray: 326; stroke-dashoffset: 326; stroke-linecap: round; }
    .percent-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.5rem; font-weight: 700; color: var(--primary); }
    .loading-title { font-size: 1.2rem; font-weight: 700; color: #1e293b; margin-bottom: 5px; }
    .tips-box { background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px dashed #cbd5e1; width: 85%; max-width: 350px; text-align: center; min-height: 120px; display: flex; flex-direction: column; justify-content: center; margin-top:20px; }
    .tips-title { font-weight: 700; color: var(--primary-dark); margin-bottom: 8px; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .tips-text { font-size: 0.85rem; color: #475569; line-height: 1.5; }

    @keyframes spin { 100% { transform: rotate(360deg); } } @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.65); z-index: 1000; display: flex; align-items: flex-end; justify-content: center; opacity: 0; visibility: hidden; transition: 0.3s; backdrop-filter: blur(5px); } .modal-overlay.show { opacity: 1; visibility: visible; }
    .modal-card { background: white; width: 100%; max-width: 500px; border-radius: 28px 28px 0 0; padding: 25px 20px 40px; box-shadow: 0 -10px 40px rgba(0,0,0,0.2); transform: translateY(100%); transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); max-height: 90vh; overflow-y: auto; } .modal-overlay.show .modal-card { transform: translateY(0); }
    .form-group { margin-bottom: 16px; } .form-label { display: block; margin-bottom: 6px; font-size: 0.95rem; color: #475569; font-weight: 600; }
    .form-control { width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 12px; font-family: 'Prompt', sans-serif; font-size: 1.05rem; background: #f8fafc; outline: none; transition: 0.2s; color: #1e293b; }
    .form-control:focus { border-color: var(--primary); background: white; box-shadow: 0 0 0 4px var(--primary-light); }
    .form-control[readonly] { background: #e2e8f0; color: #64748b; cursor: not-allowed; border-color: #cbd5e1; }
    
    .otp-container { display: flex; gap: 5px; justify-content: space-between; margin-bottom: 5px; }
    .otp-box { width: 100%; aspect-ratio: 1/1.2; text-align: center; font-size: 1.2rem; font-weight: 700; border: 2px solid #cbd5e1; border-radius: 8px; background: #f8fafc; color: var(--primary-dark); transition: all 0.2s; padding: 0; outline: none; font-family: 'Prompt', sans-serif; }
    .otp-box:focus { border-color: #4ade80; background: white; box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.2); transform: translateY(-2px); }
    .otp-box.filled { border-color: var(--primary); background: #f0fdf4; }
    .id-card-input { background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%) !important; border: 2px solid #4ade80 !important; color: #166534 !important; font-size: 1.3rem !important; font-weight: 700 !important; letter-spacing: 3px !important; text-align: center; transition: all 0.3s ease; }
    
    .custom-select { width: 100%; padding: 10px 15px; border: 2px solid #e2e8f0; border-radius: 12px; background: #f8fafc; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: 0.2s; }
    .select-img { width: 36px; height: 36px; border-radius: 50%; object-fit: contain; border: 1px solid #e2e8f0; background: #fff; }
    .select-items { position: absolute; top: calc(100% + 5px); left: 0; right: 0; background: white; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.15); max-height: 220px; overflow-y: auto; z-index: 20; display: none; }
    .custom-select.open + .select-items { display: block; animation: fadeIn 0.2s; } .select-item { padding: 10px 15px; display: flex; align-items: center; gap: 12px; cursor: pointer; border-bottom: 1px solid #f1f5f9; }
    
    .btn-group { display: flex; gap: 12px; margin-top: 25px; } .btn { flex: 1; padding: 14px; border: none; border-radius: 14px; font-size: 1.05rem; cursor: pointer; font-family: 'Prompt', sans-serif; font-weight: 700; transition: 0.2s; text-align:center;}
    .btn-cancel { background: #f1f5f9; color: #64748b; } .btn-cancel:active { transform: scale(0.96); background: #e2e8f0; }
    .btn-confirm { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3); } .btn-confirm:active { transform: scale(0.96); }
    .btn-confirm:disabled { background: #cbd5e1; color: #94a3b8; cursor: not-allowed; box-shadow: none; }
    .toggle-container { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 15px; background: #f8fafc; padding: 10px; border-radius: 12px; border: 1px solid #e2e8f0; }

    /* 🚥 STEPPER STYLES */
    .stepper-wrapper { display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; padding: 0 10px; }
    .step { display: flex; flex-direction: column; align-items: center; gap: 6px; position: relative; z-index: 2; width: 60px; }
    .step-circle { width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0; color: #64748b; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; transition: 0.3s; border: 2px solid transparent; }
    .step.active .step-circle { background: var(--primary); color: white; box-shadow: 0 0 0 4px var(--primary-light); }
    .step.completed .step-circle { background: white; color: var(--primary); border-color: var(--primary); }
    .step-label { font-size: 0.7rem; font-weight: 600; color: #64748b; text-align: center; white-space: nowrap; transition: 0.3s; }
    .step.active .step-label { color: var(--primary-dark); }
    .step.completed .step-label { color: var(--primary); }
    .step-line { flex: 1; height: 3px; background: #e2e8f0; margin: 0 -15px; position: relative; top: -10px; z-index: 1; transition: 0.3s; }
    .step-line.active { background: var(--primary); }

    /* 🔥 3D SWEETALERT OVERRIDE 🔥 */
    .swal2-popup { border-radius: 24px !important; background: linear-gradient(145deg, #ffffff, #f8fafc) !important; box-shadow: 10px 10px 25px #d1d9e6, -10px -10px 25px #ffffff !important; border: 1px solid #e2e8f0 !important; padding: 2em !important; }
    .swal2-title { color: #1e293b !important; font-family: 'Prompt', sans-serif !important; font-weight: 700 !important; }
    .swal2-html-container { font-family: 'Prompt', sans-serif !important; color: #475569 !important; }
    .swal2-confirm, .swal2-cancel, .swal2-deny { border-radius: 14px !important; font-family: 'Prompt', sans-serif !important; font-weight: 700 !important; padding: 12px 24px !important; box-shadow: 4px 4px 10px rgba(0,0,0,0.15) !important; transition: transform 0.2s !important; border:none !important;}
    .swal2-confirm:active, .swal2-cancel:active, .swal2-deny:active { transform: scale(0.95) !important; }

    /* Custom Buttons for Add-ons */
    .swal-actions-vertical { flex-direction: column !important; gap: 10px !important; margin-top: 20px !important; width: 100% !important; }
    .swal-actions-vertical button { width: 100% !important; margin: 0 !important; }
    .swal-btn-1hr { background: linear-gradient(145deg, #22c55e, #16a34a) !important; color: white !important; font-size: 1.05rem !important; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4) !important;}
    .swal-btn-2hr { background: linear-gradient(145deg, #f59e0b, #d97706) !important; color: white !important; font-size: 1.05rem !important; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4) !important;}
    .swal-btn-steam { background: linear-gradient(145deg, #0ea5e9, #0284c7) !important; color: white !important; font-size: 1.05rem !important; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4) !important;}
    .swal-btn-cancel-light { background: #f1f5f9 !important; color: #64748b !important; box-shadow: none !important; border: 1px solid #cbd5e1 !important;}

    /* ADMIN STYLES */
    .admin-tab-container { display: flex; background: #e2e8f0; border-radius: 14px; padding: 4px; margin-bottom: 20px; }
    .admin-tab { flex: 1; text-align: center; padding: 10px; font-size: 0.9rem; font-weight: 700; color: #64748b; cursor: pointer; border-radius: 10px; transition: 0.3s; }
    .admin-tab.active { background: white; color: var(--primary); box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    .admin-panel { display: none; animation: fadeIn 0.3s; } .admin-panel.active { display: block; }
    .table-responsive { width: 100%; overflow-x: auto; border-radius: 12px; border: 1px solid #e2e8f0; background: white; }
    .log-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    .log-table th { background: #f1f5f9; padding: 12px 10px; text-align: left; color: #475569; font-weight: 700; border-bottom: 2px solid #cbd5e1; white-space: nowrap; }
    .log-table td { padding: 10px; border-bottom: 1px solid #f1f5f9; color: #1e293b; vertical-align: middle; }
    .btn-icon { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; transition: 0.2s; font-size: 1rem; }
    .btn-edit { color: #0ea5e9; background: #e0f2fe; } .btn-delete { color: #ef4444; background: #fee2e2; } .btn-plan { color: #8b5cf6; background: #f3e8ff; } .btn-telebook { color: #16a34a; background: #dcfce7; font-size:0.8rem; font-weight:bold; padding:4px 8px;}

    /* 🏷️ RIGHT SELECTION STYLES */
    .right-option { padding: 14px 15px; border: 2px solid #e2e8f0; border-radius: 16px; margin-bottom: 12px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); background: #f8fafc; display: flex; flex-direction: column; gap: 2px; }
    .right-option:hover { border-color: #cbd5e1; background: #f1f5f9; transform: scale(1.02); }
    .right-option.selected { border-color: var(--primary); background: var(--primary-light); box-shadow: 0 4px 12px rgba(46, 125, 50, 0.15); transform: translateY(-2px); }
    .right-title-row { display: flex; align-items: center; gap: 10px; font-weight: 700; color: #1e293b; font-size: 0.95rem; }
    .right-desc { font-size: 0.75rem; color: #64748b; margin-left: 28px; line-height: 1.3; font-weight: 400; }
    
    /* 🔥 3D REALISTIC BILL STYLES 🔥 */
    .receipt-3d { background: #ffffff; border-radius: 20px; padding: 20px; box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff; border: 1px solid #f1f5f9; margin-top: 15px; position: relative; overflow: hidden; }
    .receipt-3d::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: repeating-linear-gradient(45deg, var(--primary), var(--primary) 10px, #4ade80 10px, #4ade80 20px); }
    .total-box-3d { background: #f8fafc; border-radius: 16px; padding: 15px 20px; box-shadow: inset 4px 4px 8px #e2e8f0, inset -4px -4px 8px #ffffff; display: flex; justify-content: space-between; align-items: center; margin-top: 15px; border: 1px solid #f1f5f9; }
    .price-red { color: #dc2626; text-shadow: 1px 1px 0px rgba(220, 38, 38, 0.2); }
    .price-green { color: #16a34a; text-shadow: 1px 1px 0px rgba(22, 163, 74, 0.2); }
  </style>
</head>
<body>

  <div id="saveLoader" class="loading-screen hidden">
      <div class="circle-wrap">
          <svg><circle class="circle-bg" cx="60" cy="60" r="52"></circle><circle class="circle-progress" id="progress-circle" cx="60" cy="60" r="52"></circle></svg>
          <div class="percent-text" id="progress-text">0%</div>
      </div>
      <div class="loading-title" id="t-saving">ระบบรับข้อมูลแล้ว</div>
      <div style="color:var(--primary); font-weight:bold; font-size:0.95rem; margin-top:5px;" id="t-saving-sub">กรุณารอสักครู่ เพื่อยืนยันข้อมูล...</div>
      <div class="tips-box">
          <div class="tips-title" id="tip-title"><i class="fas fa-clock"></i> มาก่อนเวลา 15 นาที</div>
          <div class="tips-text" id="tip-text">หากไม่มาติดต่อภายในเวลาที่กำหนด<br>ถือว่าท่านสละสิทธิ์</div>
      </div>
  </div>

  <div id="pageLoader" class="page-loader hidden">
      <div class="circle-wrap" style="width:60px; height:60px;">
          <svg style="width:60px; height:60px; animation:spin 1s linear infinite;"><circle class="circle-bg" cx="30" cy="30" r="26" stroke="#e2e8f0" stroke-width="4"></circle><circle class="circle-progress" cx="30" cy="30" r="26" stroke="var(--primary)" stroke-width="4" stroke-dasharray="163" stroke-dashoffset="40"></circle></svg>
      </div>
      <div style="color:var(--primary); font-weight:700;" id="t-loading">กำลังโหลด...</div>
  </div>

  <div id="view-home" class="home-container fade-in">
    <div class="lang-toggle-btn" onclick="toggleLanguage()"><i class="fas fa-globe"></i> <span id="current-lang-text">EN</span></div>
    <div class="hero-banner">
        <div class="hero-overlay">
            <img src="https://img2.pic.in.th/pic/6f7b352408393a1295f3000e7d9e6754.md.png" class="main-logo" onclick="handleAdminTap()">
            <h2 style="margin:0; font-size:1rem; font-weight:500; opacity:0.9;" id="t-h2">กลุ่มงานการแพทย์แผนไทยและการแพทย์ทางเลือก</h2>
            <h1 style="margin:5px 0 12px 0; font-size:1.6rem; text-shadow:0 2px 4px rgba(0,0,0,0.3);" id="t-h1">โรงพยาบาลสะเดา</h1>
            <div class="online-badge"><div class="online-dot"></div><span id="t-online">เปิดให้บริการออนไลน์ 24 ชม.</span></div>
        </div>
    </div>
    <div id="main-auth-card" class="premium-glass-card"></div>
    <div class="menu-container">
        <div class="dept-card card-ttm" onclick="openApp('ttm')"><img src="https://img2.pic.in.th/pic/619e72dc2124132ccf4620717d4fa58d.md.png" class="dept-icon" style="width:65px; height:65px;"><div class="dept-info"><h3 id="t-menu-ttm">แพทย์แผนไทย</h3><p id="t-desc-ttm">นวดรักษา, ประคบ, นวดส่งเสริมฯ</p></div><div class="arrow-btn"><i class="fas fa-chevron-right"></i></div></div>
        <div class="dept-card card-tcm" onclick="openApp('tcm')"><img src="https://img2.pic.in.th/pic/--06d2d95efaba2074.md.png" class="dept-icon" style="width:65px; height:65px;"><div class="dept-info"><h3 id="t-menu-tcm">แพทย์แผนจีน</h3><p id="t-desc-tcm">ฝังเข็ม, ครอบแก้ว, ฝังเข็มใบหน้า</p></div><div class="arrow-btn"><i class="fas fa-chevron-right"></i></div></div>
        <div class="dept-card card-postpartum" onclick="openApp('postpartum')"><img src="https://img2.pic.in.th/pic/eb06897c542c79b64690c8e794fa84a4.png" class="dept-icon" style="width:65px; height:65px;"><div class="dept-info"><h3 id="t-menu-post">บริการหลังคลอด</h3><p id="t-desc-post">หลังคลอดธรรมชาติ 7 วัน / ผ่า 1 เดือน</p></div><div class="arrow-btn"><i class="fas fa-chevron-right"></i></div></div>
        <div class="dept-card card-steam" onclick="openApp('steam')"><img src="https://img2.pic.in.th/pic/-3b445847427fcbfd.png" class="dept-icon" style="width:65px; height:65px;"><div class="dept-info"><h3 id="t-menu-steam">อบไอน้ำสมุนไพร</h3><p id="t-desc-steam">ช่วยการไหลเวียนโลหิต ภูมิแพ้</p></div><div class="arrow-btn"><i class="fas fa-chevron-right"></i></div></div>
    </div>
  </div>

  <div id="view-dashboard" class="hidden">
    <div class="top-section" id="top-header">
        <div class="lang-toggle-btn" onclick="toggleLanguage()" style="top:10px; padding:4px 12px; font-size:0.8rem; animation:none;"><i class="fas fa-globe"></i> <span id="current-lang-dash">EN</span></div>
        <div class="header-top-row">
            <div class="back-btn" onclick="goHome()"><i class="fas fa-arrow-left"></i></div>
            <div class="header-logo-title"><img id="app-logo" src="" style="width:36px; height:36px;"><h1 id="app-title"></h1></div>
        </div>
        <div class="sync-status-container"><div class="sync-badge" id="sync-badge-ui"><i id="sync-icon" class="fas fa-sync-alt"></i> <span id="sync-text">อัปเดตล่าสุด --:--</span></div></div>
        <div id="dateScroller" class="date-scroller"></div>
    </div>
    <div class="container"><div id="contentArea"></div></div>
  </div>

  <div id="bookingModal" class="modal-overlay">
    <div class="modal-card">
      <div style="font-size:1.25rem; font-weight:700; margin-bottom:15px; color:#1e293b; display:flex; align-items:center; gap:10px;">
          <span id="t-fill-info"></span>
      </div>
      
      <div class="stepper-wrapper" id="booking-stepper">
          <div class="step active" id="step-ind-1"><div class="step-circle">1</div><div class="step-label" id="t-step1">ข้อมูลผู้ป่วย</div></div>
          <div class="step-line" id="line-1"></div>
          <div class="step" id="step-ind-2"><div class="step-circle">2</div><div class="step-label" id="t-step2">เลือกบริการ</div></div>
          <div class="step-line" id="line-2"></div>
          <div class="step" id="step-ind-3"><div class="step-circle">3</div><div class="step-label" id="t-step3">ยืนยัน</div></div>
      </div>
      
      <div id="step-1-patient">
          <div id="auth-section" style="display: block;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                  <label class="form-label" id="lbl-idcard" style="color:var(--primary); margin:0;">เลขประจำตัวประชาชน <span style="color:red">*</span></label>
                  <div class="toggle-container" style="margin:0; padding:5px 10px; background:#f1f5f9;">
                      <input type="checkbox" id="chk-foreigner" onchange="toggleForeignerMode()">
                      <label for="chk-foreigner" class="toggle-label" style="font-size:0.75rem;" id="t-foreigner-chk">ชาวต่างชาติ</label>
                  </div>
              </div>
              <div id="thai-id-boxes" class="otp-container">
                  <input type="tel" maxlength="1" class="otp-box"><input type="tel" maxlength="1" class="otp-box"><input type="tel" maxlength="1" class="otp-box"><input type="tel" maxlength="1" class="otp-box"><input type="tel" maxlength="1" class="otp-box"><input type="tel" maxlength="1" class="otp-box"><input type="tel" maxlength="1" class="otp-box"><input type="tel" maxlength="1" class="otp-box"><input type="tel" maxlength="1" class="otp-box"><input type="tel" maxlength="1" class="otp-box"><input type="tel" maxlength="1" class="otp-box"><input type="tel" maxlength="1" class="otp-box"><input type="tel" maxlength="1" class="otp-box">
              </div>
              <input type="text" id="inp-idcard-foreigner" class="form-control id-card-input hidden" placeholder="Enter Passport Number" maxlength="20" oninput="checkIDCardInput()">
              <input type="hidden" id="inp-idcard">
              <div style="font-size:0.75rem; color:#64748b; margin-top:12px; text-align:center;" id="t-pdpa"><i class="fas fa-shield-alt" style="color:#4caf50;"></i> ปลอดภัย 100% ตามมาตรฐาน PDPA</div>
              <div id="idcard-status" style="font-size:0.85rem; margin-top:10px; font-weight:600; text-align:center;"></div>
          </div>

          <div id="existing-user-display" class="hidden" style="background:var(--primary-light); padding:15px; border-radius:16px; margin-bottom:15px; border:1px solid #a5d6a7;">
              <div style="color:var(--primary-dark); font-weight:700; margin-bottom:8px; display:flex; align-items:center; justify-content:space-between;">
                  <span id="t-user-info-title"><i class="fas fa-user-check"></i> ข้อมูลผู้รับบริการ</span>
              </div>
              <div id="masked-name" style="margin-bottom:8px;"></div>
              <div id="masked-tel" style="font-size:0.95rem; color:#475569;"></div>
              <button type="button" class="btn-cancel" style="padding:8px; font-size:0.85rem; margin-top:12px; width:100%; border:1px solid #cbd5e1; background:white; color:#475569; border-radius:10px; font-weight:600;" onclick="verifyAndEditPhone()"><i class="fas fa-mobile-alt"></i> <span id="t-change-phone">เปลี่ยนเบอร์โทรติดต่อ</span></button>
          </div>

          <div id="user-details-form" class="hidden" style="background:#f1f5f9; padding:15px; border-radius:16px; margin-bottom:15px; margin-top:15px; border:1px solid #e2e8f0;">
              <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                  <div style="flex: 1.2;"><label class="form-label" id="t-fname">ชื่อจริง <span style="color:red">*</span></label><input type="text" id="inp-fname" class="form-control" placeholder="ชื่อ" oninput="validateNameInput(this)"></div>
                  <div style="flex: 0.8;"><label class="form-label" id="t-lname">นามสกุล</label><input type="text" id="inp-lname" class="form-control" placeholder="นามสกุล" oninput="validateNameInput(this)"></div>
              </div>
              <div class="form-group" style="margin-bottom:0;"><label class="form-label" id="t-phone">เบอร์โทรศัพท์ <span style="color:red">*</span></label><input type="tel" id="inp-tel" class="form-control" placeholder="08x-xxx-xxxx" maxlength="10" oninput="this.value = this.value.replace(/[^0-9]/g, '')"></div>
              <div id="name-lock-warning" style="display:none; font-size:0.75rem; color:#eab308; margin-top:8px;"><i class="fas fa-lock"></i> <span id="t-lock-warn">พบประวัติในระบบ ชื่อ-สกุล ไม่สามารถแก้ไขได้</span></div>
          </div>

          <div id="smart-book-area" class="hidden">
              <div class="smart-book-divider" id="t-or">หรือจองให้คนอื่น</div>
              <div class="smart-book-wrapper">
                  <div class="smart-select-3d" id="smart-trigger" onclick="toggleSmartBook()">
                      <div style="display:flex; align-items:center; gap:10px;"><i class="fas fa-address-book" style="font-size:1.2rem;"></i><span id="t-smart-book">เลือกจากรายชื่อที่บันทึกไว้</span></div><i class="fas fa-chevron-down"></i>
                  </div>
                  <div class="smart-items-container" id="smart-options"></div>
              </div>
          </div>
          
          <div class="btn-group">
            <button class="btn btn-cancel" onclick="closeModal()" id="btn-cancel-modal1">ยกเลิก</button>
            <button class="btn btn-confirm" id="btn-next-step" onclick="goToStep2()" disabled>ถัดไป (เลือกบริการ) <i class="fas fa-arrow-right"></i></button>
          </div>
      </div>

      <div id="step-2-service" class="hidden">
          <div id="ghost-hint-options" style="display:none; background:#f8fafc; border:1px dashed #cbd5e1; padding:12px; border-radius:12px; text-align:center; color:#64748b; font-size:0.85rem; margin-top:15px; margin-bottom:15px;">
              <i class="fas fa-lightbulb" style="color:#f59e0b; font-size:1.2rem; margin-bottom:5px; display:block;"></i>
              <span id="t-ghost-hint">อัปเดตใหม่: ท่านสามารถเลือก "จอง 2 ชม." หรือ "เพิ่มอบไอน้ำ" ได้ในขั้นตอนถัดไป</span>
          </div>

          <div id="normal-fields" class="hidden">
              <div class="form-group">
                <label class="form-label" id="t-sel-svc">เลือกบริการ</label>
                <select id="inp-service" class="form-control" onchange="updatePriceDisplay()"></select>
                <div id="price-tag" style="margin-top:10px; display:none; background:#eff6ff; color:#0369a1; padding:10px 15px; border-radius:10px; font-size:0.85rem; border:1px solid #bfdbfe; line-height:1.5;">
                    <div style="display:flex; gap:8px; align-items:flex-start;"><i class="fas fa-circle-info" style="margin-top:2px;"></i><div><span style="font-weight:700; display:block;" id="t-price-title">อัตราค่าบริการ/สิทธิ:</span><span id="price-val">-</span></div></div>
                </div>
              </div>

              <div class="form-group" id="group-staff" style="display:none; position:relative;">
                <label class="form-label" id="lbl_provider_text">ผู้ให้บริการ</label>
                <div class="custom-select" id="staff-trigger" onclick="toggleStaffDropdown()"><div style="display:flex; align-items:center; gap:10px;"><img id="staff-display-img" src="https://img2.pic.in.th/pic/1c189d2a727f532d391a5ab0604ccd2f.png" class="select-img" style="width:36px; height:36px;"><span id="staff-display-name" style="font-weight:600; color:#1e293b;">ไม่ระบุ</span></div><i class="fas fa-chevron-down" style="color:#94a3b8;"></i></div>
                <div class="select-items" id="staff-options"></div>
                <input type="hidden" id="inp-staff-val" value="ไม่ระบุ">
              </div>
          </div>

          <div id="postpartum-fields" class="hidden" style="margin-top:15px;">
              <div class="form-group"><label class="form-label" id="t-birthdate">วันคลอด</label><input type="date" id="inp-birth-date" class="form-control"></div>
              <div class="form-group"><label class="form-label" id="t-del-type">ประเภทการคลอด</label><select id="inp-delivery-type" class="form-control"><option value="" id="t-opt-sel">-- เลือก --</option><option value="คลอดธรรมชาติ" id="t-opt-nat">คลอดธรรมชาติ</option><option value="ผ่าคลอด" id="t-opt-csec">ผ่าคลอด</option></select></div>
              <div class="form-group"><label class="form-label" id="t-hosp">โรงพยาบาลที่คลอด</label><input type="text" id="inp-hospital" class="form-control"></div>
          </div>

          <div id="steam-fields" class="hidden" style="margin-top:15px;">
             <div class="form-group"><label class="form-label" id="t-gender">เพศ (สำหรับล็อกรอบ)</label><select id="inp-gender" class="form-control"><option value="หญิง" id="t-g-f">หญิง</option><option value="ชาย" id="t-g-m">ชาย</option></select></div>
          </div>

          <div class="form-group" id="group-note" style="margin-top:15px;">
            <label class="form-label" id="t-note">หมายเหตุ (ถ้ามี)</label>
            <input type="text" id="inp-note" class="form-control" placeholder="มีไข้ / กระดูกแตกหัก / ประจำเดือน">
          </div>

          <div class="btn-group">
            <button class="btn btn-cancel" onclick="goToStep1()" id="btn-back-1">ย้อนกลับ</button>
            <button class="btn btn-confirm" id="btn-check-info" onclick="startBookingOptionsFlow()">ตรวจสอบข้อมูล</button>
          </div>
      </div>

      <div id="step-3-summary" class="hidden">
        <div id="summary-content"></div>
        <div class="btn-group">
          <button class="btn btn-cancel" onclick="goToStep2()" id="btn-edit-sum">แก้ไข</button>
          <button class="btn btn-confirm" id="btn-final-confirm" onclick="confirmBooking()">ยืนยันจองคิว</button>
        </div>
      </div>

    </div>
  </div>

  <script>
    // ==========================================
    // 🌟 CONSTANTS & GLOBALS
    // ==========================================
    const API_ENDPOINT = "https://script.google.com/macros/s/AKfycby0EQfBeg8ylgU9Q7IZDf-weHopsK4EFxXkqBUVvtDsEVKKpsIIDZ7y8fXXVWdyzKkbAw/exec"; 
    const FIREBASE_BASE_URL = "https://sadao-queue-999c3-default-rtdb.asia-southeast1.firebasedatabase.app/"; 
    
    const STEAM_NEXT_1HR = {"08:30":"09:30", "09:30":"10:30", "13:00":"14:00", "14:00":"15:00", "17:00":"18:00"};
    const STEAM_NEXT_2HR = {"08:30":"10:30", "13:00":"15:00"};

    let currentLang = localStorage.getItem('sdh_lang') || 'th';
    let currentApp = ''; let globalData = []; let fullFirebaseData = null; 
    let bookingData = {}; let selectedIndex = 0; let typingTimer;
    let currentUserDB = null; let refreshInterval; let activeBookingObj = null; let isForeigner = false; 
    let staffCan2Hr = false; // สำหรับดักจับ 2 ชั่วโมง
    
    // ==========================================
    // 🌟 PROFILES (LOCAL STORAGE)
    // ==========================================
    let savedProfiles = [];
    try { savedProfiles = JSON.parse(localStorage.getItem('sdh_saved_profiles') || '[]'); } catch(e) { savedProfiles = []; }
    let activeProfileId = localStorage.getItem('sdh_active_profile_id');
    if (activeProfileId === 'null') activeProfileId = null;

    if(!activeProfileId && localStorage.getItem('sdh_patient_id')) {
        let oldId = localStorage.getItem('sdh_patient_id'); let oldF = localStorage.getItem('sdh_patient_fname'); let oldL = localStorage.getItem('sdh_patient_lname') || ""; let oldT = localStorage.getItem('sdh_patient_tel');
        if(oldF) { savedProfiles.push({ id: oldId, fname: oldF, lname: oldL, tel: oldT, label: "" }); activeProfileId = oldId; saveProfilesToStorage(); }
        localStorage.removeItem('sdh_patient_id'); localStorage.removeItem('sdh_patient_fname'); localStorage.removeItem('sdh_patient_lname'); localStorage.removeItem('sdh_patient_tel');
    }

    function saveProfilesToStorage() { 
        localStorage.setItem('sdh_saved_profiles', JSON.stringify(savedProfiles)); 
        if (activeProfileId) { localStorage.setItem('sdh_active_profile_id', activeProfileId); }
        else { localStorage.removeItem('sdh_active_profile_id'); }
    }
    
    function addOrUpdateProfile(id, fname, lname, tel, label) { 
        let idx = savedProfiles.findIndex(p => p.id === id); 
        let safeLabel = (label !== undefined && label !== null) ? label : (idx > -1 ? savedProfiles[idx].label : "");
        if(idx > -1) { savedProfiles[idx] = { id, fname, lname, tel, label: safeLabel }; } 
        else { savedProfiles.push({ id, fname, lname, tel, label: safeLabel }); } 
        activeProfileId = id; saveProfilesToStorage(); 
    }

    function switchUser() { activeProfileId = null; saveProfilesToStorage(); renderMultiUserCard(); }
    function removeUser(id) { savedProfiles = savedProfiles.filter(p => p.id !== id); if(activeProfileId === id) activeProfileId = null; saveProfilesToStorage(); renderMultiUserCard(); }

    // ==========================================
    // 🌟 I18N (TRANSLATIONS)
    // ==========================================
    const I18N = {
        th: {
            lang_toggle: "EN", app_ttm: "แพทย์แผนไทย", desc_ttm: "นวดรักษา, ประคบ, นวดส่งเสริมฯ", app_tcm: "แพทย์แผนจีน", desc_tcm: "ฝังเข็ม, ครอบแก้ว, ฝังเข็มใบหน้า", app_postpartum: "บริการหลังคลอด", desc_post: "หลังคลอดธรรมชาติ 7 วัน / ผ่า 1 เดือน", app_steam: "อบไอน้ำสมุนไพร", desc_steam: "ช่วยการไหลเวียนโลหิต ภูมิแพ้", h1: "โรงพยาบาลสะเดา", h2: "กลุ่มงานการแพทย์แผนไทยและการแพทย์ทางเลือก", online: "เปิดให้บริการออนไลน์ 24 ชม.", greeting: "ข้อมูลผู้รับบริการ", change_user: "สลับผู้ใช้", history_title: "คิวที่กำลังจะมาถึง / ล่าสุด", syncing: "กำลังซิงค์ข้อมูล...", fill_info: "กรอกข้อมูลจองคิว", id_card: "เลขประจำตัวประชาชน", foreigner: "ชาวต่างชาติ", pdpa: "ปลอดภัย 100% ตามมาตรฐาน PDPA", fname: "ชื่อจริง", lname: "นามสกุล", phone: "เบอร์โทรศัพท์", lock_warn: "พบประวัติในระบบ ชื่อ-สกุล ไม่สามารถแก้ไขได้", user_info_title: "ข้อมูลผู้รับบริการ", change_phone: "เปลี่ยนเบอร์โทรติดต่อ", sel_svc: "เลือกบริการ", price_title: "อัตราค่าบริการ/สิทธิ:", prov_text_ttm: "ผู้ให้บริการ (ผู้ช่วยแพทย์แผนไทย)", prov_text_tcm: "ผู้ให้บริการ (แพทย์แผนจีน)", not_spec: "ไม่ระบุ", birthdate: "วันคลอด", del_type: "ประเภทการคลอด", hosp: "โรงพยาบาลที่คลอด", gender: "เพศ (สำหรับล็อกรอบ)", note: "หมายเหตุ (ถ้ามี)", btn_cancel: "ยกเลิก", btn_check: "ตรวจสอบข้อมูล", sum_title: "ยืนยันการนัดหมาย", btn_edit: "แก้ไข", btn_confirm: "ยืนยันจองคิว", saving: "ระบบรับข้อมูลแล้ว", saving_sub: "กรุณารอสักครู่ เพื่อยืนยันข้อมูล...", loading: "กำลังโหลด...", opt_sel: "-- เลือก --", opt_nat: "คลอดธรรมชาติ", opt_csec: "ผ่าคลอด", g_f: "หญิง", g_m: "ชาย", mu_title: "ผู้ใช้งานที่บันทึกไว้", btn_add_user: "ลงทะเบียนผู้รับบริการใหม่", act_user: "ใช้งานในชื่อ", aps_hist: "คิวล่าสุดของคุณ", cancel_q: "แจ้งยกเลิกนัดหมายนี้", addon_title: "🌿 รับบริการอบไอน้ำสมุนไพรต่อเนื่อง", addon_gender: "ระบุเพศเพื่อเข้าห้องอบ", no_profile: "ยังไม่มีประวัติในเครื่องนี้", btn_ack: "รับทราบและดำเนินการต่อ",
            right_title: "💳 เลือกสิทธิการรักษา", right_uc30: "สิทธิบัตรทอง (ร่วมจ่าย 30 บาท)", right_desc30: "(ช่วงอายุ 12-59 ปี)", right_uc_free: "สิทธิบัตรทอง (ยกเว้นร่วมจ่าย)", right_desc_free: "(ผู้สูงอายุ ผู้มีรายได้น้อย อสม. ฯลฯ)", right_gov: "สิทธิเบิกตรงข้าราชการ / อปท.", right_desc_gov: "(ไม่ต้องสำรองจ่าย)", right_enterprise: "สิทธิรัฐวิสาหกิจ", right_desc_enterprise: "(สำรองจ่ายเบิกต้นสังกัด)", right_ss: "สิทธิประกันสังคม / ชำระเงินเอง", right_desc_ss: "(สำรองจ่าย/เงินสด)", btn_confirm_right: "ยืนยันสิทธิและประมวลผล", warn_select_right: "กรุณาเลือกสิทธิการรักษาก่อนครับ", calc_title: "กำลังคำนวณค่าบริการ...", calc_sub: "ระบบกำลังประมวลผลตามสิทธิของคุณ...", bill_title: "สรุปค่าบริการ (โดยประมาณ)", bill_right: "💳 สิทธิ:", bill_base: "ค่าบริการพื้นฐาน:", bill_ooh: "ค่าบริการนอกเวลา/วันหยุด:", bill_2hr: "บริการต่อเนื่องชั่วโมงที่ 2:", bill_steam: "บริการอบไอน้ำสมุนไพร:", bill_total: "ยอดชำระสุทธิ:", baht: "บาท", opt_2hr_ttm: "จองต่อเนื่อง 2 ชั่วโมง", opt_2hr_tcm: "จองต่อเนื่อง ฝังเข็ม + ครอบแก้ว", note_2hr_ttm: "*ชั่วโมงที่ 2 ชำระเพิ่ม 250 บาท", note_2hr_tcm: "*ระบบจะลงคิว 2 ชม. ให้ทันที", plh_fname: "ชื่อ", plh_lname: "นามสกุล", plh_note: "มีไข้ / กระดูกแตกหัก / ประจำเดือน", plh_passport: "กรอกหมายเลข Passport", err_req_fields: "กรุณากรอกข้อมูลให้ครบถ้วน", warn_title: "แจ้งเตือน", swal_success: "สำเร็จ!", swal_error: "ผิดพลาด", swal_saved: "บันทึกข้อมูลเรียบร้อยแล้ว", swal_cancelled: "ระบบได้ยกเลิกคิวให้ท่านเรียบร้อยแล้ว", swal_cancel_title: "ยืนยันการยกเลิกนัด", swal_cancel_warn1: "⚠️ คำเตือน: ยกเลิกวันเดียวกัน ระบบระงับสิทธิ 5 วัน", swal_cancel_warn2: "⚠️ คำเตือน: ยกเลิกกระชั้นชิด ระบบระงับสิทธิ 2 วัน", swal_cancel_warn3: "คุณต้องการยกเลิกคิวนี้ใช่หรือไม่?", btn_yes_cancel: "ยอมรับและยกเลิกคิว", btn_close: "ปิด", swal_book_success: "จองคิวสำเร็จ!", swal_line_notify: "<p>กรุณากดปุ่มด้านล่างเพื่อรับการยืนยันทาง LINE</p>", swal_processing: "กำลังประมวลผล...", swal_sys_err: "⚠️ ระบบขัดข้อง (กรุณาลองใหม่)", swal_record_found: "พบข้อมูลประวัติ", swal_new_patient: "ผู้รับบริการใหม่ กรุณากรอกข้อมูล",
            bill_enterprise_note: "*(โปรดขอใบเสร็จและใบรับรองแพทย์เพื่อเบิกต้นสังกัด)",
            "นวดและประคบเพื่อการรักษา": "นวดและประคบเพื่อการรักษา", "นวดตัวส่งเสริมสุขภาพ(ชำระเงินเอง)": "นวดตัวส่งเสริมสุขภาพ(ชำระเงินเอง)", "นวดเท้าส่งเสริมสุขภาพ(ชำระเงินเอง)": "นวดเท้าส่งเสริมสุขภาพ(ชำระเงินเอง)", "ฝังเข็มเพื่อการรักษา": "ฝังเข็มเพื่อการรักษา", "ครอบแก้ว": "ครอบแก้ว", "ฝังเข็มใบหน้า": "ฝังเข็มใบหน้า", "เม็ดผักกาดแปะหู": "เม็ดผักกาดแปะหู", "ปรึกษาแพทย์แผนจีน": "ปรึกษาแพทย์แผนจีน",
            plh_label: "สรรพนาม (เช่น ตัวฉัน, พ่อ, แม่)", sb_title: "เลือกจากรายชื่อที่บันทึกไว้", sb_or: "หรือจองให้คนอื่น", edit_label: "แก้ไขสรรพนาม", plh_label_eg: "เช่น คุณแม่, ตัวฉัน, ลูกชาย", btn_book_other: "จองให้บุคคลอื่น (กรอกใหม่)",
            btn_next: "ถัดไป (เลือกบริการ)", btn_back: "ย้อนกลับ", step1_title: "ข้อมูลผู้ป่วย", step2_title: "เลือกบริการ", step3_title: "ยืนยันข้อมูล", ghost_hint: 'อัปเดตใหม่: ท่านสามารถเลือก "จอง 2 ชม." หรือ "เพิ่มอบไอน้ำ" ได้ในขั้นตอนถัดไป'
        },
        en: {
            lang_toggle: "TH", app_ttm: "Thai Traditional Med.", desc_ttm: "Massage, Compress, Wellness", app_tcm: "Chinese Medicine", desc_tcm: "Acupuncture, Cupping, Facial", app_postpartum: "Postpartum Care", desc_post: "Normal delivery 7 days / C-Section 1 mo.", app_steam: "Herbal Steam", desc_steam: "Blood circulation, Allergy relief", h1: "Sadao Hospital", h2: "Thai Traditional & Alternative Medicine", online: "Online Booking 24/7", greeting: "Patient Information", change_user: "Switch User", history_title: "Upcoming / Recent Appointments", syncing: "Syncing data...", fill_info: "Booking Details", id_card: "Passport / ID Number", foreigner: "Foreigner", pdpa: "100% Secured by PDPA standard", fname: "First Name", lname: "Last Name", phone: "Phone Number", lock_warn: "Profile found. Name cannot be changed.", user_info_title: "Patient Details", change_phone: "Change Phone Number", sel_svc: "Select Service", price_title: "Estimated Fee:", prov_text_ttm: "Provider (TTM Assistant)", prov_text_tcm: "Provider (TCM Doctor)", not_spec: "Not Specified", birthdate: "Date of Birth (Baby)", del_type: "Delivery Type", hosp: "Hospital", gender: "Gender (For Room Allocation)", note: "Note (Optional)", btn_cancel: "Cancel", btn_check: "Check Info", sum_title: "Confirm Appointment", btn_edit: "Edit", btn_confirm: "Confirm Booking", saving: "Data Received", saving_sub: "Processing confirmation...", loading: "Loading...", opt_sel: "-- Select --", opt_nat: "Normal Delivery", opt_csec: "C-Section", g_f: "Female", g_m: "Male", mu_title: "Saved Profiles", btn_add_user: "Add New Patient", act_user: "Active Profile", aps_hist: "Your Recent Appointment", cancel_q: "Cancel Appointment", addon_title: "🌿 Add Continuous Steam Therapy", addon_gender: "Select gender for steam room", no_profile: "No profiles saved", btn_ack: "Acknowledge & Continue",
            right_title: "💳 Select Treatment Right", right_uc30: "Universal Coverage (Co-pay 30 THB)", right_desc30: "(Age 12-59 years old)", right_uc_free: "Universal Coverage (Exempt)", right_desc_free: "(Elderly, Low-income, VHV, etc.)", right_gov: "Civil Servant / LGO", right_desc_gov: "(Direct Billing)", right_enterprise: "State Enterprise", right_desc_enterprise: "(Pay and Claim back)", right_ss: "Social Security / Self-Pay", right_desc_ss: "(Cash Payment)", btn_confirm_right: "Confirm & Calculate", warn_select_right: "Please select your treatment right.", calc_title: "Calculating Fee...", calc_sub: "Processing based on your selected right...", bill_title: "Estimated Service Fee", bill_right: "💳 Right:", bill_base: "Base Service Fee:", bill_ooh: "Out-of-Hours Fee:", bill_2hr: "2nd Hour Session:", bill_steam: "Herbal Steam Therapy:", bill_total: "Total Estimated Amount:", baht: "THB", opt_2hr_ttm: "Cont. 2 Hrs Session", opt_2hr_tcm: "Cont. Acu + Cupping", note_2hr_ttm: "*Extra 250 THB for 2nd hour", note_2hr_tcm: "*Auto 2-hour slot", plh_fname: "First Name", plh_lname: "Last Name", plh_note: "Fever / Fracture / Menstruation", plh_passport: "Enter Passport Number", err_req_fields: "Please fill all required fields", warn_title: "Warning", swal_success: "Success!", swal_error: "Error", swal_saved: "Appointment saved.", swal_cancelled: "Appointment cancelled.", swal_cancel_title: "Cancel Appointment?", swal_cancel_warn1: "⚠️ Warning: Same-day cancel, 5 days ban.", swal_cancel_warn2: "⚠️ Warning: Late cancel, 2 days ban.", swal_cancel_warn3: "Do you want to cancel this appointment?", btn_yes_cancel: "Yes, Cancel", btn_close: "Close", swal_book_success: "Booking Successful!", swal_line_notify: "<p>Click below to notify via LINE</p>", swal_processing: "Processing...", swal_sys_err: "⚠️ System error. Please try again.", swal_record_found: "Record found!", swal_new_patient: "New Patient: Please fill out details",
            bill_enterprise_note: "*(Please claim the receipt and certificate at your office)",
            "นวดและประคบเพื่อการรักษา": "Massage and Compress Therapy", "นวดตัวส่งเสริมสุขภาพ(ชำระเงินเอง)": "Relaxing Body Massage (Self-pay)", "นวดเท้าส่งเสริมสุขภาพ(ชำระเงินเอง)": "Foot Reflexology (Self-pay)", "ฝังเข็มเพื่อการรักษา": "Acupuncture Therapy", "ครอบแก้ว": "Cupping Therapy", "ฝังเข็มใบหน้า": "Facial Acupuncture", "เม็ดผักกาดแปะหู": "Auricular Seed Therapy", "ปรึกษาแพทย์แผนจีน": "TCM Consultation",
            plh_label: "Label (e.g. Me, Mom, Son)", sb_title: "Select from saved profiles", sb_or: "OR BOOK FOR OTHERS", edit_label: "Edit Label", plh_label_eg: "e.g. Mom, Me, Son", btn_book_other: "Book for someone else (New)",
            btn_next: "Next (Select Service)", btn_back: "Back", step1_title: "Patient Info", step2_title: "Select Service", step3_title: "Confirm Details", ghost_hint: 'New Update: You can select duration (1-2 Hrs) or add Steam Therapy in the next step.'
        }
    };

    function _t(key) { return I18N[currentLang][key] || key; }

    window.selectRight = function(val) {
        document.querySelectorAll('.right-option').forEach(el => el.classList.remove('selected'));
        document.getElementById('opt-right-' + val).classList.add('selected');
        document.getElementById('selected-right-val').value = val;
    }

    function toggleLanguage() { 
        currentLang = currentLang === 'th' ? 'en' : 'th'; localStorage.setItem('sdh_lang', currentLang); 
        applyLanguageToUI(); if(globalData.length > 0) renderSlots(selectedIndex); renderMultiUserCard(); 
    }

    function applyLanguageToUI() {
        try {
            document.getElementById('current-lang-text').innerText = _t('lang_toggle'); document.getElementById('current-lang-dash').innerText = _t('lang_toggle');
            document.getElementById('t-h2').innerText = _t('h2'); document.getElementById('t-h1').innerText = _t('h1'); document.getElementById('t-online').innerText = _t('online');
            document.getElementById('t-menu-ttm').innerText = _t('app_ttm'); document.getElementById('t-desc-ttm').innerText = _t('desc_ttm');
            document.getElementById('t-menu-tcm').innerText = _t('app_tcm'); document.getElementById('t-desc-tcm').innerText = _t('desc_tcm');
            document.getElementById('t-menu-post').innerText = _t('app_postpartum'); document.getElementById('t-desc-post').innerText = _t('desc_post');
            document.getElementById('t-menu-steam').innerText = _t('app_steam'); document.getElementById('t-desc-steam').innerText = _t('desc_steam');
            document.getElementById('t-foreigner-chk').innerText = _t('foreigner');
            document.getElementById('t-pdpa').innerHTML = `<i class="fas fa-shield-alt" style="color:#4caf50;"></i> ${_t('pdpa')}`;
            document.getElementById('t-fname').innerHTML = `${_t('fname')} <span style="color:red">*</span>`; document.getElementById('t-lname').innerText = _t('lname');
            document.getElementById('t-phone').innerHTML = `${_t('phone')} <span style="color:red">*</span>`; document.getElementById('t-lock-warn').innerText = _t('lock_warn');
            document.getElementById('t-user-info-title').innerHTML = `<i class="fas fa-user-check"></i> ${_t('user_info_title')}`;
            document.getElementById('t-change-phone').innerText = _t('change_phone');
            document.getElementById('t-sel-svc').innerText = _t('sel_svc'); 
            if(document.getElementById('t-birthdate')) document.getElementById('t-birthdate').innerText = _t('birthdate'); 
            if(document.getElementById('t-del-type')) document.getElementById('t-del-type').innerText = _t('del_type');
            if(document.getElementById('t-hosp')) document.getElementById('t-hosp').innerText = _t('hosp'); 
            if(document.getElementById('t-addon-title')) document.getElementById('t-addon-title').innerHTML = _t('addon_title'); 
            if(document.getElementById('t-addon-gender')) document.getElementById('t-addon-gender').innerText = _t('addon_gender'); 
            document.getElementById('t-gender').innerText = _t('gender'); document.getElementById('t-note').innerText = _t('note');
            document.getElementById('btn-cancel-modal1').innerText = _t('btn_cancel'); 
            document.getElementById('btn-edit-sum').innerText = _t('btn_edit'); document.getElementById('btn-final-confirm').innerText = _t('btn_confirm');
            document.getElementById('t-saving').innerText = _t('saving'); document.getElementById('t-saving-sub').innerText = _t('saving_sub'); 
            document.getElementById('t-loading').innerText = _t('loading'); 
            if(document.getElementById('t-opt-sel')) document.getElementById('t-opt-sel').innerText = _t('opt_sel'); 
            if(document.getElementById('t-opt-nat')) document.getElementById('t-opt-nat').innerText = _t('opt_nat'); 
            if(document.getElementById('t-opt-csec')) document.getElementById('t-opt-csec').innerText = _t('opt_csec');
            if(document.getElementById('t-g-f')) document.getElementById('t-g-f').innerText = _t('g_f'); 
            if(document.getElementById('t-g-m')) document.getElementById('t-g-m').innerText = _t('g_m');
            if(document.getElementById('t-mu-title')) document.getElementById('t-mu-title').innerText = _t('mu_title');
            if(document.getElementById('t-btn-add-user')) document.getElementById('t-btn-add-user').innerText = _t('btn_add_user');
            if(document.getElementById('t-act-user')) document.getElementById('t-act-user').innerText = _t('act_user'); 
            if(document.getElementById('t-switch-user')) document.getElementById('t-switch-user').innerText = _t('change_user');
            if(document.getElementById('t-aps-hist')) document.getElementById('t-aps-hist').innerText = _t('aps_hist');
            
            if(document.getElementById('t-or')) document.getElementById('t-or').innerText = _t('sb_or');
            if(document.getElementById('t-smart-book')) document.getElementById('t-smart-book').innerText = _t('sb_title');
            
            if(document.getElementById('t-step1')) document.getElementById('t-step1').innerText = _t('step1_title');
            if(document.getElementById('t-step2')) document.getElementById('t-step2').innerText = _t('step2_title');
            if(document.getElementById('t-step3')) document.getElementById('t-step3').innerText = _t('step3_title');
            if(document.getElementById('t-ghost-hint')) document.getElementById('t-ghost-hint').innerText = _t('ghost_hint');

            let btnNext = document.getElementById('btn-next-step'); 
            if(btnNext) {
                if(btnNext.innerHTML.includes('fa-spinner')) btnNext.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${_t('loading')}`;
                else btnNext.innerHTML = `${_t('btn_next')} <i class="fas fa-arrow-right"></i>`;
            }
            
            let btnCheck = document.getElementById('btn-check-info'); if(btnCheck) btnCheck.innerText = _t('btn_check');
            let btnBack1 = document.getElementById('btn-back-1'); if(btnBack1) btnBack1.innerText = _t('btn_back');

            document.getElementById('inp-fname').placeholder = _t('plh_fname');
            document.getElementById('inp-lname').placeholder = _t('plh_lname');
            document.getElementById('inp-note').placeholder = _t('plh_note');
            document.getElementById('inp-idcard-foreigner').placeholder = _t('plh_passport');
            let sel = document.getElementById('inp-service');
            if (sel && sel.options.length > 0 && currentApp) { let cur = sel.value; sel.innerHTML = ''; SERVICE_OPTIONS[currentApp].forEach(s => { let o = document.createElement('option'); o.value = s; o.innerText = _t(s); sel.appendChild(o); }); sel.value = cur; }
            let staffNode = document.getElementById('staff-display-name');
            let staffVal = document.getElementById('inp-staff-val') ? document.getElementById('inp-staff-val').value : "ไม่ระบุ";
            if(staffNode) { if(staffVal === "ไม่ระบุ") staffNode.innerText = _t('not_spec'); else staffNode.innerText = currentLang === 'en' ? (STAFF_EN_NAMES[staffVal] || staffVal) : (STAFF_NAME_MAP[staffVal] || staffVal); }
            if(currentApp) document.getElementById('app-title').innerText = _t('app_' + currentApp);
            
            toggleForeignerMode();
            renderSmartBookDropdown();
        } catch(e) { console.error("Language UI Error:", e); }
    }

    const APP_CONFIG = { ttm: { title: "แพทย์แผนไทย", logo: "https://img2.pic.in.th/pic/619e72dc2124132ccf4620717d4fa58d.md.png", color: "#2e7d32" }, tcm: { title: "แพทย์แผนจีน", logo: "https://img2.pic.in.th/pic/--06d2d95efaba2074.md.png", color: "#c62828" }, postpartum: { title: "บริการหลังคลอด", logo: "https://img2.pic.in.th/pic/eb06897c542c79b64690c8e794fa84a4.png", color: "#ec4899" }, steam: { title: "อบไอน้ำสมุนไพร", logo: "https://img2.pic.in.th/pic/-3b445847427fcbfd.png", color: "#0288d1" } };
    const SERVICE_OPTIONS = { ttm: ["นวดและประคบเพื่อการรักษา", "นวดตัวส่งเสริมสุขภาพ(ชำระเงินเอง)", "นวดเท้าส่งเสริมสุขภาพ(ชำระเงินเอง)"], tcm: ["ฝังเข็มเพื่อการรักษา", "ครอบแก้ว", "ฝังเข็มใบหน้า", "เม็ดผักกาดแปะหู", "ปรึกษาแพทย์แผนจีน"] };
    const STAFF_IMAGES = { "รจนา M": "https://img1.pic.in.th/images/29cf568d9d3f548b07.png", "อรรถพล B": "https://img2.pic.in.th/3002857ed55bcb783e.png", "ศินารัตน์ C": "https://img2.pic.in.th/35b2f9d14beddf4380.png", "จุฑามาศ F": "https://img1.pic.in.th/images/3160d8e760be1bc51e.png", "รัตน์ชนก KW": "https://img2.pic.in.th/323086fe6798ca5dce.png", "นิกษ์นิภา T": "https://img2.pic.in.th/33bea174c8b0315ff4.png", "ณิชาภัทร W": "https://img1.pic.in.th/images/3438c14aad54d74a1a.png", "จินดา J": "https://img2.pic.in.th/-2569d4d2a9b79e0efa9e.png", "แพทย์แผนจีน": "https://img2.pic.in.th/55c47176d1c28f966a1289b3b1d48837.png" };
    const STAFF_NAME_MAP = { "จินดา J": "จินดา (เจี๊ยบ)", "รจนา M": "รจนา (แหม่ม)", "อรรถพล B": "อรรถพล (บ่าว)", "ศินารัตน์ C": "ศินารัตน์ (ซี)", "จุฑามาศ F": "จุฑามาศ (ฝน)", "รัตน์ชนก KW": "รัตน์ชนก (กวาง)", "นิกษ์นิภา T": "นิกษ์นิภา (การ์ตูน)", "ณิชาภัทร W": "ณิชาภัทร (วาวา)", "แพทย์แผนจีน": "แพทย์แผนจีน (TCM)" };
    const STAFF_EN_NAMES = { "จินดา J": "Jinda (Jeab)", "รจนา M": "Rotjana (Maam)", "อรรถพล B": "Attapon (Bao)", "ศินารัตน์ C": "Sinarat (C)", "จุฑามาศ F": "Jutamat (Fon)", "รัตน์ชนก KW": "Ratchanok (Kwang)", "นิกษ์นิภา T": "Niknipha (Kartoon)", "ณิชาภัทร W": "Nichapat (Wawa)", "แพทย์แผนจีน": "TCM Doctor" };
    const DEFAULT_IMG = "https://img2.pic.in.th/pic/1c189d2a727f532d391a5ab0604ccd2f.png"; const DAY_COLORS = ["#ef4444", "#eab308", "#ec4899", "#22c55e", "#f97316", "#3b82f6", "#a855f7"];

    // ==========================================
    // 🌟 MULTI-USER & SMART BOOKING
    // ==========================================
    function renderMultiUserCard() {
        try {
            let container = document.getElementById('main-auth-card');
            if(!container) return; 
            if (activeProfileId) {
                let activeUser = savedProfiles.find(p => p.id === activeProfileId);
                if (activeUser) { 
                    container.innerHTML = `
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <div style="font-size:0.8rem; color:#2e7d32; font-weight:700; text-transform:uppercase;"><i class="fas fa-check-circle"></i> ${_t('act_user')}</div>
                            <button style="background:rgba(46,125,50,0.1); border:1px solid #bbf7d0; color:#2e7d32; padding:4px 12px; border-radius:12px; font-size:0.75rem; font-weight:700; cursor:pointer; transition:0.2s;" onclick="switchUser()">${_t('change_user')}</button>
                        </div>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div class="mu-avatar">${activeUser.fname.substring(0,1)}</div>
                            <div style="font-size:1.15rem; font-weight:700; color:#1e293b;">${getMaskedFullName(activeUser.fname, activeUser.lname)}</div>
                        </div>
                        <div class="aps-history">
                            <div style="font-size:0.85rem; color:#475569; font-weight:700; margin-bottom:8px;"><i class="fas fa-calendar-check"></i> ${_t('aps_hist')}</div>
                            <div id="aps-history-content" style="display:flex; gap:10px; align-items:center;">
                                <div style="color:var(--primary);"><i class="fas fa-spinner fa-spin"></i></div><div style="font-size:0.9rem;">${_t('syncing')}</div>
                            </div>
                            <div id="btn-cancel-area"></div>
                        </div>
                    `;
                    fetchPatientHistory(activeUser.id);
                } else { activeProfileId = null; saveProfilesToStorage(); renderMultiUserCard(); }
            } else {
                let listHtml = '';
                if (!savedProfiles || savedProfiles.length === 0) { listHtml = `<div style="text-align:center; padding:10px; color:#64748b; font-size:0.85rem;">${_t('no_profile')}</div>`; } 
                else {
                    savedProfiles.forEach(p => { 
                        let mName = getMaskedFullName(p.fname, p.lname); let mTel = getMaskedTel(p.tel); 
                        listHtml += `<div class="mu-profile" onclick="selectUser('${p.id}')"><div class="mu-info"><div class="mu-avatar">${p.fname.substring(0,1)}</div><div class="mu-name">${mName}<span><i class="fas fa-phone"></i> ${mTel}</span></div></div><div class="mu-delete" onclick="event.stopPropagation(); removeUser('${p.id}')"><i class="fas fa-times-circle"></i></div></div>`; 
                    });
                }
                container.innerHTML = `<div class="mu-title"><span>${_t('mu_title')}</span> <i class="fas fa-users" style="color:var(--primary);"></i></div><div class="mu-profile-list">${listHtml}</div><button class="btn-add-user" onclick="showAddUserForm()"><i class="fas fa-plus-circle"></i> ${_t('btn_add_user')}</button>`;
            }
        } catch(e) { console.error("Card UI Error:", e); }
    }

    function selectUser(id) { activeProfileId = id; saveProfilesToStorage(); renderMultiUserCard(); }

    function showAddUserForm() { 
        Swal.fire({
            title: _t('btn_add_user'),
            html: `<input id="swal-add-id" class="form-control" style="margin-bottom:10px;" placeholder="${_t('id_card')}" maxlength="20"><div style="display:flex; gap:10px;"><input id="swal-add-fname" class="form-control" placeholder="${_t('plh_fname')}"><input id="swal-add-lname" class="form-control" placeholder="${_t('plh_lname')}"></div><input id="swal-add-tel" class="form-control" style="margin-top:10px;" placeholder="${_t('phone')}" maxlength="10" type="tel" oninput="this.value=this.value.replace(/[^0-9]/g,'')">`,
            showCancelButton: true, confirmButtonText: currentLang==='en'?'Save':'บันทึก', confirmButtonColor: '#2e7d32', cancelButtonText: _t('btn_cancel'),
            preConfirm: () => { return { idCard: document.getElementById('swal-add-id').value, fname: document.getElementById('swal-add-fname').value, lname: document.getElementById('swal-add-lname').value, tel: document.getElementById('swal-add-tel').value } }
        }).then((res) => {
            if (res.isConfirmed) {
                let v = res.value;
                if(v.idCard && v.fname && v.tel) { addOrUpdateProfile(v.idCard, v.fname, v.lname, v.tel, ""); Swal.fire(_t('swal_success'), '', 'success'); renderMultiUserCard(); } 
                else { Swal.fire(_t('swal_error'), _t('err_req_fields'), 'error'); }
            }
        });
    }

    // 3D Smart Patient Book in Booking Modal
    function renderSmartBookDropdown() {
        let area = document.getElementById('smart-book-area');
        if (!area) return;
        if (savedProfiles.length === 0) {
            area.classList.add('hidden');
        } else {
            area.classList.remove('hidden');
            let opts = document.getElementById('smart-options');
            let html = "";
            html += `<div class="smart-item" onclick="clearForNewPatient()" style="color:var(--primary); font-weight:700; justify-content:center; background:#f0fdf4;">
                        <i class="fas fa-user-plus"></i> ${_t('btn_book_other')}
                     </div>`;
            savedProfiles.forEach(p => {
                let mName = getMaskedFullName(p.fname, p.lname);
                let displayLabel = p.label ? p.label : (currentLang === 'en' ? '+ Add Nickname' : '+ กดเพื่อตั้งชื่อเล่น');

                html += `<div class="smart-item" onclick="selectProfileForBooking('${p.id}')">
                            <div class="smart-item-icon"><i class="fas fa-user"></i></div>
                            <div>
                                <div class="smart-item-label">${displayLabel}</div>
                                <div class="smart-item-mask">${mName}</div>
                            </div>
                         </div>`;
            });
            opts.innerHTML = html;
        }
    }

    function toggleSmartBook() {
        document.getElementById('smart-trigger').classList.toggle('open');
        document.getElementById('smart-options').classList.toggle('show');
    }

    function clearForNewPatient() {
        document.getElementById('smart-trigger').classList.remove('open');
        document.getElementById('smart-options').classList.remove('show');
        
        document.getElementById('inp-idcard').value = '';
        document.getElementById('inp-idcard-foreigner').value = '';
        document.querySelectorAll('.otp-box').forEach(b => { b.value = ''; b.classList.remove('filled'); });
        
        document.getElementById('idcard-status').innerHTML = '';
        document.getElementById('inp-fname').value = '';
        document.getElementById('inp-lname').value = '';
        document.getElementById('inp-tel').value = '';
        document.getElementById('inp-fname').readOnly = false;
        document.getElementById('inp-lname').readOnly = false;
        
        document.getElementById('existing-user-display').classList.add('hidden');
        document.getElementById('user-details-form').classList.remove('hidden');
        document.getElementById('name-lock-warning').style.display = 'none';
        
        let btnNext = document.getElementById('btn-next-step');
        btnNext.disabled = true;
        btnNext.innerHTML = `${_t('btn_next')} <i class="fas fa-arrow-right"></i>`;
        
        currentUserDB = null;
        activeProfileId = null;
        
        if(!isForeigner) { setTimeout(() => { let oBox = document.querySelector('.otp-box'); if(oBox) oBox.focus(); }, 100); }
    }

    function selectProfileForBooking(id) {
        let p = savedProfiles.find(x => x.id === id);
        if(p) {
            document.getElementById('chk-foreigner').checked = false;
            toggleForeignerMode();
            
            if(id.length === 13 && !isForeigner) {
                let boxes = document.querySelectorAll('.otp-box');
                for(let i=0; i<13; i++) {
                    if(boxes[i]) { boxes[i].value = id[i]; boxes[i].classList.add('filled'); }
                }
            } else {
                document.getElementById('chk-foreigner').checked = true;
                toggleForeignerMode();
                document.getElementById('inp-idcard-foreigner').value = id;
            }
            document.getElementById('inp-idcard').value = id;
            
            document.getElementById('smart-trigger').classList.remove('open');
            document.getElementById('smart-options').classList.remove('show');
            
            checkIDCardInput();
        }
    }

    function editCurrentLabel() {
        let id = document.getElementById('inp-idcard').value;
        let p = savedProfiles.find(x => x.id === id);
        if(!p) return;
        Swal.fire({
            title: _t('edit_label'),
            input: 'text',
            inputValue: p.label || '',
            placeholder: _t('plh_label_eg'),
            showCancelButton: true,
            confirmButtonText: currentLang === 'en' ? 'Save' : 'บันทึก',
            cancelButtonText: _t('btn_cancel'),
            confirmButtonColor: '#2e7d32',
            customClass: { popup: 'swal-3d-popup', confirmButton: 'swal-3d-btn' }
        }).then(res => {
            if(res.isConfirmed && res.value) {
                addOrUpdateProfile(p.id, p.fname, p.lname, p.tel, res.value);
                fillUserDataUI(p.id, p.fname, p.lname, p.tel);
                renderMultiUserCard(); 
            }
        });
    }

    window.onload = function() { applyLanguageToUI(); setupIDBoxes(); renderMultiUserCard(); };

    // ==========================================
    // 🌟 ID & VALIDATION
    // ==========================================
    function setupIDBoxes() {
        const boxes = document.querySelectorAll('.otp-box');
        boxes.forEach((box, index) => {
            box.addEventListener('input', (e) => { box.value = box.value.replace(/[^0-9]/g, ''); if (box.value) { box.classList.add('filled'); if (index < boxes.length - 1) boxes[index + 1].focus(); } else { box.classList.remove('filled'); } updateHiddenID(); });
            box.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !box.value && index > 0) { boxes[index - 1].focus(); boxes[index - 1].value = ''; boxes[index - 1].classList.remove('filled'); updateHiddenID(); } });
            box.addEventListener('paste', (e) => { e.preventDefault(); const pastedData = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, ''); if(!pastedData) return; for (let i = 0; i < pastedData.length && index + i < boxes.length; i++) { boxes[index + i].value = pastedData[i]; boxes[index + i].classList.add('filled'); } if (index + pastedData.length < boxes.length) boxes[index + pastedData.length].focus(); else boxes[boxes.length - 1].focus(); updateHiddenID(); });
        });
    }

    function updateHiddenID() { 
        if(isForeigner) return; 
        const boxes = document.querySelectorAll('.otp-box'); 
        let id = Array.from(boxes).map(b => b.value).join(''); 
        document.getElementById('inp-idcard').value = id; 
        if (id.length === 13) { 
            checkIDCardInput(); 
        } else { 
            document.getElementById('idcard-status').innerHTML = ''; 
            document.getElementById('btn-next-step').disabled = true; 
            document.getElementById('btn-next-step').innerHTML = `${_t('btn_next')} <i class="fas fa-arrow-right"></i>`; 
            
            document.getElementById('existing-user-display').classList.add('hidden');
            document.getElementById('user-details-form').classList.remove('hidden');
        } 
    }

    function toggleForeignerMode() {
        isForeigner = document.getElementById('chk-foreigner').checked; let hiddenId = document.getElementById('inp-idcard'); let boxContainer = document.getElementById('thai-id-boxes'); let foreignInput = document.getElementById('inp-idcard-foreigner'); let lblId = document.getElementById('lbl-idcard');
        document.getElementById('idcard-status').innerHTML = ""; document.getElementById('user-details-form').classList.remove('hidden'); document.getElementById('existing-user-display').classList.add('hidden'); document.getElementById('btn-next-step').disabled = true;
        if(isForeigner) { lblId.innerHTML = 'Passport / ID Number <span style="color:red">*</span>'; boxContainer.style.display = 'none'; foreignInput.classList.remove('hidden'); hiddenId.value = ""; foreignInput.value = ""; } 
        else { lblId.innerHTML = `${_t('id_card')} <span style="color:red">*</span>`; boxContainer.style.display = 'flex'; foreignInput.classList.add('hidden'); hiddenId.value = ""; document.querySelectorAll('.otp-box').forEach(b => { b.value=''; b.classList.remove('filled'); }); }
        document.getElementById('btn-next-step').innerHTML = `${_t('btn_next')} <i class="fas fa-arrow-right"></i>`;
    }

    function validateNameInput(input) { if(isForeigner) input.value = input.value.replace(/[^a-zA-Z\s]/g, ''); }
    function maskString(str) { if(!str) return ""; let s = str.toString().trim(); if(s.length <= 2) return s.substring(0, 1) + "***"; if(s.length <= 4) return s.substring(0, 2) + "***"; return s.substring(0, 3) + "***"; }
    function getMaskedFullName(fname, lname) { return maskString(fname) + " " + maskString(lname); }
    function getMaskedTel(tel) { if(!tel || tel.length < 10) return tel; return tel.substring(0,3) + "-xxx-x" + tel.substring(8); }

    // ==========================================
    // 🌟 PATIENT HISTORY & CANCELLATION
    // ==========================================
    function fetchPatientHistory(idCard) {
        fetch(API_ENDPOINT, { method: 'POST', body: JSON.stringify({ action: 'get_my_history', idCard: idCard }) }).then(r=>r.json()).then(data => {
            if (data.status === 'success' && data.history) {
                let h = data.history; let icon = h.service.includes('ฝังเข็ม') ? '<i class="fas fa-yin-yang"></i>' : (h.service.includes('อบ') ? '<i class="fas fa-hot-tub-person"></i>' : '<i class="fas fa-leaf"></i>');
                let apsCont = document.getElementById('aps-history-content');
                if(apsCont) apsCont.innerHTML = `<div class="pc-h-icon" style="background:rgba(46,125,50,0.1); color:#2e7d32; width:35px; height:35px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:1rem;">${icon}</div><div style="flex:1;"><div style="color:#1e293b; font-weight:bold; font-size:0.95rem;">${_t(h.service)}</div><div style="color:#475569; font-size:0.8rem;"><i class="far fa-calendar-alt"></i> ${h.date} | ${h.time} น.</div></div>`;
                let btnArea = document.getElementById('btn-cancel-area');
                if(h.sysDate && btnArea) { 
                    activeBookingObj = { idCard: idCard, service: h.service, date: h.date, sysDate: h.sysDate, time: h.time }; 
                    btnArea.innerHTML = `<button class="btn-cancel-q" onclick="reqCancelBooking()"><i class="fas fa-times-circle"></i> ${_t('cancel_q')}</button>`; 
                } else if(btnArea) { btnArea.innerHTML = `<div style="text-align:right; font-size:0.8rem; color:#4ade80; margin-top:5px; font-weight:bold;"><i class="fas fa-check-circle"></i> ${h.status || 'Completed'}</div>`; activeBookingObj = null; }
            } else { 
                let apsCont = document.getElementById('aps-history-content');
                if(apsCont) apsCont.innerHTML = `<div style="color:#64748b; font-size:0.85rem; width:100%; text-align:center; padding:10px 0;">No record found</div>`; 
                if(document.getElementById('btn-cancel-area')) document.getElementById('btn-cancel-area').innerHTML = ''; 
            }
        }).catch(e=>{});
    }

    function reqCancelBooking() {
        if(!activeBookingObj) return; let today = new Date(); today.setHours(0,0,0,0); let bParts = activeBookingObj.sysDate.split('-'); let bDate = new Date(bParts[0], bParts[1]-1, bParts[2]); let diffTime = Math.abs(bDate - today); let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let warnMsg = _t('swal_cancel_warn3');
        if(bDate.getTime() === today.getTime()) warnMsg = _t('swal_cancel_warn1'); else if (diffDays === 1) warnMsg = _t('swal_cancel_warn2');
        Swal.fire({ title: _t('swal_cancel_title'), text: warnMsg, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#cbd5e1', confirmButtonText: _t('btn_yes_cancel'), cancelButtonText: _t('btn_close'), customClass: { popup: 'swal-3d-popup', confirmButton: 'swal-3d-btn' } }).then((result) => { if (result.isConfirmed) executeCancelBooking(); });
    }

    function executeCancelBooking() {
        Swal.fire({ title: _t('swal_processing'), allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }, customClass: { popup: 'swal-3d-popup' } });
        let bParts = activeBookingObj.sysDate.split('-'); let sheetN = parseInt(bParts[2]) + "/" + parseInt(bParts[1]); let sDept = 'ttm'; if(activeBookingObj.service.includes('ฝังเข็ม')||activeBookingObj.service.includes('ครอบแก้ว')) sDept='tcm'; else if(activeBookingObj.service.includes('อบ')) sDept='steam';
        let payload = { action: 'cancel_booking', idCard: activeBookingObj.idCard, sysDate: activeBookingObj.sysDate, time: activeBookingObj.time, sheetName: sheetN, dept: sDept };
        fetch(API_ENDPOINT, { method: 'POST', body: JSON.stringify(payload) })
        .then(async response => { let resText = await response.text(); try { return JSON.parse(resText); } catch(err) { return { status: 'success', penaltyDays: 0 }; } })
        .then(res => { if(res.status === 'success' || res.status === 'error_but_done') { let msg = _t('swal_cancelled'); if(res.penaltyDays > 0) msg += `\n\nBan until: ${res.banUntil}`; Swal.fire({title:_t('swal_success'), text:msg, icon:'success', customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'}}); fetchPatientHistory(activeBookingObj.idCard); fetch(API_ENDPOINT, {method:'POST', body:JSON.stringify({action:'background_sync', dept:sDept})}); } else Swal.fire({title:_t('swal_error'), text:(res.message || 'Error occurred'), icon:'error', customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'}}); })
        .catch(e=>{ fetchPatientHistory(activeBookingObj.idCard); Swal.fire({title:_t('swal_success'), text:_t('swal_cancelled'), icon:'success', customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'}}); });
    }

    // ==========================================
    // 🌟 APP NAVIGATION & DATA FETCHING
    // ==========================================
    function openApp(type) { proceedToApp(type); }

    function proceedToApp(type) { currentApp = type; let conf = APP_CONFIG[type]; document.documentElement.style.setProperty('--primary', conf.color); document.documentElement.style.setProperty('--primary-light', type==='tcm'?'#ffebee':type==='postpartum'?'#fce4ec':type==='steam'?'#e0f2fe':'#e8f5e9'); document.getElementById('app-title').innerText = _t('app_' + type); document.getElementById('app-logo').src = conf.logo; document.getElementById('view-home').classList.add('hidden'); document.getElementById('view-dashboard').classList.remove('hidden'); fetchData(true); if(refreshInterval) clearInterval(refreshInterval); refreshInterval = setInterval(() => { fetchData(false); }, 15000); }
    function goHome() { document.getElementById('view-dashboard').classList.add('hidden'); document.getElementById('view-home').classList.remove('hidden'); if(refreshInterval) clearInterval(refreshInterval); renderMultiUserCard(); }

    function fetchData(showLoader) {
      if(showLoader) document.getElementById('pageLoader').classList.remove('hidden');
      const syncIcon = document.getElementById('sync-icon'); const syncText = document.getElementById('sync-text');
      if(!showLoader) syncIcon.classList.add('spin-active');
      fetch(FIREBASE_BASE_URL + "sadaoData.json?t=" + new Date().getTime(), { cache: 'no-store' }).then(res => res.json()).then(data => {
            let now = new Date(); let timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
            syncIcon.classList.remove('spin-active'); syncText.innerText = (currentLang === 'en' ? 'Updated ' : 'อัปเดตล่าสุด ') + timeStr; 
            fullFirebaseData = data; globalData = currentApp==='ttm'?data.ttm:currentApp==='tcm'?data.tcm:currentApp==='postpartum'?data.postpartum:data.steam;
            renderScroller(); renderSlots(selectedIndex); if(showLoader) document.getElementById('pageLoader').classList.add('hidden');
        }).catch(e => { syncIcon.classList.remove('spin-active'); syncText.innerText = 'Offline'; if(showLoader) document.getElementById('pageLoader').classList.add('hidden'); });
    }

    function renderScroller() {
      let html = ''; let days = currentLang === 'en' ? ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] : ["อา.","จ.","อ.","พ.","พฤ.","ศ.","ส."];
      globalData.forEach((d, i) => { let active = (i === selectedIndex) ? 'active' : ''; html += `<div class="date-chip ${active}" onclick="selectDate(${i})"><small>${days[d.dayOfWeek]}</small><span>${d.displayDate.split(" ")[0]}</span></div>`; });
      document.getElementById('dateScroller').innerHTML = html;
      if(globalData[selectedIndex]) { let dColor = DAY_COLORS[globalData[selectedIndex].dayOfWeek]; let style = document.getElementById('dynamic-day-color'); if(!style) { style = document.createElement('style'); style.id = 'dynamic-day-color'; document.head.appendChild(style); } style.innerHTML = `.date-chip.active::after { background: ${dColor} !important; }`; }
    }
    
    function selectDate(index) { selectedIndex = index; renderScroller(); renderSlots(index); }

    // 🔥 NEW FUNCTION: SECURE ONCLICK EVENT 🔥
    function openBookingSafe(dayIndex, time, slotGender) {
        try {
            staffCan2Hr = false; 
            let day = globalData[dayIndex];
            let slotData = day.slots.find(s => s.time === time);
            if (!slotData) return;

            let staffs = slotData.staff || [];
            
            let dtLabel = day.fullLabel;
            if (currentLang === 'en') {
                let mEn = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                let dParts = day.sysDate.split("-");
                dtLabel = `${dParts[2]} ${mEn[parseInt(dParts[1])-1]} ${dParts[0]}`;
            }

            bookingData = { 
                dept: APP_CONFIG[currentApp].title, 
                date: dtLabel, 
                sysDate: day.sysDate, 
                time: time, 
                appType: currentApp, 
                sheetName: day.sheetName,
                ppExtraData: JSON.stringify(staffs)
            };
            
            document.getElementById('auth-section').style.display = 'block'; 
            
            if(activeProfileId) { 
                let idStr = activeProfileId.toString();
                if(idStr.length === 13 && !isForeigner) {
                    let boxes = document.querySelectorAll('.otp-box');
                    for(let i=0; i<13; i++) {
                        if(boxes[i]) { boxes[i].value = idStr[i]; boxes[i].classList.add('filled'); }
                    }
                } else {
                    document.getElementById('chk-foreigner').checked = true;
                    toggleForeignerMode();
                    document.getElementById('inp-idcard-foreigner').value = idStr;
                }
                document.getElementById('inp-idcard').value = idStr;
                
                document.getElementById('existing-user-display').classList.remove('hidden'); 
                document.getElementById('user-details-form').classList.add('hidden');
                document.getElementById('masked-name').innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${_t('loading')}`; 
                
                renderSmartBookDropdown(); 
                checkIDCardInput(); 
            } else { 
                clearForNewPatient(); 
            }
            
            document.getElementById('inp-note').value = ''; 
            ['normal-fields', 'postpartum-fields', 'steam-fields'].forEach(id => document.getElementById(id).classList.add('hidden'));
            
            if (currentApp === 'postpartum') { 
                document.getElementById('postpartum-fields').classList.remove('hidden'); 
            } else if (currentApp === 'steam') { 
                document.getElementById('steam-fields').classList.remove('hidden'); 
                if (slotGender === 'ช' || slotGender === 'ชาย') document.getElementById('inp-gender').value = 'ชาย'; 
                else if (slotGender === 'ญ' || slotGender === 'หญิง') document.getElementById('inp-gender').value = 'หญิง'; 
            } else {
                document.getElementById('normal-fields').classList.remove('hidden'); 
                let sel = document.getElementById('inp-service'); 
                sel.innerHTML = ''; 
                SERVICE_OPTIONS[currentApp].forEach(s => { let o = document.createElement('option'); o.value=s; o.innerText= _t(s); sel.appendChild(o); }); 
                updatePriceDisplay();
                
                let cCont = document.getElementById('staff-options'); 
                cCont.innerHTML = ''; 
                
                if (staffs.length > 0 && staffs[0].row !== undefined) { 
                    document.getElementById('group-staff').style.display = 'block'; 
                    let grouped = {}; 
                    staffs.forEach(s => { 
                        let k = s.name; 
                        if(!grouped[k]) grouped[k] = Object.assign({}, s); 
                        else if(s.can2Hr) grouped[k] = Object.assign({}, s); 
                    }); 
                    
                    let unique = Object.values(grouped); 
                    if(unique.length > 0) selectStaffNew(unique[0], unique[0].name); 
                    
                    unique.forEach(s => { 
                        let baseN = s.name; 
                        let dN = currentLang === 'en' ? (STAFF_EN_NAMES[baseN] || baseN) : (STAFF_NAME_MAP[baseN] || baseN); 
                        let defaultAppImg = currentApp === 'tcm' ? 'https://img2.pic.in.th/55c47176d1c28f966a1289b3b1d48837.png' : DEFAULT_IMG;
                        let img = STAFF_IMAGES[baseN] || defaultAppImg; 
                        
                        let badge1Hr = `<span style="background:#dcfce7; color:#16a34a; font-size:0.75rem; padding:2px 6px; border-radius:6px; margin-left:6px; border:1px solid #bbf7d0;"><i class="fas fa-clock"></i> 1Hr</span>`;
                        let badge2Hr = s.can2Hr ? `<span style="background:#fffbeb; color:#d97706; font-size:0.75rem; padding:2px 6px; border-radius:6px; margin-left:4px; border:1px solid #fde68a;"><i class="fas fa-bolt"></i> 2Hr</span>` : '';
                        
                        let div = document.createElement('div'); 
                        div.className = 'select-item'; 
                        div.innerHTML = `<img src="${img}" class="select-img"><div style="font-weight:600; flex:1; color:#1e293b;">${dN} ${badge1Hr}${badge2Hr}</div>`; 
                        div.onclick = () => selectStaffNew(s, baseN); 
                        cCont.appendChild(div); 
                    }); 
                } else { 
                    document.getElementById('group-staff').style.display = 'none'; 
                    document.getElementById('inp-staff-val').value = "ไม่ระบุ"; 
                }
            }
            
            goToStep1(); 
            document.getElementById('bookingModal').classList.add('show');
            
        } catch(e) { 
            console.error("Setup error:", e); 
        }
    }

    function renderSlots(index) {
        let day = globalData[index]; 
        let container = document.getElementById('contentArea');
        if (!day || !day.slots || day.slots.length === 0) { container.innerHTML = `<div style="text-align:center; padding:60px 20px; color:#94a3b8;"><i class="fas fa-calendar-times" style="font-size:3.5rem; margin-bottom:15px; opacity:0.4;"></i><h3 style="margin:0;">${currentLang === 'en' ? 'No slots available' : 'ไม่มีรอบว่างในวันนี้'}</h3></div>`; return; }
        
        let now = new Date(); let currentMins = now.getHours() * 60 + now.getMinutes(); let todaySysDate = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, '0') + "-" + String(now.getDate()).padStart(2, '0'); let isToday = (day.sysDate === todaySysDate);
        let validSlots = [];
        
        day.slots.forEach(slot => { if (isToday) { let tP = slot.time.split(":"); let sM = parseInt(tP[0]) * 60 + parseInt(tP[1]); if (sM <= currentMins) return; } validSlots.push(slot); });
        
        if(validSlots.length === 0) { container.innerHTML = `<div style="text-align:center; padding:60px 20px; color:#94a3b8;"><i class="fas fa-clock" style="font-size:3.5rem; margin-bottom:15px; opacity:0.4;"></i><h3 style="margin:0;">${currentLang === 'en' ? 'All slots have passed' : 'รอบบริการวันนี้ผ่านไปหมดแล้ว'}</h3></div>`; return; }
        
        let dtLabel = day.fullLabel; 
        if(currentLang === 'en') { let mEn = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; let dParts = day.sysDate.split("-"); dtLabel = `${dParts[2]} ${mEn[parseInt(dParts[1])-1]} ${dParts[0]}`; }
        
        let html = `<div class="selected-date-header"><span class="header-bar"></span>${dtLabel}</div><div class="grid-container">`;
        let deptIcon = '<i class="fas fa-calendar-check"></i>'; 
        if (currentApp === 'ttm') deptIcon = '<i class="fas fa-leaf"></i>'; else if (currentApp === 'tcm') deptIcon = '<i class="fas fa-yin-yang"></i>'; else if (currentApp === 'postpartum') deptIcon = '<i class="fas fa-hands-holding-child"></i>'; else if (currentApp === 'steam') deptIcon = '<i class="fas fa-hot-tub-person"></i>';
        
        validSlots.forEach((slot, i) => {
            let isFull = slot.val.includes('เต็ม') || slot.val.includes('งด'); 
            let count = slot.count || 0; 
            let slotGender = slot.gender || ""; 
            let gClass = "";
            
            if (currentApp === 'tcm') gClass = "theme-tcm"; 
            if (currentApp === 'postpartum') gClass = "theme-postpartum";
            if (currentApp === 'steam' && slotGender !== "" && !isFull) { 
                if (slotGender === "ชาย" || slotGender === "ช") gClass = "slot-male"; 
                else if (slotGender === "หญิง" || slotGender === "ญ") gClass = "slot-female"; 
            }
            
            let twoHrBadge = ""; 
            if (!isFull && slot.count2Hr > 0 && (currentApp === 'ttm' || currentApp === 'tcm')) { 
                let bText = currentApp === 'tcm' ? "Acu+Cup" : `2Hr (${slot.count2Hr})`; 
                twoHrBadge = `<div class="badge-2hr"><i class="fas fa-clock"></i> ${bText}</div>`; 
            }
            
            // 🔥 AVATAR STACK LOGIC 🔥
            let iconsHtml = ''; 
            if (!isFull && count > 0) { 
                iconsHtml = `<div class="queue-icons" style="display:flex; align-items:center;">`; 
                if (currentApp === 'tcm') {
                    let displayCount = Math.min(count, 4);
                    let tcmImg = 'https://img2.pic.in.th/55c47176d1c28f966a1289b3b1d48837.png';
                    for(let k=0; k<displayCount; k++) {
                        let marginLeft = k > 0 ? '-8px' : '0';
                        iconsHtml += `<img src="${tcmImg}" style="width:26px; height:26px; border-radius:50%; border:2px solid white; margin-left:${marginLeft}; z-index:${10-k}; position:relative; object-fit:cover; background:#f8fafc; box-shadow:0 1px 3px rgba(0,0,0,0.1);">`;
                    }
                    if (count > displayCount) iconsHtml += `<span style="font-weight:800; margin-left:6px; font-size:0.75rem; color:var(--primary);">+${count - displayCount}</span>`;
                } else if (currentApp === 'ttm' && slot.staff && slot.staff.length > 0) {
                    let uniqueStaffNames = [...new Set(slot.staff.map(s => s.name))];
                    let displayCount = Math.min(uniqueStaffNames.length, 4);
                    for(let k=0; k<displayCount; k++) {
                        let sName = uniqueStaffNames[k];
                        let imgUrl = STAFF_IMAGES[sName] || DEFAULT_IMG;
                        let marginLeft = k > 0 ? '-8px' : '0';
                        iconsHtml += `<img src="${imgUrl}" style="width:26px; height:26px; border-radius:50%; border:2px solid white; margin-left:${marginLeft}; z-index:${10-k}; position:relative; object-fit:cover; background:#f8fafc; box-shadow:0 1px 3px rgba(0,0,0,0.1);">`;
                    }
                    if (count > displayCount) iconsHtml += `<span style="font-weight:800; margin-left:6px; font-size:0.75rem; color:var(--primary);">+${count - displayCount}</span>`;
                } else {
                    for(let k=0; k<Math.min(count, 4); k++) iconsHtml += `<i class="fas fa-user" style="font-size:0.8rem;"></i>`; 
                    if (count > 4) iconsHtml += `<span style="font-weight:800; margin-left:2px; font-size:0.7rem;">+</span>`; 
                }
                iconsHtml += `</div>`; 
            }
            
            let genderBadge = ''; 
            if (currentApp === 'steam' && slotGender && !isFull) { 
                if (slotGender === "ชาย" || slotGender === "ช") genderBadge = `<div class="gender-tag male-tag"><i class="fas fa-mars"></i> Male</div>`; 
                else if (slotGender === "หญิง" || slotGender === "ญ") genderBadge = `<div class="gender-tag female-tag"><i class="fas fa-venus"></i> Female</div>`; 
            }
            
            let statusTxt = isFull ? (currentLang==='en'?'FULL':'เต็ม') : (currentLang==='en'?`${count} Left`:`ว่าง ${count}`);
            let badgeHtml = isFull ? `<div class="status-capsule"><div class="status-text">${statusTxt}</div></div>` : `<div class="slot-info-right">${genderBadge}${twoHrBadge}<div class="status-capsule">${iconsHtml}<div class="status-text">${statusTxt}</div></div></div>`;
            
            // 🔥 SECURE ONCLICK ACTION 🔥
            let action = isFull ? '' : `onclick="openBookingSafe(${index}, '${slot.time}', '${slotGender}')"`;
            
            html += `<div class="slot-card ${isFull?'is-full':''} ${gClass}" style="animation-delay:${i*0.05}s; ${isFull?'':'cursor:pointer'}" ${action}><div class="time-wrap"><div class="icon-status">${isFull ? '<i class="fas fa-lock"></i>' : deptIcon}</div><div class="time-text">${slot.time}<small>${currentApp==='steam'?(currentLang==='en'?'Round':'รอบบริการ'):(currentLang==='en'?'Start':'เริ่มให้บริการ')}</small></div></div>${badgeHtml}</div>`;
        });
        container.innerHTML = html + '</div>';
    }

    // ==========================================
    // 🌟 BOOKING MODAL LOGIC & STEPPER
    // ==========================================
    function updateStepper(step) {
        for(let i=1; i<=3; i++) {
            let ind = document.getElementById('step-ind-'+i);
            let line = document.getElementById('line-'+(i-1));
            
            if(i < step) {
                ind.className = 'step completed';
                ind.querySelector('.step-circle').innerHTML = '<i class="fas fa-check"></i>';
                if(line) line.className = 'step-line active';
            } else if(i === step) {
                ind.className = 'step active';
                ind.querySelector('.step-circle').innerHTML = i;
                if(line) line.className = 'step-line active';
            } else {
                ind.className = 'step';
                ind.querySelector('.step-circle').innerHTML = i;
                if(line) line.className = 'step-line';
            }
        }
    }

    function goToStep1() {
        document.getElementById('step-1-patient').classList.remove('hidden');
        document.getElementById('step-2-service').classList.add('hidden');
        document.getElementById('step-3-summary').classList.add('hidden');
        updateStepper(1);
        document.getElementById('t-fill-info').innerHTML = `<i class="fas fa-user-edit" style="color:var(--primary);"></i> <span id="t-modal-title">${_t('step1_title')}</span>`;
    }

    function goToStep2() {
        let id = document.getElementById('inp-idcard').value; 
        let f = document.getElementById('inp-fname').value.trim(); 
        let t = document.getElementById('inp-tel').value;
        if(!id || !f || !t) return Swal.fire({title:_t('warn_title'), text:_t('err_req_fields'), icon:'warning', customClass: { popup: 'swal-3d-popup', confirmButton: 'swal-3d-btn' }});
        
        document.getElementById('step-1-patient').classList.add('hidden');
        document.getElementById('step-2-service').classList.remove('hidden');
        document.getElementById('step-3-summary').classList.add('hidden');
        updateStepper(2);
        document.getElementById('t-fill-info').innerHTML = `<i class="fas fa-stethoscope" style="color:var(--primary);"></i> <span id="t-modal-title">${_t('step2_title')}</span>`;
    }

    function goToStep3() {
        document.getElementById('step-1-patient').classList.add('hidden');
        document.getElementById('step-2-service').classList.add('hidden');
        document.getElementById('step-3-summary').classList.remove('hidden');
        updateStepper(3);
        document.getElementById('t-fill-info').innerHTML = `<i class="fas fa-clipboard-check" style="color:var(--primary);"></i> <span id="t-modal-title">${_t('step3_title')}</span>`;
    }

    function toggleStaffDropdown() { document.getElementById('staff-trigger').classList.toggle('open'); }
    
    function selectStaffNew(sObj, thaiName) { 
        let dName = currentLang === 'en' ? (STAFF_EN_NAMES[thaiName] || thaiName) : (STAFF_NAME_MAP[thaiName] || thaiName);
        
        let defaultAppImg = currentApp === 'tcm' ? 'https://img2.pic.in.th/55c47176d1c28f966a1289b3b1d48837.png' : DEFAULT_IMG;
        let imgUrl = STAFF_IMAGES[thaiName] || defaultAppImg;
        let displayImg = document.getElementById('staff-display-img');
        if (displayImg) displayImg.src = imgUrl;
        
        document.getElementById('staff-display-name').innerText = dName;
        document.getElementById('inp-staff-val').value = thaiName; 
        selectedSlotData = { sheetName: sObj.sheetName, row: sObj.row, col: sObj.col }; 
        staffCan2Hr = sObj.can2Hr || false; 
        
        document.getElementById('staff-trigger').classList.remove('open'); 
        updatePriceDisplay();
    }
    
    function updatePriceDisplay() { 
        let svc = document.getElementById('inp-service').value; let price = "-"; 
        let day = globalData[selectedIndex]; let isOOH = false;
        if (day) { let hasEvening = day.slots.some(s => s.time === '17:00' || s.time === '18:00'); let isHolidaySheet = (day.dayOfWeek >= 1 && day.dayOfWeek <= 5) && !hasEvening && day.slots.length > 0; if (day.dayOfWeek === 0 || day.dayOfWeek === 6 || bookingData.time === '17:00' || bookingData.time === '18:00' || isHolidaySheet) isOOH = true; }
        bookingData.isOOH = isOOH;
        
        if (currentApp === 'ttm') { price = _t('calc_sub'); } 
        else if (currentApp === 'tcm') {
            if (svc.includes('ฝังเข็มเพื่อการรักษา')) price = _t('calc_sub');
            else price = (currentLang === 'en' ? SERVICE_PRICES_EN[currentApp][svc] : SERVICE_PRICES[currentApp][svc]) || "-";
        } else { price = _t('calc_sub'); }
        
        let tag = document.getElementById('price-tag'); 
        let val = document.getElementById('price-val'); 
        if (tag && val) { 
            if (price !== "-") { val.innerHTML = price; tag.style.display = 'block'; } 
            else { tag.style.display = 'none'; } 
        } 
    }

    // 🚀 NEW FLOW: Cross-selling Popups 🚀
    function startBookingOptionsFlow() {
        let id = document.getElementById('inp-idcard').value; 
        let f = document.getElementById('inp-fname').value.trim(); 
        let l = document.getElementById('inp-lname').value.trim(); 
        let t = document.getElementById('inp-tel').value;
        if(!id || !f || !t) return Swal.fire({title:_t('warn_title'), text:_t('err_req_fields'), icon:'warning', customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'}});
        
        bookingData.idCard = id; bookingData.fname = f; bookingData.lname = l; 
        bookingData.name = f + " " + l; bookingData.tel = t; 
        bookingData.note = document.getElementById('inp-note').value; 
        bookingData.extraInfo = "";
        
        let existingProfile = savedProfiles.find(p => p.id === id);
        if(!existingProfile) addOrUpdateProfile(id, f, l, t, "");

        let day = globalData[selectedIndex]; let isOOH = false;
        if (day) { let hasEvening = day.slots.some(s => s.time === '17:00' || s.time === '18:00'); let isHolidaySheet = (day.dayOfWeek >= 1 && day.dayOfWeek <= 5) && !hasEvening && day.slots.length > 0; if (day.dayOfWeek === 0 || day.dayOfWeek === 6 || bookingData.time === '17:00' || bookingData.time === '18:00' || isHolidaySheet) isOOH = true; }
        bookingData.isOOH = isOOH;

        let baseStaffName = document.getElementById('inp-staff-val').value; 
        bookingData.staff = baseStaffName;
        bookingData.service = document.getElementById('inp-service').value.split(' (')[0];
        bookingData.is2Hr = false;
        bookingData.addSteam = false;
        bookingData.steamGender = "หญิง";
        
        if (currentApp === 'postpartum') { 
            let bd = document.getElementById('inp-birth-date').value; let dt = document.getElementById('inp-delivery-type').value; let h = document.getElementById('inp-hospital').value;
            if(!bd || !dt || !h) return Swal.fire({title:_t('warn_title'), text:currentLang==='en'?'Please fill delivery details':'กรุณากรอกข้อมูลการคลอดให้ครบ', icon:'warning', customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'}});
            bookingData.extraInfo = currentLang==='en' ? `Birth: ${bd} (${dt}) Hosp: ${h}` : `คลอด: ${bd} (${dt}) รพ.${h}`; 
            bookingData.service = "บริการหลังคลอด"; bookingData.staff = "ไม่ระบุ"; bookingData.is2Hr = true; 
            buildSummaryAndShow(null);
            return;
        } 
        else if (currentApp === 'steam') { 
            bookingData.extraInfo = currentLang==='en' ? `Gender: ${document.getElementById('inp-gender').value}` : `เพศ: ${document.getElementById('inp-gender').value}`; 
            bookingData.service = "อบไอน้ำ"; bookingData.staff = "ไม่ระบุ"; 
            buildSummaryAndShow(null);
            return;
        }

        if (currentApp === 'tcm' && !bookingData.service.includes("ฝังเข็มเพื่อการรักษา")) {
            buildSummaryAndShow(null);
            return;
        }

        checkDurationOption();
    }

    function checkDurationOption() {
        if ((currentApp === 'ttm' || currentApp === 'tcm') && staffCan2Hr) {
            let titleText = currentLang === 'en' ? 'Select Duration' : 'เลือกระยะเวลาให้บริการ';
            let btn1 = currentLang === 'en' ? '<i class="fas fa-clock"></i> 1 Hour (Standard)' : '<i class="fas fa-clock"></i> 1 ชั่วโมง (มาตรฐาน)';
            let btn2 = currentLang === 'en' ? '<i class="fas fa-bolt"></i> 2 Hours (+250 THB)' : '<i class="fas fa-bolt"></i> 2 ชั่วโมงต่อเนื่อง (+250 บาท)';
            if(currentApp === 'tcm') btn2 = currentLang === 'en' ? '<i class="fas fa-bolt"></i> Acu + Cupping (+150 THB)' : '<i class="fas fa-bolt"></i> ฝังเข็ม + ครอบแก้ว (+150 บาท)';

            Swal.fire({
                title: titleText,
                html: currentLang === 'en' ? 'Please select your preferred treatment duration.' : 'กรุณาเลือกระยะเวลาที่คุณต้องการรับบริการ',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: btn1,
                denyButtonText: btn2,
                cancelButtonText: currentLang === 'en' ? 'Cancel' : 'ยกเลิก',
                customClass: {
                    popup: 'swal-3d-popup',
                    actions: 'swal-actions-vertical',
                    confirmButton: 'swal-btn-1hr',
                    denyButton: 'swal-btn-2hr',
                    cancelButton: 'swal-btn-cancel-light'
                }
            }).then((result) => {
                if (result.isConfirmed) { bookingData.is2Hr = false; checkSteamOption(); } 
                else if (result.isDenied) { bookingData.is2Hr = true; checkSteamOption(); }
            });
        } else {
            bookingData.is2Hr = false;
            checkSteamOption();
        }
    }

    function checkSteamOption() {
        if (currentApp !== 'ttm') { promptRightSelection(); return; }

        let targetTime = bookingData.is2Hr ? STEAM_NEXT_2HR[bookingData.time] : STEAM_NEXT_1HR[bookingData.time];
        if(!targetTime || !fullFirebaseData || !fullFirebaseData.steam) { promptRightSelection(); return; }

        let dayData = fullFirebaseData.steam.find(d => d.sysDate === bookingData.sysDate); 
        let steamSlot = dayData ? dayData.slots.find(s => s.time === targetTime) : null;
        
        if(steamSlot && steamSlot.count > 0 && !steamSlot.rawSpots.isHoliday) {
            let gT = steamSlot.gender === "" ? (currentLang==='en'?'Any Gender':'ไม่จำกัดเพศ') : (steamSlot.gender === "ชาย" || steamSlot.gender === "ช" ? (currentLang==='en'?'Male':'ชาย') : (currentLang==='en'?'Female':'หญิง'));
            let genderHtml = '';
            if (steamSlot.gender !== "") {
                let fixedVal = (steamSlot.gender === "ชาย" || steamSlot.gender === "ช") ? "ชาย" : "หญิง";
                genderHtml = `<input type="hidden" id="swal-steam-gender" value="${fixedVal}"><div style="background:#e0f2fe; padding:10px; border-radius:12px; margin-top:10px; font-size:0.9rem; font-weight:bold; color:#0288d1;"><i class="fas fa-info-circle"></i> รอบนี้ล็อกเป็นเพศ${fixedVal}</div>`;
            } else {
                genderHtml = `<select id="swal-steam-gender" class="form-control" style="margin-top:15px;"><option value="หญิง">${currentLang==='en'?'Female':'หญิง'}</option><option value="ชาย">${currentLang==='en'?'Male':'ชาย'}</option></select>`;
            }

            Swal.fire({
                title: currentLang === 'en' ? 'Add Steam Therapy?' : 'อบไอน้ำสมุนไพรต่อเนื่อง?',
                html: `<div style="font-size:0.95rem; color:#475569; margin-bottom:10px;">${currentLang==='en'?'Would you like to add steam therapy after your massage?':'รับบริการอบไอน้ำสมุนไพรต่อเนื่องหลังนวดเสร็จหรือไม่?'}</div><div style="font-size:0.85rem; background:#f1f5f9; padding:8px; border-radius:8px;"><b><i class="fas fa-clock"></i> ${targetTime} น.</b> | ${currentLang==='en'?`${steamSlot.count} Left` : `ว่าง ${steamSlot.count} คิว`} (${gT})</div>${genderHtml}`,
                showCancelButton: true,
                confirmButtonText: currentLang === 'en' ? '<i class="fas fa-hot-tub-person"></i> Yes, add Steam' : '<i class="fas fa-hot-tub-person"></i> เพิ่มอบไอน้ำ',
                cancelButtonText: currentLang === 'en' ? 'No, skip' : 'ไม่, ข้ามไป',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'swal-3d-popup', confirmButton: 'swal-btn-steam', cancelButton: 'swal-btn-cancel-light', actions: 'swal-actions-vertical' },
                preConfirm: () => { return document.getElementById('swal-steam-gender').value; }
            }).then((result) => {
                if (result.isConfirmed) { bookingData.addSteam = true; bookingData.steamGender = result.value; bookingData.steamTime = targetTime; } 
                else { bookingData.addSteam = false; bookingData.steamTime = null; }
                promptRightSelection();
            });
        } else {
            bookingData.addSteam = false;
            bookingData.steamTime = null;
            promptRightSelection();
        }
    }

    function promptRightSelection() {
        Swal.fire({
            title: _t('right_title'),
            html: `
                <div style="text-align:left; font-size:0.95rem; margin-top:10px;">
                    <div class="right-option" onclick="selectRight('1')" id="opt-right-1"><div class="right-title-row"><i class="fas fa-id-card" style="color:#f59e0b;"></i> ${_t('right_uc30')}</div><div class="right-desc">${_t('right_desc30')}</div></div>
                    <div class="right-option" onclick="selectRight('2')" id="opt-right-2"><div class="right-title-row"><i class="fas fa-id-card" style="color:#10b981;"></i> ${_t('right_uc_free')}</div><div class="right-desc">${_t('right_desc_free')}</div></div>
                    <div class="right-option" onclick="selectRight('3')" id="opt-right-3"><div class="right-title-row"><i class="fas fa-id-badge" style="color:#3b82f6;"></i> ${_t('right_gov')}</div><div class="right-desc">${_t('right_desc_gov')}</div></div>
                    <div class="right-option" onclick="selectRight('4')" id="opt-right-4"><div class="right-title-row"><i class="fas fa-landmark" style="color:#8b5cf6;"></i> ${_t('right_enterprise')}</div><div class="right-desc">${_t('right_desc_enterprise')}</div></div>
                    <div class="right-option" onclick="selectRight('5')" id="opt-right-5"><div class="right-title-row"><i class="fas fa-wallet" style="color:#f97316;"></i> ${_t('right_ss')}</div><div class="right-desc">${_t('right_desc_ss')}</div></div>
                </div>
                <input type="hidden" id="selected-right-val" value="">
            `,
            showCancelButton: true, confirmButtonText: _t('btn_confirm_right'), cancelButtonText: _t('btn_cancel'), confirmButtonColor: '#2e7d32',
            customClass: { popup: 'swal-3d-popup', confirmButton: 'swal-3d-btn' },
            preConfirm: () => { let v = document.getElementById('selected-right-val').value; if(!v) { Swal.showValidationMessage(_t('warn_select_right')); return false; } return v; }
        }).then((r) => { if(r.isConfirmed) calculateAnimation(r.value); });
    }

    function calculateAnimation(rV) {
        Swal.fire({ title: _t('calc_title'), html: `<div style="font-size:3.5rem; color:var(--primary); margin:20px 0;"><i class="fas fa-calculator fa-beat-fade"></i></div><div style="font-size:0.95rem; font-weight:bold; color:#64748b;">${_t('calc_sub')}</div>`, showConfirmButton: false, allowOutsideClick: false, timer: 1500, customClass: { popup: 'swal-3d-popup' } }).then(() => buildSummaryAndShow(rV));
    }

    function buildSummaryAndShow(rV) {
        let f = bookingData.fname; let l = bookingData.lname; let t = bookingData.tel; let mN = getMaskedFullName(f, l);
        let sN = bookingData.staff; let dS = currentLang === 'en' ? (STAFF_EN_NAMES[sN] || sN) : (STAFF_NAME_MAP[sN] || sN);
        
        let p = savedProfiles.find(x => x.id === bookingData.idCard);
        let pLabel = (p && p.label) ? p.label : (currentLang === 'en' ? 'Patient' : 'ผู้รับบริการ');

        let infoH = `
            <div style="display:flex; gap:15px; align-items:center; margin-bottom:15px;">
                <div style="width:50px; height:50px; border-radius:15px; background:linear-gradient(135deg, var(--primary-light), #bbf7d0); display:flex; justify-content:center; align-items:center; font-size:1.5rem; color:var(--primary); box-shadow: 2px 4px 10px rgba(0,0,0,0.1);"><i class="fas fa-user-circle"></i></div>
                <div>
                    <div style="font-weight:800; font-size:1.1rem; color:#1e293b;">${pLabel} <span style="font-size:0.8rem; font-weight:400; color:#64748b;">(${mN})</span></div>
                    <div style="color:#64748b; font-size:0.9rem;"><i class="fas fa-phone-alt"></i> ${getMaskedTel(t)}</div>
                </div>
            </div>
            <div style="background:#f8fafc; border-radius:12px; padding:12px; margin-bottom:15px; border:1px solid #e2e8f0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
                <div style="margin-bottom:6px;"><b>${currentLang==='en'?'Service':'บริการ'}:</b> <span style="color:var(--primary-dark); font-weight:600;">${_t(bookingData.service)}</span></div>
                <div style="margin-bottom:6px;"><b>${currentLang==='en'?'Time':'เวลา'}:</b> ${bookingData.date} <span style="background:var(--primary); color:white; padding:2px 8px; border-radius:8px; font-size:0.85rem;">${bookingData.time}</span></div>
                ${(currentApp === 'ttm' || currentApp === 'tcm') ? `<div><b>${currentLang==='en'?'Provider':'ผู้ให้บริการ'}:</b> ${dS}</div>` : ''}
            </div>
        `;
        
        let brk = []; let total = 0; let rName = ""; 
        if (rV === '1') rName = _t('right_uc30'); else if (rV === '2') rName = _t('right_uc_free'); else if (rV === '3') rName = _t('right_gov'); else if (rV === '4') rName = _t('right_enterprise'); else if (rV === '5') rName = _t('right_ss');

        if (currentApp === 'ttm') {
            let base = 0; 
            let oohFee = bookingData.isOOH ? 60 : 0; 

            if (bookingData.service.includes("นวดและประคบ")) { 
                if (rV === '3') { base = 0; }
                else if (rV === '1' || rV === '2') { base = 100; if (bookingData.isOOH) { oohFee = 0; } }
                else { base = 250; } 
            } else { base = 250; } 
            
            brk.push(`<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>${_t('bill_base')}</span><b>${base} ${_t('baht')}</b></div>`); 
            total += base;
            
            if (bookingData.isOOH) { brk.push(`<div style="display:flex; justify-content:space-between; color:#e65100; margin-bottom:4px;"><span>${_t('bill_ooh')}</span><b>${oohFee} ${_t('baht')}</b></div>`); total += oohFee; }
            if (bookingData.is2Hr) { brk.push(`<div style="display:flex; justify-content:space-between; color:#b45309; margin-bottom:4px;"><span>${_t('bill_2hr')}</span><b>250 ${_t('baht')}</b></div>`); total += 250; }
            if (bookingData.addSteam) { let stF = (rV === '5' || rV === '4') ? 100 : 0; brk.push(`<div style="display:flex; justify-content:space-between; color:#0288d1; margin-bottom:4px;"><span>${_t('bill_steam')}</span><b>${stF} ${_t('baht')}</b></div>`); total += stF; }
            
        } else if (currentApp === 'tcm') {
            let base = 0; let sv = bookingData.service;
            if (sv.includes("ฝังเข็มเพื่อการรักษา")) base = (rV === '3') ? 0 : 200; 
            else if (sv.includes("ครอบแก้ว")) base = 150; 
            else if (sv.includes("ฝังเข็มใบหน้า")) base = 300; 
            else if (sv.includes("เม็ดผักกาด")) base = 50;
            else if (sv.includes("ปรึกษา")) base = 0;
            
            brk.push(`<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>${_t('bill_base')}</span><b>${base} ${_t('baht')}</b></div>`); 
            total += base;
            
            if (bookingData.is2Hr) { brk.push(`<div style="display:flex; justify-content:space-between; color:#b45309; margin-bottom:4px;"><span>${currentLang==='en'?"Cupping:":"ครอบแก้ว:"}</span><b>150 ${_t('baht')}</b></div>`); total += 150; }
            
        } else if (currentApp === 'postpartum') {
            let base = 0; 
            if (rV === '2' || rV === '3') base = 0; 
            else if (rV === '1') base = 30; 
            else if (rV === '4') base = 670; 
            else if (rV === '5') base = 500;
            
            brk.push(`<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>${_t('bill_base')}</span><b>${base} ${_t('baht')}</b></div>`); 
            total += base;
            if (bookingData.isOOH) { brk.push(`<div style="display:flex; justify-content:space-between; color:#e65100; margin-bottom:4px;"><span>${_t('bill_ooh')}</span><b>60 ${_t('baht')}</b></div>`); total += 60; }
            
        } else if (currentApp === 'steam') {
            let base = 0; 
            if (rV === '2' || rV === '3') base = 0; 
            else if (rV === '1') base = 30; 
            else if (rV === '4') base = 120; 
            else if (rV === '5') base = 100;
            
            brk.push(`<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>${_t('bill_base')}</span><b>${base} ${_t('baht')}</b></div>`); 
            total += base;
            if (bookingData.isOOH) { brk.push(`<div style="display:flex; justify-content:space-between; color:#e65100; margin-bottom:4px;"><span>${_t('bill_ooh')}</span><b>60 ${_t('baht')}</b></div>`); total += 60; }
        }

        bookingData.rightName = rName; bookingData.totalFee = total; bookingData.breakdownLines = brk;
        let totalC = total > 0 ? "price-red" : "price-green";
        let noteBill = rV === '4' ? `<div style="font-size:0.75rem; color:#dc2626; margin-top:10px; font-weight:600; text-align:center;">${_t('bill_enterprise_note')}</div>` : '';

        let billH = `<div class="receipt-3d">
                        <div style="font-weight:800; color:#1e293b; margin-bottom:12px; border-bottom:2px dashed #cbd5e1; padding-bottom:10px; display:flex; align-items:center; gap:8px;"><i class="fas fa-file-invoice-dollar" style="color:var(--primary); font-size:1.5rem;"></i><span>${_t('bill_title')}</span></div>
                        <div style="font-size:0.85rem; color:var(--primary-dark); font-weight:700; margin-bottom:12px; background:#e8f5e9; padding:8px 12px; border-radius:8px;">${_t('bill_right')} ${rName}</div>
                        <div style="font-size:0.9rem; color:#475569; line-height:1.4;">${brk.join('')}</div>
                        <div class="total-box-3d"><span style="font-weight:800; color:#475569; font-size:1rem;">${_t('bill_total')}</span><span class="${totalC}" style="font-size:1.6rem; font-weight:800;">${total} ${_t('baht')}</span></div>
                        ${noteBill}
                    </div>`;
        
        let nH = (bookingData.extraInfo ? `<div style="margin-top:15px; color:#0ea5e9; font-size:0.9rem;"><i class="fas fa-info-circle"></i> ${bookingData.extraInfo}</div>` : '') + (bookingData.note ? `<div style="margin-top:10px; font-size:0.9rem;"><b>${_t('note')}:</b> <span style="color:#dc2626;">${bookingData.note}</span></div>` : '');
        document.getElementById('summary-content').innerHTML = infoH + billH + nH; goToStep3();
    }

    // ==========================================
    // 🌟 SUBMISSION & LOADERS
    // ==========================================
    function confirmBooking() {
        document.getElementById('btn-final-confirm').disabled = true; showPercentageLoader(); 
        let fCombined = (bookingData.fname + " " + (bookingData.lname || "")).trim(); let fSvc = bookingData.service;
        if(bookingData.is2Hr && currentApp !== 'postpartum') fSvc += (currentApp === 'ttm') ? " (2 ชม.)" : " + ครอบแก้ว";
        let payload = { appType: bookingData.appType, sheetName: bookingData.sheetName, idCard: bookingData.idCard, fname: bookingData.fname, lname: bookingData.lname, fullName: fCombined, tel: bookingData.tel, service: fSvc, note: (bookingData.extraInfo + " | " + (bookingData.note || "")), time: bookingData.time, date: bookingData.date, sysDate: bookingData.sysDate, is2Hr: bookingData.is2Hr, addSteam: bookingData.addSteam, steamTime: bookingData.steamTime, steamGender: bookingData.steamGender, right: bookingData.rightName, totalFee: bookingData.totalFee };
        if ((currentApp === 'ttm' || currentApp === 'tcm') && selectedSlotData) { payload.row = selectedSlotData.row; payload.col = selectedSlotData.col; } else if (currentApp === 'steam') { payload.gender = document.getElementById('inp-gender').value; payload.patients = [{name: fCombined, tel: bookingData.tel}]; } else if (currentApp === 'postpartum') payload.ppExtraData = bookingData.ppExtraData;
        
        fetch(API_ENDPOINT, { method: 'POST', body: JSON.stringify(payload) }).then(async r => { 
            let res = await r.json(); 
            finishPercentageLoader(() => { 
                if(res.status === 'success' || res.status === 'error_but_done') { 
                    let p = savedProfiles.find(x => x.id === bookingData.idCard); 
                    addOrUpdateProfile(bookingData.idCard, bookingData.fname, bookingData.lname, bookingData.tel, p ? p.label : ''); 
                    Swal.fire({ 
                        title: _t('swal_book_success'), 
                        html: _t('swal_line_notify'), 
                        icon: 'success', 
                        confirmButtonText: '<i class="fab fa-line"></i> LINE Notify', 
                        confirmButtonColor: '#00c300', 
                        allowOutsideClick: false,
                        customClass: { popup: 'swal-3d-popup', confirmButton: 'swal-3d-btn' }
                    }).then((r) => { 
                        if(r.isConfirmed) { 
                            let mN = getMaskedFullName(bookingData.fname, bookingData.lname); 
                            let mP = "******" + bookingData.tel.slice(-4); 
                            let sN = bookingData.staff; 
                            let dS = currentLang === 'en' ? (STAFF_EN_NAMES[sN] || sN) : (STAFF_NAME_MAP[sN] || sN);
                            
                            // 🔥 ตัด pLab (ชื่อเล่น) ออกจาก LINE Notify ตามที่ผู้ใช้รีเควส
                            let msg = (currentLang === 'en' ? `Booking: ${APP_CONFIG[bookingData.appType].title}\nPatient: ${mN}\nPhone: ${mP}\n` : `ขอจองคิว${APP_CONFIG[bookingData.appType].title}\nผู้รับบริการ: ${mN}\nเบอร์โทร: ${mP}\n`) + `Service: ${_t(bookingData.service)}\nDate: ${bookingData.date}\nTime: ${bookingData.time}\n`; 
                            
                            if(bookingData.rightName) msg += `Right: ${bookingData.rightName}\n`; 
                            if((currentApp === 'ttm' || currentApp === 'tcm') && dS && dS !== "ไม่ระบุ" && dS !== "Not Specified") msg += (currentLang === 'en' ? `Provider: ${dS}\n` : `ผู้ให้บริการ: ${dS}\n`);
                            msg += `------------------\n`; 
                            if(bookingData.breakdownLines) msg += bookingData.breakdownLines.map(l => l.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')).join('\n') + `\n`; 
                            msg += `------------------\nTotal: ${bookingData.totalFee||0} ${_t('baht')}\n`;
                            if(bookingData.note) msg += (currentLang === 'en' ? `Note: ${bookingData.note}` : `หมายเหตุ: ${bookingData.note}`); 
                            
                            let d = document.createElement("textarea"); document.body.appendChild(d); d.value = msg; d.select(); document.execCommand("copy"); document.body.removeChild(d); 
                            window.location.href = `https://line.me/R/oaMessage/@649dqeft/?${encodeURIComponent(msg)}`; 
                        } 
                    }); 
                    closeModal(); renderMultiUserCard(); fetchData(true); 
                } else { 
                    let errTitle = _t('swal_error');
                    let errMsg = res.message || 'Slot unavailable';
                    let errIcon = 'error';
                    let btnColor = '#ef4444';

                    if (res.status === 'error_blocked' && res.reason === 'duplicate_person') {
                        errTitle = currentLang === 'en' ? 'Duplicate Appointment' : 'พบรายการจองซ้ำ';
                        errMsg = currentLang === 'en' ? 
                            `You have an active appointment on<br><b style="color:var(--primary); font-size:1.1rem;">${res.date} at ${res.time}</b>.<br>Please cancel it before booking a new one.` : 
                            `คุณมีคิวที่ยังไม่เข้ารับบริการในระบบ<br><b style="color:var(--primary); font-size:1.1rem;">วันที่ ${res.date} เวลา ${res.time} น.</b><br>กรุณากดยกเลิกคิวเดิมก่อนทำรายการใหม่ครับ`;
                        errIcon = 'warning';
                        btnColor = '#f59e0b';
                    } else if (errMsg.includes('ระบบทำงานหนัก') || res.status === 'error_occupied') {
                        errTitle = currentLang === 'en' ? 'Slot Taken' : 'คิวไม่ว่างแล้ว';
                        errMsg = currentLang === 'en' ? 
                            'This queue was just taken by someone else.<br>Please select another time.' : 
                            'คิวนี้มีคนจองไปก่อนแล้ว<br>กรุณาเลือกรอบเวลาอื่นครับ';
                        errIcon = 'info';
                        btnColor = '#3b82f6';
                    }

                    Swal.fire({ 
                        title: errTitle, 
                        html: errMsg, 
                        icon: errIcon, 
                        confirmButtonColor: btnColor,
                        customClass: { popup: 'swal-3d-popup', confirmButton: 'swal-3d-btn' }
                    }); 
                    document.getElementById('btn-final-confirm').disabled = false; fetchData(true); 
                } 
            }); 
        }).catch(e => finishPercentageLoader(() => { 
            let p = savedProfiles.find(x => x.id === bookingData.idCard); 
            addOrUpdateProfile(bookingData.idCard, bookingData.fname, bookingData.lname, bookingData.tel, p ? p.label : ''); 
            Swal.fire({title:_t('swal_success'), text:_t('swal_saved'), icon:'success', customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'}}); 
            closeModal(); renderMultiUserCard(); fetchData(true); 
        }));
    }

    function closeModal() { document.getElementById('bookingModal').classList.remove('show'); }
    
    let loadInterval; let tipsInterval; let currentPercent = 0;
    const loadTips = [ { icon: 'fa-clock', title: {th: 'มาก่อนเวลา 15 นาที', en: 'Arrive 15 mins early'}, text: {th: 'หากไม่มาติดต่อภายในเวลาที่กำหนด<br>ถือว่าท่านสละสิทธิ์', en: 'Failure to arrive on time<br>may result in cancellation.'} }, { icon: 'fa-id-card', title: {th: 'สิ่งที่ต้องเตรียม', en: 'What to bring'}, text: {th: '1. บัตรประจำตัวประชาชนตัวจริง<br>2. หน้ากากอนามัย (สวมตลอดเวลา)', en: '1. Original ID Card/Passport<br>2. Face Mask'} }, { icon: 'fa-calendar-times', title: {th: 'เลื่อน/ยกเลิกนัด', en: 'Reschedule/Cancel'}, text: {th: 'ล่วงหน้าอย่างน้อย 2 วัน<br>หากไม่ปฏิบัติตามแนวทาง<br>ขอสงวนสิทธิ์ไม่รับนัดครั้งถัดไป', en: 'At least 2 days in advance.<br>Otherwise, future bookings<br>may be restricted.'} } ];
    
    function showPercentageLoader() { document.getElementById('saveLoader').classList.remove('hidden'); currentPercent = 0; let tipIdx = 0; loadInterval = setInterval(() => { currentPercent += 1.5; if(currentPercent >= 95) currentPercent = 95; document.getElementById('progress-circle').style.strokeDashoffset = 326 - (currentPercent / 100) * 326; document.getElementById('progress-text').innerText = Math.floor(currentPercent) + "%"; }, 500); tipsInterval = setInterval(() => { tipIdx = (tipIdx + 1) % loadTips.length; document.getElementById('tip-title').innerHTML = `<i class="fas ${loadTips[tipIdx].icon}"></i> ${loadTips[tipIdx].title[currentLang]}`; document.getElementById('tip-text').innerHTML = loadTips[tipIdx].text[currentLang]; }, 4000); }
    function finishPercentageLoader(cb) { clearInterval(loadInterval); clearInterval(tipsInterval); document.getElementById('progress-circle').style.strokeDashoffset = 0; document.getElementById('progress-text').innerText = "100%"; setTimeout(() => { document.getElementById('saveLoader').classList.add('hidden'); if(cb) cb(); }, 500); }

    // ==========================================
    // 🌟 ADMIN & SYSTEM
    // ==========================================
    let logoTaps = 0; let tapTimer; let currentAdminSort = 'created';
    function handleAdminTap() { logoTaps++; clearTimeout(tapTimer); tapTimer = setTimeout(() => logoTaps = 0, 2000); if (logoTaps >= 7) { logoTaps = 0; Swal.fire({ title: '🛡️ Admin Login', input: 'password', showCancelButton: true, customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'} }).then((r) => { if (r.isConfirmed && r.value === "11395") { document.getElementById('adminModal').classList.add('show'); loadAdminLogs(); } }); } }
    function switchAdminTab(tId) { document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active')); event.currentTarget.classList.add('active'); document.getElementById(tId).classList.add('active'); }
    
    async function adminSearch() { 
        let q = document.getElementById('adminSearchInp').value; if(!q) return; 
        let resA = document.getElementById('adminSearchResult'); resA.innerHTML = "<tr><td colspan='2' style='text-align:center;'>Loading...</td></tr>"; 
        let r = await fetch(API_ENDPOINT, { method: 'POST', body: JSON.stringify({ action: 'admin_search', pass: '11395', query: q }) }); 
        let d = await r.json(); 
        if(d.status === 'success') { 
            let h = ''; 
            if(d.data.length === 0) h = "<tr><td colspan='2' style='text-align:center; color:red;'>No data</td></tr>";
            d.data.forEach(u => { 
                let pH = ''; 
                u.plans.forEach(p => { 
                    if(p.service === 'BANNED') pH += `<div style="background:#fee2e2; color:#b91c1c; padding:4px 8px; border-radius:4px; font-size:0.75rem; margin-top:4px;">BANNED ${p.date} <button onclick="adminManagePlan('${u.idCard}', 'BANNED', 'CLEAR')" style="background:none; border:none; color:#ef4444; cursor:pointer; font-weight:bold; float:right;">[X]</button></div>`; 
                    else pH += `<div class="plan-tag">${p.service}: ${p.date} <button onclick="adminManagePlan('${u.idCard}', '${p.service}', 'CLEAR')" style="background:none; border:none; color:#ef4444; cursor:pointer; font-weight:bold;">[X]</button></div>`; 
                }); 
                h += `<tr><td><div style="font-weight:700;">${u.fname} ${u.lname||''}</div><div>${u.idCard}</div><div>📞 ${u.tel}</div>${pH}</td><td style="text-align:right;"><button class="btn-icon btn-telebook" onclick="adminTeleBook('${u.idCard}','${u.fname}','${u.lname||''}','${u.tel}')">Book</button><br><br><button class="btn-icon btn-edit" onclick="editPatientUI('${u.idCard}','${u.fname}','${u.lname||''}','${u.tel}')"><i class="fas fa-edit"></i></button><button class="btn-icon btn-plan" onclick="openPlanModal('${u.idCard}')"><i class="fas fa-calendar-plus"></i></button><button class="btn-icon btn-delete" onclick="deletePatientConfirm('${u.idCard}')"><i class="fas fa-trash-alt"></i></button></td></tr>`; 
            }); 
            resA.innerHTML = h; 
        } 
    }
    
    function adminTeleBook(id, f, l, t) { addOrUpdateProfile(id, f, l, t, "Admin Book"); document.getElementById('adminModal').classList.remove('show'); renderMultiUserCard(); }
    function editPatientUI(id, f, l, t) { Swal.fire({ title: 'Edit', html: `<input id="sw-id" class="form-control" value="${id}" style="margin-bottom:10px;"><div style="display:flex; gap:10px; margin-bottom:10px;"><input id="sw-f" class="form-control" value="${f}"><input id="sw-l" class="form-control" value="${l}"></div><input id="sw-t" class="form-control" value="${t}">`, showCancelButton: true, customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'}, preConfirm: () => { savePatientData({oldId: id, idCard: document.getElementById('sw-id').value, fname: document.getElementById('sw-f').value, lname: document.getElementById('sw-l').value, tel: document.getElementById('sw-t').value}); } }); }
    async function savePatientData(p) { Swal.fire({title:'Saving...', customClass:{popup:'swal-3d-popup'}}); await fetch(API_ENDPOINT, { method: 'POST', body: JSON.stringify({ action: 'admin_manage_patient', pass: '11395', payload: p }) }); Swal.fire({title:'Success', icon:'success', customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'}}); adminSearch(); }
    async function deletePatientConfirm(id) { Swal.fire({ title: 'Delete?', showCancelButton: true, customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'} }).then(async (r) => { if (r.isConfirmed) { await fetch(API_ENDPOINT, { method: 'POST', body: JSON.stringify({ action: 'admin_delete_patient', pass: '11395', idCard: id }) }); adminSearch(); } }); }
    function openPlanModal(id) { Swal.fire({ title: 'Plan / Ban', html: `<select id="swal-svc" class="form-control" style="margin-bottom:10px;"><option value="ttm">TTM</option><option value="tcm">TCM</option><option value="steam">Steam</option><option value="postpartum">Postpartum</option><option value="BANNED">BAN ACCOUNT</option></select><input type="number" id="swal-days" class="form-control" placeholder="Days from now">`, showCancelButton: true, customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'}, preConfirm: () => { adminManagePlan(id, document.getElementById('swal-svc').value, document.getElementById('swal-days').value); } }); }
    async function adminManagePlan(id, svc, days) { await fetch(API_ENDPOINT, { method: 'POST', body: JSON.stringify({ action: 'admin_manage_plan', pass: '11395', idCard: id, service: svc, days: days }) }); adminSearch(); }
    
    function setAdminSort(t) { currentAdminSort = t; document.getElementById('btnSortCreated').className = (t === 'created') ? 'btn btn-confirm' : 'btn btn-cancel'; document.getElementById('btnSortAppoint').className = (t === 'appoint') ? 'btn btn-confirm' : 'btn btn-cancel'; loadAdminLogs(); }
    
    function loadAdminLogs() { 
        let a = document.getElementById('adminLogsArea'); a.innerHTML = "<tr><td colspan='4' style='text-align:center;'>Loading...</td></tr>"; 
        fetch(API_ENDPOINT, { method: 'POST', body: JSON.stringify({action: 'admin_get_logs', pass: '11395', filterDate: document.getElementById('adminLogDateFilter').value, sortType: currentAdminSort}) }).then(r => r.json()).then(d => { 
            if(d.status === 'success') { 
                let h = ''; 
                d.data.forEach(l => { 
                    let c = l.status.includes('ยกเลิก') ? '#ef4444' : '#10b981'; if(l.status.includes('เลยกำหนด')) c = '#f59e0b';
                    h += `<tr><td><div style="font-size:0.7rem;">${l.createdAt}</div></td><td><div style="font-weight:700;">${l.name}</div><div style="font-size:0.75rem;">${l.service}</div></td><td><div>${l.bookFor}</div><div style="color:${c}; font-weight:700;">${l.status}</div></td><td style="text-align:right;">${l.status==='รอรับบริการ'?`<button class="btn-icon btn-delete" onclick="adminCancelQueue('${l.idCard}','${l.sysDate}','${l.timeOnly}','${l.dept}')"><i class="fas fa-times-circle"></i></button>`:''}</td></tr>`; 
                }); 
                a.innerHTML = h; 
            } 
        }); 
    }
    
    function adminCancelQueue(id, sd, t, d) { Swal.fire({ title: 'Cancel?', html:`Ban duration:<br><select id="swal-ban-days" class="form-control" style="margin-top:10px;"><option value="0">No Ban</option><option value="2">2 Days</option><option value="5">5 Days</option></select>`, showCancelButton: true, customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'} }).then(async (r) => { if (r.isConfirmed) { await fetch(API_ENDPOINT, { method: 'POST', body: JSON.stringify({ action: 'admin_cancel_booking', pass: '11395', idCard: id, sysDate: sd, time: t, dept: d, banDays: document.getElementById('swal-ban-days').value }) }); loadAdminLogs(); } }); }
    
    function forceSyncSystem(b) { let old = b.innerHTML; b.innerHTML='Syncing...'; b.disabled = true; fetch(API_ENDPOINT + "?action=syncFirebase").then(()=>{ Swal.fire({title:'Success', customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'}}); b.innerHTML=old; b.disabled = false; }).catch(()=>{ Swal.fire({title:'Error', customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'}}); b.innerHTML=old; b.disabled=false; }); }
    
    // RESTORED CSV UPLOAD
    function updateAdminFileUI(input) {
        if(input.files.length > 0) {
            document.getElementById('adminFileName').innerText = input.files[0].name;
            document.getElementById('btnAdminUpload').disabled = false;
        }
    }
    
    function processAdminUpload() {
        const fileInp = document.getElementById('adminFileInput');
        const reader = new FileReader();
        reader.onload = async function(e) {
            Swal.fire({title: 'Uploading...', allowOutsideClick: false, didOpen: () => {Swal.showLoading();}, customClass:{popup:'swal-3d-popup'}});
            const rows = e.target.result.split('\n').slice(1);
            const payload = [];
            rows.forEach(row => {
                const cols = row.split(',');
                if(cols.length >= 4) {
                    payload.push({ visitDate: cols[0].trim(), idCard: cols[1].trim(), service: cols[2].trim(), planDays: cols[3].trim() });
                }
            });
            try {
                let res = await fetch(API_ENDPOINT, { method: 'POST', body: JSON.stringify({ action: 'admin_batch_upload', pass: '11395', payload: payload }) });
                let data = await res.json();
                if(data.status === 'success') { Swal.fire({title:'Success', text:`Uploaded ${data.count} records`, icon:'success', customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'}}); }
                else { Swal.fire({title:'Error', text:'Upload failed', icon:'error', customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'}}); }
            } catch(err) { Swal.fire({title:'Error', text:'Connection error', icon:'error', customClass:{popup:'swal-3d-popup', confirmButton:'swal-3d-btn'}}); }
        };
        reader.readAsText(fileInp.files[0]);
    }

    function viewFullImage() { let meta = document.querySelector('meta[name=viewport]'); meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'); Swal.fire({ imageUrl: 'https://img2.pic.in.th/890005e17a696c1ad92f3ab1fb121f87.png', imageAlt: 'Announce', width: '100%', background: 'transparent', padding: '0', showConfirmButton: false, showCloseButton: true, backdrop: 'rgba(0,0,0,0.95)', didOpen: () => { document.querySelector('.swal2-image').style.maxHeight = '85vh'; }, willClose: () => { meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'); }, customClass:{popup:'swal-3d-popup'} }); }
  </script>
</body>
</html>
