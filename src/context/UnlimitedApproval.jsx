import React, { useCallback, useState } from "react";
import { MaxUint256 } from "@ethersproject/constants";
import { KEYS, LocalStorage } from "@/utils/localstorage";

const UnlimitedApprovalContext = React.createContext({
  unlimitedApproval: false,
  /**
   * @param {boolean} _value
   * @returns {any}
   */
  setUnlimitedApproval: (_value) => {},
  /**
   * @typedef {number | string} ApprovalAmount
   *
   * @param {ApprovalAmount} _value
   * @returns {ApprovalAmount}
   */
  getApprovalAmount: (_value) => MaxUint256.toString(),
});

export function useUnlimitedApproval() {
  const context = React.useContext(UnlimitedApprovalContext);

  if (context === undefined) {
    throw new Error(
      "useUnlimitedApproval must be used within a UnlimitedApprovalProvider"
    );
  }
  return context;
}

export const UnlimitedApprovalProvider = ({ children }) => {
  const [unlimitedApproval, setUnlimitedApproval] = useState(() =>
    LocalStorage.get(
      KEYS.UNLIMITED_APPROVAL,
      (value) => {
        try {
          return JSON.parse(value);
        } catch (e) {
          throw new Error(LocalStorage.LOCAL_STORAGE_ERRORS.INVALID_SHAPE);
        }
      },
      false
    )
  );

  const getApprovalAmount = useCallback(
    /**
     * @param {ApprovalAmount} amount
     * @returns {ApprovalAmount}
     */
    (amount) => {
      if (unlimitedApproval) {
        return MaxUint256.toString();
      }

      return amount;
    },
    [unlimitedApproval]
  );

  return (
    <UnlimitedApprovalContext.Provider
      value={{ unlimitedApproval, setUnlimitedApproval, getApprovalAmount }}
    >
      {children}
    </UnlimitedApprovalContext.Provider>
  );
};
