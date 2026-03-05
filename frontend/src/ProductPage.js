import { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const fetchProducts = () => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    api
      .post("/products", {
        name,
        price: Number(price),
        stock: Number(stock),
      })
      .then(() => {
        setName("");
        setPrice("");
        setStock("");
        fetchProducts();
      })
      .catch((err) => console.error("Create error:", err));
  };

  const handleDelete = (id) => {
    api
      .delete(`/products/${id}`)
      .then(() => fetchProducts())
      .catch((err) => console.error("Delete error:", err));
  };

  const handleBuy = async (productId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      const response = await api.post("/orders", {
        userId,
        productId,
        quantity: 1,
      });

      alert(response.data.message);

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Order failed!");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Product Management</h1>

      {/* Add Product Form */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h5 className="card-title">Add Product</h5>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>

            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Product List */}
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title mb-3">Product List</h5>

          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th width="200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>
                    <span
                      className={`badge ${p.stock > 0 ? "bg-success" : "bg-danger"}`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>

                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleBuy(p.id)}
                      disabled={p.stock <= 0}
                    >
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
