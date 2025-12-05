import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAD0j20UUYETyC4FflYoW5gXZlgEdHiidQ",
  authDomain: "zdart-70ce1.firebaseapp.com",
  projectId: "zdart-70ce1",
  storageBucket: "zdart-70ce1.appspot.com",
  messagingSenderId: "969125577134",
  appId: "1:969125577134:web:f8bc6c82c5f6a3f9ee483f",
  measurementId: "G-W0KZRR52T2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadGallery() {
  const mainContainer = document.querySelector('.main');
  mainContainer.innerHTML = '<p style="color: #94a3b8; text-align:center;">Loading images...</p>';

  try {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"), limit(2));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      mainContainer.innerHTML = '<p class="placeholder">No images uploaded yet.</p>';
      return;
    }

    mainContainer.innerHTML = "";

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const id = docSnap.id;

      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <div class="card-image" style="background-image:url('${data.imageUrl}');"></div>
        <div class="card-content">
          <h3>${data.title}</h3>
          <p>${data.description}</p>
          <div class="card-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        </div>
      `;
      mainContainer.appendChild(card);

      // Delete functionality
      card.querySelector('.delete-btn').addEventListener('click', async () => {
        if (confirm("Are you sure you want to delete this image?")) {
          try {
            await deleteDoc(doc(db, "gallery", id));
            card.remove();
          } catch (err) {
            console.error(err);
            alert("Failed to delete image.");
          }
        }
      });

      // Edit functionality
      card.querySelector('.edit-btn').addEventListener('click', async () => {
        const newTitle = prompt("Enter new title:", data.title);
        const newDesc = prompt("Enter new description:", data.description);
        if (newTitle && newDesc) {
          try {
            await updateDoc(doc(db, "gallery", id), { title: newTitle, description: newDesc });
            card.querySelector('h3').textContent = newTitle;
            card.querySelector('p').textContent = newDesc;
          } catch (err) {
            console.error(err);
            alert("Failed to update image details.");
          }
        }
      });
    });
  } catch (err) {
    console.error(err);
    mainContainer.innerHTML = '<p style="color:#f87171;text-align:center;">Failed to load images.</p>';
  }
}

window.addEventListener('DOMContentLoaded', loadGallery);
