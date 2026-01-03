import { auth, db } from './firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const registerUser = async (email, password, additionalData = {}) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Auth Profile (Display Name)
        if (additionalData.firstName && additionalData.lastName) {
            await updateProfile(user, {
                displayName: `${additionalData.firstName} ${additionalData.lastName}`
            });
        }

        // Save extra data to Firestore 'users' collection
        await setDoc(doc(db, "users", user.uid), {
            email: email,
            firstName: additionalData.firstName || '',
            lastName: additionalData.lastName || '',
            city: additionalData.city || '',
            country: additionalData.country || '',
            phone: additionalData.phone || '', // Wireframe had Phone
            createdAt: new Date().toISOString()
        });

        return user;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};

export const observeAuth = (callback) => {
    onAuthStateChanged(auth, callback);
};
