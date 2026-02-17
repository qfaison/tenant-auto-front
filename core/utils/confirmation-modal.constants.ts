/**
 * ConfirmationModal constants
 * Centralized values to avoid magic numbers (CODING_RULES)
 */
export const CONFIRMATION_MODAL_CONSTANTS = {
  DEFAULT_WIDTH: 520,
  CONTENT: {
    MESSAGE_FONT_SIZE: "16px",
    MESSAGE_MARGIN_BOTTOM: "8px",
  },
  WARNING: {
    FONT_SIZE: "14px",
    MARGIN_BOTTOM_WITH_INFO: "4px",
    MARGIN_BOTTOM_WITHOUT_INFO: "0",
  },
  ADDITIONAL_INFO: {
    MARGIN_TOP: "4px",
    ITEM_MARGIN_BOTTOM: "2px",
    LAST_ITEM_MARGIN_BOTTOM: "0",
  },
  FOOTER: {
    GAP: "8px",
  },
  MODAL: {
    HEADER_PADDING_BOTTOM: "15px",
    BODY_PADDING: "10px",
    FOOTER_PADDING_TOP: "15px",
  },
} as const;
