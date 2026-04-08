export interface ServiceConfig {
    cmd: string;
    root?: string;
    isStream?: boolean;
    method?: string;
    path?: string;
    service: string;
    type: string;
}