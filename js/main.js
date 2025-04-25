/*
* Baixinho da Sucata - Script Principal
* Autor: Gabriel Santos do Nascimento
* Versão: 1.0
*/

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Navbar fixa com mudança de cor ao rolar
    const navbar = document.getElementById('mainNav');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('navbar-shrink');
            } else {
                navbar.classList.remove('navbar-shrink');
            }
        });
    }

    // Navegação suave para links de âncora
    document.querySelectorAll('a.nav-link, a.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Verifica se o link é interno (começa com #)
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
                
                // Fecha o menu móvel ao clicar
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });

    // Contadores para seção de estatísticas
    const counters = document.querySelectorAll('.counter-value');
    const speed = 200;

    function startCounters() {
        counters.forEach(counter => {
            const animate = () => {
                const value = +counter.getAttribute('data-count');
                const data = +counter.innerText;
                const time = value / speed;
                if (data < value) {
                    counter.innerText = Math.ceil(data + time);
                    setTimeout(animate, 1);
                } else {
                    counter.innerText = value;
                }
            }
            animate();
        });
    }

    // Verifica se os contadores estão visíveis para iniciar animação
    function checkCounters() {
        if (counters.length > 0) {
            const counterSection = document.querySelector('.counter-section');
            if (counterSection) {
                const sectionPosition = counterSection.getBoundingClientRect();
                const screenPosition = window.innerHeight;
                
                if (sectionPosition.top < screenPosition && sectionPosition.bottom > 0) {
                    startCounters();
                    // Remove o listener depois de iniciar os contadores
                    window.removeEventListener('scroll', checkCounters);
                }
            }
        }
    }

    window.addEventListener('scroll', checkCounters);
    // Verifica uma vez quando a página carrega
    checkCounters();

    // Inicialização do mapa Leaflet
    initializeMaps();

    // Form de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Normalmente aqui teria um envio AJAX para um backend
            // Como é um site estático, vamos apenas mostrar uma mensagem de sucesso
            
            // Limpa os campos
            contactForm.reset();
            
            // Mostra mensagem de sucesso
            const formContainer = contactForm.parentElement;
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success mt-3';
            successMessage.innerHTML = '<strong>Mensagem enviada com sucesso!</strong> Entraremos em contato em breve.';
            formContainer.appendChild(successMessage);
            
            // Remove a mensagem após 5 segundos
            setTimeout(() => {
                formContainer.removeChild(successMessage);
            }, 5000);
        });
    }

    // Inicialização do Lightbox para a galeria
    const galleryLinks = document.querySelectorAll('.gallery-link');
    if (galleryLinks.length > 0) {
        galleryLinks.forEach(el => {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                const imgSrc = this.getAttribute('href');
                const imgAlt = this.querySelector('img').getAttribute('alt');
                
                // Cria o lightbox
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox-overlay';
                lightbox.innerHTML = `
                    <div class="lightbox-container">
                        <img src="${imgSrc}" alt="${imgAlt}" class="lightbox-img">
                        <span class="lightbox-close">&times;</span>
                    </div>
                `;
                
                document.body.appendChild(lightbox);
                document.body.style.overflow = 'hidden';
                
                // Fecha o lightbox ao clicar no X ou fora da imagem
                lightbox.addEventListener('click', function(e) {
                    if (e.target.classList.contains('lightbox-overlay') || e.target.classList.contains('lightbox-close')) {
                        document.body.removeChild(lightbox);
                        document.body.style.overflow = '';
                    }
                });
            });
        });
    }

    // Adiciona estilos dinâmicos para o lightbox
    const style = document.createElement('style');
    style.textContent = `
        .lightbox-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        .lightbox-container {
            position: relative;
            max-width: 80%;
            max-height: 80%;
        }
        .lightbox-img {
            max-width: 100%;
            max-height: 80vh;
            display: block;
            margin: 0 auto;
        }
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            font-size: 30px;
            color: white;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
});

// Inicializa os mapas se existirem nas páginas
function initializeMaps() {
    // Mapa na página inicial
    const map = document.getElementById('map');
    if (map) {
        const domAquinoMap = L.map('map').setView([-15.8088, -54.9125], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(domAquinoMap);
        
        const marker = L.marker([-15.8088, -54.9125]).addTo(domAquinoMap);
        marker.bindPopup("<b>Baixinho da Sucata</b><br>Rua Agenor de Campos, 10<br>Dom Aquino - MT").openPopup();
    }
    
    // Mapa na página de localização
    const locationMap = document.getElementById('locationMap');
    if (locationMap) {
        const detailedMap = L.map('locationMap').setView([-15.8088, -54.9125], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(detailedMap);
        
        const marker = L.marker([-15.8088, -54.9125]).addTo(detailedMap);
        marker.bindPopup("<b>Baixinho da Sucata</b><br>Rua Agenor de Campos, 10<br>Dom Aquino - MT").openPopup();
        
        // Adiciona círculo para mostrar a área de atendimento
        L.circle([-15.8088, -54.9125], {
            color: '#1e8449',
            fillColor: '#1e8449',
            fillOpacity: 0.2,
            radius: 5000
        }).addTo(detailedMap);
    }
}
