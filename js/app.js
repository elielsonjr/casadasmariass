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
const LOCAL_STORAGE_KEY = 'marias_privee_rooms';

const DEFAULT_ROOMS = [
    {
        id: 'quarto-1',
        type: 'room',
        name: 'Quartos para atendimentos no Centro de Petrolina',
        age: 140, // RateDaily
        hair: 'Centro', // Neighborhood
        eyes: 'Petrolina/PE', // City/State
        rateQuick: 0,
        rateHalf: 0,
        rateHour: 0,
        whatsapp: '5575982897249',
        badge: 'VIP',
        availability: 'disponivel',
        image: 'assets/room_premium_1.png',
        storyVideo: 'assets/video.mp4',
        gallery: ['assets/room_premium_1.png'],
        services: ['Ar Condicionado', 'Wi-Fi de Alta Velocidade', 'Cama de Casal', 'Local Seguro com Câmeras', 'Guarda-Roupas', 'Toalhas de Banho'],
        description: 'Quarto climatizado ideal para atendimentos profissionais e recepção no Centro de Petrolina. Espaço limpo, seguro, com monitoramento e privacidade total para você atender ou se hospedar com todo o conforto.',
        order: 1
    },
    {
        id: 'quarto-2',
        type: 'room',
        name: 'Suíte Luxo Completa no Jardim Amazonas',
        age: 120, // RateDaily
        hair: 'Jardim Amazonas', // Neighborhood
        eyes: 'Petrolina/PE', // City/State
        rateQuick: 0,
        rateHalf: 0,
        rateHour: 0,
        whatsapp: '5575982897249',
        badge: 'Destaque',
        availability: 'disponivel',
        image: 'assets/room_standard_2.png',
        storyVideo: 'assets/casa.mp4',
        gallery: ['assets/room_standard_2.png'],
        services: ['Wi-Fi', 'Ar Condicionado', 'Cama de Casal', 'Banheiro Privativo', 'Segurança 24h', 'Toalhas Inclusas'],
        description: 'Casa bem localizada em bairro seguro de Petrolina, próximo a padarias, restaurantes, academias e farmácias. Suíte privativa com ar condicionado, cama confortável e toda a estrutura para o seu bem-estar.',
        order: 2
    },
    {
        id: 'quarto-3',
        type: 'room',
        name: 'Espaço Studio Climatizado Centro',
        age: 150, // RateDaily
        hair: 'Centro', // Neighborhood
        eyes: 'Petrolina/PE', // City/State
        rateQuick: 0,
        rateHalf: 0,
        rateHour: 0,
        whatsapp: '5575982897249',
        badge: 'Novidade',
        availability: 'disponivel',
        image: 'assets/room_studio_3.png',
        storyVideo: 'assets/video.mp4',
        gallery: ['assets/room_studio_3.png'],
        services: ['Câmeras de Segurança', 'Ar Condicionado', 'Cama de Casal', 'Acesso Independente', 'Wi-Fi', 'Organização Diária'],
        description: 'Ambiente moderno e discreto, perfeito para profissionais que precisam de um local pronto para receber clientes com elegância e profissionalismo. Localizado na área central de Petrolina.',
        order: 3
    },
    {
        id: 'quarto-4',
        type: 'room',
        name: 'Suíte Executiva com Câmera e Wi-Fi',
        age: 140, // RateDaily
        hair: 'Centro', // Neighborhood
        eyes: 'Petrolina/PE', // City/State
        rateQuick: 0,
        rateHalf: 0,
        rateHour: 0,
        whatsapp: '5575982897249',
        badge: '',
        availability: 'ocupada',
        image: 'assets/room_suite_4.png',
        storyVideo: 'assets/casa.mp4',
        gallery: ['assets/room_suite_4.png'],
        services: ['Ar Condicionado', 'Wi-Fi 5G', 'Local Monitorado', 'Cama de Casal', 'Guarda-Roupas', 'Chuveiro Quente'],
        description: 'Quarto climatizado com internet ultra-rápida. Ideal tanto para hospedagem quanto para sublocação por diária. Banheiro privativo e ambiente rigorosamente higienizado.',
        order: 4
    }
];

const DEFAULT_GIRLS = [
    {
        id: 'girl-1',
        type: 'girl',
        name: 'Sophia Rossi',
        age: 22,
        hair: 'Loira',
        eyes: 'Verdes',
        rateQuick: 150,
        rateHalf: 450,
        rateHour: 250,
        whatsapp: '5575982897249',
        badge: 'VIP',
        availability: 'disponivel',
        image: 'assets/model_sophia.png',
        storyVideo: 'assets/video.mp4',
        gallery: ['assets/model_sophia.png'],
        services: ['Acompanhamento', 'Massagem', 'Viagens', 'Jantar'],
        description: 'Sophia Rossi é uma loira carismática de olhos verdes, simpática, educada e pronta para te proporcionar momentos únicos com total discrição.',
        order: 1
    },
    {
        id: 'girl-2',
        type: 'girl',
        name: 'Valentina Rossi',
        age: 24,
        hair: 'Morena',
        eyes: 'Castanhos',
        rateQuick: 130,
        rateHalf: 350,
        rateHour: 200,
        whatsapp: '5575982897249',
        badge: 'Destaque',
        availability: 'disponivel',
        image: 'assets/model_valentina.png',
        storyVideo: 'assets/casa.mp4',
        gallery: ['assets/model_valentina.png'],
        services: ['Atendimento Privado', 'Viagens', 'Jantar', 'Massagem Relaxante'],
        description: 'Valentina é uma morena de curvas marcantes, simpática, discreta e extremamente atenciosa. Venha compartilhar momentos agradáveis.',
        order: 2
    },
    {
        id: 'girl-3',
        type: 'girl',
        name: 'Isabella Santos',
        age: 20,
        hair: 'Ruiva',
        eyes: 'Azuis',
        rateQuick: 140,
        rateHalf: 400,
        rateHour: 220,
        whatsapp: '5575982897249',
        badge: 'Novidade',
        availability: 'disponivel',
        image: 'assets/model_isabella.png',
        storyVideo: 'assets/video.mp4',
        gallery: ['assets/model_isabella.png'],
        services: ['Massagem Sensorial', 'Acompanhamento', 'Festas', 'Discreta'],
        description: 'Uma ruiva charmosa de olhos azuis. Muito carinhosa, atenciosa e divertida. Perfeita para quem busca ótima companhia.',
        order: 3
    },
    {
        id: 'girl-4',
        type: 'girl',
        name: 'Gabriela Lima',
        age: 23,
        hair: 'Morena',
        eyes: 'Castanhos',
        rateQuick: 120,
        rateHalf: 300,
        rateHour: 180,
        whatsapp: '5575982897249',
        badge: '',
        availability: 'disponivel',
        image: 'assets/model_gabriela.png',
        storyVideo: 'assets/casa.mp4',
        gallery: ['assets/model_gabriela.png'],
        services: ['Atendimento Discreto', 'Massagem Clássica', 'Jantar e Eventos'],
        description: 'Gabriela Lima é carismática, discreta e focada no seu relaxamento e bem-estar. Venha nos visitar e agende um horário.',
        order: 4
    }
];

