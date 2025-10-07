import { useEffect, useState } from 'react';
import { metricsAPI } from '../../services/metricsApi';
import { MetricCard } from '../../components/MetricCard';
import type { YoYExpensesData, MoMExpensesData, YoYIncomeData, MoMIncomeData, CoverageData } from '../../types/metrics';

const MetricsDashboard = () => {
  const [yoyExpenses, setYoyExpenses] = useState<YoYExpensesData | null>(null);
  const [momExpenses, setMomExpenses] = useState<MoMExpensesData | null>(null);
  const [yoyIncome, setYoyIncome] = useState<YoYIncomeData | null>(null);
  const [momIncome, setMomIncome] = useState<MoMIncomeData | null>(null);
  const [coverage, setCoverage] = useState<CoverageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [yoyExp, momExp, yoyInc, momInc, cov] = await Promise.all([
        metricsAPI.getYoYExpenses(),
        metricsAPI.getMoMExpenses(),
        metricsAPI.getYoYIncome(),
        metricsAPI.getMoMIncome(),
        metricsAPI.getCoverage()
      ]);

      setYoyExpenses(yoyExp);
      setMomExpenses(momExp);
      setYoyIncome(yoyInc);
      setMomIncome(momInc);
      setCoverage(cov);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors du chargement des métriques');
      console.error('Error loading metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="dashboard error">
        <h1>Tableau de Bord</h1>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadMetrics}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Métriques Financières</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Évolution Annuelle Dépenses (YoY)"
          value={yoyExpenses?.periode_cible.total || 0}
          variation={yoyExpenses?.variation}
          affichage={yoyExpenses?.affichage || { couleur: 'gray', message: '' }}
          isCurrency
          loading={loading}
        />

        <MetricCard
          title="Évolution Mensuelle Dépenses (MoM)"
          value={momExpenses?.periode_cible.total || 0}
          variation={momExpenses?.variation}
          affichage={momExpenses?.affichage || { couleur: 'gray', message: '' }}
          isCurrency
          loading={loading}
        />

        <MetricCard
          title="Évolution Annuelle Revenus (YoY)"
          value={yoyIncome?.periode_cible.total || 0}
          variation={yoyIncome?.variation}
          affichage={yoyIncome?.affichage || { couleur: 'gray', message: '' }}
          isCurrency
          loading={loading}
        />

        <MetricCard
          title="Évolution Mensuelle Revenus (MoM)"
          value={momIncome?.periode_cible.total || 0}
          variation={momIncome?.variation}
          affichage={momIncome?.affichage || { couleur: 'gray', message: '' }}
          isCurrency
          loading={loading}
        />

        <MetricCard
          title="Taux de Couverture"
          value={coverage?.taux_couverture || 0}
          affichage={coverage?.affichage || { couleur: 'gray', message: '' }}
          isPercentage
          loading={loading}
        />
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Dernière mise à jour: {coverage?.mise_a_jour ? new Date(coverage.mise_a_jour).toLocaleString('fr-FR') : '-'}</p>
      </div>
    </div>
  );
};

export default MetricsDashboard;
