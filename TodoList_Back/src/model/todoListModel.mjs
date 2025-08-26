import sql from '../config/database.mjs';
// Model
class TodoListModel {
    constructor(id) {
        this.id = id;
    }
    //------------------------todo method--------------------------------//
    // 할 일 추가
    todoDataAdd(todoData, callback) {
        const { user_email, year_data, mon_data, day_data, todo } = todoData;
        const todoInsert = `INSERT INTO todoList_dayList VALUES(null, "${user_email}", "${year_data}", "${mon_data}", "${day_data}", "${todo}", 0)`;
        sql.query(todoInsert, callback);
    }
    // 할 일 정보 조회
    todoDataGet(todoData, callback) {
        const { user_email, year_data, mon_data, day_data } = todoData;
        const todoSelect = `SELECT list_num, todo, status FROM todoList_dayList WHERE user_email = "${user_email}" AND year_data = "${year_data}" AND mon_data = "${mon_data}" AND day_data = "${day_data}"`;
        sql.query(todoSelect, callback);
    }
    // 할 일 삭제
    todoDataDelete(todoData, callback) {
        const { user_email, list_num, year_data, mon_data, day_data, todo } = todoData;
        const todoDelete = `DELETE FROM todoList_dayList WHERE list_num = ${list_num} AND user_email = "${user_email}" AND year_data = "${year_data}" AND mon_data = "${mon_data}" AND day_data = "${day_data}" AND todo = "${todo}"`;
        sql.query(todoDelete, callback);
    }
    // 할 일 확인
    todoSearch(todoData, callback) {
        const { user_email, list_num, year_data, mon_data, day_data, todo } = todoData;
        const todoCheck = `SElECT * FROM todoList_dayList WHERE list_num = ${list_num} AND user_email = "${user_email}" AND year_data = "${year_data}" AND mon_data = "${mon_data}" AND day_data = "${day_data}" AND todo = "${todo}"`;
        sql.query(todoCheck, callback);
    }
    // 할 일 수정
    todoDataUpdate(todoData, callback) {
        const { user_email, list_num, year_data, mon_data, day_data, todo } = todoData;
        const todoUpdate = `UPDATE todoList_dayList SET todo = "${todo}" WHERE list_num = ${list_num} AND user_email = "${user_email}" AND year_data = "${year_data}" AND mon_data = "${mon_data}" AND day_data = "${day_data}"`;
        sql.query(todoUpdate, callback);
    }
    // 할 일 체크 상태 변경
    todoDataStatusChange(todoStatusData, callback) {
        const { list_num, status } = todoStatusData;
        const dayListStatusUpdate = `UPDATE todoList_dayList SET status = ${status} WHERE list_num = ${list_num}`;
        sql.query(dayListStatusUpdate, callback);
    }
    // 할 일 체크 상태 변경 후 확인
    todoDataStatusChangeCheck(todoStatusData, callback) {
        const { list_num, status } = todoStatusData;
        const todoDataStatusSelect = `SELECT status FROM todoList_dayList WHERE list_num = ${list_num} AND status = ${status}`;
        sql.query(todoDataStatusSelect, callback);
    }
    // 월 별 할 일 정보 조회
    monDataGet(todoData, callback) {
        const { user_email, year_data, mon_data } = todoData;
        const monthDataSelect = `SELECT * FROM todoList_dayList WHERE user_email = "${user_email}" AND year_data = "${year_data}" AND mon_data = "${mon_data}"`;
        sql.query(monthDataSelect, callback);
    }
    //------------------------category method--------------------------------//
    // 카테고리 정보 추가
    categoryListAdd(categoryData, callback) {
        const { user_email, category_name } = categoryData;
        const categoryInsert = `INSERT INTO todoList_categoryList VALUES(null, "${user_email}", "${category_name}", null)`;
        sql.query(categoryInsert, callback);
    }
    // 카테고리 정보 조회
    categoryListSearch(user_email, callback) {
        const categoryListSelect = `SELECT * FROM todoList_categoryList WHERE user_email = "${user_email}"`;
        sql.query(categoryListSelect, callback);
    }
    // 카테고리 리스트 삭제
    categoryListRemove(categoryData, callback) {
        const { categoryList_num } = categoryData;
        const categoryListDelete = `DELETE FROM todoList_categoryList WHERE categoryList_num = ${categoryList_num}`;
        sql.query(categoryListDelete, callback);
    }
    categoryListCheck(categoryData, callback) {
        const { categoryList_num } = categoryData;
        const categoryListDeleteCheck = `SELECT category_name FROM todoList_categoryList WHERE categoryList_num = ${categoryList_num}`;
        sql.query(categoryListDeleteCheck, callback);
    }
    // 카테고리 리스트 이름 수정
    categoryListCorrection(categoryData, callback) {
        const { categoryList_num, category_ChangeName } = categoryData;
        const categoryListUpdate = `UPDATE todoList_categoryList SET category_name = "${category_ChangeName}" WHERE categoryList_num = ${categoryList_num} `;
        sql.query(categoryListUpdate, callback);
    }
    // 카테고리 리스트 이름 수정 확인
    categoryListNameCorrectionCheck(categoryData, callback) {
        const { categoryList_num, category_ChangeName } = categoryData;
        const categoryListUpdateCheck = `SELECT categoryList_num, category_name FROM todoList_categoryList WHERE categoryList_num = ${categoryList_num} AND category_name = "${category_ChangeName}"`;
        sql.query(categoryListUpdateCheck, callback);
    }
    // 카테고리리스트에 데이터 생성
    categoryDataAdd(categoryData, callback) {
        const { categoryList_num, user_email, category_data } = categoryData;
        const categoryDataInsert = `INSERT INTO todoList_categoryDataList VALUES(null, "${categoryList_num}", "${user_email}", "${category_data}", null, 0)`;
        sql.query(categoryDataInsert, callback);
    }
    // 카테고리리스트에서 데이터 조회
    categoryDataSearch(user_email, callback) {
        const categoryDataSelect = `SELECT * FROM todoList_categoryDataList WHERE user_email = "${user_email}"`;
        sql.query(categoryDataSelect, callback);
    }
    // 카테고리 데이터 수정
    categoryDataCorrection(categoryData, callback) {
        const { categoryData_num, category_ChangeData } = categoryData;
        const categoryDataUpdate = `UPDATE todoList_categoryDataList SET category_data = "${category_ChangeData}" WHERE categoryData_num = "${categoryData_num}"`;
        sql.query(categoryDataUpdate, callback);
    }
    // 카테고리 데이터 수정 후 확인
    categoryDataCorrectionCheck(categoryData, callback) {
        const { categoryData_num, category_ChangeData } = categoryData;
        const categoryDataUpdateCheck = `SELECT categoryData_num, category_data FROM todoList_categoryDataList WHERE categoryData_num = ${categoryData_num} AND category_data = "${category_ChangeData}"`;
        sql.query(categoryDataUpdateCheck, callback);
    }
    // 카테고리 데이터 삭제
    categoryDataRemove(categoryData_num, callback) {
        const categoryDataDelete = `DELETE FROM todoList_categoryDataList WHERE categoryData_num = ${categoryData_num}`;
        sql.query(categoryDataDelete, callback);
    }
    // 카테고리 데이터 삭제 확인
    categoryDataRemoveCheck(categoryData_num, callback) {
        const categoryDataDeleteCheck = `SELECT categoryData_num FROM todoList_categoryDataList WHERE categoryData_num = ${categoryData_num}`;
        sql.query(categoryDataDeleteCheck, callback);
    }
    // 카테고리 데이터 상태 변경
    categoryDataStatusChange(categoryData, callback) {
        const { categoryData_num, status } = categoryData;
        const categoryDataStatusUpdate = `UPDATE todoList_categoryDataList SET status = ${status} WHERE categoryData_num = ${categoryData_num}`;
        sql.query(categoryDataStatusUpdate, callback);
    }
    // 카테고리 데이터 상태 변경 확인
    categoryDataStatusCheck(categoryData, callback) {
        const { categoryData_num, status } = categoryData;
        const categoryDataStatusSelect = `SELECT status FROM todoList_categoryDataList WHERE categoryData_num = ${categoryData_num} AND status = ${status}`;
        sql.query(categoryDataStatusSelect, callback);
    }
}

const todoListModel = new TodoListModel("todoListModel");
export default todoListModel;