import React, { useState } from 'react';
import { Users, Building, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const Occupancy = () => {
  const { offices } = useAppState();

  const zones = [
    { name: 'Floor 1 - Reception & Lobby', occupied: 45, capacity: 60, status: 'Normal' },
    { name: 'Floor 2 - Executive & HR Suite', occupied: 28, capacity: 30, status: 'Near Full' },
    { name: 'Floor 3 - Finance & Accounting Wing', occupied: 52, capacity: 70, status: 'Normal' },
    { name: 'Floor 4 - IT Datacenter & Engineering', occupied: 68, capacity: 70, status: 'Near Full' },
    { name: 'Basement - Parking & Maintenance', occupied: 12, capacity: 50, status: 'Low' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Occupancy & Floor Plan</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Real-time live density and room capacity monitoring across facility zones
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card-base p-5 bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">Total Live Headcount</span>
          <span className="text-3xl font-black text-indigo-600 mt-1 block">205 Staff</span>
          <span className="text-[11px] text-slate-400 mt-2 block">Active inside facilities</span>
        </div>
        <div className="card-base p-5 bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">Max Facility Capacity</span>
          <span className="text-3xl font-black text-slate-800 mt-1 block">280 Seats</span>
          <span className="text-[11px] text-slate-400 mt-2 block">Total available desk allocation</span>
        </div>
        <div className="card-base p-5 bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">Overall Occupancy Rate</span>
          <span className="text-3xl font-black text-emerald-600 mt-1 block">73.2%</span>
          <span className="text-[11px] text-slate-400 mt-2 block">Optimal safety threshold</span>
        </div>
      </div>

      <div className="card-base p-6 bg-white space-y-4">
        <h3 className="text-base font-extrabold text-slate-800">Zone Density Monitor</h3>
        <div className="space-y-4">
          {zones.map((zone) => {
            const pct = Math.round((zone.occupied / zone.capacity) * 100);
            return (
              <div key={zone.name} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-800">{zone.name}</span>
                  <span className="text-slate-600">{zone.occupied} / {zone.capacity} occupied ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct > 85 ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Occupancy;
