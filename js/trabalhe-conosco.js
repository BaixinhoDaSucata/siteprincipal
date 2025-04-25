/**
 * Baixinho da Sucata - Trabalhe Conosco
 * Desenvolvido para Alair Rodrigues de Oliveira
 * DOM AQUINO - MT
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Verifica se a página atual é a de Trabalhe Conosco
    if (!document.getElementById('candidatura-form')) return;
    
    // Inicializa o formulário de candidatura
    initCandidaturaForm();
    
    // Gerenciamento do Input de Arquivo
    setupFileInput();
    
    /**
     * Inicializa o formulário de candidatura
     */
    function initCandidaturaForm() {
        const candidaturaForm = document.getElementById('candidatura-form');
        
        if (candidaturaForm) {
            candidaturaForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!candidaturaForm.checkValidity()) {
                    e.stopPropagation();
                    candidaturaForm.classList.add('was-validated');
                    return;
                }
                
                // Captura os dados do formulário
                const formData = {
                    nome: document.getElementById('nome').value,
                    email: document.getElementById('email').value,
                    telefone: document.getElementById('telefone').value,
                    vaga: document.getElementById('vaga').value,
                    mensagem: document.getElementById('mensagem').value || ''
                };
                
                // Mostra o loader
                const submitButton = candidaturaForm.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Enviando...';
                
                // Envia para a API
                enviarCandidatura(formData, submitButton, candidaturaForm);
            });
        }
    }
    
    /**
     * Configura o input de arquivo para exibir o nome do arquivo selecionado
     */
    function setupFileInput() {
        const fileInput = document.getElementById('curriculo');
        const fileDisplay = document.getElementById('file-input-display');
        
        if (fileInput && fileDisplay) {
            fileInput.addEventListener('change', function() {
                if (fileInput.files.length > 0) {
                    const fileName = fileInput.files[0].name;
                    fileDisplay.innerHTML = `<i class="fas fa-file-alt me-2"></i> ${fileName}`;
                    fileDisplay.style.color = '#2E7D32';
                } else {
                    fileDisplay.innerHTML = 'Clique ou arraste seu arquivo aqui';
                    fileDisplay.style.color = '';
                }
            });
        }
    }
    
    /**
     * Envia a candidatura para a API
     * @param {Object} formData - Dados do formulário
     * @param {HTMLElement} submitButton - Botão de envio
     * @param {HTMLElement} form - Formulário
     */
    function enviarCandidatura(formData, submitButton, form) {
        // Simula uma requisição à API (em produção, usar fetch real)
        fetch('/api/candidatar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar candidatura');
            }
            return response.json();
        })
        .then(data => {
            // Sucesso
            showSuccessMessage();
            resetForm(form, submitButton);
        })
        .catch(error => {
            // Erro
            console.error('Erro:', error);
            showErrorMessage();
            resetButton(submitButton);
        });
    }
    
    /**
     * Mostra mensagem de sucesso
     */
    function showSuccessMessage() {
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.innerHTML = '<i class="fas fa-check-circle me-2"></i> Sua candidatura foi enviada com sucesso! Em breve entraremos em contato.';
            successMessage.className = 'success-message alert alert-success';
            
            // Esconde a mensagem após alguns segundos
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 10000);
            
            // Scroll para a mensagem
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    /**
     * Mostra mensagem de erro
     */
    function showErrorMessage() {
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i> Houve um erro ao enviar sua candidatura. Por favor, tente novamente mais tarde.';
            successMessage.className = 'success-message alert alert-danger';
            
            // Esconde a mensagem após alguns segundos
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 10000);
            
            // Scroll para a mensagem
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    /**
     * Reseta o formulário após envio
     * @param {HTMLElement} form - Formulário
     * @param {HTMLElement} button - Botão de envio
     */
    function resetForm(form, button) {
        form.reset();
        form.classList.remove('was-validated');
        resetButton(button);
        
        // Reseta o display do arquivo
        const fileDisplay = document.getElementById('file-input-display');
        if (fileDisplay) {
            fileDisplay.innerHTML = 'Clique ou arraste seu arquivo aqui';
            fileDisplay.style.color = '';
        }
    }
    
    /**
     * Reseta o botão de envio
     * @param {HTMLElement} button - Botão de envio
     */
    function resetButton(button) {
        button.disabled = false;
        button.innerHTML = 'Enviar Candidatura';
    }
});