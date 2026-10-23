export interface WorkshopResource {
  id: string;
  title: string;
  filename: string;
  format: 'xlsx' | 'docx';
  category: 'Datasets & Spreadsheets' | 'Prompts & Blueprints' | 'Connectors & Tools';
  description: string;
  detailedNotes: string[];
  sizeBytes: number;
  sizeFormatted: string;
  downloadCount: number;
  lastDownloadedAt: string | null;
  tags: string[];
  targetTool: 'Google AI Studio' | 'Lovable' | 'Claude' | 'General Analytics';
}

export interface DownloadEvent {
  id: string;
  resourceId: string;
  filename: string;
  timestamp: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  isBundle?: boolean;
}

export interface AnalyticsSummary {
  totalDownloads: number;
  totalResources: number;
  mostPopularResource: {
    id: string;
    title: string;
    count: number;
  } | null;
  byFormat: {
    xlsx: number;
    docx: number;
  };
  byCategory: Record<string, number>;
  byTool: Record<string, number>;
  recentDownloads: DownloadEvent[];
  hourlyActivity: { hour: string; count: number }[];
}
