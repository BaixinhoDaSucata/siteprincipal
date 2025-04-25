/**
 * Baixinho da Sucata - Main JavaScript
 * Desenvolvido para Alair Rodrigues de Oliveira
 * DOM AQUINO - MT
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Inicializa AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Manipula o scroll da página e ajusta a navbar
    handleScroll();

    // Controla o botão Voltar ao Topo
    handleBackToTop();

    // Inicializa o mapa se o elemento existir
    initMap();

    // Inicializa o lightbox para a galeria
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'albumLabel': "Imagem %1 de %2"
        });
    }

    // Valida os formulários antes de enviar
    initFormValidation();
});

/**
 * Manipula o evento de scroll para ajustar a navbar e outros elementos
 */
function handleScroll() {
    const navbar = document.querySelector('.navbar');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', function() {
        // Ajusta a navbar ao fazer scroll
        if (window.scrollY > 100) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.backgroundColor = 'rgba(46, 125, 50, 0.95)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.backgroundColor = 'rgba(46, 125, 50, 0.9)';
        }

        // Mostra/esconde o botão Voltar ao Topo
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    });
}

/**
 * Inicializa o botão Voltar ao Topo
 */
function handleBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Inicializa o mapa Leaflet
 */
function initMap() {
    const mapElement = document.getElementById('location-map');
    
    if (mapElement) {
        // Coordenadas de Dom Aquino - MT (aproximadas)
        const latitude = -15.8095;
        const longitude = -54.9176;
        
        const map = L.map('location-map').setView([latitude, longitude], 14);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Adiciona marcador principal (Sede)
        const mainMarker = L.marker([latitude, longitude]).addTo(map);
        mainMarker.bindPopup('<strong>Baixinho da Sucata</strong><br>Rua Agenor de Campos, 10<br>Dom Aquino - MT').openPopup();
        
        // Adiciona marcadores das cidades atendidas
        const cities = [
            {name: 'Jaciara', lat: -15.9648, lng: -54.9681},
            {name: 'Juscimeira', lat: -16.0498, lng: -54.8859},
            {name: 'São Pedro da Cipa', lat: -16.0109, lng: -54.9176},
            {name: 'Campo Verde', lat: -15.5452, lng: -55.1626}
        ];
        
        cities.forEach(city => {
            const marker = L.marker([city.lat, city.lng]).addTo(map);
            marker.bindPopup(`<strong>${city.name}</strong><br>Atendemos nesta região`);
        });
    }
}

/**
 * Inicializa a validação de formulários
 */
function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                // Se for o formulário de newsletter, mostrar mensagem de sucesso
                if (form.id === 'newsletter-form') {
                    event.preventDefault();
                    alert('Obrigado por se inscrever em nossa newsletter!');
                    form.reset();
                }
                
                // Se for o formulário de contato, mostrar mensagem de sucesso
                if (form.id === 'contact-form') {
                    event.preventDefault();
                    alert('Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.');
                    form.reset();
                }
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

/**
 * Função para o botão de WhatsApp
 */
function openWhatsApp() {
    window.open('https://wa.me/5566999281855', '_blank');
}

/**
 * Função para inicializar contadores animados
 * Usada na seção de estatísticas
 */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.innerText.replace(/\D/g, ''));
        const increment = Math.ceil(target / 100);
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (current > target) current = target;
                counter.innerText = (current >= 1000) ? `+${current}` : current;
                setTimeout(updateCounter, 10);
            }
        };
        
        updateCounter();
    });
}

/**
 * Verifica se um elemento está visível na viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Inicializa animações ao scroll
 */
document.addEventListener('scroll', function() {
    // Inicia os contadores quando a seção de estatísticas estiver visível
    const statsSection = document.getElementById('estatisticas');
    
    if (statsSection && isInViewport(statsSection)) {
        initCounters();
        // Remove o event listener após iniciar os contadores para não repetir
        document.removeEventListener('scroll', arguments.callee);
    }
});
