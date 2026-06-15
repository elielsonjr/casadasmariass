// Safe localStorage wrapper to prevent exceptions under sandboxed/restricted browser environments
const safeLocalStorage = {
    _data: {},
    getItem(key) {
        try {
            return window.localStorage.getItem(key);
        } catch (e) {
            return this._data[key] || null;
        }
    },
    setItem(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch (e) {
            this._data[key] = String(value);
        }
    },
    removeItem(key) {
        try {
            window.localStorage.removeItem(key);
        } catch (e) {
            delete this._data[key];
        }
    }
};
const localStorage = safeLocalStorage;

// --- 1. Database Persistence Layer (LocalStorage CRUD) ---
const LOCAL_STORAGE_KEY = 'marias_privee_companions';

const DEFAULT_COMPANIONS = [
    {
        id: 'sophia-1',
        name: 'Sophia Smith',
        age: 23,
        hair: 'Loiro',
        eyes: 'Verdes',
        rateQuick: 250,
        rateHalf: 350,
        rateHour: 450,
        whatsapp: '5575982897249',
        badge: 'VIP',
        availability: 'disponivel',
        image: 'assets/model_sophia.png',
        storyVideo: 'assets/video.mp4',
        gallery: ['assets/model_sophia.png'],
        services: ['Jantar de Negócios', 'Viagens Nacionais/Internacionais', 'Massagem Terapêutica', 'Festas Privadas', 'Companhia Executiva'],
        description: 'Sophia é formada em Relações Públicas, fala inglês fluente e possui uma presença extremamente refinada. Ideal para acompanhá-lo em jantares de gala, eventos corporativos ou uma noite de conversa inteligente com excelente vinho. Seu charme e sofisticação tornam qualquer ocasião memorável.',
        order: 1
    },
    {
        id: 'valentina-2',
        name: 'Valentina Rossi',
        age: 25,
        hair: 'Morena',
        eyes: 'Castanhos',
        rateQuick: 200,
        rateHalf: 300,
        rateHour: 400,
        whatsapp: '5575982897249',
        badge: 'Destaque',
        availability: 'disponivel',
        image: 'assets/model_valentina.png',
        storyVideo: 'assets/casa.mp4',
        gallery: ['assets/model_valentina.png'],
        services: ['Alta Gastronomia', 'Eventos Sociais', 'Fetiche Básico', 'Dança Privada', 'Massagem Relaxante'],
        description: 'Valentina é uma mulher de traços marcantes e sorriso contagiante. Apaixonada por gastronomia e vinhos finos, ela é a companhia perfeita para quem busca tanto elegância social quanto momentos intensos de cumplicidade e descontração. Extremamente carismática e atenta aos detalhes.',
        order: 2
    },
    {
        id: 'gabriela-3',
        name: 'Gabriela Vasconcelos',
        age: 22,
        hair: 'Ruivo',
        eyes: 'Azuis',
        rateQuick: 300,
        rateHalf: 400,
        rateHour: 500,
        whatsapp: '5575982897249',
        badge: 'Novidade',
        availability: 'disponivel',
        image: 'assets/model_gabriela.png',
        storyVideo: 'assets/video.mp4',
        gallery: ['assets/model_gabriela.png'],
        services: ['Encontros Reservados', 'Viagem de Fim de Semana', 'Sessão de Fotos Privada', 'Massagem Tântrica', 'Conversa Intelectual'],
        description: 'Gabriela é estudante de Letras, apaixonada por literatura, arte e filosofia. Ela possui um olhar enigmático e uma personalidade magnética e misteriosa. Excelente ouvinte, sua delicadeza e sensualidade discreta criam um ambiente altamente confortável e inesquecível para homens exigentes.',
        order: 3
    },
    {
        id: 'isabella-4',
        name: 'Isabella Mendes',
        age: 26,
        hair: 'Preto',
        eyes: 'Castanhos',
        rateQuick: 220,
        rateHalf: 320,
        rateHour: 420,
        whatsapp: '5575982897249',
        badge: '',
        availability: 'ocupada',
        image: 'assets/model_isabella.png',
        storyVideo: 'assets/casa.mp4',
        gallery: ['assets/model_isabella.png'],
        services: ['Acompanhamento de Viagem', 'Clube/Festas VIP', 'Massagem Desportiva', 'Esportes de Aventura', 'Jantar Romântico'],
        description: 'Isabella é personal trainer, mantém uma rotina de bem-estar activa e tem uma energia contagiante. Ela é extrovertida, atlética e ama noites de agito nos melhores clubes da cidade. Se você procura uma companhia dinâmica, alegre e com curvas perfeitas para momentos intensos de prazer.',
        order: 4
    }
];

const DataService = {
    init() {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!data) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_COMPANIONS));
            return DEFAULT_COMPANIONS;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Error reading storage, resetting...", e);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_COMPANIONS));
            return DEFAULT_COMPANIONS;
        }
    },
    getAll() {
        return this.init();
    },
    getById(id) {
        const list = this.getAll();
        return list.find(g => g.id === id) || null;
    },
    saveAll(list) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    },
    add(companion) {
        const list = this.getAll();
        const newCompanion = {
            ...companion,
            id: companion.id || 'girl-' + Date.now()
        };
        list.push(newCompanion);
        this.saveAll(list);
        return newCompanion;
    },
    update(id, updatedFields) {
        const list = this.getAll();
        const index = list.findIndex(g => g.id === id);
        if (index === -1) return null;
        list[index] = {
            ...list[index],
            ...updatedFields,
            id
        };
        this.saveAll(list);
        return list[index];
    },
    delete(id) {
        const list = this.getAll();
        const filtered = list.filter(g => g.id !== id);
        if (filtered.length === list.length) return false;
        this.saveAll(filtered);
        return true;
    },
    toggleAvailability(id) {
        const companion = this.getById(id);
        if (!companion) return null;
        const newAvailability = companion.availability === 'disponivel' ? 'ocupada' : 'disponivel';
        this.update(id, { availability: newAvailability });
        return newAvailability;
    },
    reset() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_COMPANIONS));
        return DEFAULT_COMPANIONS;
    }
};

// --- 2. Dynamic Components Rendering Templates ---

