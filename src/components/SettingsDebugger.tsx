import { useEffect, useState } from 'react';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';

/**
 * Debug component to show current settings in real-time
 * Add this to any page to see settings updates
 * 
 * Usage:
 * import SettingsDebugger from '@/components/SettingsDebugger';
 * <SettingsDebugger />
 */
export const SettingsDebugger = () => {
  const settings = useGlobalSettings();
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string>('Never');

  useEffect(() => {
    const handleUpdate = () => {
      setUpdateCount(prev => prev + 1);
      setLastUpdate(new Date().toLocaleTimeString());
      console.log('🔔 SettingsDebugger: Settings updated!');
    };

    window.addEventListener('settingsUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleUpdate);
    };
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#1a1a1a',
        color: '#fff',
        padding: '15px',
        borderRadius: '8px',
        border: '2px solid #d4af37',
        maxWidth: '400px',
        maxHeight: '500px',
        overflow: 'auto',
        fontSize: '12px',
        zIndex: 9999,
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
      }}
    >
      <div style={{ marginBottom: '10px', borderBottom: '1px solid #d4af37', paddingBottom: '10px' }}>
        <strong style={{ color: '#d4af37' }}>⚙️ Settings Debugger</strong>
        <div style={{ fontSize: '10px', color: '#888', marginTop: '5px' }}>
          Updates: {updateCount} | Last: {lastUpdate}
        </div>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong style={{ color: '#4ade80' }}>Site Title:</strong>
        <div style={{ marginLeft: '10px', color: '#e5e5e5' }}>{settings.siteTitle}</div>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong style={{ color: '#4ade80' }}>Support Email:</strong>
        <div style={{ marginLeft: '10px', color: '#e5e5e5' }}>{settings.supportEmail}</div>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong style={{ color: '#4ade80' }}>Support Phone:</strong>
        <div style={{ marginLeft: '10px', color: '#e5e5e5' }}>{settings.supportPhone}</div>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong style={{ color: '#4ade80' }}>Office Address:</strong>
        <div style={{ marginLeft: '10px', color: '#e5e5e5', fontSize: '10px' }}>
          {settings.officeAddress}
        </div>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong style={{ color: '#4ade80' }}>Tax Rate:</strong>
        <div style={{ marginLeft: '10px', color: '#e5e5e5' }}>{settings.taxRate}%</div>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong style={{ color: '#4ade80' }}>Maintenance Mode:</strong>
        <div style={{ marginLeft: '10px', color: settings.maintenanceMode ? '#f87171' : '#4ade80' }}>
          {settings.maintenanceMode ? 'ON' : 'OFF'}
        </div>
      </div>
      
      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #333' }}>
        <button
          onClick={() => {
            console.log('Full settings:', settings);
            alert('Check console for full settings object');
          }}
          style={{
            background: '#d4af37',
            color: '#000',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold'
          }}
        >
          Log Full Settings
        </button>
        
        <button
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
          }}
          style={{
            background: '#f87171',
            color: '#000',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold',
            marginLeft: '5px'
          }}
        >
          Clear & Reload
        </button>
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '10px', color: '#666' }}>
        localStorage key: y7-settings-storage
      </div>
    </div>
  );
};

export default SettingsDebugger;
