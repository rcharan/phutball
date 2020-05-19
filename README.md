# [philosphers.football](http://philosophers.football) (Phutball) v0.2 (May 19, 2020)

This project was created in honor of the late John Conway and also to experiment with Reinforcement Learning. You can find it at [philosphers.football](http://philosophers.football) and learn more there as well.

![img](./app/webserver/frontend/src/icons/philosphers-play-football.svg) 

## What is it

Philospher's Football (aka phutball) is a 2-player board game described by John Conway in
[*Winning Ways for your Mathematical Plays*](https://en.wikipedia.org/wiki/Winning_Ways_for_your_Mathematical_Plays) (1982 with Berlekamp and Guy).

Read more about the game, John Conway, and **play the game** online at [philosphers.football](http://www.philosophers.football).

Version 0.2 now includes online/remote play against other humans as well as the beta-version of some bots you can play against (they aren't trained yet, so they aren't very good). See the release notes below.

## Release Notes

- **v0.2** (May 19, 2020) Now with websockets to support live play online against humans and bots. Bots are not trained yet.
- **v0.1** (May 11, 2020) Website launch with containerized front and backend as well as webserver and database (nginx)
- **v0.0** (Apr 30, 2020) Standalone React app to play the game with no styling or backend; run locally only.

### Future Releases
- v1.0: Bots that are actually trained.

## How to use this Repository

If you have any issues with the game (running the code or application behavior in Chrome Desktop), please submit a bug report here, on github. For anything else, contact me through my [website](http://www.ravicharan.com)

### Run it ASAP
If you just want to run the code yourself as quickly as possible:

1. See below for software and hardware requirements
2. Clone the repository `git clone https://github.com/rcharan/phutball`
3. Navigate in your terminal into the repository at the top level
4. Run `docker-compose up`
5. Navigate your browser to `http://localhost:80`
6. (Recommended) Run `docker system prune -af` to clean up the build files and release hard-disk space.

The software is **guaranteed** to run! (A dangerous statement, I know). That's the whole point of Docker

### Requirements

To build the software yourself, there are substantial hard-disk space requirements. To use the [website](http://philosophers.football), you only need requirement 3.

1. [Docker](https://www.docker.com/) and docker-compose (on Mac and Windows, this come bundled with the [Docker Desktop](https://www.docker.com/products/docker-desktop) installation which you should use). This takes about **2GB** disk space.
2. Disk space for the buld process: about **12GB** on top of the Docker installation. (Excessive I know, but Docker by design reinstalls all the software from scratch). The space will only be used temporarily.
3. Chrome for desktop, the only supported browser. (Firefox, Opera, and Safari should also work fine).

Mobile browsers are not supported.

### Navigating the Repository

The repository currently has three main components.
1. The backend  api in `app/api/` (written in Python/Django)
2. The frontend in `app/webserver/frontend` (written in React/Javascript)
3. The PyTorch implementation of deep reinforcement learning in `pytorch-implementation` for the bots.

Each section has its own readme in the directory indicated.

### Other Build Configurations

#### Context
The way I went about building this application was:
1. Build the backend and frontend using a local development environment
2. Learn docker
3. Containerize the application and use nginx to serve it

Consequently, the application and repository contain configurations and instructions respectively	 to run in a few ways:
1. dev mode: both the frontend and backend (and database) run uncontainerized in a local development environment
2. frontend-dev mode: the backend + database run in a container, frontend runs in a local dev environment
3. local production mode: everything runs in containers locally
4. online production mode: everything runs online and in containers.

Conceptually, you could also have backend-dev mode around, but it's hard to see why that would be useful (running the frontend in a local dev environment is easy thanks to node.js; installing and configuring the databases to make the backend work can be finicky.)

Note (!important)
 - In retrospect, the smart thing to do would have been to use Docker from the beginning to create the development environment (by mounting the local file system to the docker container). I recommend you do this, and it is what you will see in most tutorials (though the commands are initially a bit long and scary). As you can see by the order that I actually did things in, there is a reason this configuration isn't supported.

#### Running the code
Here's how you can do each of the options above
1. (Local development environment) both the `api` and `webserver/frontend` folders in the `app` directory structure have READMEs with instructions to run in a local development environment. The frontend runs on `localhost:3000` and the backend on localhost:8000. Point your browser to [localhost:3000](http://localhost:3000)
2. (Frontend-dev) run `docker-compose -f docker-compose-dev.yml up` and the frontend according to the instructions in the `app/webbserver/frontend` directory. The ports are the same as in the local development environment. Point your browser to [localhost:3000](http://localhost:3000)
3. (Local production) run `docker-compose up`. The webserver wraps the components and exposes port 80. Point your browser to [localhost:80](http://localhost:80)
4. (Online production) some light configuration required.
	- In `app/api/phutball/config/` run `keygen.sh` to generate a `SECRET_KEY`.
	- Configure `app/api/config/settings_prod.py` to whitelist your client (i.e. the domain).
	- Configure `app/webserver/frontend/src/settings/settings-prod.js` to similarly point to your server.
	- Then run `docker-compose -f docker-compose-prod.yml up` from the top level of the repository.


### Cleanup Reference

If you're new to Docker and running the docker images above, you may notice a lot of disk space gets taken up. Here is a reference to help you clean up.

Context: roughly, in python-speak (parseltongue?), containers are instances of images. Docker doesn't like to remove (a) running containers (including those that are "stopped" or idle); or (b) images that are necessary for a container. Containers that are down are fair game though.

To stop or bring down a docker container:
 - If you ran it with `--detach` in the beginning, you can use the same terminal and run `docker-compose stop` (\~turn it off) or `docker-compose down` (\~destroy it).
 - If you didn't use `--detach` you can run the `stop` or `down` command from a different terminal after navigating to the same directory (or any child directory).
 - If you didn't use `--detach` you can also use Ctrl+C to stop the process in the original terminal (but it's kind of rude).
 - Use `docker-compose down -v` (i.e. with the `-v` flag) to also remove volumes (in this case,
 the database of games and moves, which is not going to be large unless you played a *lot* of games)

You may also find the following useful to clean up your disk:
 - List running docker containers `docker container ls`
 - List *all* extant (running or stopped) docker containers `docker container ls -a`
 - List docker images `docker container image ls`
 - List all docker images including hidden intermediate ones claiming to take up valuable disk space `docker container image ls -a`
 - Remove a specific image `docker rmi -f <image id>` (get the image id from listing the images)
 - Remove every container not running (including stopped ones): `docker container prune`
 - (Nuclear option) Remove everything not strictly necessary for a *running* container `docker system prune -a --volumes -f` (`--volume` removes volumes aka persistent storage; `-f` (force) stops Docker from asking you if you're *really* sure.)

Hint: you want the last one.

## Learn More

### Technologies
 - (Backend API) [Django](https://www.djangoproject.com/) (a python web framework) provides a backend/api that creates games, saves moves, and allows users to load the history of a game if they have the Game ID. (Using Django REST framework). It also computes AI moves and allows true synchronous play between humans over a websocket connection (using Django Channels)
 - (DB) [PostgreSQL](https://www.postgresql.org/)
 - (Key-Value Store) [Redis](https://redislabs.com/) provides the backing for ayschronous computation of bot moves and distribution of human moves in online/remote play
 - (Frontend) [React](https://reactjs.org/)
 - (Server) [nginx](https://www.nginx.com/)
 - (Deployment) [Docker](https://www.docker.com/) (and docker-compose)
 - (Hosting) [DigitalOcean](https://www.digitalocean.com/) ($5/month! Highly recommend for hobby projects)
 - (Machine Learning Framework) [PyTorch](https://pytorch.org/) custom implementation of Reinforcement Learning algorithms.
 - (Training Platform) [Colab Pro](https://colab.research.google.com/) for GPU-enabled training.
 - (Storage) [Google Drive](https://www.google.com/drive/) for persistent storage to back the Colab runtime.

To learn more about these technologies, I highly recommend the [Django tutorial](https://docs.djangoproject.com/en/3.0/intro/tutorial01/) and [React tutorial](https://reactjs.org/tutorial/tutorial.html). To learn more about the PyTorch implementation, see the readme in that directory.