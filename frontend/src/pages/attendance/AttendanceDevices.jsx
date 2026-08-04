import React, { useState } from 'react';
import { Server, Cpu, Wifi, RefreshCw } from 'lucide-react';
import BarChartWidget from '../../components/charts/BarChartWidget';

export default function AttendanceDevices() {
  const [devices, setDevices] = useState([
    { id: 1, device_name: "Secretariat Gate-01 BioTerminal", attendance_source: "Fingerprint", location: "Main Gate 01", status: "Online", last_sync: "Just Now" },
    { id: 2, device_name: "Ministry Wing-2 FacialScanner", attendance_source: "Face Recognition", location: "Social Welfare Wing Entrance", status: "Online", last_sync: "1 min ago" },
    { id: 3, device_name: "Finance Dept RFID Reader", attendance_source: "ID Card", location: "Finance Building Gate 01", status: "Online", last_sync: "2 mins ago" },
    { id: 4, device_name: "Mobile QR Kiosk Terminal-03", attendance_source: "QR Code", location: "ICT Ministry Lobby", status: "Online", last_sync: "Just Now" },
    { id: 5, device_name: "Admin Log Sheet Entry", attendance_source: "Manual Import", location: "HR Officer Desk", status: "Active", last_sync: "10 mins ago" },
    { id: 6, device_name: "Biometric Webhook Gateway API", attendance_source: "API Sync", location: "Cloud Gateway Server", status: "Online", last_sync: "Live" }
  ]);

  const handlePing = (name) => {
    alert(`Pinged ${name}! Signal strength: 100% (Online & Operational).`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        padding: '1.25rem 1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '0.625rem', borderRadius: '0.75rem' }}>
            <Server size={26} color="#38BDF8" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Attendance Devices
            </h1>
          </div>
        </div>

        <button onClick={() => alert("Synchronized all attendance devices!")} className="btn btn-primary" style={{ backgroundColor: '#059669', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <RefreshCw size={16} /> Sync All Terminals
        </button>
      </div>

      {/* Visual Chart Widget */}
      <BarChartWidget title="Terminal Uptime Comparison" />

      {/* Devices Table */}
      <div className="card-base" style={{ padding: '1.5rem' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Device Name</th>
                <th>Attendance Source</th>
                <th>Location</th>
                <th>Status</th>
                <th>Last Sync</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {devices.map(dev => (
                <tr key={dev.id}>
                  <td style={{ fontWeight: 800, color: '#0F172A' }}>{dev.device_name}</td>
                  <td>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{dev.attendance_source}</span>
                  </td>
                  <td style={{ fontSize: '0.8125rem' }}>{dev.location}</td>
                  <td>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#047857', backgroundColor: '#ECFDF5', padding: '0.15rem 0.5rem', borderRadius: '0.375rem' }}>
                      🟢 {dev.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)' }}>{dev.last_sync}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handlePing(dev.device_name)} className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#2563EB' }}>
                      <Wifi size={14} /> Ping Terminal
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
