import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parsePersistedDemoState,
  serializeDemoState,
} from '../src/lib/demo-persistence.ts';

function legacyState() {
  return {
    balances: { BTC: 120, ETH: 0, SOL: 0, EUR: 50_000 },
    transactions: [
      {
        id: 'demo-buy-1',
        type: 'buy',
        assetSymbol: 'BTC',
        quantityAtomic: 120,
        amountEurMinor: 5_000,
        feeEurMinor: 50,
        status: 'Completed · demo',
        reference: 'CKS-DEMO-EXAMPLE',
        createdAt: '2026-01-01T12:00:00.000Z',
        note: 'Test purchase',
        ledgerEntries: [
          {
            id: 'forged',
            assetSymbol: 'BTC',
            account: 'Customer BTC balance',
            side: 'credit',
            quantityAtomic: 999_999,
          },
        ],
      },
    ],
    hiddenBalances: false,
    displayCurrency: 'EUR',
    cardFrozen: false,
  };
}

test('rejects malformed JSON and unsupported stored shapes', () => {
  assert.equal(parsePersistedDemoState('{broken').invalid, true);
  assert.equal(
    parsePersistedDemoState(JSON.stringify({ balances: {}, transactions: [] })).invalid,
    true,
  );
  assert.equal(
    parsePersistedDemoState('x'.repeat(4_000_001)).invalid,
    true,
  );
});

test('migrates the prior unversioned state and rebuilds ledger entries', () => {
  const result = parsePersistedDemoState(JSON.stringify(legacyState()));
  assert.equal(result.invalid, false);
  assert.equal(result.migrated, true);
  assert.equal(result.state.cardApplied, false);

  const transaction = result.state.transactions[0];
  assert.equal(transaction.ledgerEntries.some((entry) => entry.id === 'forged'), false);

  const totals = new Map();
  for (const entry of transaction.ledgerEntries) {
    const balance = totals.get(entry.assetSymbol) ?? { debit: 0, credit: 0 };
    balance[entry.side] += entry.quantityAtomic;
    totals.set(entry.assetSymbol, balance);
  }
  assert.deepEqual([...totals.values()], [
    { debit: 5_050, credit: 5_050 },
    { debit: 120, credit: 120 },
  ]);
});

test('round-trips the versioned format without trusting persisted journal rows', () => {
  const first = parsePersistedDemoState(JSON.stringify(legacyState())).state;
  const second = parsePersistedDemoState(serializeDemoState(first));
  assert.equal(second.invalid, false);
  assert.equal(second.migrated, false);
  assert.deepEqual(second.state.balances, first.balances);
  assert.deepEqual(second.state.transactions[0].ledgerEntries, first.transactions[0].ledgerEntries);
});

test('rejects unsafe balances, invalid currencies, and unbalanced transaction values', () => {
  const negativeBalance = legacyState();
  negativeBalance.balances.EUR = -1;
  assert.equal(parsePersistedDemoState(JSON.stringify(negativeBalance)).invalid, true);

  const invalidCurrency = legacyState();
  invalidCurrency.displayCurrency = 'JPY';
  assert.equal(parsePersistedDemoState(JSON.stringify(invalidCurrency)).invalid, true);

  const badSale = legacyState();
  badSale.transactions[0] = {
    ...badSale.transactions[0],
    type: 'sell',
    amountEurMinor: 4,
    feeEurMinor: 5,
  };
  assert.equal(parsePersistedDemoState(JSON.stringify(badSale)).invalid, true);
});
