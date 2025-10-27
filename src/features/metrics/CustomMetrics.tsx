import { useState } from 'react';
import { coreMetricsApi } from '../../services/api/coreMetricsApi';
import { MetricCard } from '../../components/MetricCard';
import type { YoYQueryParams, MoMQueryParams, CoverageQueryParams } from '../../types/metrics';

const CustomMetrics = () => {
  const [metricType, setMetricType] = useState<'yoy_expenses' | 'mom_expenses' | 'yoy_income' | 'mom_income' | 'coverage'>('yoy_expenses');
  const [params, setParams] = useState<any>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let data;
      switch (metricType) {
        case 'yoy_expenses':
          data = await coreMetricsApi.getYoYExpenses();
          break;
        case 'mom_expenses':
          data = await coreMetricsApi.getMoMExpenses();
          break;
        case 'yoy_income':
          data = await coreMetricsApi.getYoYIncome();
          break;
        case 'mom_income':
          data = await coreMetricsApi.getMoMIncome();
          break;
        case 'coverage':
          data = await coreMetricsApi.getCoverage();
          break;
      }
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de la requête');
    } finally {
      setLoading(false);
    }
  };

  const updateParam = (key: string, value: string) => {
    setParams((prev: any) => ({
      ...prev,
      [key]: value ? (key.includes('annee') || key.includes('mois') ? parseInt(value) : value) : undefined
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Métriques Personnalisées</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Type de métrique:</label>
          <select
            value={metricType}
            onChange={(e) => setMetricType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="yoy_expenses">YoY Dépenses</option>
            <option value="mom_expenses">MoM Dépenses</option>
            <option value="yoy_income">YoY Revenus</option>
            <option value="mom_income">MoM Revenus</option>
            <option value="coverage">Taux de Couverture</option>
          </select>
        </div>

        {(metricType === 'yoy_expenses' || metricType === 'yoy_income') && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Année talon:</label>
              <input type="number" placeholder="2024" onChange={(e) => updateParam('annee_talon', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Année cible:</label>
              <input type="number" placeholder="2025" onChange={(e) => updateParam('annee_cible', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie (optionnel):</label>
              <input type="text" placeholder="Alimentation" onChange={(e) => updateParam('categorie', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Marchand (optionnel):</label>
              <input type="text" placeholder="Lidl" onChange={(e) => updateParam('marchand', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>
          </>
        )}

        {(metricType === 'mom_expenses' || metricType === 'mom_income') && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mois talon (1-12):</label>
              <input type="number" min="1" max="12" placeholder="1" onChange={(e) => updateParam('mois_talon', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Année talon:</label>
              <input type="number" placeholder="2024" onChange={(e) => updateParam('annee_talon', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mois cible (1-12):</label>
              <input type="number" min="1" max="12" placeholder="2" onChange={(e) => updateParam('mois_cible', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Année cible:</label>
              <input type="number" placeholder="2024" onChange={(e) => updateParam('annee_cible', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie (optionnel):</label>
              <input type="text" placeholder="Transport" onChange={(e) => updateParam('categorie', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Marchand (optionnel):</label>
              <input type="text" placeholder="Uber" onChange={(e) => updateParam('marchand', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>
          </>
        )}

        {metricType === 'coverage' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mois (1-12):</label>
              <input type="number" min="1" max="12" placeholder="3" onChange={(e) => updateParam('mois', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Année:</label>
              <input type="number" placeholder="2025" onChange={(e) => updateParam('annee', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-primary text-white px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 font-medium"
        >
          {loading ? 'Chargement...' : 'Afficher la métrique'}
        </button>
      </form>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      {result && (
        <div className="space-y-6">
          <MetricCard
            title={metricType === 'coverage' ? 'Taux de Couverture' : metricType.includes('yoy') ? 'Évolution Annuelle' : 'Évolution Mensuelle'}
            value={result.taux_couverture !== undefined ? result.taux_couverture : result.periode_cible?.total || 0}
            variation={result.variation}
            affichage={result.affichage}
            isCurrency={metricType !== 'coverage'}
            isPercentage={metricType === 'coverage'}
          />

          <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm text-gray-700">{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomMetrics;
