import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { complaintsApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Complaint } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const ComplaintsList = () => {
  const navigate = useNavigate();
  
  const { data: complaints, isLoading, error } = useQuery({
    queryKey: ['complaints'],
    queryFn: complaintsApi.getAll,
  });

  if (error) {
    toast.error('Failed to load complaints');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Complaints</h1>
          <p className="text-gray-500">View all submitted complaints</p>
        </div>
        <Button onClick={() => navigate('/complaints/new')} className="flex items-center gap-1">
          <Plus size={16} /> New Complaint
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : complaints && complaints.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint: Complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{complaint.title}</TableCell>
                  <TableCell>{complaint.category}</TableCell>
                  <TableCell>{complaint.status}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/complaints/${complaint.id}`)}
                      className="flex items-center gap-1"
                    >
                      View <ArrowRight size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No complaints found</p>
            <Button onClick={() => navigate('/complaints/new')} className="flex items-center gap-1">
              <Plus size={16} /> Submit your first complaint
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ComplaintsList;