const DataService = {
    init() {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        const combinedDefaults = [
            ...DEFAULT_ROOMS,
            ...DEFAULT_GIRLS
        ];
        if (!data) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(combinedDefaults));
            return combinedDefaults;
        }
        try {
            let parsed = JSON.parse(data);
            // Verify if stored data needs cleanup or upgrade
            if (parsed.length > 0 && parsed.some(item => item.name && (item.name.includes("Sophia Smith") || item.name.includes("Valentina Rossi") || item.id.startsWith("sophia-")))) {
                console.log("Old model database detected. Upgrading to combined list...");
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(combinedDefaults));
                return combinedDefaults;
            }

            let changed = false;
            // Map items to ensure type exists
            parsed = parsed.map(item => {
                if (!item.type) {
                    changed = true;
                    if (item.id.startsWith('girl-') || item.id.startsWith('menina-') || (item.image && item.image.includes('model_'))) {
                        return { ...item, type: 'girl' };
                    } else {
                        return { ...item, type: 'room' };
                    }
                }
                return item;
            });

            // Check if there are no girls in the database
            const hasGirls = parsed.some(item => item.type === 'girl');
            if (!hasGirls) {
                console.log("No girls found in database, adding defaults...");
                parsed = [...parsed, ...DEFAULT_GIRLS];
                changed = true;
            }

            if (changed) {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
            }
            return parsed;
        } catch (e) {
            console.error("Error reading storage, resetting...", e);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(combinedDefaults));
            return combinedDefaults;
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
    add(room) {
        const list = this.getAll();
        const newRoom = {
            ...room,
            id: room.id || (room.type === 'girl' ? 'girl-' : 'room-') + Date.now()
        };
        list.push(newRoom);
        this.saveAll(list);
        return newRoom;
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
        const room = this.getById(id);
        if (!room) return null;
        const newAvailability = room.availability === 'disponivel' ? 'ocupada' : 'disponivel';
        this.update(id, { availability: newAvailability });
        return newAvailability;
    },
    reset() {
        const combinedDefaults = [
            ...DEFAULT_ROOMS,
            ...DEFAULT_GIRLS
        ];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(combinedDefaults));
        return combinedDefaults;
    }
};

// --- Helper function for amenity icons ---
function getServiceIcon(service) {
    const s = service.toLowerCase();
    if (s.includes('wifi') || s.includes('wi-fi') || s.includes('internet')) return '<i class="fa-solid fa-wifi" style="margin-right: 6px;"></i>';
    if (s.includes('ar condicionado') || s.includes('ar-condicionado') || s.includes('clima') || s.includes('ar climatizado')) return '<i class="fa-solid fa-snowflake" style="margin-right: 6px;"></i>';
    if (s.includes('cama')) return '<i class="fa-solid fa-bed" style="margin-right: 6px;"></i>';
    if (s.includes('seguro') || s.includes('segurança') || s.includes('câmera') || s.includes('camera') || s.includes('monitorado')) return '<i class="fa-solid fa-shield-halved" style="margin-right: 6px;"></i>';
    if (s.includes('guarda-roupa') || s.includes('armário') || s.includes('guarda')) return '<i class="fa-solid fa-door-closed" style="margin-right: 6px;"></i>';
    if (s.includes('toalha') || s.includes('banho') || s.includes('chuveiro') || s.includes('quente')) return '<i class="fa-solid fa-shower" style="margin-right: 6px;"></i>';
    return '<i class="fa-solid fa-circle-check" style="margin-right: 6px;"></i>';
}

// --- 2. Dynamic Components Rendering Templates ---

