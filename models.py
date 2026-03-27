from sqlmodel import SQLModel, Field, create_engine, Session
from datetime import datetime
from typing import Optional

# Database URL
DATABASE_URL = "sqlite:///./warehouse_inventory.db"

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # Required for SQLite
    echo=False  # Set to True for SQL debugging
)


class Inventory(SQLModel, table=True):
    """SQLModel class for the inventory table."""
    
    product_id: Optional[int] = Field(default=None, primary_key=True)
    sku: str = Field(index=True, unique=True)
    product_name: str
    category: str = Field(index=True)
    quantity_in_stock: int = Field(default=0)
    min_stock_level: int = Field(default=10)
    unit_price: float
    supplier: Optional[str] = None
    location: Optional[str] = None
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)


def create_db_and_tables():
    """Create database tables based on SQLModel definitions."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get a database session."""
    from sqlalchemy.orm import sessionmaker
    SessionLocal = sessionmaker(bind=engine, class_=Session, expire_on_commit=False)
    return SessionLocal()
