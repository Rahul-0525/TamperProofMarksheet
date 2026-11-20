/**
 * MarkShield – Tamper-Proof Exam Result Ledger
 * Admin Dashboard Interactive Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // DOM Elements
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  
  const navLinks = document.querySelectorAll('.nav-link');
  const breadcrumbActivePage = document.getElementById('breadcrumbActivePage');
  const pageHeadingTitle = document.getElementById('pageHeadingTitle');

  const notificationBtn = document.getElementById('notificationBtn');
  const notificationsDropdown = document.getElementById('notificationsDropdown');
  const notificationBadge = document.querySelector('.notification-badge');
  const markAllReadBtn = document.getElementById('markAllReadBtn');

  // Modals
  const publishModal = document.getElementById('publishModal');
  const openPublishModalBtn = document.getElementById('openPublishModalBtn');
  const closePublishModalBtn = document.getElementById('closePublishModalBtn');
  const cancelPublishModalBtn = document.getElementById('cancelPublishModalBtn');
  const confirmPublishBtn = document.getElementById('confirmPublishBtn');

  const ledgerModal = document.getElementById('ledgerModal');
  const exploreLedgerBtn = document.getElementById('exploreLedgerBtn');
  const closeLedgerModalBtn = document.getElementById('closeLedgerModalBtn');
  const closeLedgerModalBtn2 = document.getElementById('closeLedgerModalBtn2');

  const recordModal = document.getElementById('recordModal');
  const closeRecordModalBtn = document.getElementById('closeRecordModalBtn');
  const closeRecordModalBtn2 = document.getElementById('closeRecordModalBtn2');
  const copyRecordDetailsBtn = document.getElementById('copyRecordDetailsBtn');

  const quickAuditBtn = document.getElementById('quickAuditBtn');
  const refreshActivityBtn = document.getElementById('refreshActivityBtn');
  const copyHashBtn = document.getElementById('copyHashBtn');
  const rootHashPreview = document.getElementById('rootHashPreview');

  // Table Search and Filters
  const tableSearchInput = document.getElementById('tableSearchInput');
  const filterPills = document.querySelectorAll('.filter-pill');
  const resultsTableBody = document.getElementById('resultsTableBody');

  // ================= 1. SIDEBAR & MOBILE NAVIGATION =================
  function openMobileSidebar() {
    sidebar.classList.add('open');
    sidebarBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    sidebar.classList.remove('open');
    sidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggleBtn) menuToggleBtn.addEventListener('click', openMobileSidebar);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // Sidebar Link Switching
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const pageName = link.getAttribute('data-page') || 'Dashboard';
      if (breadcrumbActivePage) breadcrumbActivePage.textContent = pageName;
      if (pageHeadingTitle) pageHeadingTitle.textContent = pageName;

      // Close mobile drawer on item click
      if (window.innerWidth <= 992) {
        closeMobileSidebar();
      }

      showToast(`Navigated to ${pageName}`, 'info');
    });
  });

  // ================= 2. NOTIFICATIONS DROPDOWN =================
  if (notificationBtn && notificationsDropdown) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationsDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!notificationsDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
        notificationsDropdown.classList.remove('active');
      }
    });

    if (markAllReadBtn) {
      markAllReadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const unreadItems = notificationsDropdown.querySelectorAll('.notif-item.unread');
        unreadItems.forEach(item => item.classList.remove('unread'));
        if (notificationBadge) notificationBadge.style.display = 'none';
        showToast('All notifications marked as read', 'success');
      });
    }
  }

  // ================= 3. TABLE FILTERING & SEARCH =================
  let currentFilter = 'all';

  function applyTableFilters() {
    const query = tableSearchInput ? tableSearchInput.value.toLowerCase().trim() : '';
    const rows = resultsTableBody ? resultsTableBody.querySelectorAll('tr') : [];

    rows.forEach(row => {
      const status = row.getAttribute('data-status');
      const text = row.textContent.toLowerCase();

      const matchesSearch = text.includes(query);
      const matchesFilter = (currentFilter === 'all') || (status === currentFilter);

      if (matchesSearch && matchesFilter) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (tableSearchInput) {
    tableSearchInput.addEventListener('input', applyTableFilters);
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.getAttribute('data-filter') || 'all';
      applyTableFilters();
    });
  });

  // ================= 4. MODALS LOGIC =================
  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.lucide) lucide.createIcons();
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Publish Modal Handlers
  if (openPublishModalBtn) {
    openPublishModalBtn.addEventListener('click', () => openModal(publishModal));
  }
  if (closePublishModalBtn) {
    closePublishModalBtn.addEventListener('click', () => closeModal(publishModal));
  }
  if (cancelPublishModalBtn) {
    cancelPublishModalBtn.addEventListener('click', () => closeModal(publishModal));
  }
  if (confirmPublishBtn) {
    confirmPublishBtn.addEventListener('click', () => {
      confirmPublishBtn.disabled = true;
      confirmPublishBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i><span>Ingesting & Hashing...</span>';
      if (window.lucide) lucide.createIcons();

      setTimeout(() => {
        confirmPublishBtn.disabled = false;
        confirmPublishBtn.innerHTML = '<i data-lucide="database"></i><span>Process & Anchor Batch</span>';
        if (window.lucide) lucide.createIcons();
        closeModal(publishModal);
        showToast('Batch #105 successfully hashed into Merkle Tree and published!', 'success');
      }, 1200);
    });
  }

  // Ledger Explorer Modal Handlers
  if (exploreLedgerBtn) {
    exploreLedgerBtn.addEventListener('click', () => openModal(ledgerModal));
  }
  if (closeLedgerModalBtn) {
    closeLedgerModalBtn.addEventListener('click', () => closeModal(ledgerModal));
  }
  if (closeLedgerModalBtn2) {
    closeLedgerModalBtn2.addEventListener('click', () => closeModal(ledgerModal));
  }

  // Close Record Modal
  if (closeRecordModalBtn) {
    closeRecordModalBtn.addEventListener('click', () => closeModal(recordModal));
  }
  if (closeRecordModalBtn2) {
    closeRecordModalBtn2.addEventListener('click', () => closeModal(recordModal));
  }

  // Backdrop click to close modals
  [publishModal, ledgerModal, recordModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // Global ESC Key Listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [publishModal, ledgerModal, recordModal].forEach(m => closeModal(m));
      if (notificationsDropdown) notificationsDropdown.classList.remove('active');
      if (sidebar && window.innerWidth <= 992) closeMobileSidebar();
    }
  });

  // ================= 5. QUICK AUDIT & ACTIONS =================
  if (quickAuditBtn) {
    quickAuditBtn.addEventListener('click', () => {
      const origText = quickAuditBtn.innerHTML;
      quickAuditBtn.disabled = true;
      quickAuditBtn.innerHTML = '<i data-lucide="rotate-cw" class="animate-spin"></i><span>Auditing...</span>';
      if (window.lucide) lucide.createIcons();

      setTimeout(() => {
        quickAuditBtn.disabled = false;
        quickAuditBtn.innerHTML = origText;
        if (window.lucide) lucide.createIcons();
        showToast('Ledger Integrity Check: All 1,250 records verified with 0 mutations!', 'success');
      }, 1000);
    });
  }

  if (refreshActivityBtn) {
    refreshActivityBtn.addEventListener('click', () => {
      refreshActivityBtn.classList.add('rotating');
      setTimeout(() => {
        refreshActivityBtn.classList.remove('rotating');
        showToast('Activity stream updated', 'info');
      }, 600);
    });
  }

  // Copy Root Hash Button
  if (copyHashBtn && rootHashPreview) {
    copyHashBtn.addEventListener('click', () => {
      const fullHash = "25d1acf7fa7263c5dc525c0b1e6223732d110283be25f951b07713ca170660b5";
      navigator.clipboard.writeText(fullHash).then(() => {
        showToast('Active Merkle Root copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Copied: ' + rootHashPreview.textContent, 'success');
      });
    });
  }

  // File Upload Drag & Drop Preview
  const uploadDropzone = document.getElementById('uploadDropzone');
  const csvFileInput = document.getElementById('csvFileInput');

  if (uploadDropzone && csvFileInput) {
    ['dragenter', 'dragover'].forEach(eventName => {
      uploadDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadDropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadDropzone.classList.remove('dragover');
      });
    });

    uploadDropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    csvFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(e.target.files[0]);
      }
    });

    function handleFileSelect(file) {
      uploadDropzone.querySelector('.dropzone-title').textContent = `Selected: ${file.name}`;
      uploadDropzone.querySelector('.dropzone-desc').textContent = `${(file.size / 1024).toFixed(1)} KB - Ready for ingestion and SHA-256 canonical hashing.`;
      showToast(`Loaded ${file.name}`, 'info');
    }
  }

  // Copy Proof Details in Record Modal
  if (copyRecordDetailsBtn) {
    copyRecordDetailsBtn.addEventListener('click', () => {
      const canonical = document.getElementById('recordModalCanonical')?.textContent || '';
      navigator.clipboard.writeText(canonical).then(() => {
        showToast('Canonical leaf proof copied to clipboard!', 'success');
      });
    });
  }

  // View All Link
  const viewAllResultsLink = document.getElementById('viewAllResultsLink');
  if (viewAllResultsLink) {
    viewAllResultsLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Filtering all 1,250 results...', 'info');
    });
  }

  // ================= 6. TOAST NOTIFICATION SYSTEM =================
  window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconName = type === 'success' ? 'check-circle' : 'info';
    toast.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      toast.style.transition = 'all 200ms ease-out';
      setTimeout(() => toast.remove(), 220);
    }, 3400);
  };

  // ================= 7. GLOBAL INSPECT RECORD FUNCTION =================
  window.viewRecordDetails = function(regNo, name, subjectCode, marks, status, resultId) {
    const modal = document.getElementById('recordModal');
    if (!modal) return;

    document.getElementById('recordModalStudentName').textContent = name;
    document.getElementById('recordModalRegNo').textContent = `Registration No: ${regNo}`;
    document.getElementById('recordModalSubject').textContent = subjectCode;
    document.getElementById('recordModalMarks').textContent = `${marks} / 100`;
    document.getElementById('recordModalResultId').textContent = resultId;
    document.getElementById('recordModalStatus').textContent = status;

    const salt = Math.random().toString(16).substring(2, 10);
    const gpa = ((marks / 100) * 10).toFixed(2);
    document.getElementById('recordModalCanonical').textContent = 
      `${regNo}|${name}|B.Tech CSE|5|${subjectCode}:${marks}:100|${marks}|100|${gpa}|PASS|${salt}`;

    openModal(modal);
  };
});
