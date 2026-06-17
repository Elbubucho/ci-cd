import mysql.connector
import os
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ADMIN_EMAIL = "loise.fenoll@ynov.com"
ADMIN_PASSWORD = "PvdrTAzTeR247sDnAZBr"

conn = mysql.connector.connect(
    database=os.environ["MYSQL_DATABASE"],
    user=os.environ["MYSQL_USER"],
    password=os.environ["MYSQL_ROOT_PASSWORD"],
    host=os.environ["MYSQL_HOST"],
    port=3306,
)


@app.get("/users")
async def get_users():
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, first_name, name, city FROM users")
    return {"users": cursor.fetchall()}


@app.get("/users/{user_id}")
async def get_user(user_id: int):
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": user}


@app.post("/user")
async def create_user(payload: dict = Body(...)):
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO users (first_name, name, email, birth, postcode, city)
           VALUES (%s, %s, %s, %s, %s, %s)""",
        (
            payload["first_name"],
            payload["name"],
            payload["email"],
            payload["birth"],
            payload["postcode"],
            payload["city"],
        ),
    )
    conn.commit()
    return {"status": "ok", "id": cursor.lastrowid}


@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
    conn.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "deleted", "id": user_id}


@app.post("/login")
async def login(payload: dict = Body(...)):
    email = payload.get("email")
    password = payload.get("password")
    if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
        return {"is_admin": True}
    raise HTTPException(status_code=401, detail="Invalid credentials")