// 2.2 Room/Girl Card Template
const GirlCard = {
    html(room) {
        const isGirl = room.type === 'girl';
        let badgeHtml = '';
        if (room.badge) {
            let badgeClass = 'badge-standard';
            if (room.badge.toUpperCase() === 'VIP') badgeClass = 'badge-gold';
            else if (room.badge.toUpperCase() === 'NOVIDADE') badgeClass = 'badge-magenta';
            badgeHtml += `<span class="badge ${badgeClass}">${room.badge}</span>`;
        }

        const isAvailable = room.availability === 'disponivel';
        const statusHtml = isAvailable 
            ? `<div class="status-dot-badge"><span class="dot-green"></span> Disponível</div>`
            : `<div class="status-dot-badge"><span class="dot-red"></span> Reservado</div>`;

        const favoritesKey = isGirl ? 'marias_favorite_girls' : 'marias_favorite_rooms';
        const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
        const isFavorited = favorites.includes(room.id);

        let priceHtml = '';
        let infoHtml = '';

        if (isGirl) {
            priceHtml = `R$ ${room.rateHour || 250},00 <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-secondary);">Cachê (1h)</span>`;
            infoHtml = `<i class="fa-solid fa-user" style="color: var(--color-accent); margin-right: 4px;"></i> ${room.age} anos — Cabelo ${room.hair} — Olhos ${room.eyes}`;
        } else {
            priceHtml = `R$ ${room.age || 140},00 <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-secondary);">Por diária</span>`;
            infoHtml = `<i class="fa-solid fa-location-dot" style="color: var(--color-accent); margin-right: 4px;"></i> ${room.eyes} — ${room.hair}`;
        }

        return `
            <div class="girl-card" data-id="${room.id}">
                <div class="girl-card-img-wrapper">
                    <img src="${room.image || 'assets/room_premium_1.png'}" alt="${room.name}" class="girl-card-img" loading="lazy">
                    <div class="girl-card-overlay"></div>
                    <div class="card-badges">${badgeHtml}</div>
                    <div class="card-status">${statusHtml}</div>
                </div>
                <div class="girl-card-content">
                    <h3 class="girl-card-name" style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; line-height: 1.4; color: #FFF; min-height: 44px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${room.name}</h3>
                    <div class="girl-card-price" style="color: var(--color-gold); font-weight: 700; margin-bottom: 8px; font-size: 1.25rem;">
                        ${priceHtml}
                    </div>
                    <div class="girl-card-location" style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;">
                        ${infoHtml}
                    </div>
                    <div class="girl-card-footer" style="margin-top: auto; display: flex; gap: 10px; align-items: center;">
                        <button class="girl-card-btn view-profile-btn" data-id="${room.id}" style="flex: 1; justify-content: center; text-align: center; font-size: 0.85rem; padding: 10px 15px;">
                            Ver Detalhes <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>
                        </button>
                        <button class="favorite-card-btn ${isFavorited ? 'favorited' : ''}" data-id="${room.id}" style="flex-shrink: 0; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: ${isFavorited ? 'var(--color-accent)' : 'var(--text-muted)'}; cursor: pointer; transition: 0.2s;" title="Favoritar">
                            <i class="${isFavorited ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
};

// 2.3 Room/Girl Details Modal
const ProfileModal = {
    html(room) {
        const isGirl = room.type === 'girl';
        const servicesHtml = room.services.map(service => 
            `<span class="service-tag" style="display: inline-flex; align-items: center;">${getServiceIcon(service)} ${service.trim()}</span>`
        ).join('');

        const isAvailable = room.availability === 'disponivel';
        const availabilityBadgeHtml = isAvailable
            ? `<div class="status-dot-badge"><span class="dot-green"></span> Disponível</div>`
            : `<div class="status-dot-badge"><span class="dot-red"></span> Reservado / Ocupado</div>`;

        const defaultMsg = isGirl 
            ? `Olá! Vi seu perfil '${room.name}' no site da Casa das Marias e gostaria de consultar sua disponibilidade para um agendamento.` 
            : `Olá! Vi o anúncio do quarto '${room.name}' no site da Casa das Marias e gostaria de consultar a disponibilidade para reserva.`;
        const encodedText = encodeURIComponent(defaultMsg);
        const cleanedPhone = room.whatsapp.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodedText}`;

        const galleryList = room.gallery || [];
        const galleryHtml = galleryList.length > 0 
            ? `
            <div class="profile-gallery-section">
                <h4>Galeria de Fotos</h4>
                <div class="profile-gallery-grid">
                    ${galleryList.map((photo, index) => `
                        <div class="profile-gallery-item" data-index="${index}">
                            <img src="${photo}" alt="Foto ${index + 1} de ${room.name}" class="gallery-thumbnail">
                        </div>
                    `).join('')}
                </div>
            </div>`
            : '';

        let specsHtml = '';
        if (isGirl) {
            specsHtml = `
                <div class="spec-box">
                    <span>30 Minutos</span>
                    <p>R$ ${room.rateQuick || 150},00</p>
                </div>
                <div class="spec-box">
                    <span>1 Hora</span>
                    <p>R$ ${room.rateHour || 250},00</p>
                </div>
                <div class="spec-box">
                    <span>Cabelo</span>
                    <p>${room.hair}</p>
                </div>
                <div class="spec-box">
                    <span>Olhos</span>
                    <p>${room.eyes}</p>
                </div>
            `;
        } else {
            specsHtml = `
                <div class="spec-box">
                    <span>Diária</span>
                    <p>R$ ${room.age},00</p>
                </div>
                <div class="spec-box">
                    <span>Bairro</span>
                    <p>${room.hair}</p>
                </div>
                <div class="spec-box">
                    <span>Cidade/UF</span>
                    <p>${room.eyes}</p>
                </div>
                <div class="spec-box">
                    <span>Estrutura</span>
                    <p>Premium</p>
                </div>
            `;
        }

        const detailsTitle = isGirl ? 'Sobre Mim' : 'Sobre o Quarto';
        const servicesTitle = isGirl ? 'Serviços & Atributos' : 'Comodidades Inclusas';
        const buttonText = isGirl ? `Agendar com ${room.name}` : 'Reservar este Quarto';
        const subLocation = isGirl 
            ? `<i class="fa-solid fa-venus" style="color: var(--color-accent); margin-right: 4px;"></i> ${room.age} anos — Cabelo ${room.hair} — Olhos ${room.eyes}` 
            : `<i class="fa-solid fa-location-dot" style="color: var(--color-accent); margin-right: 4px;"></i> ${room.eyes} — ${room.hair}`;

        return `
            <div class="profile-detail-grid" data-girl-id="${room.id}">
                <div class="profile-detail-img-wrapper">
                    <img src="${room.image || 'assets/room_premium_1.png'}" alt="${room.name}" class="profile-detail-img">
                </div>
                <div class="profile-detail-info">
                    <div class="profile-detail-header">
                        <div class="profile-detail-header-left">
                            <h3>${room.name}</h3>
                            <div class="girl-card-location" style="margin-bottom: 0;">${subLocation}</div>
                            <div class="profile-tags" style="margin-top: 8px;">
                                <span class="badge badge-verified"><i class="fa-solid fa-circle-check"></i> ${isGirl ? 'Perfil Verificado' : 'Higienizado & Seguro'}</span>
                                ${room.badge ? `<span class="badge ${room.badge.toUpperCase() === 'VIP' ? 'badge-gold' : 'badge-magenta'}">${room.badge}</span>` : ''}
                            </div>
                        </div>
                        <div class="profile-detail-header-right">
                            ${availabilityBadgeHtml}
                        </div>
                    </div>
                    <div class="profile-detail-specs">
                        ${specsHtml}
                    </div>
                    <div class="profile-bio">
                        <h4>${detailsTitle}</h4>
                        <p>${room.description}</p>
                    </div>
                    <div class="profile-services">
                        <h4>${servicesTitle}</h4>
                        <div class="services-list">
                            ${servicesHtml}
                        </div>
                    </div>
                    ${galleryHtml}
                    <a href="${whatsappUrl}" target="_blank" class="btn btn-primary wa-booking-btn btn-glow" style="margin-top: 15px;">
                        <i class="fa-brands fa-whatsapp"></i> ${buttonText}
                    </a>
                </div>
            </div>
        `;
    }
};

