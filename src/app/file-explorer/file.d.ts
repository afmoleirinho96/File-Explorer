export interface FileDto {
  id: string;
  name: string;
  mimeType: string;
  parents: string[];
  webContentLink?: string;
  webViewLink: string;
  iconLink: string;
  modifiedTime: string;
  size?: string;
}
