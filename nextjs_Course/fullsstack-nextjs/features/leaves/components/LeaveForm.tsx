'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import {
  type AddLeaveInput,
  type LeaveDatails,
  type UpdateLeaveInput,
} from '@/features/leaves/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { capitalize } from 'lodash';
import { type SubmitHandler, useForm } from 'react-hook-form';
import * as validators from '../validators';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export type LeaveFormProps =
  | {
      kind: 'create';
      onSubmit: SubmitHandler<AddLeaveInput>;
    }
  | {
      kind: 'edit';
      leave: LeaveDatails;
      onSubmit: SubmitHandler<UpdateLeaveInput>;
    };

const LeaveForm = (props: LeaveFormProps) => {
  const { kind, onSubmit } = props;
  const title = `${capitalize(kind)} Leave`;

  const form = useForm<AddLeaveInput | UpdateLeaveInput>({
    mode: 'onBlur',
    resolver: zodResolver(
      kind === 'create' ? validators.add : validators.update,
    ),
    defaultValues: kind === 'edit' ? props.leave : undefined,
  });

  const typedOnSubmit = onSubmit as SubmitHandler<
    AddLeaveInput | UpdateLeaveInput
  >;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(typedOnSubmit)}>
        <h1 className="text-center text-3xl font-bold">{title}</h1>
        <Separator className="my-4"></Separator>
        <FormField
          control={form.control}
          name="leaveDate"
          render={({ field }) => {
            const leaveDate = new Date(field.value ?? '');

            return (
              <FormItem className="my-2 flex flex-col">
                <FormLabel>Leave Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(leaveDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={leaveDate}
                      onSelect={(date) => {
                        if (!date) return;

                        form.setValue('leaveDate', date.toISOString(), {
                          shouldValidate: true,
                        });
                      }}
                      disabled={(date) => date < new Date()}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            );
          }}
        ></FormField>
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your leave"
                  className="resize-none"
                  {...field}
                ></Textarea>
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <Button
          type="submit"
          className="my-4"
          disabled={!form.formState.isValid}
        >
          {title}
        </Button>
      </form>
    </Form>
  );
};
export default LeaveForm;
