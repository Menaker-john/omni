import { FakeDatabase, Mongo } from "./database";
import { Docker } from "./docker";

async function main() {
  const database = selectDatabase();
  await database.connect();
  const docker = new Docker(database, process.env.DOCKER_SOCKET);
  setInterval(
    docker.dockerStatsJob.bind(docker),
    (process.env.INTERVAL || 1000) as number
  );
}

function selectDatabase() {
  if (process.env.MONGO_URL && process.env.MONGO_DB) {
    return new Mongo(process.env.MONGO_URL, process.env.MONGO_DB);
  } else {
    return new FakeDatabase();
  }
}

main();
