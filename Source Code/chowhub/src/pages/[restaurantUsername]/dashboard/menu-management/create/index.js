// pages/menu-items/create.js
import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Modal, Alert } from "react-bootstrap";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import styles from "./create.module.css";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { useRouter } from "next/router";
import { tokenAtom } from "@/store/atoms";
import { getDefaultStore } from "jotai";

export default function CreateMenuItemForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    isInventoryControlled: false,
    imageFile: null,
    imageUrlFromSpoonacular: "",
    variations: [
      {
        name: "Regular",
        price: "",
        cost: "",
        ingredients: [],
      },
    ],
  });

  const router = useRouter();
  const { restaurantUsername } = router.query;
  const store = getDefaultStore();
  const token = store.get(tokenAtom);

  const [categories, setCategories] = useState([]);
  // Holds warning messages to display if something goes wrong (e.g., duplicate email)
  const [warning, setWarning] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  async function loadCategories() {
    try {
      const res = await apiFetch(`/categories`);
      setCategories(res.categories || []);
    } catch (err) {
      console.error("Failed to load categories", err);
      setCategories([]);
    }
  }

  useEffect(() => {
    loadCategories();
    const timeoutId = setTimeout(async () => {
      if (searchTerm.trim() !== "") {
        try {
          const res = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?query=${searchTerm}&number=5&apiKey=${process.env.NEXT_PUBLIC_SPOONACULARE_API_KEY3}`,
          );
          const data = await res.json();
          setSuggestions(data.results);
        } catch (err) {
          console.error("Spoonacular error:", err);
        }
      } else {
        setSuggestions([]);
      }
    }, 400);
  }, [searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariationChange = (index, field, value) => {
    const newVariations = [...form.variations];
    newVariations[index][field] = value;
    setForm({ ...form, variations: newVariations });
  };

  const checkInventoryControl = (variations) => {
    return variations.some((v) => v.ingredients.some((i) => i.track));
  };

  const handleIngredientChange = async (vIndex, iIndex, field, value) => {
    const newVariations = [...form.variations];
    const ing = newVariations[vIndex].ingredients[iIndex];

    if (field === "track") {
      const checked = value;
      ing.track = checked;

      // Only allow enabling tracking if the ingredient was confirmed via checkIngredients
      if (checked && !ing.ingredientId) {
        toast.error("Please check ingredient before enabling tracking.");
        ing.track = false;
      }
    } else if (field === "quantityUsed") {
      ing.quantityUsed = parseFloat(value) || 0;
    } else if (field === "name") {
      ing[field] = value;
      ing.isChecked = false;
    } else {
      ing[field] = value;
    }

    newVariations[vIndex].ingredients[iIndex] = ing;
    const isInventoryControlled = checkInventoryControl(newVariations);
    setForm({ ...form, variations: newVariations, isInventoryControlled });
  };

  const handleAddIngredient = (variationIndex) => {
    const newIngredient = {
      name: "",
      quantityUsed: "",
      track: false,
      ingredientId: null,
      unit: "",
      isChecked: false,
      inventoryQuantity: "",
      quantityOriginal: "",
    };
    const newVariations = [...form.variations];
    newVariations[variationIndex].ingredients.push(newIngredient);
    setForm({ ...form, variations: newVariations });
  };

  const checkIngredients = async (vIndex, iIndex) => {
    const name = form.variations[vIndex].ingredients[iIndex].name.trim().toLowerCase();

    if (!name) {
      toast.error("Enter an ingredient name first");
      return;
    }

    try {
      const res = await apiFetch(`/ingredients/search?name=${name}`);
      if (res && res.found && res.ingredient && res.ingredient._id) {
        toast.success(`Ingredient "${name}" exists in inventory`);
        const newVariations = [...form.variations];
        const ingredient = newVariations[vIndex].ingredients[iIndex];

        ingredient.isChecked = true;
        ingredient.unit = res.ingredient.unit;
        ingredient.ingredientId = res.ingredient._id;
        ingredient.inventoryQuantity = res.ingredient.quantity;

        setForm({ ...form, variations: newVariations });
      } else {
        toast.error(`Ingredient "${name}" not found`);
      }
    } catch (err) {
      if (err.message === "API Error") {
        toast.error("The ingredient does not exist.");
      } else {
        console.error("Unexpected error:", err);
        toast.error("Something went wrong.");
      }
    }
  };

  const handleRemoveVariation = (index) => {
    const updated = form.variations.filter((_, i) => i !== index);
    const isInventoryControlled = checkInventoryControl(updated);
    setForm({ ...form, variations: updated, isInventoryControlled });
  };

  const handleAddVariation = () => {
    setForm((prev) => ({
      ...prev,
      variations: [
        ...prev.variations,
        {
          name: `Variation ${prev.variations.length + 1}`,
          price: 0,
          cost: 0,
          ingredients: [],
        },
      ],
    }));
  };

  const handleRemoveIngredient = (vIndex, iIndex) => {
    const newVariations = [...form.variations];
    newVariations[vIndex].ingredients.splice(iIndex, 1);
    const isInventoryControlled = checkInventoryControl(newVariations);
    setForm({ ...form, variations: newVariations, isInventoryControlled });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const matchIngredients = (vIndex) => {
    const newVariations = [...form.variations];
    const baseIngredients = newVariations[0].ingredients;
    // Deep copy with reset fields
    newVariations[vIndex].ingredients = baseIngredients.map((ing) => ({
      name: ing.name,
      unit: ing.unit,
      ingredientId: ing.ingredientId,
      isChecked: false,
      track: false,
      quantityUsed: "",
      quantityOriginal: ing.quantityOriginal,
    }));

    const isInventoryControlled = checkInventoryControl(newVariations);
    setForm({ ...form, variations: newVariations, isInventoryControlled });
  };

  const handleSelectSuggestion = async (item) => {
    try {
      const URL = `https://api.spoonacular.com/recipes/${item.id}/information`;
      const res = await fetch(`${URL}?apiKey=${process.env.NEXT_PUBLIC_SPOONACULARE_API_KEY3}`);
      const data = await res.json();

      console.log(data);

      const mappedIngredients = (data.extendedIngredients || []).map((ing) => ({
        name: ing.name.toLowerCase(),
        quantityUsed: ing.amount || "",
        unit: ing.unit || "",
        track: false,
        ingredientId: null,
        isChecked: false,
        quantityOriginal: ing.original || "",
      }));

      // Update form state
      setForm((prev) => {
        const updatedVariations = [...prev.variations];
        const regularIndex = updatedVariations.findIndex((v) => v.name === "Regular");
        if (regularIndex !== -1) {
          updatedVariations[regularIndex].ingredients = mappedIngredients;
        }
        return {
          ...prev,
          name: item.title,
          imageUrlFromSpoonacular: item.image,
          description: data.summary.replace(/<\/?[^>]+(>|$)/g, ""),
          variations: updatedVariations,
        };
      });

      setSuggestions([]);
      setSearchTerm("");
    } catch (err) {
      console.error("Failed to load recipe info:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawFields = ["category", "name", "description", "imageUrlFromSpoonacular"];

    const formData = new FormData();
    for (let key in form) {
      if (key === "imageFile" && form.imageFile) {
        formData.append("image", form.imageFile);
      } else if (rawFields.includes(key)) {
        formData.append(key, form[key]); // no stringify
      } else {
        formData.append(key, JSON.stringify(form[key]));
      }
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu-management`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          // 1) Clear auth in Jotai + localStorage
          store.set(tokenAtom, null);
          store.set(userAtom, null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // 2) Notify the user
          toast.error("Session expired, please log in again.");
          // 3) Redirect out of dashboard
          window.location.href = "/login";
        }
        throw new Error(result.error || "API Error");
      }

      // Notify the success
      toast.success(`Menu item created! `, {
        position: "top-center",
        autoClose: 5000,
      });

      // Return back to ingredient-management page
      router.push(`/${restaurantUsername}/dashboard/menu-management`);
    } catch (err) {
      toast.error(err.message);
      setWarning(err.message);
    }
  };

  return (
    <DashboardLayout>
      <ManagerOnly>
        <h1> Create New Menu Item</h1>
        <Form onSubmit={handleSubmit} className={styles.formWrapper}>
          {/* Spoonacular Search Field */}
          <Form.Group className="mb-3" controlId="spoonacularSearch">
            <Form.Label>Search Meals</Form.Label>
            <Form.Control
              type="text"
              className={styles.ingredientLabel}
              placeholder="Search from Spoonacular..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form.Group>

          {Array.isArray(suggestions) && suggestions.length > 0 && (
            <ul className={`list-group mt-2 ${styles.suggestionsList}`}>
              {suggestions.map((item) => (
                <li
                  key={item.id}
                  className={`list-group-item list-group-item-action d-flex align-items-center ${styles.suggestionsListItem}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectSuggestion(item)}
                >
                  <img
                    src={`${item.image}`}
                    alt={item.name}
                    style={{ width: 40, height: 40, objectFit: "cover", marginRight: "1rem" }}
                  />
                  {item.title}
                </li>
              ))}
            </ul>
          )}

          <br />

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" value={form.name} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              as="textarea"
              rows={2}
              value={form.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, imageFile: e.target.files[0] })}
            />
          </Form.Group>

          {form.variations.map((variation, vIndex) => (
            <div key={vIndex} className="mb-4 border p-3 rounded">
              <Row className="align-items-end">
                <Col>
                  <Form.Label>Variation Name</Form.Label>
                  <Form.Control
                    placeholder="Name"
                    className={styles.placeholderInput}
                    value={variation.name}
                    onChange={(e) => handleVariationChange(vIndex, "name", e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    className={styles.placeholderInput}
                    value={variation.price}
                    onChange={(e) => handleVariationChange(vIndex, "price", e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Cost"
                    className={styles.placeholderInput}
                    value={variation.cost}
                    onChange={(e) => handleVariationChange(vIndex, "cost", e.target.value)}
                  />
                </Col>

                <Col md="auto">
                  {vIndex > 0 && (
                    <Button variant="danger" onClick={() => handleRemoveVariation(vIndex)}>
                      Remove
                    </Button>
                  )}
                </Col>
              </Row>

              <Button className="mt-4 mb-3" onClick={() => handleAddIngredient(vIndex)}>
                + Add Ingredient
              </Button>

              {vIndex > 0 && (
                <>
                  <br />
                  <Button className="mt-4 mb-3" onClick={() => matchIngredients(vIndex)}>
                    Match Ingredients
                  </Button>
                </>
              )}

              {variation.ingredients.map((ing, iIndex) => (
                <Row key={iIndex} className="mt-2 align-items-end">
                  <Col>
                    <Form.Control
                      placeholder="Ingredient Name"
                      className={styles.placeholderInput}
                      value={ing.name}
                      onChange={(e) =>
                        handleIngredientChange(vIndex, iIndex, "name", e.target.value)
                      }
                    />
                  </Col>
                  {ing.isChecked && (
                    <>
                      <Col>
                        <Form.Control
                          type="text"
                          value={`-> ${ing.inventoryQuantity} / ${ing.unit || ""}`}
                          disabled
                          readOnly
                          className={styles.ingredientLabel}
                        />
                      </Col>

                      <Col>
                        <Form.Control
                          type="number"
                          className={styles.ingredientLabel}
                          placeholder="Quantity Used"
                          value={ing.quantityUsed}
                          onChange={(e) =>
                            handleIngredientChange(vIndex, iIndex, "quantityUsed", e.target.value)
                          }
                        />
                      </Col>

                      <Col xs="auto">
                        <Form.Check
                          type="checkbox"
                          label="Track"
                          disabled={!ing.isChecked}
                          checked={ing.track}
                          onChange={(e) =>
                            handleIngredientChange(vIndex, iIndex, "track", e.target.checked)
                          }
                        />
                      </Col>
                    </>
                  )}

                  {!ing.isChecked && (
                    <>
                      <Col>
                        <Button onClick={() => checkIngredients(vIndex, iIndex)}>
                          Check Inventory
                        </Button>
                      </Col>
                    </>
                  )}

                  <Col xs="auto">
                    <Button variant="danger" onClick={() => handleRemoveIngredient(vIndex, iIndex)}>
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
            </div>
          ))}

          <Button className="mb-4" variant="secondary" onClick={handleAddVariation}>
            + Add Variation
          </Button>

          {warning && <p className="text-danger">{warning}</p>}

          <div className="d-flex justify-content-end mt-4">
            <Button type="submit">Create Menu Item</Button>
          </div>
        </Form>
      </ManagerOnly>
    </DashboardLayout>
  );
}
