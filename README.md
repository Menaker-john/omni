<div id="top"></div>

<h3 align="center">Omni</h3>

<!-- WHAT IS OMNI -->
## What is Omni
Omni saves running Docker container stats to a MongoDB collection.
With Omni, docker stats can be graphed and compared against container logs to determine which server methods are possibly performing inefficiently.

### Prerequisites
* node >= 12.9
* npm >= 6.10.2

### Environment Variables

Omni uses a few environment variables
  * MONGO_URL: URL to connect to Mongo
  * MONGO_DB: Mongo Database to use
  * MONGO_COL: Mongo Collection to store docker stats documents into
    * Default: `ts_docker_stats`
  * DOCKER_SOCKET: Docker socket path
    * Default: `/var/run/docker.sock`
  * INTERVAL: Time in milliseconds at which Omni will read and save docker stats
    * Default: `1000`

  If either MONGO_URL or MONGO_DB is undefined then Omni will fall back on logging docker stats instead. 

### Document Structure
```js
{
    container: string,
    state: string,
    name: string,
    cpu: number,
    mem: number,
    ts: string
}
```

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

John Menaker - Menaker.John@outlook.com

Project Link: [https://github.com/Menaker-john/omni.git](https://github.com/Menaker-john/omni.git)

<p align="right">(<a href="#top">back to top</a>)</p>