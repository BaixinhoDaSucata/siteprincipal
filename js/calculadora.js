/**
 * Baixinho da Sucata - Calculadora de Sucata
 * Desenvolvido para Alair Rodrigues de Oliveira
 * DOM AQUINO - MT
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Preços dos materiais por kg (R$)
    const precosMateriais = {
        ferro: 0.50,          // Ferro comum
        aco: 0.55,            // Aço
        inox: 2.20,           // Aço inoxidável
        aluminio: 1.80,       // Alumínio
        cobre: 2.70,          // Cobre
        latao: 1.90,          // Latão
        bronze: 2.10,         // Bronze
        baterias: 1.20,       // Baterias
        motor: 1.50,          // Motores elétricos
        fios: 1.80,           // Fios encapados
        latinhas: 1.70,       // Latinhas de alumínio
        eletronica: 0.90,     // Sucata eletrônica
        papelao: 0.36,        // Papel/Papelão
        plastico: 0.40,       // Plástico
        vidro: 0.45           // Vidro
    };
    
    // Inicializa a calculadora na página inicial (mini calculadora)
    initMiniCalculadora();
    
    // Inicializa a calculadora completa (na página específica)
    initCalculadoraCompleta();
});

/**
 * Inicializa a mini calculadora na página inicial
 */
function initMiniCalculadora() {
    const calculadoraForm = document.getElementById('calculadora-form');
    
    if (calculadoraForm) {
        calculadoraForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtem os valores dos campos
            const material = document.getElementById('material').value;
            const peso = parseFloat(document.getElementById('peso').value);
            
            // Validação dos campos
            if (!material || isNaN(peso) || peso <= 0) {
                document.getElementById('resultado-calculo').innerHTML = `
                    <h4 class="text-center">Resultado:</h4>
                    <p class="resultado-texto text-center text-danger">Por favor, preencha todos os campos corretamente.</p>
                `;
                return;
            }
            
            // Calcula o valor baseado no material e peso
            const preco = calcularPrecoMaterial(material, peso);
            
            // Exibe o resultado
            document.getElementById('resultado-calculo').innerHTML = `
                <h4 class="text-center">Resultado:</h4>
                <p class="resultado-texto text-center">
                    <span class="fw-bold">${peso} kg</span> de <span class="fw-bold">${formatarNomeMaterial(material)}</span> vale aproximadamente 
                    <span class="fw-bold text-success">R$ ${preco.toFixed(2)}</span>
                </p>
            `;
            
            // Animação do resultado
            const resultadoElement = document.getElementById('resultado-calculo');
            resultadoElement.classList.add('animate-fadeIn');
            
            // Remove a classe de animação após a conclusão
            setTimeout(() => {
                resultadoElement.classList.remove('animate-fadeIn');
            }, 800);
        });
    }
}

/**
 * Inicializa a calculadora completa na página específica
 */
