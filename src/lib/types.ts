export type ResponseAdvisory = {
  summary?: string;
  cve_id?: string;
  description?: string;
  severity?: 'unknown' | 'low' | 'medium' | 'high' | 'critical';
};
export type Advisory = {
  cveId: string;
  name: string;
  description: string;
  severity: 'unknown' | 'low' | 'medium' | 'high' | 'critical';
};
