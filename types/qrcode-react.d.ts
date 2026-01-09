declare module 'qrcode.react' {
  import * as React from 'react';
  interface QRCodeProps {
    value: string;
    size?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    bgColor?: string;
    fgColor?: string;
    [key: string]: any;
  }
  export const QRCodeCanvas: React.ComponentType<QRCodeProps>;
  export const QRCodeSVG: React.ComponentType<QRCodeProps>;
}