function initCalculadoraCompleta() {
    const calculadoraCompletaForm = document.getElementById('calculadora-completa-form');
    
    if (calculadoraCompletaForm) {
        const materialSelect = document.getElementById('material-completo');
        
        // Preenche o select com os materiais disponíveis
        if (materialSelect) {
            preencherSelectMateriais(materialSelect);
        }
        
        calculadoraCompletaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtem os valores dos campos
            const material = document.getElementById('material-completo').value;
            const peso = parseFloat(document.getElementById('peso-completo').value);
            
            // Validação dos campos
            if (!material || isNaN(peso) || peso <= 0) {
                document.getElementById('resultado-calculo-completo').innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        Por favor, preencha todos os campos corretamente.
                    </div>
                `;
                return;
            }
            
            // Calcula o valor baseado no material e peso
            const preco = calcularPrecoMaterial(material, peso);
            
            // Exibe o resultado
            document.getElementById('resultado-calculo-completo').innerHTML = `
                <div class="result-container p-4">
                    <h3 class="text-center mb-3">Resultado do Cálculo</h3>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="result-item">
                                <h5>Material:</h5>
                                <p class="result-value">${formatarNomeMaterial(material)}</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="result-item">
                                <h5>Peso:</h5>
                                <p class="result-value">${peso} kg</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="result-item">
                                <h5>Valor Estimado:</h5>
                                <p class="result-value text-success fw-bold">R$ ${preco.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div class="text-center mt-3">
                        <p class="small">* Valor aproximado. O preço final pode variar de acordo com a qualidade do material.</p>
                        <a href="https://wa.me/556696714348?text=Olá! Gostaria de saber mais sobre a compra de ${formatarNomeMaterial(material)}." class="btn btn-success mt-2">
                            <i class="fab fa-whatsapp me-2"></i> Falar com o Baixinho
                        </a>
                    </div>
                </div>
            `;
            
            // Anima o resultado
            const resultadoElement = document.getElementById('resultado-calculo-completo');
            resultadoElement.classList.add('animate-fadeIn');
            
            // Reseta a animação após a conclusão
            setTimeout(() => {
                resultadoElement.classList.remove('animate-fadeIn');
            }, 800);
        });
    }
}

/**
 * Calcula o preço do material com base no tipo e peso
 * @param {string} material - O tipo de material
 * @param {number} peso - O peso em kg
 * @return {number} - O valor calculado
 */
function calcularPrecoMaterial(material, peso) {
    // Preços dos materiais por kg (R$)
    const precosMateriais = {
        'ferro': 0.50,         // Ferro comum
        'cobre': 2.70,         // Cobre
        'aluminio': 1.80,      // Alumínio
        'aco': 0.55,           // Aço
        'inox': 2.20,          // Aço inoxidável
        'bateria': 1.20,       // Baterias
        'latao': 1.90,         // Latão
        'bronze': 2.10,        // Bronze
        'motor': 1.50,         // Motores elétricos
        'fios': 1.80,          // Fios encapados
        'latinhas': 1.70,      // Latinhas de alumínio
        'eletronica': 0.90,    // Sucata eletrônica
        'papel': 0.36,         // Papel/Papelão
        'plastico': 0.40,      // Plástico
        'vidro': 0.45          // Vidro
    };
    
    // Verifica se o material existe na lista
    if (precosMateriais.hasOwnProperty(material)) {
        return precosMateriais[material] * peso;
    } else {
        // Material não encontrado, retorna valor padrão
        return 0;
    }
}

/**
 * Preenche o select com a lista de materiais disponíveis
 * @param {HTMLElement} selectElement - O elemento select para preencher
 */
function preencherSelectMateriais(selectElement) {
    const materiais = [
        { id: 'ferro', nome: 'Ferro' },
        { id: 'cobre', nome: 'Cobre' },
        { id: 'aluminio', nome: 'Alumínio' },
        { id: 'aco', nome: 'Aço' },
        { id: 'inox', nome: 'Aço Inoxidável' },
        { id: 'bateria', nome: 'Baterias' },
        { id: 'latao', nome: 'Latão' },
        { id: 'bronze', nome: 'Bronze' },
        { id: 'motor', nome: 'Motores Elétricos' },
        { id: 'fios', nome: 'Fios Encapados' },
        { id: 'latinhas', nome: 'Latinhas de Alumínio' },
        { id: 'eletronica', nome: 'Sucata Eletrônica' },
        { id: 'papel', nome: 'Papel/Papelão' },
        { id: 'plastico', nome: 'Plástico' },
        { id: 'vidro', nome: 'Vidro' }
    ];
    
    // Adiciona opção default
    let optionsHTML = '<option value="" selected disabled>Selecione o material</option>';
    
    // Adiciona cada material ao select
    materiais.forEach(material => {
        optionsHTML += `<option value="${material.id}">${material.nome}</option>`;
    });
    
    // Define o HTML no select
    selectElement.innerHTML = optionsHTML;
}

/**
 * Formata o nome do material para exibição
 * @param {string} materialId - O ID do material
 * @return {string} - O nome formatado
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
