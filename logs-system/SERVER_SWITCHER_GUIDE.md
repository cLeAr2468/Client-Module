# 🔄 Server Switcher Guide

The Client Module now supports **dual server connections** - seamlessly switch between localhost development server and Railway production server.

## 🎯 Features

- ✅ **Easy Server Switching** - One-click toggle between servers
- ✅ **Health Check** - Real-time server status monitoring
- ✅ **Visual Indicators** - See which server is active and online/offline status
- ✅ **Persistent Selection** - Your server choice is remembered across sessions
- ✅ **Automatic Fallback** - Smart detection of best available server

## 📍 Available Servers

### 1. 🖥️ Localhost (Development)
- **URL**: `http://127.0.0.1:8000/api`
- **Use when**: Developing locally with XAMPP
- **Requirements**: Laravel server running via `php artisan serve`

### 2. 🚂 Railway (Production)
- **URL**: `https://logs-server-system-production.up.railway.app/api`
- **Use when**: Testing against production or no local server available
- **Requirements**: Internet connection

## 🚀 How to Use

### Switch Servers

1. Look for the **Server dropdown** in the header (🖥️ icon)
2. Click to see available servers
3. Select your desired server
4. Page will suggest a reload for full effect

### Check Server Health

1. Open the Server dropdown
2. Click **"Check Health"** button
3. See real-time status:
   - ✅ **Online** - Server is reachable
   - ❌ **Offline** - Server is down or unreachable

## 💻 For Developers

### Configuration File

Server settings are in `src/utils/apiConfig.js`:

```javascript
export const SERVERS = {
  LOCALHOST: {
    name: 'Localhost',
    url: 'http://127.0.0.1:8000/api',
    icon: '🖥️',
  },
  RAILWAY: {
    name: 'Railway (Production)',
    url: 'https://logs-server-system-production.up.railway.app/api',
    icon: '🚂',
  },
};
```

### Add New Server

To add another server:

```javascript
export const SERVERS = {
  // ... existing servers
  STAGING: {
    name: 'Staging Server',
    url: 'https://staging.example.com/api',
    icon: '🧪',
  },
};
```

### Programmatic Server Change

```javascript
import { setActiveServer } from '@/utils/apiConfig';

// Switch to localhost
setActiveServer('LOCALHOST');

// Switch to Railway
setActiveServer('RAILWAY');
```

### Get Current Server

```javascript
import { getApiBaseUrl, getServerInfo } from '@/utils/apiConfig';

// Get current API URL
const apiUrl = getApiBaseUrl();
console.log(apiUrl); // http://127.0.0.1:8000/api

// Get server info
const serverInfo = getServerInfo();
console.log(serverInfo.name); // "Localhost"
```

### Listen for Server Changes

```javascript
window.addEventListener('serverChanged', (event) => {
  console.log('Server changed to:', event.detail.server);
  console.log('New URL:', event.detail.url);
  
  // Refresh your data or reconnect
});
```

## 🔧 Environment Variables

You can still override via `.env`:

```env
# Force specific server (overrides switcher)
VITE_API_URL=http://127.0.0.1:8000/api
```

**Note**: If `VITE_API_URL` is set, the switcher will respect it but show the environment variable value.

## 📊 Component Integration

The switcher automatically updates all API calls through:

1. **Axios instances** - `src/api/api.js` listens to server changes
2. **Direct fetch calls** - Use `getApiBaseUrl()` instead of hardcoded URLs

### ✅ Good Practice

```javascript
import { getApiBaseUrl } from '@/utils/apiConfig';

const API_BASE_URL = getApiBaseUrl();
fetch(`${API_BASE_URL}/endpoint`);
```

### ❌ Bad Practice

```javascript
// Hardcoded - won't switch servers!
fetch('http://127.0.0.1:8000/api/endpoint');
```

## 🎨 UI Components

### ServerSwitcher Component

Located at: `src/components/common/ServerSwitcher.jsx`

Features:
- Dropdown menu with server list
- Health status indicators
- Active server highlight
- Manual health check button

## 🐛 Troubleshooting

### Server won't switch
1. Check browser console for errors
2. Clear localStorage: `localStorage.removeItem('active_api_server')`
3. Refresh the page

### Health check fails
1. Ensure backend has `/health` endpoint
2. Check CORS settings
3. Verify server is running

### Still using old server
1. Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
2. Check if `VITE_API_URL` is set in `.env`
3. Restart dev server

## 📝 Notes

- Server choice persists in `localStorage`
- Health checks timeout after 5 seconds
- Default server in development: **Localhost**
- Default server in production: **Railway**

## 🔐 Security

- No sensitive data stored in switcher
- All authentication tokens remain valid across switches
- HTTPS enforced for production servers

---

**Happy Switching!** 🚀
