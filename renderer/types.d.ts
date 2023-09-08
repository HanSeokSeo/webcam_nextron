declare global {
  interface Window {
    api: {
      openDirectoryDialog(): Promise<string | undefined>;
      readDirectory(path: string): Promise<string[] | undefined>;
    };
  }
}

export {};
