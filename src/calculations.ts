export type CpuStats = {
  cpu_usage: {
    total_usage: number;
    percpu_usage: number[];
  };
  system_cpu_usage: number;
  online_cpus: number;
};

export type MemStats = {
  stats: {
    cache: number;
    total_active_file: number;
  };
  usage: number;
  limit: number;
};

export type Data = {
  cpu_stats: CpuStats;
  precpu_stats: CpuStats;
  memory_stats: MemStats;
};

export function roundNumber(number: number) {
  return Math.round((Number.EPSILON + Number(number)) * 100) / 100;
}

export function memoryPercentUsage(data: Data) {
  const { memory_stats } = data;
  return (usedMemory(memory_stats) / memory_stats?.limit) * 100;
}

function usedMemory(memory_stats: MemStats) {
  // https://docs.docker.com/engine/api/v1.41/#operation/ContainerStats
  // Shows different calculations than what I have here,
  // but those calculations do not match what is shown in the docker CLI
  // - 11/25/2021
  return (
    memory_stats?.usage -
    memory_stats?.stats?.cache +
    memory_stats?.stats?.total_active_file
  );
}

export function cpuPercentUsage(data: Data) {
  const { cpu_stats, precpu_stats } = data;
  //prettier-ignore
  return (
    cpuDelta(cpu_stats, precpu_stats) /
    systemDelta(cpu_stats, precpu_stats) *
    numberOfCPUS(cpu_stats) *
    100.0
  );
}

function cpuDelta(cpu_stats: CpuStats, precpu_stats: CpuStats) {
  return (
    cpu_stats?.cpu_usage?.total_usage - precpu_stats?.cpu_usage?.total_usage
  );
}

function systemDelta(cpu_stats: CpuStats, precpu_stats: CpuStats) {
  return cpu_stats?.system_cpu_usage - precpu_stats?.system_cpu_usage;
}

function numberOfCPUS(cpu_stats: CpuStats) {
  return cpu_stats?.online_cpus || cpu_stats?.cpu_usage?.percpu_usage?.length;
}
