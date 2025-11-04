export type NavigationItem = {
  id: string;
  title: string;
  shortName: string;
  icon?: string;
}

export type ActiveView = 
  | 'data-management'
  | 'media-management' 
  | 'scraping-config'
  | 'error-notifications'
  | 'backup-management'
  | 'user-management';