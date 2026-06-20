import pytest

def test_create_product(client, auth_headers):
    product_data = {
        "name": "Test Product",
        "sku": "SKU-12345",
        "price": 10.5,
        "quantity": 100
    }
    response = client.post("/products", json=product_data, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Product"
    assert data["sku"] == "SKU-12345"

def test_create_duplicate_sku(client, auth_headers):
    product_data = {
        "name": "Another Product",
        "sku": "SKU-12345",  # Same SKU
        "price": 20.0,
        "quantity": 50
    }
    response = client.post("/products", json=product_data, headers=auth_headers)
    assert response.status_code == 400
    assert response.json()["detail"] == "SKU already exists"

def test_create_negative_quantity(client, auth_headers):
    product_data = {
        "name": "Invalid Product",
        "sku": "SKU-NEG",
        "price": 15.0,
        "quantity": -10  # Negative quantity
    }
    response = client.post("/products", json=product_data, headers=auth_headers)
    assert response.status_code == 422  # Pydantic validation error

def test_get_all_products(client, auth_headers):
    response = client.get("/products", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_product_by_id(client, auth_headers):
    # Get products to find an ID
    products_response = client.get("/products", headers=auth_headers)
    product_id = products_response.json()[0]["id"]

    response = client.get(f"/products/{product_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == product_id

def test_update_product(client, auth_headers):
    # Get products to find an ID
    products_response = client.get("/products", headers=auth_headers)
    product_id = products_response.json()[0]["id"]

    update_data = {"price": 12.0}
    response = client.put(f"/products/{product_id}", json=update_data, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["price"] == 12.0

def test_delete_product(client, auth_headers):
    # Create a product to delete
    product_data = {
        "name": "To Delete",
        "sku": "SKU-DEL",
        "price": 5.0,
        "quantity": 10
    }
    create_response = client.post("/products", json=product_data, headers=auth_headers)
    product_id = create_response.json()["id"]

    delete_response = client.delete(f"/products/{product_id}", headers=auth_headers)
    assert delete_response.status_code == 204

    # Verify deletion
    get_response = client.get(f"/products/{product_id}", headers=auth_headers)
    assert get_response.status_code == 404
