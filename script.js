// PDF Viewer Script
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// State Management
const state = {
    pdfDoc: null,
    currentPage: 1,
    totalPages: 0,
    zoom: 1,
    currentChapter: 0,
    chaptersRead: parseInt(localStorage.getItem('chaptersRead')) || 0,
    chapters: [
        { id: 1, title: 'Chapter 1: शुरुआत', url: 'https://drive.google.com/uc?export=download&id=YOUR_PDF_ID_1' },
        { id: 2, title: 'Chapter 2: प्रशिक्षण', url: 'https://drive.google.com/uc?export=download&id=YOUR_PDF_ID_2' },
        { id: 3, title: 'Chapter 3: शक्तिशाली संघर्ष', url: 'https://drive.google.com/uc?export=download&id=YOUR_PDF_ID_3' },
        // Add more chapters here
    ]
};

// DOM Elements
const elements = {
    pdfContainer: document.getElementById('pdf-container'),
    pageInput: document.getElementById('pageInput'),
    totalPages: document.getElementById('totalPages'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    zoomIn: document.getElementById('zoomIn'),
    zoomOut: document.getElementById('zoomOut'),
    chaptersList: document.getElementById('chaptersList'),
    searchInput: document.getElementById('searchInput'),
    themeToggle: document.getElementById('themeToggle'),
    menuToggle: document.getElementById('menuToggle'),
    closeSidebar: document.getElementById('closeSidebar'),
    sidebar: document.querySelector('.sidebar'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    shortlinkModal: document.getElementById('shortlinkModal'),
    shortlinkInput: document.getElementById('shortlinkInput'),
    copyBtn: document.getElementById('copyBtn'),
    verifyBtn: document.getElementById('verifyBtn'),
    closeModal: document.getElementById('closeModal')
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Load theme preference
    loadTheme();
    
    // Render chapters list
    renderChaptersList();
    
    // Load first chapter
    if (state.chapters.length > 0) {
        loadChapter(0);
    }
    
    // Event listeners
    setupEventListeners();
    
    // Check if paywall should show
    checkPaywall();
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    elements.prevBtn.addEventListener('click', previousPage);
    elements.nextBtn.addEventListener('click', nextPage);
    elements.zoomIn.addEventListener('click', () => zoomPDF(1.2));
    elements.zoomOut.addEventListener('click', () => zoomPDF(0.8));
    
    // Page input
    elements.pageInput.addEventListener('change', (e) => {
        const page = parseInt(e.target.value);
        if (page > 0 && page <= state.totalPages) {
            renderPage(page);
        }
    });
    
    // Search
    elements.searchInput.addEventListener('input', filterChapters);
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Menu
    elements.menuToggle.addEventListener('click', openSidebar);
    elements.closeSidebar.addEventListener('click', closeSidebar);
    
    // Modal
    elements.closeModal.addEventListener('click', closeModal);
    elements.copyBtn.addEventListener('click', copyToClipboard);
    elements.verifyBtn.addEventListener('click', verifyPaywall);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

// Chapter Management
function renderChaptersList() {
    elements.chaptersList.innerHTML = '';
    state.chapters.forEach((chapter, index) => {
        const div = document.createElement('div');
        div.className = 'chapter-item' + (index === state.currentChapter ? ' active' : '');
        div.textContent = chapter.title;
        div.addEventListener('click', () => loadChapter(index));
        elements.chaptersList.appendChild(div);
    });
}

function loadChapter(index) {
    state.currentChapter = index;
    const chapter = state.chapters[index];
    
    showLoading(true);
    elements.pdfContainer.innerHTML = '';
    
    pdfjsLib.getDocument(chapter.url).promise.then(pdf => {
        state.pdfDoc = pdf;
        state.currentPage = 1;
        state.totalPages = pdf.numPages;
        
        elements.totalPages.textContent = state.totalPages;
        renderPage(1);
        showLoading(false);
        
        // Update active chapter
        updateActiveChapter();
        closeSidebar();
    }).catch(error => {
        console.error('Error loading PDF:', error);
        elements.pdfContainer.innerHTML = '<p>Error loading PDF. Please try again.</p>';
        showLoading(false);
    });
}

function updateActiveChapter() {
    document.querySelectorAll('.chapter-item').forEach((item, index) => {
        item.classList.toggle('active', index === state.currentChapter);
    });
}

function filterChapters(e) {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.chapter-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'block' : 'none';
    });
}

// PDF Rendering
function renderPage(pageNum) {
    if (!state.pdfDoc || pageNum < 1 || pageNum > state.totalPages) {
        return;
    }
    
    state.currentPage = pageNum;
    elements.pageInput.value = pageNum;
    
    state.pdfDoc.getPage(pageNum).then(page => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 * state.zoom });
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        
        page.render(renderContext).promise.then(() => {
            elements.pdfContainer.innerHTML = '';
            elements.pdfContainer.appendChild(canvas);
            updateButtonStates();
        });
    });
}

