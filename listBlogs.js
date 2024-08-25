import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

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
const auth = getAuth(app);

let postIdToDelete = null;
let userEmail = null;

// Pop-up elements
const confirmDeletePopup = document.getElementById('confirmDeletePopup');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

// Verificação de autenticação ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userEmail = user.email;
            console.log('Usuário autenticado:', userEmail);
            listUserBlogs(userEmail);
        } else {
            console.error('Nenhum usuário autenticado. Redirecionando para o login.');
            window.location.href = 'login.html';
        }
    });
});

// Função para listar os blogs do usuário
async function listUserBlogs(email) {
    try {
        const userDocRef = doc(db, "blogs", email);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const posts = data.posts || {};
            console.log('Posts encontrados:', posts);

            const blogsContainer = document.getElementById('blogsContainer');
            blogsContainer.innerHTML = '';

            if (Object.keys(posts).length > 0) {
                Object.keys(posts).forEach((postId) => {
                    const post = posts[postId];
                    console.log('ID do post:', postId);

                    const imageURL = post.images?.image1 ? post.images.image1 : 'static/images/default-image.png';

                    const blogHTML = `
                        <div class="blog-card">
                            <div class="blog-preview">
                                <img src="${imageURL}" alt="Blog Preview Image" class="blog-preview-image">
                                <div class="blog-details">
                                    <h2 class="blog-title">${post.postStructure.title}</h2>
                                    <p>${post.postStructure.introduction}</p>
                                    <div class="blog-meta">
                                        <span class="blog-meta-item">Author: ${post.author}</span>
                                        <span class="blog-meta-item">Theme: ${post.theme}</span>
                                        <span class="blog-meta-item">Date: ${post.date ? post.date.toDate().toLocaleDateString() : 'N/A'}</span>
                                        <span class="blog-meta-item">Read Time: ${post.readTime} min</span>
                                    </div>
                                    <div class="blog-actions">
                                        <a href="editBlog.html?postId=${postId}&email=${email}" class="edit-btn">Edit</a>
                                        <button type="button" class="delete-btn" data-post-id="${postId}">Delete Post</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    blogsContainer.innerHTML += blogHTML;
                });

                // Attach event listeners to delete buttons
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        postIdToDelete = e.target.getAttribute('data-post-id');
                        console.log('ID do post selecionado para deletar:', postIdToDelete);
                        confirmDeletePopup.style.display = 'flex';
                    });
                });
            } else {
                blogsContainer.innerHTML = `<p>No blogs found for this user.</p>`;
            }
        } else {
            document.getElementById('blogsContainer').innerHTML = `<p>No blogs found for this user.</p>`;
        }
    } catch (error) {
        console.error('Erro ao carregar os blogs:', error);
        document.getElementById('blogsContainer').innerHTML = `<p>Error loading blogs. Please try again later.</p>`;
    }
}

// Função para deletar o post
async function deletePost(postId) {
    if (!postId || !userEmail) {
        console.error('ID do post ou email do usuário não está definido corretamente.');
        return;
    }

    try {
        console.log('Tentando deletar o post com ID:', postId);

        // Referência ao documento do usuário
        const postRef = doc(db, "blogs", userEmail);

        // Obter o documento atual do Firestore
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
            const postsData = postSnap.data().posts;

            // Verifica se o post a ser deletado existe no Firestore
            if (postsData && postsData[postId]) {
                console.log('Post encontrado:', postsData[postId]);

                // Deletar o post do objeto de posts
                delete postsData[postId];

                // Atualizar o Firestore com os dados modificados
                await updateDoc(postRef, { posts: postsData });

                // Confirmação e recarregamento da página após exclusão bem-sucedida
                alert('Blog post deleted successfully!');
                window.location.href = 'listBlogs.html'; // Recarregar ou redirecionar a página
            } else {
                console.error('Post não encontrado para deletar.');
                alert("Post not found!");
            }
        } else {
            console.error("Documento do usuário não encontrado!");
        }
    } catch (error) {
        console.error('Erro ao deletar o post:', error);
    } finally {
        // Fechar o popup e redefinir a variável somente após a conclusão da operação
        confirmDeletePopup.style.display = 'none';
        postIdToDelete = null; // Redefinir após a operação estar completamente concluída
    }
}

// Adicionar listener ao botão de confirmação de exclusão
confirmDeleteBtn.addEventListener('click', () => {
    // Chamar a função de exclusão, passando o ID do post que foi selecionado
    if (postIdToDelete) {
        deletePost(postIdToDelete); // Chamar função de exclusão
    } else {
        console.error('Nenhum post foi selecionado para exclusão.');
    }
});

// Adicionar listener ao botão de cancelar exclusão
cancelDeleteBtn.addEventListener('click', () => {
    // Apenas fechar o popup e resetar a variável
    confirmDeletePopup.style.display = 'none';
    postIdToDelete = null; // Resetar a variável quando o cancelamento for acionado
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Error logging out:', error);
    });
});
