import http from "http";
import {
  cpuPercentUsage,
  Data,
  memoryPercentUsage,
  roundNumber,
} from "../calculations";
import { Database } from "../database";
import { request } from "../http/request";

type Container = {
  Id: string;
  Names: string[];
  State: string;
};

type Percents = {
  cpu_percent: number;
  mem_percent: number;
};

export class Docker {
  private socketPath: string;
  private db: Database;

  constructor(db: Database, socketPath?: string) {
    this.db = db;
    this.socketPath = socketPath || "/var/run/docker.sock";
  }

  async dockerStatsJob() {
    this.listContainers()
      .then((containers: Container[]) => {
        this.processContainers(containers);
      })
      .catch(this.errorHandler);
  }

  private errorHandler(error: Error) {
    console.log(error.message);
  }

  private listContainers(): Promise<Container[]> {
    const opts = {
      path: "/containers/json?all=false",
      socketPath: this.socketPath,
    };

    return request(opts, (results) => {
      const parsed: Container[] = JSON.parse(results);
      return parsed;
    }) as Promise<Container[]>;
  }

  private processContainers(containers: Container[]) {
    containers.forEach(async (container) => {
      const opts = this.buildContainerOpts(container.Id);

      this.containerStats(opts)
        .then((percents: Percents) => {
          this.db.insert(
            process.env.COLLECTION || "ts_docker_stats",
            this.createDocument(container, percents)
          );
        })
        .catch(this.errorHandler);
    });
  }

  private buildContainerOpts(id: string) {
    return {
      path: `/containers/${id}/stats?stream=false`,
      socketPath: this.socketPath,
    };
  }

  private containerStats(opts: http.RequestOptions): Promise<Percents> {
    return request(opts, (results) => {
      const parsed: Data = JSON.parse(results);
      const cpu_percent = cpuPercentUsage(parsed);
      const mem_percent = memoryPercentUsage(parsed);
      return { cpu_percent, mem_percent };
    }) as Promise<Percents>;
  }

  private createDocument(container: Container, percents: Percents) {
    return {
      container: container?.Id,
      state: container?.State,
      name: container?.Names[0],
      cpu: roundNumber(percents.cpu_percent),
      mem: roundNumber(percents.mem_percent),
      ts: new Date(),
    };
  }
}
