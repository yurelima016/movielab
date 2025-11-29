import { useState, createContext, useEffect } from "react";
import { auth, db } from "../services/firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        let data = {
          uid: uid,
          name: docSnap.data()?.name,
          email: user.email,
        };
        setUser(data);
        setLoadingAuth(false);
      } else {
        setUser(null);
        setLoadingAuth(false);
      }
    });
    return () => unsub();
  }, []);

  async function signUp(email, password, name) {
    try {
      const value = await createUserWithEmailAndPassword(auth, email, password);

      // CORREÇÃO 1: Trocado DataView por db
      await setDoc(doc(db, "users", value.user.uid), {
        name: name,
        createdAt: new Date(),
      });

      let data = {
        uid: value.user.uid,
        name: name,
        email: value.user.email,
      };

      setUser(data);
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        alert("Esse email já existe!");
      } else {
        alert("Erro ao cadastrar!");
      }
    }
  }

  async function signIn(email, password) {
    try {
      const value = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, "users", value.user.uid);
      const docSnap = await getDoc(docRef);

      let data = {
        uid: value.user.uid,
        name: docSnap.data()?.name,
        email: value.user.email,
      };

      setUser(data);
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Erro ao fazer login! Verifique email e senha.");
    }
  }

  async function signOutUser() {
    await signOut(auth);
    setUser(null);
    navigate("/login");
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, signUp, signIn, signOutUser, loadingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
