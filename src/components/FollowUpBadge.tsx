import type { FollowUpPriority } from "@/types/athlete";
import { Badge } from "@/components/ui/badge";
import { followUpBadgeVariant } from "@/lib/athleteDisplay";

interface FollowUpBadgeProps {
  priority: FollowUpPriority;
  showLabel?: boolean;
}

export function FollowUpBadge({ priority, showLabel = true }: FollowUpBadgeProps) {
  return (
    <Badge variant={followUpBadgeVariant(priority)}>
      {showLabel ? `${priority} follow-up` : priority}
    </Badge>
  );
}
