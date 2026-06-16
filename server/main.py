import mysql.connector
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = mysql.connector.connect(
    database=os.environ["MYSQL_DATABASE"],
    user=os.environ["MYSQL_USER"],
    password=os.environ["MYSQL_ROOT_PASSWORD"],
    host=os.environ["MYSQL_HOST"],
    port=3306,
)
@app.get("/users")
async def get_users():
    cursor = conn.cursor()
    sql_select_Query = "SELECT * FROM users"
    cursor.execute(sql_select_Query)
    records = cursor.fetchall()
    print(f'total numbers of rows {cursor.rowcount}')
    return {"users": records}