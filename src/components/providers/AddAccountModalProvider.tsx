"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import AddAccountModal from "@/components/AddAccountModal/AddAccountModal";

type RoleType = "agent" | "transporter" | "buyer";

interface AddAccountModalContextValue {
  /** Opens the "register as another role" modal, optionally preselecting a role. */
  openAddAccountModal: (role?: RoleType) => void;
  closeAddAccountModal: () => void;
}

const AddAccountModalContext =
  createContext<AddAccountModalContextValue | null>(null);

/**
 * Owns the add-account modal at the app root.
 *
 * The modal is deliberately NOT rendered inside the profile dropdown: the
 * navbars close that dropdown on any outside mousedown, which would unmount the
 * modal the moment the user clicked into one of its fields.
 */
export function AddAccountModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultRole, setDefaultRole] = useState<RoleType | undefined>();

  const openAddAccountModal = useCallback((role?: RoleType) => {
    setDefaultRole(role);
    setIsOpen(true);
  }, []);

  const closeAddAccountModal = useCallback(() => setIsOpen(false), []);

  return (
    <AddAccountModalContext.Provider
      value={{ openAddAccountModal, closeAddAccountModal }}
    >
      {children}
      <AddAccountModal
        isOpen={isOpen}
        onClose={closeAddAccountModal}
        defaultRole={defaultRole}
      />
    </AddAccountModalContext.Provider>
  );
}

export function useAddAccountModal(): AddAccountModalContextValue {
  const context = useContext(AddAccountModalContext);
  if (!context) {
    throw new Error(
      "useAddAccountModal must be used within an AddAccountModalProvider",
    );
  }
  return context;
}
