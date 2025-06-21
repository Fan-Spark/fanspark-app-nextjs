import DynamicTest from '@/components/common/DynamicTest';
import EnvTest from '@/components/common/EnvTest';

export const metadata = {
  title: "Dynamic.xyz Demo - SSD Super Space Defenders",
  description: "Experience the Dynamic.xyz wallet authentication and user management integration",
};

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            Dynamic.xyz Integration Test
          </h1>
          <p className="text-lg text-muted-foreground">
            Testing the Dynamic.xyz wallet authentication
          </p>
        </div>
        
        <EnvTest />
        <DynamicTest />
      </div>
    </div>
  );
} 