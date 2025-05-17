
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintsApi, agenciesApi } from '@/services/api';
import { Complaint } from '@/types';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  agencyId: z.string().min(1, 'Please select an agency'),
  status: z.string().optional(),
});

const categories = [
  'Infrastructure',
  'Public Safety',
  'Environmental',
  'Transportation',
  'Utilities',
  'Noise',
  'Sanitation',
  'Other',
];

const statuses = [
  'Open',
  'In_Progress',
  'Resolved',
  'Closed',
];

const ComplaintForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      agencyId: '',
      status: 'Open',
    },
  });

  // Load complaint data if editing
  const { data: complaint, isLoading: isLoadingComplaint } = useQuery({
    queryKey: ['complaints', id],
    queryFn: () => complaintsApi.getById(Number(id)),
    enabled: isEditing,
  });

  // Load agencies for dropdown
  const { data: agencies, isLoading: isLoadingAgencies } = useQuery({
    queryKey: ['agencies'],
    queryFn: agenciesApi.getAll,
  });

  // Set form values once complaint data is loaded
  useEffect(() => {
    if (complaint) {
      form.reset({
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        agencyId: String(complaint.agencyId),
        status: complaint.status,
      });
    }
  }, [complaint, form]);

  const createMutation = useMutation({
    mutationFn: (data: Omit<Complaint, 'id'>) => complaintsApi.create(data),
    onSuccess: () => {
      toast.success('Complaint created successfully');
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      navigate('/complaints');
    },
    onError: (error) => {
      toast.error(`Failed to create: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Complaint> }) => 
      complaintsApi.update(id, data),
    onSuccess: () => {
      toast.success('Complaint updated successfully');
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      navigate('/complaints');
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const complaintData = {
      title: data.title,
      description: data.description,
      category: data.category,
      agencyId: parseInt(data.agencyId),
      status: data.status || 'Open',
    };

    if (isEditing && id) {
      updateMutation.mutate({ id: parseInt(id), data: complaintData });
    } else {
      createMutation.mutate(complaintData as Omit<Complaint, 'id'>);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isLoading = isLoadingComplaint || isLoadingAgencies;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/complaints')}>
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Complaint' : 'Create New Complaint'}</h1>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter complaint title" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agencyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agency</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoading || !agencies}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an agency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {agencies?.map((agency) => (
                        <SelectItem key={agency.id} value={String(agency.id)}>
                          {agency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide detailed information about the complaint..." 
                      className="min-h-32" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/complaints')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Complaint' : 'Submit Complaint'}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ComplaintForm;
