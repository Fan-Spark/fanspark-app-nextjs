import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock,
  Bell,
  ExternalLink,
  Sparkles
} from "lucide-react";

export default function ComingSoonPage({ 
  collectionName, 
  description, 
  icon: Icon,
  expectedDate = "Q1 2024"
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <Icon className="h-10 w-10 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{collectionName}</h1>
            <p className="text-muted-foreground text-lg">{description}</p>
          </div>
          
          <Badge variant="outline" className="text-sm">
            <Clock className="w-3 h-3 mr-1" />
            Coming {expectedDate}
          </Badge>
        </div>

        {/* Features Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              What to Expect
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Unique Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Exclusive NFT designs</li>
                  <li>• Special utilities</li>
                  <li>• Community rewards</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Benefits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Early access perks</li>
                  <li>• Staking rewards</li>
                  <li>• Governance rights</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Get Notified
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Learn More
          </Button>
        </div>

        {/* Social Links */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Follow us for updates
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="ghost" size="sm">Twitter</Button>
            <Button variant="ghost" size="sm">Discord</Button>
            <Button variant="ghost" size="sm">Telegram</Button>
          </div>
        </div>
      </div>
    </div>
  );
} 