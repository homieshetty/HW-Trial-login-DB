
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Event } from '@/lib/types';
import { useToast } from './use-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const EVENTS_COLLECTION = 'events';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const getEventsFromFirestore = useCallback(async () => {
    setIsLoading(true);
    try {
      const eventsCollection = collection(db, EVENTS_COLLECTION);
      const q = query(eventsCollection, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Event));
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events from Firestore", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load events from the cloud.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    getEventsFromFirestore();
  }, [getEventsFromFirestore]);
  
  const addEvent = useCallback(async (newEventData: Omit<Event, 'id'>) => {
    try {
      const eventsCollection = collection(db, EVENTS_COLLECTION);
      const docRef = await addDoc(eventsCollection, newEventData);
      setEvents(prevEvents => [{ id: docRef.id, ...newEventData } as Event, ...prevEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
       console.error("Error adding event to Firestore", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save your new event.",
      });
    }
  }, [toast]);

  const getEvent = useCallback((id: string) => {
      // This function can now find the event from the local state
      // as it's populated from Firestore on load.
      return events.find(event => event.id === id);
  }, [events]);


  const updateEvent = useCallback(async (updatedEvent: Event) => {
    try {
      const eventDoc = doc(db, EVENTS_COLLECTION, updatedEvent.id);
      // We need to create a copy of the object without the id to update the document
      const { id, ...eventData } = updatedEvent;
      await updateDoc(eventDoc, eventData);
      getEventsFromFirestore(); // Refresh data from firestore
    } catch (error) {
       console.error("Error updating event in Firestore", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update your event.",
      });
    }
  }, [toast, getEventsFromFirestore]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
        const eventDoc = doc(db, EVENTS_COLLECTION, id);
        await deleteDoc(eventDoc);
        setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    } catch (error) {
        console.error("Error deleting event from Firestore", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not delete your event.",
        });
    }
  }, [toast]);

  return { events, isLoading, addEvent, getEvent, updateEvent, deleteEvent };
}
