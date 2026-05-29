// =========================================================
// SafeSpace Safety App - Application State & Logic Management
// =========================================================

// Global Application State
let state = {
  reports: [],
  tools: [],
  toolIssues: [],
  media: [],
  systemLogs: [],
  currentUser: null,
  authenticated: false,
  currentView: 'dashboard',
  theme: 'dark',
  selectedReportId: null,
  currentAttachedFile: null // Stores { file, url, type } for current form attachment
};

// Initial Mock Data to bootstrap the application with relevant, realistic data
const MOCK_REPORTS = [
  {
    id: "HAZ-2026-001",
    type: "hazard",
    title: "Unsecured high-voltage cable in Sector B",
    location: "Sector B - Electrical Room",
    equipment: "Transformer Box 3",
    severity: "high",
    category: "electrical",
    description: "The cover plate is missing and live wires are exposed near the main breaker access point. Sparks were observed when closing doors.",
    mitigation: "Coned off area and put caution sign. Notified electricians.",
    date: "2026-05-20T10:30",
    status: "Under Review",
    reporter: "Alex Carter (Safety Engineer)",
    attachment: "svg-wire" // Mock SVG data identifier
  },
  {
    id: "HAZ-2026-002",
    type: "hazard",
    title: "Hydraulic oil leak on walkway",
    location: "Warehouse A - Row 12",
    equipment: "Forklift #3",
    severity: "medium",
    category: "physical",
    description: "Forklift #3 left a pool of hydraulic oil on the primary forklift corridor, causing slippery conditions.",
    mitigation: "Spread absorbent compound over the spill.",
    date: "2026-05-24T08:15",
    status: "Resolved",
    reporter: "Marcus Vane (Welder)",
    attachment: "svg-spill"
  },
  {
    id: "HAZ-2026-003",
    type: "hazard",
    title: "Near Miss: Forklift reversing without warning alert",
    location: "Loading Dock Area 3",
    equipment: "Forklift #14",
    severity: "high",
    category: "nearmiss",
    description: "Forklift #14 reversed out of loading bay 3 without a spotter or audible reverse sound active. Nearly collided with a pedestrian engineer.",
    mitigation: "Flagged down driver, inspected reversing alarm (fuse was blown).",
    date: "2026-05-26T14:22",
    status: "Reported",
    reporter: "Alex Carter (Safety Engineer)"
  },
  {
    id: "HAZ-2026-004",
    type: "hazard",
    title: "Excessive solvent vapors near mixing tank",
    location: "Chemical Plant Sector C",
    equipment: "Vat 4",
    severity: "critical",
    category: "chemical",
    description: "Fumes are overwhelming. The local exhaust ventilation hood appears to be malfunctioning or off.",
    mitigation: "Instructed all personnel to evacuate chemical line C. Put respirators on.",
    date: "2026-05-27T11:05",
    status: "Action Taken",
    reporter: "Sarah Jenkins (Lab Tech)",
    attachment: "svg-smoke"
  },
  {
    id: "HAZ-2026-005",
    type: "hazard",
    title: "Ergonomic risk at packing station #4",
    location: "Packing & Sorting Area",
    equipment: "Conveyor Line A",
    severity: "low",
    category: "ergonomic",
    description: "Conveyor height is too low for operators, causing repetitive strain issues and bad posture reports.",
    mitigation: "Requested safety chair adjustment assessments.",
    date: "2026-05-28T09:00",
    status: "Reported",
    reporter: "Alex Carter (Safety Engineer)"
  },
  {
    id: "INJ-2026-001",
    type: "injury",
    title: "Marcus Vane - Burn on forearm",
    person: "Marcus Vane (EM-205)",
    job: "Welder",
    location: "Fabrication Shop B",
    severity: "low",
    injuryType: "Burn/Chemical",
    lostdays: 0,
    description: "Minor spark burn on forearm due to wearing short-sleeved shirts under safety jacket. Received first aid cleaning and dressing on site.",
    treatment: "yes",
    witness: "Elena Rostova (Ext 222)",
    date: "2026-05-18T14:30",
    status: "Resolved",
    reporter: "Alex Carter (Safety Engineer)"
  },
  {
    id: "INJ-2026-002",
    type: "injury",
    title: "Daniel Craig - Foot / Ankle injury",
    person: "Daniel Craig (EM-118)",
    job: "Logistics Specialist",
    location: "Loading Dock 3",
    severity: "high",
    injuryType: "Fracture/Sprain",
    lostdays: 15,
    description: "Slipped on wet metal ramp while carrying heavy box. Suffered severe ankle sprain and hairline fracture. Transferred to medical clinic.",
    treatment: "hospital",
    witness: "Bob Vance (Ext 501)",
    date: "2026-05-22T11:15",
    status: "Action Taken",
    reporter: "Alex Carter (Safety Engineer)"
  }
];

// Initial Tools Registry
const INITIAL_TOOLS = [
  { id: "GLD-01", name: "Gas leak detector ('sniffer')", serial: "SN-GLD-9982", dept: "Emergency Response", status: "safe" },
  { id: "LDS-02", name: "Gas leak detection spray", serial: "SN-LDS-5542", dept: "Maintenance Team B", status: "safe" },
  { id: "PTG-03", name: "Pressure testing gauge", serial: "SN-PTG-1090", dept: "Distribution Line A", status: "safe" },
  { id: "EST-04", name: "Emergency shut-off tool", serial: "SN-EST-0095", dept: "Gas Valve Sector C", status: "safe" },
  { id: "SCBA-05", name: "Breathing apparatus (SCBA)", serial: "SN-SCBA-4421", dept: "Rescue Operations", status: "safe" },
  { id: "PPE-06", name: "FR clothing & PPE kit", serial: "SN-PPE-1209", dept: "Safety Services", status: "safe" },
  { id: "PCT-07", name: "Industrial pipe cutter", serial: "SN-PCT-3032", dept: "Pipework Division", status: "safe" },
  { id: "PFK-08", name: "Pipe freezing kit", serial: "SN-PFK-9901", dept: "Utility Operations", status: "warning" },
  { id: "PSC-09", name: "Pipe squeezing/clamping tool", serial: "SN-PSC-7712", dept: "Mainline Operations", status: "safe" },
  { id: "EWM-10", name: "Electrofusion welding machine", serial: "SN-EWM-3310", dept: "Fabrication Shop B", status: "safe" },
  { id: "CFT-11", name: "Crimping & fitting tool", serial: "SN-CFT-2289", dept: "Installation Team", status: "safe" },
  { id: "TRW-12", name: "Pneumatic torque wrench", serial: "SN-TRW-8812", dept: "Machinery Maintenance", status: "safe" },
  { id: "SRS-13", name: "ServiFlex SIT-3 service reliner", serial: "SN-SRS-0033", dept: "Distribution Line B", status: "safe" }
];

// Initial Tool Issues
const INITIAL_TOOL_ISSUES = [
  {
    id: "TIS-001",
    toolId: "PFK-08",
    toolName: "Pipe freezing kit",
    issue: "Nitrogen regulator valve sticking during low temperature tests.",
    priority: "medium",
    loto: false,
    date: "2026-05-25T11:00",
    status: "In Maintenance"
  }
];

// Built-in Mock SVGs represented as data-URIs
const SVG_ASSETS = {
  "svg-wire": `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%231e293b"/><path d="M 30,100 C 90,50 120,150 180,70 C 220,130 250,50 270,100" fill="none" stroke="%23f59e0b" stroke-width="4"/><circle cx="180" cy="70" r="8" fill="%23ef4444"/><text x="10" y="30" fill="%239ca3af" font-family="sans-serif" font-size="12">HAZARD LOG: LIVE WIRING</text></svg>`,
  "svg-spill": `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%231e293b"/><ellipse cx="150" cy="110" rx="90" ry="40" fill="%230f172a" stroke="%233b82f6" stroke-width="2"/><text x="10" y="30" fill="%239ca3af" font-family="sans-serif" font-size="12">SLIP RISK: CHEMICAL SPILLAGE</text></svg>`,
  "svg-smoke": `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%231e293b"/><circle cx="120" cy="110" r="40" fill="%234b5563" opacity="0.6"/><circle cx="160" cy="90" r="50" fill="%236b7280" opacity="0.7"/><circle cx="180" cy="120" r="35" fill="%234b5563" opacity="0.5"/><text x="10" y="30" fill="%239ca3af" font-family="sans-serif" font-size="12">INHALATION HAZARD: TOXIC VAPORS</text></svg>`,
  "svg-default": `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%231e293b"/><rect x="100" y="60" width="100" height="80" rx="10" fill="none" stroke="%236366f1" stroke-width="3"/><circle cx="150" cy="100" r="15" fill="%236366f1"/><text x="10" y="30" fill="%239ca3af" font-family="sans-serif" font-size="12">SAFESPACE MEDIA ATTACHMENT</text></svg>`
};

