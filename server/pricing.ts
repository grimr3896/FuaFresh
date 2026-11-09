export interface ServiceDefinition {
  id: string;
  name: string;
  basePrice: number;
}

export const TRUSTED_SERVICES: Record<string, ServiceDefinition> = {
  'home-cleaning': {
    id: 'home-cleaning',
    name: 'Home Cleaning',
    basePrice: 800,
  },
  'laundry': {
    id: 'laundry',
    name: 'Laundry (Wash, Dry & Fold)',
    basePrice: 350,
  },
  'deep-cleaning': {
    id: 'deep-cleaning',
    name: 'Deep Cleaning',
    basePrice: 1000,
  },
  'ironing': {
    id: 'ironing',
    name: 'Ironing',
    basePrice: 1000,
  },
  'custom': {
    id: 'custom',
    name: 'Custom Service',
    basePrice: 2500,
  },
};

export const HOME_SIZE_MULTIPLIERS: Record<string, number> = {
  'Studio': 0.8,
  '1 BR': 0.9,
  '2 BR': 1.0,
  '3 BR': 1.25,
  '4+ BR': 1.5,
};

export const TRUSTED_EXTRAS_PRICING: Record<string, number> = {
  // Home cleaning extras
  'Wash & Fold Basket of Clothes': 350,
  'Iron & Steam Clothes (10 Garments)': 350,
  'Fold & Organize Wardrobe Clothes': 250,
  'Degrease Kitchen Stovetop & Hood': 400,
  'Degrease Kitchen Stovetop': 400,
  'Inside Refrigerator Deep Scrub': 450,
  'Sanitize Balcony & Balustrades': 400,
  'Interior Window Pane Polish': 350,

  // Laundry extras
  'Everyday Clothes Wash & Line Dry (Full Basket)': 350,
  'Delicate Clothes & Handwash Care': 400,
  'Steam Iron & Hang Washed Clothes': 350,
  'Bed Linen & Towels Hot Wash': 400,
  'Curtains & Heavy Drapes Wash': 600,
  'Duvet & Comforter Deep Wash': 500,

  // Deep cleaning extras
  'Sanitize & Organize Wardrobe Clothes': 400,
  'Oven & Range Interior Restoration': 600,
  'Tile Grout Power Scrub Machine': 600,
  'Balcony Jet Scrubbing': 500,
  'Full Chandelier Dusting': 450,

  // Ironing extras
  'Everyday Clothes Pressing (10 pcs)': 350,
  'Executive Business Clothes & Shirts (10 pcs)': 400,
  'Traditional Wear & Delicate Clothes': 450,
  'Bedsheet & Duvet Crisp Pressing': 400,

  // Custom extras
  'Full Basket Clothes Wash, Dry & Fold': 450,
  'Clothes Steam Ironing & Wardrobe Hanging': 400,
  'Combined Laundry + Kitchen Deep Wash': 600,
  'Full Pantry & Wardrobe Reorganization': 550,
  'Patio & Compound Sweep': 400,
};

export interface PricingCalculationResult {
  serviceId: string;
  serviceName: string;
  homeSize: string;
  basePrice: number;
  selectedExtras: string[];
  extrasTotal: number;
  ecoProducts: boolean;
  ecoFee: number;
  totalPrice: number;
}

/**
 * Calculates trusted order price entirely on the server.
 * Never trusts prices provided by the client.
 */
export function calculateOrderPricing(params: {
  serviceId: string;
  homeSize: string;
  selectedExtras?: string[];
  ecoProducts?: boolean;
}): PricingCalculationResult {
  const service = TRUSTED_SERVICES[params.serviceId] || TRUSTED_SERVICES['home-cleaning'];
  const multiplier = HOME_SIZE_MULTIPLIERS[params.homeSize] ?? 1.0;
  const basePrice = Math.round(service.basePrice * multiplier);

  const extras = Array.isArray(params.selectedExtras) ? params.selectedExtras : [];
  let extrasTotal = 0;
  for (const extraName of extras) {
    if (typeof extraName === 'string') {
      const price = TRUSTED_EXTRAS_PRICING[extraName] ?? 400;
      extrasTotal += price;
    }
  }

  const ecoFee = params.ecoProducts ? 250 : 0;
  const totalPrice = basePrice + extrasTotal + ecoFee;

  return {
    serviceId: service.id,
    serviceName: service.name,
    homeSize: params.homeSize,
    basePrice,
    selectedExtras: extras,
    extrasTotal,
    ecoProducts: Boolean(params.ecoProducts),
    ecoFee,
    totalPrice,
  };
}
