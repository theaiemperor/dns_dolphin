import fs from "fs";
import path from "path";
import os from "os";

export default class DataStore<T extends object> {
  private appName: string;
  private fileName: string;
  private baseDir: string;
  private fullPath: string;
  public state: T;

  constructor(fileName: string, appName: string = "dns_dolphin") {
    this.appName = appName;
    this.fileName = fileName;
    this.baseDir = this.getAppDataPath();
    this.fullPath = path.join(this.baseDir, this.appName, this.fileName);
    this.ensureDirectoryExists(path.dirname(this.fullPath));
    this.state = this.readData();
  }

  private getAppDataPath(): string {
    const platform = process.platform;
    if (platform === "win32") {
      return (
        process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming")
      );
    } else if (platform === "darwin") {
      return path.join(os.homedir(), "Library", "Application Support");
    } else {
      // For Linux and other UNIX-like systems
      return process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config");
    }
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  private readData(): T {
    try {
      if (fs.existsSync(this.fullPath)) {
        const data = fs.readFileSync(this.fullPath, "utf8");
        return JSON.parse(data) as T;
      } else {
        return {} as T;
      }
    } catch (_) {
      return {} as T;
    }
  }

  public writeData(data: T): void {
    try {
      fs.writeFileSync(this.fullPath, JSON.stringify(data, null, 2), "utf8");
      this.state = data;
    } catch (_) {}
  }

  public updateData(updater: (data: T) => T): void {
    const data = this.readData();
    const updatedData = updater(data);
    this.writeData(updatedData);
    this.state = updatedData;
  }

  public deleteData(): void {
    try {
      if (fs.existsSync(this.fullPath)) {
        fs.unlinkSync(this.fullPath);
        this.state = {} as T;
      }
    } catch (_) {}
  }
}
