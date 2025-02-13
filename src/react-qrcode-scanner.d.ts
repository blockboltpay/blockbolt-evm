declare module "react-qrcode-scanner" {
  import { Component } from "react";

  interface ScannerProps {
    onScan: (result: string | null) => void;
    onError?: (error: any) => void;
    style?: React.CSSProperties;
    facingMode?: "user" | "environment";
  }

  export class QrScanner extends Component<ScannerProps> {}
}
