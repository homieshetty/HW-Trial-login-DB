
"use client";

import { useRef, useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { Event } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { events, isLoading, deleteEvent } = useEvents();
  const router = useRouter();
  const { toast } = useToast();

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const longPressTimer = useRef<NodeJS.Timeout>();
  const wasLongPress = useRef(false);


  const handlePressStart = (eventData: Event) => {
    wasLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      wasLongPress.current = true;
      setEventToDelete(eventData);
      setIsAlertOpen(true);
    }, 700); // 700ms for long press
  };

  const handlePressEnd = (eventData: Event) => {
    clearTimeout(longPressTimer.current);
    if (!wasLongPress.current) {
      router.push(`/event/${eventData.id}/edit`);
    }
  };
  
  const handlePressCancel = () => {
    clearTimeout(longPressTimer.current);
  }

  const handleDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id);
      toast({
        title: "Event Deleted",
        description: `"${eventToDelete.name}" has been removed.`,
      });
      setIsAlertOpen(false);
      setEventToDelete(null);
    }
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

  return (
    <>
      <div className="container mx-auto p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Your Financial Events</p>
          </div>
        </header>
        
        <Card>
          <CardHeader>
            <CardTitle>All Events</CardTitle>
            <CardDescription>Click to edit, or long-press to delete an event.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : events.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Payment Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow 
                      key={event.id}
                      onMouseDown={() => handlePressStart(event)}
                      onMouseUp={() => handlePressEnd(event)}
                      onMouseLeave={handlePressCancel}
                      onTouchStart={() => handlePressStart(event)}
                      onTouchEnd={() => handlePressEnd(event)}
                      className="cursor-pointer hover:bg-accent/50 select-none"
                    >
                      <TableCell>
                        <div className="font-medium">{event.name}</div>
                        <div className="text-sm text-muted-foreground md:hidden">{format(new Date(event.date), 'MMM d, yyyy')}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(new Date(event.date), 'PPP')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={getStatusVariant(event.paymentStatus)}>{event.paymentStatus}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">You have no events yet.</p>
                <Button asChild>
                  <Link href="/add">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create First Event
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event
              <span className="font-bold"> "{eventToDelete?.name}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEventToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

