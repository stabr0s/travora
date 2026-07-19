import type {
  BudgetParticipantOption,
  BudgetSettlementCurrencySummary,
  PersistedBudgetExpense,
} from "@/features/budget/types/persisted-budget";

const EPSILON_CENTS = 1;

function toCents(amount: number) {
  return Math.round(amount * 100);
}

function fromCents(cents: number) {
  return Math.round(cents) / 100;
}

function splitCents(amountCents: number, peopleCount: number) {
  const base = Math.floor(amountCents / peopleCount);
  const remainder = amountCents - base * peopleCount;
  return Array.from({ length: peopleCount }, (_, index) => base + (index < remainder ? 1 : 0));
}

export function calculateBudgetSettlements(
  expenses: PersistedBudgetExpense[],
  participants: BudgetParticipantOption[],
): BudgetSettlementCurrencySummary[] {
  const participantMap = new Map(participants.map((participant) => [participant.userId, participant]));
  const currencies = new Map<string, {
    paid: Map<string, number>;
    owed: Map<string, number>;
    unassignedExpenseCount: number;
    assignedExpenseCount: number;
  }>();

  expenses.forEach((expense) => {
    const currency = (expense.currency || "EUR").toUpperCase();
    const summary = currencies.get(currency) || {
      paid: new Map<string, number>(),
      owed: new Map<string, number>(),
      unassignedExpenseCount: 0,
      assignedExpenseCount: 0,
    };
    currencies.set(currency, summary);

    const splitIds = expense.split_between_user_ids || [];
    const validSplitIds = splitIds.filter((id) => participantMap.has(id));
    const payerId = expense.paid_by_user_id;

    if (!payerId || !participantMap.has(payerId) || !validSplitIds.length
      || validSplitIds.length !== splitIds.length) {
      summary.unassignedExpenseCount += 1;
      return;
    }

    const amountCents = toCents(expense.amount);
    const shares = splitCents(amountCents, validSplitIds.length);

    summary.paid.set(payerId, (summary.paid.get(payerId) || 0) + amountCents);
    validSplitIds.forEach((userId, index) => {
      summary.owed.set(userId, (summary.owed.get(userId) || 0) + shares[index]);
    });
    summary.assignedExpenseCount += 1;
  });

  return Array.from(currencies, ([currency, summary]) => {
    const balances = participants.map((participant) => {
      const paid = summary.paid.get(participant.userId) || 0;
      const owed = summary.owed.get(participant.userId) || 0;
      return {
        userId: participant.userId,
        name: participant.name,
        paid: fromCents(paid),
        owed: fromCents(owed),
        balance: fromCents(paid - owed),
      };
    }).filter((balance) => balance.paid > 0 || balance.owed > 0);

    const debtors = balances
      .filter((person) => toCents(person.balance) < -EPSILON_CENTS)
      .map((person) => ({ ...person, remaining: Math.abs(toCents(person.balance)) }));
    const creditors = balances
      .filter((person) => toCents(person.balance) > EPSILON_CENTS)
      .map((person) => ({ ...person, remaining: toCents(person.balance) }));
    const suggestions = [];

    let debtorIndex = 0;
    let creditorIndex = 0;
    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
      const debtor = debtors[debtorIndex];
      const creditor = creditors[creditorIndex];
      const amount = Math.min(debtor.remaining, creditor.remaining);

      if (amount > EPSILON_CENTS) {
        suggestions.push({
          fromUserId: debtor.userId,
          fromName: debtor.name,
          toUserId: creditor.userId,
          toName: creditor.name,
          amount: fromCents(amount),
        });
      }

      debtor.remaining -= amount;
      creditor.remaining -= amount;
      if (debtor.remaining <= EPSILON_CENTS) debtorIndex += 1;
      if (creditor.remaining <= EPSILON_CENTS) creditorIndex += 1;
    }

    return {
      currency,
      balances,
      suggestions,
      assignedExpenseCount: summary.assignedExpenseCount,
      unassignedExpenseCount: summary.unassignedExpenseCount,
    };
  });
}
