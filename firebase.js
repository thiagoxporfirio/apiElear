const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyBytohGOK6m-1RM-ru37_7T4gFHKsSct1Q",
  authDomain: "apielear.firebaseapp.com",
  databaseURL: "https://apielear-default-rtdb.firebaseio.com",
  projectId: "apielear",
  storageBucket: "apielear.appspot.com",
  messagingSenderId: "573835637468",
  appId: "1:573835637468:web:f2d5ca54cc69f06b667a19",
  measurementId: "G-2FTCE42E8E",
};

firebase.initializeApp(firebaseConfig);

module.exports = { firebase };
