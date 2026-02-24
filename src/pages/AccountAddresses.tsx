import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ChevronLeft, Loader2, Plus, Trash2, Edit, Check } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/integrations/firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import type { Address } from "@/integrations/firebase/types";

const addressSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  phone: z.string().optional(),
});

const AccountAddresses = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses", user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const q = query(
        collection(db, "addresses"),
        where("user_id", "==", user.uid),
        orderBy("is_default", "desc")
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Address);
    },
    enabled: !!user,
  });

  const addAddress = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      
      const result = addressSchema.safeParse(formData);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFieldErrors(errors);
        throw new Error("Validation failed");
      }

      await addDoc(collection(db, "addresses"), {
        user_id: user.uid,
        full_name: formData.fullName,
        address_line_1: formData.addressLine1,
        address_line_2: formData.addressLine2 || null,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        phone: formData.phone || null,
        is_default: addresses.length === 0,
        country: "US",
        created_at: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setShowForm(false);
      resetForm();
      toast({
        title: "Address added",
        description: "Your address has been saved.",
      });
    },
    onError: (error) => {
      if (error.message !== "Validation failed") {
        toast({
          title: "Error",
          description: "Failed to add address. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const deleteAddress = useMutation({
    mutationFn: async (addressId: string) => {
      await deleteDoc(doc(db, "addresses", addressId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast({
        title: "Address removed",
        description: "Your address has been deleted.",
      });
    },
  });

  const setDefault = useMutation({
    mutationFn: async (addressId: string) => {
      if (!user) return;
      
      // Use batch to set all to non-default, then set selected as default
      const batch = writeBatch(db);

      // Set all current user addresses to non-default
      for (const addr of addresses) {
        batch.update(doc(db, "addresses", addr.id), { is_default: false });
      }
      
      // Set the selected one as default
      batch.update(doc(db, "addresses", addressId), { is_default: true });

      await batch.commit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast({
        title: "Default address updated",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      phone: "",
    });
    setFieldErrors({});
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="pt-40 pb-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container-premium max-w-3xl">
          <Link
            to="/account"
            className="inline-flex items-center gap-2 text-caption text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Account
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h1 className="text-headline text-foreground mb-2">Addresses</h1>
              <p className="text-body text-muted-foreground">
                Manage your shipping addresses.
              </p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-outline flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Address
              </button>
            )}
          </motion.div>

          {/* Add Address Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card border border-border p-8 mb-8"
            >
              <h2 className="text-subhead text-foreground mb-6">New Address</h2>
              <div className="grid gap-6">
                <div>
                  <label className="text-caption text-muted-foreground block mb-2">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-input border border-border px-4 py-3 text-body text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                  />
                  {fieldErrors.fullName && (
                    <p className="text-destructive text-xs mt-1">{fieldErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="text-caption text-muted-foreground block mb-2">
                    ADDRESS LINE 1
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full bg-input border border-border px-4 py-3 text-body text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                  />
                  {fieldErrors.addressLine1 && (
                    <p className="text-destructive text-xs mt-1">{fieldErrors.addressLine1}</p>
                  )}
                </div>

                <div>
                  <label className="text-caption text-muted-foreground block mb-2">
                    ADDRESS LINE 2 (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    className="w-full bg-input border border-border px-4 py-3 text-body text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-caption text-muted-foreground block mb-2">
                      CITY
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-input border border-border px-4 py-3 text-body text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                    />
                    {fieldErrors.city && (
                      <p className="text-destructive text-xs mt-1">{fieldErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-caption text-muted-foreground block mb-2">
                      STATE
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-input border border-border px-4 py-3 text-body text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                    />
                    {fieldErrors.state && (
                      <p className="text-destructive text-xs mt-1">{fieldErrors.state}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-caption text-muted-foreground block mb-2">
                      POSTAL CODE
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full bg-input border border-border px-4 py-3 text-body text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                    />
                    {fieldErrors.postalCode && (
                      <p className="text-destructive text-xs mt-1">{fieldErrors.postalCode}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-caption text-muted-foreground block mb-2">
                      PHONE (OPTIONAL)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-input border border-border px-4 py-3 text-body text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => addAddress.mutate()}
                    disabled={addAddress.isPending}
                    className="btn-primary flex items-center gap-2"
                  >
                    {addAddress.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Save Address"
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Address List */}
          {addresses.length === 0 && !showForm ? (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center py-20"
            >
              <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-subhead text-foreground mb-4">No Addresses Saved</h2>
              <p className="text-body text-muted-foreground mb-8">
                Add your first shipping address.
              </p>
              <button onClick={() => setShowForm(true)} className="btn-primary">
                Add Address
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address, index) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-card border p-6 ${
                    address.is_default ? "border-foreground" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      {address.is_default && (
                        <span className="inline-flex items-center gap-1 text-xs tracking-wider uppercase text-foreground mb-2">
                          <Check className="w-3 h-3" /> Default
                        </span>
                      )}
                      <p className="text-body font-medium text-foreground">
                        {address.full_name}
                      </p>
                      <p className="text-body text-muted-foreground">
                        {address.address_line_1}
                      </p>
                      {address.address_line_2 && (
                        <p className="text-body text-muted-foreground">
                          {address.address_line_2}
                        </p>
                      )}
                      <p className="text-body text-muted-foreground">
                        {address.city}, {address.state} {address.postal_code}
                      </p>
                      {address.phone && (
                        <p className="text-body text-muted-foreground mt-2">
                          {address.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!address.is_default && (
                        <button
                          onClick={() => setDefault.mutate(address.id)}
                          className="text-caption text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => deleteAddress.mutate(address.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AccountAddresses;
