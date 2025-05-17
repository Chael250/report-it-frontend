import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintsApi, agenciesApi } from '@/services/api';
import { Complaint, Agency } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

const ComplaintDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: complaint, isLoading, error } = useQuery<Complaint>({
    queryKey: ['complaints', id],
    queryFn: () => complaintsApi.getById(Number(id)),
  });

  const {
  data: agency,
  isLoading: isAgencyLoading,
  error: agencyError
} = useQuery<Agency>({
  queryKey: ['agencies', complaint?.agencyId],
  queryFn: () => agenciesApi.getById(complaint?.agencyId || 0),
  enabled: !!complaint?.agencyId,
});

  const handleDelete = async () => {
    try {
      if (id) {
        await complaintsApi.delete(Number(id));
        toast.success('Complaint deleted successfully');
        navigate('/complaints');
      }
    } catch (error) {
      toast.error('Failed to delete complaint');
    }
  };

  if (error) {
    toast.error('Failed to load complaint');
  }

  if (agencyError) {
    toast.error('Failed to load agency');
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="mb-4 flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate('/complaints')} className="mr-2">
          <ArrowLeft size={16} className="mr-2" />
          Back to Complaints
        </Button>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/complaints/edit/${id}`)}
            className="mr-2"
          >
            <Pencil size={16} className="mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the complaint from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          {isLoading ? (
            <Skeleton className="h-6 w-1/2" />
          ) : (
            <h2 className="text-2xl font-bold">{complaint?.title}</h2>
          )}
          {isLoading ? (
            <Skeleton className="h-4 w-1/4 mt-2" />
          ) : (
            <p className="text-muted-foreground">
              Created At: {complaint?.createdAt ? format(new Date(complaint.createdAt), 'PPP') : 'N/A'}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Description</h3>
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : (
              <p>{complaint?.description}</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Category</h3>
            {isLoading ? (
              <Skeleton className="h-4 w-1/2" />
            ) : (
              <Badge>{complaint?.category}</Badge>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Status</h3>
            {isLoading ? (
              <Skeleton className="h-4 w-1/2" />
            ) : (
              <Badge>{complaint?.status}</Badge>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Agency</h3>
            {isAgencyLoading ? (
              <Skeleton className="h-4 w-1/2" />
            ) : (
              <Button variant="link" onClick={() => navigate(`/agencies/${complaint?.agencyId}`)}>
                {agency?.name}
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Updated At: {complaint?.updatedAt ? format(new Date(complaint.updatedAt), 'PPP') : 'N/A'}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ComplaintDetail;
