export const globals: {
  fname: string;
  csrftoken: string;
  projectId: number;
  dfn: number;
  wfft: number;
  sr: number;
  analysisId: number;
  zoomRatio: number;
  fontSize: number;
} = {
  fname: (window as any).fname,
  csrftoken: (window as any).csrftoken,
  projectId: (window as any).projectId,
  dfn: (window as any).dfn,
  wfft: (window as any).wfft,
  sr: (window as any).sr,
  analysisId: (window as any).analysisId,
  zoomRatio: 0.8,
  fontSize: 15,
};
