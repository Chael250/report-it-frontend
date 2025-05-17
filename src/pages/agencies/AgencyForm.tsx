
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agenciesApi } from '@/services/api';
import { Agency } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const AgencyForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  // Load agency data if editing
  const { data: agency, isLoading } = useQuery({
    queryKey: ['agencies', id],
    queryFn: () => agenciesApi.getById(Number(id)),
    enabled: isEditing,
  });

  // Set form values once agency data is loaded
  useEffect(() => {
    if (agency) {
      form.reset({
        name: agency.name,
      });
    }
  }, [agency, form]);

  const createMutation = useMutation({
    mutationFn: (data: Omit<Agency, 'id'>) => agenciesApi.create(data),
    onSuccess: () => {
      toast.success('Agency created successfully');
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      navigate('/agencies');
    },
    onError: (error) => {
      toast.error(`Failed to create: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Agency> }) => 
      agenciesApi.update(id, data),
    onSuccess: () => {
      toast.success('Agency updated successfully');
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      navigate('/agencies');
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const agencyData = {
      name: data.name,
    };

    if (isEditing && id) {
      updateMutation.mutate({ id: parseInt(id), data: agencyData });
    } else {
      createMutation.mutate(agencyData as Omit<Agency, 'id'>);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/agencies')}>
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Agency' : 'Create New Agency'}</h1>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agency Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter agency name" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/agencies')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Agency' : 'Create Agency'}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AgencyForm;