// Initial Mock Media logs
const INITIAL_MEDIA = [
  {
    id: "MED-001",
    type: "image",
    url: SVG_ASSETS["svg-wire"],
    title: "Exposed wire in electric room",
    date: "2026-05-20",
    uploader: "Alex Carter",
    reportId: "HAZ-2026-001"
  },
  {
    id: "MED-002",
    type: "image",
    url: SVG_ASSETS["svg-spill"],
    title: "Hydraulic oil leak, warehouse walkway",
    date: "2026-05-24",
    uploader: "Marcus Vane",
    reportId: "HAZ-2026-002"
  },
  {
    id: "MED-003",
    type: "image",
    url: SVG_ASSETS["svg-smoke"],
    title: "Fumes venting failure line C",
    date: "2026-05-27",
    uploader: "Sarah Jenkins",
    reportId: "HAZ-2026-004"
  }
];

// Initial System Activity Event logs
const INITIAL_SYSTEM_LOGS = [
  { type: "info", title: "SafeSpace safety engine initialized.", time: "2026-05-28T23:00" },
  { type: "success", title: "Site report HAZ-2026-001 successfully generated.", time: "2026-05-28T23:02" },
  { type: "warning", title: "LOTO Maintenance alert flagged on tool PFK-08.", time: "2026-05-28T23:05" }
];

// Reference Chart Instances for dynamic destruction/re-creation
let charts = {
  trend: null,
  category: null,
  severity: null,
  injuryType: null,
  hotspots: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadData();
  setupEventListeners();
  setupVisualPickers();
  checkAuthSession();
});

// Authentication checks
function checkAuthSession() {
  const sessionUser = sessionStorage.getItem('safespace-auth-user');
  if (sessionUser) {
    try {
      const user = JSON.parse(sessionUser);
      state.authenticated = true;
      state.currentUser = user;
      
      // Update layouts
      document.getElementById('login-gate').style.display = 'none';
      document.getElementById('app-sidebar').style.display = 'flex';
      document.getElementById('app-main-wrapper').style.display = 'flex';
      
      updateAuthUIElements();
      renderApp();
      navigateTo('dashboard');
    } catch (e) {
      sessionStorage.removeItem('safespace-auth-user');
      showLoginGate();
    }
  } else {
    showLoginGate();
  }
}

function showLoginGate() {
  state.authenticated = false;
  state.currentUser = null;
  document.getElementById('login-gate').style.display = 'flex';
  document.getElementById('app-sidebar').style.display = 'none';
  document.getElementById('app-main-wrapper').style.display = 'none';
}

function updateAuthUIElements() {
  if (!state.currentUser) return;
  const user = state.currentUser;
  
  // Sidebar profiles
  const avatar = user.role === 'Company Admin' ? 'AD' : 'EC';
  document.getElementById('sidebar-user-avatar').innerText = avatar;
  document.getElementById('sidebar-user-name').innerText = user.name;
  document.getElementById('sidebar-user-role').innerText = user.role;
  
  // Header access badge
  const badge = document.getElementById('header-user-badge');
  badge.innerText = `Auth: ${user.role}`;
  if (user.role === 'Company Admin') {
    badge.style.backgroundColor = 'var(--danger-glow)';
    badge.style.color = 'var(--danger)';
    
    // Show full database administration zone
    document.getElementById('hub-admin-actions-box').style.display = 'block';
  } else {
    badge.style.backgroundColor = 'var(--primary-glow)';
    badge.style.color = 'var(--primary)';
    
    // Hide data hub factory resets for engineers
    document.getElementById('hub-admin-actions-box').style.display = 'none';
  }
  
  // Update dashboard welcome banner text
  document.getElementById('dashboard-welcome-heading').innerText = `Welcome back, ${user.name.split(' ')[0]}`;
}

// Theme Setup
function initTheme() {
  const savedTheme = localStorage.getItem('safespace-theme') || 'dark';
  state.theme = savedTheme;
  const body = document.body;
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
    themeIcon.className = 'fa-solid fa-sun';
    themeText.innerText = 'Dark Mode';
  } else {
    body.classList.remove('light-theme');
    themeIcon.className = 'fa-solid fa-moon';
    themeText.innerText = 'Light Mode';
  }
}

function toggleTheme() {
  const body = document.body;
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  
  if (body.classList.contains('light-theme')) {
    body.classList.remove('light-theme');
    themeIcon.className = 'fa-solid fa-moon';
    themeText.innerText = 'Light Mode';
    state.theme = 'dark';
  } else {
    body.classList.add('light-theme');
    themeIcon.className = 'fa-solid fa-sun';
    themeText.innerText = 'Dark Mode';
    state.theme = 'light';
  }
  localStorage.setItem('safespace-theme', state.theme);
  
  // Re-render charts to match new theme background colors if needed
  updateCharts();
}

// Data Store Setup
function loadData() {
  // Reports
  const localData = localStorage.getItem('safespace-reports');
  if (localData) {
    try { state.reports = JSON.parse(localData); } catch (e) { state.reports = [...MOCK_REPORTS]; }
  } else {
    state.reports = [...MOCK_REPORTS];
    saveData();
  }

  // Tools
  const localTools = localStorage.getItem('safespace-tools-v2');
  if (localTools) {
    try { state.tools = JSON.parse(localTools); } catch (e) { state.tools = [...INITIAL_TOOLS]; }
  } else {
    state.tools = [...INITIAL_TOOLS];
    localStorage.setItem('safespace-tools-v2', JSON.stringify(state.tools));
  }

  // Tool Issues
  const localToolIssues = localStorage.getItem('safespace-tool-issues-v2');
  if (localToolIssues) {
    try { state.toolIssues = JSON.parse(localToolIssues); } catch (e) { state.toolIssues = [...INITIAL_TOOL_ISSUES]; }
  } else {
    state.toolIssues = [...INITIAL_TOOL_ISSUES];
    localStorage.setItem('safespace-tool-issues-v2', JSON.stringify(state.toolIssues));
  }

  // Media
  const localMedia = localStorage.getItem('safespace-media');
  if (localMedia) {
    try { state.media = JSON.parse(localMedia); } catch (e) { state.media = [...INITIAL_MEDIA]; }
  } else {
    state.media = [...INITIAL_MEDIA];
    localStorage.setItem('safespace-media', JSON.stringify(state.media));
  }

  // System Event Logs
  const localLogs = localStorage.getItem('safespace-system-logs');
  if (localLogs) {
    try { state.systemLogs = JSON.parse(localLogs); } catch (e) { state.systemLogs = [...INITIAL_SYSTEM_LOGS]; }
  } else {
    state.systemLogs = [...INITIAL_SYSTEM_LOGS];
    localStorage.setItem('safespace-system-logs', JSON.stringify(state.systemLogs));
  }
}

function saveData() {
  localStorage.setItem('safespace-reports', JSON.stringify(state.reports));
  localStorage.setItem('safespace-tools-v2', JSON.stringify(state.tools));
  localStorage.setItem('safespace-tool-issues-v2', JSON.stringify(state.toolIssues));
  localStorage.setItem('safespace-media', JSON.stringify(state.media));
  localStorage.setItem('safespace-system-logs', JSON.stringify(state.systemLogs));
}

// System Logs Trigger
function addSystemLog(title, type = 'info') {
  const newLog = {
    type: type,
    title: title,
    time: new Date().toISOString()
  };
  state.systemLogs.unshift(newLog);
  // Keep logs at max 50 items
  if (state.systemLogs.length > 50) state.systemLogs.pop();
  saveData();
}

