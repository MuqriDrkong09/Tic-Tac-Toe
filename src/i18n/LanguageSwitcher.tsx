import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import { useTranslation } from "react-i18next";
import {
  SUPPORTED_LANGUAGES,
  type AppLanguage,
} from "./index.ts";

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const current = i18n.language as AppLanguage;

  return (
    <>
      <Tooltip title={t("header.language")}>
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          color="inherit"
          aria-label={t("header.languageMenu")}
          aria-haspopup="menu"
          aria-expanded={open}
          sx={{
            color: "text.secondary",
            bgcolor: "action.hover",
            "&:hover": { bgcolor: "action.selected" },
          }}
        >
          <LanguageRoundedIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {SUPPORTED_LANGUAGES.map((code) => (
          <MenuItem
            key={code}
            selected={current === code}
            onClick={() => {
              void i18n.changeLanguage(code);
              setAnchorEl(null);
            }}
          >
            <ListItemText primary={t(`languages.${code}`)} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
