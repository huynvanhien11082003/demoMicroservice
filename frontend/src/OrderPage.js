import { useEffect, useState } from "react";
import api from "./api";

function OrderPage() {

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {

    try {

      const res = await api.get("/orders");

      setOrders(res.data);

    } catch (error) {
      console.error(error);
    }

  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (

    <div>

      <h2 className="mb-4">Order History</h2>

      <table className="table table-bordered">

        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>

        <tbody>

          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.userId}</td>
              <td>{o.productId}</td>
              <td>{o.quantity}</td>
              <td>${o.totalPrice}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>

  );
}

export default OrderPage;