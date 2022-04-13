# Deployment

Deployment may vary if you are doing it in production or development.

## Deployment Development

When developing it's quite easy to get the project up and running. You need to start the backend and you need to serve the frontend. No matter on which project you are working. Both services will be live reloaded when you make any changes.

### The simple way

If you are using Visual Studio Code you can press `F5` and the project will run the backend and frontend processes for you. 

**Note: You must close the Debug-UI-Toolbar manually when you want to restart the processes using `F5`.**

### Running the backend

To have the live-reloading functionality for the backend you must run:

```
npm run dev
``` 

### Running the frontend

Just run: 
``` 
npm run serve 
```

## Deployment Production

In production you must do two things. Run the backend in a background task. This is the webserver and it should be active at all times. And you must build the frontend vue application.

### Run the Backend 

The backend can simply be run by invoking the index.js.

```bash
node index.js
# alternatively there is the command:
npm run serve
```

There are various methods to keep a process running in the background when leaving the terminal. Do whatever you feel comfortable with.
This example shows how to keep the server running with the process management tool PM2.

#### Install 
```
npm i pm2 -g
```

#### Run
```
pm2 start node index.js --log log.txt
```

#### Remove All

The fastest and most simple way to shotdown your backend process is:

```
pm2 delete all
```

However, you should be certain that there are no other PM2 processes running.
You can check all running processes with:
```
pm2 ls
```

#### Checking the running instance

To reatach the running instance you can run:

```
pm2 monit
```

#### Start pm2 automatically after startup

This installation process is taken from [the pm2 documentation](https://pm2.keymetrics.io/docs/usage/startup/).

Generate a the "startup command":

```
pm2 startup
```

This will print you with a bashcommand, that you need to copy and paste and execute yourself.

After that pm2 will be restarted on reboot. To save your current processes you must call:
```
pm2 save
```


#### Running alongside Apache

To run the backend application in an apache environment, we need to use the apache server as a proxy.

_Note: Check the port that is used. When the error occurs at port 443, make sure to edit the VirtualHost, that serves at 443._

```ini
ProxyPreserveHost On

ProxyPass /graphql http://127.0.0.1:4000/graphql
ProxyPassReverse /graphql http://127.0.0.1:4000/graphql
```

In apache2 the modules get loaded seperately with:
```ini
a2enmod proxy  # To enable the module
a2dismod proxy # To disable the module
```

After changes made to the apache config, make sure to restart the apache service

```ini
 sudo systemctl restart apache2
```

### Frontend

To deploy the project on a UNIX based server, you can simply use the `deploy.sh` script:

```bash
...\sikka-buya\frontend> . deploy.sh
```

**ATTENTION: THIS WILL DELETE ALL FILES AT `/var/www/sikka-buya/`! If - in a very unlikely case - you would have a folder with the same name, it will be deleted!**



