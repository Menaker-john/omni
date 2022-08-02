import { Stats } from "../schema/stats";
import { Database } from "./database";

export class FakeDatabase implements Database {
  async connect() {
    console.log("Not connected to a database");
    console.log("Will log results instead");
  }

  async insert(collection: string, stats: Stats) {
    console.log({ stats });
  }
}
