"use client";

import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, getDoc, writeBatch } from "firebase/firestore";
import { db } from '@/lib/firebase';
import type { Event } from '@/lib/types';
import { useToast } from './use-toast';

const EVENTS_COLLECTION = 'events';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const eventsCollection = collection(db, EVENTS_COLLECTION);
      const q = query(eventsCollection, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events from Firestore: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch events from the database.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const addEvent = useCallback(async (event: Omit<Event, 'id'>) => {
    setIsLoading(true);
    try {
      const docRef = await addDoc(collection(db, EVENTS_COLLECTION), event);
      setEvents(prevEvents => [{ id: docRef.id, ...event }, ...prevEvents]);
       // Manually re-sort to be safe
      setEvents(prev => [...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error("Error adding event to Firestore: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save the new event.",
      });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  const getEvent = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
        const docRef = doc(db, EVENTS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Event;
        } else {
            return undefined;
        }
    } catch (error) {
        console.error("Error fetching event: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not retrieve the event.",
        });
        return undefined;
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  const updateEvent = useCallback(async (updatedEvent: Event) => {
    setIsLoading(true);
    const { id, ...eventData } = updatedEvent;
    try {
      const eventDoc = doc(db, EVENTS_COLLECTION, id);
      await updateDoc(eventDoc, eventData);
      fetchEvents(); // Refetch all events to ensure data is consistent
    } catch (error) {
      console.error("Error updating event in Firestore: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update the event.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchEvents, toast]);

  const deleteEvent = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, EVENTS_COLLECTION, id));
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    } catch (error) {
      console.error("Error deleting event from Firestore: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete the event.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return { events, isLoading, addEvent, getEvent, updateEvent, deleteEvent, fetchEvents };
}
