// Aguarda o documento HTML carregar completamente
document.addEventListener('DOMContentLoaded', () => {

    // Pegando os elementos que vamos usar
    const dialogueText = document.getElementById('dialogue-text');
    const actButton = document.getElementById('act-button');
    const itemButton = document.getElementById('item-button');
    const mercyButton = document.getElementById('mercy-button');
    const soulHeart = document.querySelector('.soul-heart');

    // Função para o efeito de digitação
    function typeWriter(text, i = 0) {
        dialogueText.innerHTML = text.substring(0, i);
        if (i < text.length) {
            setTimeout(() => typeWriter(text, i + 1), 50); // Velocidade da digitação
        }
    }

    // Função para mover a alma para um botão
    function moveSoulTo(button) {
        const rect = button.getBoundingClientRect();
        const containerRect = button.closest('.container').getBoundingClientRect();
        
        soulHeart.style.display = 'block';
        // Posiciona a alma um pouco antes do texto do botão
        soulHeart.style.top = `${rect.top - containerRect.top + 8}px`;
        soulHeart.style.left = `${rect.left - containerRect.left - 25}px`;
    }

    // --- MENSAGENS PERSONALIZADAS ---
    // Altere as frases abaixo para deixar a sua cara!
    const initialMessage = "* Um amigo selvagem aparece.";
    const actMessage = "* Você checa seu amigo. ATK 10 DEF 10. Um cara incrível, ótimo em games (melhor que o Wuallan) e um irmão pra todas as horas.";
    const itemMessage = "* Você abre seu inventário... Você oferece a ele um Sans! Ele parece.... feliz? kk";
    const mercyMessage = "* Você escolheu POUPAR. Vocês venceram! Ganhou 0 EXP e uma amizade que vale mais que tudo.";
    
    // Adicionando os eventos aos botões
    actButton.addEventListener('click', () => {
        typeWriter(actMessage);
    });

    itemButton.addEventListener('click', () => {
        typeWriter(itemMessage);
    });F

    mercyButton.addEventListener('click', () => {
        typeWriter(mercyMessage);
    });

    // Mover a alma quando o mouse passa por cima dos botões
    actButton.addEventListener('mouseover', () => moveSoulTo(actButton));
    itemButton.addEventListener('mouseover', () => moveSoulTo(itemButton));
    mercyButton.addEventListener('mouseover', () => moveSoulTo(mercyButton));

    // Inicia o site com a primeira mensagem
    typeWriter(initialMessage);
});