// Importa os módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDmPqTYTWTQ1RqW_Splurddq1uLLNuRIrM",
    authDomain: "portfoliowebsite-cf5e2.firebaseapp.com",
    projectId: "portfoliowebsite-cf5e2",
    storageBucket: "portfoliowebsite-cf5e2.appspot.com",
    messagingSenderId: "1071276832581",
    appId: "1:1071276832581:web:72133af622418e1384302c",
    measurementId: "G-9K0GQC5W3J"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variável global para armazenar os blogs carregados
let blogs = [];

// Função para buscar blogs do Firestore
async function fetchBlogsFromFirestore() {
    try {
        const blogsCollection = collection(db, 'blogs');
        const blogsSnapshot = await getDocs(blogsCollection);
        blogs = [];

        blogsSnapshot.forEach(doc => {
            const blogData = doc.data();
            Object.keys(blogData.posts).forEach(postKey => {
                blogs.push(blogData.posts[postKey]);
            });
        });

        return blogs;
    } catch (error) {
        console.error("Erro ao buscar blogs: ", error);
        return [];
    }
}

// Função para carregar blogs
async function loadBlogs() {
    const blogsContainer = document.getElementById('blogs-list');
    blogsContainer.innerHTML = ''; // Limpa os blogs atuais

    // Busca blogs do Firestore
    blogs = await fetchBlogsFromFirestore();

    if (blogs.length === 0) {
        blogsContainer.innerHTML = "<p>Nenhum blog disponível no momento.</p>";
        return;
    }

    // Renderiza todos os blogs carregados
    renderBlogs(blogs);
}

// Função para renderizar blogs
function renderBlogs(blogsToRender) {
    const blogsContainer = document.getElementById('blogs-list');
    blogsContainer.innerHTML = ''; // Limpa os blogs atuais

    // Renderiza cada blog em blogsToRender
    blogsToRender.forEach((blog, index) => {
        const title = blog.postStructure.title || "Sem Título";
        const description = blog.postStructure.introduction.substring(0, 100) || "Sem descrição disponível...";
        const image = blog.images?.image1 || "static/images/default-image.png";
        const theme = blog.theme || "Indefinido";
        const author = blog.author || "Autor Desconhecido";
        const date = blog.date ? formatDate(blog.date.toDate()) : "Data Inválida";
        const readTime = blog.readTime || "Desconhecido";

        const blogCard = `
            <div class="blog-post-card">
                <img src="${image}" alt="Blog Image" class="blog-image">
                <div class="blog-content">
                    <h3 class="blog-title">${title}</h3>
                    <p class="blog-excerpt">${description}...</p>
                    <a href="${blog.link || '#'}" class="read-more">Read More &gt;&gt;</a>
                    <div class="blog-tags">
                        <span class="blog-meta">Theme: ${theme}</span>
                        <span class="blog-meta">Author: ${author}</span>
                        <span class="blog-meta">Date: ${date}</span>
                        <span class="blog-meta">Read Time: ${readTime}</span>
                    </div>
                </div>
            </div>
            <div class="blog-divider"></div>
        `;

        // Adiciona o blog card ao container
        blogsContainer.innerHTML += blogCard;
    });
}

// Função para formatar data
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Função para filtrar blogs
function filterBlogs() {
    const selectedTheme = document.getElementById('filter-theme').value;
    const selectedAuthor = document.getElementById('filter-author').value;
    const selectedDate = document.getElementById('filter-date').value;

    const filteredBlogs = blogs.filter(blog => {
        const matchesTheme = selectedTheme === 'all' || blog.theme.toLowerCase() === selectedTheme.toLowerCase();
        const matchesAuthor = selectedAuthor === 'all' || blog.author.toLowerCase() === selectedAuthor.toLowerCase();
        const matchesDate = !selectedDate || formatDate(blog.date.toDate()) === formatDate(new Date(selectedDate));

        return matchesTheme && matchesAuthor && matchesDate;
    });

    renderBlogs(filteredBlogs);
}

// Função para pesquisar blogs com base na entrada da barra de pesquisa
function searchBlogs() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    const searchedBlogs = blogs.filter(blog => {
        const titleMatch = blog.postStructure.title.toLowerCase().includes(searchInput);
        const descriptionMatch = blog.postStructure.introduction.toLowerCase().includes(searchInput);
        return titleMatch || descriptionMatch;
    });

    renderBlogs(searchedBlogs);
}

// Função para preencher os filtros de tema e autor dinamicamente
function populateFilters() {
    const themes = [...new Set(blogs.map(blog => blog.theme))];
    const authors = [...new Set(blogs.map(blog => blog.author))];

    const themeSelect = document.getElementById('filter-theme');
    const authorSelect = document.getElementById('filter-author');

    // Preenche o filtro de temas
    themes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme;
        option.textContent = theme;
        themeSelect.appendChild(option);
    });

    // Preenche o filtro de autores
    authors.forEach(author => {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = author;
        authorSelect.appendChild(option);
    });
}

// Carrega blogs ao carregar a página
window.onload = async () => {
    await loadBlogs();
    populateFilters();
};

// Eventos para filtrar blogs
document.getElementById('filter-theme').addEventListener('change', filterBlogs);
document.getElementById('filter-author').addEventListener('change', filterBlogs);
document.getElementById('filter-date').addEventListener('change', filterBlogs);

// Evento de input para barra de pesquisa
document.getElementById('search-input').addEventListener('input', searchBlogs);
