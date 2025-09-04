
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
import { PlusCircle, Trash2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { Event } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { events, isLoading, deleteEvent } = useEvents();
  const router = useRouter();
  const { toast } = useToast();

  const [isActionAlertOpen, setIsActionAlertOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const longPressTimer = useRef<NodeJS.Timeout>();
  const wasLongPress = useRef(false);
  const hasScrolled = useRef(false);
  const touchStartY = useRef(0);

  const handlePressStart = (eventData: Event, e?: React.TouchEvent) => {
    wasLongPress.current = false;
    hasScrolled.current = false;
    if (e) {
      touchStartY.current = e.touches[0].clientY;
    }
    
    longPressTimer.current = setTimeout(() => {
      if (!hasScrolled.current) {
        wasLongPress.current = true;
        setSelectedEvent(eventData);
        setIsActionAlertOpen(true);
      }
    }, 700); // 700ms for long press
  };

  const handlePressEnd = (eventData: Event) => {
    clearTimeout(longPressTimer.current);
    if (!wasLongPress.current && !hasScrolled.current) {
      router.push(`/event/${eventData.id}`);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    const moveY = e.touches[0].clientY;
    // If user has scrolled more than 10px, cancel the press actions
    if (Math.abs(moveY - touchStartY.current) > 10) {
      hasScrolled.current = true;
      clearTimeout(longPressTimer.current);
    }
  };

  const handlePressCancel = () => {
    clearTimeout(longPressTimer.current);
  }

  const handleEdit = () => {
    if (selectedEvent) {
      router.push(`/event/${selectedEvent.id}/edit`);
    }
    setIsActionAlertOpen(false);
  };

  const openDeleteConfirmation = () => {
    setIsActionAlertOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      toast({
        title: "Event Deleted",
        description: `"${selectedEvent.name}" has been removed.`,
      });
      setIsDeleteConfirmOpen(false);
      setSelectedEvent(null);
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
            <CardDescription>Click to view details, or long-press for options.</CardDescription>
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
                      onTouchStart={(e) => handlePressStart(event, e)}
                      onTouchMove={handleTouchMove}
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

      {/* Action Dialog (Edit/Delete options) */}
      <AlertDialog open={isActionAlertOpen} onOpenChange={setIsActionAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Actions for "{selectedEvent?.name}"</AlertDialogTitle>
            <AlertDialogDescription>
              What would you like to do with this event?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <Button variant="outline" onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={openDeleteConfirmation}>
               <Trash2 className="mr-2 h-4 w-4" />
               Delete
            </Button>
            <AlertDialogCancel className="mt-2 sm:mt-0" onClick={() => setSelectedEvent(null)}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event
              <span className="font-bold"> "{selectedEvent?.name}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedEvent(null)}>Cancel</AlertDialogCancel>
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
