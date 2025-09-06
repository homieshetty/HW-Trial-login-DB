
"use client";

import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from "firebase/firestore";
import type { Event } from '@/lib/types';
import { db } from '@/lib/firebase';
import { useToast } from './use-toast';

export function useEvents(userId?: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const getEventsCollection = useCallback((uid: string) => {
    return collection(db, 'users', uid, 'events');
  }, []);

  const fetchEvents = useCallback(async () => {
    if (!userId) {
        setIsLoading(false);
        return;
    };
    setIsLoading(true);
    try {
      const eventsCollection = getEventsCollection(userId);
      const q = query(eventsCollection, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const eventsData: Event[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Ensure date is a string. Firestore Timestamps need to be converted.
        const date = data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date;
        return { id: doc.id, ...data, date } as Event;
      });
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch events from the database.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, userId, getEventsCollection]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  
  const addEvent = useCallback(async (newEventData: Omit<Event, 'id'>) => {
    if (!userId) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to add an event." });
      return;
    }
    try {
      const eventsCollection = getEventsCollection(userId);
      await addDoc(eventsCollection, newEventData);
      fetchEvents(); // Refetch events to get the new one
    } catch (error) {
      console.error("Error adding event", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save your new event.",
      });
    }
  }, [fetchEvents, toast, userId, getEventsCollection]);

  const getEvent = useCallback((id: string) => {
    return events.find(event => event.id === id);
  }, [events]);

  const updateEvent = useCallback(async (updatedEvent: Event) => {
     if (!userId) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to update an event." });
      return;
    }
    try {
      const eventDoc = doc(db, 'users', userId, 'events', updatedEvent.id);
      // Omit the 'id' field from the data being sent to Firestore
      const { id, ...eventData } = updatedEvent;
      await updateDoc(eventDoc, eventData);
      fetchEvents(); // Refetch to get updated list
    } catch (error) {
      console.error("Error updating event", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update your event.",
      });
    }
  }, [fetchEvents, toast, userId, getEventsCollection]);

  const deleteEvent = useCallback(async (id: string) => {
     if (!userId) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to delete an event." });
      return;
    }
    try {
      const eventDoc = doc(db, 'users', userId, 'events', id);
      await deleteDoc(eventDoc);
      // Optimistically remove from UI, or refetch
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    } catch (error) {
      console.error("Error deleting event", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete your event.",
      });
    }
  }, [toast, userId, getEventsCollection]);

  return { events, isLoading, addEvent, getEvent, updateEvent, deleteEvent };
}
