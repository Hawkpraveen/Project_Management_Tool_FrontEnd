import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Textarea } from "flowbite-react";

const BoardModal = ({ show, onClose, onSave, boardData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (boardData) {
      setFormData({
        title: boardData.title,
        description: boardData.description,
      });
    } else {
      setFormData({
        title: "",
        description: "",
      });
    }
  }, [boardData]); // Update formData when boardData changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Pass updated formData to onSave function
  };

  return (
    <div>
      <Modal show={show} onClose={onClose}  className="bg-neutral-800 ">
        <Modal.Header className=" bg-slate-600">
          <span className="text-neutral-100">
            {boardData ? "Edit Board" : "Create Board"}
          </span>
        </Modal.Header>
        <Modal.Body className=" bg-slate-600">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <TextInput
                type="text"
                id="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Title"
              />
            </div>
            <div className="mb-5">
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Description"
                rows={5}
              />
            </div>
            <div className="flex">
              <Button
                type="submit"
                gradientDuoTone="cyanToBlue"
                outline
                pill
                className="ms-auto mr-4 hover:scale-105"
              >
                {boardData ? "Update Board" : "Create Board"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BoardModal;
