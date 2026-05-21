import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getAuth,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
getFirestore,
doc,
getDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// FIREBASE CONFIG

const firebaseConfig = {

// YOUR CONFIG HERE

};


// INIT

const app =
initializeApp(firebaseConfig);

const auth =
getAuth(app);

const db =
getFirestore(app);


// ELEMENTS

const fullName =
document.getElementById("fullName");

const emailText =
document.getElementById("emailText");

const avatarLetter =
document.getElementById("avatarLetter");

const usernameText =
document.getElementById("usernameText");

const profileEmail =
document.getElementById("profileEmail");

const accountsStat =
document.getElementById("accountsStat");

const balanceStat =
document.getElementById("balanceStat");

const progressStat =
document.getElementById("progressStat");


// AUTH

onAuthStateChanged(auth,
async(user)=>{

if(!user){

window.location.href =
"login.html";

return;
}

emailText.innerText =
user.email;

profileEmail.innerText =
user.email;

const firstLetter =
user.email.charAt(0).toUpperCase();

avatarLetter.innerText =
firstLetter;

fullName.innerText =
user.email.split("@")[0];

usernameText.innerText =
user.email.split("@")[0];


// DATABASE

const userRef =
doc(db,"users",user.uid);

const userSnap =
await getDoc(userRef);

if(!userSnap.exists()) return;

const data =
userSnap.data();


// STATS

if(data.accounts){

accountsStat.innerText =
data.accounts.length;

let totalBalance = 0;

let bestProgress = 0;

data.accounts.forEach(account=>{

totalBalance +=
account.balance || 0;

if(account.progress >
bestProgress){

bestProgress =
account.progress;
}

});

balanceStat.innerText =
`$${totalBalance.toLocaleString()}`;

progressStat.innerText =
`${bestProgress}%`;

}

});
