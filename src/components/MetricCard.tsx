import { formatCurrency, formatPercentage, getArrowIcon } from '../utils/formatters';

interface MetricCardProps {
  title: string;
  value: number;
  variation?: {
    montant: number;
    pourcentage: number;
    direction: 'up' | 'down' | 'stable';
  };
  affichage: {
    couleur: string;
    message: string;
  };
  isCurrency?: boolean;
  isPercentage?: boolean;
  loading?: boolean;
}

const getColorClasses = (color: string) => {
  const colorMap: Record<string, string> = {
    'green': 'bg-green-50 border-green-200',
    'green-light': 'bg-green-50 border-green-100',
    'green-dark': 'bg-green-100 border-green-300',
    'red': 'bg-red-50 border-red-200',
    'orange': 'bg-orange-50 border-orange-200',
    'gray': 'bg-gray-50 border-gray-200'
  };
  return colorMap[color] || colorMap['gray'];
};

const getTextColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    'green': 'text-green-700',
    'green-light': 'text-green-600',
    'green-dark': 'text-green-800',
    'red': 'text-red-700',
    'orange': 'text-orange-700',
    'gray': 'text-gray-700'
  };
  return colorMap[color] || colorMap['gray'];
};

export const MetricCard = ({
  title,
  value,
  variation,
  affichage,
  isCurrency = false,
  isPercentage = false,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  const formattedValue = isCurrency
    ? formatCurrency(value)
    : isPercentage
    ? value.toFixed(1) + '%'
    : value.toString();

  return (
    <div className={`bg-white rounded-lg shadow border-2 p-6 transition-all hover:shadow-lg ${getColorClasses(affichage.couleur)}`}>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{title}</h3>
      <div className={`text-3xl font-bold mb-2 ${getTextColorClass(affichage.couleur)}`}>{formattedValue}</div>

      {variation && (
        <div className="flex items-center space-x-2 mb-3">
          <span className={`text-lg ${getTextColorClass(affichage.couleur)}`}>{getArrowIcon(variation.direction)}</span>
          <span className={`text-sm font-medium ${getTextColorClass(affichage.couleur)}`}>
            {formatPercentage(variation.pourcentage)}
          </span>
          {isCurrency && (
            <span className="text-sm text-gray-600">
              ({formatCurrency(Math.abs(variation.montant))})
            </span>
          )}
        </div>
      )}

      <p className="text-sm text-gray-600">{affichage.message}</p>
    </div>
  );
};
