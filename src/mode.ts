export function isDemoMode(): boolean {
  return window.location.pathname === '/demo' || new URLSearchParams(window.location.search).get('demo') === '1';
}

export function appPath(path = '/'): string {
  return isDemoMode() ? `/demo${path === '/' ? '' : path}` : path;
}
