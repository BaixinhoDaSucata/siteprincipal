/**
 * Baixinho da Sucata - Gerenciamento de Cookies e Armazenamento Local
 * Desenvolvido para Alair Rodrigues de Oliveira
 * DOM AQUINO - MT
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Constantes
    const COOKIES_KEY = 'baixinhodasucata_cookies_consent';
    const RECENTS_KEY = 'baixinhodasucata_recents_calculations';
    const USER_PREFS_KEY = 'baixinhodasucata_user_preferences';
    
    // Inicializa o gerenciamento de cookies e armazenamento local
    initCookiesManager();
    
    /**
     * Inicializa o gerenciador de cookies
     */
    function initCookiesManager() {
        // Verifica se o usuário já consentiu com os cookies
        if (!hasUserConsent()) {
            showCookieConsentBanner();
        }
        
        // Inicializa outras funções de armazenamento local
        initLocalStorage();
        
        // Adiciona os event listeners para os links de privacidade e termos
        setupPrivacyLinks();
    }
    
    /**
     * Verifica se o usuário já deu consentimento aos cookies
     * @returns {boolean} - true se o usuário já consentiu
     */
    function hasUserConsent() {
        try {
            const consent = localStorage.getItem(COOKIES_KEY);
            return consent === 'accepted';
        } catch (e) {
            console.error('Erro ao verificar consentimento:', e);
            return false;
        }
    }
    
    /**
     * Mostra o banner de consentimento de cookies
     */
    function showCookieConsentBanner() {
        // Cria o elemento para o banner
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-banner';
        
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    <h5>🍪 Usamos cookies para melhorar sua experiência</h5>
                    <p>Este site utiliza cookies e armazenamento local para melhorar sua experiência, 
                    personalizar conteúdo e para fins estatísticos. 
                    Ao continuar navegando, você concorda com nossa 
                    <a href="/paginas/privacidade.html">Política de Privacidade</a> e 
                    <a href="/paginas/termos.html">Termos de Uso</a>.</p>
                </div>
                <div class="cookie-buttons">
                    <button id="accept-cookies" class="btn btn-primary">Aceitar</button>
                    <button id="reject-cookies" class="btn btn-outline-secondary">Rejeitar</button>
                </div>
            </div>
        `;
        
        // Adiciona estilos ao banner
        const style = document.createElement('style');
        style.textContent = `
            .cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: rgba(255, 255, 255, 0.95);
                box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                padding: 1rem;
                animation: slidein 0.5s ease-in-out;
            }
            
            .cookie-content {
                display: flex;
                flex-direction: column;
                max-width: 1200px;
                margin: 0 auto;
                padding: 0.5rem;
            }
            
            .cookie-text {
                margin-bottom: 1rem;
            }
            
            .cookie-text h5 {
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            
            .cookie-text p {
                margin-bottom: 0;
                font-size: 0.9rem;
            }
            
            .cookie-buttons {
                display: flex;
                gap: 1rem;
            }
            
            @media (min-width: 768px) {
                .cookie-content {
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .cookie-text {
                    flex: 1;
                    margin-bottom: 0;
                    margin-right: 2rem;
                }
            }
            
            @keyframes slidein {
                from {
                    transform: translateY(100%);
                }
                to {
                    transform: translateY(0);
                }
            }
        `;
        
        // Adiciona o banner e os estilos ao body
        document.head.appendChild(style);
        document.body.appendChild(banner);
        
        // Adiciona event listeners aos botões
        document.getElementById('accept-cookies').addEventListener('click', function() {
            acceptCookies();
            removeBanner();
        });
        
        document.getElementById('reject-cookies').addEventListener('click', function() {
            rejectCookies();
            removeBanner();
        });
    }
    
    /**
     * Remove o banner de consentimento
     */
    function removeBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.animation = 'slideout 0.5s ease-in-out forwards';
            
            // Adiciona a animação de saída
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideout {
                    from {
                        transform: translateY(0);
                    }
                    to {
                        transform: translateY(100%);
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Remove o banner após a animação
            setTimeout(() => {
                if (banner && banner.parentNode) {
                    banner.parentNode.removeChild(banner);
                }
            }, 500);
        }
    }
    
    /**
     * Aceita os cookies e armazena a preferência
     */
    function acceptCookies() {
        try {
            localStorage.setItem(COOKIES_KEY, 'accepted');
            
            // Inicializa recursos que dependem do consentimento
            initAnalytics();
        } catch (e) {
            console.error('Erro ao salvar consentimento:', e);
        }
    }
    
    /**
     * Rejeita os cookies e armazena a preferência
     */
    function rejectCookies() {
        try {
            localStorage.setItem(COOKIES_KEY, 'rejected');
            
            // Limpa armazenamento local não essencial
            localStorage.removeItem(RECENTS_KEY);
            localStorage.removeItem(USER_PREFS_KEY);
        } catch (e) {
            console.error('Erro ao salvar rejeição:', e);
        }
    }
    
    /**
     * Inicializa o armazenamento local se consentido
     */
    function initLocalStorage() {
        if (hasUserConsent()) {
            // Inicializa o armazenamento de cálculos recentes para a calculadora
            initCalculatorHistory();
            
            // Inicializa as preferências do usuário
            initUserPreferences();
        }
    }
    
    /**
     * Inicializa o histórico da calculadora no armazenamento local
     */
    function initCalculatorHistory() {
        // Obtém o formulário da calculadora se existir
        const calculadoraForm = document.getElementById('calculadora-form');
        const calculadoraCompletaForm = document.getElementById('calculadora-completa-form');
        
        // Configuração para a mini calculadora
        if (calculadoraForm) {
            calculadoraForm.addEventListener('submit', function(e) {
                // O evento padrão já está sendo prevenido no js principal
                
                // Acessa os elementos após o submit
                setTimeout(() => {
                    const material = document.getElementById('material').value;
                    const peso = parseFloat(document.getElementById('peso').value);
                    const resultadoTexto = document.querySelector('.resultado-texto').textContent;
                    
                    if (material && !isNaN(peso) && peso > 0) {
                        saveCalculation(material, peso, resultadoTexto);
                    }
                }, 100);
            });
        }
        
        // Configuração para a calculadora completa
        if (calculadoraCompletaForm) {
            calculadoraCompletaForm.addEventListener('submit', function(e) {
                // O evento padrão já está sendo prevenido no js principal
                
                // Acessa os elementos após o submit
                setTimeout(() => {
                    const material = document.getElementById('material-completo').value;
                    const peso = parseFloat(document.getElementById('peso-completo').value);
                    
                    if (material && !isNaN(peso) && peso > 0) {
                        // Busca o texto do resultado
                        const resultadoElemento = document.querySelector('.result-value.text-success');
                        if (resultadoElemento) {
                            const resultadoTexto = resultadoElemento.textContent;
                            saveCalculation(material, peso, resultadoTexto);
                        }
                    }
                }, 100);
            });
            
            // Mostrar histórico de cálculos se estiver na página da calculadora completa
            if (document.getElementById('historico-calculos')) {
                displayCalculationHistory();
            }
        }
    }
    
    /**
     * Salva um cálculo no histórico local
     */
    function saveCalculation(material, peso, resultado) {
        try {
            // Obtém o histórico existente ou cria um novo
            let calculos = [];
            const calculosJSON = localStorage.getItem(RECENTS_KEY);
            
            if (calculosJSON) {
                calculos = JSON.parse(calculosJSON);
            }
            
            // Adiciona o novo cálculo
            calculos.unshift({
                material: material,
                peso: peso,
                resultado: resultado,
                data: new Date().toISOString()
            });
            
            // Limita a 10 cálculos no histórico
            calculos = calculos.slice(0, 10);
            
            // Salva no armazenamento local
            localStorage.setItem(RECENTS_KEY, JSON.stringify(calculos));
            
            // Atualiza a exibição do histórico se estiver na página da calculadora
            if (document.getElementById('historico-calculos')) {
                displayCalculationHistory();
            }
        } catch (e) {
            console.error('Erro ao salvar cálculo:', e);
        }
    }
    
    /**
     * Exibe o histórico de cálculos na página da calculadora
     */
    function displayCalculationHistory() {
        const historicoElement = document.getElementById('historico-calculos');
        if (!historicoElement) return;
        
        try {
            const calculosJSON = localStorage.getItem(RECENTS_KEY);
            if (!calculosJSON) {
                historicoElement.innerHTML = '<p class="text-center text-muted">Nenhum cálculo realizado ainda.</p>';
                return;
            }
            
            const calculos = JSON.parse(calculosJSON);
            if (calculos.length === 0) {
                historicoElement.innerHTML = '<p class="text-center text-muted">Nenhum cálculo realizado ainda.</p>';
                return;
            }
            
            let html = '<h4 class="mb-3">Seus cálculos recentes</h4>';
            html += '<div class="list-group">';
            
            calculos.forEach((calculo, index) => {
                const data = new Date(calculo.data);
                const dataFormatada = data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
                
                const materialName = formatarNomeMaterial(calculo.material);
                
                html += `
                    <div class="list-group-item">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-1">${materialName} - ${calculo.peso} kg</h6>
                                <p class="mb-0 text-success fw-bold">${calculo.resultado}</p>
                            </div>
                            <small class="text-muted">${dataFormatada}</small>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            
            // Adiciona botão para limpar o histórico
            html += `
                <div class="text-center mt-3">
                    <button id="clear-history" class="btn btn-sm btn-outline-danger">Limpar histórico</button>
                </div>
            `;
            
            historicoElement.innerHTML = html;
            
            // Adiciona event listener para o botão de limpar histórico
            document.getElementById('clear-history').addEventListener('click', function() {
                clearCalculationHistory();
            });
        } catch (e) {
            console.error('Erro ao exibir histórico:', e);
            historicoElement.innerHTML = '<p class="text-center text-danger">Erro ao carregar histórico.</p>';
        }
    }
    
    /**
     * Limpa o histórico de cálculos
     */
    function clearCalculationHistory() {
        try {
            localStorage.removeItem(RECENTS_KEY);
            displayCalculationHistory();
        } catch (e) {
            console.error('Erro ao limpar histórico:', e);
        }
    }
    
    /**
     * Inicializa as preferências do usuário no armazenamento local
     */
    function initUserPreferences() {
        try {
            // Verifica se já existem preferências salvas
            let userPrefs = {};
            const userPrefsJSON = localStorage.getItem(USER_PREFS_KEY);
            
            if (userPrefsJSON) {
                userPrefs = JSON.parse(userPrefsJSON);
            } else {
                // Define preferências padrão
                userPrefs = {
                    theme: 'light',
                    lastVisit: new Date().toISOString(),
                    visitCount: 1
                };
                
                localStorage.setItem(USER_PREFS_KEY, JSON.stringify(userPrefs));
            }
            
            // Atualiza contagem de visitas
            updateVisitCount(userPrefs);
            
        } catch (e) {
            console.error('Erro ao inicializar preferências:', e);
        }
    }
    
    /**
     * Atualiza a contagem de visitas do usuário
     */
    function updateVisitCount(userPrefs) {
        try {
            userPrefs.lastVisit = new Date().toISOString();
            userPrefs.visitCount += 1;
            
            localStorage.setItem(USER_PREFS_KEY, JSON.stringify(userPrefs));
        } catch (e) {
            console.error('Erro ao atualizar contagem de visitas:', e);
        }
    }
    
    /**
     * Configura os links para as páginas de privacidade e termos
     */
    function setupPrivacyLinks() {
        // Adiciona links no rodapé caso não existam
        const footer = document.querySelector('.footer-links');
        
        if (footer) {
            // Verifica se os links já existem
            const hasTermsLink = Array.from(footer.querySelectorAll('a')).some(link => 
                link.href.includes('termos.html'));
            
            const hasPrivacyLink = Array.from(footer.querySelectorAll('a')).some(link => 
                link.href.includes('privacidade.html'));
            
            // Adiciona os links caso não existam
            if (!hasTermsLink && !hasPrivacyLink) {
                const liTermos = document.createElement('li');
                const liPrivacidade = document.createElement('li');
                
                liTermos.innerHTML = '<a href="/paginas/termos.html">Termos de Uso</a>';
                liPrivacidade.innerHTML = '<a href="/paginas/privacidade.html">Política de Privacidade</a>';
                
                footer.appendChild(liTermos);
                footer.appendChild(liPrivacidade);
            }
        }
    }
    
    /**
     * Inicializa as funções de analytics (apenas se consentido)
     */
    function initAnalytics() {
        // Apenas para preparação futura - não implementado
        // Esta função seria utilizada para inicializar serviços como Google Analytics
        console.log('Analytics inicializado com consentimento do usuário');
    }
    
    /**
     * Função auxiliar para formatar o nome do material
     */
    function formatarNomeMaterial(materialId) {
        const materiaisNomes = {
            'ferro': 'Ferro',
            'cobre': 'Cobre',
            'aluminio': 'Alumínio',
            'aco': 'Aço',
            'inox': 'Aço Inoxidável',
            'bateria': 'Baterias',
            'latao': 'Latão',
            'bronze': 'Bronze',
            'motor': 'Motores Elétricos',
            'fios': 'Fios Encapados',
            'latinhas': 'Latinhas de Alumínio',
            'eletronica': 'Sucata Eletrônica',
            'papel': 'Papel/Papelão',
            'plastico': 'Plástico',
            'vidro': 'Vidro'
        };
        
        return materiaisNomes[materialId] || materialId;
    }
});

