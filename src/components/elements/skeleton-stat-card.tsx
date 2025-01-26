import { Card, CardBody } from "@heroui/react";
import { Skeleton } from "../ui/skeleton";

const SkeletonStatCard: React.FC = () => (
  <Card className="bg-card">
    <CardBody className="p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-lg skeleton" />
        <div>
          <Skeleton className="h-4 w-32 skeleton mb-2" />
          <Skeleton className="h-8 w-24 skeleton" />
        </div>
      </div>
    </CardBody>
  </Card>
);

export default SkeletonStatCard;
