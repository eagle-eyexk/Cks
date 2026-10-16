import { z } from 'zod';

export type LedgerEntry = {
  id: string;
  assetSymbol: string;
  account: string;
  side: 'debit' | 'credit';
  quantityAtomic: number;
};

export type DemoTransaction = {
  id: string;
  type: 'buy' | 'sell' | 'send' | 'receive' | 'card';
  assetSymbol: string;
  quantityAtomic: number;
  amountEurMinor: number;
  feeEurMinor: number;
  status: string;
  reference: string;
  createdAt: string;
  note: string;
  ledgerEntries: LedgerEntry[];
};

export type DemoState = {
  balances: Record<string, number>;
  transactions: DemoTransaction[];
  hiddenBalances: boolean;
  displayCurrency: string;
  cardFrozen: boolean;
  cardApplied?: boolean;
};

const safeInteger = z.number().int().safe().nonnegative();
const positiveSafeInteger = z.number().int().safe().positive();

const storedTransactionSchema = z
  .object({
    id: z.string().min(1).max(120),
    type: z.enum(['buy', 'sell', 'send', 'receive', 'card']),
    assetSymbol: z.enum(['BTC', 'ETH', 'SOL', 'EUR']),
    quantityAtomic: positiveSafeInteger,
    amountEurMinor: positiveSafeInteger,
    feeEurMinor: safeInteger,
    status: z.string().min(1).max(80),
    reference: z.string().min(1).max(120),
    createdAt: z.string().datetime(),
    note: z.string().max(500),
  })
  .superRefine((transaction, context) => {
    if (
      ['buy', 'sell', 'card'].includes(transaction.type) &&
      !Number.isSafeInteger(transaction.amountEurMinor + transaction.feeEurMinor)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['feeEurMinor'],
        message: 'The total amount must be a safe integer.',
      });
    }

    if (
      transaction.type === 'sell' &&
      transaction.amountEurMinor < transaction.feeEurMinor
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['feeEurMinor'],
        message: 'The fee cannot exceed the sale amount.',
      });
    }

    if (
      transaction.type === 'send' &&
      transaction.assetSymbol === 'EUR' &&
      !Number.isSafeInteger(transaction.quantityAtomic + transaction.feeEurMinor)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['feeEurMinor'],
        message: 'The total amount must be a safe integer.',
      });
    }
  });

const storedDemoStateSchema = z.object({
  balances: z
    .object({
      BTC: safeInteger,
      ETH: safeInteger,
      SOL: safeInteger,
      EUR: safeInteger,
    })
    .strict(),
  transactions: z.array(storedTransactionSchema).max(5000),
  hiddenBalances: z.boolean(),
  displayCurrency: z.enum(['EUR', 'GBP', 'USD']),
  cardFrozen: z.boolean(),
  cardApplied: z.boolean().optional(),
});

const versionedDemoStateSchema = z
  .object({
    version: z.literal(2),
    state: storedDemoStateSchema,
  })
  .strict();

type StoredDemoState = z.infer<typeof storedDemoStateSchema>;

export type ParsedDemoState = {
  state: DemoState | null;
  invalid: boolean;
  migrated: boolean;
};

export function buildLedgerEntries(
  type: DemoTransaction['type'],
  symbol: string,
  quantity: number,
  amount: number,
  fee: number,
): LedgerEntry[] {
  const entries: LedgerEntry[] = [];
  const post = (
    assetSymbol: string,
    account: string,
    side: LedgerEntry['side'],
    value: number,
  ) => {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new Error('Demo ledger amounts must be non-negative safe integers.');
    }
    if (value > 0) {
      entries.push({
        id: `entry-${entries.length + 1}`,
        assetSymbol,
        account,
        side,
        quantityAtomic: value,
      });
    }
  };

  if (type === 'buy') {
    post('EUR', 'Customer EUR balance', 'debit', amount + fee);
    post('EUR', 'Demo settlement', 'credit', amount);
    post('EUR', 'Demo fee revenue', 'credit', fee);
    post(symbol, 'Demo asset inventory', 'debit', quantity);
    post(symbol, `Customer ${symbol} balance`, 'credit', quantity);
  } else if (type === 'sell') {
    post(symbol, `Customer ${symbol} balance`, 'debit', quantity);
    post(symbol, 'Demo asset inventory', 'credit', quantity);
    post('EUR', 'Demo settlement', 'debit', amount);
    post('EUR', 'Customer EUR balance', 'credit', amount - fee);
    post('EUR', 'Demo fee revenue', 'credit', fee);
  } else if (type === 'send') {
    if (symbol === 'EUR') {
      post('EUR', 'Customer EUR balance', 'debit', quantity + fee);
      post('EUR', 'Demo outbound clearing', 'credit', quantity);
      post('EUR', 'Demo fee revenue', 'credit', fee);
    } else {
      post(symbol, `Customer ${symbol} balance`, 'debit', quantity);
      post(symbol, 'Demo outbound clearing', 'credit', quantity);
      post('EUR', 'Customer EUR balance', 'debit', fee);
      post('EUR', 'Demo fee revenue', 'credit', fee);
    }
  } else if (type === 'receive') {
    post(symbol, 'Demo receive clearing', 'debit', quantity);
    post(symbol, `Customer ${symbol} balance`, 'credit', quantity);
  } else {
    post('EUR', 'Customer EUR balance', 'debit', amount + fee);
    post('EUR', 'Demo card settlement', 'credit', amount);
    post('EUR', 'Demo fee revenue', 'credit', fee);
  }

  const totals = new Map<string, { debit: number; credit: number }>();
  for (const entry of entries) {
    const total = totals.get(entry.assetSymbol) ?? { debit: 0, credit: 0 };
    total[entry.side] += entry.quantityAtomic;
    if (!Number.isSafeInteger(total[entry.side])) {
      throw new Error('Demo ledger total is outside the safe integer range.');
    }
    totals.set(entry.assetSymbol, total);
  }

  if ([...totals.values()].some((total) => total.debit !== total.credit)) {
    throw new Error('Demo ledger transaction is not balanced by asset.');
  }

  return entries;
}

function hydrateDemoState(state: StoredDemoState): DemoState {
  return {
    ...state,
    cardApplied: state.cardApplied ?? false,
    transactions: state.transactions.map((transaction) => ({
      ...transaction,
      ledgerEntries: buildLedgerEntries(
        transaction.type,
        transaction.assetSymbol,
        transaction.quantityAtomic,
        transaction.amountEurMinor,
        transaction.feeEurMinor,
      ),
    })),
  };
}

export function parsePersistedDemoState(raw: string | null): ParsedDemoState {
  if (raw === null) {
    return { state: null, invalid: false, migrated: false };
  }

  if (raw.length > 4_000_000) {
    return { state: null, invalid: true, migrated: false };
  }

  try {
    const candidate: unknown = JSON.parse(raw);
    const versioned = versionedDemoStateSchema.safeParse(candidate);
    if (versioned.success) {
      return {
        state: hydrateDemoState(versioned.data.state),
        invalid: false,
        migrated: false,
      };
    }

    // Version 1 stored the state directly, without a versioned envelope.
    const legacy = storedDemoStateSchema.safeParse(candidate);
    if (legacy.success) {
      return {
        state: hydrateDemoState(legacy.data),
        invalid: false,
        migrated: true,
      };
    }
  } catch {
    // Invalid or internally inconsistent data is rejected and replaced by the demo seed.
  }

  return { state: null, invalid: true, migrated: false };
}

export function serializeDemoState(state: DemoState): string {
  return JSON.stringify({ version: 2, state });
}
