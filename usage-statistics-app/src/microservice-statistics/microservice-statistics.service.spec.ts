import { MicroserviceStatisticsService } from './microservice-statistics.service';

describe('MicroserviceStatisticsService memory figures', () => {
  // 5 GiB running all 30 days of September: the summary reports MB summed over the days
  const memoryMb = 5 * 1073.74 * 30;

  function serviceWith(usedBy: any[]) {
    const commonService: any = { getCurrentTenantSummary: vi.fn().mockResolvedValue({ resources: { usedBy } }) };
    return new MicroserviceStatisticsService(commonService, null as any);
  }

  it('reports the real average memory in GiB next to the memory-based CCU value', async () => {
    const service = serviceWith([{ name: 'my-service', cpu: 0, memory: memoryMb, cause: 'Owner' }]);

    const [row] = await service.getMonthlyMicroserviceProdCategoryMap(new Date(2026, 8, 1));

    expect(row.avgMemoryGiB).toBe('5.00');
    expect(row.avgMemory).toBe('1.25'); // 5 GiB / 4 GiB per CCU
    expect(service.microserviceStatisticsDataStore.avgMEMGiB).toBe('5.00');
    expect(service.microserviceStatisticsDataStore.avgMEM).toBe('1.25');
  });
});
