'use client';

export default function StepIndicator({ currentStep, totalSteps = 4 }) {
  const labels = ['Basic Info', 'Images', 'Content', 'Finalize'];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      marginBottom: '36px',
      overflowX: 'auto',
      paddingBottom: '4px'
    }}>
      {labels.map((label, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isDone = step < currentStep;

        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
            {/* Step node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem',
                flexShrink: 0,
                transition: 'all 0.3s ease',
                background: isDone ? '#E8A020' : isActive ? '#0D1B2A' : '#F3F4F6',
                color: isDone ? '#0D1B2A' : isActive ? '#E8A020' : '#9CA3AF',
                border: isActive ? '2.5px solid #E8A020' : isDone ? '2.5px solid #E8A020' : '2px solid #E5E7EB',
                boxShadow: isActive ? '0 0 0 4px rgba(232,160,32,0.15)' : 'none'
              }}>
                {isDone ? '✓' : step}
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? '#0D1B2A' : isDone ? '#E8A020' : '#9CA3AF',
                whiteSpace: 'nowrap'
              }}>
                {label}
              </span>
            </div>
            {/* Connector line */}
            {step < totalSteps && (
              <div style={{
                flex: 1,
                height: '2px',
                background: isDone ? '#E8A020' : '#E5E7EB',
                margin: '0 6px',
                marginBottom: '22px',
                transition: 'background 0.3s ease'
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