function previousPage() {
    if (state.currentPage > 1) {
        renderPage(state.currentPage - 1);
    }
}

function nextPage() {
    if (state.currentPage < state.totalPages) {
        state.chaptersRead++;
        localStorage.setItem('chaptersRead', state.chaptersRead);
        renderPage(state.currentPage + 1);
        checkPaywall();
    }
}

function zoomPDF(factor) {
    state.zoom *= factor;
    state.zoom = Math.max(0.5, Math.min(3, state.zoom)); // Limit zoom between 0.5x and 3x
    renderPage(state.currentPage);
}

function updateButtonStates() {
    elements.prevBtn.disabled = state.currentPage === 1;
    elements.nextBtn.disabled = state.currentPage === state.totalPages;
}

// Theme Management
function toggleTheme() {
    const isDark = document.body.classList.contains('light-theme');
    if (isDark) {
        document.body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
        elements.themeToggle.textContent = '🌙 Dark';
    } else {
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
        elements.themeToggle.textContent = '☀️ Light';
    }
}

function loadTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        elements.themeToggle.textContent = '☀️ Light';
    }
}

// Sidebar Management
function openSidebar() {
    elements.sidebar.classList.add('open');
}

function closeSidebar() {
    elements.sidebar.classList.remove('open');
}

// Paywall System
function checkPaywall() {
    if (state.chaptersRead >= CONFIG.CHAPTERS_PER_PAYWALL) {
        showPaywall();
    }
}

function showPaywall() {
    const currentPageURL = window.location.href;
    const fullURL = `${currentPageURL}?chapter=${state.currentChapter}&page=${state.currentPage}`;
    
    shortenURL(fullURL).then(shortURL => {
        elements.shortlinkInput.value = shortURL;
        openModal();
    });
}

function openModal() {
    elements.shortlinkModal.classList.remove('hidden');
    elements.shortlinkModal.classList.add('show');
}

function closeModal() {
    elements.shortlinkModal.classList.add('hidden');
    elements.shortlinkModal.classList.remove('show');
}

function copyToClipboard() {
    elements.shortlinkInput.select();
    document.execCommand('copy');
    elements.copyBtn.textContent = '✓ Copied!';
    setTimeout(() => {
        elements.copyBtn.textContent = '📋 Copy';
    }, 2000);
}

function verifyPaywall() {
    const shortURL = elements.shortlinkInput.value;
    verifyLink(shortURL).then(isValid => {
        if (isValid) {
            state.chaptersRead = 0;
            localStorage.setItem('chaptersRead', 0);
            closeModal();
            alert('✓ Verification successful! Continue reading...');
        } else {
            alert('✗ Link verification failed. Please try again.');
        }
    });
}

// Utility Functions
function showLoading(show) {
    if (show) {
        elements.loadingIndicator.classList.add('active');
    } else {
        elements.loadingIndicator.classList.remove('active');
    }
}

function handleKeyboard(e) {
    if (e.key === 'ArrowLeft') previousPage();
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'Escape') closeSidebar();
}

// Print version info
console.log('Hashira Hindi Sub Manga - PDF Reader v1.0');
console.log('Powered by PDF.js and Arollinks');
