import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmPqTYTWTQ1RqW_Splurddq1uLLNuRIrM",
    authDomain: "portfoliowebsite-cf5e2.firebaseapp.com",
    projectId: "portfoliowebsite-cf5e2",
    storageBucket: "portfoliowebsite-cf5e2.appspot.com",
    messagingSenderId: "1071276832581",
    appId: "1:1071276832581:web:72133af622418e1384302c",
    measurementId: "G-9K0GQC5W3J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
const initialSlideIndex = Math.floor(slides.length / 2);  // Seleciona o slide central
const initialSlide = slides[initialSlideIndex];
moveToSlide(track, slides[0], initialSlide);  // Movemos para o slide central

// Clique no botão da direita, move os slides para frente
nextButton.addEventListener('click', e => {
    const currentSlide = track.querySelector('.current-slide');
    const nextSlide = currentSlide.nextElementSibling;

    if (!nextSlide) {
        moveToSlide(track, currentSlide, slides[0]);  // Volta ao primeiro slide se não houver próximo
    } else {
        moveToSlide(track, currentSlide, nextSlide);
    }
});

// Clique no botão da esquerda, move os slides para trás
prevButton.addEventListener('click', e => {
    const currentSlide = track.querySelector('.current-slide');
    const prevSlide = currentSlide.previousElementSibling;

    if (!prevSlide) {
        moveToSlide(track, currentSlide, slides[slides.length - 1]);  // Vai para o último slide se não houver anterior
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
            showPopup('Message sent successfully!');
            contactForm.reset(); // Limpa o formulário após envio bem-sucedido
            window.location.hash = '#contact'; // Mantém o foco na seção de contato
        } else {
            showPopup('Error sending message.');
        }
    } catch (error) {
        showPopup('Error sending message.');
        console.error('Error:', error);
    }
});

// Script para o botão de voltar ao topo
const backToTopButton = document.querySelector('.back-to-top');
let scrollTimeout;

window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    
    if (window.pageYOffset > 800) {
        backToTopButton.classList.add('visible');
    } else {
        scrollTimeout = setTimeout(() => {
            backToTopButton.classList.remove('visible');
        }, 0);
    }
});

function smoothScrollToTop() {
    const scrollStep = -window.scrollY / (500 / 15),
        scrollInterval = setInterval(function () {
            if (window.scrollY != 0) {
                window.scrollBy(0, scrollStep);
            } else clearInterval(scrollInterval);
        }, 15);
}

backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    smoothScrollToTop();
});

let suggestedSection = null;

// Função que realiza a correspondência aproximada (fuzzy match)
function fuzzyMatch(input, term) {
    return input.includes(term);
}

// Função para buscar e sugerir correções
function searchAndNavigate(searchTerm) {
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

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

    sections.forEach(section => {
        if (fuzzyMatch(normalizedSearchTerm, section.term)) {
            document.getElementById(section.elementId).scrollIntoView({ behavior: 'smooth' });
            foundMatch = true;
        } else if (!closestMatch && section.term.startsWith(normalizedSearchTerm)) {
            closestMatch = section.term;
            suggestedSection = section.elementId;
        }
    });

    if (!foundMatch) {
        if (closestMatch) {
            showPopup(`No results found for '${searchTerm}'. Did you mean '${closestMatch}'?`);
        } else {
            showPopup(`No results found for '${searchTerm}'.`);
            document.getElementById('popup-buttons').style.display = 'none';
        }
    }
}

// Evento de clique no botão de busca
document.querySelector(".search-bar button").addEventListener('click', () => {
    const searchInput = document.querySelector(".search-bar input").value;
    searchAndNavigate(searchInput);
});

// Permite o envio ao pressionar Enter
document.querySelector(".search-bar input").addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const searchInput = e.target.value;
        searchAndNavigate(searchInput);
    }
});

// Função para buscar os últimos três blogs de todos os usuários
async function getLastThreeBlogs() {
    const blogsCollection = collection(db, 'blogs');
    const querySnapshot = await getDocs(blogsCollection);

    let blogs = [];

    // Iterar sobre todos os documentos da coleção 'blogs'
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Checar se há posts
        if (data.posts) {
            // Iterar sobre cada post no campo 'posts'
            Object.values(data.posts).forEach(post => {
                blogs.push(post);
            });
        }
    });

    // Ordenar os posts pela data (descendente)
    blogs.sort((a, b) => b.date.toMillis() - a.date.toMillis());

    // Retornar os 3 posts mais recentes
    return blogs.slice(0, 3);
}

// Função para exibir os 3 últimos blogs com layout dinâmico e divisória
async function renderLastThreeBlogs() {
    const blogsContainer = document.getElementById('dynamic-blogs');
    
    // Limpa o container antes de adicionar os novos blogs
    blogsContainer.innerHTML = '';

    // Chamada para buscar os blogs mais recentes
    const lastThreeBlogs = await getLastThreeBlogs();

    lastThreeBlogs.forEach((blog, index) => {
        // Cria o HTML dinamicamente para o blog
        const blogHTML = `
            <div class="blog-post-card">
                <img src="${blog.images?.image1 || 'static/images/default-image.png'}" alt="Blog Image" class="blog-image">
                <div class="blog-content">
                    <h3 class="blog-title">${blog.postStructure.title}</h3>
                    <p class="blog-excerpt">${blog.postStructure.introduction.substring(0, 100)}...</p>
                    <a href="viewBlog.html?postId=${blog.postId}&email=${blog.email}" class="read-more">Read More &gt;&gt;</a>
                    <div class="blog-tags">
                        <span class="blog-tag">Theme: ${blog.theme}</span>
                        <span class="blog-meta">Author: ${blog.author}</span>
                        <span class="blog-meta">Date: ${formatDate(blog.date.toDate())}</span>
                        <span class="blog-meta">Read: ${blog.readTime} Min</span>
                    </div>
                </div>
            </div>
        `;

        // Adiciona o novo conteúdo ao container de blogs
        blogsContainer.innerHTML += blogHTML;

        // Adiciona o divider, exceto após o último blog
        if (index < lastThreeBlogs.length - 1) {
            const dividerHTML = `<div class="blog-divider"></div>`;
            blogsContainer.innerHTML += dividerHTML;
        }
    });
}

// Chamada para carregar os blogs ao carregar a página
document.addEventListener('DOMContentLoaded', renderLastThreeBlogs);


// Formata a data no formato "22 Aug 2024"
function formatDate(date) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-UK', options);
}

// Chamada para carregar os blogs ao carregar a página
document.addEventListener('DOMContentLoaded', renderLastThreeBlogs);
