import sql from '../config/database.mjs';

// Model
class UserModel {
    constructor(id) {
        this.id = id;
    }
    // email 중복 검사
    emailCheckSearch(user_email, callback) {
        const emailSelect = `SELECT user_email FROM tbl_user WHERE user_email = "${user_email}"`;
        sql.query(emailSelect, callback);
    }
    // Login 시도 시 아이디 비번 검사
    emailAndPwCheck(userData, callback) {
        const { user_email, user_pw } = userData;
        const emailAndPwSelect = `SELECT user_email, user_pw, user_name FROM tbl_user WHERE user_email = "${user_email}" AND user_pw = "${user_pw}"`;
        sql.query(emailAndPwSelect, callback);
    }
    // 회원가입 시도 시 한번 더 중복 검사
    joinEmailAndPhoneCheck(user_email, callback) {
        const emailAndPhoneSelect = `SELECT user_email FROM tbl_user WHERE user_email = "${user_email}"`;
        sql.query(emailAndPhoneSelect, callback);
    }
    // 회원가입 시도 시 DB에 회원 정보 저장
    userInfoSave(userData, callback) {
        const { user_email, user_pw, user_name, user_phone, user_birth } = userData;
        const userInfoInsert = `INSERT INTO tbl_user VALUES("${user_email}", "${user_pw}", "${user_name}", "${user_phone}", "${user_birth}")`;
        sql.query(userInfoInsert, callback);
    }
    // 아이디 찾기
    userIdFind(userData, callback) {
        const { user_name, user_phone } = userData;
        const userEmailSelect = `SELECT user_email FROM tbl_user WHERE user_name = "${user_name}" AND user_phone = "${user_phone}"`;
        sql.query(userEmailSelect, callback);
    }
    // 비밀번호 찾기
    userPwFind(userData, callback) {
        const { user_email, user_name } = userData;
        const userPwSelect = `SELECT user_email, user_pw FROM tbl_user WHERE user_email = "${user_email}" AND user_name = "${user_name}"`;
        sql.query(userPwSelect, callback);
    }
    // 비밀번호 랜덤으로 변경
    userPwRandomChange(userData, changePw, callback) {
        const { user_email, user_name } = userData;
        const userPwUpdate = `UPDATE tbl_user SET user_pw = "${changePw}" WHERE user_email = "${user_email}" AND user_name = "${user_name}"`;
        sql.query(userPwUpdate, callback)
    }
    // 비밀번호 확인
    userPwCheck(user_email, user_pw, callback) {
        const userPwSelect = `SELECT user_pw FROM tbl_user WHERE user_email = "${user_email}" AND user_pw = "${user_pw}"`;
        sql.query(userPwSelect, callback);
    }
    // 비밀번호 변경
    userPwChange(user_email, change_pw, callback) {
        const userPwUpdate = `UPDATE tbl_user SET user_pw = "${change_pw}" WHERE user_email = "${user_email}"`;
        sql.query(userPwUpdate, callback);
    }
    // 게스트 로그아웃 할 경우 데이터베이스 정보 삭제
    guestDayListRemove(callback) {
        const guestInfoDelete = `DELETE FROM tbl_dayList WHERE user_email = "guest"`;
        sql.query(guestInfoDelete, callback);
    }
    guestCategoryListRemove(callback) {
        const guestInfoDelete = `DELETE FROM tbl_categoryList WHERE user_email = "guest"`;
        sql.query(guestInfoDelete, callback);
    }
}

const userModel = new UserModel("userModel");
export default userModel;
