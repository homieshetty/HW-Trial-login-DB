
"use client";

import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, getDoc, where } from "firebase/firestore";
import { db } from '@/lib/firebase';
import type { Event } from '@/lib/types';
import { useToast } from './use-toast';
import { useAuth } from './useAuth';

const EVENTS_COLLECTION = 'events';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchEvents = useCallback(async () => {
    if (!user) {
        setEvents([]);
        setIsLoading(false);
        return;
    };

    setIsLoading(true);
    try {
      const eventsCollection = collection(db, EVENTS_COLLECTION);
      const q = query(
        eventsCollection, 
        where("userId", "==", user.uid), 
        orderBy("date", "desc")
      );
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
  }, [toast, user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const addEvent = useCallback(async (event: Omit<Event, 'id' | 'userId'>) => {
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to add an event." });
        return;
    }
    setIsLoading(true);
    try {
      const newEvent = { ...event, userId: user.uid };
      const docRef = await addDoc(collection(db, EVENTS_COLLECTION), newEvent);
      // No need for local state update, fetchEvents will be called by useEffect
      fetchEvents();
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
  }, [toast, user, fetchEvents]);

  const getEvent = useCallback(async (id: string) => {
    if (!user) return undefined;
    setIsLoading(true);
    try {
        const docRef = doc(db, EVENTS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().userId === user.uid) {
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
  }, [toast, user]);

  const updateEvent = useCallback(async (updatedEvent: Event) => {
    if (!user) return;
    setIsLoading(true);
    const { id, ...eventData } = updatedEvent;
    
    // Ensure userId is correctly maintained
    if (eventData.userId !== user.uid) {
        toast({ variant: "destructive", title: "Error", description: "You cannot update this event." });
        setIsLoading(false);
        return;
    }

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
  }, [fetchEvents, toast, user]);

  const deleteEvent = useCallback(async (id: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Security check before deleting
      const eventToDelete = await getEvent(id);
      if (!eventToDelete) {
          toast({ variant: "destructive", title: "Error", description: "Event not found or you don't have permission." });
          return;
      }
      await deleteDoc(doc(db, EVENTS_COLLECTION, id));
      fetchEvents();
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
  }, [toast, user, getEvent, fetchEvents]);

  return { events, isLoading, addEvent, getEvent, updateEvent, deleteEvent, fetchEvents };
}
