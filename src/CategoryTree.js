import React, { useState } from 'react';
import 'uikit/dist/css/uikit.min.css'; 

const CategoryTree = ({ trees, addNewTree, removeTree, expanded, setExpanded, handleRenameTree }) => {
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const renderTree = (trees) => {
    return trees.map(tree => (
      <li key={tree.id}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          {editMode && editingId === tree.id ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter name"
                className="uk-input uk-form-small"
                style={{ marginRight: '10px' }}/>
              <button onClick={() => handleRename(tree.id)} className="uk-button uk-button-success uk-button-small" style={{ marginRight: '10px' }}> Save </button>
              <button onClick={() => setEditMode(false)} className="uk-button uk-button-danger uk-button-small" style={{ marginRight: '10px' }}> Cancel </button>
            </div>
          ) : (
            <>
              <span style={{ fontWeight: tree.children.length > 0 ? 'bold' : 'normal', marginRight: '10px' }}>
                {tree.name}
              </span> 
              <button onClick={() => addNewTree(tree.id)} className="uk-button uk-button-primary uk-button-small" style={{ marginLeft: '10px' }} > + </button>
              <button onClick={() => removeTree(tree.id)} className="uk-button uk-button-danger uk-button-small" style={{ marginLeft: '10px' }} > Х </button>
              <button onClick={() => setExpanded((prevExpanded) => ({ ...prevExpanded, [tree.id]: !prevExpanded[tree.id], }))} className="uk-button uk-button-default uk-button-small" style={{ marginLeft: '10px' }}>
                {expanded[tree.id] ? '−' : '+'}
              </button>
              <button onClick={() => handleEdit(tree.id, tree.name)} className="uk-button uk-button-secondary uk-button-small" style={{ marginLeft: '10px' }} > Edit </button>
            </>
          )}
        </div>
        {expanded[tree.id] && tree.children.length > 0 && (
          <ul>
            {renderTree(tree.children)}
          </ul>
        )}
      </li>
    ));
  };

  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setNewName(currentName);
    setEditMode(true);
  };

  const handleRename = (id) => {
    handleRenameTree(id, newName);
    setEditMode(false);
    setEditingId(null);
  };

  return (
    <ul className="uk-list uk-list-divider">
      {renderTree(trees)}
    </ul>
  );
};

export default CategoryTree;
