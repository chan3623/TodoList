import mySQL from "mysql";
import dotenv from 'dotenv';
dotenv.config({ path: './src/config/.env' });

const connection = mySQL.createConnection({
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
});

connection.connect((err, connection )=> {
    if(err) {
        throw err;
    }else{
        console.log(`데이터베이스 연결 성공!`);
    }
});

export default connection;