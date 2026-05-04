'use client';

export function FormField({ label, required, hint, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
      <label style={{
        fontSize: '0.78rem',
        fontWeight: '600',
        color: '#374151',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {label}
        {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize: '0.76rem', color: '#9CA3AF', margin: 0 }}>{hint}</p>}
      {error && <p style={{ fontSize: '0.76rem', color: '#EF4444', margin: 0 }}>⚠ {error}</p>}
    </div>
  );
}

export const inputStyle = {
  width: '100%',
  border: '1.5px solid #E5E7EB',
  borderRadius: '8px',
  padding: '11px 14px',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  color: '#111827',
  background: '#FAFAFA',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
  boxSizing: 'border-box'
};

export const inputFocusStyle = {
  borderColor: '#E8A020',
  background: '#FFFFFF',
  boxShadow: '0 0 0 3px rgba(232, 160, 32, 0.12)'
};
