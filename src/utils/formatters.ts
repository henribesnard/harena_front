// Utilitaires de formatage

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  const sign = value >= 0 ? '+' : '';
  return sign + value.toFixed(decimals) + '%';
}

export function getColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    'green': 'text-green-600 bg-green-50',
    'green-light': 'text-green-500 bg-green-50',
    'green-dark': 'text-green-700 bg-green-100',
    'red': 'text-red-600 bg-red-50',
    'orange': 'text-orange-600 bg-orange-50',
    'gray': 'text-gray-600 bg-gray-50'
  };
  return colorMap[color] || colorMap['gray'];
}

export function getArrowIcon(direction: 'up' | 'down' | 'stable'): string {
  const icons: Record<string, string> = {
    'up': '↑',
    'down': '↓',
    'stable': '→'
  };
  return icons[direction] || icons['stable'];
}
