// dashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================
// PASTE YOUR FIREBASE CONFIG HERE
// ============================================

const firebaseConfig = {

  apiKey: "YOUR_API_KEY",

  authDomain: "YOUR_AUTH_DOMAIN",

  projectId: "YOUR_PROJECT_ID",

  storageBucket: "YOUR_STORAGE_BUCKET",

  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

  appId: "YOUR_APP_ID"

};


// ============================================
// INITIALIZE FIREBASE
// ============================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ============================================
// ELEMENTS
// ============================================

const welcomeText = document.getElementById("welcomeText");

const emptyState = document.getElementById("emptyState");

const accountsGrid = document.getElementById("accountsGrid");

const logoutBtn = document.getElementById("logoutBtn");


// ============================================
// AUTH CHECK
// ============================================

onAuthStateChanged(auth, async (user) => {

  // USER NOT LOGGED IN
  if (!user) {

    window.location.href = "login.html";

    return;
  }

  // WELCOME MESSAGE
  welcomeText.innerText = `Welcome, ${user.email}`;

  // GET USER DOCUMENT
  const userRef = doc(db, "users", user.uid);

  const userSnap = await getDoc(userRef);

  // NO USER DATA
  if (!userSnap.exists()) {

    emptyState.style.display = "block";

    return;
  }

  const userData = userSnap.data();

  // NO ACCOUNTS
  if (!userData.accounts || userData.accounts.length === 0) {

    emptyState.style.display = "block";

    return;
  }

  // HAS ACCOUNTS
  emptyState.style.display = "none";

  // RENDER ACCOUNTS
  userData.accounts.forEach(account => {

    const progress = account.progress || 0;

    const card = document.createElement("div");

    card.classList.add("account-card");

    card.innerHTML = `

      <h2 class="account-title">
        $${account.size.toLocaleString()} Challenge
      </h2>

      <div class="metric">
        <div class="metric-label">Status</div>
        <div class="metric-value">${account.status}</div>
      </div>

      <div class="metric">
        <div class="metric-label">Phase</div>
        <div class="metric-value">${account.phase}</div>
      </div>

      <div class="metric">
        <div class="metric-label">Balance</div>
        <div class="metric-value">
          $${account.balance.toLocaleString()}
        </div>
      </div>

      <div class="metric">
        <div class="metric-label">Profit Target</div>
        <div class="metric-value">${progress}%</div>
      </div>

      <div class="progress-wrapper">

        <div class="progress-header">
          <span>Progress</span>
          <span>${progress}%</span>
        </div>

        <div class="progress-bar">

          <div 
            class="progress-fill"
            style="width:${progress}%">
          </div>

        </div>

      </div>

    `;

    accountsGrid.appendChild(card);

  });

});


// ============================================
// LOGOUT
// ============================================

logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

  window.location.href = "login.html";

});
