import axios from 'axios';
import cache from '../utils/cache';

const CACHE_TTL = parseInt(process.env.CACHE_TTL || '600', 10);
const CACHE_KEY = 'items';

export type GetItemsResponseBody = {
  market_hash_name: string;
  currency: string;
  suggested_price: number;
  item_page: string;
  market_page: string;
  min_price: number;
  max_price: number;
  mean_price: number;
  median_price: number;
  quantity: number;
  created_at: number;
  updated_at: number;
}[];

export async function getItems() {
  const cachedData = cache.get(CACHE_KEY);

  if (cachedData) {
    return cachedData;
  }

  const url = `${process.env.SKINPORT_API_URL}/items`;

  const tradableUrl = `${url}?tradable=true`;
  const nonTradableUrl = `${url}?tradable=false`;

  const [tradableResponse, nonTradableResponse] = await Promise.all([
    axios.get<GetItemsResponseBody>(tradableUrl),
    axios.get<GetItemsResponseBody>(nonTradableUrl),
  ]);

  const tradableItemMinPrices = aggregateTradableMinPrices(
    tradableResponse.data
  );

  const items = mapItemsToResponse({
    nonTradableResponseData: nonTradableResponse.data,
    tradableItemMinPrices,
  });

  cache.set(CACHE_KEY, items, CACHE_TTL);
  return items;
}

function mapItemsToResponse({
  nonTradableResponseData,
  tradableItemMinPrices,
}: {
  nonTradableResponseData: GetItemsResponseBody;
  tradableItemMinPrices: Record<string, number>;
}) {
  return nonTradableResponseData.map((item) => {
    const tradableMinPrice = tradableItemMinPrices[item.market_hash_name];

    return {
      marketHashName: item.market_hash_name,
      currency: item.currency,
      suggestedPrice: item.suggested_price,
      itemPage: item.item_page,
      marketPage: item.market_page,
      nonTradableMinPrice: item.min_price,
      tradableMinPrice,
      maxPrice: item.max_price,
      meanPrice: item.mean_price,
      medianPrice: item.median_price,
      quantity: item.quantity,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  });
}

function aggregateTradableMinPrices(
  tradableResponseData: GetItemsResponseBody
) {
  return tradableResponseData.reduce<Record<string, number>>((map, el) => {
    map[el.market_hash_name] = el.min_price;
    return map;
  }, {});
}
