class VO{
    constructor(id){
        this.id = id;
        this._user_email = null;
        this._user_name = null;
    }
    get user_email (){
        return this._user_email;
    }
    get user_name (){
        return this._user_name;
    }
    set user_email(email){
        if(typeof email === "string"){
            this._user_email = email;
        }
    }
    set user_name (name){
        if(typeof name === "string"){
            this._user_name = name;
        }
    }
}

const vo = new VO("vo");
export default vo;