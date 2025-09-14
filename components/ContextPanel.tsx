
import React, { useState, useMemo } from 'react';
import { usePlaybook } from '../hooks/usePlaybook';
import { mockUsers, mockAssets } from '../data/mockData';
import Card, { CardHeader, CardContent } from './common/Card';
import type { User, Asset } from '../types';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const ServerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
);


const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between text-sm py-1 border-b border-aw-medium-blue/50">
    <span className="font-semibold text-aw-text-primary">{label}</span>
    <span>{value}</span>
  </div>
);

const UserDetails: React.FC<{ user: User }> = ({ user }) => (
  <Card className="mb-4">
    <CardHeader icon={<UserIcon />}>{user.name}</CardHeader>
    <CardContent>
      <DetailItem label="ID" value={user.id} />
      <DetailItem label="Role" value={user.role} />
      <DetailItem label="Department" value={user.department} />
      <DetailItem label="Last Login" value={new Date(user.lastLogin).toLocaleString()} />
      <DetailItem label="Risk Score" value={<span className="font-bold text-aw-warning">{user.riskScore}</span>} />
    </CardContent>
  </Card>
);

const AssetDetails: React.FC<{ asset: Asset }> = ({ asset }) => (
  <Card className="mb-4">
    <CardHeader icon={<ServerIcon />}>{asset.hostname}</CardHeader>
    <CardContent>
      <DetailItem label="IP Address" value={asset.ipAddress} />
      <DetailItem label="OS" value={asset.os} />
      <DetailItem label="Criticality" value={asset.businessCriticality} />
    </CardContent>
  </Card>
);

const ContextPanel: React.FC = () => {
    const { state } = usePlaybook();
    const { involvedEntities } = state.incident;

    const users = useMemo(() => 
        involvedEntities.filter(e => e.type === 'user').map(e => mockUsers[e.id]).filter(Boolean),
        [involvedEntities]
    );

    const assets = useMemo(() => 
        involvedEntities.filter(e => e.type === 'asset').map(e => mockAssets[e.id]).filter(Boolean),
        [involvedEntities]
    );

  return (
    <div className="h-full">
        <h2 className="text-xl font-semibold text-aw-text-primary mb-4">Involved Entities</h2>
        <div className="max-h-[80vh] overflow-y-auto pr-2">
            {users.map(user => <UserDetails key={user.id} user={user} />)}
            {assets.map(asset => <AssetDetails key={asset.id} asset={asset} />)}
        </div>
    </div>
  );
};

export default ContextPanel;
