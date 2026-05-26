import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'

// ─── Init ─────────────────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const db      = getFirestore(app)
export const auth    = getAuth(app)
export const storage = getStorage(app)

// ─── Storage ──────────────────────────────────────────────────────────────────

// Uploads a file to thumbnails/{slug}/{filename} and returns the download URL.
// onProgress(0-100) is called during upload.
export function uploadThumbnail(slug, file, onProgress) {
  return new Promise((resolve, reject) => {
    const path = `thumbnails/${slug}`
    const ref  = storageRef(storage, path)
    const task = uploadBytesResumable(ref, file)

    task.on(
      'state_changed',
      snap => onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve(url)
      }
    )
  })
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects() {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getProjectBySlug(slug) {
  // Firestore doesn't have a unique index like SQL, so we fetch all and filter.
  // For a small portfolio this is fine; add a composite index if needed.
  const snap = await getDocs(collection(db, 'projects'))
  const match = snap.docs.find(d => d.data().slug === slug)
  if (!match) throw new Error(`Project not found: ${slug}`)
  return { id: match.id, ...match.data() }
}

export async function createProject(project) {
  const ref = await addDoc(collection(db, 'projects'), {
    ...project,
    createdAt: serverTimestamp(),
  })
  return { id: ref.id, ...project }
}

export async function updateProject(id, updates) {
  const ref = doc(db, 'projects', id)
  await updateDoc(ref, updates)
  return { id, ...updates }
}

export async function deleteProject(id) {
  await deleteDoc(doc(db, 'projects', id))
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function signIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred
}

export async function signOut() {
  await firebaseSignOut(auth)
}

export async function getSession() {
  // Returns current user synchronously from the auth cache.
  // Wrap in a promise to match the Supabase API shape the rest of the app expects.
  return new Promise(resolve => {
    const unsub = auth.onAuthStateChanged(user => {
      unsub()
      // Return a session-like object so Admin.jsx doesn't need changing.
      resolve(user ? { user: { email: user.email } } : null)
    })
  })
}
