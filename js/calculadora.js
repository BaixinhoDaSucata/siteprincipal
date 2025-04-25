/*
* Baixinho da Sucata - Calculadora de Materiais
* Autor: Gabriel Santos do Nascimento
* Versão: 1.0
*/

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa a calculadora rápida da página inicial
    initQuickCalculator();
    
    // Inicializa a calculadora completa da página específica
    initFullCalculator();
});

// Calculadora rápida da página inicial
function initQuickCalculator() {
    const calcButton = document.getElementById('calcular');
    if (calcButton) {
        calcButton.addEventListener('click', function() {
            const material = document.getElementById('material');
            const peso = document.getElementById('peso');
            const resultContainer = document.getElementById('resultContainer');
            const resultValue = document.getElementById('resultValue');
            
            // Verifica se os valores são válidos
            if (material && peso && peso.value.trim() !== '' && !isNaN(peso.value) && parseFloat(peso.value) > 0) {
                const valorMaterial = parseFloat(material.value);
                const pesoMaterial = parseFloat(peso.value);
                const valorTotal = (valorMaterial * pesoMaterial).toFixed(2);
                
                // Exibe o resultado
                resultValue.textContent = `R$ ${valorTotal}`;
                resultContainer.classList.remove('d-none');
            } else {
                // Mostra mensagem de erro
                alert('Por favor, preencha o peso corretamente com um valor positivo.');
                if (resultContainer) {
                    resultContainer.classList.add('d-none');
                }
            }
        });
    }
}

