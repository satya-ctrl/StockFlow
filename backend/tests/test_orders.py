import pytest
import uuid

@pytest.fixture
def test_data(client, auth_headers):
    unique_suffix = str(uuid.uuid4())[:8]
    # Setup Customer
    customer_res = client.post("/customers", json={
        "full_name": "Order Customer",
        "email": f"order_{unique_suffix}@example.com"
    }, headers=auth_headers)
    customer_id = customer_res.json()["id"]

    # Setup Product
    product_res = client.post("/products", json={
        "name": "Order Product",
        "sku": f"ORDER-SKU-{unique_suffix}",
        "price": 50.0,
        "quantity": 100
    }, headers=auth_headers)
    product_id = product_res.json()["id"]

    return {"customer_id": customer_id, "product_id": product_id}

def test_create_order(client, auth_headers, test_data):
    order_data = {
        "customer_id": test_data["customer_id"],
        "items": [
            {
                "product_id": test_data["product_id"],
                "quantity": 2
            }
        ]
    }
    response = client.post("/orders", json=order_data, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["customer_id"] == test_data["customer_id"]
    assert data["total_amount"] == 100.0  # 50.0 * 2

    # Verify stock reduction
    product_res = client.get(f"/products/{test_data['product_id']}", headers=auth_headers)
    assert product_res.json()["quantity"] == 98

def test_create_order_insufficient_stock(client, auth_headers, test_data):
    order_data = {
        "customer_id": test_data["customer_id"],
        "items": [
            {
                "product_id": test_data["product_id"],
                "quantity": 200  # More than available
            }
        ]
    }
    response = client.post("/orders", json=order_data, headers=auth_headers)
    assert response.status_code == 400
    assert "Insufficient stock" in response.json()["detail"]

def test_get_all_orders(client, auth_headers):
    response = client.get("/orders", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_order_by_id(client, auth_headers, test_data):
    # Get orders to find an ID
    orders_response = client.get("/orders", headers=auth_headers)
    order_id = orders_response.json()[0]["id"]

    response = client.get(f"/orders/{order_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == order_id

def test_delete_order(client, auth_headers, test_data):
    # Create an order to delete
    order_data = {
        "customer_id": test_data["customer_id"],
        "items": [
            {
                "product_id": test_data["product_id"],
                "quantity": 1
            }
        ]
    }
    create_response = client.post("/orders", json=order_data, headers=auth_headers)
    order_id = create_response.json()["id"]

    delete_response = client.delete(f"/orders/{order_id}", headers=auth_headers)
    assert delete_response.status_code == 204

    get_response = client.get(f"/orders/{order_id}", headers=auth_headers)
    assert get_response.status_code == 404
