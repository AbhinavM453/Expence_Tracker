import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

const API = "http://localhost:8000/Category/category/";

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("access");

    const axiosConfig = useMemo(() => ({
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
}), [token]);

    
    const fetchCategories = useCallback(async () => {
        try {
            const res = await axios.get(API, axiosConfig);
            setCategories(res.data);
        } catch (err) {
            console.log("Error fetching:", err);
        }
    }, [axiosConfig]);

    
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const payload = { name, type };

        try {
            if (editId) {
                
                await axios.patch(`${API}${editId}/`, payload, axiosConfig);
                setMessage("Category updated successfully!");
            } else {
                
                await axios.post(API, payload, axiosConfig);
                setMessage("Category added successfully!");
            }

            setName("");
            setType("");
            setEditId(null);
            fetchCategories();

        } catch (error) {
            console.log(error);
            setMessage("Something went wrong!");
        }
    };

   
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            await axios.delete(`${API}${id}/`, axiosConfig);
            fetchCategories();
            setMessage("Category deleted successfully!");
        } catch (error) {
            console.log(error);
        }
    };

    
    const handleEdit = (cat) => {
        setName(cat.name);
        setType(cat.type);
        setEditId(cat.id);
    };

    return (
    <>
    <Navbar />
        <div style={styles.container}>
            <h2>Manage Categories</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={styles.input}
                />

                <select
    value={type}
    onChange={(e) => setType(e.target.value)}
    required
    style={styles.input}
>
    <option value="">Select Type</option>
    <option value="INCOME">Income</option>
    <option value="EXPENSE">Expense</option>
</select>

                <button type="submit" style={styles.button}>
                    {editId ? "Update Category" : "Add Category"}
                </button>
            </form>

            {message && <p style={styles.message}>{message}</p>}

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat.id}>
                            <td>{cat.id}</td>
                            <td>{cat.user}</td>
                            <td>{cat.name}</td>
                            <td>{cat.type}</td>
                            <td>
                                <button style={styles.editBtn} onClick={() => handleEdit(cat)}>
                                    Edit
                                </button>
                                <button
                                    style={styles.deleteBtn}
                                    onClick={() => handleDelete(cat.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
    );
};

const styles = {
    container: { width: "800px", margin: "40px auto", textAlign: "center" },
    form: { display: "flex", gap: "10px", marginBottom: "20px" },
    input: { padding: "10px", flex: 1 },
    button: { padding: "10px 20px", background: "#007bff", color: "white", border: "none" },
    editBtn: { background: "#ffc107", padding: "5px 10px", marginRight: "5px" },
    deleteBtn: { background: "#dc3545", padding: "5px 10px", color: "white" },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
    },
    message: { color: "green", marginTop: "10px" },
};

export default CategoryPage;