// Router
function navigateTo(viewId) {
  state.currentView = viewId;
  
  // Update sidebar links UI
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const activeNav = document.getElementById(`nav-${viewId}`);
  if (activeNav) {
    activeNav.classList.add('active');
  }
  
  // Hide all sections, display the active one
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });
  
  const activeView = document.getElementById(`view-${viewId}`);
  if (activeView) {
    activeView.classList.add('active');
  }
  
  // Update Headers
  const headerTitle = document.getElementById('page-header-title');
  const headerSubtitle = document.getElementById('page-header-subtitle');
  
  switch(viewId) {
    case 'dashboard':
      headerTitle.innerText = 'Safety Dashboard';
      headerSubtitle.innerText = 'Real-time site indicators and quick reports';
      break;
    case 'report-hazard':
      headerTitle.innerText = 'Hazard & Near Miss Logging';
      headerSubtitle.innerText = 'Capture site risks immediately to mitigate danger';
      break;
    case 'report-injury':
      headerTitle.innerText = 'Injury Logging';
      headerSubtitle.innerText = 'Register OSHA compliance safety cases for personnel';
      break;
    case 'tool-safety':
      headerTitle.innerText = 'Tool Safety & Lockouts';
      headerSubtitle.innerText = 'Inspect heavy equipment and manage LOTO safety tags';
      break;
    case 'media-gallery':
      headerTitle.innerText = 'Media Gallery';
      headerSubtitle.innerText = 'Inspection evidence log and incident media folder';
      break;
    case 'admin-logs':
      headerTitle.innerText = 'Incident Logs & Tracking';
      headerSubtitle.innerText = 'Review, investigate and update safety records';
      break;
    case 'analytics':
      headerTitle.innerText = 'Analytics & Insights';
      headerSubtitle.innerText = 'Granular charts representing historical trends';
      break;
    case 'data-hub':
      headerTitle.innerText = 'Company Data Hub';
      headerSubtitle.innerText = 'Consolidated safety directories, master exports and sync centers';
      break;
  }
  
  // Refresh contents of active page
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Event Listeners
function setupEventListeners() {
  // Sidebar navigation click
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.id !== 'nav-logout') {
      item.addEventListener('click', () => {
        const target = item.getAttribute('data-target');
        navigateTo(target);
      });
    }
  });

  // Logout Binds
  document.getElementById('nav-logout').addEventListener('click', handleLogout);
  
  // Theme Toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  
  // Forms Submit
  document.getElementById('hazard-report-form').addEventListener('submit', handleHazardSubmit);
  document.getElementById('injury-report-form').addEventListener('submit', handleInjurySubmit);
  document.getElementById('tool-issue-form').addEventListener('submit', handleToolIssueSubmit);
  
  // Search & Filters in Admin Logs
  document.getElementById('log-search').addEventListener('input', renderLogsTable);
  document.getElementById('filter-type').addEventListener('change', renderLogsTable);
  document.getElementById('filter-severity').addEventListener('change', renderLogsTable);
  document.getElementById('filter-status').addEventListener('change', renderLogsTable);
  
  // CSV Export
  document.getElementById('export-logs-btn').addEventListener('click', exportToCSV);
  
  // Modals Close
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('detail-modal').addEventListener('click', (e) => {
    if (e.target.id === 'detail-modal') closeModal();
  });
  
  // Modal Update Status Action
  document.getElementById('modal-update-status-btn').addEventListener('click', updateReportStatus);

  // Lightbox Close
  document.getElementById('lightbox-close-btn').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-modal').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox-modal') closeLightbox();
  });

  // Media Gallery Filters
  document.getElementById('btn-media-filter-all').addEventListener('click', (e) => toggleMediaFilter('all', e.target));
  document.getElementById('btn-media-filter-photo').addEventListener('click', (e) => toggleMediaFilter('image', e.target));
  document.getElementById('btn-media-filter-video').addEventListener('click', (e) => toggleMediaFilter('video', e.target));

  // File Upload Handlers (Hazard Form)
  const fileInput = document.getElementById('hazard-file-input');
  const fileZone = document.getElementById('hazard-file-zone');
  
  fileZone.addEventListener('click', (e) => {
    if (e.target.id !== 'hazard-file-input') fileInput.click();
  });

  fileZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileZone.style.borderColor = 'var(--primary)';
  });

  fileZone.addEventListener('dragleave', () => {
    fileZone.style.borderColor = 'var(--border-color)';
  });

  fileZone.addEventListener('drop', (e) => {
    e.preventDefault();
    fileZone.style.borderColor = 'var(--border-color)';
    if (e.dataTransfer.files.length) handleFileSelection(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) handleFileSelection(e.target.files[0]);
  });

  // Direct Gallery Media Upload
  const directUploadInput = document.getElementById('direct-media-upload');
  directUploadInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      const isVideo = file.type.startsWith('video/');
      const fileUrl = URL.createObjectURL(file);
      
      const newMedia = {
        id: `MED-${Date.now()}`,
        type: isVideo ? 'video' : 'image',
        url: fileUrl,
        title: file.name,
        date: new Date().toISOString().split('T')[0],
        uploader: state.currentUser ? state.currentUser.name : 'Engineer'
      };
      
      state.media.push(newMedia);
      addSystemLog(`Uploaded file "${file.name}" directly to safety gallery.`, 'success');
      saveData();
      showToast('Media uploaded to gallery successfully!', 'success');
      
      if (state.currentView === 'media-gallery') {
        renderMediaGallery('all');
      }
    }
  });

  // Auth Card presets quick click autofill
  document.getElementById('preset-engineer').addEventListener('click', (e) => fillCredentials('engineer@safespace.com', 'password', e));
  document.getElementById('preset-admin').addEventListener('click', (e) => fillCredentials('admin@safespace.com', 'admin123', e));
  document.getElementById('login-form').addEventListener('submit', handleLoginSubmit);

  // Central Data Operations Hub
  document.getElementById('hub-export-csv').addEventListener('click', exportToCSV);
  document.getElementById('hub-export-json').addEventListener('click', exportJSONDatabase);
  document.getElementById('hub-sync-btn').addEventListener('click', triggerCloudSyncSimulation);
  document.getElementById('hub-reset-db-btn').addEventListener('click', triggerFactoryReset);
}

// Credentials Auto Fill Binds
function fillCredentials(email, pass, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  document.getElementById('login-email').value = email;
  document.getElementById('login-password').value = pass;
}

// Authentication Logic
function handleLoginSubmit(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value.toLowerCase().trim();
  
  let userDetails = {
    email: email,
    name: 'Alex Carter',
    role: 'Site Engineer'
  };

  if (email === 'admin@safespace.com') {
    userDetails.name = 'Safety Supervisor';
    userDetails.role = 'Company Admin';
  } else if (email === 'engineer@safespace.com') {
    userDetails.name = 'Alex Carter';
    userDetails.role = 'Site Engineer';
  } else {
    // Basic dynamic fallback name
    userDetails.name = email.split('@')[0].toUpperCase();
    userDetails.role = 'Site Engineer';
  }

  // Save auth state
  state.authenticated = true;
  state.currentUser = userDetails;
  sessionStorage.setItem('safespace-auth-user', JSON.stringify(userDetails));

  // Visual Transitions
  document.getElementById('login-gate').style.display = 'none';
  document.getElementById('app-sidebar').style.display = 'flex';
  document.getElementById('app-main-wrapper').style.display = 'flex';

  updateAuthUIElements();
  addSystemLog(`User ${userDetails.name} (${userDetails.role}) signed in.`, 'info');
  showToast(`Access granted. Welcome to SafeSpace, ${userDetails.name.split(' ')[0]}!`, 'success');
  
  // Direct back to home
  renderApp();
  navigateTo('dashboard');
}

function handleLogout() {
  addSystemLog(`User signed out. Session destroyed.`, 'info');
  sessionStorage.removeItem('safespace-auth-user');
  
  // Clear forms values
  document.getElementById('login-form').reset();
  
  showLoginGate();
  showToast('Signed out of session successfully.', 'info');
}

