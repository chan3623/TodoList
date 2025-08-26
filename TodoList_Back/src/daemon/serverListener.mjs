import server from '../config/serverPort.mjs';

class ServerListener{
    constructor(id, server){
        this.id = id;
        this.server = server;
    }
    serverOn(app){
        app.listen(this.server.port, () => {
            console.log(`Server Starting PortNumber : ${this.server.port}`);
        });
    }
}

const serverListener = new ServerListener("serverListen", server);
export default serverListener;