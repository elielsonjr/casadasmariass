/* ==========================================================================
   MARIAS PRIVÉE - MAIN CONTROLLER & APPLICATION ENGINE
   ========================================================================== */

// --- 1. Database Persistence Layer (LocalStorage CRUD) ---
const LOCAL_STORAGE_KEY = 'marias_privee_companions';

const DEFAULT_COMPANIONS = [
    {
        id: 'sophia-1',
        name: 'Sophia Smith',
        age: 23,
        height: 1.68,
        weight: 54,
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
        services: ['Jantar de Negócios', 'Viagens Nacionais/Internacionais', 'Massagem Terapêutica', 'Festas Privadas', 'Companhia Executiva'],
        description: 'Sophia é formada em Relações Públicas, fala inglês fluente e possui uma presença extremamente refinada. Ideal para acompanhá-lo em jantares de gala, eventos corporativos ou uma noite de conversa inteligente com excelente vinho. Seu charme e sofisticação tornam qualquer ocasião memorável.',
        order: 1,
        hideSpecs: false
    },
    {
        id: 'valentina-2',
        name: 'Valentina Rossi',
        age: 25,
        height: 1.72,
        weight: 58,
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
        services: ['Alta Gastronomia', 'Eventos Sociais', 'Fetiche Básico', 'Dança Privada', 'Massagem Relaxante'],
        description: 'Valentina é uma mulher de traços marcantes e sorriso contagiante. Apaixonada por gastronomia e vinhos finos, ela é a companhia perfeita para quem busca tanto elegância social quanto momentos intensos de cumplicidade e descontração. Extremamente carismática e atenta aos detalhes.',
        order: 2,
        hideSpecs: false
    },
    {
        id: 'gabriela-3',
        name: 'Gabriela Vasconcelos',
        age: 22,
        height: 1.65,
        weight: 52,
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
        services: ['Encontros Reservados', 'Viagem de Fim de Semana', 'Sessão de Fotos Privada', 'Massagem Tântrica', 'Conversa Intelectual'],
        description: 'Gabriela é estudante de Letras, apaixonada por literatura, arte e filosofia. Ela possui um olhar enigmático e uma personalidade magnética e misteriosa. Excelente ouvinte, sua delicadeza e sensualidade discreta criam um ambiente altamente confortável e inesquecível para homens exigentes.',
        order: 3,
        hideSpecs: false
    },
    {
        id: 'isabella-4',
        name: 'Isabella Mendes',
        age: 26,
        height: 1.70,
        weight: 60,
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
        services: ['Acompanhamento de Viagem', 'Clube/Festas VIP', 'Massagem Desportiva', 'Esportes de Aventura', 'Jantar Romântico'],
        description: 'Isabella é personal trainer, mantém uma rotina de bem-estar activa e tem uma energia contagiante. Ela é extrovertida, atlética e ama noites de agito nos melhores clubes da cidade. Se você procura uma companhia dinâmica, alegre e com curvas perfeitas para momentos intensos de prazer.',
        order: 4,
        hideSpecs: false
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

const LoungeSection = {
    render(containerElement) {
        if (!containerElement) return;

        const companionWhatsappText = `Olá! Sou acompanhante e tenho interesse em me hospedar/atender na Casa das Marias. Gostaria de consultar vagas.`;
        const companionWhatsappUrl = `https://wa.me/5575982897249?text=${encodeURIComponent(companionWhatsappText)}`;

        containerElement.innerHTML = `
            <!-- Acordeão 1: A Casa (Lounge) -->
            <div class="lounge-accordion-container">
                <div class="lounge-accordion-trigger glass-panel" id="lounge-accordion-toggle">
                    <div class="lounge-trigger-content">
                        <div class="lounge-trigger-icon-box">
                            <i class="fa-solid fa-hotel"></i>
                        </div>
                        <div class="lounge-trigger-title-box">
                            <h3 id="lounge">A Casa</h3>
                            <p>Toque para conhecer nosso espaço privativo de altíssimo padrão, bar e suítes.</p>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-down lounge-trigger-chevron"></i>
                </div>
                
                <div class="lounge-accordion-panel" id="lounge-accordion-content">
                    <div class="lounge-panel-content">
                        <div class="lounge-grid">
                            <div class="lounge-img-wrapper">
                                <video autoplay muted loop playsinline webkit-playsinline class="lounge-video">
                                    <source src="assets/casa.mp4" type="video/mp4">
                                    <img src="assets/lounge_bg.png" alt="Casa das Marias Lounge" class="lounge-img" loading="lazy">
                                </video>
                            </div>
                            <div class="lounge-details">
                                <h3>Exclusividade & Conforto</h3>
                                <p>Na Casa das Marias, cada detalhe foi cuidadosamente planejado para oferecer uma experiência sensorial incomparável. Nosso lounge conta com iluminação indireta sofisticada, sofás de veludo confortáveis e uma seleção de bebidas importadas da mais alta qualidade.</p>
                                <p>Valorizamos a privacidade acima de tudo. Por isso, oferecemos uma entrada reservada de acesso discreto e segurança qualificada no local, permitindo que você relaxe e desfrute com total paz de espírito.</p>
                                <div class="lounge-features">
                                    <div class="feature-item">
                                        <div class="feature-icon-box"><i class="fa-solid fa-user-secret"></i></div>
                                        <div class="feature-text">
                                            <h4>Sigilo Absoluto</h4>
                                            <p>Acesso e estacionamento privativos para sua total discrição.</p>
                                        </div>
                                    </div>
                                    <div class="feature-item">
                                        <div class="feature-icon-box"><i class="fa-solid fa-martini-glass-citrus"></i></div>
                                        <div class="feature-text">
                                            <h4>Bar de Elite</h4>
                                            <p>Drinks finos, champagne e destilados premium selecionados.</p>
                                        </div>
                                    </div>
                                    <div class="feature-item">
                                        <div class="feature-icon-box"><i class="fa-solid fa-hotel"></i></div>
                                        <div class="feature-text">
                                            <h4>Suítes VIP</h4>
                                            <p>Quartos climatizados com hidromassagem e som ambiente.</p>
                                        </div>
                                    </div>
                                    <div class="feature-item">
                                        <div class="feature-icon-box"><i class="fa-solid fa-shield-halved"></i></div>
                                        <div class="feature-text">
                                            <h4>Segurança</h4>
                                            <p>Sistema de monitoramento e equipe treinada para sua tranquilidade.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="lounge-notice-box">
                                    <p><strong>Nota de Exclusividade:</strong> A Casa das Marias funciona como um espaço de hospedagem e atendimento privativo das próprias modelos. Não possuímos central de atendimento ao cliente ou suporte comercial no local; todos os contatos são individuais com as modelos via WhatsApp.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Acordeão 2: Regras & Hospedagem (Exclusivo para Acompanhantes) -->
            <div class="lounge-accordion-container" style="margin-top: 25px;">
                <div class="lounge-accordion-trigger glass-panel" id="rules-accordion-toggle">
                    <div class="lounge-trigger-content">
                        <div class="lounge-trigger-icon-box" style="background: rgba(226, 83, 82, 0.08); border-color: rgba(226, 83, 82, 0.3); color: var(--color-accent);">
                            <i class="fa-solid fa-file-invoice"></i>
                        </div>
                        <div class="lounge-trigger-title-box">
                            <h3 id="rules-header">Regras da Casa & Hospedagem</h3>
                            <p>Termos de hospedagem e convivência para profissionais (Quero Local).</p>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-down lounge-trigger-chevron"></i>
                </div>
                
                <div class="lounge-accordion-panel" id="rules-accordion-content">
                    <div class="lounge-panel-content">
                        <div class="rules-intro-card">
                            <div class="rules-intro-icon"><i class="fa-solid fa-hotel"></i></div>
                            <div class="rules-intro-text">
                                <h4>Local de Atendimento Exclusivo para Meninas</h4>
                                <p>A Casa das Marias oferece suítes de alto padrão mobiliadas com total discrição, segurança e infraestrutura completa para você se hospedar e realizar seus atendimentos. Conheça as regras para manter a organização e a harmonia do espaço.</p>
                            </div>
                        </div>

                        <div class="rules-grid">
                            <!-- Card Especial: Campanha São João de Petrolina 2026 -->
                            <div class="rule-card" style="border: 2px solid var(--color-gold); background: rgba(212, 194, 129, 0.08); grid-column: span 2;">
                                <div class="rule-card-header">
                                    <div class="rule-card-icon-box" style="background: rgba(212, 194, 129, 0.2); border-color: var(--color-gold); color: var(--color-gold); font-size: 1.4rem;">
                                        <i class="fa-solid fa-fire"></i>
                                    </div>
                                    <h4 style="color: var(--color-gold); font-size: 1.15rem;">🔥 SÃO JOÃO DE PETROLINA 2026 — CAMPANHA PREMIUM</h4>
                                </div>
                                <div class="rule-card-content" style="font-size: 0.95rem;">
                                    <p style="margin-bottom: 12px; line-height: 1.6;">Chegou a época <strong>mais lucrativa</strong> do ano em Petrolina (19 a 27 de Junho)! Garanta sua vaga em nossa casa premium com alta procura de clientes.</p>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 12px;">
                                        <div style="background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 8px; border: 1px solid rgba(212,194,129,0.2); text-align: center;">
                                            <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 4px;"><i class="fa-solid fa-snowflake"></i> Quarto Climatizado</span>
                                            <strong style="font-size: 1.25rem; color: #FFF;">R$ 140 <small style="font-size: 0.8rem; font-weight: normal;">/ diária</small></strong>
                                        </div>
                                        <div style="background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 8px; border: 1px solid rgba(212,194,129,0.2); text-align: center;">
                                            <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-gold); display: block; margin-bottom: 4px;"><i class="fa-solid fa-crown"></i> Suíte Premium</span>
                                            <strong style="font-size: 1.25rem; color: var(--color-gold);">R$ 190 <small style="font-size: 0.8rem; font-weight: normal;">/ diária</small></strong>
                                        </div>
                                    </div>
                                    <p style="margin-top: 8px; text-align: center; color: var(--color-gold); font-weight: 700;"><i class="fa-solid fa-gift"></i> FECHANDO A SEMANA → GANHA O DOMINGO GRATUITO!</p>
                                </div>
                            </div>

                            <!-- Card 1: Check-in & Out -->
                            <div class="rule-card">
                                <div class="rule-card-header">
                                    <div class="rule-card-icon-box"><i class="fa-solid fa-clock"></i></div>
                                    <h4>Horários</h4>
                                </div>
                                <div class="rule-card-content">
                                    <ul>
                                        <li><strong>Check-in:</strong> a partir das 12:00 (meio-dia).</li>
                                        <li><strong>Check-out:</strong> até 12:00 (meio-dia) do dia da saída.</li>
                                        <li>O quarto deve ser entregue limpo e organizado.</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Card 2: Benefício da Diária -->
                            <div class="rule-card">
                                <div class="rule-card-header">
                                    <div class="rule-card-icon-box"><i class="fa-solid fa-gift"></i></div>
                                    <h4>Benefício Semanal</h4>
                                </div>
                                <div class="rule-card-content">
                                    <p>Ao fechar a <strong>diária completa da semana</strong>, a profissional ganha o <strong>domingo gratuito</strong>, podendo permanecer na casa sem cobrança adicional.</p>
                                </div>
                            </div>

                            <!-- Card 3: Cuidados com o Quarto -->
                            <div class="rule-card">
                                <div class="rule-card-header">
                                    <div class="rule-card-icon-box"><i class="fa-solid fa-bed"></i></div>
                                    <h4>Cuidados com o Quarto</h4>
                                </div>
                                <div class="rule-card-content">
                                    <ul>
                                        <li>Manter limpo e higienizado após cada atendimento.</li>
                                        <li><strong>Enxoval incluso:</strong> 2 toalhas, 2 lençóis, 2 forros de cama e 2 mantas.</li>
                                        <li>Ar-condicionado em todos os quartos (suítes e comuns).</li>
                                        <li>Danos a itens deverão ser pagos.</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Card 4: Cozinha e Banheiros -->
                            <div class="rule-card">
                                <div class="rule-card-header">
                                    <div class="rule-card-icon-box"><i class="fa-solid fa-utensils"></i></div>
                                    <h4>Cozinha & Banheiros</h4>
                                </div>
                                <div class="rule-card-content">
                                    <ul>
                                        <li><strong>Cozinha:</strong> alimentação e utensílios individuais. Lavar e guardar logo após o uso. Não acumular louça.</li>
                                        <li><strong>Banheiros:</strong> manter higienizado após o uso. Regra: "sujou, lavou".</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Card 5: Limpeza Geral -->
                            <div class="rule-card">
                                <div class="rule-card-header">
                                    <div class="rule-card-icon-box"><i class="fa-solid fa-broom"></i></div>
                                    <h4>Limpeza</h4>
                                </div>
                                <div class="rule-card-content">
                                    <p>Haverá <strong>faxineira uma vez por semana</strong> para limpeza geral. A manutenção diária de cada quarto é responsabilidade da própria profissional.</p>
                                </div>
                            </div>

                            <!-- Card 6: Convivência e Silêncio -->
                            <div class="rule-card">
                                <div class="rule-card-header">
                                    <div class="rule-card-icon-box"><i class="fa-solid fa-volume-xmark"></i></div>
                                    <h4>Convivência e Som</h4>
                                </div>
                                <div class="rule-card-content">
                                    <ul>
                                        <li>Respeito mútuo é fundamental.</li>
                                        <li>Som alto e gritos são proibidos.</li>
                                        <li>Festas ou reuniões são proibidas.</li>
                                        <li>Fumar apenas com a janela aberta.</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Card 7: Atendimentos & Clientes -->
                            <div class="rule-card">
                                <div class="rule-card-header">
                                    <div class="rule-card-icon-box"><i class="fa-solid fa-door-closed"></i></div>
                                    <h4>Atendimentos</h4>
                                </div>
                                <div class="rule-card-content">
                                    <ul>
                                        <li>Atendimentos <strong>somente no quarto</strong> de forma discreta.</li>
                                        <li>Evitar circulação com clientes nas áreas comuns.</li>
                                        <li>Proibido atendimento a menores de 18 anos.</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Card 8: Substâncias e Segurança -->
                            <div class="rule-card">
                                <div class="rule-card-header">
                                    <div class="rule-card-icon-box"><i class="fa-solid fa-ban"></i></div>
                                    <h4>Drogas e Segurança</h4>
                                </div>
                                <div class="rule-card-content">
                                    <p>Não é permitido drogas nas áreas comuns. Caso ocorra, deverá ser restrito ao quarto, sem prejudicar o ambiente coletivo.</p>
                                </div>
                            </div>
                        </div>

                        <!-- WhatsApp Companion Apply Action -->
                        <div class="rules-apply-container">
                            <h3 class="rules-apply-title">Quer um local exclusivo para seus atendimentos?</h3>
                            <p class="rules-apply-subtitle">Oferecemos vagas para hospedagem rotativa ou fixa para acompanhantes em Petrolina. Entre em contato direto com a nossa gerência pelo WhatsApp para consultar a disponibilidade de suítes de forma totalmente sigilosa.</p>
                            <a href="${companionWhatsappUrl}" target="_blank" class="btn-apply-companion">
                                <i class="fa-brands fa-whatsapp"></i> Quero Local / Solicitar Vaga
                            </a>
                        </div>
                    </div>
                </div>
        `;
    }
};

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

        const formattedRate = (girl.rateQuick || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

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
                        <div class="girl-card-rate">
                            <span class="rate-label">Cachê a partir de</span>
                            ${formattedRate}
                        </div>
                        <button class="girl-card-btn view-profile-btn" data-id="${girl.id}">
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

        const formattedQuickRate = (girl.rateQuick || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
        const formattedHalfRate = (girl.rateHalf || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
        const formattedHourRate = (girl.rateHour || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

        const whatsappText = `Olá! Vi o perfil de ${girl.name} no site da Casa das Marias e gostaria de consultar a disponibilidade para agendamento.`;
        const encodedText = encodeURIComponent(whatsappText);
        const cleanedPhone = girl.whatsapp.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodedText}`;

        const heightHtml = girl.hideSpecs ? '' : `
            <div class="spec-box">
                <span>Altura</span>
                <p>${girl.height.toFixed(2)}m</p>
            </div>`;
            
        const weightHtml = girl.hideSpecs ? '' : `
            <div class="spec-box">
                <span>Peso</span>
                <p>${girl.weight}kg</p>
            </div>`;

        return `
            <div class="profile-detail-grid">
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
                        ${heightHtml}
                        ${weightHtml}
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
                    <div class="profile-rates">
                        <div class="rate-item">
                            <span>Cachê / Rapidinha</span>
                            <p>${formattedQuickRate}</p>
                        </div>
                        <div class="rate-item">
                            <span>Cachê / Meia Hora</span>
                            <p>${formattedHalfRate}</p>
                        </div>
                        <div class="rate-item">
                            <span>Cachê / A Hora</span>
                            <p>${formattedHourRate}</p>
                        </div>
                    </div>
                    <a href="${whatsappUrl}" target="_blank" class="btn btn-primary wa-booking-btn btn-glow">
                        <i class="fa-brands fa-whatsapp"></i> Agendar com ${girl.name.split(' ')[0]}
                    </a>
                </div>
            </div>
        `;
    }
};

// 2.4 Administrative Dashboard CRUD Panel
const AdminDashboard = {
    render(containerElement, companions) {
        if (!containerElement) return;

        const totalCount = companions.length;
        const availableCount = companions.filter(g => g.availability === 'disponivel').length;
        const busyCount = totalCount - availableCount;

        const rowsHtml = companions.map(girl => {
            const isAvailable = girl.availability === 'disponivel';
            const statusClass = isAvailable ? 'dot-green' : 'dot-red';
            const statusLabel = isAvailable ? 'Disponível' : 'Ocupada';
            
            const formattedQuick = (girl.rateQuick || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
            const formattedHalf = (girl.rateHalf || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
            const formattedHour = (girl.rateHour || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

            let badgeMarkup = '<span class="text-muted">—</span>';
            if (girl.badge) {
                const badgeClass = girl.badge.toUpperCase() === 'VIP' ? 'badge-gold' : 'badge-magenta';
                badgeMarkup = `<span class="badge ${badgeClass} badge-row">${girl.badge}</span>`;
            }

            const specsHiddenMarkup = girl.hideSpecs ? '<div class="admin-table-model-sub" style="color: var(--color-gold); font-size: 0.75rem; font-weight: 600;"><i class="fa-solid fa-eye-slash"></i> Físico Oculto</div>' : '';

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
                        <div>${girl.height.toFixed(2)}m / ${girl.weight}kg</div>
                        ${specsHiddenMarkup}
                    </td>
                    <td>${badgeMarkup}</td>
                    <td>
                        <div style="font-size: 0.85rem;"><strong>R:</strong> ${formattedQuick}</div>
                        <div style="font-size: 0.85rem;"><strong>1/2h:</strong> ${formattedHalf}</div>
                        <div style="font-size: 0.85rem;"><strong>1h:</strong> ${formattedHour}</div>
                    </td>
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
                    <p class="section-subtitle" style="text-align: left; margin: 5px 0 0 0;">Gerencie o portfólio de acompanhantes e controle sua disponibilidade em tempo real.</p>
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
                            <th>Físico</th>
                            <th>Selo Especial</th>
                            <th>Cachê (R / 1/2h / 1h)</th>
                            <th>Status (Disponibilidade)</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="admin-table-body">
                        ${rowsHtml || `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">Nenhuma acompanhante cadastrada. Clique em "Adicionar Modelo" para começar.</td></tr>`}
                    </tbody>
                </table>
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
    LoungeSection.render(loungeView);
    renderPortfolioGrid();
    renderStoriesBar();
    
    // Setup Events
    setupEventListeners();

    // Autoplay Videos
    initAutoplayVideos();
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
        loungeView.classList.add('hidden');
        portfolioView.classList.add('hidden');
        adminView.classList.remove('hidden');
        renderAdminDashboard();
        
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.getElementById('nav-admin-btn').classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        adminView.classList.add('hidden');
        heroView.classList.remove('hidden');
        loungeView.classList.remove('hidden');
        portfolioView.classList.remove('hidden');
        renderPortfolioGrid();
        
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector('[data-target="home"]').classList.add('active');
    }
}

function setupEventListeners() {
    // Mobile Navigation Toggle
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('mobile-active');
            const icon = menuToggle.querySelector('i');
            if (mainNav.classList.contains('mobile-active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('mobile-active')) {
                mainNav.classList.remove('mobile-active');
                menuToggle.querySelector('i').className = 'fa-solid fa-bars';
            }
        });
    });

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
            if (targetId === 'lounge') targetId = 'lounge-view';
            if (targetId === 'rules') targetId = 'lounge-view';
            
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                
                // Update navigation active states
                let navTarget = href.substring(1);
                if (navTarget === 'portfolio-view') navTarget = 'models';
                if (navTarget === 'lounge-view') {
                    navTarget = 'lounge';
                    expandLoungeAccordion();
                }
                if (navTarget === 'rules') {
                    navTarget = 'rules';
                    expandRulesAccordion();
                }
                
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

    // Lounge Accordion Toggle click
    const loungeToggle = document.getElementById('lounge-accordion-toggle');
    const loungeContent = document.getElementById('lounge-accordion-content');
    if (loungeToggle && loungeContent) {
        loungeToggle.addEventListener('click', () => {
            loungeToggle.classList.toggle('active');
            loungeContent.classList.toggle('show');
        });
    }

    // Rules Accordion Toggle click
    const rulesToggle = document.getElementById('rules-accordion-toggle');
    const rulesContent = document.getElementById('rules-accordion-content');
    if (rulesToggle && rulesContent) {
        rulesToggle.addEventListener('click', () => {
            rulesToggle.classList.toggle('active');
            rulesContent.classList.toggle('show');
        });
    }

    // Hero Buttons Role Selector Clicks
    const heroClientBtn = document.getElementById('hero-client-btn');
    const heroCompanionBtn = document.getElementById('hero-companion-btn');

    if (heroClientBtn) {
        heroClientBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('portfolio-view');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (heroCompanionBtn) {
        heroCompanionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('lounge-view');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                expandRulesAccordion();
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
        switchView('admin');
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

function openAddForm() {
    formModalTitle.textContent = "Adicionar Nova Modelo";
    document.getElementById('form-girl-id').value = '';
    companionForm.reset();
    document.getElementById('form-order').value = '10';
    document.getElementById('form-hide-specs').checked = false;
    document.getElementById('form-story-video').value = '';
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
    document.getElementById('form-height').value = girl.height;
    document.getElementById('form-weight').value = girl.weight;
    document.getElementById('form-hair').value = girl.hair;
    document.getElementById('form-eyes').value = girl.eyes;
    document.getElementById('form-rate-quick').value = girl.rateQuick || '';
    document.getElementById('form-rate-half').value = girl.rateHalf || '';
    document.getElementById('form-rate-hour').value = girl.rateHour || '';
    document.getElementById('form-whatsapp').value = girl.whatsapp;
    document.getElementById('form-badge').value = girl.badge;
    document.getElementById('form-image').value = girl.image;
    document.getElementById('form-availability').value = girl.availability;
    document.getElementById('form-story-video').value = girl.storyVideo || '';
    document.getElementById('form-services').value = girl.services.join(', ');
    document.getElementById('form-description').value = girl.description;
    document.getElementById('form-order').value = girl.order || 99;
    document.getElementById('form-hide-specs').checked = !!girl.hideSpecs;

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
        height: parseFloat(document.getElementById('form-height').value),
        weight: parseInt(document.getElementById('form-weight').value, 10),
        hair: document.getElementById('form-hair').value,
        eyes: document.getElementById('form-eyes').value,
        rateQuick: parseInt(document.getElementById('form-rate-quick').value, 10),
        rateHalf: parseInt(document.getElementById('form-rate-half').value, 10),
        rateHour: parseInt(document.getElementById('form-rate-hour').value, 10),
        whatsapp: document.getElementById('form-whatsapp').value.replace(/\D/g, ''),
        badge: document.getElementById('form-badge').value,
        image: document.getElementById('form-image').value,
        availability: document.getElementById('form-availability').value,
        storyVideo: document.getElementById('form-story-video').value.trim(),
        services: servicesArray,
        description: document.getElementById('form-description').value,
        order: parseInt(document.getElementById('form-order').value, 10) || 99,
        hideSpecs: document.getElementById('form-hide-specs').checked
    };

    if (id) {
        DataService.update(id, companionData);
    } else {
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

    loadStoryAtIndex(currentStoryIndex);
}

function loadStoryAtIndex(index) {
    if (index < 0 || index >= activeStoriesList.length) {
        closeStoryPlayer();
        return;
    }

    currentStoryIndex = index;
    const girl = activeStoriesList[index];
    
    // Cache DOM elements (ensuring they are not null)
    const video = document.getElementById('story-video');
    const avatar = document.getElementById('story-header-avatar');
    const name = document.getElementById('story-header-name');
    const bookBtn = document.getElementById('story-book-btn');
    const loader = document.getElementById('story-video-loader');
    
    if (!video) return;

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

    // Load Video
    video.src = girl.storyVideo || 'assets/video.mp4';
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
    
    const video = document.getElementById('story-video');
    if (!video) return;

    const currentFill = document.getElementById(`story-progress-fill-${currentStoryIndex}`);
    if (!currentFill) return;

    storyProgressTimer = setInterval(() => {
        if (video.paused) return; // pause progress if video is paused

        const duration = video.duration || STORY_DURATION;
        const percent = (video.currentTime / duration) * 100;
        currentFill.style.width = `${percent}%`;
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
    
    document.body.style.overflow = ''; // Unlock scroll

    const video = document.getElementById('story-video');
    if (video) {
        video.pause();
        video.src = '';
    }
}

function togglePlayPause() {
    const video = document.getElementById('story-video');
    const playPauseBtn = document.getElementById('story-play-pause-btn');
    if (!video || !playPauseBtn) return;

    if (video.paused) {
        video.play();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        video.pause();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
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

// Accordion Expand helper
function expandLoungeAccordion() {
    const toggle = document.getElementById('lounge-accordion-toggle');
    const content = document.getElementById('lounge-accordion-content');
    if (toggle && content) {
        toggle.classList.add('active');
        content.classList.add('show');
    }
}

function expandRulesAccordion() {
    const toggle = document.getElementById('rules-accordion-toggle');
    const content = document.getElementById('rules-accordion-content');
    if (toggle && content) {
        toggle.classList.add('active');
        content.classList.add('show');
    }
}
