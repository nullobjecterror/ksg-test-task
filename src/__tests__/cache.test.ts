import axios from 'axios';

import cache from '../utils/cache';
import { jest } from '@jest/globals';
import { getItems } from '../services/itemsService';

describe('getItems', () => {
  const mockItemsResponse = [
    {
      market_hash_name: 'Item 1',
      currency: 'USD',
      suggested_price: 100,
      item_page: 'item_page_1',
      market_page: 'market_page_1',
      min_price: 90,
      max_price: 110,
      mean_price: 100,
      median_price: 100,
      quantity: 10,
      created_at: Date.now(),
      updated_at: Date.now(),
    },
    {
      market_hash_name: 'Item 2',
      currency: 'USD',
      suggested_price: 200,
      item_page: 'item_page_2',
      market_page: 'market_page_2',
      min_price: 180,
      max_price: 220,
      mean_price: 200,
      median_price: 200,
      quantity: 5,
      created_at: Date.now(),
      updated_at: Date.now(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return data from cache on subsequent requests within cache TTL', async () => {
    cache.set('items', mockItemsResponse, 600);

    const response = await getItems();
    expect(response).toEqual(mockItemsResponse);
  });

  it('should make a new API request and cache the response', async () => {
    jest.spyOn(cache, 'get').mockReturnValueOnce(null); // No cache initially
    const cacheSetSpy = jest.spyOn(cache, 'set');

    jest
      .spyOn(axios, 'get')
      .mockResolvedValueOnce(Promise.resolve({ data: mockItemsResponse }));
    jest
      .spyOn(axios, 'get')
      .mockResolvedValueOnce(Promise.resolve({ data: mockItemsResponse }));

    const response = await getItems();
    expect(response).toEqual([
      expect.objectContaining({
        marketHashName: mockItemsResponse[0].market_hash_name,
      }),
      expect.objectContaining({
        marketHashName: mockItemsResponse[1].market_hash_name,
      }),
    ]);
    expect(axios.get).toHaveBeenCalledTimes(2); // Called twice for tradable and non-tradable
    expect(cacheSetSpy).toHaveBeenCalledWith(
      expect.any(String),
      [
        expect.objectContaining({
          marketHashName: mockItemsResponse[0].market_hash_name,
        }),
        expect.objectContaining({
          marketHashName: mockItemsResponse[1].market_hash_name,
        }),
      ],
      expect.any(Number)
    ); // Cache is set
  });
});
