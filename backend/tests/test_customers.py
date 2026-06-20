import pytest

def test_create_customer(client, auth_headers):
    customer_data = {
        "full_name": "Test Customer",
        "email": "test.customer@example.com",
        "phone": "1234567890"
    }
    response = client.post("/customers", json=customer_data, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "Test Customer"
    assert data["email"] == "test.customer@example.com"

def test_create_duplicate_email(client, auth_headers):
    customer_data = {
        "full_name": "Another Customer",
        "email": "test.customer@example.com",  # Duplicate email
        "phone": "0987654321"
    }
    response = client.post("/customers", json=customer_data, headers=auth_headers)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already exists"

def test_get_all_customers(client, auth_headers):
    response = client.get("/customers", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_customer_by_id(client, auth_headers):
    customers_response = client.get("/customers", headers=auth_headers)
    customer_id = customers_response.json()[0]["id"]

    response = client.get(f"/customers/{customer_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == customer_id

def test_delete_customer(client, auth_headers):
    customer_data = {
        "full_name": "To Delete Customer",
        "email": "delete.me@example.com"
    }
    create_response = client.post("/customers", json=customer_data, headers=auth_headers)
    customer_id = create_response.json()["id"]

    delete_response = client.delete(f"/customers/{customer_id}", headers=auth_headers)
    assert delete_response.status_code == 204

    get_response = client.get(f"/customers/{customer_id}", headers=auth_headers)
    assert get_response.status_code == 404
