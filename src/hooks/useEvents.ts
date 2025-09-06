
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Event } from '@/lib/types';
import { useToast } from './use-toast';

const LOCAL_STORAGE_KEY = 'financial_events';

// Helper function to get events from local storage
const getEventsFromLocalStorage = (): Event[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const storedEvents = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedEvents) {
    try {
      return JSON.parse(storedEvents);
    } catch (e) {
      console.error("Failed to parse events from local storage", e);
      return [];
    }
  }
  return [];
};

// Helper function to save events to local storage
const saveEventsToLocalStorage = (events: Event[]) => {
   if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  }
};


export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const eventsData = getEventsFromLocalStorage();
    // Sort events by date in descending order
    eventsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setEvents(eventsData);
    setIsLoading(false);
  }, []);
  
  const addEvent = useCallback((newEventData: Omit<Event, 'id'>) => {
    try {
        const newEvent: Event = {
            id: new Date().toISOString(), // Simple unique ID
            ...newEventData
        };
        const updatedEvents = [newEvent, ...events];
        updatedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEvents(updatedEvents);
        saveEventsToLocalStorage(updatedEvents);
    } catch (error) {
        console.error("Error adding event", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not save your new event.",
        });
    }
  }, [events, toast]);

  const getEvent = useCallback((id: string) => {
      return events.find(event => event.id === id);
  }, [events]);


  const updateEvent = useCallback((updatedEvent: Event) => {
    try {
        const updatedEvents = events.map(event =>
            event.id === updatedEvent.id ? updatedEvent : event
        );
        updatedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEvents(updatedEvents);
        saveEventsToLocalStorage(updatedEvents);
    } catch (error) {
        console.error("Error updating event", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not update your event.",
        });
    }
  }, [events, toast]);

  const deleteEvent = useCallback((id: string) => {
    try {
        const updatedEvents = events.filter(event => event.id !== id);
        setEvents(updatedEvents);
        saveEventsToLocalStorage(updatedEvents);
    } catch (error) {
        console.error("Error deleting event", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not delete your event.",
        });
    }
  }, [events, toast]);

  return { events, isLoading, addEvent, getEvent, updateEvent, deleteEvent };
}