// Handle Real File Selection for Forms
function handleFileSelection(file) {
  const previewBox = document.getElementById('hazard-file-preview-box');
  previewBox.innerHTML = '';
  
  const isVideo = file.type.startsWith('video/');
  const fileUrl = URL.createObjectURL(file);
  
  state.currentAttachedFile = {
    file: file,
    url: fileUrl,
    type: isVideo ? 'video' : 'image'
  };
  
  if (isVideo) {
    previewBox.innerHTML = `
      <video class="preview-video-element" src="${fileUrl}" muted autoplay loop></video>
      <button type="button" class="file-remove-btn" onclick="removeAttachedFile(event)">&times;</button>
    `;
  } else {
    previewBox.innerHTML = `
      <img class="preview-image-element" src="${fileUrl}" alt="Preview">
      <button type="button" class="file-remove-btn" onclick="removeAttachedFile(event)">&times;</button>
    `;
  }
  
  previewBox.style.display = 'flex';
  showToast('File attached successfully. Preview loaded.', 'success');
}

function removeAttachedFile(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  state.currentAttachedFile = null;
  document.getElementById('hazard-file-input').value = '';
  document.getElementById('hazard-file-preview-box').style.display = 'none';
  document.getElementById('hazard-file-preview-box').innerHTML = '';
  showToast('Attachment removed', 'info');
}

// Custom Card Pickers Logic for Forms (Severe UX Improvement)
function setupVisualPickers() {
  // Hazard Severity
  const hazardSeverityCards = document.querySelectorAll('.visual-picker-card.severity-picker');
  hazardSeverityCards.forEach(card => {
    card.addEventListener('click', () => {
      hazardSeverityCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      document.getElementById('hazard-severity').value = card.getAttribute('data-severity');
    });
  });

  // Hazard Category
  const hazardCategoryCards = document.querySelectorAll('.visual-picker-card.category-picker');
  hazardCategoryCards.forEach(card => {
    card.addEventListener('click', () => {
      hazardCategoryCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      document.getElementById('hazard-category').value = card.getAttribute('data-category');
    });
  });

  // Injury Severity
  const injurySeverityCards = document.querySelectorAll('.visual-picker-card.injury-severity-picker');
  injurySeverityCards.forEach(card => {
    card.addEventListener('click', () => {
      injurySeverityCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      document.getElementById('injury-severity').value = card.getAttribute('data-severity');
    });
  });
}

// Rendering Flow
function renderApp() {
  updateHeaderStats();
  
  if (state.currentView === 'dashboard') {
    renderDashboardMetrics();
    renderRecentFeed();
    updateCharts();
  } else if (state.currentView === 'tool-safety') {
    renderToolRegistry();
    renderToolLogsTable();
  } else if (state.currentView === 'media-gallery') {
    renderMediaGallery('all');
  } else if (state.currentView === 'admin-logs') {
    renderLogsTable();
  } else if (state.currentView === 'analytics') {
    updateCharts();
  } else if (state.currentView === 'data-hub') {
    renderCompanyDataHub();
  }
}

// Update alerts & headers
function updateHeaderStats() {
  const activeHazardsCount = state.reports.filter(r => r.type === 'hazard' && r.status !== 'Resolved' && (r.severity === 'high' || r.severity === 'critical')).length;
  const alertPill = document.getElementById('active-hazards-alert');
  const alertText = document.getElementById('alert-text');
  
  if (activeHazardsCount > 0) {
    alertText.innerText = `${activeHazardsCount} Critical/High Risk Active`;
    alertPill.style.display = 'flex';
  } else {
    alertPill.style.display = 'none';
  }
}

// Dashboard metrics cards rendering
function renderDashboardMetrics() {
  const activeHazards = state.reports.filter(r => r.type === 'hazard' && r.status !== 'Resolved').length;
  const openInjuries = state.reports.filter(r => r.type === 'injury' && r.status !== 'Resolved').length;
  const resolvedCount = state.reports.filter(r => r.status === 'Resolved').length;
  const lotoCount = state.tools.filter(t => t.status === 'loto').length;
  
  // Calculate basic safety score
  const totalReports = state.reports.length;
  const resolved = state.reports.filter(r => r.status === 'Resolved').length;
  const safetyScore = totalReports > 0 ? Math.round((resolved / totalReports) * 100) : 100;
  
  document.getElementById('metric-active-hazards').innerText = activeHazards;
  document.getElementById('metric-open-injuries').innerText = openInjuries;
  const safetyScoreEl = document.getElementById('metric-safety-score');
  if (safetyScoreEl) {
    safetyScoreEl.innerText = `${safetyScore}%`;
  }
  document.getElementById('metric-resolved').innerText = resolvedCount;
  document.getElementById('metric-loto-tools').innerText = lotoCount;
  
  // LOTO tag trend highlight
  document.getElementById('loto-trend').innerHTML = lotoCount > 0 
    ? `<i class="fa-solid fa-triangle-exclamation"></i> ${lotoCount} machines out of service`
    : `<i class="fa-solid fa-circle-check" style="color: var(--success);"></i> All machinery operating safe`;
  document.getElementById('loto-trend').style.color = lotoCount > 0 ? "var(--danger)" : "var(--success)";

  // Customize trends indicator dynamic details
  document.getElementById('hazard-trend').innerHTML = activeHazards > 4 
    ? `<i class="fa-solid fa-arrow-up"></i> Alert: increase in logs` 
    : `<i class="fa-solid fa-arrow-down"></i> Within safety thresholds`;
  document.getElementById('hazard-trend').className = activeHazards > 4 ? "metric-trend trend-down" : "metric-trend trend-up";
}

// Recent Activity Feed in dashboard
function renderRecentFeed() {
  const container = document.getElementById('recent-activity-feed');
  container.innerHTML = '';
  
  const sortedReports = [...state.reports].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  
  if (sortedReports.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted);">No reports logged.</div>`;
    return;
  }
  
  sortedReports.forEach(report => {
    const isHazard = report.type === 'hazard';
    const isNearMiss = isHazard && report.category === 'nearmiss';
    const severityText = report.severity.charAt(0).toUpperCase() + report.severity.slice(1);
    const dateFormatted = new Date(report.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    const feedItem = document.createElement('div');
    feedItem.className = 'activity-item';
    feedItem.style.cursor = 'pointer';
    feedItem.onclick = () => openReportDetails(report.id);
    
    feedItem.innerHTML = `
      <div class="severity-bar ${report.severity}"></div>
      <div class="activity-details">
        <div class="activity-meta">
          <span>${isNearMiss ? '✨ Near Miss' : isHazard ? '⚠️ Hazard' : '🩹 Injury Log'}</span>
          <span>${dateFormatted}</span>
        </div>
        <div class="activity-title">${isHazard ? report.title : report.person}</div>
        <div class="activity-desc">${report.description}</div>
        <div class="activity-footer">
          <span class="badge badge-${report.severity}">${severityText}</span>
          <span class="badge badge-status badge-${getStatusClass(report.status)}">${report.status}</span>
        </div>
      </div>
    `;
    container.appendChild(feedItem);
  });
}

