export const initialisePaymentSheet = async (amount: number) => {
  console.log('Stripe is not configured. Skipping payment initialization for', amount);
};

export const openPaymentSheet = async () => {
  console.log('Stripe is not configured. Skipping payment flow.');
  return true;
};
