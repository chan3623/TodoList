import express from 'express';
import todoListController from '../controller/todoListController.mjs'

// Router
class TodoListRouter{
    constructor(id, express){
        this.id = id;
        this.router = express.Router();
    }
    setup(){
        // 할 일 추가
        this.router.post('/dayList/add', todoListController.todoAdd);
        // 할 일 조회
        this.router.post('/dayList/select', todoListController.dayTodoGet);
        // 할 일 삭제
        this.router.delete('/dayList/delete', todoListController.dayTodoDelete);
        // 할 일 수정
        this.router.post('/dayList/update', todoListController.dayTodoCorrection);
        // 할 일 체크 상테 변경
        this.router.put('/dayList/checkUpdate', todoListController.todoStatusCheck);
        // 월 데이터 조회
        this.router.post('/dayList/month/select', todoListController.monTodoDataGet);
        // 카테고리 생성
        this.router.post('/categoryList/add', todoListController.categoryListCreate);
        // 카테고리 조회
        this.router.get('/categoryList/:user_email', todoListController.categoryListGet);
        // 카테고리 리스트 삭제
        this.router.delete('/categoryList/delete', todoListController.categoryListDelete);
        // 카테고리 리스트 이름 수정
        this.router.put('/categoryList/update', todoListController.categoryListNamePut);
        // 카테고리 데이터 생성
        this.router.post('/categoryData/add', todoListController.categoryDataAdd);
        // 카테고리 데이터 조회
        this.router.get('/categoryData/:user_email', todoListController.categoryDataGet);
        // 카테고리 데이터 수정
        this.router.put('/categoryData/update', todoListController.categoryDataPut);
        // 카테고리 데이터 삭제
        this.router.delete('/categoryData/delete', todoListController.categoryDataDelete);
        // 카테고리 데이터 상태 변경
        this.router.put('/categoryData/checkUpdate', todoListController.categoryDataStatusCheck);

        return this.router;
    }
}
const todoListRouter = new TodoListRouter("todoRouter", express);
export default todoListRouter;