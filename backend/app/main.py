from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine, Base
from app.routers import auth, products, customers, orders, analytics

# Note: In a production app with Alembic, we might not want to create_all here.
# But for simplicity if we want it to auto-create tables without running migrations manually,
# we can leave it or remove it. We'll rely on Alembic for migrations later if needed.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="StockFlow API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, restrict in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)
app.include_router(analytics.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to StockFlow API"}
