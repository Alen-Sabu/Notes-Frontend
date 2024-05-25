import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Notes from "../components/Notes";
import "../styles/Home.css"

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, seteditId] = useState(null)
  const navigate = useNavigate();

  useEffect(() => getNotes(), []);

  const logout = () => {
    localStorage.clear() // Remove the token from localStorage
    navigate('/login'); // Redirect to the login page
  };
  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => setNotes(data))
      .catch((error) => alert(error));
  };

  const deleteNotes = (id) => {
    api
      .delete(`/api/notes/${id}`)
      .then((res) => {
        if (res.status === 204) alert("note deleted");
        else alert("failed to delete");
        getNotes();
      })
      .catch((error) => alert(error));
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) alert("Note created");
        else alert("failed to make note.");
        getNotes();
        setTitle("");
        setContent("")
      })
      .catch((err) => alert(err));
  };

  const updateNote = (e) => {
    e.preventDefault()
    api.put(`/api/notes/${editId}`, { content, title})
    .then((res) => {
      if(res.status === 200) alert("Notes update successfully");
      else alert("failed to update note")
      getNotes()
      setIsEditing(false)
      seteditId(null)
      setTitle("");
      setContent("")
    })
    .catch((err) => alert(err))
  }
 
  const startEditing = (note) => {
    setIsEditing(true)
    seteditId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  return (
    <div>
    <button className="button-logout" onClick={logout}>Logout</button>
      <div>
      {notes && notes.length > 0 && (
        <div>
          <h2>Notes</h2>
          {notes.map((note) => (
            <Notes note={note} onDelete={deleteNotes} onEdit={() => startEditing(note)} key={note.id} />
          ))}
        </div>
      )}
  
      </div>
      <h2 className="form-heading">{isEditing ? "Edit Note" : "Create a Note"}</h2>
      <form onSubmit={isEditing ? updateNote: createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <label htmlFor="content">Content</label>
        <br />
        <textarea
          name="content"
          id="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Home;
