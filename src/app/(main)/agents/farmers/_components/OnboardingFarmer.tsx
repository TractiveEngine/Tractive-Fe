"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { XModalIcon } from "../../_components/Icons/AgentIcons";

interface AddToStoreProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    farmer: Omit<Farmer, "id" | "revenue" | "orders" | "date">
  ) => void;
  editFarmer?: Farmer | null;
}

interface Farmer {
  id: string;
  name: string;
  state: string;
  address: string;
  localMarket: string;
  ninOrCac: string;
  mobile: string;
  altMobile: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  revenue: string;
  orders: string;
  date: string;
  image: string;
}

const nigerianBanks = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank Nigeria",
  "First City Monument Bank (FCMB)",
  "Globus Bank",
  "Guaranty Trust Bank (GTBank)",
  "Heritage Bank",
  "Keystone Bank",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
].sort();

export const OnboardingFarmers: React.FC<AddToStoreProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editFarmer,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: editFarmer?.name || "",
    state: editFarmer?.state || "",
    address: editFarmer?.address || "",
    localMarket: editFarmer?.localMarket || "",
    ninOrCac: editFarmer?.ninOrCac || "",
    mobile: editFarmer?.mobile || "",
    altMobile: editFarmer?.altMobile || "",
    bankName: editFarmer?.bankName || "",
    accountNumber: editFarmer?.accountNumber || "",
    accountName: editFarmer?.accountName || "",
  });
  const [image, setImage] = useState<string>(
    editFarmer?.image || "/images/farmer_modal_profile.png"
  );
  const [errors, setErrors] = useState({
    name: "",
    state: "",
    address: "",
    localMarket: "",
    ninOrCac: "",
    mobile: "",
    altMobile: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const validateFirstForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      state: "",
      address: "",
      localMarket: "",
      ninOrCac: "",
      mobile: "",
      altMobile: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
      isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }
    if (!formData.localMarket.trim()) {
      newErrors.localMarket = "Local market is required";
      isValid = false;
    }
    if (!formData.ninOrCac.trim()) {
      newErrors.ninOrCac = "NIN or CAC number is required";
      isValid = false;
    } else if (
      !/^\d{11}$/.test(formData.ninOrCac) &&
      !/^[A-Z0-9]{7,10}$/i.test(formData.ninOrCac)
    ) {
      newErrors.ninOrCac =
        "NIN must be 11 digits or CAC must be 7-10 alphanumeric";
      isValid = false;
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!/^\d{10,11}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10-11 digits";
      isValid = false;
    }
    if (formData.altMobile && !/^\d{10,11}$/.test(formData.altMobile)) {
      newErrors.altMobile = "Alternative number must be 10-11 digits";
      isValid = false;
    }

    setErrors({ ...errors, ...newErrors });
    return isValid;
  };

  const validateSecondForm = () => {
    let isValid = true;
    const newErrors = {
      bankName: "",
      accountNumber: "",
      accountName: "",
    };

    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
      isValid = false;
    }
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account number must be 10 digits";
      isValid = false;
    }
    if (!formData.accountName.trim()) {
      newErrors.accountName = "Account name is required";
      isValid = false;
    }

    setErrors({ ...errors, ...newErrors });
    return isValid;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleBankSelect = (bank: string) => {
    setFormData({ ...formData, bankName: bank });
    setErrors({ ...errors, bankName: "" });
    setIsDropdownOpen(false);
  };

  const handleFirstFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFirstForm()) {
      setStep(2);
    }
  };

  const handleSecondFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSecondForm()) {
      onSubmit({ ...formData, image });
      onClose();
      setFormData({
        name: "",
        state: "",
        address: "",
        localMarket: "",
        ninOrCac: "",
        mobile: "",
        altMobile: "",
        bankName: "",
        accountNumber: "",
        accountName: "",
      });
      setImage("/images/farmer_modal_profile.png");
      setStep(1);
    }
  };

  const formVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const dropdownVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -10 },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-[#2b2b2b94] flex items-center justify-center z-[100] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-labelledby="onboard-farmer-title"
    >
      <motion.div
        className="bg-[#fefefe] p-4 md:p-6 rounded-lg w-full max-w-md mx-auto relative max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <button
          onClick={() => {
            onClose();
            setStep(1);
            setFormData({
              name: "",
              state: "",
              address: "",
              localMarket: "",
              ninOrCac: "",
              mobile: "",
              altMobile: "",
              bankName: "",
              accountNumber: "",
              accountName: "",
            });
            setImage("/images/farmer_modal_profile.png");
          }}
          className="absolute top-2 right-2 md:top-4 md:right-4 text-[#2b2b2b] hover:text-[#538e53]"
          aria-label="Close modal"
          title="Close"
        >
          <XModalIcon className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-4">
          <div className="relative w-16 h-16 md:w-20 md:h-20 group">
            <Image
              src={image}
              alt="Farmer profile"
              width={80}
              height={80}
              className="w-full h-full rounded-full object-cover border-2 border-gray-300"
            />
            <div className="absolute inset-0 bg-[#2b2b2b] bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-[#fefefe] text-[12px] sm:text-[14px] text-center font-montserrat">
                Change Image
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Upload profile image"
            />
          </div>
        </div>

        <AnimatePresence>
          {step === 1 ? (
            <motion.form
              key="form1"
              onSubmit={handleFirstFormSubmit}
              className="space-y-2.5"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
                  aria-required="true"
                />
                {errors.name && (
                  <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
                >
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
                  aria-required="true"
                />
                {errors.state && (
                  <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
                    {errors.state}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
                >
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
                  aria-required="true"
                />
                {errors.address && (
                  <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
                    {errors.address}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="localMarket"
                  className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
                >
                  Local Market
                </label>
                <input
                  id="localMarket"
                  name="localMarket"
                  type="text"
                  value={formData.localMarket}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
                  aria-required="true"
                />
                {errors.localMarket && (
                  <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
                    {errors.localMarket}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="ninOrCac"
                  className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
                >
                  NIN
                </label>
                <input
                  id="ninOrCac"
                  name="ninOrCac"
                  type="text"
                  value={formData.ninOrCac}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
                  aria-required="true"
                />
                {errors.ninOrCac && (
                  <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
                    {errors.ninOrCac}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
                  >
                    Mobile
                  </label>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
                    aria-required="true"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
                      {errors.mobile}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="altMobile"
                    className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
                  >
                    Alternative
                  </label>
                  <input
                    id="altMobile"
                    name="altMobile"
                    type="tel"
                    value={formData.altMobile}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
                  />
                  {errors.altMobile && (
                    <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
                      {errors.altMobile}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-[#538e53] text-white rounded hover:bg-[#467a46] transition-colors text-[12px] sm:text-[14px]"
                >
                  Continue
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="form2"
              onSubmit={handleSecondFormSubmit}
              className="space-y-4"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <div className="relative" ref={dropdownRef}>
                <label
                  htmlFor="bankName"
                  className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
                >
                  Bank Name
                </label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] text-left focus:outline-none focus:ring-1 focus:ring-[#538e53]"
                  aria-expanded={isDropdownOpen}
                  aria-controls="bank-dropdown"
                >
                  {formData.bankName || "Select Bank"}
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[12px] sm:text-[14px]">
                    {isDropdownOpen ? "▲" : "▼"}
                  </span>
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      id="bank-dropdown"
                      className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-md max-h-40 overflow-y-auto"
                      variants={dropdownVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      transition={{ duration: 0.3 }}
                    >
                      {nigerianBanks.map((bank) => (
                        <div
                          key={bank}
                          onClick={() => handleBankSelect(bank)}
                          className={`px-3 py-2 text-[12px] sm:text-[14px] cursor-pointer hover:bg-gray-100 ${
                            formData.bankName === bank ? "bg-gray-200" : ""
                          }`}
                          role="option"
                          aria-selected={formData.bankName === bank}
                        >
                          {bank}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.bankName && (
                  <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
                    {errors.bankName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="accountNumber"
                  className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
                >
                  Account Number
                </label>
                <input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
                  aria-required="true"
                />
                {errors.accountNumber && (
                  <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
                    {errors.accountNumber}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="accountName"
                  className="block text-[12px] sm:text-[14px] font-montserrat text-[#2b2b2b]"
                >
                  Account Name
                </label>
                <input
                  id="accountName"
                  name="accountName"
                  type="text"
                  value={formData.accountName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[12px] sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-[#538e53]"
                  aria-required="true"
                />
                {errors.accountName && (
                  <p className="text-red-500 text-[12px] sm:text-[14px] mt-1">
                    {errors.accountName}
                  </p>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded text-[#2b2b2b] hover:bg-gray-100 transition-colors text-[12px] sm:text-[14px]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#538e53] text-white rounded hover:bg-[#467a46] transition-colors text-[12px] sm:text-[14px]"
                >
                  Submit
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
