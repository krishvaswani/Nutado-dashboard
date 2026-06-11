"use client";

import { useState, useEffect } from "react";
import { X, Search, Check, Gift, Upload, Trash2, Plus, Globe } from "lucide-react";
import Image from "next/image";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import type { SignatureBoxRecord } from "@/types";
import ProductIcon from "@/components/ui/ProductIcon";
import {
  createSignatureBox,
  updateSignatureBox,
  subscribeProducts,
  uploadImageFile
} from "@/lib/firebase/firestore";

import box1 from "@/Assets/Slide3/box1.png";
import box2 from "@/Assets/Slide3/box 2.png";
import box3 from "@/Assets/Slide3/box3.png";
import box4 from "@/Assets/Slide3/box4.png";
import box5 from "@/Assets/Slide3/box5.png";
import box6 from "@/Assets/Slide3/box6.png";
import box7 from "@/Assets/Slide3/box7.png";
import box8 from "@/Assets/Slide3/box8.png";

const PRESET_BOXES = [
  { id: 1, label: "Crimson Red", img: box1, color: "bg-red-500" },
  { id: 2, label: "Teal Green", img: box2, color: "bg-teal-600" },
  { id: 3, label: "Midnight Blue", img: box3, color: "bg-blue-900" },
  { id: 4, label: "Gold Prestige", img: box4, color: "bg-amber-400" },
  { id: 5, label: "Spring Bloom", img: box5, color: "bg-pink-300" },
  { id: 6, label: "Kraft Classic", img: box6, color: "bg-amber-700" },
  { id: 7, label: "Royal Purple", img: box7, color: "bg-purple-700" },
  { id: 8, label: "Mint Pastel", img: box8, color: "bg-emerald-300" },
];

interface AddCustomBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newBox: SignatureBoxRecord) => void;
  editingBox?: SignatureBoxRecord | null;
}

