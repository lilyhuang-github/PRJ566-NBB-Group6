// components/VariationModal.jsx
import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function VariationModal({ show, onClose, variation, ingredientOptions, onSave }) {
  const [localVariation, setLocalVariation] = useState({});

  useEffect(() => {
    if (variation) {
      setLocalVariation({ ...variation });
    }
  }, [variation]);

  const updateField = (field, value) => {
    setLocalVariation((prev) => ({ ...prev, [field]: value }));
  };

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = [...(localVariation.ingredients || [])];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setLocalVariation((prev) => ({ ...prev, ingredients: updatedIngredients }));
  };

  const addIngredient = () => {
    setLocalVariation((prev) => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), { ingredientId: "", name: "", quantityUsed: 0, track: false }],
    }));
  };

  const removeIngredient = (index) => {
    const updatedIngredients = [...(localVariation.ingredients || [])];
    updatedIngredients.splice(index, 1);
    setLocalVariation((prev) => ({ ...prev, ingredients: updatedIngredients }));
  };

  const handleSave = () => {
    const enriched = {
      ...localVariation,
      ingredients: (localVariation.ingredients || []).map((ing) => {
        const matched = ingredientOptions.find((opt) => opt._id === ing.ingredientId);
        return {
          ...ing,
          name: matched?.name || ing.name,
        };
      }),
    };
    onSave(enriched);
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Variation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Variation Name</Form.Label>
          <Form.Control
            type="text"
            value={localVariation.name || ""}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price ($)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={localVariation.price || ""}
            onChange={(e) => updateField("price", parseFloat(e.target.value) || 0)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cost ($)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={localVariation.cost || ""}
            onChange={(e) => updateField("cost", parseFloat(e.target.value) || 0)}
          />
        </Form.Group>

        <h5>Ingredients</h5>
        {(localVariation.ingredients || []).map((ing, index) => (
          <div key={index} style={{ border: "1px solid #444", padding: "1rem", borderRadius: 6, marginBottom: 10 }}>
            <Form.Group className="mb-2">
              <Form.Label>Ingredient</Form.Label>
              <Form.Select
                value={ing.ingredientId || ""}
                onChange={(e) => updateIngredient(index, "ingredientId", e.target.value)}
              >
                <option value="">Select Ingredient</option>
                {ingredientOptions.map((opt) => (
                  <option key={opt._id} value={opt._id}>
                    {opt.name} ({opt.unit})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Quantity Used</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={ing.quantityUsed || 0}
                onChange={(e) => updateIngredient(index, "quantityUsed", parseFloat(e.target.value) || 0)}
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Track Inventory"
              checked={!!ing.track}
              onChange={(e) => updateIngredient(index, "track", e.target.checked)}
            />

            <Button variant="danger" size="sm" onClick={() => removeIngredient(index)} className="mt-2">
              Remove Ingredient
            </Button>
          </div>
        ))}

        <Button variant="secondary" onClick={addIngredient} className="mb-3">
          Add Ingredient
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
