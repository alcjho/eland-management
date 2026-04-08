export interface GwResponse{
    cmd: string,
    service: string,
    context: GwContext,
    params?: any,
    query?: any,
    data?: any
}

export interface GwContext{
    authorization?: string;
    user?: any
}