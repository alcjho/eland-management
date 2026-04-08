import { BadRequestException } from "@nestjs/common";
/**
 * 
 * @param route 
 * @returns 
 */
const getRouteSegment = (route: string) => {
    // remove host part if full url is given
    const cleanRoute = trimRoute(route)
    const pathParts = cleanRoute.split('/');
    
    if(pathParts.length < 4){
        throw new BadRequestException('Malformed url expecting <entity>/<doctype>/<action>');
    }

    const fileIndex = pathParts.findIndex(p => p == 'files');
    const entity = fileIndex !== -1 ? pathParts[fileIndex + 1] : "unknown";
    const doctype = fileIndex !== -1 ? pathParts[fileIndex + 2] : "other";
    const action = fileIndex !== -1 ? pathParts[fileIndex + 3] : "other";

    return { entity, doctype, action }
}

const trimRoute = (url: string): string => {
  try {
    const parsed = new URL(url, 'http://dummy-base'); // fallback for relative paths
    return parsed.pathname.replace(/\/+$/, ''); // remove trailing slashes
  } catch {
    // If it's a relative path, just clean it
    return url.replace(/^https?:\/\/[^/]+/, '').replace(/\/+$/, '');
  }
};

export { getRouteSegment }