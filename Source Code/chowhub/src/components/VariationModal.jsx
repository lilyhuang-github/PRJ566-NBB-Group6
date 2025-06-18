import { useEffect, useState, useCallback } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const VariationModal = ({ show, onClose, variation, ingredientOptions, onSave }) => {
  const [localVariation, setLocalVariation] = useState(variation);

  useEffect(() => {
    // When the `variation` prop changes (e.g., when editing a different variation
    // or when adding a new one), update the local state.
    // Also, ensure ingredients array is always present.
    setLocalVariation({
      ...variation,
      ingredients: Array.isArray(variation?.ingredients) ? variation.ingredients.map(ing => ({
        ...ing,
        // Ensure isCustom is always a boolean and defaults to false if not present
        isCustom: typeof ing.isCustom === 'boolean' ? ing.isCustom : false,
        // Ensure track is always a boolean and defaults to true if has ingredientId, false otherwise
        track: typeof ing.track === 'boolean' ? ing.track : (!!ing.ingredientId),
        // Ensure quantityUsed is a number
        quantityUsed: parseFloat(ing.quantityUsed) || 0,
        // Ensure quantityOriginal is a string
        quantityOriginal: ing.quantityOriginal || '',
        // Ensure unit is a string
        unit: ing.unit || '',
        // Ensure name is a string
        name: ing.name || '',
      })) : []
    });
  }, [variation]);

  // Handle changes to main variation fields (name, price, cost)
  const handleVariationChange = (e) => {
    const { name, value } = e.target;
    setLocalVariation((prev) => ({
      ...prev,
      [name]: name === "price" || name === "cost" ? parseFloat(value) || 0 : value,
    }));
  };

  // Add a new ingredient row
  const addIngredient = () => {
    setLocalVariation((prev) => ({
      ...prev,
      ingredients: [
        ...(prev.ingredients || []),
        {
          name: "",
          ingredientId: null,
          quantityUsed: 0,
          track: false, // Default to not tracked for new ingredients (user can enable)
          isCustom: true, // New ingredients default to custom
          unit: "",
          isChecked: false,
          quantityOriginal: "",
        },
      ],
    }));
  };

  // Update a specific ingredient's field
  const updateIngredient = (index, field, value) => {
    const updatedIngredients = [...(localVariation.ingredients || [])];
    if (!updatedIngredients[index]) return;

    const ing = { ...updatedIngredients[index] }; // Create a copy of the ingredient

    if (field === "isCustom") {
      ing.isCustom = value; // `value` here is the boolean from the checkbox
      if (ing.isCustom) {
        // If switching to CUSTOM
        ing.ingredientId = null; // Clear linked ingredient ID
        ing.track = false; // Custom ingredients are not tracked
        // IMPORTANT: Preserve current `name` and `unit` so user can edit them as custom
        // If they were previously linked, their name/unit will be from the DB ingredient
        // If they were already custom, their name/unit will be their custom values
      } else {
        // If switching OFF CUSTOM (to potentially link to inventory)
        ing.ingredientId = null; // Clear existing ID (force user to re-select from dropdown)
        ing.name = ""; // Clear name, will be populated from selected DB ingredient
        ing.unit = ""; // Clear unit, will be populated from selected DB ingredient
        ing.track = true; // Default to tracked when switching off custom, user can uncheck
      }
    } else if (field === "ingredientId") {
      // Logic for when an item is selected from the dropdown
      const matched = ingredientOptions.find((opt) => opt._id?.toString() === value?.toString());

      if (matched) {
        ing.ingredientId = matched._id?.toString();
        ing.name = matched.name;
        ing.unit = matched.unit;
        ing.track = true; // Default to tracking if an inventory item is selected
        ing.isCustom = false; // Cannot be custom if linked to an inventory item
      } else if (value === "") {
        // Handle "Select Ingredient" option
        ing.ingredientId = null;
        ing.name = "";
        ing.unit = "";
        ing.track = false;
        ing.isCustom = false; 
      } else {
        toast.error("Invalid ingredient selected from DB.");
        return; 
      }
    } else {
      ing[field] = value;
    }

    // Apply the updated ingredient back to the array
    updatedIngredients[index] = ing;
    setLocalVariation((prev) => ({ ...prev, ingredients: updatedIngredients }));
  };

  // Remove an ingredient row
  const removeIngredient = (index) => {
    setLocalVariation((prev) => ({
      ...prev,
      ingredients: (prev.ingredients || []).filter((_, i) => i !== index),
    }));
  };

  // Handle modal save button click
  const handleSave = () => {
    
    if (!localVariation.name.trim()) {
      toast.error("Variation name is required.");
      return;
    }
    if (!localVariation.ingredients || localVariation.ingredients.length === 0) {
      toast.error("At least one ingredient is required for the variation.");
      return;
    }

    onSave(localVariation);
  };

  
  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{localVariation?.name ? "Edit Variation" : "Add New Variation"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Variation Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={localVariation?.name || ""}
              onChange={handleVariationChange}
              required
            />
          </Form.Group>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={localVariation?.price || 0}
                  onChange={handleVariationChange}
                  step="0.01"
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Cost</Form.Label>
                <Form.Control
                  type="number"
                  name="cost"
                  value={localVariation?.cost || 0}
                  onChange={handleVariationChange}
                  step="0.01"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          <h5>Ingredients</h5>
          {(localVariation.ingredients || []).map((ing, index) => (
            <div key={index} className="mb-3 p-3 border rounded">
              <Row className="align-items-center">
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Ingredient Name</Form.Label>
                    {}
                    {ing.isCustom ? (
                      <Form.Control
                        type="text"
                        placeholder="Custom Ingredient Name"
                        value={ing.name || ""}
                        onChange={(e) => updateIngredient(index, "name", e.target.value)}
                        required
                      />
                    ) : (
                      <Form.Select
                        value={ing.ingredientId?.toString() || ""} 
                        onChange={(e) => updateIngredient(index, "ingredientId", e.target.value)}
                        required
                      >
                        <option value="">-- Select Inventory Ingredient --</option>
                        {ingredientOptions.map((opt) => (
                          <option key={opt._id?.toString()} value={opt._id?.toString()}>
                            {opt.name} ({opt.unit})
                          </option>
                        ))}
                      </Form.Select>
                    )}
                  </Form.Group>
                </Col>

                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={ing.quantityUsed || 0}
                      onChange={(e) => updateIngredient(index, "quantityUsed", e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Unit</Form.Label>
                    {ing.isCustom ? (
                      <Form.Control
                        type="text"
                        placeholder="Unit (e.g., kg, pcs)"
                        value={ing.unit || ""}
                        onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                        required
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={ing.unit || ""} // Display unit from DB ingredient
                        readOnly // Read-only for non-custom ingredients
                      />
                    )}
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end justify-content-end">
                  <Form.Group className="mb-0 me-2"> {}
                    <Form.Check
                      type="checkbox"
                      label="Custom"
                      checked={ing.isCustom}
                      onChange={(e) => updateIngredient(index, "isCustom", e.target.checked)}
                      className="mt-3"
                    />
                  </Form.Group>
                  <Form.Group className="mb-0 me-2">
                    <Form.Check
                      type="checkbox"
                      label="Track"
                      checked={ing.track}
                      onChange={(e) => updateIngredient(index, "track", e.target.checked)}
                      disabled={ing.isCustom} // Disable if it's a custom ingredient
                      className="mt-3"
                    />
                  </Form.Group>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                    className="mt-3"
                  >
                    <FaTrash />
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          <Button variant="secondary" onClick={addIngredient} className="mt-3">
            <FaPlus className="me-2" /> Add Ingredient
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Variation
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VariationModal;