// Calculadora completa da página específica
function initFullCalculator() {
    const fullCalcButton = document.getElementById('calcularCompleto');
    if (fullCalcButton) {
        // Define a tabela de preços dos materiais
        const materiaisPrecos = {
            'ferro': 0.36,
            'cobre': 2.70,
            'aluminio': 1.20,
            'latao': 1.80,
            'bronze': 2.00,
            'inox': 1.50,
            'baterias': 1.40,
            'papelao': 0.50,
            'pvc': 0.70,
            'pet': 0.80,
            'pead': 0.90,
            'pp': 0.65,
            'ps': 0.60,
            'vidro': 0.20,
            'eletronicos': 1.10
        };
        
        // Inicializa a tabela de materiais
        const materiaisTable = document.getElementById('materiaisTable');
        const materiaisTbody = document.getElementById('materiaisTbody');
        
        if (materiaisTable && materiaisTbody) {
            // Limpa a tabela
            materiaisTbody.innerHTML = '';
            
            // Cria as linhas da tabela para cada material
            for (const [material, preco] of Object.entries(materiaisPrecos)) {
                const tr = document.createElement('tr');
                
                // Formata o nome do material (primeira letra maiúscula)
                const materialFormatado = material.charAt(0).toUpperCase() + material.slice(1);
                
                tr.innerHTML = `
                    <td>
                        <div class="form-check">
                            <input class="form-check-input material-checkbox" type="checkbox" value="${preco}" id="check_${material}" data-material="${material}">
                            <label class="form-check-label" for="check_${material}">
                                ${materialFormatado}
                            </label>
                        </div>
                    </td>
                    <td>R$ ${preco.toFixed(2)}/kg</td>
                    <td>
                        <input type="number" class="form-control peso-input" id="peso_${material}" placeholder="0" disabled>
                    </td>
                    <td class="valor-total" id="valor_${material}">R$ 0,00</td>
                `;
                
                materiaisTbody.appendChild(tr);
            }
            
            // Adiciona event listeners para os checkboxes
            const checkboxes = document.querySelectorAll('.material-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const material = this.getAttribute('data-material');
                    const pesoInput = document.getElementById(`peso_${material}`);
                    
                    if (this.checked) {
                        pesoInput.disabled = false;
                        pesoInput.value = '';
                        pesoInput.focus();
                    } else {
                        pesoInput.disabled = true;
                        pesoInput.value = '';
                        document.getElementById(`valor_${material}`).textContent = 'R$ 0,00';
                        atualizarValorTotal();
                    }
                });
            });
            
            // Adiciona event listeners para os inputs de peso
            const pesoInputs = document.querySelectorAll('.peso-input');
            pesoInputs.forEach(input => {
                input.addEventListener('input', function() {
                    const material = this.id.split('_')[1];
                    const checkbox = document.getElementById(`check_${material}`);
                    const valorTotalElement = document.getElementById(`valor_${material}`);
                    
                    if (this.value.trim() !== '' && !isNaN(this.value) && parseFloat(this.value) >= 0) {
                        const preco = parseFloat(checkbox.value);
                        const peso = parseFloat(this.value);
                        const valorTotal = (preco * peso).toFixed(2);
                        
                        valorTotalElement.textContent = `R$ ${valorTotal}`;
                    } else {
                        valorTotalElement.textContent = 'R$ 0,00';
                    }
                    
                    atualizarValorTotal();
                });
            });
        }
        
        // Botão para calcular
        fullCalcButton.addEventListener('click', function() {
            const resultadoFinal = document.getElementById('resultadoFinal');
            const resultadoValor = document.getElementById('resultadoValor');
            const itensCalculados = document.getElementById('itensCalculados');
            
            // Verifica se pelo menos um material foi selecionado
            const checkboxesChecked = document.querySelectorAll('.material-checkbox:checked');
            if (checkboxesChecked.length === 0) {
                alert('Por favor, selecione pelo menos um tipo de material.');
                return;
            }
            
            // Calcula o valor total
            let valorTotal = 0;
            let materiaisString = '';
            
            checkboxesChecked.forEach(checkbox => {
                const material = checkbox.getAttribute('data-material');
                const pesoInput = document.getElementById(`peso_${material}`);
                
                if (pesoInput.value.trim() !== '' && !isNaN(pesoInput.value) && parseFloat(pesoInput.value) > 0) {
                    const preco = parseFloat(checkbox.value);
                    const peso = parseFloat(pesoInput.value);
                    const valorMaterial = preco * peso;
                    
                    valorTotal += valorMaterial;
                    
                    // Formata o nome do material (primeira letra maiúscula)
                    const materialFormatado = material.charAt(0).toUpperCase() + material.slice(1);
                    
                    materiaisString += `${materialFormatado}: ${peso}kg (R$ ${valorMaterial.toFixed(2)})<br>`;
                }
            });
            
            // Exibe o resultado
            if (valorTotal > 0) {
                resultadoValor.textContent = `R$ ${valorTotal.toFixed(2)}`;
                itensCalculados.innerHTML = materiaisString;
                resultadoFinal.classList.remove('d-none');
                
                // Rola para o resultado
                resultadoFinal.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Por favor, insira pesos válidos para os materiais selecionados.');
            }
        });
        
        // Botão para limpar
        const limparButton = document.getElementById('limparCalculadora');
        if (limparButton) {
            limparButton.addEventListener('click', function() {
                // Desmarca todos os checkboxes
                const checkboxes = document.querySelectorAll('.material-checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });
                
                // Desabilita e limpa todos os inputs de peso
                const pesoInputs = document.querySelectorAll('.peso-input');
                pesoInputs.forEach(input => {
                    input.disabled = true;
                    input.value = '';
                });
                
                // Limpa os valores totais por material
                const valoresMateriais = document.querySelectorAll('.valor-total');
                valoresMateriais.forEach(valor => {
                    valor.textContent = 'R$ 0,00';
                });
                
                // Esconde o resultado final
                const resultadoFinal = document.getElementById('resultadoFinal');
                if (resultadoFinal) {
                    resultadoFinal.classList.add('d-none');
                }
                
                // Atualiza o valor total
                atualizarValorTotal();
            });
        }
    }
}

// Função para atualizar o valor total na calculadora completa
function atualizarValorTotal() {
    const totalCalculadora = document.getElementById('totalCalculadora');
    if (totalCalculadora) {
        let somaTotal = 0;
        
        // Soma os valores de cada material
        const checkboxesChecked = document.querySelectorAll('.material-checkbox:checked');
        checkboxesChecked.forEach(checkbox => {
            const material = checkbox.getAttribute('data-material');
            const pesoInput = document.getElementById(`peso_${material}`);
            
            if (pesoInput.value.trim() !== '' && !isNaN(pesoInput.value) && parseFloat(pesoInput.value) > 0) {
                const preco = parseFloat(checkbox.value);
                const peso = parseFloat(pesoInput.value);
                somaTotal += preco * peso;
            }
        });
        
        // Atualiza o valor total
        totalCalculadora.textContent = `R$ ${somaTotal.toFixed(2)}`;
    }
}
