"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import type { Event } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, BadgeDollarSign, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { EventForm } from "@/components/EventForm";

export default function EventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { getEvent, deleteEvent, isLoading: areEventsLoading } = useEvents(user?.uid);
  const [event, setEvent] = useState<Event | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Get event ID and edit mode from URL search params
  const eventId = searchParams.get('id');
  const isEditMode = searchParams.get('mode') === 'edit';

  useEffect(() => {
    if (eventId && !areEventsLoading) {
      const foundEvent = getEvent(eventId);
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Event not found.",
        });
        router.replace('/');
      }
      setIsLoading(false);
    }
  }, [eventId, getEvent, router, toast, areEventsLoading]);
  
  const handleDelete = async () => {
    if (event) {
      await deleteEvent(event.id);
      toast({
        title: "Event Deleted",
        description: `"${event.name}" has been removed.`,
      });
      router.replace('/');
    }
  };

  const formatTime = (hour?: number, minute?: number) => {
    if (hour === undefined || minute === undefined) return "Not Set";
    const date = new Date();
    date.setHours(hour, minute);
    return format(date, "HH:mm");
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'default';
      case 'Unpaid':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Show edit form if this is edit mode
  if (isEditMode) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-2xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Event
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Event</CardTitle>
            <CardDescription>Update the details of your financial event.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || areEventsLoading || !event ? (
              <div className="space-y-8">
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-2 gap-8">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-32" />
              </div>
            ) : (
              <EventForm event={event} />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show event detail page
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/event?id=${eventId}&mode=edit`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
            </Button>
             <Button variant="destructive" onClick={() => setIsDeleteConfirmOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
            </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          {event && !areEventsLoading ? (
            <>
              <CardTitle className="text-2xl">{event.name}</CardTitle>
              <CardDescription>Type: {event.type}</CardDescription>
            </>
          ) : (
             <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
            </div>
          )}
        </CardHeader>
        <CardContent>
          {event && !areEventsLoading ? (
            <div className="space-y-4 text-sm">
                <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                        <p className="font-medium">Date</p>
                        <p className="text-muted-foreground">{format(new Date(event.date), 'PPP')}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <BadgeDollarSign className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                        <p className="font-medium">Payment Status</p>
                        <Badge variant={getStatusVariant(event.paymentStatus)}>{event.paymentStatus}</Badge>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                        <p className="font-medium">Sign In Time</p>
                        <p className="text-muted-foreground">{formatTime(event.signInHour, event.signInMinute)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                        <p className="font-medium">Sign Out Time</p>
                        <p className="text-muted-foreground">{formatTime(event.signOutHour, event.signOutMinute)}</p>
                    </div>
                </div>
            </div>
          ) : (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event
              <span className="font-bold"> &quot;{event?.name}&quot;</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
