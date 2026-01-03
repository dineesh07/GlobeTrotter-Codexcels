import { db } from './firebase';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    arrayUnion,
    orderBy,
    serverTimestamp,
    limit,
    startAfter,
    deleteDoc
} from "firebase/firestore";

// Collection Reference
const tripsRef = collection(db, "trips");

/**
 * Get recent trips from all users (for Community Feed)
 */
export const getRecentTrips = async (limitCount = 20) => {
    try {
        const q = query(
            tripsRef,
            orderBy("createdAt", "desc"),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);
        const trips = [];
        querySnapshot.forEach((doc) => {
            trips.push({ id: doc.id, ...doc.data() });
        });
        return trips;
    } catch (error) {
        console.error("Error getting public trips:", error);
        return [];
    }
};

/**
 * Creates a new trip in Firestore
 * @param {string} userId - Auth ID of the user
 * @param {object} tripData - { name, startDate, endDate, description }
 */
export const createTrip = async (userId, tripData) => {
    try {
        const docRef = await addDoc(tripsRef, {
            userId,
            ...tripData,
            createdAt: serverTimestamp(),
            budget: 0,
            stops: []
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating trip: ", error);
        throw error;
    }
};

/**
 * Fetches all trips for a specific user
 * @param {string} userId 
 */
export const getUserTrips = async (userId) => {
    try {
        const q = query(
            tripsRef,
            where("userId", "==", userId),
            orderBy("startDate", "asc")
        );

        const querySnapshot = await getDocs(q);
        const trips = [];
        querySnapshot.forEach((doc) => {
            trips.push({ id: doc.id, ...doc.data() });
        });
        return trips;
    } catch (error) {
        console.error("Error getting trips: ", error);
        throw error;
    }
};

/**
 * Get a single trip by ID
 * @param {string} tripId
 */
export const getTrip = async (tripId) => {
    try {
        const docRef = doc(db, "trips", tripId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("No such trip!");
        }
    } catch (error) {
        console.error("Error getting trip:", error);
        throw error;
    }
};

/**
 * Add a stop to a trip
 * @param {string} tripId 
 * @param {object} stopData - { city, arrivalDate, departureDate, etc. }
 */
export const addTripStop = async (tripId, stopData) => {
    try {
        const tripRef = doc(db, "trips", tripId);
        // atomic update to 'stops' array
        await updateDoc(tripRef, {
            stops: arrayUnion(stopData)
        });
    } catch (error) {
        console.error("Error adding stop:", error);
        throw error;
    }
};

/**
 * Delete a trip by ID
 * @param {string} tripId
 */
export const deleteTrip = async (tripId) => {
    try {
        await deleteDoc(doc(db, "trips", tripId));
    } catch (error) {
        console.error("Error deleting trip:", error);
        throw error;
    }
};