// 2.4 Administrative Dashboard
const AdminDashboard = {
    render(containerElement, rooms) {
        if (!containerElement) return;

        const roomsList = rooms.filter(item => item.type === 'room');
        const girlsList = rooms.filter(item => item.type === 'girl');

        const totalRoomsCount = roomsList.length;
        const availableRoomsCount = roomsList.filter(g => g.availability === 'disponivel').length;
        const busyRoomsCount = totalRoomsCount - availableRoomsCount;

        const totalGirlsCount = girlsList.length;
        const availableGirlsCount = girlsList.filter(g => g.availability === 'disponivel').length;
        const busyGirlsCount = totalGirlsCount - availableGirlsCount;

        const activeAdminTab = localStorage.getItem('marias_active_admin_tab') || 'models-tab';

        // Render Room Rows
        const roomRowsHtml = roomsList.map(room => {
            const isAvailable = room.availability === 'disponivel';
            const statusClass = isAvailable ? 'dot-green' : 'dot-red';
            const statusLabel = isAvailable ? 'Disponível' : 'Ocupado';
            
            let badgeMarkup = '<span class="text-muted">—</span>';
            if (room.badge) {
                const badgeClass = room.badge.toUpperCase() === 'VIP' ? 'badge-gold' : 'badge-magenta';
                badgeMarkup = `<span class="badge ${badgeClass} badge-row">${room.badge}</span>`;
            }

            return `
                <tr data-id="${room.id}">
                    <td>
                        <div class="admin-table-model-info">
                            <img src="${room.image || 'assets/room_premium_1.png'}" alt="${room.name}" class="admin-table-avatar">
                            <div>
                                <div class="admin-table-model-name">${room.name}</div>
                                <div class="admin-table-model-sub">Ordem: ${room.order || 99} | WhatsApp: +${room.whatsapp}</div>
                            </div>
                        </div>
                    </td>
                    <td>R$ ${room.age},00</td>
                    <td>
                        <div>${room.hair} / ${room.eyes}</div>
                    </td>
                    <td>${badgeMarkup}</td>
                    <td>
                        <div class="status-indicator toggle-status-btn" data-id="${room.id}">
                            <span class="${statusClass}"></span>
                            <span>${statusLabel}</span>
                        </div>
                    </td>
                    <td>
                        <div class="admin-actions">
                            <button class="admin-action-btn btn-edit edit-girl-btn" data-id="${room.id}" title="Editar Quarto">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="admin-action-btn btn-delete delete-girl-btn" data-id="${room.id}" title="Excluir Quarto">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Render Girl Rows
        const girlRowsHtml = girlsList.map(girl => {
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
                    <td>R$ ${girl.rateQuick || 150} / R$ ${girl.rateHour || 250}</td>
                    <td>
                        <div>${girl.age} anos | ${girl.hair} | ${girl.eyes}</div>
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

        // Render Story Card helper
        function renderStoryManageCard(item) {
            const hasStory = item.storyVideo && item.storyVideo.trim() !== '';
            let previewHtml = '';
            if (hasStory) {
                const isVideo = !item.storyVideo.startsWith('data:image/') && !item.storyVideo.match(/\.(jpeg|jpg|gif|png|webp|bmp)($|\?)/i);
                if (isVideo) {
                    previewHtml = `<video src="${item.storyVideo}" muted autoplay loop playsinline class="story-preview-thumb"></video>`;
                } else {
                    previewHtml = `<img src="${item.storyVideo}" class="story-preview-thumb">`;
                }
            } else {
                previewHtml = `<div class="story-preview-placeholder"><i class="fa-solid fa-video-slash"></i><span>Sem Tour</span></div>`;
            }

            return `
                <div class="story-manage-card glass-panel" data-id="${item.id}">
                    <div class="story-manage-header">
                        <img src="${item.image || 'assets/room_premium_1.png'}" alt="${item.name}" class="story-manage-avatar">
                        <div class="story-manage-name-box">
                            <h4>${item.name}</h4>
                            <span>${hasStory ? '<span class="status-active"><span class="dot-green"></span> Tour Ativo</span>' : '<span class="status-inactive"><span class="dot-gray"></span> Sem Vídeo</span>'}</span>
                        </div>
                    </div>
                    <div class="story-manage-body">
                        <div class="story-preview-container">
                            ${previewHtml}
                            ${hasStory ? `<span class="story-badge-type">${item.storyVideo.startsWith('data:image/') || item.storyVideo.match(/\.(jpeg|jpg|gif|png|webp|bmp)($|\?)/i) ? 'Foto' : 'Vídeo'}</span>` : ''}
                        </div>
                    </div>
                    <div class="story-manage-actions">
                        <input type="file" id="direct-story-input-${item.id}" accept="image/*,video/*" style="display:none;" class="direct-story-file-input" data-id="${item.id}">
                        <button class="btn btn-primary btn-sm btn-glow trigger-direct-upload-btn" data-id="${item.id}">
                            <i class="fa-solid fa-upload"></i> ${hasStory ? 'Alterar Vídeo' : 'Carregar Vídeo'}
                        </button>
                        ${hasStory ? `
                        <button class="btn btn-danger btn-sm remove-direct-story-btn" data-id="${item.id}" title="Excluir Story">
                            <i class="fa-solid fa-trash-can"></i> Remover
                        </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        containerElement.innerHTML = `
            <div class="admin-view-header">
                <div>
                    <h2>Painel Administrativo</h2>
                    <p class="section-subtitle" style="text-align: left; margin: 5px 0 0 0;">Gerencie os anúncios e controle os tours virtuais em tempo real.</p>
                </div>
                <div class="admin-header-actions">
                    <button class="btn btn-secondary reset-db-btn" id="admin-reset-btn">
                        <i class="fa-solid fa-arrow-rotate-left"></i> Resetar Padrão
                    </button>
                    <button class="btn btn-primary btn-glow ${activeAdminTab === 'models-tab' ? '' : 'hidden'}" id="admin-add-btn">
                        <i class="fa-solid fa-plus"></i> Adicionar Quarto
                    </button>
                    <button class="btn btn-primary btn-glow ${activeAdminTab === 'girls-tab' ? '' : 'hidden'}" id="admin-add-girl-btn">
                        <i class="fa-solid fa-plus"></i> Adicionar Menina
                    </button>
                    <button class="btn btn-secondary" id="admin-back-btn">
                        <i class="fa-solid fa-house"></i> Voltar ao Site
                    </button>
                </div>
            </div>

            <!-- Admin Tabs -->
            <div class="admin-tabs">
                <button class="admin-tab-btn ${activeAdminTab === 'models-tab' ? 'active' : ''}" data-tab="models-tab">
                    <i class="fa-solid fa-bed"></i> Gerenciar Quartos
                </button>
                <button class="admin-tab-btn ${activeAdminTab === 'girls-tab' ? 'active' : ''}" data-tab="girls-tab">
                    <i class="fa-solid fa-venus"></i> Gerenciar Meninas
                </button>
                <button class="admin-tab-btn ${activeAdminTab === 'stories-tab' ? 'active' : ''}" data-tab="stories-tab">
                    <i class="fa-solid fa-circle-play"></i> Gerenciar Tours (Stories)
                </button>
            </div>

            <!-- Tab 1: Rooms Table -->
            <div id="models-tab" class="admin-tab-content ${activeAdminTab === 'models-tab' ? '' : 'hidden'}">
                <!-- Stats Bar -->
                <div class="admin-stats-bar">
                    <div class="glass-panel stat-card">
                        <div class="stat-card-icon"><i class="fa-solid fa-bed"></i></div>
                        <div class="stat-card-info">
                            <span>Total de Quartos</span>
                            <h4>${totalRoomsCount}</h4>
                        </div>
                    </div>
                    <div class="glass-panel stat-card">
                        <div class="stat-card-icon"><i class="fa-solid fa-circle-check"></i></div>
                        <div class="stat-card-info">
                            <span>Disponíveis</span>
                            <h4>${availableRoomsCount}</h4>
                        </div>
                    </div>
                    <div class="glass-panel stat-card">
                        <div class="stat-card-icon"><i class="fa-solid fa-circle-xmark"></i></div>
                        <div class="stat-card-info">
                            <span>Reservados / Ocupados</span>
                            <h4>${busyRoomsCount}</h4>
                        </div>
                    </div>
                </div>

                <!-- Management Table -->
                <div class="glass-panel admin-table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Quarto</th>
                                <th>Preço Diária</th>
                                <th>Localização</th>
                                <th>Selo</th>
                                <th>Status (Disponibilidade)</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="admin-table-body">
                            ${roomRowsHtml || `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">Nenhum quarto cadastrado. Clique em "Adicionar Quarto" para começar.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Tab 2: Girls Table -->
            <div id="girls-tab" class="admin-tab-content ${activeAdminTab === 'girls-tab' ? '' : 'hidden'}">
                <!-- Stats Bar -->
                <div class="admin-stats-bar">
                    <div class="glass-panel stat-card">
                        <div class="stat-card-icon"><i class="fa-solid fa-venus"></i></div>
                        <div class="stat-card-info">
                            <span>Total de Meninas</span>
                            <h4>${totalGirlsCount}</h4>
                        </div>
                    </div>
                    <div class="glass-panel stat-card">
                        <div class="stat-card-icon"><i class="fa-solid fa-circle-check"></i></div>
                        <div class="stat-card-info">
                            <span>Disponíveis</span>
                            <h4>${availableGirlsCount}</h4>
                        </div>
                    </div>
                    <div class="glass-panel stat-card">
                        <div class="stat-card-icon"><i class="fa-solid fa-circle-xmark"></i></div>
                        <div class="stat-card-info">
                            <span>Reservadas / Ocupadas</span>
                            <h4>${busyGirlsCount}</h4>
                        </div>
                    </div>
                </div>

                <!-- Management Table -->
                <div class="glass-panel admin-table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Menina</th>
                                <th>Cachê (30m / 1h)</th>
                                <th>Características</th>
                                <th>Selo</th>
                                <th>Status (Disponibilidade)</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="admin-girls-table-body">
                            ${girlRowsHtml || `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">Nenhuma menina cadastrada. Clique em "Adicionar Menina" para começar.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Tab 3: Stories Manager -->
            <div id="stories-tab" class="admin-tab-content ${activeAdminTab === 'stories-tab' ? '' : 'hidden'}">
                <div class="stories-manager-intro" style="margin-bottom: 20px;">
                    <h3>Gerenciador de Tours Virtuais (Stories)</h3>
                    <p>Poste fotos ou vídeos verticais curtos do tour de cada quarto ou perfil de menina para os visitantes visualizarem no topo do site.</p>
                </div>
                
                <h4 style="margin: 20px 0 10px 0; color: var(--color-gold); font-size: 1.15rem; font-family: var(--font-heading);"><i class="fa-solid fa-bed"></i> Tours dos Quartos</h4>
                <div class="stories-manager-grid" style="margin-bottom: 30px;">
                    ${roomsList.map(item => renderStoryManageCard(item)).join('') || '<p class="text-muted" style="grid-column: 1/-1;">Nenhum quarto disponível.</p>'}
                </div>

                <h4 style="margin: 20px 0 10px 0; color: var(--color-gold); font-size: 1.15rem; font-family: var(--font-heading);"><i class="fa-solid fa-venus"></i> Tours das Meninas</h4>
                <div class="stories-manager-grid">
                    ${girlsList.map(item => renderStoryManageCard(item)).join('') || '<p class="text-muted" style="grid-column: 1/-1;">Nenhuma menina disponível.</p>'}
                </div>
            </div>
        `;
    }
};

// --- 3. App Core Event Loop Coordinators ---

let currentCompanions = []; // matches original variable to preserve other components
let activeFilter = 'all';
let searchQuery = '';
let showFavoritesOnly = false;

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
    
    const pageType = document.body.dataset.page || 'rooms';
    const targetType = pageType === 'girls' ? 'girl' : 'room';

    // Sort by order priority (smaller numbers first, default to 99)
    let sorted = [...currentCompanions].sort((a, b) => (a.order || 99) - (b.order || 99));
    
    // Filter by type
    let filtered = sorted.filter(item => item.type === targetType);

    if (showFavoritesOnly) {
        const favoritesKey = targetType === 'girl' ? 'marias_favorite_girls' : 'marias_favorite_rooms';
        const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
        filtered = filtered.filter(room => favorites.includes(room.id));
    }
    
    if (activeFilter !== 'all') {
        filtered = filtered.filter(room => {
            if (pageType === 'girls') {
                if (activeFilter === 'Loira') return room.hair.toLowerCase().includes('loira');
                if (activeFilter === 'Morena') return room.hair.toLowerCase().includes('morena');
                if (activeFilter === 'Ruiva') return room.hair.toLowerCase().includes('ruiva');
                if (activeFilter === 'VIP') return room.badge && room.badge.toUpperCase() === 'VIP';
                if (activeFilter === 'Novidade') return room.badge && room.badge.toUpperCase() === 'NOVIDADE';
            } else {
                if (activeFilter === 'Centro') return room.hair.toLowerCase().includes('centro');
                if (activeFilter === 'Jardim Amazonas') return room.hair.toLowerCase().includes('jardim') || room.hair.toLowerCase().includes('amazonas');
                if (activeFilter === 'VIP') return room.badge && room.badge.toUpperCase() === 'VIP';
                if (activeFilter === 'Novidade') return room.badge && room.badge.toUpperCase() === 'NOVIDADE';
                if (activeFilter === 'Climatizado') {
                    return room.services.some(s => s.toLowerCase().includes('ar') || s.toLowerCase().includes('clima'));
                }
            }
            return true;
        });
    }
    
    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(room => 
            room.name.toLowerCase().includes(query) || 
            room.hair.toLowerCase().includes(query) ||
            room.eyes.toLowerCase().includes(query) ||
            room.services.some(s => s.toLowerCase().includes(query))
        );
    }
    
    if (filtered.length === 0) {
        const msg = showFavoritesOnly 
            ? (targetType === 'girl' ? 'Você ainda não salvou nenhuma menina nos favoritos.' : 'Você ainda não salvou nenhum quarto nos favoritos.') 
            : (targetType === 'girl' ? 'Nenhuma menina encontrada correspondendo aos seus critérios.' : 'Nenhum quarto encontrado correspondendo aos seus critérios.');
        companionsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <i class="fa-solid fa-${targetType === 'girl' ? 'venus' : 'bed'}" style="font-size: 2.5rem; margin-bottom: 15px; color: rgba(255,255,255,0.1)"></i>
                <p>${msg}</p>
            </div>
        `;
        return;
    }
    
    companionsGrid.innerHTML = filtered.map(room => GirlCard.html(room)).join('');
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
    // Mobile Navigation Drawer
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

    // Smooth scroll for all hash anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#' || anchor.classList.contains('admin-trigger')) return;
        
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            if (adminView && !adminView.classList.contains('hidden')) {
                switchView('portfolio');
            }
            
            let targetId = href.substring(1);
            if (targetId === 'models') targetId = 'portfolio-view';
            
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                
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

    // Grid Open Modal or Favorite Clicks
    if (companionsGrid) {
        companionsGrid.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('.view-profile-btn');
            const favCardBtn = e.target.closest('.favorite-card-btn');
            const card = e.target.closest('.girl-card');
            
            if (favCardBtn) {
                e.stopPropagation();
                const roomId = favCardBtn.getAttribute('data-id');
                toggleFavoriteRoom(roomId, favCardBtn);
                return;
            }

            if (card && !e.target.closest('.girl-card-btn') && !e.target.closest('.favorite-card-btn')) {
                const roomId = card.getAttribute('data-id');
                openProfileDetails(roomId);
            } else if (viewBtn) {
                const roomId = viewBtn.getAttribute('data-id');
                openProfileDetails(roomId);
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

    // Mobile Bottom Navigation Bar Setup Events (Reference Screenshot layout)
    const btnGirls = document.getElementById('bottom-nav-girls');
    const btnHome = document.getElementById('bottom-nav-home');
    const btnAdd = document.getElementById('bottom-nav-add');
    const btnRooms = document.getElementById('bottom-nav-rooms');
    const btnMenu = document.getElementById('bottom-nav-menu');

    const currentPage = document.body.dataset.page || 'rooms';

    function selectBottomTab(selectedElement) {
        document.querySelectorAll('.mobile-bottom-nav-item').forEach(item => item.classList.remove('active'));
        if (selectedElement) selectedElement.classList.add('active');
    }

    if (btnGirls) {
        btnGirls.addEventListener('click', () => {
            if (currentPage === 'girls') {
                showFavoritesOnly = false;
                activeFilter = 'all';
                searchQuery = '';
                if (searchInput) searchInput.value = '';
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                const filterAllBtn = document.querySelector('.filter-btn[data-filter="all"]');
                if (filterAllBtn) filterAllBtn.classList.add('active');
                
                if (adminView && !adminView.classList.contains('hidden')) {
                    switchView('portfolio');
                }
                selectBottomTab(btnGirls);
                renderPortfolioGrid();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                window.location.href = 'girls.html';
            }
        });
    }

    if (btnHome) {
        btnHome.addEventListener('click', () => {
            if (currentPage === 'rooms') {
                showFavoritesOnly = false;
                activeFilter = 'all';
                searchQuery = '';
                if (searchInput) searchInput.value = '';
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                const filterAllBtn = document.querySelector('.filter-btn[data-filter="all"]');
                if (filterAllBtn) filterAllBtn.classList.add('active');
                
                if (adminView && !adminView.classList.contains('hidden')) {
                    switchView('portfolio');
                }
                selectBottomTab(btnHome);
                renderPortfolioGrid();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    if (btnAdd) {
        btnAdd.addEventListener('click', () => {
            // Directly request Admin Authentication to Add
            authPasswordInput.value = '';
            authErrorMsg.classList.add('hidden');
            authModal.classList.remove('hidden');
            authPasswordInput.focus();
        });
    }

    if (btnRooms) {
        btnRooms.addEventListener('click', () => {
            if (currentPage === 'rooms') {
                showFavoritesOnly = false;
                if (adminView && !adminView.classList.contains('hidden')) {
                    switchView('portfolio');
                }
                selectBottomTab(btnRooms);
                renderPortfolioGrid();
                const target = document.getElementById('portfolio-view');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.location.href = 'index.html#portfolio-view';
            }
        });
    }

    if (btnMenu) {
        btnMenu.addEventListener('click', () => {
            // Toggles navigation sidebar drawer
            if (sidebarDrawer && drawerOverlay) {
                sidebarDrawer.classList.add('active');
                drawerOverlay.classList.add('active');
            }
        });
    }

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
                openAddForm('room');
                return;
            }

            const addGirlBtn = e.target.closest('#admin-add-girl-btn');
            if (addGirlBtn) {
                openAddForm('girl');
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

                // Adjust Add button visibility based on active tab
                const roomAddBtn = document.getElementById('admin-add-btn');
                const girlAddBtn = document.getElementById('admin-add-girl-btn');
                if (tabId === 'models-tab') {
                    if (roomAddBtn) roomAddBtn.classList.remove('hidden');
                    if (girlAddBtn) girlAddBtn.classList.add('hidden');
                } else if (tabId === 'girls-tab') {
                    if (roomAddBtn) roomAddBtn.classList.add('hidden');
                    if (girlAddBtn) girlAddBtn.classList.remove('hidden');
                } else {
                    if (roomAddBtn) roomAddBtn.classList.add('hidden');
                    if (girlAddBtn) girlAddBtn.classList.add('hidden');
                }
                return;
            }

            const triggerBtn = e.target.closest('.trigger-direct-upload-btn');
            if (triggerBtn) {
                const roomId = triggerBtn.getAttribute('data-id');
                const fileInput = document.getElementById(`direct-story-input-${roomId}`);
                if (fileInput) fileInput.click();
                return;
            }

            const removeBtn = e.target.closest('.remove-direct-story-btn');
            if (removeBtn) {
                const roomId = removeBtn.getAttribute('data-id');
                const room = DataService.getById(roomId);
                if (room && confirm(`Deseja realmente remover o tour de ${room.name}?`)) {
                    DataService.update(roomId, { storyVideo: '' });
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
                const roomId = fileInput.getAttribute('data-id');
                
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
                            alert("Aviso: O vídeo do tour é maior que 2MB. Vídeos muito grandes podem exceder a memória local.");
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

                    DataService.update(roomId, { storyVideo: fileData });
                    currentCompanions = DataService.getAll();
                    renderAdminDashboard();
                    renderStoriesBar();
                    renderPortfolioGrid();
                } catch (err) {
                     console.error("Error processing story upload:", err);
                     alert("Erro ao enviar o tour.");
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

    // Hero Buttons
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
    
    // Hold-to-pause and tap gesture for tours player
    const playerContainer = document.querySelector('.story-player-container');
    if (playerContainer) {
        let touchStartTime = 0;
        let holdTimeout = null;
        let isHolding = false;

        playerContainer.addEventListener('pointerdown', (e) => {
            if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.story-controls-overlay') || e.target.closest('.story-close-btn')) {
                return;
            }
            
            touchStartTime = Date.now();
            isHolding = false;
            
            holdTimeout = setTimeout(() => {
                isHolding = true;
                pauseStoryPlayback();
            }, 250);
        });

        playerContainer.addEventListener('pointerup', (e) => {
            if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.story-controls-overlay') || e.target.closest('.story-close-btn')) {
                return;
            }
            
            if (holdTimeout) clearTimeout(holdTimeout);
            
            if (isHolding) {
                resumeStoryPlayback();
            } else {
                const rect = playerContainer.getBoundingClientRect();
                const tapX = e.clientX - rect.left;
                const percentX = (tapX / rect.width) * 100;
                
                if (percentX < 33) {
                    prevStory();
                } else {
                    nextStory();
                }
            }
        });

        playerContainer.addEventListener('pointerleave', (e) => {
            if (holdTimeout) clearTimeout(holdTimeout);
            if (isHolding) {
                resumeStoryPlayback();
            }
        });
    }
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
                alert("Falha ao carregar a imagem do quarto.");
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
            galleryFilesInput.value = ''; // Reset
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
                        alert("Aviso: O vídeo do tour é maior que 1.5MB. Vídeos muito grandes podem exceder a memória local.");
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
                alert("Falha ao processar o tour.");
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

    // Lightbox for gallery images
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

function toggleFavoriteRoom(roomId, btnElement) {
    const item = DataService.getById(roomId);
    if (!item) return;

    const isGirl = item.type === 'girl';
    const favoritesKey = isGirl ? 'marias_favorite_girls' : 'marias_favorite_rooms';
    
    let favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    const index = favorites.indexOf(roomId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        if (btnElement) {
            btnElement.classList.remove('favorited');
            btnElement.style.color = 'var(--text-muted)';
            const icon = btnElement.querySelector('i');
            if (icon) {
                icon.className = 'fa-regular fa-heart';
            }
        }
    } else {
        favorites.push(roomId);
        if (btnElement) {
            btnElement.classList.add('favorited');
            btnElement.style.color = 'var(--color-accent)';
            const icon = btnElement.querySelector('i');
            if (icon) {
                icon.className = 'fa-solid fa-heart';
            }
        }
    }
    
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    
    // If showFavoritesOnly mode is active, filter the grid
    if (showFavoritesOnly) {
        renderPortfolioGrid();
    }
}

function openProfileDetails(id) {
    const room = DataService.getById(id);
    if (!room) return;

    profileModalContent.innerHTML = ProfileModal.html(room);
    profileModal.classList.remove('hidden');
}

function handleAuthentication() {
    const password = authPasswordInput.value;
    if (password === 'admin123') {
        authModal.classList.add('hidden');
        if (document.getElementById('admin-view')) {
            switchView('admin');
            // If triggered by bottom-nav "+", open add room form instantly
            setTimeout(() => {
                openAddForm();
            }, 100);
        } else {
            sessionStorage.setItem('marias_admin_authenticated', 'true');
            window.location.href = 'index.html';
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
        renderPortfolioGrid();
    }
}

function handleDeleteCompanion(id) {
    const room = DataService.getById(id);
    if (!room) return;

    if (confirm(`Deseja realmente excluir permanentemente o anúncio de ${room.name}?`)) {
        if (DataService.delete(id)) {
            currentCompanions = DataService.getAll();
            renderAdminDashboard();
            renderPortfolioGrid();
            renderStoriesBar();
        }
    }
}

function handleResetDatabase() {
    if (confirm("Isso irá apagar todas as modificações e restaurar os quartos originais. Continuar?")) {
        currentCompanions = DataService.reset();
        renderAdminDashboard();
        renderPortfolioGrid();
        renderStoriesBar();
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

function adjustFormLabels(type) {
    const isGirl = type === 'girl';
    const formTypeInput = document.getElementById('form-item-type');
    if (formTypeInput) formTypeInput.value = type;

    const labelName = document.getElementById('label-form-name');
    const inputName = document.getElementById('form-name');
    const labelAge = document.getElementById('label-form-age');
    const inputAge = document.getElementById('form-age');
    const ratesRow = document.getElementById('form-rates-row');
    const labelHair = document.getElementById('label-form-hair');
    const inputHair = document.getElementById('form-hair');
    const labelEyes = document.getElementById('label-form-eyes');
    const inputEyes = document.getElementById('form-eyes');
    const labelServices = document.getElementById('label-form-services');
    const inputServices = document.getElementById('form-services');
    const labelDesc = document.getElementById('label-form-description');
    const inputDesc = document.getElementById('form-description');

    if (isGirl) {
        if (labelName) labelName.textContent = "Nome Artístico *";
        if (inputName) inputName.placeholder = "Ex: Sophia, Valentina...";
        if (labelAge) labelAge.textContent = "Idade (anos) *";
        if (inputAge) inputAge.placeholder = "Ex: 22";
        if (ratesRow) ratesRow.classList.remove('hidden');
        if (labelHair) labelHair.textContent = "Cor do Cabelo *";
        if (inputHair) inputHair.placeholder = "Ex: Loira, Morena, Ruiva";
        if (labelEyes) labelEyes.textContent = "Cor dos Olhos *";
        if (inputEyes) inputEyes.placeholder = "Ex: Verdes, Castanhos, Azuis";
        if (labelServices) labelServices.textContent = "Serviços/Atributos * (Separados por vírgula)";
        if (inputServices) inputServices.placeholder = "Ex: Massagem, Atendimento Duplo, Dominação, Viagem";
        if (labelDesc) labelDesc.textContent = "Descrição/Apresentação *";
        if (inputDesc) inputDesc.placeholder = "Fale um pouco sobre você, seu estilo de atendimento...";
    } else {
        if (labelName) labelName.textContent = "Título do Anúncio *";
        if (inputName) inputName.placeholder = "Ex: Quarto para atendimentos no Centro";
        if (labelAge) labelAge.textContent = "Preço da Diária (R$) *";
        if (inputAge) inputAge.placeholder = "Ex: 140";
        if (ratesRow) ratesRow.classList.add('hidden');
        if (labelHair) labelHair.textContent = "Bairro / Localidade *";
        if (inputHair) inputHair.placeholder = "Ex: Centro, Jardim Amazonas";
        if (labelEyes) labelEyes.textContent = "Cidade / Estado *";
        if (inputEyes) inputEyes.placeholder = "Ex: Petrolina/PE";
        if (labelServices) labelServices.textContent = "Comodidades * (Separados por vírgula)";
        if (inputServices) inputServices.placeholder = "Ex: Ar Condicionado, Wi-Fi, Cama de Casal, Local Seguro";
        if (labelDesc) labelDesc.textContent = "Descrição Detalhada do Quarto *";
        if (inputDesc) inputDesc.placeholder = "Escreva sobre a estrutura do quarto, localização, regras de uso...";
    }
}

function openAddForm(type = 'room') {
    formModalTitle.textContent = type === 'girl' ? "Adicionar Nova Acompanhante" : "Adicionar Novo Quarto";
    document.getElementById('form-girl-id').value = '';
    companionForm.reset();
    
    adjustFormLabels(type);
    
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
    const room = DataService.getById(id);
    if (!room) return;

    const type = room.type || 'room';
    formModalTitle.textContent = type === 'girl' ? `Editar Perfil - ${room.name}` : `Editar Anúncio - ${room.name}`;
    document.getElementById('form-girl-id').value = room.id;
    
    adjustFormLabels(type);
    
    document.getElementById('form-name').value = room.name;
    document.getElementById('form-age').value = room.age;
    document.getElementById('form-hair').value = room.hair;
    document.getElementById('form-eyes').value = room.eyes;
    document.getElementById('form-whatsapp').value = room.whatsapp;
    document.getElementById('form-badge').value = room.badge;
    document.getElementById('form-image').value = room.image;
    document.getElementById('form-availability').value = room.availability;
    document.getElementById('form-story-video').value = room.storyVideo || '';
    document.getElementById('form-services').value = room.services.join(', ');
    document.getElementById('form-description').value = room.description;
    document.getElementById('form-order').value = room.order || 99;

    if (type === 'girl') {
        document.getElementById('form-rate-quick').value = room.rateQuick || '';
        document.getElementById('form-rate-hour').value = room.rateHour || '';
        document.getElementById('form-rate-half').value = room.rateHalf || '';
    }

    const fileCover = document.getElementById('form-image-file');
    if (fileCover) fileCover.value = '';
    const fileGallery = document.getElementById('form-gallery-files');
    if (fileGallery) fileGallery.value = '';
    const fileStory = document.getElementById('form-story-file');
    if (fileStory) fileStory.value = '';

    const storyUrl = document.getElementById('form-story-url');
    if (storyUrl) {
        const src = room.storyVideo || '';
        storyUrl.value = (src.startsWith('data:') ? '' : src);
    }

    currentFormGallery = [...(room.gallery || [])];
    renderFormGalleryPreview();

    adminFormModal.classList.remove('hidden');
}

function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('form-girl-id').value;
    const type = document.getElementById('form-item-type').value || 'room';
    
    const servicesInput = document.getElementById('form-services').value;
    const servicesArray = servicesInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    const roomData = {
        type: type,
        name: document.getElementById('form-name').value,
        age: parseInt(document.getElementById('form-age').value, 10),
        hair: document.getElementById('form-hair').value,
        eyes: document.getElementById('form-eyes').value,
        whatsapp: document.getElementById('form-whatsapp').value.replace(/\D/g, ''),
        badge: document.getElementById('form-badge').value,
        image: document.getElementById('form-image').value,
        availability: document.getElementById('form-availability').value,
        storyVideo: document.getElementById('form-story-video').value.trim(),
        gallery: currentFormGallery,
        services: servicesArray,
        description: document.getElementById('form-description').value,
        order: parseInt(document.getElementById('form-order').value, 10) || 99
    };

    if (type === 'girl') {
        roomData.rateQuick = parseInt(document.getElementById('form-rate-quick').value, 10) || 150;
        roomData.rateHour = parseInt(document.getElementById('form-rate-hour').value, 10) || 250;
        roomData.rateHalf = parseInt(document.getElementById('form-rate-half').value, 10) || 400;
    } else {
        roomData.rateQuick = 0;
        roomData.rateHour = 0;
        roomData.rateHalf = 0;
    }

    if (id) {
        DataService.update(id, roomData);
    } else {
        if (!roomData.image || roomData.image === '') {
            roomData.image = type === 'girl' ? 'assets/model_sophia.png' : 'assets/room_premium_1.png';
        }
        if (roomData.gallery.length === 0) {
            roomData.gallery.push(roomData.image);
        }
        DataService.add(roomData);
    }

    currentCompanions = DataService.getAll();
    adminFormModal.classList.add('hidden');
    renderAdminDashboard();
    renderPortfolioGrid();
    renderStoriesBar();
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
const STORY_DURATION = 15;
let viewedStories = JSON.parse(localStorage.getItem('marias_viewed_stories') || '[]');

function renderStoriesBar() {
    const storiesContainer = document.getElementById('stories-container');
    if (!storiesContainer) return;

    const pageType = document.body.dataset.page || 'rooms';
    const targetType = pageType === 'girls' ? 'girl' : 'room';

    const activeRooms = [...currentCompanions]
        .filter(room => room.storyVideo && room.storyVideo.trim() !== '' && room.type === targetType)
        .sort((a, b) => (a.order || 99) - (b.order || 99));

    const storiesView = document.getElementById('stories-view');
    if (activeRooms.length === 0) {
        if (storiesView) storiesView.classList.add('hidden');
        return;
    }
    
    if (storiesView) storiesView.classList.remove('hidden');

    storiesContainer.innerHTML = activeRooms.map(room => {
        const hasViewed = viewedStories.includes(room.id);
        const nameShort = room.type === 'girl' ? room.name.split(' ')[0] : room.hair.split(',')[0].trim();
        const viewedClass = hasViewed ? 'viewed' : '';
        
        return `
            <div class="story-item ${viewedClass}" data-id="${room.id}">
                <div class="story-avatar-ring">
                    <img src="${room.image}" alt="${room.name}" loading="lazy">
                    <span class="story-avatar-badge"><i class="fa-solid fa-play"></i></span>
                </div>
                <span class="story-name">${nameShort}</span>
            </div>
        `;
    }).join('');

    storiesContainer.querySelectorAll('.story-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            openStoryPlayer(id);
        });
    });
}

function openStoryPlayer(roomId) {
    const pageType = document.body.dataset.page || 'rooms';
    const targetType = pageType === 'girls' ? 'girl' : 'room';

    activeStoriesList = [...currentCompanions]
        .filter(room => room.storyVideo && room.storyVideo.trim() !== '' && room.type === targetType)
        .sort((a, b) => (a.order || 99) - (b.order || 99));
    currentStoryIndex = activeStoriesList.findIndex(g => g.id === roomId);
    
    if (currentStoryIndex === -1) return;

    const modal = document.getElementById('story-modal');
    if (!modal) return;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Lock scroll
    
    if (!viewedStories.includes(roomId)) {
        viewedStories.push(roomId);
        localStorage.setItem('marias_viewed_stories', JSON.stringify(viewedStories));
        renderStoriesBar();
    }
    
    loadStoryAtIndex(currentStoryIndex);
}

let storyIsImage = false;
let storyIsPaused = false;
let storyElapsedTime = 0;
const STORY_IMAGE_DURATION = 5000;

function loadStoryAtIndex(index) {
    if (index < 0 || index >= activeStoriesList.length) {
        closeStoryPlayer();
        return;
    }

    currentStoryIndex = index;
    const room = activeStoriesList[index];
    
    const video = document.getElementById('story-video');
    const imageEl = document.getElementById('story-image');
    const avatar = document.getElementById('story-header-avatar');
    const name = document.getElementById('story-header-name');
    const bookBtn = document.getElementById('story-book-btn');
    const loader = document.getElementById('story-video-loader');
    const playPauseBtn = document.getElementById('story-play-pause-btn');
    
    if (!video || !imageEl) return;

    video.style.display = 'none';
    imageEl.style.display = 'none';
    if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    storyIsPaused = false;

    if (loader) loader.classList.add('active');

    if (avatar) avatar.src = room.image;
    if (name) name.textContent = room.name;
    
    const isGirl = room.type === 'girl';
    const whatsappText = isGirl 
        ? `Olá! Vi o tour da '${room.name}' no site da Casa das Marias e gostaria de consultar a disponibilidade para agendamento.` 
        : `Olá! Vi o tour do quarto '${room.name}' no site da Casa das Marias e gostaria de consultar a disponibilidade para reserva.`;
    const encodedText = encodeURIComponent(whatsappText);
    const cleanedPhone = room.whatsapp.replace(/\D/g, '');
    if (bookBtn) {
        bookBtn.href = `https://wa.me/${cleanedPhone}?text=${encodedText}`;
        bookBtn.innerHTML = isGirl 
            ? `<i class="fa-brands fa-whatsapp"></i> Falar com ${room.name}`
            : `<i class="fa-brands fa-whatsapp"></i> Reservar este Quarto`;
    }

    renderStoryProgressIndicators();

    const src = room.storyVideo || 'assets/video.mp4';
    storyIsImage = src.startsWith('data:image/') || src.match(/\.(jpeg|jpg|gif|png|webp|bmp)($|\?)/i);

    if (storyIsImage) {
        imageEl.src = src;
        imageEl.style.display = 'block';
        if (loader) loader.classList.remove('active');
        startProgressTracker();
    } else {
        const isMuted = localStorage.getItem('marias_story_muted') !== 'false';
        video.muted = isMuted;
        if (isMuted) {
            video.setAttribute('muted', '');
        } else {
            video.removeAttribute('muted');
        }
        updateAudioButtonUI(isMuted);

        video.src = src;
        video.style.display = 'block';
        video.load();

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

        video.onwaiting = () => { if (loader) loader.classList.add('active'); };
        video.onplaying = () => { if (loader) loader.classList.remove('active'); };
        
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
        if (storyIsPaused) return;

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
        const nextRoom = activeStoriesList[currentStoryIndex + 1];
        if (!viewedStories.includes(nextRoom.id)) {
            viewedStories.push(nextRoom.id);
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
    
    document.body.style.overflow = '';

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

function pauseStoryPlayback() {
    storyIsPaused = true;
    const playPauseBtn = document.getElementById('story-play-pause-btn');
    if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    
    if (!storyIsImage) {
        const video = document.getElementById('story-video');
        if (video) video.pause();
    }
}

function resumeStoryPlayback() {
    storyIsPaused = false;
    const playPauseBtn = document.getElementById('story-play-pause-btn');
    if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    
    if (!storyIsImage) {
        const video = document.getElementById('story-video');
        if (video) {
            video.play().catch(err => console.log("Failed to resume video:", err));
        }
    }
}

function togglePlayPause() {
    if (storyIsPaused) {
        resumeStoryPlayback();
    } else {
        pauseStoryPlayback();
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
