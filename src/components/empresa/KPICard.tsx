import { ArrowUp, ArrowDown } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
}

export function KPICard({ label, value, delta, trend }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-apple p-5 hover-card-subtle">
      <div className="flex flex-col">
        <span className="text-sm text-apple-gray-600 mb-2">{label}</span>
        <div className="flex items-end justify-between">
          <div className="font-bold text-2xl text-apple-gray-900">{value}</div>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend === "up" ? "text-secondary" : "text-orange"
          }`}>
            {trend === "up" ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            <span>{delta}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