// 2.2 Companion Portfolio Grid Card
const GirlCard = {
    html(girl) {
        let badgeHtml = '<span class="badge badge-verified"><i class="fa-solid fa-circle-check"></i> Verificada</span>';
        if (girl.badge) {
            let badgeClass = 'badge-standard';
            if (girl.badge.toUpperCase() === 'VIP') badgeClass = 'badge-gold';
            else if (girl.badge.toUpperCase() === 'NOVIDADE') badgeClass = 'badge-magenta';
            badgeHtml += `<span class="badge ${badgeClass}">${girl.badge}</span>`;
        }

        const isAvailable = girl.availability === 'disponivel';
        const statusHtml = isAvailable 
            ? `<div class="status-dot-badge"><span class="dot-green"></span> Disponível</div>`
            : `<div class="status-dot-badge"><span class="dot-red"></span> Ocupada</div>`;

        return `
            <div class="girl-card" data-id="${girl.id}">
                <div class="girl-card-img-wrapper">
                    <img src="${girl.image || 'assets/model_sophia.png'}" alt="${girl.name}" class="girl-card-img" loading="lazy">
                    <div class="girl-card-overlay"></div>
                    <div class="card-badges">${badgeHtml}</div>
                    <div class="card-status">${statusHtml}</div>
                </div>
                <div class="girl-card-content">
                    <h3 class="girl-card-name">${girl.name}</h3>
                    <div class="girl-card-location"><i class="fa-solid fa-location-dot"></i> Petrolina - PE</div>
                    <div class="girl-card-specs">
                        <span>${girl.age} anos</span>
                    </div>
                    <p class="girl-card-bio">${girl.description}</p>
                    <div class="girl-card-footer">
                        <button class="girl-card-btn view-profile-btn" data-id="${girl.id}" style="width: 100%; justify-content: center; text-align: center;">
                            Ver Perfil <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
};

// 2.3 Profile Details Modal Panel
const ProfileModal = {
    html(girl) {
        const servicesHtml = girl.services.map(service => 
            `<span class="service-tag">${service.trim()}</span>`
        ).join('');

        const isAvailable = girl.availability === 'disponivel';
        const availabilityBadgeHtml = isAvailable
            ? `<div class="status-dot-badge"><span class="dot-green"></span> Disponível</div>`
            : `<div class="status-dot-badge"><span class="dot-red"></span> Ocupada / Reservada</div>`;

        const whatsappText = `Olá! Vi o perfil de ${girl.name} no site da Casa das Marias e gostaria de consultar a disponibilidade para agendamento.`;
        const encodedText = encodeURIComponent(whatsappText);
        const cleanedPhone = girl.whatsapp.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodedText}`;

        const galleryList = girl.gallery || [];
        const galleryHtml = galleryList.length > 0 
            ? `
            <div class="profile-gallery-section">
                <h4>Fotos da Galeria</h4>
                <div class="profile-gallery-grid">
                    ${galleryList.map((photo, index) => `
                        <div class="profile-gallery-item" data-index="${index}">
                            <img src="${photo}" alt="Foto ${index + 1} de ${girl.name}" class="gallery-thumbnail">
                        </div>
                    `).join('')}
                </div>
            </div>`
            : '';

        return `
            <div class="profile-detail-grid" data-girl-id="${girl.id}">
                <div class="profile-detail-img-wrapper">
                    <img src="${girl.image || 'assets/model_sophia.png'}" alt="${girl.name}" class="profile-detail-img">
                </div>
                <div class="profile-detail-info">
                    <div class="profile-detail-header">
                        <div class="profile-detail-header-left">
                            <h3>${girl.name}</h3>
                            <div class="girl-card-location" style="margin-bottom: 0;"><i class="fa-solid fa-location-dot"></i> Petrolina - PE</div>
                            <div class="profile-tags" style="margin-top: 8px;">
                                <span class="badge badge-verified"><i class="fa-solid fa-circle-check"></i> Perfil Verificado</span>
                                ${girl.badge ? `<span class="badge ${girl.badge.toUpperCase() === 'VIP' ? 'badge-gold' : 'badge-magenta'}">${girl.badge}</span>` : ''}
                            </div>
                        </div>
                        <div class="profile-detail-header-right">
                            ${availabilityBadgeHtml}
                        </div>
                    </div>
                    <div class="profile-detail-specs">
                        <div class="spec-box">
                            <span>Idade</span>
                            <p>${girl.age} anos</p>
                        </div>
                        <div class="spec-box">
                            <span>Cabelo</span>
                            <p>${girl.hair}</p>
                        </div>
                        <div class="spec-box">
                            <span>Olhos</span>
                            <p>${girl.eyes}</p>
                        </div>
                        <div class="spec-box">
                            <span>Nacionalidade</span>
                            <p>Brasileira</p>
                        </div>
                    </div>
                    <div class="profile-bio">
                        <h4>Apresentação</h4>
                        <p>${girl.description}</p>
                    </div>
                    <div class="profile-services">
                        <h4>Serviços Disponíveis</h4>
                        <div class="services-list">
                            ${servicesHtml}
                        </div>
                    </div>
                    ${galleryHtml}
                    <a href="${whatsappUrl}" target="_blank" class="btn btn-primary wa-booking-btn btn-glow" style="margin-top: 15px;">
                        <i class="fa-brands fa-whatsapp"></i> Agendar com ${girl.name.split(' ')[0]}
                    </a>
                </div>
            </div>
        `;
    }
};