/**
 * Função global para abrir os links da política de privacidade e termos de uso
 */
function openPrivacySettings() {
    // Cria uma janela modal para escolher entre política de privacidade e termos de uso
    const modal = document.createElement('div');
    modal.className = 'privacy-modal';
    modal.innerHTML = `
        <div class="privacy-modal-content">
            <span class="privacy-modal-close">&times;</span>
            <h4>Documentos Legais</h4>
            <p>Escolha o documento que deseja consultar:</p>
            <div class="privacy-modal-buttons">
                <a href="/paginas/privacidade.html" class="btn btn-primary">Política de Privacidade</a>
                <a href="/paginas/termos.html" class="btn btn-secondary">Termos de Uso</a>
            </div>
        </div>
    `;
    
    // Adiciona estilos ao modal
    const style = document.createElement('style');
    style.textContent = `
        .privacy-modal {
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .privacy-modal-content {
            background-color: #fff;
            border-radius: 8px;
            padding: 20px;
            width: 90%;
            max-width: 500px;
            position: relative;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .privacy-modal-close {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .privacy-modal-buttons {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Adiciona event listener para fechar o modal
    const closeButton = modal.querySelector('.privacy-modal-close');
    closeButton.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Fecha o modal ao clicar fora dele
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

/**
 * Função para obter o consentimento de cookies
 * Pode ser chamada de qualquer parte do site
 */
function getCookiesConsent() {
    return localStorage.getItem('baixinhodasucata_cookies_consent') === 'accepted';
}