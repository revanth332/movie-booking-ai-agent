import { poolPromise } from "../utils/dbConnection.js";

class Session {
    static async create() {
        try {
            const pool = await poolPromise;
            const sql = `INSERT INTO agent_chat_session (created_at) VALUES (NOW())`;
            const [result] = await pool.query(sql);
            return result.insertId; 
        } catch (err) {
            throw err;
        }
    }

    static async addMessage(sessionId, role, content) {
        try {
            const pool = await poolPromise;
            const sql = `INSERT INTO agent_chat_message (session_id, role, content) VALUES (?, ?, ?)`;
            await pool.query(sql, [sessionId, role, content]);
        } catch (err) {
            throw err;
        }
    }

    static async getChatHistory(sessionId) {
        try {
            const pool = await poolPromise;
            const sql = `SELECT role, content FROM agent_chat_message WHERE session_id = ? ORDER BY created_at ASC`;
            const [rows] = await pool.query(sql, [sessionId]);
            return rows;
        } catch (err) {
            throw err;
        }
    }
    static async getAllSessions(){
        try{
            const pool = await poolPromise;
            const sql = `SELECT session_id, created_at FROM agent_chat_session ORDER BY created_at DESC`;
            const [rows] = await pool.query(sql);
            return rows;
        }
        catch(err){
            throw err;
        }
    }
}

export default Session;
