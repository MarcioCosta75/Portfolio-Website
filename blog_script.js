// Array simulado de blogs
const blogs = [
    {
        title: 'What does it take to become a web developer?',
        theme: 'Web Development',
        author: 'Marcio Costa',
        date: '2024-08-22',
        readTime: '1 Min',
        description: 'Web development, also known as website development...',
        link: '#',
    },
    {
        title: 'Designing User Interfaces',
        theme: 'Design',
        author: 'Guest Author',
        date: '2024-07-15',
        readTime: '3 Min',
        description: 'Designing user interfaces is about making interactions...',
        link: '#',
    }
    // Adicione mais blogs aqui
];

// Função para carregar os blogs
function loadBlogs() {
    const blogsContainer = document.getElementById('blogs-list');
    blogsContainer.innerHTML = ''; // Limpa os blogs atuais

    // Ordena os blogs pela data mais recente
    const sortedBlogs = blogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedBlogs.forEach(blog => {
        const blogCard = `
            <div class="blog-card">
                <img src="static/blogs/blogimage1.png" alt="Blog Image">
                <div class="blog-content">
                    <h3>${blog.title}</h3>
                    <p>${blog.description}</p>
                    <div class="blog-meta">
                        <span>Theme: ${blog.theme}</span>
                        <span>Author: ${blog.author}</span>
                        <span>Date: ${blog.date}</span>
                        <span>Read Time: ${blog.readTime}</span>
                    </div>
                    <a href="${blog.link}" class="read-more">Read More &gt;&gt;</a>
                </div>
            </div>
        `;
        blogsContainer.innerHTML += blogCard;
    });
}

// Função para filtrar blogs
function filterBlogs() {
    const selectedTheme = document.getElementById('filter-theme').value;
    const selectedAuthor = document.getElementById('filter-author').value;
    const selectedDate = document.getElementById('filter-date').value;

    const filteredBlogs = blogs.filter(blog => {
        return (selectedTheme === 'all' || blog.theme.toLowerCase() === selectedTheme.toLowerCase()) &&
               (selectedAuthor === 'all' || blog.author.toLowerCase() === selectedAuthor.toLowerCase()) &&
               (!selectedDate || blog.date === selectedDate);
    });    

    renderFilteredBlogs(filteredBlogs);
}

// Função para renderizar blogs filtrados
function renderFilteredBlogs(filteredBlogs) {
    const blogsContainer = document.getElementById('blogs-list');
    blogsContainer.innerHTML = ''; // Limpa os blogs atuais

    filteredBlogs.forEach(blog => {
        const blogCard = `
            <div class="blog-card">
                <img src="static/blogs/blogimage1.png" alt="Blog Image" class="blog-image">
                <h3>${blog.title}</h3>
                <p>${blog.description}</p>
                <div class="blog-meta">
                <span>Theme: ${blog.theme}</span><br>
                <span>Author: ${blog.author}</span><br>
                <span>Date: ${blog.date}</span><br>
                <span>Read Time: ${blog.readTime}</span>
            </div>
        <a href="${blog.link}" class="read-more">Read More &gt;&gt;</a>
    </div>
        `;
        blogsContainer.innerHTML += blogCard;
    });
}

// Eventos para filtrar blogs
document.getElementById('filter-theme').addEventListener('change', filterBlogs);
document.getElementById('filter-author').addEventListener('change', filterBlogs);
document.getElementById('filter-date').addEventListener('change', filterBlogs);

// Carrega os blogs ao carregar a página
window.onload = loadBlogs;
