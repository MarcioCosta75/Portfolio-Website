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

// DOM elements
const titleInput = document.getElementById('title');
const introductionInput = document.getElementById('introduction');
const bodyContentInput = document.getElementById('bodyContent');
const conclusionInput = document.getElementById('conclusion');
const image1Input = document.getElementById('image1URL');
const image2Input = document.getElementById('image2URL');
const image3Input = document.getElementById('image3URL');

const image1Preview = document.getElementById('image1Preview');
const image2Preview = document.getElementById('image2Preview');
const image3Preview = document.getElementById('image3Preview');

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('postId');
const email = urlParams.get('email');

// Load blog post data into form
async function loadBlogPost() {
    try {
        const postRef = doc(db, "blogs", email);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
            const postData = postSnap.data().posts[postId];

            // Pre-fill the form with current data
            titleInput.value = postData.postStructure.title;
            introductionInput.value = postData.postStructure.introduction;
            bodyContentInput.value = postData.postStructure.bodyContent;
            conclusionInput.value = postData.postStructure.conclusion;

            // Image fields
            image1Input.value = postData.images?.image1 || '';
            image2Input.value = postData.images?.image2 || '';
            image3Input.value = postData.images?.image3 || '';

            // Update image previews
            image1Preview.src = postData.images?.image1 || 'static/images/default-image.png';
            image2Preview.src = postData.images?.image2 || 'static/images/default-image.png';
            image3Preview.src = postData.images?.image3 || 'static/images/default-image.png';

        } else {
            console.error("No such document!");
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}

// Call loadBlogPost when the page is loaded
document.addEventListener('DOMContentLoaded', loadBlogPost);

// Form submission handler
document.getElementById('editBlogForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const postRef = doc(db, "blogs", email);
        
        // Prepare updated data
        const updatedPostData = {
            [`posts.${postId}.postStructure.title`]: titleInput.value,
            [`posts.${postId}.postStructure.introduction`]: introductionInput.value,
            [`posts.${postId}.postStructure.bodyContent`]: bodyContentInput.value,
            [`posts.${postId}.postStructure.conclusion`]: conclusionInput.value,
            [`posts.${postId}.images.image1`]: image1Input.value,
            [`posts.${postId}.images.image2`]: image2Input.value,
            [`posts.${postId}.images.image3`]: image3Input.value
        };

        // Update Firestore
        await updateDoc(postRef, updatedPostData);

        alert('Blog post updated successfully!');
        window.location.href = 'listBlogs.html';
    } catch (error) {
        console.error('Error updating document:', error);
    }
});
