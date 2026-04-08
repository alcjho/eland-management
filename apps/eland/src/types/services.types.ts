// services.types.ts (or wherever ServiceData is defined)

// Standard NestJS options expect port as a number
type TcpOptions = { host: string, port: number };
type HttpOptions = { baseURL: string };

export type TcpServiceData = {
  name: string;
  transport: 'TCP';
  options: TcpOptions;
};

export type HttpServiceData = {
  name: string;
  transport: 'HTTP';
  options: HttpOptions;
};

// Union of all possible service configurations
export type ServiceData = TcpServiceData | HttpServiceData;

// NOTE: You'll need to update your loadServices() to return ServiceData[]
// and ensure it converts the port (if stored as a string in JSON) to a number.