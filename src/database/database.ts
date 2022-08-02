import { Stats } from "../schema/stats";

export interface Database {
  connect: () => Promise<void>;
  insert: (collection: string, stats: Stats) => Promise<void>;
}
