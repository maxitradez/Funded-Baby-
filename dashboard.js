// dashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =====================================
// YOUR FIREBASE CONFIG
// =====================================

const firebaseConfig = {
  apiKey: "AIzaSyDaKGU5Nrtof0lA7GwZN9baIwdpVZaftbQ",
  authDomain: "the-funded.firebaseapp.com",
  projectId: "the-funded",
  storageBucket: "the-funded.firebasestorage.app",
  messagingSenderId: "656425279116",
  appId: "1:656425279116:web:d309fc0a731066f28225a9"
};

// =====================================
// FIREBASE INIT
// =====================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// =====================================
// ELEMENTS
// =====================================

const welcomeText = document.getElementById("welcomeText");

const accountSize = document.getElementById("accountSize");

const accountPhase = document.getElementById("accountPhase");

const progressPercent = document.getElementById("progressPercent");

const progressCircle = document.getElementById("progressCircle");

const balanceMetric = document.getElementById("balanceMetric");


// =====================================
// AUTH CHECK
// =====================================

onAuthStateChanged(auth, async(user)=>{

  if(!user){

    window.location.href = "login.html";

    return;
  }

  welcomeText.innerText = user.email;

  const userRef = doc(db,"users",user.uid);

  const userSnap = await getDoc(userRef);

  if(!userSnap.exists()){

    return;
  }

  const data = userSnap.data();

  if(!data.accounts || data.accounts.length === 0){

    return;
  }

  const account = data.accounts[0];

  // HERO PANEL
  accountSize.innerText =
  `$${account.size.toLocaleString()} Challenge`;

  accountPhase.innerText =
  `${account.phase} • ${account.status}`;

  // METRICS
  balanceMetric.innerText =
  `$${account.balance.toLocaleString()}`;

  // PROGRESS
  const progress = account.progress || 0;

  progressPercent.innerText =
  `${progress}%`;

  // CIRCLE ANIMATION
  const circumference = 565;

  const offset =
  circumference - (progress / 100) * circumference;

  progressCircle.style.strokeDashoffset =
  offset;

});
