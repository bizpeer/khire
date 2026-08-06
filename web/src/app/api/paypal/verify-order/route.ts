import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/paypal/verify-order
 * Server-side PayPal Order verification using PayPal REST API.
 * Prevents client-side payment forgery by validating order status with PayPal servers.
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId, expectedAmount, adTier } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { verified: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_SECRET;

    if (!clientId || !clientSecret) {
      console.error('PayPal credentials not configured');
      return NextResponse.json(
        { verified: false, error: 'PayPal credentials not configured on server' },
        { status: 500 }
      );
    }

    // Step 1: Get PayPal OAuth2 access token
    const authResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!authResponse.ok) {
      // Fallback to sandbox if live fails
      const sandboxAuthResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
        body: 'grant_type=client_credentials',
      });

      if (!sandboxAuthResponse.ok) {
        return NextResponse.json(
          { verified: false, error: 'Failed to authenticate with PayPal' },
          { status: 502 }
        );
      }

      const sandboxAuthData = await sandboxAuthResponse.json();
      return await verifyOrder(sandboxAuthData.access_token, orderId, expectedAmount, true);
    }

    const authData = await authResponse.json();
    return await verifyOrder(authData.access_token, orderId, expectedAmount, false);
  } catch (error: any) {
    console.error('PayPal verification error:', error);
    return NextResponse.json(
      { verified: false, error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}

async function verifyOrder(
  accessToken: string,
  orderId: string,
  expectedAmount: number | undefined,
  isSandbox: boolean
): Promise<NextResponse> {
  const baseUrl = isSandbox
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

  // Step 2: Get order details from PayPal
  const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!orderResponse.ok) {
    return NextResponse.json(
      { verified: false, error: `PayPal order not found: ${orderId}` },
      { status: 404 }
    );
  }

  const orderData = await orderResponse.json();

  // Step 3: Verify order status
  const isCompleted = orderData.status === 'COMPLETED' || orderData.status === 'APPROVED';

  // Step 4: Verify amount if provided
  let amountMatches = true;
  if (expectedAmount && orderData.purchase_units?.[0]?.amount?.value) {
    const paidAmount = parseFloat(orderData.purchase_units[0].amount.value);
    amountMatches = Math.abs(paidAmount - expectedAmount) < 0.01;
  }

  return NextResponse.json({
    verified: isCompleted && amountMatches,
    orderId: orderData.id,
    status: orderData.status,
    paidAmount: orderData.purchase_units?.[0]?.amount?.value,
    currency: orderData.purchase_units?.[0]?.amount?.currency_code,
    payerEmail: orderData.payer?.email_address,
    createTime: orderData.create_time,
  });
}
