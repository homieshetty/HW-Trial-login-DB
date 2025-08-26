"use client";

import { useParams, useRouter } from "next/navigation";
import { useEvents } from "@/hooks/useEvents";
import { useEffect, useState } from "react";
import type { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { getEvent, deleteEvent, isLoading } = useEvents();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | undefined>(undefined);
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (!isLoading && id) {
      const foundEvent = getEvent(id);
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Event not found.",
        });
        router.push('/');
      }
    }
  }, [id, getEvent, isLoading, router, toast]);
  
  const handleDelete = () => {
    if (id) {
      deleteEvent(id);
      toast({
        title: "Event Deleted",
        description: `"${event?.name}" has been successfully deleted.`,
      });
      router.push('/');
    }
  };

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'Pending': return 'secondary';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  if (isLoading || !event) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-2xl">
        <div className="flex items-center space-x-2 mb-4">
            <Skeleton className="h-10 w-24" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
        </Button>
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl">{event.name}</CardTitle>
                <CardDescription>Details for your financial event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Type</span>
                    <Badge variant={event.type === 'Income' ? 'outline' : 'secondary'}>{event.type}</Badge>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Date</span>
                    <span>{format(new Date(event.date), "PPP")}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={getStatusVariant(event.status)}>{event.status}</Badge>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the event "{event.name}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button asChild size="sm">
                    <Link href={`/event/${event.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
