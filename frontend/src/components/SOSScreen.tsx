/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SosAlertView from './SosAlertView';

interface SOSScreenProps {
  onCancel: () => void;
  lastKnownLocation?: string;
}

export default function SOSScreen({ onCancel, lastKnownLocation }: SOSScreenProps) {
  return (
    <SosAlertView 
      onCancel={onCancel} 
      lastKnownLocation={lastKnownLocation} 
    />
  );
}
