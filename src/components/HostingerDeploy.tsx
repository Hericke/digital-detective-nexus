
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

export const HostingerDeploy: React.FC = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [deployStatus, setDeployStatus] = useState<null | { success: boolean; message: string }>(null);
  const { toast } = useToast();

  const checkHostingerStatus = async () => {
    try {
      setIsChecking(true);
      const { data, error } = await supabase.functions.invoke('hostinger-deploy', {
        body: { action: 'get-vms' }
      });

      if (error) {
        throw new Error(error.message || 'Failed to check Hostinger status');
      }

      toast({
        title: "Connection successful",
        description: "Successfully connected to Hostinger API",
      });
      
      setDeployStatus({ 
        success: true, 
        message: `Connected to Hostinger. Found ${data?.data?.length || 0} VMs.` 
      });
      
      console.log('Hostinger VMs:', data);
      return data;
    } catch (error) {
      console.error('Hostinger status check failed:', error);
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: error.message || "Could not connect to Hostinger",
      });
      
      setDeployStatus({ success: false, message: error.message || "Connection failed" });
      return null;
    } finally {
      setIsChecking(false);
    }
  };

  const deployToHostinger = async () => {
    try {
      setIsDeploying(true);
      toast({
        title: "Starting deployment",
        description: "Preparing to deploy to Hostinger...",
      });

      const { data, error } = await supabase.functions.invoke('hostinger-deploy', {
        body: { action: 'deploy' }
      });

      if (error) {
        throw new Error(error.message || 'Deployment failed');
      }

      toast({
        title: "Deployment in progress",
        description: data.message || "Your site is being deployed to Hostinger",
      });
      
      setDeployStatus({ 
        success: true, 
        message: data.message || "Deployment initiated successfully" 
      });
      
      console.log('Deployment status:', data);
    } catch (error) {
      console.error('Deployment failed:', error);
      toast({
        variant: "destructive",
        title: "Deployment failed",
        description: error.message || "Could not deploy to Hostinger",
      });
      
      setDeployStatus({ 
        success: false, 
        message: error.message || "Deployment failed" 
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hostinger Deployment</CardTitle>
        <CardDescription>
          Deploy to your Hostinger domain: detetive.cavernatec.site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button 
            onClick={checkHostingerStatus} 
            disabled={isChecking || isDeploying}
            className="w-full"
            variant="outline"
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking connection...
              </>
            ) : 'Check Connection Status'}
          </Button>
          
          <Button 
            onClick={deployToHostinger} 
            disabled={isDeploying || isChecking || deployStatus?.success !== true}
            className="w-full"
          >
            {isDeploying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deploying...
              </>
            ) : 'Deploy to Hostinger'}
          </Button>
          
          {deployStatus && (
            <div className={`p-4 rounded-md ${deployStatus.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <p className="font-medium">{deployStatus.success ? 'Success' : 'Failed'}</p>
              <p className="text-sm mt-1">{deployStatus.message}</p>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground mt-2">
            <p>Domain: <span className="font-medium">detetive.cavernatec.site</span></p>
            <p className="mt-1">Status: <span className="font-medium">Ready for deployment</span></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
