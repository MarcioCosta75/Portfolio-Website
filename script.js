// Carousel Logic
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel-button-right');
const prevButton = document.querySelector('.carousel-button-left');

// Obtém a largura de um slide
const slideWidth = slides[0].getBoundingClientRect().width;

// Organiza os slides lado a lado
const setSlidePosition = (slide, index) => {
  slide.style.left = slideWidth * index + 'px';
};
slides.forEach(setSlidePosition);

// Função para mover para o slide alvo
const moveToSlide = (track, currentSlide, targetSlide) => {
  track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
  currentSlide.classList.remove('current-slide');
  targetSlide.classList.add('current-slide');
};

// Centraliza um slide no carregamento da página
const initialSlideIndex = Math.floor(slides.length / 2);  // Aqui selecionamos o slide central
const initialSlide = slides[initialSlideIndex];
moveToSlide(track, slides[0], initialSlide);  // Movemos para o slide central

// Clique no botão da direita, move os slides para frente
nextButton.addEventListener('click', e => {
  const currentSlide = track.querySelector('.current-slide');
  const nextSlide = currentSlide.nextElementSibling;
  
  if (!nextSlide) {
    // Se não houver próximo slide, volta ao primeiro
    moveToSlide(track, currentSlide, slides[0]);
  } else {
    moveToSlide(track, currentSlide, nextSlide);
  }
});

// Clique no botão da esquerda, move os slides para trás
prevButton.addEventListener('click', e => {
  const currentSlide = track.querySelector('.current-slide');
  const prevSlide = currentSlide.previousElementSibling;
  
  if (!prevSlide) {
    // Se não houver slide anterior, vai para o último slide
    moveToSlide(track, currentSlide, slides[slides.length - 1]);
  } else {
    moveToSlide(track, currentSlide, prevSlide);
  }
});

// Função para abrir o modal de pop-up
function showPopup(message) {
    const popupModal = document.getElementById('popup-modal');
    const popupMessage = document.getElementById('popup-message');
    
    popupMessage.textContent = message;  // Define a mensagem
    popupModal.style.display = 'flex';   // Exibe o modal
}

// Função para fechar o modal
document.getElementById('close-popup').addEventListener('click', () => {
    const popupModal = document.getElementById('popup-modal');
    popupModal.style.display = 'none';  // Esconde o modal
});

// Função de envio do formulário de contato
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    try {
        const response = await fetch('https://hook.eu2.make.com/3dpcwbiv6g8se1gog4hdwbx4nhqjgqfj', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        });

        if (response.ok) {
            showPopup('Mensagem enviada com sucesso!');
            contactForm.reset(); // Limpa o formulário após envio bem-sucedido
            window.location.hash = '#contact'; // Mantém o foco na seção de contato
        } else {
            showPopup('Erro ao enviar a mensagem.');
        }
    } catch (error) {
        showPopup('Erro ao enviar a mensagem.');
        console.error('Erro:', error);
    }
});
