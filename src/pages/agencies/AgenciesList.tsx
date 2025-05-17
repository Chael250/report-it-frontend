
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { agenciesApi } from '@/services/api';
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
import { Skeleton } from '@/components/ui/skeleton';

const AgenciesList = () => {
  const navigate = useNavigate();
  
  const { data: agencies, isLoading, error } = useQuery({
    queryKey: ['agencies'],
    queryFn: agenciesApi.getAll,
  });

  if (error) {
    toast.error('Failed to load agencies');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Agencies</h1>
          <p className="text-gray-500">View all registered government agencies</p>
        </div>
        <Button onClick={() => navigate('/agencies/new')} className="flex items-center gap-1">
          <Plus size={16} /> New Agency
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : agencies && agencies.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agencies.map((agency) => (
                <TableRow key={agency.id}>
                  <TableCell className="font-medium">{agency.name}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/agencies/${agency.id}`)}
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
            <p className="text-gray-500 mb-4">No agencies found</p>
            <Button onClick={() => navigate('/agencies/new')} className="flex items-center gap-1">
              <Plus size={16} /> Create your first agency
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AgenciesList;
