
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Event } from '@/lib/types';
import { useToast } from './use-toast';

const STORAGE_KEY = 'financial_events';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const getEventsFromStorage = useCallback((): Event[] => {
    try {
      const storedEvents = localStorage.getItem(STORAGE_KEY);
      if (storedEvents) {
        // Ensure date strings are valid before creating Date objects
        return JSON.parse(storedEvents).sort((a: Event, b: Event) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
    } catch (error) {
      console.error("Error parsing events from localStorage", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load saved events.",
      });
    }
    return [];
  }, [toast]);

  useEffect(() => {
    setIsLoading(true);
    setEvents(getEventsFromStorage());
    setIsLoading(false);
  }, [getEventsFromStorage]);

  const saveEventsToStorage = (updatedEvents: Event[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
      // Re-sort and set state after any modification
      setEvents(updatedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
       console.error("Error saving events to localStorage", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save your changes.",
      });
    }
  };

  const addEvent = useCallback((newEventData: Omit<Event, 'id'>) => {
    const currentEvents = getEventsFromStorage();
    const newEvent: Event = {
      ...newEventData,
      id: Date.now().toString(), // Simple, URL-safe unique ID
    };
    saveEventsToStorage([...currentEvents, newEvent]);
  }, [getEventsFromStorage]);

  const getEvent = useCallback((id: string) => {
      return getEventsFromStorage().find(event => event.id === id);
  }, [getEventsFromStorage]);


  const updateEvent = useCallback((updatedEvent: Event) => {
    const currentEvents = getEventsFromStorage();
    const eventIndex = currentEvents.findIndex(e => e.id === updatedEvent.id);
    if (eventIndex > -1) {
      currentEvents[eventIndex] = updatedEvent;
      saveEventsToStorage(currentEvents);
    }
  }, [getEventsFromStorage]);

  const deleteEvent = useCallback((id: string) => {
    const currentEvents = getEventsFromStorage();
    const filteredEvents = currentEvents.filter(event => event.id !== id);
    saveEventsToStorage(filteredEvents);
  }, [getEventsFromStorage]);

  return { events, isLoading, addEvent, getEvent, updateEvent, deleteEvent };
}
