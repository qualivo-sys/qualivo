/* @ds-bundle: {"format":4,"namespace":"AgentomeDesignSystem_92e408","components":[{"name":"EmployeeCard","sourcePath":"components/employee/EmployeeCard.jsx"},{"name":"RoleIcon","sourcePath":"components/employee/RoleIcon.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Dialog","sourcePath":"components/surfaces/Dialog.jsx"}],"sourceHashes":{"components/employee/EmployeeCard.jsx":"98fc7e917b67","components/employee/RoleIcon.jsx":"eeb57fcea0ca","components/feedback/Badge.jsx":"6815e39edf2d","components/feedback/Tag.jsx":"f71edaa78e96","components/feedback/Toast.jsx":"9717559297ad","components/feedback/Tooltip.jsx":"acb300ca738c","components/forms/Button.jsx":"4a729d6cc57f","components/forms/Checkbox.jsx":"324022ffbc05","components/forms/IconButton.jsx":"4ea35efbea49","components/forms/Input.jsx":"dff64822c26d","components/forms/Radio.jsx":"b49e0a68dfef","components/forms/Select.jsx":"1e4f7acca180","components/forms/Switch.jsx":"2bb25e23dfce","components/navigation/Tabs.jsx":"83e2633e2d59","components/surfaces/Card.jsx":"d3d10eee84ae","components/surfaces/Dialog.jsx":"36fb70da7aa4","ui_kits/marketing/Hero.jsx":"51aac573d9e8","ui_kits/marketing/Nav.jsx":"c4f3890f1b82","ui_kits/marketing/ProductSection.jsx":"06f189de44c6"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AgentomeDesignSystem_92e408 = window.AgentomeDesignSystem_92e408 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/employee/RoleIcon.jsx
try { (() => {
const ROLE_ICONS = {
  sdr: 'phone-outgoing',
  cfo: 'banknote',
  cs: 'heart-handshake',
  ops: 'settings-2',
  marketing: 'megaphone',
  cobros: 'receipt',
  rrhh: 'users',
  generic: 'user-round'
};
function RoleIcon({
  role = 'generic',
  size = 22,
  color = 'currentColor',
  style
}) {
  React.useEffect(() => {
    window.lucide?.createIcons?.();
  });
  return React.createElement('i', {
    'data-lucide': ROLE_ICONS[role] || ROLE_ICONS.generic,
    style: {
      width: size,
      height: size,
      color,
      display: 'block',
      ...style
    }
  });
}
Object.assign(__ds_scope, { RoleIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/employee/RoleIcon.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function Badge({
  tone = 'neutral',
  children,
  style
}) {
  const tones = {
    neutral: {
      background: 'var(--surface-subtle)',
      color: 'var(--text-secondary)'
    },
    accent: {
      background: 'var(--accent-tint)',
      color: 'var(--accent-900)'
    },
    success: {
      background: 'var(--accent-tint)',
      color: 'var(--success)'
    },
    warning: {
      background: 'var(--warning-tint)',
      color: 'var(--warning)'
    },
    error: {
      background: 'var(--error-tint)',
      color: 'var(--error)'
    }
  };
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: 'var(--caption-size)',
      fontWeight: 600,
      letterSpacing: 'var(--caption-tracking)',
      ...tones[tone],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/employee/EmployeeCard.jsx
try { (() => {
function EmployeeCard({
  name,
  role = 'generic',
  roleLabel,
  status = 'Activo',
  duties = [],
  frees,
  style
}) {
  return React.createElement('div', {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      width: 320,
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      ...style
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px'
    }
  }, React.createElement('div', {
    style: {
      width: 48,
      height: 48,
      borderRadius: 'var(--radius-md)',
      background: 'var(--accent-tint)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, React.createElement(__ds_scope.RoleIcon, {
    role,
    size: 22,
    color: 'var(--accent-900)'
  })), React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      minWidth: 0
    }
  }, React.createElement('span', {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--h4-size)',
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, name), React.createElement('span', {
    style: {
      fontSize: 'var(--body-sm-size)',
      color: 'var(--text-muted)'
    }
  }, roleLabel))), React.createElement(__ds_scope.Badge, {
    tone: status === 'Activo' ? 'success' : status === 'En formación' ? 'warning' : 'neutral',
    style: {
      alignSelf: 'flex-start'
    }
  }, status), duties.length > 0 && React.createElement('ul', {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }
  }, duties.map((d, i) => React.createElement('li', {
    key: i,
    style: {
      display: 'flex',
      gap: '8px',
      fontSize: 'var(--body-sm-size)',
      color: 'var(--text-secondary)'
    }
  }, React.createElement('span', {
    style: {
      color: 'var(--accent)'
    }
  }, '\u2013'), d))), frees && React.createElement('div', {
    style: {
      borderTop: '1px solid var(--border)',
      paddingTop: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2px'
    }
  }, React.createElement('span', {
    style: {
      fontSize: 'var(--caption-size)',
      color: 'var(--text-muted)',
      letterSpacing: 'var(--caption-tracking)'
    }
  }, 'Libera'), React.createElement('span', {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--h3-size)',
      fontWeight: 600,
      color: 'var(--accent-900)'
    }
  }, frees)));
}
Object.assign(__ds_scope, { EmployeeCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/employee/EmployeeCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag.jsx
try { (() => {
function Tag({
  children,
  onRemove,
  style
}) {
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 10px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-subtle)',
      border: '1px solid var(--border)',
      fontSize: 'var(--body-sm-size)',
      color: 'var(--text-primary)',
      ...style
    }
  }, children, onRemove && React.createElement('span', {
    onClick: onRemove,
    style: {
      cursor: 'pointer',
      color: 'var(--text-muted)',
      fontWeight: 700
    }
  }, '\u00d7'));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  tone = 'neutral',
  children,
  style
}) {
  React.useEffect(() => {
    window.lucide?.createIcons?.();
  });
  const icon = tone === 'success' ? 'check-circle' : tone === 'error' ? 'alert-circle' : 'info';
  const color = tone === 'success' ? 'var(--success)' : tone === 'error' ? 'var(--error)' : 'var(--text-primary)';
  return React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '14px 18px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid var(--border)',
      maxWidth: 360,
      ...style
    }
  }, React.createElement('i', {
    'data-lucide': icon,
    style: {
      width: 18,
      height: 18,
      color,
      flexShrink: 0
    }
  }), React.createElement('span', {
    style: {
      fontSize: 'var(--body-sm-size)',
      color: 'var(--text-primary)'
    }
  }, children));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  label,
  children,
  style
}) {
  const [open, setOpen] = React.useState(false);
  return React.createElement('span', {
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false)
  }, children, open && React.createElement('span', {
    style: {
      position: 'absolute',
      bottom: 'calc(100% + 8px)',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--graphite-900)',
      color: '#fff',
      padding: '6px 10px',
      borderRadius: 'var(--radius-sm)',
      fontSize: 'var(--caption-size)',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-md)'
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  iconLeft = null,
  children,
  onClick,
  style
}) {
  const sizes = {
    sm: {
      padding: '8px 14px',
      fontSize: 'var(--body-sm-size)'
    },
    md: {
      padding: '11px 20px',
      fontSize: 'var(--body-md-size)'
    },
    lg: {
      padding: '14px 26px',
      fontSize: 'var(--body-lg-size)'
    }
  };
  const variants = {
    primary: {
      background: disabled ? 'var(--graphite-300)' : 'var(--accent)',
      color: 'var(--text-on-accent)',
      border: '1px solid transparent'
    },
    secondary: {
      background: 'transparent',
      color: disabled ? 'var(--graphite-300)' : 'var(--text-primary)',
      border: '1px solid var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: disabled ? 'var(--graphite-300)' : 'var(--text-primary)',
      border: '1px solid transparent'
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverBg = variant === 'primary' ? 'var(--accent-hover)' : variant === 'secondary' ? 'var(--surface-subtle)' : 'var(--surface-subtle)';
  return React.createElement('button', {
    disabled,
    onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background var(--duration-fast) var(--ease-standard), color var(--duration-fast)',
      ...sizes[size],
      ...variants[variant],
      ...(hover && !disabled ? {
        background: hoverBg
      } : {}),
      ...style
    }
  }, iconLeft, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  onChange,
  style
}) {
  return React.createElement('label', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: 'var(--body-md-size)',
      color: 'var(--text-primary)',
      cursor: 'pointer',
      ...style
    }
  }, React.createElement('input', {
    type: 'checkbox',
    checked,
    onChange,
    style: {
      width: 18,
      height: 18,
      accentColor: 'var(--accent)'
    }
  }), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function IconButton({
  icon = 'x',
  size = 36,
  label,
  onClick,
  style
}) {
  React.useEffect(() => {
    window.lucide?.createIcons?.();
  });
  return React.createElement('button', {
    onClick,
    'aria-label': label,
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-strong)',
      background: 'var(--surface-card)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--text-primary)',
      ...style
    }
  }, React.createElement('i', {
    'data-lucide': icon,
    style: {
      width: 16,
      height: 16
    }
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  error,
  value,
  onChange,
  type = 'text',
  style
}) {
  return React.createElement('label', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, label && React.createElement('span', {
    style: {
      fontSize: 'var(--label-size)',
      fontWeight: 'var(--label-weight)',
      color: 'var(--text-secondary)'
    }
  }, label), React.createElement('input', {
    type,
    placeholder,
    value,
    onChange,
    style: {
      padding: '11px 14px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid ' + (error ? 'var(--error)' : 'var(--border-strong)'),
      background: 'var(--surface-card)',
      fontSize: 'var(--body-md-size)',
      color: 'var(--text-primary)',
      outline: 'none'
    }
  }), error && React.createElement('span', {
    style: {
      fontSize: 'var(--body-sm-size)',
      color: 'var(--error)'
    }
  }, error));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  label,
  checked,
  onChange,
  name,
  style
}) {
  return React.createElement('label', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: 'var(--body-md-size)',
      color: 'var(--text-primary)',
      cursor: 'pointer',
      ...style
    }
  }, React.createElement('input', {
    type: 'radio',
    name,
    checked,
    onChange,
    style: {
      width: 18,
      height: 18,
      accentColor: 'var(--accent)'
    }
  }), label);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  onChange,
  style
}) {
  return React.createElement('label', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, label && React.createElement('span', {
    style: {
      fontSize: 'var(--label-size)',
      fontWeight: 'var(--label-weight)',
      color: 'var(--text-secondary)'
    }
  }, label), React.createElement('select', {
    value,
    onChange,
    style: {
      padding: '11px 14px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-strong)',
      background: 'var(--surface-card)',
      fontSize: 'var(--body-md-size)',
      color: 'var(--text-primary)'
    }
  }, options.map(o => React.createElement('option', {
    key: o,
    value: o
  }, o))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked = false,
  onChange,
  label,
  style
}) {
  return React.createElement('label', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      ...style
    }
  }, React.createElement('span', {
    onClick: () => onChange && onChange(!checked),
    style: {
      width: 40,
      height: 24,
      borderRadius: 'var(--radius-full)',
      background: checked ? 'var(--accent)' : 'var(--border-strong)',
      position: 'relative',
      transition: 'background var(--duration-standard) var(--ease-standard)'
    }
  }, React.createElement('span', {
    style: {
      position: 'absolute',
      top: 3,
      left: checked ? 19 : 3,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: '#fff',
      transition: 'left var(--duration-standard) var(--ease-standard)',
      boxShadow: 'var(--shadow-sm)'
    }
  })), label && React.createElement('span', {
    style: {
      fontSize: 'var(--body-md-size)',
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  active,
  onChange,
  style
}) {
  const [sel, setSel] = React.useState(active ?? items[0]);
  const pick = v => {
    setSel(v);
    onChange && onChange(v);
  };
  return React.createElement('div', {
    style: {
      display: 'flex',
      gap: '4px',
      borderBottom: '1px solid var(--border)',
      ...style
    }
  }, items.map(item => React.createElement('button', {
    key: item,
    onClick: () => pick(item),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '10px 4px',
      marginRight: '20px',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--body-md-size)',
      fontWeight: sel === item ? 600 : 400,
      color: sel === item ? 'var(--text-primary)' : 'var(--text-muted)',
      borderBottom: sel === item ? '2px solid var(--accent)' : '2px solid transparent'
    }
  }, item)));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function Card({
  children,
  padding = '24px',
  style
}) {
  return React.createElement('div', {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding,
      boxShadow: 'var(--shadow-sm)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  title,
  children,
  onClose,
  style
}) {
  React.useEffect(() => {
    window.lucide?.createIcons?.();
  });
  if (!open) return null;
  return React.createElement('div', {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(35,35,32,0.32)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }
  }, React.createElement('div', {
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      padding: '28px',
      width: 420,
      boxShadow: 'var(--shadow-lg)',
      ...style
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    }
  }, React.createElement('h3', {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--h4-size)',
      color: 'var(--text-primary)'
    }
  }, title), onClose && React.createElement('i', {
    'data-lucide': 'x',
    onClick: onClose,
    style: {
      cursor: 'pointer',
      width: 18,
      height: 18,
      color: 'var(--text-muted)'
    }
  })), children));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Dialog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Hero.jsx
try { (() => {
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '96px 64px 64px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(window.AgentomeDesignSystem_92e408.Badge, {
    tone: "accent"
  }, "The Home of Digital Employees"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--display-1-size)',
      lineHeight: 'var(--display-1-line)',
      fontWeight: 'var(--display-1-weight)',
      letterSpacing: 'var(--display-1-tracking)',
      color: 'var(--text-primary)',
      maxWidth: 840,
      margin: 0
    }
  }, "Las mejores empresas no tendr\xE1n m\xE1s empleados. Tendr\xE1n mejores equipos."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--body-lg-size)',
      color: 'var(--text-secondary)',
      maxWidth: 600,
      margin: 0
    }
  }, "Incorporamos empleados digitales que trabajan junto a tu equipo, 24/7. Nada de prompts, nada de configurar herramientas."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(window.AgentomeDesignSystem_92e408.Button, {
    variant: "primary",
    size: "lg"
  }, "Habla con un empleado digital"), /*#__PURE__*/React.createElement(window.AgentomeDesignSystem_92e408.Button, {
    variant: "secondary",
    size: "lg"
  }, "Ver los 7 roles")));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Nav.jsx
