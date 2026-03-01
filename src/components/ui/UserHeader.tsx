import Image from "next/image";

interface UserHeaderProps {
  name?: string;
  avatar?: string;
  badge?: string;
  badgeIcon?: string;
}

export default function UserHeader({ name, avatar, badge, badgeIcon }: UserHeaderProps) {
 // const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 28,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="flex items-center gap-3">
      <Image
        src="/images/avatar.png"
        alt="User Avatar"
        width={70}
        height={50}
        className="rounded-full"
      />


  </div>
        <div>
          <h1 style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#103B40',
            marginBottom: 2,
          }}>
            Welcome, {name}
          </h1>
        </div>
      </div>

      {badge && (
        <button className="btn btn-secondary btn-sm" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}>
          {badgeIcon && <span style={{ fontSize: 17 }}>{badgeIcon}</span>}
          <span>{badge}</span>
        </button>
      )}
    </div>
  );
}