// 2.4 Administrative Dashboard CRUD Panel
// 2.4 Administrative Dashboard CRUD Panel
const AdminDashboard = {
    render(containerElement, companions) {
        if (!containerElement) return;

        const totalCount = companions.length;
        const availableCount = companions.filter(g => g.availability === 'disponivel').length;
        const busyCount = totalCount - availableCount;

        const activeAdminTab = localStorage.getItem('marias_active_admin_tab') || 'models-tab';

        const rowsHtml = companions.map(girl => {
            const isAvailable = girl.availability === 'disponivel';
            const statusClass = isAvailable ? 'dot-green' : 'dot-red';
            const statusLabel = isAvailable ? 'Disponível' : 'Ocupada';
            
            let badgeMarkup = '<span class="text-muted">—</span>';
            if (girl.badge) {
                const badgeClass = girl.badge.toUpperCase() === 'VIP' ? 'badge-gold' : 'badge-magenta';
                badgeMarkup = `<span class="badge ${badgeClass} badge-row">${girl.badge}</span>`;
            }

            return `
                <tr data-id="${girl.id}">
                    <td>
                        <div class="admin-table-model-info">
                            <img src="${girl.image || 'assets/model_sophia.png'}" alt="${girl.name}" class="admin-table-avatar">
                            <div>
                                <div class="admin-table-model-name">${girl.name}</div>
                                <div class="admin-table-model-sub">Ordem: ${girl.order || 99} | WhatsApp: +${girl.whatsapp}</div>
                            </div>
                        </div>
                    </td>
                    <td>${girl.age} anos</td>
                    <td>
                        <div>${girl.hair} / ${girl.eyes}</div>
                    </td>
                    <td>${badgeMarkup}</td>
                    <td>
                        <div class="status-indicator toggle-status-btn" data-id="${girl.id}">
                            <span class="${statusClass}"></span>
                            <span>${statusLabel}</span>
                        </div>
                    </td>
                    <td>
                        <div class="admin-actions">
                            <button class="admin-action-btn btn-edit edit-girl-btn" data-id="${girl.id}" title="Editar Perfil">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="admin-action-btn btn-delete delete-girl-btn" data-id="${girl.id}" title="Excluir Perfil">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        containerElement.innerHTML = `
            <div class="admin-view-header">
                <div>
                    <h2>Painel de Controle</h2>
                    <p class="section-subtitle" style="text-align: left; margin: 5px 0 0 0;">Gerencie o portfólio das modelos e controle a postagem de stories em tempo real.</p>
                </div>
                <div class="admin-header-actions">
                    <button class="btn btn-secondary reset-db-btn" id="admin-reset-btn">
                        <i class="fa-solid fa-arrow-rotate-left"></i> Resetar Padrão
                    </button>
                    <button class="btn btn-primary btn-glow" id="admin-add-btn">
                        <i class="fa-solid fa-plus"></i> Adicionar Modelo
                    </button>
                    <button class="btn btn-secondary" id="admin-back-btn">
                        <i class="fa-solid fa-house"></i> Voltar ao Site
                    </button>
                </div>
            </div>

            <!-- Admin Tabs -->
            <div class="admin-tabs">
                <button class="admin-tab-btn ${activeAdminTab === 'models-tab' ? 'active' : ''}" data-tab="models-tab">
                    <i class="fa-solid fa-users"></i> Perfis das Modelos
                </button>
                <button class="admin-tab-btn ${activeAdminTab === 'stories-tab' ? 'active' : ''}" data-tab="stories-tab">
                    <i class="fa-solid fa-circle-play"></i> Gerenciar Stories
                </button>
            </div>

            <!-- Tab 1: Models Table -->
            <div id="models-tab" class="admin-tab-content ${activeAdminTab === 'models-tab' ? '' : 'hidden'}">
                <!-- Stats Bar -->
                <div class="admin-stats-bar">
                    <div class="glass-panel stat-card">
                        <div class="stat-card-icon"><i class="fa-solid fa-users"></i></div>
                        <div class="stat-card-info">
                            <span>Total de Modelos</span>
                            <h4>${totalCount}</h4>
                        </div>
                    </div>
                    <div class="glass-panel stat-card">
                        <div class="stat-card-icon"><i class="fa-solid fa-circle-check"></i></div>
                        <div class="stat-card-info">
                            <span>Disponíveis</span>
                            <h4>${availableCount}</h4>
                        </div>
                    </div>
                    <div class="glass-panel stat-card">
                        <div class="stat-card-icon"><i class="fa-solid fa-circle-xmark"></i></div>
                        <div class="stat-card-info">
                            <span>Ocupadas / Reservadas</span>
                            <h4>${busyCount}</h4>
                        </div>
                    </div>
                </div>

                <!-- Management Table -->
                <div class="glass-panel admin-table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Modelo</th>
                                <th>Idade</th>
                                <th>Cabelo / Olhos</th>
                                <th>Selo Especial</th>
                                <th>Status (Disponibilidade)</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="admin-table-body">
                            ${rowsHtml || `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">Nenhuma acompanhante cadastrada. Clique em "Adicionar Modelo" para começar.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Tab 2: Stories Manager -->
            <div id="stories-tab" class="admin-tab-content ${activeAdminTab === 'stories-tab' ? '' : 'hidden'}">
                <div class="stories-manager-intro">
                    <h3>Gerenciador de Stories Rápidos</h3>
                    <p>Poste fotos ou vídeos diretamente no perfil de cada modelo. A barra de stories no topo do site e os stories em reprodução serão atualizados instantaneamente em tempo real para os visitantes.</p>
                </div>
                <div class="stories-manager-grid">
                    ${companions.map(girl => {
                        const hasStory = girl.storyVideo && girl.storyVideo.trim() !== '';
                        let previewHtml = '';
                        if (hasStory) {
                            const isVideo = !girl.storyVideo.startsWith('data:image/') && !girl.storyVideo.match(/\.(jpeg|jpg|gif|png|webp|bmp)($|\?)/i);
                            if (isVideo) {
                                previewHtml = `<video src="${girl.storyVideo}" muted autoplay loop playsinline class="story-preview-thumb"></video>`;
                            } else {
                                previewHtml = `<img src="${girl.storyVideo}" class="story-preview-thumb">`;
                            }
                        } else {
                            previewHtml = `<div class="story-preview-placeholder"><i class="fa-solid fa-video-slash"></i><span>Sem Story</span></div>`;
                        }

                        return `
                            <div class="story-manage-card glass-panel" data-id="${girl.id}">
                                <div class="story-manage-header">
                                    <img src="${girl.image || 'assets/model_sophia.png'}" alt="${girl.name}" class="story-manage-avatar">
                                    <div class="story-manage-name-box">
                                        <h4>${girl.name}</h4>
                                        <span>${hasStory ? '<span class="status-active"><span class="dot-green"></span> Story Ativo</span>' : '<span class="status-inactive"><span class="dot-gray"></span> Inativo</span>'}</span>
                                    </div>
                                </div>
                                <div class="story-manage-body">
                                    <div class="story-preview-container">
                                        ${previewHtml}
                                        ${hasStory ? `<span class="story-badge-type">${girl.storyVideo.startsWith('data:image/') || girl.storyVideo.match(/\.(jpeg|jpg|gif|png|webp|bmp)($|\?)/i) ? 'Foto' : 'Vídeo'}</span>` : ''}
                                    </div>
                                </div>
                                <div class="story-manage-actions">
                                    <input type="file" id="direct-story-input-${girl.id}" accept="image/*,video/*" style="display:none;" class="direct-story-file-input" data-id="${girl.id}">
                                    <button class="btn btn-primary btn-sm btn-glow trigger-direct-upload-btn" data-id="${girl.id}">
                                        <i class="fa-solid fa-upload"></i> ${hasStory ? 'Alterar Story' : 'Postar Story'}
                                    </button>
                                    ${hasStory ? `
                                    <button class="btn btn-danger btn-sm remove-direct-story-btn" data-id="${girl.id}" title="Excluir Story">
                                        <i class="fa-solid fa-trash-can"></i> Remover
                                    </button>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
};

// --- 3. App Core Event Loop Coordinators ---

let currentCompanions = [];
let activeFilter = 'all';
let searchQuery = '';

// DOM Cache Elements
let mainNav, menuToggle, companionsGrid, searchInput, filterTagsContainer;
let heroView, loungeView, portfolioView, adminView;
let profileModal, profileModalContent, profileModalClose;
let authModal, authPasswordInput, authSubmitBtn, authErrorMsg, authModalClose;
let adminFormModal, adminFormClose, companionForm, formCancelBtn, formModalTitle;
// Stories elements
let storyModal, storyVideo, storyHeaderAvatar, storyHeaderName, storyProgressBar;
let storyCloseBtn, storyPlayPauseBtn, storyAudioBtn, storyNavLeftTap, storyNavRightTap;
let storyArrowLeft, storyArrowRight, storyBookBtn, storyVideoLoader;

document.addEventListener('DOMContentLoaded', () => {
    // Cache Elements
    mainNav = document.getElementById('main-nav');
    menuToggle = document.getElementById('menu-toggle');
    companionsGrid = document.getElementById('companions-grid');
    searchInput = document.getElementById('search-input');
    filterTagsContainer = document.getElementById('filter-tags-container');

    heroView = document.getElementById('hero-view');
    loungeView = document.getElementById('lounge-view');
    portfolioView = document.getElementById('portfolio-view');
    adminView = document.getElementById('admin-view');

    profileModal = document.getElementById('profile-modal');
    profileModalContent = document.getElementById('profile-modal-content');
    profileModalClose = document.getElementById('profile-modal-close');

    authModal = document.getElementById('auth-modal');
    authPasswordInput = document.getElementById('auth-password');
    authSubmitBtn = document.getElementById('auth-submit-btn');
    authErrorMsg = document.getElementById('auth-error-msg');
    authModalClose = document.getElementById('auth-modal-close');

    adminFormModal = document.getElementById('admin-form-modal');
    adminFormClose = document.getElementById('admin-form-close');
    companionForm = document.getElementById('companion-form');
    formCancelBtn = document.getElementById('form-cancel-btn');
    formModalTitle = document.getElementById('form-modal-title');

    // Stories Cache Elements
    storyModal = document.getElementById('story-modal');
    storyVideo = document.getElementById('story-video');
    storyHeaderAvatar = document.getElementById('story-header-avatar');
    storyHeaderName = document.getElementById('story-header-name');
    storyProgressBar = document.getElementById('story-progress-bar');
    storyCloseBtn = document.getElementById('story-close-btn');
    storyPlayPauseBtn = document.getElementById('story-play-pause-btn');
    storyAudioBtn = document.getElementById('story-audio-btn');
    storyNavLeftTap = document.getElementById('story-nav-left-tap');
    storyNavRightTap = document.getElementById('story-nav-right-tap');
    storyArrowLeft = document.getElementById('story-arrow-left');
    storyArrowRight = document.getElementById('story-arrow-right');
    storyBookBtn = document.getElementById('story-book-btn');
    storyVideoLoader = document.getElementById('story-video-loader');

    // Load Data
    currentCompanions = DataService.getAll();
    
    // Render Sections
    renderPortfolioGrid();
    renderStoriesBar();
    
    // Setup Events
    setupEventListeners();

    // Autoplay Videos
    initAutoplayVideos();

    // Check redirect authentication from other pages
    if (sessionStorage.getItem('marias_admin_authenticated') === 'true') {
        sessionStorage.removeItem('marias_admin_authenticated');
        if (document.getElementById('admin-view')) {
            switchView('admin');
        }
    }
});

function renderPortfolioGrid() {
    if (!companionsGrid) return;
    
    // Sort by order priority (smaller numbers first, default to 99)
    let sorted = [...currentCompanions].sort((a, b) => (a.order || 99) - (b.order || 99));
    let filtered = sorted;
    
    if (activeFilter !== 'all') {
        filtered = filtered.filter(girl => {
            if (activeFilter === 'Loiras') return girl.hair.toLowerCase().includes('loiro');
            if (activeFilter === 'Morenas') return girl.hair.toLowerCase().includes('moren') || girl.hair.toLowerCase().includes('pret');
            if (activeFilter === 'Ruivas') return girl.hair.toLowerCase().includes('ruiv');
            if (activeFilter === 'VIP') return girl.badge && girl.badge.toUpperCase() === 'VIP';
            if (activeFilter === 'Novidade') return girl.badge && girl.badge.toUpperCase() === 'NOVIDADE';
            return true;
        });
    }
    
    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(girl => girl.name.toLowerCase().includes(query));
    }
    
    if (filtered.length === 0) {
        companionsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <i class="fa-solid fa-magnifying-glass" style="font-size: 2.5rem; margin-bottom: 15px; color: rgba(255,255,255,0.1)"></i>
                <p>Nenhuma acompanhante encontrada correspondendo aos seus critérios.</p>
            </div>
        `;
        return;
    }
    
    companionsGrid.innerHTML = filtered.map(girl => GirlCard.html(girl)).join('');
}

function renderAdminDashboard() {
    if (!adminView) return;
    // Sort by order priority in admin dashboard as well
    const sorted = [...currentCompanions].sort((a, b) => (a.order || 99) - (b.order || 99));
    AdminDashboard.render(adminView, sorted);
}

function switchView(view) {
    if (view === 'admin') {
        heroView.classList.add('hidden');
        if (loungeView) loungeView.classList.add('hidden');
        portfolioView.classList.add('hidden');
        adminView.classList.remove('hidden');
        renderAdminDashboard();
        
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.getElementById('nav-admin-btn').classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        adminView.classList.add('hidden');
        heroView.classList.remove('hidden');
        if (loungeView) loungeView.classList.remove('hidden');
        portfolioView.classList.remove('hidden');
        renderPortfolioGrid();
        
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        if (document.querySelector('[data-target="home"]')) {
            document.querySelector('[data-target="home"]').classList.add('active');
        }
        sessionStorage.removeItem('marias_admin_authenticated');
    }
}

function setupEventListeners() {
    // Mobile Navigation Drawer (Fatal Model Style)
    const sidebarDrawer = document.getElementById('sidebar-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const copyShareLink = document.getElementById('copy-share-link');
    const shareLinkText = document.getElementById('share-link-text');

    if (menuToggle && sidebarDrawer && drawerOverlay) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebarDrawer.classList.add('active');
            drawerOverlay.classList.add('active');
        });
    }

    if (drawerCloseBtn && sidebarDrawer && drawerOverlay) {
        drawerCloseBtn.addEventListener('click', () => {
            sidebarDrawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
        });
    }

    if (drawerOverlay && sidebarDrawer) {
        drawerOverlay.addEventListener('click', () => {
            sidebarDrawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
        });
    }

    // Close drawer on clicking links inside the drawer
    document.querySelectorAll('.drawer-link').forEach(link => {
        link.addEventListener('click', () => {
            if (sidebarDrawer && drawerOverlay) {
                sidebarDrawer.classList.remove('active');
                drawerOverlay.classList.remove('active');
            }
        });
    });

    // Share link copy functionality
    if (copyShareLink && shareLinkText) {
        shareLinkText.textContent = window.location.hostname || 'casadasmariass.com';
        copyShareLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const urlToCopy = window.location.origin + window.location.pathname;
            navigator.clipboard.writeText(urlToCopy).then(() => {
                const originalIcon = copyShareLink.innerHTML;
                copyShareLink.innerHTML = '<i class="fa-solid fa-check" style="color: var(--color-success);"></i>';
                setTimeout(() => {
                    copyShareLink.innerHTML = originalIcon;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }

    // FAQ Accordion Toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq-item');
            if (!item) return;
            const isActive = item.classList.contains('active');
            
            // Optional: Close all other FAQ items (accordion behavior)
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Support Contact Form Submit
    const supportForm = document.getElementById('support-contact-form');
    if (supportForm) {
        supportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Sua mensagem foi enviada com sucesso! Nossa equipe entrará em contato em breve.');
            supportForm.reset();
        });
    }

    // Smooth scroll for all hash anchors (including navigation, hero buttons and footer links)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#' || anchor.classList.contains('admin-trigger')) return;
        
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // If the admin panel is visible, switch back to portfolio first
            if (adminView && !adminView.classList.contains('hidden')) {
                switchView('portfolio');
            }
            
            let targetId = href.substring(1);
            // Translate legacy custom targets if needed
            if (targetId === 'models') targetId = 'portfolio-view';
            
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                
                // Update navigation active states
                let navTarget = href.substring(1);
                if (navTarget === 'portfolio-view') navTarget = 'models';
                
                document.querySelectorAll('.nav-link').forEach(link => {
                    if (link.getAttribute('data-target') === navTarget) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    });

    if (document.getElementById('nav-logo')) {
        document.getElementById('nav-logo').addEventListener('click', (e) => {
            e.preventDefault();
            switchView('portfolio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Filtering inputs
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderPortfolioGrid();
        });
    }

    if (filterTagsContainer) {
        filterTagsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            activeFilter = btn.getAttribute('data-filter');
            renderPortfolioGrid();
        });
    }

    // Grid Open Modal Click
    if (companionsGrid) {
        companionsGrid.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('.view-profile-btn');
            const card = e.target.closest('.girl-card');
            
            if (card && !e.target.closest('.girl-card-btn')) {
                const girlId = card.getAttribute('data-id');
                openProfileDetails(girlId);
            } else if (viewBtn) {
                const girlId = viewBtn.getAttribute('data-id');
                openProfileDetails(girlId);
            }
        });
    }

    if (profileModalClose) {
        profileModalClose.addEventListener('click', () => {
            profileModal.classList.add('hidden');
        });
    }
    
    // Auth security trigger open
    const adminTriggers = document.querySelectorAll('.admin-trigger');
    adminTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            authPasswordInput.value = '';
            authErrorMsg.classList.add('hidden');
            authModal.classList.remove('hidden');
            authPasswordInput.focus();
        });
    });

    if (authModalClose) {
        authModalClose.addEventListener('click', () => {
            authModal.classList.add('hidden');
        });
    }

    if (authSubmitBtn) {
        authSubmitBtn.addEventListener('click', handleAuthentication);
    }
    if (authPasswordInput) {
        authPasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAuthentication();
        });
    }

    // Modal Background Clicks Close
    window.addEventListener('click', (e) => {
        if (e.target === profileModal) profileModal.classList.add('hidden');
        if (e.target === authModal) authModal.classList.add('hidden');
        if (e.target === adminFormModal) adminFormModal.classList.add('hidden');
        if (e.target === storyModal) closeStoryPlayer();
    });

    // Admin Dashboard delegated clicks
    if (adminView) {
        adminView.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit-girl-btn');
            if (editBtn) {
                openEditForm(editBtn.getAttribute('data-id'));
                return;
            }

            const deleteBtn = e.target.closest('.delete-girl-btn');
            if (deleteBtn) {
                handleDeleteCompanion(deleteBtn.getAttribute('data-id'));
                return;
            }

            const statusBtn = e.target.closest('.toggle-status-btn');
            if (statusBtn) {
                handleToggleStatus(statusBtn.getAttribute('data-id'));
                return;
            }

            const resetBtn = e.target.closest('.reset-db-btn');
            if (resetBtn) {
                handleResetDatabase();
                return;
            }

            const addBtn = e.target.closest('#admin-add-btn');
            if (addBtn) {
                openAddForm();
                return;
            }

            const backBtn = e.target.closest('#admin-back-btn');
            if (backBtn) {
                switchView('portfolio');
                return;
            }

            const tabBtn = e.target.closest('.admin-tab-btn');
            if (tabBtn) {
                const tabId = tabBtn.getAttribute('data-tab');
                localStorage.setItem('marias_active_admin_tab', tabId);
                
                document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
                tabBtn.classList.add('active');
                
                document.querySelectorAll('.admin-tab-content').forEach(panel => panel.classList.add('hidden'));
                document.getElementById(tabId).classList.remove('hidden');
                return;
            }

            const triggerBtn = e.target.closest('.trigger-direct-upload-btn');
            if (triggerBtn) {
                const girlId = triggerBtn.getAttribute('data-id');
                const fileInput = document.getElementById(`direct-story-input-${girlId}`);
                if (fileInput) fileInput.click();
                return;
            }

            const removeBtn = e.target.closest('.remove-direct-story-btn');
            if (removeBtn) {
                const girlId = removeBtn.getAttribute('data-id');
                const girl = DataService.getById(girlId);
                if (girl && confirm(`Deseja realmente remover o story de ${girl.name}?`)) {
                    DataService.update(girlId, { storyVideo: '' });
                    currentCompanions = DataService.getAll();
                    renderAdminDashboard();
                    renderStoriesBar();
                    renderPortfolioGrid();
                }
                return;
            }
        });

        adminView.addEventListener('change', async (e) => {
            const fileInput = e.target.closest('.direct-story-file-input');
            if (fileInput) {
                const file = fileInput.files[0];
                if (!file) return;
                const girlId = fileInput.getAttribute('data-id');
                
                const card = fileInput.closest('.story-manage-card');
                if (card) {
                    const previewBox = card.querySelector('.story-preview-container');
                    if (previewBox) {
                        previewBox.innerHTML = '<div class="story-preview-placeholder"><i class="fa-solid fa-circle-notch fa-spin"></i><span>Carregando...</span></div>';
                    }
                }

                try {
                    let fileData = '';
                    if (file.type.startsWith('image/')) {
                        fileData = await compressImage(file, 600, 900, 0.7);
                    } else if (file.type.startsWith('video/')) {
                        if (file.size > 2 * 1024 * 1024) {
                            alert("Aviso: O vídeo do story é maior que 2MB. Vídeos muito grandes podem exceder a memória local.");
                        }
                        fileData = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = (event) => resolve(event.target.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                        });
                    } else {
                        alert("Por favor, selecione uma imagem ou um vídeo.");
                        renderAdminDashboard();
                        return;
                    }

                    DataService.update(girlId, { storyVideo: fileData });
                    currentCompanions = DataService.getAll();
                    renderAdminDashboard();
                    renderStoriesBar();
                    renderPortfolioGrid();
                } catch (err) {
                     console.error("Error processing story upload:", err);
                     alert("Erro ao enviar o story.");
                     renderAdminDashboard();
                }
            }
        });
    }

    // Form buttons
    if (adminFormClose) {
        adminFormClose.addEventListener('click', () => {
            adminFormModal.classList.add('hidden');
        });
    }
    if (formCancelBtn) {
        formCancelBtn.addEventListener('click', () => {
            adminFormModal.classList.add('hidden');
        });
    }

    if (companionForm) {
        companionForm.addEventListener('submit', handleFormSubmit);
    }

    // Hero Buttons Role Selector Clicks
    const heroClientBtn = document.getElementById('hero-client-btn');

    if (heroClientBtn) {
        heroClientBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('portfolio-view');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Stories Event Listeners
    if (storyCloseBtn) storyCloseBtn.addEventListener('click', closeStoryPlayer);
    if (storyPlayPauseBtn) storyPlayPauseBtn.addEventListener('click', togglePlayPause);
    if (storyAudioBtn) storyAudioBtn.addEventListener('click', toggleMute);
    if (storyNavLeftTap) storyNavLeftTap.addEventListener('click', prevStory);
    if (storyNavRightTap) storyNavRightTap.addEventListener('click', nextStory);
    if (storyArrowLeft) storyArrowLeft.addEventListener('click', prevStory);
    if (storyArrowRight) storyArrowRight.addEventListener('click', nextStory);

    // File inputs handling (Base64 + Canvas Compression)
    const coverInput = document.getElementById('form-image-file');
    const hiddenCover = document.getElementById('form-image');
    if (coverInput && hiddenCover) {
        coverInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const base64 = await compressImage(file, 600, 600, 0.7);
                hiddenCover.value = base64;
            } catch (err) {
                console.error("Error compressing cover image:", err);
                alert("Falha ao carregar a imagem de capa.");
            }
        });
    }

    const galleryFilesInput = document.getElementById('form-gallery-files');
    if (galleryFilesInput) {
        galleryFilesInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            for (let file of files) {
                try {
                    const base64 = await compressImage(file, 800, 800, 0.7);
                    currentFormGallery.push(base64);
                } catch (err) {
                    console.error("Error compressing gallery image:", err);
                }
            }
            renderFormGalleryPreview();
            galleryFilesInput.value = ''; // Reset input
        });
    }

    const storyFileInput = document.getElementById('form-story-file');
    const hiddenStoryVideo = document.getElementById('form-story-video');
    if (storyFileInput && hiddenStoryVideo) {
        storyFileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                if (file.type.startsWith('image/')) {
                    const base64 = await compressImage(file, 600, 900, 0.7);
                    hiddenStoryVideo.value = base64;
                    const urlInput = document.getElementById('form-story-url');
                    if (urlInput) urlInput.value = '';
                } else if (file.type.startsWith('video/')) {
                    if (file.size > 1.5 * 1024 * 1024) {
                        alert("Aviso: O vídeo do story é maior que 1.5MB. Vídeos muito grandes podem exceder a memória local.");
                    }
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        hiddenStoryVideo.value = event.target.result;
                        const urlInput = document.getElementById('form-story-url');
                        if (urlInput) urlInput.value = '';
                    };
                    reader.readAsDataURL(file);
                }
            } catch (err) {
                console.error("Error handling story upload:", err);
                alert("Falha ao processar o arquivo do story.");
            }
        });
    }

    const storyUrlInput = document.getElementById('form-story-url');
    if (storyUrlInput && hiddenStoryVideo) {
        storyUrlInput.addEventListener('input', (e) => {
            if (e.target.value.trim() !== '') {
                hiddenStoryVideo.value = e.target.value.trim();
                if (storyFileInput) storyFileInput.value = '';
            }
        });
    }

    // Lightbox for profile gallery images
    if (profileModal) {
        profileModal.addEventListener('click', (e) => {
            const imgItem = e.target.closest('.profile-gallery-item');
            if (imgItem) {
                const index = parseInt(imgItem.getAttribute('data-index'), 10);
                const imgs = Array.from(document.querySelectorAll('.profile-gallery-item img')).map(img => img.src);
                openLightbox(imgs, index);
            }
        });
    }
}

