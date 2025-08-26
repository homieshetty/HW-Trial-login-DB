"use client";

import { useEvents } from '@/hooks/useEvents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { events, isLoading } = useEvents();
  const router = useRouter();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>A list of all your financial events.</CardDescription>
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
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id} onClick={() => router.push(`/event/${event.id}`)} className="cursor-pointer hover:bg-accent/50">
                    <TableCell>
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm text-muted-foreground md:hidden">{format(new Date(event.date), 'MMM d, yyyy')}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={event.type === 'Income' ? 'outline' : 'secondary'}>{event.type}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(event.date), 'PPP')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getStatusVariant(event.status)}>{event.status}</Badge>
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
  );
}
