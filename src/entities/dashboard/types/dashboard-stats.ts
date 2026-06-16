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
  projects?: number;
  skills?: number;
  experiences?: number;
  contactMessages?: DashboardContactStats;
}