// --- Action Implementations ---

function openProfileDetails(id) {
    const companion = DataService.getById(id);
    if (!companion) return;

    profileModalContent.innerHTML = ProfileModal.html(companion);
    profileModal.classList.remove('hidden');
}

function handleAuthentication() {
    const password = authPasswordInput.value;
    if (password === 'admin123') {
        authModal.classList.add('hidden');
        if (document.getElementById('admin-view')) {
            switchView('admin');
        } else {
            sessionStorage.setItem('marias_admin_authenticated', 'true');
            window.location.href = 'main.html';
        }
    } else {
        authErrorMsg.classList.remove('hidden');
        authPasswordInput.focus();
    }
}

function handleToggleStatus(id) {
    const newStatus = DataService.toggleAvailability(id);
    if (newStatus) {
        currentCompanions = DataService.getAll();
        renderAdminDashboard();
    }
}

function handleDeleteCompanion(id) {
    const companion = DataService.getById(id);
    if (!companion) return;

    if (confirm(`Deseja realmente excluir permanentemente o perfil de ${companion.name}?`)) {
        if (DataService.delete(id)) {
            currentCompanions = DataService.getAll();
            renderAdminDashboard();
        }
    }
}

function handleResetDatabase() {
    if (confirm("Isso irá apagar todas as modificações e restaurar os perfis originais. Continuar?")) {
        currentCompanions = DataService.reset();
        renderAdminDashboard();
    }
}

