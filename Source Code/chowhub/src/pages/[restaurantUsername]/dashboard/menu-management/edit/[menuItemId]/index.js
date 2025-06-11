// src/pages/[restaurantUsername]/dashboard/menu-management/edit/[menuItemId]/index.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/api";
import VariationTable from "@/components/VariationTable";
import VariationModal from "@/components/VariationModal";

export default function EditMenuItem() {
  const router = useRouter();
  const { restaurantUsername, menuItemId } = router.query;

  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image: "",
    isInventoryControlled: false,
  });
  const [variations, setVariations] = useState([]);
  const [activeVariation, setActiveVariation] = useState(null);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!router.isReady || !menuItemId) return;

    async function fetchItem() {
      try {
        const res = await apiFetch(`/menu-management/${menuItemId}`);
        const item = res.item;

        setFormData({
          name: item.name || "",
          description: item.description || "",
          category: item.category || "",
          image: item.image || "",
          isInventoryControlled: !!item.isInventoryControlled,
        });

        setVariations(Array.isArray(item.variations) ? item.variations : []);
      } catch (err) {
        console.error("Failed to fetch menu item:", err);
        setWarning("Failed to load menu item.");
      } finally {
        setLoading(false);
      }
    }

    async function fetchIngredients() {
      try {
        const res = await apiFetch("/ingredients?page=1&limit=1000");
        setIngredientOptions(res.ingredients || []);
      } catch (err) {
        console.error("Failed to fetch ingredients:", err);
      }
    }

    fetchItem();
    fetchIngredients();
  }, [router.isReady, menuItemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWarning("");

    try {
      const payload = { ...formData, variations };

      await apiFetch(`/menu-management/${menuItemId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      toast.success("✅ Menu item updated!", { position: "top-center" });
      router.push(`/${restaurantUsername}/dashboard/menu-management`);
    } catch (err) {
      console.error("Update failed:", err);
      setWarning(err.message || "Update failed.");
    }
  };

  const handleVariationDelete = (variation) => {
    const confirmDelete = confirm(`Delete variation "${variation.name}"?`);
    if (confirmDelete) {
      setVariations((prev) => prev.filter((v) => v.name !== variation.name));
    }
  };

  const handleAddVariation = () => {
    setActiveVariation({ name: "", price: 0, cost: 0, ingredients: [] });
    setShowVariationModal(true);
  };

  async function fetchCategories() {
  try {
    const res = await apiFetch("/categories");
    setCategories(res.categories || []);
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
  }
  fetchCategories();

  if (loading) {
    return (
      <DashboardLayout>
        <ManagerOnly>
          <div style={{ padding: "2rem", color: "#FFF" }}>
            <Spinner animation="border" variant="light" /> Loading menu item...
          </div>
        </ManagerOnly>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ManagerOnly>
        <h1>Edit Menu Item</h1>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the item"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCategory">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>


          <Form.Group className="mb-3" controlId="formImage">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL or path"
            />
          </Form.Group>

          <Form.Check
            type="switch"
            id="inventory-switch"
            label="Inventory Controlled?"
            checked={!!formData.isInventoryControlled}
            onChange={(e) =>
              setFormData((f) => ({
                ...f,
                isInventoryControlled: e.target.checked,
              }))
            }
          />

          {warning && <p className="text-danger mt-2">{warning}</p>}

          <Button type="submit" variant="primary" className="mt-3">
            Save Changes
          </Button>
        </Form>

        <div className="mt-4 mb-2">
          <Button variant="success" onClick={handleAddVariation}>
            Add New Variation
          </Button>
        </div>

        <VariationTable
          variations={variations}
          onEdit={(variation) => {
            setActiveVariation(variation);
            setShowVariationModal(true);
          }}
          onDelete={handleVariationDelete}
        />

        <VariationModal
          show={showVariationModal}
          onClose={() => setShowVariationModal(false)}
          variation={activeVariation}
          ingredientOptions={ingredientOptions}
          onSave={(updatedVariation) => {
            if (!updatedVariation.name.trim()) {
              toast.error("Variation name cannot be empty.");
              return;
            }
            if (!updatedVariation.ingredients || updatedVariation.ingredients.length === 0) {
              toast.error("Each variation must include at least one ingredient.");
              return;
            }
            const nameExists = variations.some(
              (v) =>
                v.name.toLowerCase() === updatedVariation.name.toLowerCase() &&
                v !== activeVariation
            );
            if (nameExists) {
              toast.error("Variation name must be unique.");
              return;
            }

            setVariations((prev) => {
              const exists = prev.some((v) => v.name === updatedVariation.name);
              if (exists) {
                return prev.map((v) => (v.name === updatedVariation.name ? updatedVariation : v));
              } else {
                return [...prev, updatedVariation];
              }
            });
            setShowVariationModal(false);
          }}
        />
      </ManagerOnly>
    </DashboardLayout>
  );
}
