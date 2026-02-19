/**
 * Branch Context Utility
 * Manages the current branch context for the application
 */

const BRANCH_KEY = 'current_branch_id';

export const branchContext = {
  /**
   * Set the current branch ID
   */
  setBranchId: (branchId) => {
    if (branchId) {
      localStorage.setItem(BRANCH_KEY, branchId.toString());
    } else {
      localStorage.removeItem(BRANCH_KEY);
    }
  },

  /**
   * Get the current branch ID
   */
  getBranchId: () => {
    const branchId = localStorage.getItem(BRANCH_KEY);
    return branchId ? parseInt(branchId, 10) : null;
  },

  /**
   * Clear the current branch
   */
  clearBranch: () => {
    localStorage.removeItem(BRANCH_KEY);
  },

  /**
   * Check if a branch is set
   */
  hasBranch: () => {
    return localStorage.getItem(BRANCH_KEY) !== null;
  },
};

export default branchContext;