try { (() => {
function Nav() {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 64px',
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 20,
      color: 'var(--text-primary)'
    }
  }, "Agentome"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      fontSize: 15,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Roles"), /*#__PURE__*/React.createElement("span", null, "Precios"), /*#__PURE__*/React.createElement("span", null, "Casos")), /*#__PURE__*/React.createElement(window.AgentomeDesignSystem_92e408.Button, {
    variant: "primary",
    size: "sm"
  }, "Reservar demo"));
}
window.Nav = Nav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/ProductSection.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProductSection() {
  const {
    EmployeeCard
  } = window.AgentomeDesignSystem_92e408;
  const employees = [{
    name: 'Sofía',
    role: 'sdr',
    roleLabel: 'SDR digital',
    status: 'Activo',
    duties: ['Cualifica leads entrantes', 'Agenda reuniones en tu calendario', 'Sigue hasta la respuesta'],
    frees: '14h/semana'
  }, {
    name: 'Marcos',
    role: 'cfo',
    roleLabel: 'CFO digital',
    status: 'En formación',
    duties: ['Concilia bancos a diario', 'Prepara el cierre mensual'],
    frees: '9h/semana'
  }, {
    name: 'Elena',
    role: 'cs',
    roleLabel: 'Customer Success digital',
    status: 'Activo',
    duties: ['Responde tickets recurrentes', 'Escala solo lo importante'],
    frees: '11h/semana'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface)',
      padding: '80px 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--h1-size)',
      fontWeight: 'var(--h1-weight)',
      color: 'var(--text-primary)',
      margin: '0 0 12px',
      textAlign: 'center'
    }
  }, "Elige qui\xE9n necesitas"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--body-lg-size)',
      color: 'var(--text-secondary)',
      textAlign: 'center',
      margin: '0 0 48px'
    }
  }, "Cada empleado digital cumple una misi\xF3n: m\xE1s ingresos, menos costes, m\xE1s tiempo, menos errores."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, employees.map(e => /*#__PURE__*/React.createElement(EmployeeCard, _extends({
    key: e.name
  }, e))))));
}
window.ProductSection = ProductSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/ProductSection.jsx", error: String((e && e.message) || e) }); }

__ds_ns.EmployeeCard = __ds_scope.EmployeeCard;

__ds_ns.RoleIcon = __ds_scope.RoleIcon;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Dialog = __ds_scope.Dialog;

})();
