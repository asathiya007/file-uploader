import React from 'react';
import './App.css';

const App = () => {
  const Post = async e => {
    e.preventDefault(); 
    const file = document.getElementById("inputGroupFile01").files;
    const formData = new FormData(); 

    if (!file[0]) {
      document.getElementById("img").style.visibility = "hidden";
      return;
    }

    formData.append("file", file[0]);

    await fetch("http://localhost:5000/", {
      method: "POST",
      body: formData
    });

    document.getElementById("img").setAttribute("src", `http://localhost:5000/${file[0].name}`);
    document.getElementById("img").style.visibility = "visible";
  }

  return (
    <div className="container">
      <div className="jumbotron">
        <h1 className="display-4">Image Uploader</h1>
        <p className="lead">
          This is a simple application to upload and retrieve images from a database
        </p>
        <hr className="my-4" />
      </div>
      <div className="input-group mb-3">
        <div className="custom-file">
          <input
            type="file"
            className="custom-file-input"
            id="inputGroupFile01"
            aria-describedby="inputGroupFileAddon01"
          />
          <label className="custom-file-label" htmlFor="inputGroupFile01">
            Choose file
          </label>
        </div>
      </div>
      <button type="button" className="btn btn-primary" onClick={Post}>
        Upload
      </button>
      <img
        id="img"
        alt="uploaded"
        style={{
          display: "block",
          width: "100%",
          visibility: "hidden"
        }}></img>
    </div>
  );
}

export default App;
