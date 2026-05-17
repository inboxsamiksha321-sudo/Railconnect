import os
from dotenv import load_dotenv
from jose import jwt, JWTError
from fastapi import Header, HTTPException

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def get_current_user(authorization: str = Header(None)):

    print("AUTH HEADER:", authorization)

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )

    try:

        parts = authorization.split(" ")

        if len(parts) != 2:
            raise HTTPException(
                status_code=401,
                detail="Invalid authorization format"
            )

        token = parts[1]

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        print("DECODED PAYLOAD:", payload)

        return payload

    except JWTError as e:

        print("JWT ERROR:", str(e))

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )