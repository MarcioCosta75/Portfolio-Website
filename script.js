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

// Script para o botão de voltar ao topo
const backToTopButton = document.querySelector('.back-to-top');
let scrollTimeout;

window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    
    // Verifica se a rolagem ultrapassou 300px
    if (window.pageYOffset > 800) {
        backToTopButton.classList.add('visible');
    } else {
        scrollTimeout = setTimeout(() => {
            backToTopButton.classList.remove('visible');
        }, 0); // Atraso antes de esconder o botão para dar tempo à transição
    }
});

function smoothScrollToTop() {
  const scrollStep = -window.scrollY / (500 / 15), // Define a velocidade de rolagem
        scrollInterval = setInterval(function(){
      if (window.scrollY != 0) {
          window.scrollBy(0, scrollStep); // Rola para cima em pequenos passos
      }
      else clearInterval(scrollInterval); // Interrompe a rolagem quando chega ao topo
  }, 15); // Intervalo de tempo entre os passos de rolagem
}

backToTopButton.addEventListener('click', (e) => {
  e.preventDefault(); // Previne o comportamento padrão
  smoothScrollToTop(); // Chama a função personalizada de rolagem suave
});

let suggestedSection = null; // Variável global para armazenar a sugestão

// Função que realiza a correspondência aproximada (fuzzy match)
function fuzzyMatch(input, term) {
    return input.includes(term);
}

// Função para buscar e sugerir correções
function searchAndNavigate(searchTerm) {
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    // Definimos os termos possíveis e suas seções correspondentes
    const sections = [
        { term: "about", elementId: "about-me" },
        { term: "skills", elementId: "skills" },
        { term: "works", elementId: "works" },
        { term: "projects", elementId: "works" },
        { term: "blogs", elementId: "blogs" },
        { term: "cv", elementId: "download-cv" },
        { term: "curriculum", elementId: "download-cv" },
        { term: "contact", elementId: "contact-form" },
        { term: "email", elementId: "contact-form" },
    ];

    let foundMatch = false;
    let closestMatch = null;

    // Percorremos as seções para verificar correspondências aproximadas
    sections.forEach(section => {
        if (fuzzyMatch(normalizedSearchTerm, section.term)) {
            document.getElementById(section.elementId).scrollIntoView({ behavior: 'smooth' });
            foundMatch = true;
        } else if (!closestMatch && section.term.startsWith(normalizedSearchTerm)) {
            closestMatch = section.term; // Sugerimos o termo mais próximo
            suggestedSection = section.elementId; // Guardamos a seção sugerida
        }
    });

    // Se nenhum resultado exato foi encontrado, oferecemos uma sugestão
    if (!foundMatch) {
        if (closestMatch) {
            showPopup(`No results found for '${searchTerm}'. Did you mean '${closestMatch}'?`);
        } else {
            showPopup(`No results found for '${searchTerm}'.`);
            document.getElementById('popup-buttons').style.display = 'none'; // Esconde os botões se não houver sugestão
        }
    }
}

// Adicionando evento de clique ao botão de busca
document.querySelector(".search-bar button").addEventListener('click', () => {
    const searchInput = document.querySelector(".search-bar input").value;
    searchAndNavigate(searchInput);
});

// Também permite o envio ao pressionar Enter
document.querySelector(".search-bar input").addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const searchInput = e.target.value;
        searchAndNavigate(searchInput);
    }
});

// Função para abrir o modal de pop-up
function showPopup(message) {
    const popupModal = document.getElementById('popup-modal');
    const popupMessage = document.getElementById('popup-message');
    
    popupMessage.textContent = message;  // Define a mensagem
    popupModal.style.display = 'flex';   // Exibe o modal
    
    // Mostrar ou esconder botões baseado em se há uma sugestão
    if (suggestedSection) {
        document.getElementById('popup-buttons').style.display = 'block';
        document.getElementById('close-popup').style.display = 'none';
    } else {
        document.getElementById('popup-buttons').style.display = 'none';
        document.getElementById('close-popup').style.display = 'block';
    }
}

// Função para fechar o modal
document.getElementById('close-popup').addEventListener('click', () => {
    const popupModal = document.getElementById('popup-modal');
    popupModal.style.display = 'none';  // Esconde o modal
});

// Função para o botão "Yes" no modal
document.getElementById('popup-yes-btn').addEventListener('click', () => {
    if (suggestedSection) {
        document.getElementById(suggestedSection).scrollIntoView({ behavior: 'smooth' });
    }
    closePopup(); // Fecha o modal após a ação
});

// Função para o botão "No" no modal
document.getElementById('popup-no-btn').addEventListener('click', () => {
    closePopup(); // Apenas fecha o modal
});

// Função auxiliar para fechar o modal
function closePopup() {
    const popupModal = document.getElementById('popup-modal');
    popupModal.style.display = 'none';  // Esconde o modal
    suggestedSection = null;  // Reseta a sugestão
}
