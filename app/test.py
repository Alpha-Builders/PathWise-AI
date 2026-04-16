# import secrets

# print(secrets.token_hex(32)) # To get a random string of 32 bytes in hexadecimal format, which can be used as a secret key for JWT authentication.


from core.security.hashHelper import HashHelper

print(HashHelper.get_password_hash("PathwiseAdmin"))