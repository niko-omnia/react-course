# Imports
from dotenv import set_key
import secrets, base64

# Create & set new secret
secret = base64.b64encode(secrets.token_bytes(64)).decode()
set_key(".env", "JWT_SECRET", secret.replace("'", ""))
