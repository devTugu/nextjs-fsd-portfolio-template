export interface DashboardContactStats {
  new: number;
  read: number;
  archived: number;
  total: number;
}

export interface DashboardStats {
  users?: number;
  roles?: number;
  permissions?: number;
  brands?: number;
  history?: number;
  news?: number;
  contactMessages?: DashboardContactStats;
}
