import express, {Express} from 'express';
import path from 'path'

const CLIENT_BUILD = "../../../client/build";
const CLIENT_ENTRY = `${CLIENT_BUILD}/index.html`;
const CLIENT_ROUTES = ['/', '/app', '/login', '/register'];

export class ClientServer {
  private app: Express;
  constructor(app : Express) {
    console.log(`starting ClientServer in ${__dirname}`)
    this.app = app;
  }

  private addClientRoute(route: string) {
    this.app.get(route, (_, res) => {
      res.sendFile(
        path.join(__dirname, CLIENT_ENTRY),
        (err) => {
          res.status(500).send(err);
        }
      );
    });
  }
  public setup() {
    this.app.use(express.static(path.join(__dirname, CLIENT_BUILD)));
    CLIENT_ROUTES.forEach((route) => {
      this.addClientRoute(route);
    });
  }
};