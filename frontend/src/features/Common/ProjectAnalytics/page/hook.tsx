import { useLoaderData, useNavigation } from 'react-router-dom';
import type { ProjectAnalyticsData } from '../../../../routes/loaders/projectsAnalyticsLoader';

export const useProjectAnalytics = () => {
  const { total, data } = useLoaderData() as ProjectAnalyticsData;
  const navigation = useNavigation();
  const loading = navigation.state === 'loading';

  // Router handles errors via errorElement; no manual error state here
  return { loading, error: null, total, data };
};
