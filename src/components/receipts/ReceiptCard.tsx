
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Download, Clock, MapPin, Calendar, DollarSign } from 'lucide-react';
import { formatDistanceStrict, format } from 'date-fns';
import { Reservation } from '@/lib/types';

interface ReceiptCardProps {
  reservation: Reservation;
  spotName: string;
  spotAddress: string;
}

const ReceiptCard = ({ reservation, spotName, spotAddress }: ReceiptCardProps) => {
  const { startTime, endTime, status, totalCost, id, createdAt } = reservation;
  
  const formatDuration = (start: string, end: string) => {
    try {
      return formatDistanceStrict(new Date(start), new Date(end));
    } catch (error) {
      return 'Invalid date range';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">Parking Receipt</h3>
            <p className="text-sm text-muted-foreground">Reservation #{id.substring(0, 8)}</p>
          </div>
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">{spotName}</h4>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{spotAddress}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center">
                <Calendar className="h-3 w-3 mr-1" /> Start Time
              </p>
              <p className="font-medium">{format(new Date(startTime), 'PPP p')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center">
                <Calendar className="h-3 w-3 mr-1" /> End Time
              </p>
              <p className="font-medium">{format(new Date(endTime), 'PPP p')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" /> Duration
              </p>
              <p className="font-medium">{formatDuration(startTime, endTime)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center">
                <DollarSign className="h-3 w-3 mr-1" /> Total Cost
              </p>
              <p className="font-medium">${totalCost.toFixed(2)}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="pt-2 flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Generated on {format(new Date(createdAt), 'PPP')}
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptCard;
