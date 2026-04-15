from core.database import engine, Base
from db.models.models import User  # import ALL models here

Base.metadata.create_all(bind=engine)
print("Tables created successfully")