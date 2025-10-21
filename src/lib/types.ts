export type AdvisorySeverity = 'critical' | 'high' | 'medium' | 'low' | 'unknown';

export type AdvisoryEcosystem =
  | 'rubygems'
  | 'npm'
  | 'pip'
  | 'maven'
  | 'nuget'
  | 'composer'
  | 'go'
  | 'rust'
  | 'erlang'
  | 'actions'
  | 'pub'
  | 'other'
  | 'swift';

export type AdvisoryPackage = {
  ecosystem: AdvisoryEcosystem;
  name: string | null;
};

export type AdvisoryVulnerability = {
  package: AdvisoryPackage | null;
  vulnerable_version_range: string | null;
  first_patched_version: string | null;
  vulnerable_functions?: string[] | null;
};

export type AdvisoryIdentifier = {
  type: 'CVE' | 'GHSA';
  value: string;
};

export type AdvisoryCVSS = {
  vector_string: string | null;
  score: number | null;
};

export type ResponseAdvisory = {
  ghsa_id: string;
  cve_id: string | null;
  html_url: string;
  summary: string;
  description: string | null;
  severity: AdvisorySeverity;
  type: 'reviewed' | 'unreviewed' | 'malware';
  published_at: string;
  updated_at: string;
  withdrawn_at: string | null;
  identifiers: AdvisoryIdentifier[] | null;
  vulnerabilities: AdvisoryVulnerability[] | null;
  cvss: AdvisoryCVSS | null;
};

export type SearchParams = {
  affects?: string;
  severity?: string;
};