// --- File Upload & Lightbox Helpers ---
let currentFormGallery = [];

function compressImage(file, maxWidth, maxHeight, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function renderFormGalleryPreview() {
    const previewContainer = document.getElementById('form-gallery-preview');
    if (!previewContainer) return;
    
    if (currentFormGallery.length === 0) {
        previewContainer.innerHTML = '<span class="text-muted" style="font-size: 0.85rem;">Nenhuma foto na galeria.</span>';
        return;
    }
    
    previewContainer.innerHTML = currentFormGallery.map((photo, index) => `
        <div class="gallery-preview-item" style="position: relative; width: 80px; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid var(--color-gold);">
            <img src="${photo}" style="width: 100%; height: 100%; object-fit: cover;">
            <button type="button" class="remove-preview-img-btn" data-index="${index}" style="position: absolute; top: 2px; right: 2px; background: rgba(237, 58, 59, 0.85); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.75rem; font-weight: bold; z-index: 10;">&times;</button>
        </div>
    `).join('');
    
    previewContainer.querySelectorAll('.remove-preview-img-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.getAttribute('data-index'), 10);
            currentFormGallery.splice(index, 1);
            renderFormGalleryPreview();
        });
    });
}

function openLightbox(images, startIndex) {
    let currentIndex = startIndex;
    
    // Create element if not exists
    let lightbox = document.getElementById('premium-lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'premium-lightbox';
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <button class="lightbox-close-btn">&times;</button>
            <button class="lightbox-nav-btn prev-btn">&#10094;</button>
            <div class="lightbox-content">
                <img id="lightbox-img" src="" alt="Lightbox Image">
            </div>
            <button class="lightbox-nav-btn next-btn">&#10095;</button>
            <div class="lightbox-counter">1 / 1</div>
        `;
        document.body.appendChild(lightbox);
        
        lightbox.querySelector('.lightbox-close-btn').addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
        
        lightbox.querySelector('.prev-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightbox();
        });
        
        lightbox.querySelector('.next-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            updateLightbox();
        });
        
        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }
    
    function updateLightbox() {
        const img = lightbox.querySelector('#lightbox-img');
        const counter = lightbox.querySelector('.lightbox-counter');
        img.src = images[currentIndex];
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
    
    updateLightbox();
    lightbox.classList.add('active');
}

function openAddForm() {
    formModalTitle.textContent = "Adicionar Nova Modelo";
    document.getElementById('form-girl-id').value = '';
    companionForm.reset();
    document.getElementById('form-order').value = '10';
    document.getElementById('form-image').value = '';
    document.getElementById('form-story-video').value = '';
    
    const storyUrl = document.getElementById('form-story-url');
    if (storyUrl) storyUrl.value = '';
    
    const fileCover = document.getElementById('form-image-file');
    if (fileCover) fileCover.value = '';
    const fileGallery = document.getElementById('form-gallery-files');
    if (fileGallery) fileGallery.value = '';
    const fileStory = document.getElementById('form-story-file');
    if (fileStory) fileStory.value = '';
    
    currentFormGallery = [];
    renderFormGalleryPreview();
    
    adminFormModal.classList.remove('hidden');
    document.getElementById('form-name').focus();
}

function openEditForm(id) {
    const girl = DataService.getById(id);
    if (!girl) return;

    formModalTitle.textContent = `Editar Perfil de ${girl.name}`;
    document.getElementById('form-girl-id').value = girl.id;
    
    document.getElementById('form-name').value = girl.name;
    document.getElementById('form-age').value = girl.age;
    document.getElementById('form-hair').value = girl.hair;
    document.getElementById('form-eyes').value = girl.eyes;
    document.getElementById('form-whatsapp').value = girl.whatsapp;
    document.getElementById('form-badge').value = girl.badge;
    document.getElementById('form-image').value = girl.image;
    document.getElementById('form-availability').value = girl.availability;
    document.getElementById('form-story-video').value = girl.storyVideo || '';
    document.getElementById('form-services').value = girl.services.join(', ');
    document.getElementById('form-description').value = girl.description;
    document.getElementById('form-order').value = girl.order || 99;

    const fileCover = document.getElementById('form-image-file');
    if (fileCover) fileCover.value = '';
    const fileGallery = document.getElementById('form-gallery-files');
    if (fileGallery) fileGallery.value = '';
    const fileStory = document.getElementById('form-story-file');
    if (fileStory) fileStory.value = '';

    const storyUrl = document.getElementById('form-story-url');
    if (storyUrl) {
        const src = girl.storyVideo || '';
        storyUrl.value = (src.startsWith('data:') ? '' : src);
    }

    currentFormGallery = [...(girl.gallery || [])];
    renderFormGalleryPreview();

    adminFormModal.classList.remove('hidden');
}

function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('form-girl-id').value;
    
    const servicesInput = document.getElementById('form-services').value;
    const servicesArray = servicesInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    const companionData = {
        name: document.getElementById('form-name').value,
        age: parseInt(document.getElementById('form-age').value, 10),
        hair: document.getElementById('form-hair').value,
        eyes: document.getElementById('form-eyes').value,
        rateQuick: 0,
        rateHalf: 0,
        rateHour: 0,
        whatsapp: document.getElementById('form-whatsapp').value.replace(/\D/g, ''),
        badge: document.getElementById('form-badge').value,
        image: document.getElementById('form-image').value || 'assets/model_sophia.png',
        availability: document.getElementById('form-availability').value,
        storyVideo: document.getElementById('form-story-video').value.trim(),
        gallery: currentFormGallery,
        services: servicesArray,
        description: document.getElementById('form-description').value,
        order: parseInt(document.getElementById('form-order').value, 10) || 99
    };

    if (id) {
        DataService.update(id, companionData);
    } else {
        // Fallback default image if none uploaded
        if (!companionData.image || companionData.image === '') {
            companionData.image = 'assets/model_sophia.png';
        }
        if (companionData.gallery.length === 0) {
            companionData.gallery.push(companionData.image);
        }
        DataService.add(companionData);
    }

    currentCompanions = DataService.getAll();
    adminFormModal.classList.add('hidden');
    renderAdminDashboard();
}

function initAutoplayVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.muted = true;
        video.defaultMuted = true;
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay blocked, adding interaction trigger.", error);
                const forcePlay = () => {
                    video.play();
                    document.removeEventListener('click', forcePlay);
                    document.removeEventListener('touchstart', forcePlay);
                    document.removeEventListener('scroll', forcePlay);
                };
                document.addEventListener('click', forcePlay);
                document.addEventListener('touchstart', forcePlay);
                document.addEventListener('scroll', forcePlay);
            });
        }
    });
}

// --- 4. Stories Feature Action Implementations ---
let activeStoriesList = [];
let currentStoryIndex = -1;
let storyProgressTimer = null;
const STORY_DURATION = 15; // fallback max duration in seconds
let viewedStories = JSON.parse(localStorage.getItem('marias_viewed_stories') || '[]');

function renderStoriesBar() {
    const storiesContainer = document.getElementById('stories-container');
    if (!storiesContainer) return;

    // Filter models that have storyVideo and are available (showing all is more engaging!)
    const activeModels = [...currentCompanions].sort((a, b) => (a.order || 99) - (b.order || 99));

    if (activeModels.length === 0) {
        const storiesView = document.getElementById('stories-view');
        if (storiesView) storiesView.classList.add('hidden');
        return;
    }
    
    const storiesView = document.getElementById('stories-view');
    if (storiesView) storiesView.classList.remove('hidden');

    storiesContainer.innerHTML = activeModels.map(girl => {
        const hasViewed = viewedStories.includes(girl.id);
        const nameShort = girl.name.split(' ')[0];
        const viewedClass = hasViewed ? 'viewed' : '';
        
        return `
            <div class="story-item ${viewedClass}" data-id="${girl.id}">
                <div class="story-avatar-ring">
                    <img src="${girl.image}" alt="${girl.name}" loading="lazy">
                    <span class="story-avatar-badge"><i class="fa-solid fa-play"></i></span>
                </div>
                <span class="story-name">${nameShort}</span>
            </div>
        `;
    }).join('');

    // Add click listeners to stories
    storiesContainer.querySelectorAll('.story-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            openStoryPlayer(id);
        });
    });
}

function openStoryPlayer(companionId) {
    activeStoriesList = [...currentCompanions].sort((a, b) => (a.order || 99) - (b.order || 99));
    currentStoryIndex = activeStoriesList.findIndex(g => g.id === companionId);
    
    if (currentStoryIndex === -1) return;

    const modal = document.getElementById('story-modal');
    if (!modal) return;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Lock scroll
    
    // Mark as viewed
    if (!viewedStories.includes(companionId)) {
        viewedStories.push(companionId);
        localStorage.setItem('marias_viewed_stories', JSON.stringify(viewedStories));
        renderStoriesBar();
    }
}

let storyIsImage = false;
let storyIsPaused = false;
let storyElapsedTime = 0;
const STORY_IMAGE_DURATION = 5000; // 5 segundos para fotos

function loadStoryAtIndex(index) {
    if (index < 0 || index >= activeStoriesList.length) {
        closeStoryPlayer();
        return;
    }

    currentStoryIndex = index;
    const girl = activeStoriesList[index];
    
    // Cache DOM elements (ensuring they are not null)
    const video = document.getElementById('story-video');
    const imageEl = document.getElementById('story-image');
    const avatar = document.getElementById('story-header-avatar');
    const name = document.getElementById('story-header-name');
    const bookBtn = document.getElementById('story-book-btn');
    const loader = document.getElementById('story-video-loader');
    const playPauseBtn = document.getElementById('story-play-pause-btn');
    
    if (!video || !imageEl) return;

    // Reset UI states
    video.style.display = 'none';
    imageEl.style.display = 'none';
    if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    storyIsPaused = false;

    // Show loader
    if (loader) loader.classList.add('active');

    // Update Header
    if (avatar) avatar.src = girl.image;
    if (name) name.textContent = girl.name;
    
    // Update WhatsApp CTA
    const whatsappText = `Olá! Vi seu story no site da Casa das Marias e gostaria de agendar um horário com você.`;
    const encodedText = encodeURIComponent(whatsappText);
    const cleanedPhone = girl.whatsapp.replace(/\D/g, '');
    if (bookBtn) {
        bookBtn.href = `https://wa.me/${cleanedPhone}?text=${encodedText}`;
        bookBtn.innerHTML = `<i class="fa-brands fa-whatsapp"></i> Agendar com ${girl.name.split(' ')[0]}`;
    }

    // Setup Progress Bar UI
    renderStoryProgressIndicators();

    const src = girl.storyVideo || 'assets/video.mp4';
    storyIsImage = src.startsWith('data:image/') || src.match(/\.(jpeg|jpg|gif|png|webp|bmp)($|\?)/i);

    if (storyIsImage) {
        imageEl.src = src;
        imageEl.style.display = 'block';
        if (loader) loader.classList.remove('active');
        startProgressTracker();
    } else {
        video.src = src;
        video.style.display = 'block';
        video.load();
        
        // Setup audio/mute states from localStorage or default to muted (due to autoplay)
        const isMuted = localStorage.getItem('marias_story_muted') !== 'false'; // default to true
        video.muted = isMuted;
        updateAudioButtonUI(isMuted);

        // Play
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (loader) loader.classList.remove('active');
                startProgressTracker();
            }).catch(err => {
                console.log("Play failed, waiting for user interaction.", err);
                if (loader) loader.classList.remove('active');
                startProgressTracker();
            });
        }

        // Video events
        video.onwaiting = () => { if (loader) loader.classList.add('active'); };
        video.onplaying = () => { if (loader) loader.classList.remove('active'); };
        
        // When video ends, go to next story
        video.onended = () => {
            nextStory();
        };
    }
}

