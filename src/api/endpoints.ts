export const endpoints = {
  login: '/auth/login',
  signUp: '/auth/sign-up',
  user: '/user',
  brokers: '/brokers',
  brokerMapping: '/user/broker-mapping',
  markBrokerAsConnected: '/user/mark-broker-as-connected',
  orders: '/orders',
} as const;
