import { useState, useEffect } from 'react';
import { 
  SERVERS, 
  getActiveServer, 
  setActiveServer, 
  getServerInfo,
  checkServerHealth 
} from '@/utils/apiConfig';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Server, Check, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ServerSwitcher() {
  const [activeServer, setActiveServerState] = useState(getActiveServer());
  const [serverHealth, setServerHealth] = useState({});
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Listen for server changes
    const handleServerChange = (event) => {
      setActiveServerState(event.detail.server);
    };

    window.addEventListener('serverChanged', handleServerChange);
    
    // Check initial server health
    checkAllServers();

    return () => {
      window.removeEventListener('serverChanged', handleServerChange);
    };
  }, []);

  const checkAllServers = async () => {
    setChecking(true);
    const health = {};
    
    for (const [key] of Object.entries(SERVERS)) {
      health[key] = await checkServerHealth(key);
    }
    
    setServerHealth(health);
    setChecking(false);
  };

  const handleSwitchServer = (serverKey) => {
    const success = setActiveServer(serverKey);
    
    if (success) {
      setActiveServerState(serverKey);
      const serverInfo = getServerInfo(serverKey);
      
      toast.success(`Switched to ${serverInfo.name}`, {
        description: `API calls will now use: ${serverInfo.url}`,
        icon: serverInfo.icon,
      });

      // Suggest page reload for full effect
      setTimeout(() => {
        toast.info('Please refresh the page', {
          description: 'Reload to ensure all components use the new server',
          action: {
            label: 'Reload',
            onClick: () => window.location.reload(),
          },
        });
      }, 1000);
    }
  };

  const currentServer = getServerInfo(activeServer);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2 border-gray-300 hover:bg-gray-50"
        >
          <Server className="h-4 w-4" />
          <span className="hidden sm:inline">{currentServer.icon} {currentServer.name}</span>
          <span className="sm:hidden">{currentServer.icon}</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>API Server</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={checkAllServers}
            disabled={checking}
            className="h-6 px-2"
          >
            {checking ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <span className="text-xs">Check Health</span>
            )}
          </Button>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {Object.entries(SERVERS).map(([key, server]) => {
          const isActive = key === activeServer;
          const isHealthy = serverHealth[key];
          
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => !isActive && handleSwitchServer(key)}
              disabled={isActive}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{server.icon}</span>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{server.name}</span>
                    <span className="text-xs text-gray-500 truncate max-w-[180px]">
                      {server.url}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Health indicator */}
                  {checking ? (
                    <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                  ) : isHealthy === true ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  ) : isHealthy === false ? (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Offline
                    </Badge>
                  ) : null}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator />
        
        <div className="px-2 py-2">
          <div className="text-xs text-gray-500 space-y-1">
            <p className="flex items-start gap-1">
              <span className="font-semibold">💡 Tip:</span>
              <span>Switch between servers for local development or production testing</span>
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              Current: <code className="bg-gray-100 px-1 rounded">{currentServer.url}</code>
            </p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