function renderStoryProgressIndicators() {
    const progressContainer = document.getElementById('story-progress-bar');
    if (!progressContainer) return;

    progressContainer.innerHTML = activeStoriesList.map((_, idx) => {
        let fillClass = '';
        if (idx < currentStoryIndex) fillClass = 'completed';
        return `
            <div class="story-progress-segment">
                <div class="story-progress-fill ${fillClass}" id="story-progress-fill-${idx}"></div>
            </div>
        `;
    }).join('');
}

function startProgressTracker() {
    if (storyProgressTimer) {
        clearInterval(storyProgressTimer);
    }
    
    const currentFill = document.getElementById(`story-progress-fill-${currentStoryIndex}`);
    if (!currentFill) return;

    storyIsPaused = false;
    storyElapsedTime = 0;

    const video = document.getElementById('story-video');
    
    storyProgressTimer = setInterval(() => {
        if (storyIsPaused) return; // pausar progresso se estiver pausado

        if (storyIsImage) {
            storyElapsedTime += 100;
            const percent = (storyElapsedTime / STORY_IMAGE_DURATION) * 100;
            if (percent >= 100) {
                currentFill.style.width = '100%';
                clearInterval(storyProgressTimer);
                nextStory();
            } else {
                currentFill.style.width = `${percent}%`;
            }
        } else {
            if (!video || video.paused) return;
            const duration = video.duration || STORY_DURATION;
            const percent = (video.currentTime / duration) * 100;
            currentFill.style.width = `${percent}%`;
        }
    }, 100);
}

