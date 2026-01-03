import { db } from './firebase'; // Ensure this path is correct based on folder structure
import { doc, updateDoc } from "firebase/firestore";
import { getTrip } from './firestore';

// We will implement a simple modal component that can be injected
// For now, let's keep it inside tripDetails.js or make a reusable function here.

// Let's implement the DB helper first.
// Since stops are objects in an array, updating a specific stop is tricky in Firestore
// without fetching the whole array, modifying it, and saving it back.
// Or we can treat 'stops' as a subcollection, but our data model uses an array.
// Challenge: Modifying an item in an array by index is hard in Firestore.
// Better approach for 'stops': Subcollection? Or just read-modify-write.
// Given the requirements "Add activities to stop", maybe stops should have IDs.

// CURRENT DATA MODEL DECISION:
// We used: stops: [{ city, arrival, departure, activities: [] }] in trips array.
// To add an activity to stop #N, we need to read the trip, modify stops[N], and write back.
// This is fine for a hackathon.

export const addActivityToStop = async (tripId, stopIndex, activityData) => {
    try {
        const tripRef = doc(db, "trips", tripId);
        // We need to read first to get current stops
        // In a real app we'd use a transaction
        const trip = await getTrip(tripId);
        if (!trip.stops || !trip.stops[stopIndex]) throw new Error("Stop not found");

        // Add activity
        if (!trip.stops[stopIndex].activities) {
            trip.stops[stopIndex].activities = [];
        }
        trip.stops[stopIndex].activities.push(activityData);

        // Calculate cost if any
        let newBudget = trip.budget || 0;
        if (activityData.cost) {
            newBudget += parseFloat(activityData.cost);
        }

        await updateDoc(tripRef, {
            stops: trip.stops,
            budget: newBudget
        });
    } catch (error) {
        console.error("Error adding activity:", error);
        throw error;
    }
};
