
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agenciesApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash, ArrowLeft, FileText } from 'lucide-react';

const AgencyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: agency, isLoading, error } = useQuery({
    queryKey: ['agencies', id],
    queryFn: () => agenciesApi.getById(Number(id)),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => agenciesApi.delete(id),
    onSuccess: () => {
      toast.success('Agency deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      navigate('/agencies');
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(Number(id));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-2">Error Loading Agency</h2>
        <p className="text-gray-500 mb-4">
          {error instanceof Error ? error.message : 'Failed to load agency details'}
        </p>
        <Button variant="secondary" onClick={() => navigate('/agencies')}>
          Back to Agencies
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/agencies')}>
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Agency Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{agency.name}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Related Complaints</h3>
            {agency.complaints && agency.complaints.length > 0 ? (
              <div className="space-y-3">
                {agency.complaints.map(complaint => (
                  <div key={complaint.id} className="flex justify-between items-center border rounded p-3">
                    <div>
                      <h4 className="font-medium">{complaint.title}</h4>
                      <p className="text-sm text-gray-500">{complaint.category}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/complaints/${complaint.id}`)}
                    >
                      <FileText size={14} className="mr-1" /> View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No complaints associated with this agency</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" onClick={() => navigate(`/agencies/edit/${agency.id}`)}>
            <Edit size={16} className="mr-1.5" /> Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash size={16} className="mr-1.5" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  {agency.complaints && agency.complaints.length > 0 
                    ? "This agency has associated complaints. You must transfer or delete all complaints before deleting the agency."
                    : "This action cannot be undone. This will permanently delete the agency."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  disabled={agency.complaints && agency.complaints.length > 0}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AgencyDetail;
