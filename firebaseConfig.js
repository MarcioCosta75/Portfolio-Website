// firebaseConfig.js
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

// Inicializando Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
