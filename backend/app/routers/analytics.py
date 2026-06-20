from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.database.database import get_db
from app.models.models import Product, Customer, Order
from app.schemas.schemas import AnalyticsResponse
from app.services.auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("", response_model=AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    total_products = db.query(Product).count()
    total_customers = db.query(Customer).count()
    total_orders = db.query(Order).count()
    
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0.0
    
    low_stock_threshold = 10
    low_stock_products = db.query(Product).filter(Product.quantity <= low_stock_threshold).all()

    return AnalyticsResponse(
        total_products=total_products,
        total_customers=total_customers,
        total_orders=total_orders,
        total_revenue=total_revenue,
        low_stock_products=low_stock_products
    )
