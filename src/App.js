import React, { useState } from 'react';
import CategoryTree from './CategoryTree';
import 'uikit/dist/css/uikit.min.css';

const App = () => {
  const [trees, setTrees] = useState([]);
  const [newTreeName, setNewTreeName] = useState('');
  const [expanded, setExpanded] = useState({});

  // + РОДИТЕЛЬСКАЯ КАТЕГОРИЯ
  const addNewParentTree = () => {
    if (newTreeName.trim() === '') return;

    const newTree = {
      id: Date.now(),
      name: newTreeName,
      children: [] 
    };

    setTrees([...trees, newTree]);

    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [newTree.id]: true 
    }));

    setNewTreeName('');
  };

  // + ПОДКАТЕГОРИЯ
  const addNewTree = (parentId) => {
    const parentTree = findTreeById(trees, parentId);
    const newTree = {
      id: Date.now(),
      name: `${parentTree.name}-${parentTree.children.length + 1}`,
      children: []
    };

    const updatedTrees = addTree(trees, parentId, newTree);
    setTrees(updatedTrees);

    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [newTree.id]: true 
    }));
  };

  // ПОДКАТЕГОРИЯ В ПОДКАТЕГОРИИ
  const addSubcategoryToSubcategory = (parentId, subcategoryId) => {
    const parentTree = findTreeById(trees, parentId);
    const parentSubcategory = findTreeById(parentTree.children, subcategoryId);

    const newTree = {
      id: Date.now(),
      name: `${parentSubcategory.name}-${parentSubcategory.children.length + 1}`,
      children: []
    };

    const updatedTrees = addTreeToSubcategory(trees, parentId, subcategoryId, newTree);
    setTrees(updatedTrees);

    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [newTree.id]: true 
    }));
  };

  // EDIT
  const handleRenameTree = (idToRename, newName) => {
    if (!newName.trim()) return;

    const updatedTrees = trees.map(tree => {
      if (tree.id === idToRename) {
        tree.name = newName;
      }

      if (tree.children.length > 0) {
        tree.children = updateSubcategories(tree.children, idToRename, newName);
      }

      return tree;
    });

    setTrees(updatedTrees);
  };

  // ОБНОВЛЕНИЕ ПОДКАТЕГОРИИ
  const updateSubcategories = (subcategories, idToRename, newName) => {
    return subcategories.map(subcategory => {
      if (subcategory.id === idToRename) {
        subcategory.name = newName;
      }

      if (subcategory.children.length > 0) {
        subcategory.children = updateSubcategories(subcategory.children, idToRename, newName);
      }

      return subcategory;
    });
  };

  // ДОБАВЛЕНИЕ И УДАЛЕНИЕ ПОДКАТЕГОРИИ
  const addTree = (trees, parentId, newTree) => {
    return trees.map(tree => {
      if (tree.id === parentId) {
        tree.children.push(newTree);
      }
      if (tree.children.length > 0) {
        tree.children = addTree(tree.children, parentId, newTree);
      }
      return tree;
    });
  };

  const addTreeToSubcategory = (trees, parentId, subcategoryId, newTree) => {
    return trees.map(tree => {
      if (tree.id === parentId) {
        tree.children = tree.children.map(subcategory => {
          if (subcategory.id === subcategoryId) {
            subcategory.children.push(newTree);
          }
          return subcategory;
        });
      }
      if (tree.children.length > 0) {
        tree.children = addTreeToSubcategory(tree.children, parentId, subcategoryId, newTree);
      }
      return tree;
    });
  };

  const removeTree = (trees, idToRemove) => {
    return trees.filter(tree => {
      if (tree.id === idToRemove) {
        return false;
      }
      if (tree.children.length > 0) {
        tree.children = removeTree(tree.children, idToRemove);
      }
      return true;
    });
  };

  const findTreeById = (trees, id) => {
    for (let tree of trees) {
      if (tree.id === id) {
        return tree;
      }
      if (tree.children.length > 0) {
        const found = findTreeById(tree.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const handleRemoveTree = (idToRemove) => {
    const updatedTrees = removeTree(trees, idToRemove);
    setTrees(updatedTrees);
  };

  return (
    <div className="uk-container uk-margin-top">
      <h1 className="uk-text-center">Exam Category Tree</h1>

      {/* ИНПУТ */}
      <div className="uk-margin">
        <input
          type="text"
          value={newTreeName}
          onChange={(e) => setNewTreeName(e.target.value)}
          placeholder="Enter tree name"
          className="uk-input" />
        <button onClick={addNewParentTree} className="uk-button uk-button-primary uk-margin-center">Create Tree</button>
      </div>

      {/* ОТОБРАЖЕНИЕ ДЕРЕВЬЕВ */}
      <CategoryTree
        trees={trees}
        addNewTree={addNewTree}
        addSubcategoryToSubcategory={addSubcategoryToSubcategory}
        removeTree={handleRemoveTree}
        expanded={expanded}
        setExpanded={setExpanded}
        handleRenameTree={handleRenameTree}
      />
    </div>
  );
};

export default App;