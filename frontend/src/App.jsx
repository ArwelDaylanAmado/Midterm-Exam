import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API:", API_URL);

function App() {
  const [characters, setCharacters] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    rarity: "",
    element: "",
    path: "",
    faction: "",
  });

  console.log("API URL:", API_URL);

  function loadCharacters() {
    fetch(`${API_URL}/characters`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Backend error while loading characters");
        }
        return res.json();
      })
      .then((data) => {
        setCharacters(data);
        setMessage("");
      })
      .catch((err) => {
        console.log("Load error:", err);
        setMessage("Cannot connect to backend. Make sure Flask is running.");
      });
  }

  useEffect(() => {
    loadCharacters();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function addCharacter(e) {
    e.preventDefault();

    fetch(`${API_URL}/characters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Add response:", data);

        if (data.error) {
          setMessage(data.error);
          return;
        }

        setMessage("Character added successfully!");
        loadCharacters();

        setForm({
          name: "",
          rarity: "",
          element: "",
          path: "",
          faction: "",
        });
      })
      .catch((err) => {
        console.log("Add error:", err);
        setMessage("Failed to add character. Backend is not connected.");
      });
  }

  function deleteCharacter(id) {
    fetch(`${API_URL}/characters/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Delete response:", data);
        setMessage("Character deleted successfully!");
        loadCharacters();
      })
      .catch((err) => {
        console.log("Delete error:", err);
        setMessage("Failed to delete character.");
      });
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Honkai Star Rail Characters</h1>

        {message && <p style={messageStyle}>{message}</p>}

        <form onSubmit={addCharacter}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            name="rarity"
            placeholder="Rarity"
            value={form.rarity}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="element"
            placeholder="Element"
            value={form.element}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="path"
            placeholder="Path"
            value={form.path}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="faction"
            placeholder="Faction"
            value={form.faction}
            onChange={handleChange}
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Add Character
          </button>
        </form>

        <hr />

        {characters.length === 0 ? (
          <p style={{ textAlign: "center" }}>No characters yet.</p>
        ) : (
          characters.map((char) => (
            <div key={char.id} style={cardStyle}>
              <h3>{char.name}</h3>
              <p>Rarity: {char.rarity}</p>
              <p>Element: {char.element}</p>
              <p>Path: {char.path}</p>
              <p>Faction: {char.faction}</p>

              <button
                onClick={() => deleteCharacter(char.id)}
                style={deleteStyle}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  backgroundColor: "#0D47A1",
  padding: "30px",
  fontFamily: "Arial",
};

const containerStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  maxWidth: "600px",
  margin: "auto",
};

const titleStyle = {
  color: "#1976D2",
  textAlign: "center",
};

const messageStyle = {
  textAlign: "center",
  color: "#0D47A1",
  fontWeight: "bold",
};

const inputStyle = {
  display: "block",
  width: "100%",
  margin: "8px 0",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #1976D2",
  backgroundColor: "#E3F2FD",
  color: "#0D47A1",
  boxSizing: "border-box",
};

const buttonStyle = {
  backgroundColor: "#1976D2",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  width: "100%",
  marginTop: "10px",
};

const deleteStyle = {
  backgroundColor: "#d32f2f",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer",
};

const cardStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "8px",
};

export default App;