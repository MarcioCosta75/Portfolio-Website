import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
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

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const email = user.email;
            listUserBlogs(email);
        } else {
            console.error('No user is signed in.');
            window.location.href = 'login.html';
        }
    });
});

// Function to list user's blogs
async function listUserBlogs(email) {
    try {
        const userDocRef = doc(db, "blogs", email);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const posts = data.posts || {};

            const blogsContainer = document.getElementById('blogsContainer');
            blogsContainer.innerHTML = ''; // Clear the blogs section

            // Check if there are posts and populate the UI
            if (Object.keys(posts).length > 0) {
                Object.keys(posts).forEach((postId) => {
                    const post = posts[postId];

                    // Create blog HTML structure dynamically for each post in a new card layout
                    const blogHTML = `
                        <div class="blog-card">
                            <div class="blog-meta-actions-container">
                                <div class="blog-meta">
                                    <span class="blog-meta-item">Author: ${post.author}</span>
                                    <span class="blog-meta-item">Theme: ${post.theme}</span>
                                    <span class="blog-meta-item">Date: ${post.date ? post.date.toDate().toLocaleDateString() : 'N/A'}</span>
                                    <span class="blog-meta-item">Read Time: ${post.readTime} min</span>
                                </div>
                                <div class="blog-actions">
                                    <button class="edit-btn" onclick="editBlog('${postId}')">Edit</button>
                                    <button class="delete-btn" onclick="deleteBlog('${postId}')">Delete</button>
                                </div>
                            </div>
                            <div class="blog-content">
                                <h2 class="blog-title"><strong>Title:</strong> ${post.postStructure.title}</h2>
                                <p class="blog-introduction"><strong>Introduction:</strong> ${post.postStructure.introduction}</p>
                                <p class="blog-body-content"><strong>Body Content:</strong> ${post.postStructure.bodyContent}</p>
                                <p class="blog-conclusion"><strong>Conclusion:</strong> ${post.postStructure.conclusion}</p>
                            </div>
                            <div class="blog-images">
                                ${generateImageHTML(post.images)}
                            </div>
                        </div>
                    `;

                    blogsContainer.innerHTML += blogHTML;
                });
            } else {
                blogsContainer.innerHTML = `<p>No blogs found for this user.</p>`;
            }
        } else {
            console.log("No such document!");
            const blogsContainer = document.getElementById('blogsContainer');
            blogsContainer.innerHTML = `<p>No blogs found for this user.</p>`;
        }
    } catch (error) {
        console.error("Error fetching blogs: ", error);
        const blogsContainer = document.getElementById('blogsContainer');
        blogsContainer.innerHTML = `<p>Error loading blogs. Please try again later.</p>`;
    }
}

// Helper function to generate image HTML with labels
function generateImageHTML(images) {
    if (images && Object.keys(images).length > 0) {
        let imageHTML = '<div class="blog-images">';
        Object.keys(images).forEach((imageKey, index) => {
            const imageNumber = index + 1;
            imageHTML += `
                <div class="blog-image-container">
                    <img src="${images[imageKey]}" alt="Blog Image ${imageNumber}" class="blog-image">
                    <p class="image-label">Image ${imageNumber}</p>
                </div>`;
        });
        imageHTML += '</div>';
        return imageHTML;
    }
    return '';
}

// Placeholder functions for editing and deleting blogs
function editBlog(postId) {
    alert(`Edit blog with ID: ${postId}`);
    // Implement the edit functionality here
}

function deleteBlog(postId) {
    alert(`Delete blog with ID: ${postId}`);
    // Implement the delete functionality here
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Error logging out:', error);
    });
});
