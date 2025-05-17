
export interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  agencyId: number;
  createdAt?: string;
  updatedAt?: string;
  agency?: Agency;
}

export interface Agency {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  complaints?: Complaint[];
}

export interface ApiError {
  error: string;
}
