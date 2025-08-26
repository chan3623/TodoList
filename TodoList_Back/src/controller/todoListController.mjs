import todoListModel from '../model/todoListModel.mjs';
import vo from '../valueObject/vo.mjs';

// controller
class TodoListController {
    constructor(id) {
        this.id = id;
    }
    // 할 일 추가
    todoAdd(req, res) {
        const { user_email, year_data, mon_data, day_data, todo } = req.body;
        console.log("할 일 추가 데이터 : ", user_email, year_data, mon_data, day_data, todo);
        todoListModel.todoDataAdd({ user_email, year_data, mon_data, day_data, todo }, (err, result) => {
            if (err) {
                console.log("할 일 추가 중 ERROR 발생 : ", err);
                res.send(err);
            } else {
                console.log(`${user_email}님의 할 일 추가 성공`);
                res.send(true);
            }
        });
    }
    // 로그인 한 유저의 현재 일 기준 할 일 데이터
    dayTodoGet(req, res) {
        if (!req.session.user) {
            req.session.user = {};
        }
        req.session.user.email = vo.user_email;
        req.session.user.name = vo.user_name;
        console.log("session.email", req.session.user.email);
        console.log("vo.user_name", req.session.user.name);
        if (!req.session.user || !req.session.user.email) {
            console.log("로그인 하지 않은 사용자의 대한 데이터 요청 발생");
            res.send({ "success": false, "text": "좋은 말로 할 때 로그인 하고 데이터 요청해라." });
        } else {
            const todoList = [];
            const todoObjMake = (list_num, todo, status) => {
                const todoObj = {
                    "list_num": null,
                    "todo": null,
                    "status": null
                };
                todoObj["list_num"] = list_num;
                todoObj["todo"] = todo;
                todoObj["status"] = status;
                return todoObj;
            };
            const { user_email, year_data, mon_data, day_data } = req.body;
            console.log("요청 한 할 일의 대한 날짜 : ", user_email, year_data, mon_data, day_data);
            todoListModel.todoDataGet({ user_email, year_data, mon_data, day_data }, (err, result) => {
                if (err) {
                    console.log("할 일 불러오던 중 ERROR 발생 : ", err);
                } else if (result.length !== 0) {
                    result.forEach(todo => {
                        todoList.push(todoObjMake(todo.list_num, todo.todo, todo.status));
                    });
                    console.log("유저의 조회한 할 일 정보 : ", todoList);
                    res.send({ "success": true, "todoList": todoList });
                } else if (result.length === 0) {
                    console.log("해당 유저는 해당 일자의 대한 할 일이 없습니다.");
                    res.send({ "success": false });
                }
            });
        }
    }
    // 특정 요일의 할 일을 삭제
    dayTodoDelete(req, res) {
        const { user_email, list_num, year_data, mon_data, day_data, todo } = req.body;
        console.log("유저 : ", user_email);
        console.log("삭제하려는 데이터 : ", list_num, year_data, mon_data, day_data, todo);
        todoListModel.todoDataDelete({ user_email, list_num, year_data, mon_data, day_data, todo }, (err, result) => {
            if (err) {
                console.log("할 일 삭제 도중 ERROR 발생 : ", err);
                res.send(err);
            } else {
                todoListModel.todoSearch({ user_email, list_num, year_data, mon_data, day_data, todo }, (error, checkResult) => {
                    if (error) {
                        console.log("Delete 이후 확인 중 ERROR 발생 : ", error);
                        res.send(error);
                    } else if (checkResult.length === 0) {
                        console.log("할 일 삭제 성공");
                        res.send({ "success": true });
                    } else if (checkResult.length !== 0) {
                        console.log("삭제 실패");
                        res.send({ "success": false });
                    }
                });
            }
        });
    }
    // 특정 요일에 특정 할 일을 수정
    dayTodoCorrection(req, res) {
        const { user_email, list_num, year_data, mon_data, day_data, todo } = req.body;
        console.log("유저 : ", user_email);
        console.log("수정하려는 데이터 : ", list_num, year_data, mon_data, day_data, todo);
        todoListModel.todoDataUpdate({ user_email, list_num, year_data, mon_data, day_data, todo }, (err, result) => {
            if (err) {
                console.log("할 일 데이터 수정 중 ERROR 발생 : ", err);
            } else {
                todoListModel.todoSearch({ user_email, list_num, year_data, mon_data, day_data, todo }, (error, checkResult) => {
                    if (error) {
                        console.log("수정 이후 확인 중 ERROR 발생 : ", error);
                        res.send(error);
                    } else if (checkResult.length !== 0) {
                        console.log("할 일 수정 성공");
                        res.send({ "success": true });
                    } else if (checkResult.length === 0) {
                        console.log("수정 실패");
                        res.send({ "success": false });
                    }
                });
            }
        });
    }
    todoStatusCheck(req, res) {
        const { list_num, status } = req.body;
        todoListModel.todoDataStatusChange({ list_num, status }, (err, result) => {
            if (err) {
                console.log("할 일 데이터 체크 상 변경 중 ERROR 발생 : ", err);
                res.send(err);
            } else {
                todoListModel.todoDataStatusChangeCheck({ list_num, status }, (error, checkResult) => {
                    if (error) {
                        console.log("할 일 데이터 체크 상태 변경 후 확인 중 ERROR 발생 : ", error);
                        res.send(error);
                    } else if (checkResult.length !== 0) {
                        console.log("할 일 데이터 체크 상태 변경 성공");
                        res.send({ "success": true });
                    } else if (checkResult.length === 0) {
                        console.log("할 일 데이터 체크 상태 변경 실패");
                        res.send({ "success": false });
                    }
                });
            }
        });
    }
    // 월 데이터
    monTodoDataGet(req, res) {
        if (!req.session.user) {
            req.session.user = {};
        }
        req.session.user.email = vo.user_email;
        req.session.user.name = vo.user_name;
        console.log("session.email", req.session.user.email);
        console.log("vo.user_name", req.session.user.name);
        if (!req.session.user || !req.session.user.email) {
            console.log("로그인 하지 않은 유저의 대한 월 데이터 요청");
            res.send({ "success": false, "text": "로그인 하고 요청하라고 이것아" })
        } else {
            const todoMonthList = [];
            const todoMonthObjMake = (list_num, year_data, mon_data, day_data, todo, status) => {
                const todoMonthObj = {
                    "list_num": null,
                    "year_data": null,
                    "mon_data": null,
                    "day_data": null,
                    "todo": null,
                    "status": null
                };
                todoMonthObj["list_num"] = list_num;
                todoMonthObj["year_data"] = year_data;
                todoMonthObj["mon_data"] = mon_data;
                todoMonthObj["day_data"] = day_data;
                todoMonthObj["todo"] = todo;
                todoMonthObj["status"] = status;
                return todoMonthObj;
            };
            const { user_email, year_data, mon_data } = req.body;
            todoListModel.monDataGet({ user_email, year_data, mon_data }, (err, result) => {
                if (err) {
                    console.log("월 데이터 불러오던 중 ERROR 발생 : ", err);
                } else if (result.length !== 0) {
                    console.log("월 데이터 불러오기 성공");
                    result.forEach(todoItem => {
                        todoMonthList.push(todoMonthObjMake(todoItem.list_num, todoItem.year_data, todoItem.mon_data, todoItem.day_data, todoItem.todo, todoItem.status));
                    });
                    res.send({ "success": true, "todoMonthList": todoMonthList });
                } else if (result.length === 0) {
                    console.log("일치하는 데이터가 없음");
                    res.send({ "success": false, "todoMonthList": null });
                }
            });
        }
    }
    //------------------------category method--------------------------------//
    // categoryList 생성
    categoryListCreate(req, res) {
        const { user_email, category_name } = req.body;
        console.log("카테고리 생성 : ", user_email, category_name);
        todoListModel.categoryListAdd({ user_email, category_name }, (err, result) => {
            if (err) {
                console.log("카테고리 생성 중 ERROR 발생 : ", err);
                res.send(err);
            } else {
                console.log("카테고리 생성 완료");
                res.send({ "success": true });
            }
        });
    }
    // categoryList 조회
    categoryListGet(req, res) {
        if (!req.session.user) {
            req.session.user = {};
        }
        req.session.user.email = vo.user_email;
        req.session.user.name = vo.user_name;
        if (!req.session.user || !req.session.user.email) {
            console.log("로그인 하지 않은 사용자의 대한 데이터 요청 발생");
            res.send({ "success": false, "text": "좋은 말로 할 때 로그인 하고 데이터 요청해라." });
        } else {
            const categoryList = [];
            const categoryObjMake = (categoryList_num, user_email, category_name, created_time) => {
                const categoryObj = {
                    "categoryList_num": null,
                    "user_email": null,
                    "category_name": null,
                    "created_time": null
                };
                categoryObj["categoryList_num"] = categoryList_num;
                categoryObj["user_email"] = user_email;
                categoryObj["category_name"] = category_name;
                categoryObj["created_time"] = created_time;
                return categoryObj;
            };
            const { user_email } = req.params;
            console.log(req.params);
            console.log("카테고리 요청 한 유저 : ", user_email);
            todoListModel.categoryListSearch(user_email, (err, result) => {
                if (err) {
                    console.log("카테고리 조회 중 ERROR 발생 : ", err);
                    res.send(err);
                } else if (result.length !== 0) {
                    result.forEach(categoryListItem => {
                        categoryList.push(categoryObjMake(categoryListItem.categoryList_num, categoryListItem.user_email, categoryListItem.category_name, categoryListItem.created_time));
                    });
                    console.log(categoryList);
                    res.send({ "success": true, "categoryList": categoryList });
                } else if (result.length === 0) {
                    console.log("해당하는 카테고리가 없음");
                    res.send({ "success": false });
                }
            });
        }
    }
    // category List 삭제
    categoryListDelete(req, res) {
        console.log("소윤씨가 보낸 정보는 : ", req.body);
        const { categoryList_num } = req.body;
        todoListModel.categoryListRemove({ categoryList_num }, (err, result) => {
            if (err) {
                console.log("카테고리 리스트 삭제 도중 ERROR 발생 : ", err);
                res.send(err);
            } else {
                todoListModel.categoryListCheck({ categoryList_num }, (error, checkResult) => {
                    if (error) {
                        console.log("카테고리 리스트 삭제 후 확인 도중 ERROR 발생 : ", error);
                        res.send(error);
                    } else if (checkResult.length !== 0) {
                        console.log("카테고리 리스트 삭제 안됨");
                        res.send({ "success": false });
                    } else if (checkResult.length === 0) {
                        console.log("카테고리 리스트 삭제 확인 완료");
                        res.send({ "success": true });
                    }
                });
            }
        });
    }
    // category List 수정
    categoryListNamePut(req, res) {
        const { categoryList_num, category_ChangeName } = req.body;
        todoListModel.categoryListCorrection({ categoryList_num, category_ChangeName }, (err, result) => {
            if (err) {
                console.log("카테고리 리스트 이름 수정 중 ERROR 발생 : ", err);
                res.send(err);
            } else {
                todoListModel.categoryListNameCorrectionCheck({ categoryList_num, category_ChangeName }, (error, checkResult) => {
                    if (error) {
                        console.log("변경된 카테고리 리스트 확인 중 ERROR 발생 : ", error);
                        res.send(error);
                    } else if (checkResult.length !== 0) {
                        console.log("카테고리 리스트 이름 변경 완료");
                        res.send({ "success": true, "changeCategoryListName": checkResult[0].category_name });
                    } else if (checkResult.length === 0) {
                        console.log("카테고리 리스트 이름 변경 실패");
                        res.send({ "success": false });
                    }
                });
            }
        });
    }
    // category Data 생성
    categoryDataAdd(req, res) {
        const { categoryList_num, user_email, category_data } = req.body;
        console.log("카테고리 데이터 : ", categoryList_num, user_email, category_data);
        todoListModel.categoryDataAdd({ categoryList_num, user_email, category_data }, (err, result) => {
            if (err) {
                console.log("카테고리 데이터 생성 중 ERROR 발생 : ", err);
                res.send(err);
            } else {
                console.log("카테고리 데이터 생성 성공");
                res.send({ "success": true });
            }
        });
    }
    // category Data 조회
    categoryDataGet(req, res) {
        const categoryDataList = [];
        const categoryDataObjMake = (categoryData_num, categoryList_num, user_email, category_data, created_time, status) => {
            const categoryDataObj = {
                "categoryData_num": null,
                "categoryList_num": null,
                "user_email": null,
                "category_data": null,
                "created_time": null,
                "status": null
            };
            categoryDataObj["categoryData_num"] = categoryData_num;
            categoryDataObj["categoryList_num"] = categoryList_num;
            categoryDataObj["user_email"] = user_email;
            categoryDataObj["category_data"] = category_data;
            categoryDataObj["created_time"] = created_time;
            categoryDataObj["status"] = status;
            return categoryDataObj;
        };
        const { user_email } = req.params;
        todoListModel.categoryDataSearch(user_email, (err, result) => {
            if (err) {
                console.log("카테고리리스트의 대한 데이터 불러오던 중 ERROR 발생 : ", err);
                res.send(err);
            } else if (result.length !== 0) {
                result.forEach(categoryDataItem => {
                    categoryDataList.push(categoryDataObjMake(categoryDataItem.categoryData_num, categoryDataItem.categoryList_num, categoryDataItem.user_email, categoryDataItem.category_data, categoryDataItem.created_time, categoryDataItem.status));
                });
                console.log(categoryDataList);
                res.send({ "success": true, "categoryDataList": categoryDataList });
            } else if (result.length === 0) {
                console.log("해당하는 유저의 카테고리 데이터가 존재하지 않습니다.");
                res.send({ "success": false });
            }
        });

    }
    // category Data 수정
    categoryDataPut(req, res) {
        const { categoryData_num, category_ChangeData } = req.body;
        todoListModel.categoryDataCorrection({ categoryData_num, category_ChangeData }, (err, result) => {
            if (err) {
                console.log("카테고리 데이터 수정 중 ERROR 발생 : ", err);
                res.send(err);
            } else {
                todoListModel.categoryDataCorrectionCheck({ categoryData_num, category_ChangeData }, (error, checkResult) => {
                    if (error) {
                        console.log("카테고리 데이터 수정 후 확인 중 ERROR 발생 : ", error);
                        res.send(error);
                    } else if (checkResult.length !== 0) {
                        console.log("카테고리 데이터 수정 성공");
                        res.send({ "success": true, "changeCategoryDataName": checkResult[0].category_data });
                    } else if (checkResult.length === 0) {
                        console.log("카테고리 데이터 수정 실패");
                        res.send({ "success": false });
                    }
                });
            }
        });
    }
    // category Data 삭제
    categoryDataDelete(req, res) {
        const { categoryData_num } = req.body;
        todoListModel.categoryDataRemove(categoryData_num, (err, result) => {
            if (err) {
                console.log("카테고리 데이터 삭제 중 ERROR 발생 : ", err);
                res.send(err);
            } else {
                todoListModel.categoryDataRemoveCheck(categoryData_num, (error, checkResult) => {
                    if (error) {
                        console.log("카테고리 데이터 삭제 후 확인 중 ERROR 발생 : ", error);
                        res.send(error);
                    } else if (checkResult.length === 0) {
                        console.log("카테고리 데이터 삭제 성공");
                        res.send({ "success": true });
                    } else if (checkResult.length !== 0) {
                        console.log("카테고리 데이터 삭제 실패");
                        res.send({ "success": false });
                    }
                });
            }
        });
    }
    // category Data 상태 변경 및 확인
    categoryDataStatusCheck(req, res) {
        const { categoryData_num, status } = req.body;
        todoListModel.categoryDataStatusChange({ categoryData_num, status }, (err, result) => {
            if (err) {
                console.log("카테고리 데이터 상태 변경 중 ERROR 발생 : ", err);
                res.send(err);
            } else {
                todoListModel.categoryDataStatusCheck({ categoryData_num, status }, (error, checkResult) => {
                    if (error) {
                        console.log("카테고리 데이터 상태 변경 확인 중 ERROR 발생 : ", error);
                        res.send(error);
                    } else if (checkResult.length !== 0) {
                        console.log("카테고리 데이터 상태 변경 성공");
                        res.send({ "success": true });
                    } else if (checkResult.length === 0) {
                        console.log("카테도리 데이터 상태 변경 실패");
                        res.send({ "success": false });
                    }
                });
            }
        });
    }
}

const todoListController = new TodoListController("todoListController");
export default todoListController;