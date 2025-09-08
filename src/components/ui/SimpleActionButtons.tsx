import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface SimpleActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  loading?: boolean;
}

export default function SimpleActionButtons({ 
  onEdit, 
  onDelete, 
  loading = false 
}: SimpleActionButtonsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        disabled={loading}
        className="h-8 w-8 p-0"
        title="Edit"
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        disabled={loading}
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
