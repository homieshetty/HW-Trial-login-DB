
"use client"
import { EventForm } from "@/components/EventForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function AddEventPage() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Event</CardTitle>
          <CardDescription>Fill out the form below to add a new financial event.</CardDescription>
        </CardHeader>
        <CardContent>
          {user && <EventForm />}
        </CardContent>
      </Card>
    </div>
  );
}
