export interface GwResponse{
    cmd: string,
    service: string,
    context: GwContext,
    params?: any,
    query?: any,
    data?: any
}

interface GwContext{
    authorization?: string;
    user?: any;
}