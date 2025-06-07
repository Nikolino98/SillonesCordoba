
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CartItem {
  product: {
    id: string
    name: string
    price: number
  }
  quantity: number
  selectedColor?: string
}

interface CustomerData {
  name: string
  email: string
  phone: string
  address: string
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { items, customerData } = await req.json() as {
      items: CartItem[]
      customerData: CustomerData
    }

    const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
    if (!accessToken) {
      throw new Error('Mercado Pago access token not configured')
    }

    // Crear los items para Mercado Pago
    const mpItems = items.map(item => ({
      title: `${item.product.name}${item.selectedColor ? ` - ${item.selectedColor}` : ''}`,
      quantity: item.quantity,
      unit_price: item.product.price,
      currency_id: 'ARS'
    }))

    // Crear la preferencia
    const preference = {
      items: mpItems,
      payer: {
        name: customerData.name,
        email: customerData.email,
        phone: {
          number: customerData.phone
        },
        address: {
          street_name: customerData.address
        }
      },
      back_urls: {
        success: `${req.headers.get('origin')}/payment-success`,
        failure: `${req.headers.get('origin')}/payment-failure`,
        pending: `${req.headers.get('origin')}/payment-pending`
      },
      auto_return: 'approved',
      external_reference: `order_${Date.now()}`,
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`
    }

    console.log('Creating preference:', preference)

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('MercadoPago API error:', errorText)
      throw new Error(`MercadoPago API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Preference created:', data)

    return new Response(
      JSON.stringify({ 
        preference_id: data.id,
        init_point: data.init_point,
        sandbox_init_point: data.sandbox_init_point
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error creating preference:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