function nextStory() {
    if (currentStoryIndex + 1 < activeStoriesList.length) {
        const nextGirl = activeStoriesList[currentStoryIndex + 1];
        if (!viewedStories.includes(nextGirl.id)) {
            viewedStories.push(nextGirl.id);
            localStorage.setItem('marias_viewed_stories', JSON.stringify(viewedStories));
            renderStoriesBar();
        }
        loadStoryAtIndex(currentStoryIndex + 1);
    } else {
        closeStoryPlayer();
    }
}

function prevStory() {
    if (currentStoryIndex - 1 >= 0) {
        loadStoryAtIndex(currentStoryIndex - 1);
    } else {
        loadStoryAtIndex(0);
    }
}

function closeStoryPlayer() {
    if (storyProgressTimer) {
        clearInterval(storyProgressTimer);
    }
    
    const modal = document.getElementById('story-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
    
    document.body.style.overflow = ''; // Destravar rolagem

    const video = document.getElementById('story-video');
    if (video) {
        video.pause();
        video.src = '';
    }

    const imageEl = document.getElementById('story-image');
    if (imageEl) {
        imageEl.style.display = 'none';
        imageEl.src = '';
    }
}

function togglePlayPause() {
    const video = document.getElementById('story-video');
    const playPauseBtn = document.getElementById('story-play-pause-btn');
    if (!playPauseBtn) return;

    if (storyIsImage) {
        storyIsPaused = !storyIsPaused;
        playPauseBtn.innerHTML = storyIsPaused ? '<i class="fa-solid fa-play"></i>' : '<i class="fa-solid fa-pause"></i>';
    } else {
        if (!video) return;
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
    }
}

function toggleMute() {
    const video = document.getElementById('story-video');
    if (!video) return;

    const isMuted = !video.muted;
    video.muted = isMuted;
    localStorage.setItem('marias_story_muted', isMuted);
    updateAudioButtonUI(isMuted);
}

function updateAudioButtonUI(isMuted) {
    const audioBtn = document.getElementById('story-audio-btn');
    if (!audioBtn) return;
    
    if (isMuted) {
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else {
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
}

// Listen to storage changes from other tabs to sync data instantly
window.addEventListener('storage', (e) => {
    if (e.key === LOCAL_STORAGE_KEY) {
        currentCompanions = DataService.getAll();
        renderStoriesBar();
        renderPortfolioGrid();
        if (adminView && !adminView.classList.contains('hidden')) {
            renderAdminDashboard();
        }
    }
});
