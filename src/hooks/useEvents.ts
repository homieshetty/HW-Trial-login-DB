
"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Event } from '@/lib/types';
import { useToast } from './use-toast';

// Helper function to convert database row to Event format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDbToEvent = (dbEvent: any): Event => ({
  id: dbEvent.id,
  name: dbEvent.name,
  type: dbEvent.type,
  date: dbEvent.date,
  paymentStatus: dbEvent.payment_status,
  signInHour: dbEvent.sign_in_hour,
  signInMinute: dbEvent.sign_in_minute,
  signOutHour: dbEvent.sign_out_hour,
  signOutMinute: dbEvent.sign_out_minute,
});

// Helper function to convert Event to database format
const mapEventToDb = (event: Omit<Event, 'id'> | Event) => ({
  name: event.name,
  type: event.type,
  date: event.date,
  payment_status: event.paymentStatus,
  sign_in_hour: event.signInHour ?? null,
  sign_in_minute: event.signInMinute ?? null,
  sign_out_hour: event.signOutHour ?? null,
  sign_out_minute: event.signOutMinute ?? null,
});

export function useEvents(userId?: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;

      const eventsData: Event[] = (data || []).map(mapDbToEvent);
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
  }, [toast, userId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const addEvent = useCallback(async (newEventData: Omit<Event, 'id'>) => {
    if (!userId) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to add an event." });
      return;
    }
    
    try {
      const dbData = {
        ...mapEventToDb(newEventData),
        user_id: userId,
      };
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase
        .from('events')
        .insert(dbData as any);

      if (error) throw error;
      
      fetchEvents(); // Refetch events to get the new one
    } catch (error) {
      console.error("Error adding event", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save your new event.",
      });
    }
  }, [fetchEvents, toast, userId]);

  const getEvent = useCallback((id: string) => {
    return events.find(event => event.id === id);
  }, [events]);

  const updateEvent = useCallback(async (updatedEvent: Event) => {
    if (!userId) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to update an event." });
      return;
    }
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase
        .from('events')
        .update(mapEventToDb(updatedEvent) as any)
        .eq('id', updatedEvent.id)
        .eq('user_id', userId);

      if (error) throw error;
      
      fetchEvents(); // Refetch to get updated list
    } catch (error) {
      console.error("Error updating event", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update your event.",
      });
    }
  }, [fetchEvents, toast, userId]);

  const deleteEvent = useCallback(async (id: string) => {
    if (!userId) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to delete an event." });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      
      // Optimistically remove from UI
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    } catch (error) {
      console.error("Error deleting event", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete your event.",
      });
    }
  }, [toast, userId]);

  return { events, isLoading, addEvent, getEvent, updateEvent, deleteEvent };
}
