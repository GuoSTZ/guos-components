import React from 'react';

type CardMember = {
  name: string;
  avatar?: string;
  color?: string;
};

type CardProps = {
  name?: string;
  createdAt?: string;
  totalAmount?: number;
  currency?: string;
  members?: CardMember[];
  style?: React.CSSProperties;
};

const formatAmount = (amount: number, currency: string) => {
  return `${currency}${amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const defaultMembers: CardMember[] = [
  { name: '林', color: '#111827' },
  { name: '苏', color: '#374151' },
  { name: '周', color: '#6b7280' },
  { name: '安', color: '#9ca3af' },
];

const getMemberLabel = (name: string) => {
  return name.trim().slice(0, 1).toUpperCase();
};

const Card = React.memo(
  ({
    name = '日常生活账本',
    createdAt = '创建于 2026-05-08',
    totalAmount = 18320.56,
    currency = '¥',
    members = defaultMembers,
    style,
  }: CardProps) => {
    const amountLabel = formatAmount(totalAmount, currency);
    const visibleMembers = members.slice(0, 4);
    const hiddenCount = Math.max(members.length - visibleMembers.length, 0);

    return (
      <section
        style={{
          position: 'relative',
          boxSizing: 'border-box',
          width: '100%',
          minHeight: 168,
          padding: 18,
          fontFamily:
            '"SF Pro Display", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
          color: '#111827',
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, #f8fafc 100%)',
          border: '1px solid rgba(17, 24, 39, 0.08)',
          borderRadius: 22,
          boxShadow:
            '0 10px 30px rgba(15, 23, 42, 0.06), 0 2px 10px rgba(15, 23, 42, 0.03)',
          overflow: 'hidden',
          ...style,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -28,
            right: -8,
            width: 112,
            height: 112,
            background:
              'radial-gradient(circle at center, rgba(17, 24, 39, 0.1), rgba(17, 24, 39, 0))',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 18,
            left: 18,
            width: 44,
            height: 4,
            background: '#111827',
            borderRadius: 999,
            opacity: 0.08,
          }}
        />

        <section
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 24,
                marginBottom: 12,
                padding: '0 8px',
                fontSize: 11,
                fontWeight: 600,
                lineHeight: '16px',
                letterSpacing: '0.08em',
                color: '#4b5563',
                background: 'rgba(255, 255, 255, 0.72)',
                border: '1px solid rgba(17, 24, 39, 0.06)',
                borderRadius: 999,
                backdropFilter: 'blur(8px)',
                textTransform: 'uppercase',
              }}
            >
              Ledger
            </div>
            <h3
              style={{
                margin: 0,
                marginBottom: 8,
                fontSize: 20,
                fontWeight: 700,
                lineHeight: '28px',
                letterSpacing: '-0.03em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {name}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 500,
                lineHeight: '18px',
                color: '#6b7280',
              }}
            >
              {createdAt}
            </p>
          </div>

          <div
            style={{
              flexShrink: 0,
              padding: '10px 12px',
              textAlign: 'right',
              background: 'rgba(255, 255, 255, 0.72)',
              border: '1px solid rgba(17, 24, 39, 0.06)',
              borderRadius: 16,
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              style={{
                marginBottom: 4,
                fontSize: 11,
                fontWeight: 500,
                lineHeight: '16px',
                color: '#6b7280',
              }}
            >
              总金额
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                lineHeight: '28px',
                letterSpacing: '-0.04em',
                color: '#111827',
              }}
            >
              {amountLabel}
            </div>
          </div>
        </section>

        <section
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingTop: 16,
            borderTop: '1px solid rgba(17, 24, 39, 0.08)',
          }}
        >
          <div
            style={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <div
              style={{
                marginBottom: 6,
                fontSize: 12,
                fontWeight: 500,
                lineHeight: '18px',
                color: '#6b7280',
              }}
            >
              参与人员
            </div>
            <div
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                lineHeight: '22px',
                color: '#111827',
              }}
            >
              共 {members.length} 人
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingLeft: 8,
            }}
          >
            {visibleMembers.map((member, index) => {
              const label = getMemberLabel(member.name);

              return (
                <span
                  key={`${member.name}-${index}`}
                  style={{
                    position: 'relative',
                    zIndex: index + 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 34,
                    height: 34,
                    marginLeft: index === 0 ? 0 : -9,
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: '18px',
                    color: '#ffffff',
                    background: member.avatar
                      ? '#e5e7eb'
                      : member.color || '#111827',
                    border: '2px solid #ffffff',
                    borderRadius: '50%',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)',
                    overflow: 'hidden',
                  }}
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    label
                  )}
                </span>
              );
            })}
            {hiddenCount > 0 ? (
              <span
                style={{
                  position: 'relative',
                  zIndex: visibleMembers.length + 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 34,
                  height: 34,
                  marginLeft: visibleMembers.length === 0 ? 0 : -10,
                  fontSize: 11,
                  fontWeight: 600,
                  lineHeight: '16px',
                  color: '#374151',
                  background: '#f3f4f6',
                  border: '2px solid #ffffff',
                  borderRadius: '50%',
                }}
              >
                +{hiddenCount}
              </span>
            ) : null}
          </div>
        </section>
      </section>
    );
  },
);

export type { CardMember, CardProps };
export default Card;
