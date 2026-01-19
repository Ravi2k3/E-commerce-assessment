import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "E-commerce Assessment API"
    PROJECT_VERSION: str = "1.0.0"
    
    # Nth order logic configuration
    NTH_ORDER_FOR_DISCOUNT: int = int(os.getenv("NTH_ORDER_FOR_DISCOUNT", 5))
    
    # Simple Admin Credentials (DEMO ONLY)
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "admin")

settings = Settings()
