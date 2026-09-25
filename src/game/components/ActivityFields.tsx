import React from 'react';
import type { ActivityConfig } from '../types';

interface ActivityFieldsProps {
  activity: ActivityConfig;
  responses: Readonly<Record<string, string>>;
  confirmed: boolean;
  onSetResponse: (id: string, value: string) => void;
}

export function ActivityFields({ activity, responses, confirmed, onSetResponse }: ActivityFieldsProps) {
  return <div className="activity-fields-grid">{activity.fields?.map(field => <label className="activity-field" key={field.id}>
    <span>{field.label}</span>
    {field.type === 'select'
      ? <select value={responses[field.id] ?? ''} onChange={event => onSetResponse(field.id, event.target.value)} disabled={confirmed}>
          <option value="">{field.placeholder}</option>
          {field.options?.map(option => <option value={option} key={option}>{option}</option>)}
        </select>
      : <input type={field.type} value={responses[field.id] ?? ''} placeholder={field.placeholder} onChange={event => onSetResponse(field.id, event.target.value)} disabled={confirmed}/>}
  </label>)}</div>;
}
