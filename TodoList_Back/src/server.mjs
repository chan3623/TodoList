import service from './daemon/service.mjs';
import serverPort from './config/serverPort.mjs';
import serverListener from './daemon/serverListener.mjs';
import userRouter from './routes/userRouter.mjs';
import todoListRouter from './routes/todoListRouter.mjs';

class TodoList{
    constructor(id, service, serverPort, serverListener){
        this.id = id;
        this.service = service;
        this.serverPort = serverPort;
        this.serverListener = serverListener;
    }
    router(){
        this.service.use('/user', userRouter.setup());
        this.service.use('/todo', todoListRouter.setup());
    }
    listener(){
        this.serverListener.serverOn(this.service);
    }
    start(){
        this.router();
        this.listener();
    }
}
const todoList = new TodoList("todoList", service, serverPort, serverListener);
todoList.start();

