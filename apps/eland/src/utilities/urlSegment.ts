import { Subjects } from "../ability.factory";
import { loadAllConfigs } from "./service_map.util";
import { ServiceConfig } from "../interfaces/serviceMap.interface";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { match } from "path-to-regexp";


const logger = new Logger();
const configService = new ConfigService();

// Define headers you care about forwarding
const FORWARDED_HEADERS = [
    'authorization', 
    'x-request-id', 
    'x-correlation-id',
    'accept-language',
    'user'
];

// for TCP request only
const ACTION_MAP: { [key: string]: string } = {
  'POST': 'create',
  'GET': 'get',    
  'PUT': 'update',
  'PATCH': 'update',
  'DELETE': 'delete',
};

export function getStaticPath(routePattern: string): string {
    if(!routePattern)
        return

    const staticPart = routePattern?.split(':')[0];
    // Remove the single leading or trailing slash (or both) to standardize the result.
    return staticPart.replace(/^\/|\/$/g, '');
}

export const extractSubject = (url: string): Subjects | null=>{
    const cleanUrl = url.split('?')[0]; 
    const pathSegments = cleanUrl.split('/').filter(s => s !== '');
    if (pathSegments.length >= 2) {
        const serviceName = pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].substring(1);
        return serviceName as Subjects;
    }
    return null;
}

export const extractCommand = (url: string): string =>{
    const cleanUrl = url.split('?')[0]; 
    const pathSegments = cleanUrl.split('/').filter(s => s !== '');
    if (pathSegments.length >= 2) {
        return pathSegments[2];
    }else if (pathSegments.length >= 4){
        return `${pathSegments[3]}/${pathSegments[4]}`;
    }
    return null;
}

/**
 * Generates a canonical TCP command string from the static HTTP resource path and method.
 * @param resourcePath
 * @param httpMethod
 * @returns
 */
export const extractTcpCommand = (resourcePath: string, httpMethod: string): string => {
    const cleanPath = cleanUrl(resourcePath);
    const resourcePrefix = cleanPath.replace(/\//g, '.');
    const action = ACTION_MAP[httpMethod.toUpperCase()] || 'action';
    
    return `${resourcePrefix}.${action}`;
};


/**
 * Searches for a TCP/Microservice configuration based on the exact command/action.
 * Used by the TCP Microservice Client to map an outgoing command to a Service.
 * @param command The full canonical command string (e.g., 'public-asset.upload.create').
 * @returns The matching ServiceConfig or undefined.
 */
export const getTcpConfig = (url: string, method: string): ServiceConfig | undefined => {
    const serviceMap: ServiceConfig[] = loadAllConfigs(); 
    const downStreamUrl = cleanUrl(url);
    
    const matchingConfigs = serviceMap
        .filter(c => {
            const staticPath = getStaticPath(c.path);
            return downStreamUrl.startsWith(staticPath) && c.type === 'tcp' && c.method === method
        }).sort((a, b) => b.path.length - a.path.length) 
    
    const config = matchingConfigs[0];
    return config;
};



/**
 * 
 * @param req 
 * @returns 
 */
export function extractContextAndData(req: any): Record<string, string | undefined> {
    const payload = {};
    const context: Record<string, string | undefined> = {};
    const data: Record<string, string | undefined> = {};
    FORWARDED_HEADERS.forEach(key => {
        const value = req.headers[key]; 
        
        if (value) {
            context[key.replace(/-/g, '_')] = value;
        }
    });
    payload['data'] = req.body;
    payload['context'] = context;

    return payload;
}

// --- URL Matching Function ---
/**
 * Searches for a configuration entry that matches the requested URL.
 * It prioritizes the most specific 'cmd' that the URL path starts with.
 * @param url without host url
 * @returns
 */
export const getReqConfig = (url: string, method: string = 'POST'): ServiceConfig | undefined => {
    const serviceMap: ServiceConfig[] = loadAllConfigs();  
    const downStreamUrl = cleanUrl(url);
    const matchingConfigs = serviceMap
        .filter(c => {
            const staticPath = getStaticPath(c.path);
            return downStreamUrl.startsWith(staticPath) 
                && (c.type === 'http' || c.type === 'stream')
                && c.method === method
        }).sort((a, b) => b.path.length - a.path.length) 
        return matchingConfigs[0];
};

/**
 * Extracts dynamic parameters (e.g., :id, :fileId) using the path-to-regexp library.
 * * @param requestPath The full incoming clean URL path (e.g., "/files/property/document/upload/ABC-123").
 * @param routePattern The static route template from your config (e.g., "/files/property/document/upload/:fileId").
 * @returns A key-value map of extracted parameters (e.g., { fileId: "ABC-123" }).
 */
export function extractPathParams(
    requestPath: string, 
    routePattern: string
): Record<string, any> {
    let downStreamUrl = cleanUrl(requestPath);
    let normalizedPattern = routePattern;

    // 1. Normalize the request path (downStreamUrl)
    if (!downStreamUrl.startsWith('/')) {
        downStreamUrl = '/' + downStreamUrl;
    }
    
    // 2. Normalize the route pattern
    if (!normalizedPattern.startsWith('/')) {
        normalizedPattern = '/' + normalizedPattern;
    }

    const pathMatcher = match(normalizedPattern, { decode: decodeURIComponent, sensitive: false });
    const result = pathMatcher(downStreamUrl);
    
    if (result) {
        // 'result' is an object { path: '/...', index: 0, params: { ... } }
        return result.params;
    }

    return {};
}

export const extractParameter = (url: string): string =>{
    const cleanUrl = url.split('?')[0]; 
    const pathSegments = cleanUrl.split('/').filter(s => s !== '');
    if (pathSegments.length > 2) {
        return pathSegments[3];
    }
    return null;
}

export const extractParams = (url: string, endpoint): string[] =>{
    const paramsIndex = url.indexOf(endpoint);
    const params = url.slice(paramsIndex)

    return params.split('/')
}

export const cleanUrl = (url: string): string => {
    let currentPath = url.split('?')[0].split('#')[0];
    const apiPrefix = configService.get<string>('API_PREFIX').replace(/^\/|\/$/g, '');
    const apiEndpoint = configService.get<string>('PUBLIC_ENDPOINT').replace(/^\/|\/$/g, '');
    
    const segmentsToRemove = [`/${apiPrefix}`, `/${apiEndpoint}`];

    for (const segment of segmentsToRemove) {
        const normalizedPath = currentPath.startsWith('/') ? currentPath : '/' + currentPath;

        if (normalizedPath.startsWith(segment)) {
            currentPath = currentPath.substring(segment.length);
        }
    }

    // Remove the single leading or trailing slash (or both) to standardize the result.
    return currentPath.replace(/^\/|\/$/g, '');
};