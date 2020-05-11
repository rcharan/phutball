# Philosopher's Football (Phutball) v0.1 (May 11, 2020)

This project was created in honor of the late John Conway and also to experiment with Reinforcement Learning. You can find it at [philosphers.football](http://www.philospers.football). See on the website or below for the current way you can play, and stay tuned for more!

![img](./app/webserver/frontend/src/icons/philosphers-play-football.svg) 

## Play the Game and Read More
[philosphers.football](http://www.philospers.football)

## What is it

Philospher's Football (aka phutball) is a 2-player board game described by John Conway in
[*Winning Ways for your Mathematical Plays*](https://en.wikipedia.org/wiki/Winning_Ways_for_your_Mathematical_Plays) (1982 with Berlekamp and Guy).

Read more about the game, John Conway, and **play the game** online at [philosphers.football](http://www.philospers.football)

Version 0.1 currently only features human-verse-human play. Future versions of this project will include AIs to play against.

## Support 
The application is only developed for desktop. It will almost certainly not work on mobile. It is only supported/tested for Chrome, but seems fine in Safari, Firefox, or Opera on cursory inspection. I haven't used or met anyone who said they used Explorer (or Edge?) in about 5 years, so let me know if that happens and it works. I'm not a frontend person.

Installing Docker takes about 2GB (supposing you deleted the download itself, about 0.7GB). Building with Docker requires (by its very nature) installing a bunch of software (e.g. Python, Node.js), even if you already have it installed; the build is not currently optimized and will require another \~2.5GB. Make sure you have enough diskspace. There are instructions to remove all the build files created below.

If you have any issues with the game (running the code or application behavior in Chrome Desktop), please submit a bug report here, on github. For anything else, contact me through my [website](http://www.ravicharan.com)

## Release Notes

- **v0.1** (May 11, 2020) Website launch with containerized front and backend as well as webserver and database (nginx)
- **v0.0** (Apr 30, 2020) Standalone React app to play the game with no styling or backend; run locally only.

### Future Releases
Minor verions are not guaranteed to happen
- v0.2: Add RandoTron bot that plays randomly
- v0.3: Synchronous human-v-human online play
- v1.0: Bots that are halfway decent

## How to use this Repository

### Run it ASAP
If you just want to run the code yourself as quickly as possible:
1. Install, if necessary, [Docker](https://www.docker.com/) and docker-compose (on Mac and Windows, this come bundled with the [Docker Desktop](https://www.docker.com/products/docker-desktop) installation that Docker recommends and I do too). (Warning, this is large: \~600-700MB download and \~2GB on disk)
2. Clone the repository `git clone https://github.com/rcharan/phutball`
3. Navigate in your terminal into the repository at the top level
4. Run `docker-compose up`
5. Navigate your browser to `http://localhost:80`

The software is **guaranteed** to run! (A dangerous statement, I know). That's the whole point of Docker – if Docker has an issue, though, that's on you. If you have any issue with the application's behaviour or appearance, try it on Chrome desktop and/or see Support (above).

### Learn More
My primary assumption is that if you are reading this section, you are trying to figure out how to create something similar yourself or want to run (and possibly modify) the code yourself. There are 
other reasons of course (perhaps I made you read this, or you are looking for a code fragment or configuration to use?) – I think you'll still find this helpful.

The repository has two main components
 - The web application
 - Reinforcement learning to train the AI

The second barely exists at this point, but you can see some simple warmup exercises in the `rl` directory. The rest of this section is dedicated to the web application.

### Technologies

The application stack is:
 - (Backend) [Django](https://www.djangoproject.com/) (a python web framework) provides a backend/api that creates games, saves moves, and allows users to load the history of a game if they have the Game ID. In the future, it will also compute AI moves and (maybe) allow true synchronous play between humans.
 - (DB) [PostgreSQL](https://www.postgresql.org/)
 - (Frontend) [React](https://reactjs.org/)
 - (Server) [nginx](https://www.nginx.com/)
 - (Deployment) [Docker](https://www.docker.com/) (and docker-compose)
 - (Hosting) [DigitalOcean](https://www.digitalocean.com/) ($5/month! Highly recommend)

 If you are interested in doing something similar, I highly recommend the [Django tutorial](https://docs.djangoproject.com/en/3.0/intro/tutorial01/) and [React tutorial](https://reactjs.org/tutorial/tutorial.html). For the others, I don't have a good recommendation (the Docker tutorial is
 just okay, in my opinion – you should still do it though), but:
  - Django will handle the database (you don't have to touch it if you containerize it, but should understand SQL in general).
  - You don't have to use nginx: you can use Django as the webserver instead. This is simpler, but
  slightly breaks seperation-of-concerns. In retrospect, I recommend this.
  - No tutorial needed for DigitalOcean. Just deploy your Docker image.

Other technologies/languages to keep in mind:
 - To *design* your website, you will need a (very) basic grasp of HTML (easy); and
 - will have to deal with CSS (easy to start; sometimes weirdly hard to do something simple like centering text or having scrolling work the way you expect – good luck).

### App Directory Structure
Inside the app directory, you will find the api (aka **backend**) and webserver. The webserver
is mostly just a simple wrapper around the **frontend**.

Both the webserver/frontend and api (aka backend) directories have READMEs explaining their structure and uncontainerized usage.

### Context
The way I went about building this application was:
1. Build the backend and frontend using a local development environment
2. Learn docker
3. Containerize the application and use nginx to serve it

Consequently, the application and repository contain configurations and instructions respectively	 to run in a few ways:
1. dev mode: both the frontend and backend (and database) run uncontainerized in a local development environment
2. frontend-dev mode: the backend + database run in a container, frontend runs in a local dev environment
3. local production mode: everything runs in containers locally
4. online production mode: everything runs online and in containers.

Conceptually, you could also have backend-dev mode around, but it's hard to see why that would be useful (running the frontend in a local dev environment is easy thanks to node.js; installing and configuring the database to make the backend work can be finicky.)

Note (!important)
 - In retrospect, the smart thing to do would have been to use Docker from the beginning to create the development environment (by mounting the local file system to the docker container). I recommend you do this, and it is what you will see in most tutorials (though the commands are initially a bit long and scary). As you can see by the order that I actually did things in, there is a reason this configuration isn't supported.

### Running the code
Here's how you can do each of the options above
1. (Local development environment) both the `api` and `webserver/frontend` folders in the `app` directory structure have READMEs with instructions to run in a local development environment. The frontend runs on localhost:3000 and the backend on localhost:8000
2. (Frontend-dev) run `docker-compose -f docker-compose-dev.yml up` and the frontend according to the instructions in the `app/webbserver/frontend` directory
3. (Local production) run `docker-compose up`.
4. (Online production) in `app/api/phutball/config/` run `keygen.sh` to generate a `SECRET_KEY`. Configure `app/api/config/settings_prod.py` to whitelist your client (i.e. the domain). Configure `app/webserver/frontend/src/settings/settings-prod.js` to similarly point to your server. Then run
`docker-compose -f docker-compose-prod.yml up` from the top level of the repository.

Note: using Docker could take a lot of disc space. See below for cleanup.

#### Cleanup Reference

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
