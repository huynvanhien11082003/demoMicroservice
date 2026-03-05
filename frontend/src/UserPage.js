import { useEffect, useState } from "react";
import api from "./api";

function UserPage() {

  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = () => {
    api.get("/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // UPDATE USER
      api.put(`/users/${editingId}`, {
        name,
        email
      })
      .then(() => {
        resetForm();
        fetchUsers();
      })
      .catch(err => console.error(err));

    } else {

      // CREATE USER
      api.post("/users", {
        name,
        email,
        password
      })
      .then(() => {
        resetForm();
        fetchUsers();
      })
      .catch(err => console.error(err));

    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPassword("");
  };

  const handleDelete = (id) => {
    api.delete(`/users/${id}`)
      .then(() => fetchUsers())
      .catch(err => console.error(err));
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="container">

      <h2 className="mb-4">User Management</h2>

      {/* FORM */}

      <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow">

        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>

        {!editingId && (
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>
        )}

        <button className="btn btn-primary me-2">
          {editingId ? "Update User" : "Add User"}
        </button>

        {editingId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}

      </form>

      {/* USER TABLE */}

      <table className="table table-bordered table-hover">

        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th width="150">Action</th>
          </tr>
        </thead>

        <tbody>

          {users.map(user => (
            <tr key={user.id}>

              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>

              <td>

                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={()=>handleEdit(user)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={()=>handleDelete(user.id)}
                >
                  Delete
                </button>

              </td>

            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No users found
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}

export default UserPage;