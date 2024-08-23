import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

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

// Função para criar um novo post
async function createBlogPost(email, post) {
    const userDoc = doc(db, "blogs", email);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const posts = data.posts || {};
        const postCount = Object.keys(posts).length;
        const newPostKey = `post${postCount + 1}`;

        posts[newPostKey] = post;

        await updateDoc(userDoc, { posts });
        alert('Post created successfully');
    }
}

// Exemplo de uso após o formulário ser submetido
document.getElementById('blogForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const post = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        theme: document.getElementById('theme').value,
        readTime: parseInt(document.getElementById('readTime').value),
        introduction: document.getElementById('introduction').value,
        bodyContent: document.getElementById('bodyContent').value,
        conclusion: document.getElementById('conclusion').value,
        images: {
            image1: document.getElementById('image1').value,
            image2: document.getElementById('image2').value,
            image3: document.getElementById('image3').value,
        },
        date: new Date()
    };

    // Recupera o email do usuário logado (você pode armazenar em localStorage após login)
    const email = "marcio.costa@dengun.com"; // Exemplo, recupere dinamicamente o email

    await createBlogPost(email, post);
});
