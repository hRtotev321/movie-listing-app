import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC2mIvSLh6WRpy2ZogIlqk59ZRIoCBevxc",
  authDomain: "movieslist-49cde.firebaseapp.com",
  projectId: "movieslist-49cde",
  storageBucket: "movieslist-49cde.appspot.com",
  messagingSenderId: "975628726138",
  appId: "1:975628726138:web:c899fd1cd971f3b1cd30c3",
  measurementId: "G-8PD0XNWQN5"
};

export const app = initializeApp(firebaseConfig);
