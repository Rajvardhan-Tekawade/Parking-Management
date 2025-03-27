import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';

interface ReportsPageProps {
  isHostView?: boolean;
}

const ReportsPage = ({ isHostView = false }: ReportsPageProps) => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>();

  const handleGenerateReport = (format: 'pdf' | 'csv') => {
    // TODO: Implement report generation
    console.log(`Generating ${format} report for date:`, date);
  };

  return (
    <DashboardLayout pageTitle="Reports & Analytics">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
            <CardDescription>
              Generate and download reports for your {isHostView ? 'parking spaces' : 'bookings'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleGenerateReport('pdf')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleGenerateReport('csv')}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>
              View your {isHostView ? 'parking space' : 'booking'} statistics and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total {isHostView ? 'Bookings' : 'Reservations'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">123</div>
                      <p className="text-xs text-muted-foreground">
                        +10% from last month
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {isHostView ? 'Revenue' : 'Total Spent'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$1,234</div>
                      <p className="text-xs text-muted-foreground">
                        +5% from last month
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {isHostView ? 'Active Listings' : 'Active Bookings'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">
                        Current active
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center border rounded">
                      Chart placeholder
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="financial" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center border rounded">
                      Financial charts placeholder
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="usage" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center border rounded">
                      Usage charts placeholder
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