export default function AddCustomBoxModal({
  isOpen,
  onClose,
  onSuccess,
  editingBox = null,
}: AddCustomBoxModalProps) {
  const [boxName, setBoxName] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [boxType, setBoxType] = useState<"predefined" | "custom">("predefined");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError("");
    try {
      const uploadPromises = Array.from(files).map(file => uploadImageFile(file));
      const urls = await Promise.all(uploadPromises);
      setImages(prev => {
        const next = [...prev];
        urls.forEach(url => {
          if (!next.includes(url)) {
            next.push(url);
          }
        });
        return next;
      });
    } catch (err: any) {
      console.error("Failed to upload one or more images:", err);
      setError("Failed to upload one or more images. Please try again.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };
  
  // Search & select products state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<any[]>([]);
  const [selectedOptionalProductIds, setSelectedOptionalProductIds] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [productsList, setProductsList] = useState<any[]>(MOCK_PRODUCTS);

  // Subscribe to persistent products
  useEffect(() => {
    const unsub = subscribeProducts((data) => {
      setProductsList(data);
    });
    return () => unsub();
  }, []);

  // Pre-fill states when editing
  useEffect(() => {
    if (isOpen) {
      if (editingBox) {
        setBoxName(editingBox.label);
        
        // Resolve images list
        if (editingBox.imageUrls && editingBox.imageUrls.length > 0) {
          setImages(editingBox.imageUrls);
        } else if (editingBox.imageUrl) {
          setImages([editingBox.imageUrl]);
        } else {
          setImages(["preset_1"]);
        }

        setSelectedProductIds(editingBox.productIds || []);
        setSelectedOptionalProductIds(editingBox.optionalProductIds || []);
        
        setBoxType(editingBox.boxType || "predefined");
        setLength(editingBox.length !== undefined ? String(editingBox.length) : "");
        setWidth(editingBox.width !== undefined ? String(editingBox.width) : "");
        setHeight(editingBox.height !== undefined ? String(editingBox.height) : "");
        setWeight(editingBox.weight !== undefined ? String(editingBox.weight) : "");
        setMaxPrice(editingBox.maxPrice !== undefined ? String(editingBox.maxPrice) : "");
      } else {
        // Reset states for fresh creations
        setBoxName("");
        setImages(["preset_1"]);
        setUrlInput("");
        setShowUrlInput(false);
        setSelectedProductIds([]);
        setSelectedOptionalProductIds([]);
        
        setBoxType("predefined");
        setLength("");
        setWidth("");
        setHeight("");
        setWeight("");
        setMaxPrice("");
      }
    }
  }, [isOpen, editingBox]);

  if (!isOpen) return null;

  const filteredProducts = productsList.filter(
    (p) => {
      const nameMatch = p.name ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      const brandMatch = p.brand ? p.brand.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      const categoryMatch = p.category ? p.category.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      return nameMatch || brandMatch || categoryMatch;
    }
  );

  const toggleProduct = (id: any) => {
    setSelectedProductIds((prev) =>
      prev.some(pid => String(pid) === String(id))
        ? prev.filter((pid) => String(pid) !== String(id))
        : [...prev, id]
    );
  };

  const toggleOptionalProduct = (id: any) => {
    setSelectedOptionalProductIds((prev) =>
      prev.some(pid => String(pid) === String(id))
        ? prev.filter((pid) => String(pid) !== String(id))
        : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boxName.trim()) {
      setError("Please provide a box name.");
      return;
    }
    
    if (boxType === "predefined") {
      if (selectedProductIds.length === 0) {
        setError("Please select at least 1 product to include in the predefined box.");
        return;
      }
    } else {
      if (!length || !width || !height || !weight || !maxPrice) {
        setError("Please specify all dimensions, weight, and max price for the custom box.");
        return;
      }
    }

    setSubmitting(true);
    setError("");

    try {
      const finalImages = images.length > 0 ? images : ["preset_1"];
      const primaryImage = finalImages[0];

      const newBoxData: any = {
        label: boxName,
        imageUrl: primaryImage,
        imageUrls: finalImages,
        boxType: boxType,
        createdAt: editingBox ? editingBox.createdAt : new Date().toISOString(),
      };

      if (boxType === "predefined") {
        newBoxData.productIds = selectedProductIds;
        newBoxData.optionalProductIds = selectedOptionalProductIds;
        newBoxData.length = 0;
        newBoxData.width = 0;
        newBoxData.height = 0;
        newBoxData.weight = 0;
        newBoxData.maxPrice = 0;
      } else {
        newBoxData.productIds = [];
        newBoxData.optionalProductIds = [];
        newBoxData.length = Number(length) || 0;
        newBoxData.width = Number(width) || 0;
        newBoxData.height = Number(height) || 0;
        newBoxData.weight = Number(weight) || 0;
        newBoxData.maxPrice = Number(maxPrice) || 0;
      }

      let result;
      if (editingBox) {
        await updateSignatureBox(editingBox.id, newBoxData);
        result = { id: editingBox.id, ...newBoxData };
      } else {
        result = await createSignatureBox(newBoxData);
      }
      onSuccess(result as SignatureBoxRecord);
      
      // Reset state
      setBoxName("");
      setImages(["preset_1"]);
      setUrlInput("");
      setShowUrlInput(false);
      setSelectedProductIds([]);
      setSelectedOptionalProductIds([]);
      setBoxType("predefined");
      setLength("");
      setWidth("");
      setHeight("");
      setWeight("");
      setMaxPrice("");
      onClose();
    } catch (err) {
      console.error(err);
      setError(editingBox ? "Failed to update box in database." : "Failed to save box to database.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-nutado-gray-200 shadow-elevated w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-nutado-gray-100 flex items-center justify-between bg-nutado-gray-50">
          <div className="flex items-center gap-2">
            <Gift className="text-nutado-green" size={20} />
            <h3 className="font-display font-bold text-lg text-nutado-gray-900">
              {editingBox 
                ? (editingBox.boxType === "custom" ? "Edit Custom BYOB Box Option" : "Edit Predefined Box Option") 
                : "Create Gift Box Option"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-nutado-gray-400 hover:text-nutado-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-lg">
              {error}
            </div>
          )}

          {/* Box Type Tab Selector */}
          <div className="bg-nutado-gray-50 border border-nutado-gray-150 rounded-xl p-1.5 flex gap-2">
            <button
              type="button"
              onClick={() => setBoxType("predefined")}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                boxType === "predefined"
                  ? "bg-white text-nutado-green shadow-sm border border-nutado-gray-100"
                  : "text-nutado-gray-500 hover:text-nutado-gray-700"
              }`}
            >
              Predefined Box (Curated Products Bundle)
            </button>
            <button
              type="button"
              onClick={() => setBoxType("custom")}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                boxType === "custom"
                  ? "bg-white text-nutado-green shadow-sm border border-nutado-gray-100"
                  : "text-nutado-gray-500 hover:text-nutado-gray-700"
              }`}
            >
              Custom Box (BYOB Dimensions & Threshold Limits)
            </button>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-nutado-gray-700 mb-1.5">
              Box Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Signature Consuetudo Classic Festive Box"
              value={boxName}
              onChange={(e) => setBoxName(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Box Gallery & Designs Manager */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-nutado-gray-700">
              Box Gallery & Designs <span className="text-nutado-gray-400 font-normal">({images.length} images uploaded)</span>
            </label>

            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 p-3 bg-nutado-gray-50 border border-nutado-gray-150 rounded-xl">
                {images.map((imgUrl, index) => {
                  const isCover = index === 0;
                  const isPreset = imgUrl.startsWith("preset_");
                  let resolvedImg = box1;
                  if (isPreset) {
                    const presetId = Number(imgUrl.split("_")[1]) || 1;
                    resolvedImg = PRESET_BOXES.find(pb => pb.id === presetId)?.img || box1;
                  } else {
                    resolvedImg = imgUrl as any;
                  }

                  return (
                    <div
                      key={imgUrl + index}
                      className={`relative group rounded-xl border-2 overflow-hidden aspect-square flex flex-col items-center justify-center bg-white transition-all ${
                        isCover ? "border-nutado-green ring-2 ring-nutado-green/10" : "border-nutado-gray-200"
                      }`}
                    >
                      {isPreset ? (
                        <Image
                          src={resolvedImg}
                          alt={`Preset ${index + 1}`}
                          className="w-full h-full object-contain p-2 scale-110"
                        />
                      ) : (
                        <img
                          src={imgUrl}
                          alt={`Custom ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {isCover && (
                        <span className="absolute top-1 left-1 bg-nutado-green text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                          Cover
                        </span>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => {
                              setImages(prev => {
                                const next = [...prev];
                                const [selected] = next.splice(index, 1);
                                return [selected, ...next];
                              });
                            }}
                            className="px-2 py-0.5 bg-nutado-green text-white text-[9px] font-bold rounded shadow-sm hover:bg-nutado-green-dark transition-colors"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setImages(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                          title="Remove Design"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-nutado-gray-400 bg-nutado-gray-50 border border-dashed border-nutado-gray-200 rounded-xl">
                <Gift size={24} className="mx-auto mb-1 text-nutado-gray-300" />
                <p className="text-xs font-semibold text-nutado-gray-700">No Box Designs Added Yet</p>
                <p className="text-[10px] text-nutado-gray-400">Add presets or upload computer files below.</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Uploader & Paste Link */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-nutado-gray-400 uppercase tracking-wider block">Add Custom Designs</span>
                
                <div className="flex flex-col gap-2.5">
                  <label className={`flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-nutado-gray-300 hover:border-nutado-green rounded-xl cursor-pointer text-xs font-semibold text-nutado-gray-600 hover:text-nutado-green bg-white hover:bg-brand-50/5 transition-all ${uploadingImage ? "opacity-60 pointer-events-none" : ""}`}>
                    <Upload size={14} className={uploadingImage ? "animate-bounce" : ""} />
                    {uploadingImage ? "Uploading Designs..." : "Upload Files from Computer"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleImageUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="border border-nutado-gray-200 rounded-xl p-3 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-nutado-gray-400 uppercase">Paste Image URL</span>
                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="text-[10px] font-bold text-nutado-green hover:underline"
                      >
                        {showUrlInput ? "Hide Input" : "Show Input"}
                      </button>
                    </div>
                    
                    {showUrlInput && (
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Paste direct image link (e.g. https://...)"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          className="flex-1 input-field py-1.5 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (urlInput.trim()) {
                              setImages(prev => prev.includes(urlInput.trim()) ? prev : [...prev, urlInput.trim()]);
                              setUrlInput("");
                            }
                          }}
                          className="px-3 bg-nutado-green hover:bg-nutado-green-dark text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Presets Quick Picker */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-nutado-gray-400 uppercase tracking-wider block">Quick Add Presets</span>
                <div className="grid grid-cols-4 gap-2 max-h-[145px] overflow-y-auto p-2 bg-nutado-gray-50 border border-nutado-gray-150 rounded-xl">
                  {PRESET_BOXES.map((box) => {
                    const presetKey = `preset_${box.id}`;
                    const isAlreadyAdded = images.includes(presetKey);
                    return (
                      <button
                        key={box.id}
                        type="button"
                        disabled={isAlreadyAdded}
                        onClick={() => {
                          setImages(prev => [...prev, presetKey]);
                        }}
                        className={`relative flex flex-col items-center justify-center p-1.5 rounded-lg border-2 aspect-square transition-all ${
                          isAlreadyAdded
                            ? "opacity-50 border-nutado-gray-100 bg-nutado-gray-100 cursor-not-allowed"
                            : "border-white hover:border-nutado-green bg-white shadow-sm"
                        }`}
                        title={box.label}
                      >
                        <Image
                          src={box.img}
                          alt={box.label}
                          className="w-10 h-10 object-contain scale-110"
                        />
                        <span className="text-[8px] font-semibold text-nutado-gray-500 truncate max-w-full mt-1">
                          {box.label.split(" ")[0]}
                        </span>
                        {isAlreadyAdded && (
                          <span className="absolute top-0.5 right-0.5 bg-nutado-green text-white rounded-full p-0.5">
                            <Check size={6} strokeWidth={4} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {boxType === "custom" ? (
            <div className="space-y-4 animate-fade-in">
              {/* Dimensions */}
              <div>
                <label className="block text-sm font-semibold text-nutado-gray-700 mb-1.5">
                  Dimensions (Length × Width × Height in cm) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="Length (cm)"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="Width (cm)"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="Height (cm)"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Weight & Max Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-nutado-gray-700 mb-1.5">
                    Weight Limit Capacity (g) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g., 500"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-nutado-gray-700 mb-1.5">
                    Max Price Limit Value (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g., 1500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Product Selector */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-nutado-gray-700">
                  Select Included Products <span className="text-red-500">*</span>
                  <span className="text-xs font-normal text-nutado-gray-400 ml-1.5">
                    ({selectedProductIds.length} products selected)
                  </span>
                </label>

                {/* Search within Selector */}
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-nutado-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search products by brand, name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-nutado-gray-200 rounded-lg text-xs placeholder-nutado-gray-400 focus:outline-none focus:ring-1 focus:ring-nutado-green focus:border-nutado-green"
                  />
                </div>

                {/* Products grid checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-nutado-gray-200 rounded-xl p-2 bg-nutado-gray-50/50">
                  {filteredProducts.map((p) => {
                    const isChecked = selectedProductIds.some(pid => String(pid) === String(p.id));
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProduct(p.id)}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                          isChecked
                            ? "bg-white border-nutado-green shadow-sm ring-1 ring-nutado-green"
                            : "bg-white border-nutado-gray-100 hover:border-nutado-gray-200"
                        }`}
                      >
                        <div className="w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors bg-white">
                          {isChecked ? (
                            <div className="w-3 h-3 bg-nutado-green rounded flex items-center justify-center text-white">
                              <Check size={8} strokeWidth={4} />
                            </div>
                          ) : null}
                        </div>
                        {p.imageUrl ? (
                          <img 
                            src={p.imageUrl} 
                            alt={p.name} 
                            className="w-8 h-8 rounded-lg object-contain bg-nutado-gray-50 border border-nutado-gray-100 shrink-0" 
                          />
                        ) : (
                          <ProductIcon category={p.category} name={p.name} size={14} className="w-8 h-8 shrink-0 rounded-lg shadow-sm" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-nutado-gray-900 truncate">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-nutado-gray-400 truncate">
                            {p.brand} • ₹{p.price}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Optional / Swap products selector */}
                <div className="space-y-3 mt-4">
                  <label className="block text-sm font-semibold text-nutado-gray-700">
                    Select Optional Swap-Allowed Products
                    <span className="text-xs font-normal text-nutado-gray-400 ml-1.5">
                      ({selectedOptionalProductIds.length} optional products selected)
                    </span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-nutado-gray-200 rounded-xl p-2 bg-nutado-gray-50/50">
                    {filteredProducts.map((p) => {
                      const isChecked = selectedOptionalProductIds.some(pid => String(pid) === String(p.id));
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleOptionalProduct(p.id)}
                          className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                            isChecked
                              ? "bg-white border-[#ec2626] shadow-sm ring-1 ring-[#ec2626]"
                              : "bg-white border-nutado-gray-100 hover:border-nutado-gray-200"
                          }`}
                        >
                          <div className="w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors bg-white">
                            {isChecked ? (
                              <div className="w-3 h-3 bg-[#ec2626] rounded flex items-center justify-center text-white">
                                <Check size={8} strokeWidth={4} />
                              </div>
                            ) : null}
                          </div>
                          {p.imageUrl ? (
                            <img 
                              src={p.imageUrl} 
                              alt={p.name} 
                              className="w-8 h-8 rounded-lg object-contain bg-nutado-gray-50 border border-nutado-gray-100 shrink-0" 
                            />
                          ) : (
                            <ProductIcon category={p.category} name={p.name} size={14} className="w-8 h-8 shrink-0 rounded-lg shadow-sm" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-nutado-gray-900 truncate">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-nutado-gray-400 truncate">
                              {p.brand} • ₹{p.price}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-nutado-gray-100 bg-nutado-gray-50 flex justify-end gap-3 text-sm font-semibold">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 border border-nutado-gray-300 text-nutado-gray-700 bg-white rounded-lg hover:bg-nutado-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2 bg-nutado-green hover:bg-nutado-green-dark disabled:opacity-60 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {submitting ? "Saving..." : editingBox ? "Save Changes" : "Create Custom Box"}
          </button>
        </div>
      </div>
    </div>
  );
}