// Logs Table (Admin View) Rendering
function renderLogsTable() {
  const tbody = document.getElementById('logs-table-body');
  tbody.innerHTML = '';
  
  const searchQuery = document.getElementById('log-search').value.toLowerCase().trim();
  const typeFilter = document.getElementById('filter-type').value;
  const severityFilter = document.getElementById('filter-severity').value;
  const statusFilter = document.getElementById('filter-status').value;
  
  let filtered = state.reports.filter(report => {
    const matchesSearch = 
      (report.title && report.title.toLowerCase().includes(searchQuery)) ||
      (report.person && report.person.toLowerCase().includes(searchQuery)) ||
      (report.location && report.location.toLowerCase().includes(searchQuery)) ||
      (report.description && report.description.toLowerCase().includes(searchQuery)) ||
      (report.id && report.id.toLowerCase().includes(searchQuery));
      
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesSeverity = severityFilter === 'all' || report.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });
  
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 32px; color: var(--text-muted);">No records found. Adjust your filters or log a new report.</td></tr>`;
    return;
  }
  
  filtered.forEach(report => {
    const isHazard = report.type === 'hazard';
    const isNearMiss = isHazard && report.category === 'nearmiss';
    
    let icon = '<i class="fa-solid fa-triangle-exclamation" style="color: var(--warning);"></i>';
    if (isNearMiss) {
      icon = '<i class="fa-solid fa-person-falling-burst" style="color: #6366f1;"></i>';
    } else if (report.type === 'injury') {
      icon = '<i class="fa-solid fa-user-injured" style="color: var(--danger);"></i>';
    }
    
    const displayTitle = isHazard ? report.title : `Injury: ${report.person}`;
    const displayMeta = isHazard ? `Cat: ${report.category}` : `Type: ${report.injuryType}`;
    const dateFormatted = new Date(report.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    rowTypeLabel = isNearMiss ? 'Near Miss' : isHazard ? 'Hazard' : 'Injury';
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="text-align:center;">
        <span style="font-size: 18px;" title="${rowTypeLabel}">${icon}</span>
      </td>
      <td>
        <div style="font-weight: 600; color: var(--text-main);">${displayTitle}</div>
        <div style="font-size: 11px; color: var(--text-muted);">${displayMeta} (${report.id})</div>
      </td>
      <td>${report.location}</td>
      <td>${dateFormatted}</td>
      <td>
        <span class="badge badge-${report.severity}">${report.severity}</span>
      </td>
      <td>
        <span class="badge badge-status badge-${getStatusClass(report.status)}">${report.status}</span>
      </td>
      <td>
        <div class="actions-cell">
          <button class="action-btn" onclick="openReportDetails('${report.id}')">
            <i class="fa-solid fa-eye"></i> View
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function getStatusClass(status) {
  switch (status) {
    case 'Reported': return 'reported';
    case 'Under Review': return 'review';
    case 'Action Taken': return 'action';
    case 'Resolved': return 'resolved';
    default: return 'reported';
  }
}

// Handlers for Form Submissions
function handleHazardSubmit(e) {
  e.preventDefault();
  
  const title = document.getElementById('hazard-title').value.trim();
  const location = document.getElementById('hazard-location').value.trim();
  const equipment = document.getElementById('hazard-equipment').value.trim();
  const severity = document.getElementById('hazard-severity').value;
  const category = document.getElementById('hazard-category').value;
  const description = document.getElementById('hazard-description').value.trim();
  const mitigation = document.getElementById('hazard-mitigation').value.trim();
  
  const isNearMiss = category === 'nearmiss';
  const prefix = isNearMiss ? 'NMR' : 'HAZ';
  const reportId = `${prefix}-2026-${String(state.reports.length + 1).padStart(3, '0')}`;
  
  let attachmentUrl = null;
  if (state.currentAttachedFile) {
    attachmentUrl = state.currentAttachedFile.url;
    
    // Register to media gallery
    const newMedia = {
      id: `MED-${Date.now()}`,
      type: state.currentAttachedFile.type,
      url: attachmentUrl,
      title: title,
      date: new Date().toISOString().split('T')[0],
      uploader: state.currentUser ? state.currentUser.name : 'Engineer',
      reportId: reportId
    };
    state.media.push(newMedia);
  }
  
  const newHazard = {
    id: reportId,
    type: 'hazard',
    title,
    location,
    equipment: equipment || 'N/A',
    severity,
    category,
    description,
    mitigation: mitigation || 'None pending inspection',
    date: new Date().toISOString().slice(0, 16),
    status: 'Reported',
    reporter: state.currentUser ? state.currentUser.name : 'Alex Carter',
    attachment: attachmentUrl
  };
  
  state.reports.push(newHazard);
  addSystemLog(`Hazard report ${reportId} filed by ${newHazard.reporter}.`, 'success');
  saveData();
  
  // Show notification
  const notifyText = isNearMiss 
    ? 'Near Miss reported. Analysis logged for prevention.'
    : 'Hazard logged and safety alert distributed!';
  showToast(notifyText, 'success');
  
  // Reset form & states
  document.getElementById('hazard-report-form').reset();
  removeAttachedFile();
  
  // Redirect
  navigateTo('dashboard');
}

function handleInjurySubmit(e) {
  e.preventDefault();
  
  const person = document.getElementById('injury-person').value.trim();
  const job = document.getElementById('injury-job').value.trim();
  const datetime = document.getElementById('injury-datetime').value;
  const location = document.getElementById('injury-location').value.trim();
  const severity = document.getElementById('injury-severity').value;
  const type = document.getElementById('injury-type').value;
  const lostdays = parseInt(document.getElementById('injury-lostdays').value) || 0;
  const description = document.getElementById('injury-description').value.trim();
  const treatmentSelect = document.getElementById('injury-treatment').value;
  const witness = document.getElementById('injury-witness').value.trim();
  
  let treatmentText = 'First aid on site';
  if (treatmentSelect === 'no') treatmentText = 'Self-treated / No medical care';
  if (treatmentSelect === 'hospital') treatmentText = 'Transferred to Emergency ER';
  
  const injuryId = `INJ-2026-${String(state.reports.length + 1).padStart(3, '0')}`;
  const newInjury = {
    id: injuryId,
    type: 'injury',
    title: `${person} - ${type}`,
    person,
    job,
    location,
    severity,
    injuryType: type,
    lostdays,
    description,
    treatment: treatmentText,
    witness: witness || 'None listed',
    date: datetime,
    status: 'Reported',
    reporter: state.currentUser ? state.currentUser.name : 'Alex Carter'
  };
  
  state.reports.push(newInjury);
  addSystemLog(`OSHA compliance injury record ${injuryId} filed for ${person}.`, 'danger');
  saveData();
  
  // Show notification
  showToast('Injury record filed. Regulatory administrators notified.', 'danger');
  document.getElementById('injury-report-form').reset();
  navigateTo('dashboard');
}

// Modal View Details
function openReportDetails(reportId) {
  const report = state.reports.find(r => r.id === reportId);
  if (!report) return;
  
  state.selectedReportId = reportId;
  
  // Populate general modal fields
  document.getElementById('modal-detail-id').innerText = report.id;
  
  const isNearMiss = report.type === 'hazard' && report.category === 'nearmiss';
  document.getElementById('modal-detail-type').innerText = isNearMiss ? 'NEAR MISS' : report.type.toUpperCase();
  document.getElementById('modal-detail-location').innerText = report.location;
  document.getElementById('modal-detail-date').innerText = new Date(report.date).toLocaleString();
  document.getElementById('modal-detail-reporter').innerText = report.reporter || 'System';
  
  // Format Severity badge in modal
  const severityVal = document.getElementById('modal-detail-severity');
  severityVal.className = `badge badge-${report.severity}`;
  severityVal.innerText = report.severity.toUpperCase();
  
  // Set title & body content based on type
  if (report.type === 'hazard') {
    const titlePrefix = isNearMiss ? 'Near Miss: ' : 'Hazard: ';
    document.getElementById('modal-title-text').innerText = `${titlePrefix}${report.title}`;
    document.getElementById('modal-label-description').innerText = isNearMiss ? 'Near Miss Description' : 'Description of Hazard / Threat';
    document.getElementById('modal-detail-description').innerText = report.description;
    
    document.getElementById('modal-mitigation-group').style.display = 'block';
    document.getElementById('modal-detail-mitigation').innerText = report.mitigation || 'No mitigations entered yet.';
  } else {
    document.getElementById('modal-title-text').innerText = `Personnel Injury: ${report.person}`;
    document.getElementById('modal-label-description').innerText = 'Incident Occurrence Details';
    document.getElementById('modal-detail-description').innerText = `${report.description}\n\nEmployee Job: ${report.job}\nWitnesses: ${report.witness}`;
    
    document.getElementById('modal-mitigation-group').style.display = 'block';
    document.getElementById('modal-detail-mitigation').innerText = `Treatment: ${report.treatment}\nDays Lost: ${report.lostdays} days`;
  }

  // Handle Attachment Preview Rendering inside Modal
  const attachmentGroup = document.getElementById('modal-attachment-group');
  const attachmentContent = document.getElementById('modal-detail-attachment');
  
  if (report.attachment) {
    attachmentContent.innerHTML = '';
    
    let isVideoUrl = report.attachment.includes('blob:') && state.media.find(m => m.url === report.attachment && m.type === 'video');
    
    let resolvedUrl = report.attachment;
    if (SVG_ASSETS[report.attachment]) {
      resolvedUrl = SVG_ASSETS[report.attachment];
    }

    if (isVideoUrl) {
      attachmentContent.innerHTML = `<video class="preview-video-element" src="${resolvedUrl}" controls style="width: 100%; max-height:220px;"></video>`;
    } else {
      attachmentContent.innerHTML = `<img class="preview-image-element" src="${resolvedUrl}" alt="Attachment Evidence" style="width: 100%; max-height:220px; object-fit:contain; cursor:pointer;" onclick="openLightbox('${resolvedUrl}', false)">`;
    }
    attachmentGroup.style.display = 'block';
  } else {
    attachmentGroup.style.display = 'none';
  }
  
  // Role Authorization checks inside report modal
  const adminBlock = document.getElementById('modal-admin-actions-block');
  const engWarning = document.getElementById('modal-engineer-warning-block');
  
  if (state.currentUser && state.currentUser.role === 'Company Admin') {
    adminBlock.style.display = 'block';
    engWarning.style.display = 'none';
    
    // Set Admin select menu to current report status
    document.getElementById('modal-admin-status-select').value = report.status;
  } else {
    adminBlock.style.display = 'none';
    engWarning.style.display = 'block';
  }
  
  // Update timeline stepper visuals
  updateTimelineStepper(report.status);
  
  // Show Modal overlay
  document.getElementById('detail-modal').classList.add('active');
}

function updateTimelineStepper(status) {
  const steps = ['Reported', 'Under Review', 'Action Taken', 'Resolved'];
  const currentStepIndex = steps.indexOf(status);
  
  const stepIds = {
    'Reported': 'timeline-step-reported',
    'Under Review': 'timeline-step-review',
    'Action Taken': 'timeline-step-action',
    'Resolved': 'timeline-step-resolved'
  };
  
  steps.forEach((step, idx) => {
    const stepEl = document.getElementById(stepIds[step]);
    if (!stepEl) return;
    
    stepEl.classList.remove('active', 'completed');
    if (idx < currentStepIndex) {
      stepEl.classList.add('completed');
    } else if (idx === currentStepIndex) {
      stepEl.classList.add('active');
    }
  });
}

function updateReportStatus() {
  if (!state.selectedReportId) return;
  if (state.currentUser.role !== 'Company Admin') {
    showToast('Permission denied. Admin credentials required.', 'danger');
    return;
  }
  
  const selectVal = document.getElementById('modal-admin-status-select').value;
  const reportIndex = state.reports.findIndex(r => r.id === state.selectedReportId);
  
  if (reportIndex !== -1) {
    state.reports[reportIndex].status = selectVal;
    
    if (selectVal === 'Resolved' && state.reports[reportIndex].type === 'hazard') {
      state.reports[reportIndex].mitigation = (state.reports[reportIndex].mitigation || '') + `\n[RESOLVED on ${new Date().toLocaleDateString()} by Safety Board]`;
    }
    
    addSystemLog(`Admin modified report status of ${state.selectedReportId} to ${selectVal}.`, 'info');
    saveData();
    updateTimelineStepper(selectVal);
    renderApp();
    showToast(`Status updated successfully to: ${selectVal}`, 'info');
    closeModal();
  }
}

function closeModal() {
  document.getElementById('detail-modal').classList.remove('active');
  state.selectedReportId = null;
}

// Toast System
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'danger') icon = 'fa-circle-xmark';
  
  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}

// CSV Export Utility
function exportToCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "ID,Type,Title/Person,Location,Date,Severity,Status,Reporter,Details\n";
  
  state.reports.forEach(r => {
    const isHazard = r.type === 'hazard';
    const detailTitle = isHazard ? r.title : r.person;
    const details = isHazard ? r.description : `${r.description} (Treatment: ${r.treatment})`;
    
    const row = [
      r.id,
      r.type,
      `"${detailTitle.replace(/"/g, '""')}"`,
      `"${r.location.replace(/"/g, '""')}"`,
      r.date,
      r.severity,
      r.status,
      `"${(r.reporter || '').replace(/"/g, '""')}"`,
      `"${details.replace(/"/g, '""').substring(0, 150)}..."`
    ].join(",");
    
    csvContent += row + "\n";
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `safespace_incident_log_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  
  link.click();
  document.body.removeChild(link);
  
  addSystemLog(`Exported complete incident records to CSV format.`, 'info');
  showToast("CSV Exported successfully!", "success");
}

// Charts Management
function updateCharts() {
  const hasDashboardChart = document.getElementById('dashboardTrendChart') !== null;
  if (!hasDashboardChart) return;

  const isLight = document.body.classList.contains('light-theme');
  const textLabelColor = isLight ? '#0f172a' : '#9ca3af';
  const gridLineColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)';

  const labels = ['Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26'];
  
  let hazardCounts = [3, 4, 2, 5, 8, 0];
  let injuryCounts = [1, 2, 0, 1, 3, 0];
  
  state.reports.forEach(r => {
    if (r.type === 'hazard') {
      hazardCounts[5]++; // Active month
    } else {
      injuryCounts[5]++;
    }
  });

  // Chart 1: Dashboard Line Chart
  if (charts.trend) charts.trend.destroy();
  const ctxTrend = document.getElementById('dashboardTrendChart').getContext('2d');
  charts.trend = new Chart(ctxTrend, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Hazards & Near Misses',
          data: hazardCounts,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderWidth: 3,
          tension: 0.35,
          fill: true
        },
        {
          label: 'Personnel Injuries',
          data: injuryCounts,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          borderWidth: 3,
          tension: 0.35,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: textLabelColor, font: { family: 'Inter', size: 12 } } }
      },
      scales: {
        x: { grid: { color: gridLineColor }, ticks: { color: textLabelColor } },
        y: { grid: { color: gridLineColor }, ticks: { color: textLabelColor, stepSize: 1 } }
      }
    }
  });

  const hasAnalyticsCharts = document.getElementById('hazardCategoryChart') !== null;
  if (!hasAnalyticsCharts) return;

  // Chart 2: Hazard & Near Miss Categories (Doughnut)
  let categories = { nearmiss: 0, physical: 0, electrical: 0, chemical: 0, ergonomic: 0, mechanical: 0, other: 0 };
  state.reports.filter(r => r.type === 'hazard').forEach(r => {
    if (categories[r.category] !== undefined) categories[r.category]++;
  });

  if (charts.category) charts.category.destroy();
  const ctxCategory = document.getElementById('hazardCategoryChart').getContext('2d');
  charts.category = new Chart(ctxCategory, {
    type: 'doughnut',
    data: {
      labels: ['Near Miss', 'Physical/Slip', 'Electrical', 'Chemical/Gas', 'Ergonomic', 'Mechanical', 'Others'],
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ['#6366f1', '#3b82f6', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6', '#6b7280'],
        borderWidth: isLight ? 2 : 0,
        borderColor: isLight ? '#ffffff' : 'transparent'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: textLabelColor, font: { family: 'Inter', size: 11 } } }
      }
    }
  });

  // Chart 3: Severity Breakdown (Pie)
  let severities = { low: 0, medium: 0, high: 0, critical: 0 };
  state.reports.forEach(r => {
    if (severities[r.severity] !== undefined) severities[r.severity]++;
  });

  if (charts.severity) charts.severity.destroy();
  const ctxSeverity = document.getElementById('severityBreakdownChart').getContext('2d');
  charts.severity = new Chart(ctxSeverity, {
    type: 'pie',
    data: {
      labels: ['Low Risk / First Aid', 'Medium Risk', 'High Risk / LTI', 'Critical Risk / Fatality'],
      datasets: [{
        data: Object.values(severities),
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#d946ef'],
        borderWidth: isLight ? 2 : 0,
        borderColor: isLight ? '#ffffff' : 'transparent'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: textLabelColor, font: { family: 'Inter', size: 11 } } }
      }
    }
  });

  // Chart 4: Injury Classification Breakdown (Bar)
  let injuryTypes = { 'Laceration/Cut': 0, 'Burn/Chemical': 0, 'Fracture/Sprain': 0, 'Contusion/Bruise': 0, 'Inhalation/Respiratory': 0, 'Eye Injury': 0, 'Other': 0 };
  state.reports.filter(r => r.type === 'injury').forEach(r => {
    if (injuryTypes[r.injuryType] !== undefined) injuryTypes[r.injuryType]++;
  });

  if (charts.injuryType) charts.injuryType.destroy();
  const ctxInjury = document.getElementById('injuryTypeChart').getContext('2d');
  charts.injuryType = new Chart(ctxInjury, {
    type: 'bar',
    data: {
      labels: Object.keys(injuryTypes),
      datasets: [{
        label: 'Injuries logged',
        data: Object.values(injuryTypes),
        backgroundColor: '#ef4444',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: textLabelColor } },
        y: { grid: { color: gridLineColor }, ticks: { color: textLabelColor, stepSize: 1 } }
      }
    }
  });

  // Chart 5: Hotspots
  let hotspotCounts = {};
  state.reports.forEach(r => {
    let area = 'Other Area';
    const loc = r.location.toLowerCase();
    if (loc.includes('sector b') || loc.includes('fabrication')) area = 'Sector B (Fabrication)';
    else if (loc.includes('warehouse a') || loc.includes('packing')) area = 'Warehouse A / Packing';
    else if (loc.includes('loading') || loc.includes('dock')) area = 'Loading Bays';
    else if (loc.includes('chemical') || loc.includes('labs')) area = 'Chemical Line & Labs';
    
    hotspotCounts[area] = (hotspotCounts[area] || 0) + 1;
  });

  if (charts.hotspots) charts.hotspots.destroy();
  const ctxHotspot = document.getElementById('hotspotLocationsChart').getContext('2d');
  charts.hotspots = new Chart(ctxHotspot, {
    type: 'bar',
    data: {
      labels: Object.keys(hotspotCounts),
      datasets: [{
        label: 'Incidents/Hazards Counts',
        data: Object.values(hotspotCounts),
        backgroundColor: '#8b5cf6',
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: gridLineColor }, ticks: { color: textLabelColor, stepSize: 1 } },
        y: { grid: { display: false }, ticks: { color: textLabelColor } }
      }
    }
  });
}

// 1. Tool Safety & LOTO Registry
function renderToolRegistry() {
  const grid = document.getElementById('tool-registry-grid');
  const dropdown = document.getElementById('tool-select');
  
  grid.innerHTML = '';
  dropdown.innerHTML = '<option value="" disabled selected>Select tool...</option>';

  state.tools.forEach(tool => {
    const card = document.createElement('div');
    const isLoto = tool.status === 'loto';
    card.className = `tool-card ${isLoto ? 'loto-active' : ''}`;
    
    let statusText = 'SAFE & COMPLIANT';
    if (tool.status === 'warning') statusText = 'NEEDS INSPECTION';
    if (tool.status === 'loto') statusText = 'LOCKED OUT (LOTO)';

    card.innerHTML = `
      ${isLoto ? '<div class="loto-tag-label">LOTO Active</div>' : ''}
      <div class="tool-card-header">
        <span class="tool-status-dot ${tool.status}"></span>
        <span style="font-size:11px; font-weight:600; text-transform:uppercase; color: var(--text-muted);">${tool.id}</span>
      </div>
      <div>
        <div class="tool-name-title">${tool.name}</div>
        <div class="tool-serial-no">${tool.serial}</div>
      </div>
      <div class="tool-card-footer">
        <span style="color:var(--text-muted);"><i class="fa-solid fa-map-pin"></i> ${tool.dept}</span>
        <span style="font-weight:700; color: ${tool.status === 'loto' ? 'var(--danger)' : tool.status === 'warning' ? 'var(--warning)' : 'var(--success)'}">${statusText}</span>
      </div>
    `;
    grid.appendChild(card);

    const opt = document.createElement('option');
    opt.value = tool.id;
    opt.innerText = `${tool.name} (${tool.id})`;
    dropdown.appendChild(opt);
  });
}

function handleToolIssueSubmit(e) {
  e.preventDefault();
  
  const toolId = document.getElementById('tool-select').value;
  const issue = document.getElementById('tool-issue-title').value.trim();
  const priority = document.getElementById('tool-priority').value;
  const lotoChecked = document.getElementById('tool-loto').checked;
  const desc = document.getElementById('tool-issue-desc').value.trim();
  
  const selectedTool = state.tools.find(t => t.id === toolId);
  if (!selectedTool) return;

  if (lotoChecked) {
    selectedTool.status = 'loto';
  } else {
    selectedTool.status = 'warning';
  }

  const issueId = `TIS-${String(state.toolIssues.length + 1).padStart(3, '0')}`;
  const newIssue = {
    id: issueId,
    toolId: selectedTool.id,
    toolName: selectedTool.name,
    issue: issue,
    priority: priority,
    loto: lotoChecked,
    date: new Date().toISOString(),
    status: 'In Maintenance',
    description: desc
  };

  state.toolIssues.push(newIssue);
  addSystemLog(`Tool Issue ${issueId} reported on ${selectedTool.id}. LOTO state: ${lotoChecked}.`, lotoChecked ? 'danger' : 'warning');
  saveData();
  
  showToast(`Tool ${selectedTool.id} flagged. LOTO safety protocol initialized.`, lotoChecked ? 'danger' : 'warning');
  document.getElementById('tool-issue-form').reset();
  renderApp();
}

function renderToolLogsTable() {
  const tbody = document.getElementById('tool-logs-table-body');
  tbody.innerHTML = '';

  if (state.toolIssues.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 16px;">No maintenance logs.</td></tr>`;
    return;
  }

  const sortedIssues = [...state.toolIssues].sort((a,b) => new Date(b.date) - new Date(a.date));

  sortedIssues.forEach(item => {
    const row = document.createElement('tr');
    const dateFormatted = new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    // Auth role block inside tools list action
    let actionMarkup = '';
    if (item.status !== 'Resolved') {
      if (state.currentUser && state.currentUser.role === 'Company Admin') {
        actionMarkup = `<button class="action-btn" onclick="resolveToolIssue('${item.id}')"><i class="fa-solid fa-check"></i> Complete Repair</button>`;
      } else {
        actionMarkup = `<span style="font-size:11px; color: var(--text-muted); font-weight:600;"><i class="fa-solid fa-lock"></i> LOTO Admin Locked</span>`;
      }
    } else {
      actionMarkup = `<span style="font-size:11px; color: var(--success); font-weight:600;">Fixed ✓</span>`;
    }

    row.innerHTML = `
      <td style="text-align:center;">
        ${item.loto ? '<i class="fa-solid fa-lock" style="color: var(--danger);" title="Lockout active"></i>' : '<i class="fa-solid fa-check" style="color: var(--success);" title="No lockout"></i>'}
      </td>
      <td>
        <div style="font-weight:600;">${item.toolName}</div>
        <div style="font-size:11px; color:var(--text-muted);">${item.toolId} (${item.id})</div>
      </td>
      <td>${item.issue}</td>
      <td>
        <span class="badge badge-${item.priority === 'high' ? 'high' : item.priority === 'medium' ? 'medium' : 'low'}">${item.priority}</span>
      </td>
      <td>${dateFormatted}</td>
      <td>
        <span class="badge badge-status badge-${item.status === 'Resolved' ? 'resolved' : 'review'}">${item.status}</span>
      </td>
      <td>
        ${actionMarkup}
      </td>
    `;
    tbody.appendChild(row);
  });
}

function resolveToolIssue(issueId) {
  if (state.currentUser.role !== 'Company Admin') {
    showToast('Permission denied. LOTO overrides require Administrator permissions.', 'danger');
    return;
  }
  
  const issue = state.toolIssues.find(i => i.id === issueId);
  if (!issue) return;

  issue.status = 'Resolved';
  
  const otherActive = state.toolIssues.some(i => i.toolId === issue.toolId && i.id !== issueId && i.status !== 'Resolved');
  if (!otherActive) {
    const tool = state.tools.find(t => t.id === issue.toolId);
    if (tool) tool.status = 'safe';
  }

  addSystemLog(`Tool Issue ${issueId} resolved. Lockout tags removed.`, 'success');
  saveData();
  showToast(`Maintenance complete. Machinery ${issue.toolId} cleared for service.`, 'success');
  renderApp();
}

// 2. Media Gallery Functions
let activeMediaFilter = 'all';

function toggleMediaFilter(filter, buttonElement) {
  activeMediaFilter = filter;
  
  document.querySelectorAll('#view-media-gallery .admin-toolbar button').forEach(btn => {
    if (btn.id !== 'direct-media-upload') btn.classList.remove('active');
  });
  if (buttonElement) buttonElement.classList.add('active');

  renderMediaGallery(filter);
}

function renderMediaGallery(filter = 'all') {
  const container = document.getElementById('media-grid-container');
  container.innerHTML = '';

  let filtered = state.media;
  if (filter !== 'all') {
    filtered = state.media.filter(m => m.type === filter);
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: span 10; text-align:center; padding: 48px; color: var(--text-muted);">No photos or videos logged in gallery.</div>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'media-card';
    card.onclick = () => openLightbox(item.url, item.type === 'video');

    let previewContent = '';
    let resolvedUrl = item.url;
    if (SVG_ASSETS[item.url]) {
      resolvedUrl = SVG_ASSETS[item.url];
    }

    if (item.type === 'video') {
      previewContent = `
        <video class="media-thumbnail" src="${resolvedUrl}" muted></video>
        <div class="video-play-overlay"><i class="fa-solid fa-play"></i></div>
      `;
    } else {
      previewContent = `<img class="media-thumbnail" src="${resolvedUrl}" alt="Evidence">`;
    }

    card.innerHTML = `
      <div class="media-thumbnail-wrapper">
        ${previewContent}
      </div>
      <div class="media-info-overlay">
        <div class="media-title-text">${item.title}</div>
        <div class="media-meta-text">
          <span>By: ${item.uploader}</span>
          <span>${item.date}</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Fullscreen Lightbox Modal Controls
function openLightbox(mediaUrl, isVideo = false) {
  const overlay = document.getElementById('lightbox-modal');
  const content = document.getElementById('lightbox-content');
  content.innerHTML = '';

  let resolvedUrl = mediaUrl;
  if (SVG_ASSETS[mediaUrl]) {
    resolvedUrl = SVG_ASSETS[mediaUrl];
  }

  if (isVideo) {
    content.innerHTML = `<video src="${resolvedUrl}" controls autoplay style="max-width: 100%; max-height: 75vh; outline:none;"></video>`;
  } else {
    content.innerHTML = `<img src="${resolvedUrl}" alt="Expanded View" style="max-width: 100%; max-height: 75vh; object-fit:contain;">`;
  }

  overlay.classList.add('active');
}

function closeLightbox() {
  const overlay = document.getElementById('lightbox-modal');
  const content = document.getElementById('lightbox-content');
  
  const video = content.querySelector('video');
  if (video) video.pause();
  
  overlay.classList.remove('active');
  content.innerHTML = '';
}

// ==========================================
// 3. Company Data Hub Module
// ==========================================

function renderCompanyDataHub() {
  // Metric tally counts
  document.getElementById('hub-metric-total-records').innerText = state.reports.length;
  document.getElementById('hub-metric-faulty-tools').innerText = state.tools.filter(t => t.status !== 'safe').length;
  document.getElementById('hub-metric-media-count').innerText = state.media.length;
  
  // Render System Activity Feed
  const feed = document.getElementById('data-hub-activity-logs');
  feed.innerHTML = '';
  
  if (state.systemLogs.length === 0) {
    feed.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">No activity logs available.</div>`;
    return;
  }
  
  state.systemLogs.forEach(log => {
    const el = document.createElement('div');
    el.className = 'hub-log-item';
    
    let icon = 'fa-info';
    let statusClass = 'info';
    if (log.type === 'success') { icon = 'fa-check'; statusClass = 'success'; }
    if (log.type === 'warning') { icon = 'fa-triangle-exclamation'; statusClass = 'warning'; }
    if (log.type === 'danger') { icon = 'fa-lock'; statusClass = 'danger'; }
    
    const timeFormatted = new Date(log.time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    
    el.innerHTML = `
      <div class="hub-log-icon ${statusClass}"><i class="fa-solid ${icon}"></i></div>
      <div style="flex: 1;">
        <div style="font-weight: 600; color: var(--text-main);">${log.title}</div>
        <div style="font-size: 10px; color: var(--text-muted); margin-top:2px;">Event Registered at ${timeFormatted}</div>
      </div>
    `;
    feed.appendChild(el);
  });
}

// Master Database Exporter (JSON Packet)
function exportJSONDatabase() {
  const dataPacket = {
    exportDate: new Date().toISOString(),
    exporter: state.currentUser ? state.currentUser.name : 'Unknown',
    databaseVersion: 'SafeSpace v2.0',
    data: {
      reports: state.reports,
      tools: state.tools,
      toolIssues: state.toolIssues,
      media: state.media,
      logs: state.systemLogs
    }
  };
  
  const blob = new Blob([JSON.stringify(dataPacket, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `safespace_master_db_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  
  link.click();
  document.body.removeChild(link);
  
  addSystemLog(`Master JSON Database backup successfully downloaded by ${dataPacket.exporter}.`, 'success');
  showToast("Master database backup downloaded successfully!", "success");
  renderApp();
}

// Sync Simulation Engine
function triggerCloudSyncSimulation() {
  const syncBtn = document.getElementById('hub-sync-btn');
  const pill = document.getElementById('sync-status-pill');
  const lastTime = document.getElementById('sync-last-time');
  const progressBox = document.getElementById('sync-progress-container');
  const progressPercent = document.getElementById('sync-progress-percent');
  const progressBar = document.getElementById('sync-progress-bar');
  const progressText = document.getElementById('sync-progress-text');
  
  // Disable button
  syncBtn.disabled = true;
  progressBox.style.display = 'block';
  
  pill.style.backgroundColor = 'var(--warning-glow)';
  pill.style.color = 'var(--warning)';
  pill.innerText = '● SYNCING DATABASE...';
  
  let percentage = 0;
  const interval = setInterval(() => {
    percentage += 5;
    progressPercent.innerText = `${percentage}%`;
    progressBar.style.width = `${percentage}%`;
    
    if (percentage === 30) progressText.innerText = "Encrypting incident reports database...";
    if (percentage === 60) progressText.innerText = "Uploading media assets logs...";
    if (percentage === 85) progressText.innerText = "Running data validation checks...";
    
    if (percentage >= 100) {
      clearInterval(interval);
      
      // Complete state updates
      progressBox.style.display = 'none';
      syncBtn.disabled = false;
      
      pill.style.backgroundColor = 'var(--success-glow)';
      pill.style.color = 'var(--success)';
      pill.innerText = '● DATABASE SYNCED';
      
      const currentTime = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      lastTime.innerText = `Last cloud sync: Today at ${currentTime}`;
      
      addSystemLog(`Cloud backup completed. All records synced to backup.safespace.com.`, 'success');
      showToast("Master Safety Database successfully synced with Cloud Backup!", "success");
      renderApp();
    }
  }, 100);
}

// Database Factory Reset Controls
function triggerFactoryReset() {
  if (state.currentUser.role !== 'Company Admin') {
    showToast('Factory resets require Supervisor Admin clearance.', 'danger');
    return;
  }
  
  const confirmFirst = confirm("🚨 WARNING: This action will erase all reported hazards, injuries, media files and customized logs, returning SafeSpace to factory presets. Are you sure you wish to continue?");
  if (confirmFirst) {
    const confirmSecond = confirm("🚨 FINAL CONFIRMATION: This action is completely permanent and cannot be undone. Restructure and erase database?");
    if (confirmSecond) {
      // Clear localStorage parameters
      localStorage.removeItem('safespace-reports');
      localStorage.removeItem('safespace-tools-v2');
      localStorage.removeItem('safespace-tool-issues-v2');
      localStorage.removeItem('safespace-media');
      localStorage.removeItem('safespace-system-logs');
      
      // Load standard defaults
      loadData();
      addSystemLog("Master safety database factory reset completed.", "danger");
      showToast("SafeSpace database successfully restored to factory defaults.", "success");
      
      navigateTo('dashboard');
    }
  }
}
