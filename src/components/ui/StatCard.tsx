
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { StatisticItem } from "@/lib/types";

interface StatCardProps {
  title?: string;
  value?: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  stat?: StatisticItem;
}

const StatCard = ({ title, value, description, trend, trendValue, stat, className }: StatCardProps) => {
  // Use either direct props or stat object
  const label = title || (stat?.label || "");
  const displayValue = value || (stat?.value || "");
  const change = stat?.change;
  const icon = stat?.icon;
  
  // Determine if the change is positive, negative, or neutral
  const isPositive = trend === "up" || (change && change > 0);
  const isNegative = trend === "down" || (change && change < 0);
  
  return (
    <Card className={cn(
      "p-6 hover:shadow-soft-lg transition-all duration-300",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">{displayValue}</h3>
          
          {(typeof change !== 'undefined' || trendValue) && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "flex items-center text-xs font-medium",
                isPositive && "text-green-600 dark:text-green-500",
                isNegative && "text-red-600 dark:text-red-500",
                !isPositive && !isNegative && "text-muted-foreground"
              )}>
                {isPositive && <ArrowUp className="w-3 h-3 mr-1" />}
                {isNegative && <ArrowDown className="w-3 h-3 mr-1" />}
                {typeof change !== 'undefined' ? Math.abs(change) : trendValue}
                {typeof change !== 'undefined' && '%'}
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                {description || "from last month"}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={cn(
            "p-3 rounded-lg",
            isPositive && "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-500",
            isNegative && "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500",
            !isPositive && !isNegative && "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500"
          )}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
