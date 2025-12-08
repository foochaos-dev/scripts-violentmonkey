export function UserLabel({ username, role = '' }: { username: string; role?: 'sender' | 'receiver' | '' }) {
  return (
    <span class={`userLabelBBW ${role}`} data-username={username}>
      {username}
    </span>
  );
}
