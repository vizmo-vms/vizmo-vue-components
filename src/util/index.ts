
export function getInitials(name: string) {
    const names = name.split(' ');
    names.splice(2);
    return names.map(n => n.charAt(0).toUpperCase()).join('');
  }
  