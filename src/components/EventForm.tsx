
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useEvents } from "@/hooks/useEvents";
import { cn } from "@/lib/utils";
import type { Event } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Event name must be at least 2 characters." }).max(50),
  type: z.enum(["Event", "ODC", "Others"], { required_error: "Please select an event type." }),
  date: z.date({ required_error: "A date is required." }),
  paymentStatus: z.enum(["Paid", "Unpaid"], { required_error: "Please select a status." }),
  signInHour: z.coerce.number().min(0).max(23).optional(),
  signInMinute: z.coerce.number().min(0).max(59).optional(),
  signOutHour: z.coerce.number().min(0).max(23).optional(),
  signOutMinute: z.coerce.number().min(0).max(59).optional(),
}).refine(data => (data.signInHour !== undefined) === (data.signInMinute !== undefined), {
    message: "Both sign-in hour and minute must be provided.",
    path: ["signInHour"],
}).refine(data => (data.signOutHour !== undefined) === (data.signOutMinute !== undefined), {
    message: "Both sign-out hour and minute must be provided.",
    path: ["signOutHour"],
});

type EventFormProps = {
  event?: Event;
};

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const { addEvent, updateEvent } = useEvents();
  const { toast } = useToast();
  const isEditMode = !!event;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode
      ? { 
          ...event, 
          date: new Date(event.date),
        }
      : { 
          name: "", 
          type: "Event", 
          paymentStatus: "Unpaid", 
          date: new Date(),
          signInMinute: 0,
          signOutMinute: 0,
        },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const eventData = {
        ...values,
        date: values.date.toISOString(),
    };
    
    if (isEditMode && event) {
      updateEvent({ ...event, ...eventData });
      toast({ title: "Success", description: "Event updated successfully." });
      router.push(`/`);
    } else {
      addEvent(eventData);
      toast({ title: "Success", description: "Event created successfully." });
      router.push("/");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Monthly Salary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="ODC">ODC</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Sign In Time (24-hour)</FormLabel>
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="signInHour"
              render={({ field }) => (
                  <FormItem className="flex-1">
                  <FormControl>
                      <Input type="number" placeholder="HH" min="0" max="23" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />
            <span className="text-xl font-bold -mt-2">:</span>
            <FormField
              control={form.control}
              name="signInMinute"
              render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                        <Input type="number" placeholder="MM" min="0" max="59" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <FormLabel>Sign Out Time (24-hour)</FormLabel>
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="signOutHour"
              render={({ field }) => (
                  <FormItem className="flex-1">
                  <FormControl>
                      <Input type="number" placeholder="HH" min="0" max="23" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />
            <span className="text-xl font-bold -mt-2">:</span>
            <FormField
              control={form.control}
              name="signOutMinute"
              render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                        <Input type="number" placeholder="MM" min="0" max="59" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )}
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full md:w-auto">{isEditMode ? 'Save Changes' : 'Create Event'}</Button>
      </form>
    </Form>
  );
}
