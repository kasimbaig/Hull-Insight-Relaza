import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  isSubmitting: boolean;
  hasEditPermission: boolean;
  hasDeletePermission: boolean;
  itemName: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  isSubmitting,
  hasEditPermission,
  hasDeletePermission,
  itemName
}) => {
  console.log('ActionButtons props:', {
    hasEditPermission,
    hasDeletePermission,
    isSubmitting,
    itemName
  });

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            disabled={isSubmitting}
            title={`Actions for ${itemName}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            onClick={onEdit} 
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={onDelete}
            className="text-red-600 focus:text-red-700 cursor-pointer"
            disabled={isSubmitting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
