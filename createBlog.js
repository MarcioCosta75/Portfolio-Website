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

// Default image URL if none is provided (local image)
const defaultImageURL = "static/images/default-image.png";

// Function to create a new blog post
async function createBlogPost(email, post) {
    const userDocRef = doc(db, "blogs", email);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const posts = data.posts || {};
        const postCount = Object.keys(posts).length;
        const newPostKey = `post${postCount + 1}`;

        posts[newPostKey] = post;

        await updateDoc(userDocRef, { posts });
    } else {
        const posts = {
            post1: post
        };
        await setDoc(userDocRef, { posts });
    }

    alert('Blog post created successfully!');
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
    
    // Redirect to blog listing page after creation
    window.location.href = 'listBlogs.html';
}

// Event listener for blog creation form submission
document.getElementById('createBlogForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get image URLs, use default image if none is provided
    const image1 = document.getElementById('image1').value || defaultImageURL;
    const image2 = document.getElementById('image2').value || defaultImageURL;
    const image3 = document.getElementById('image3').value || defaultImageURL;

    // Create the post object
    const post = {
        postStructure: {
            title: document.getElementById('title').value,
            introduction: document.getElementById('introduction').value,
            content: document.getElementById('bodyContent').value,
            conclusion: document.getElementById('conclusion').value,
        },
        author: document.getElementById('author').value,
        theme: document.getElementById('theme').value,
        readTime: parseInt(document.getElementById('readTime').value),
        images: {
            image1: image1,
            image2: image2,
            image3: image3,
        },
        date: new Date()
    };

    const email = "marcio.costa@dengun.com"; // Example, retrieve dynamically in a real app

    try {
        await createBlogPost(email, post);
    } catch (error) {
        console.error('Error creating post:', error);
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('errorMessage').textContent = 'Error creating post. Please try again later.';
        document.getElementById('errorMessage').style.display = 'block';
    }
});
