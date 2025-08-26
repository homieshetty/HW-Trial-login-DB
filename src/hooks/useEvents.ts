"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Event } from '@/lib/types';

const STORAGE_KEY = 'cash-compass-events';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const items = window.localStorage.getItem(STORAGE_KEY);
      if (items) {
        setEvents(JSON.parse(items));
      }
    } catch (error) {
      console.error("Failed to load events from local storage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveEvents = (updatedEvents: Event[]) => {
    try {
      // Sort events by date, most recent first
      const sortedEvents = updatedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setEvents(sortedEvents);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedEvents));
    } catch (error) {
      console.error("Failed to save events to local storage", error);
    }
  };

  const addEvent = useCallback((event: Omit<Event, 'id'>) => {
    const newEvent = { ...event, id: crypto.randomUUID() };
    // This logic needs to access the latest state
    setEvents(prevEvents => {
        const newEvents = [newEvent, ...prevEvents];
        saveEvents(newEvents);
        return newEvents;
    });
    return newEvent;
  }, []);

  const getEvent = useCallback((id: string) => {
    // This should also use the state updater form if it relies on a recent state.
    // However, it is a read operation, so direct state access is fine.
    const allEvents = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return allEvents.find((event: Event) => event.id === id);
  }, []);

  const updateEvent = useCallback((updatedEvent: Event) => {
     setEvents(prevEvents => {
        const updatedEvents = prevEvents.map(event =>
            event.id === updatedEvent.id ? updatedEvent : event
        );
        saveEvents(updatedEvents);
        return updatedEvents;
    });
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prevEvents => {
        const updatedEvents = prevEvents.filter(event => event.id !== id);
        saveEvents(updatedEvents);
        return updatedEvents;
    });
  }, []);

  return { events, isLoading, addEvent, getEvent, updateEvent, deleteEvent };
}
