import { Db, MongoClient } from "mongodb";
import { Stats } from "../schema/stats";
import { Database } from "./database";

export class Mongo implements Database {
  private url: string;
  private name: string;
  private db: Db | null;

  constructor(url: string, name: string) {
    this.url = url;
    this.name = name;
    this.db = null;
  }

  async connect() {
    try {
      this.db = await MongoClient.connect(this.url).then((client) =>
        client.db(this.name)
      );
    } catch (error) {
      console.log("Error connection to database:", error);
      process.exit(1);
    }
  }

  async insert(collection: string, stats: Stats) {
    try {
      await this.db?.collection(collection).insertOne(stats);
    } catch (error) {
      console.log("Error inserting document: ", error);
    }
  }
}
