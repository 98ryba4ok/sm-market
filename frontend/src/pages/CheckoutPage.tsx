import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useCart } from '../hooks/useCart';
import { useCreateOrder } from '../hooks/useOrders';
import { formatPrice } from '../utils/format';

const checkoutSchema = z.object({
  delivery_address: z.string().min(10, 'Address must be at least 10 characters'),
  delivery_city: z.string().min(2, 'City is required'),
  delivery_postal_code: z.string().min(5, 'Postal code is required'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  payment_method: z.enum(['card', 'cash'] as const),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { createOrderAsync, isCreating } = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment_method: 'card',
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const order = await createOrderAsync(data);
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (error) {
      // Error is already handled by useCreateOrder
    }
  };

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = cart.items.reduce((sum, item) => {
    const price = Number(item.product.final_price);
    return sum + price * item.quantity;
  }, 0);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Delivery Address"
                    placeholder="Enter your full address"
                    error={errors.delivery_address?.message}
                    {...register('delivery_address')}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      placeholder="City"
                      error={errors.delivery_city?.message}
                      {...register('delivery_city')}
                    />

                    <Input
                      label="Postal Code"
                      placeholder="Postal code"
                      error={errors.delivery_postal_code?.message}
                      {...register('delivery_postal_code')}
                    />
                  </div>

                  <Input
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />

                  <Input
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    error={errors.email?.message}
                    {...register('email')}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="card"
                          {...register('payment_method')}
                          className="mr-2"
                        />
                        Credit/Debit Card
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="cash"
                          {...register('payment_method')}
                          className="mr-2"
                        />
                        Cash on Delivery
                      </label>
                    </div>
                    {errors.payment_method && (
                      <p className="mt-1 text-sm text-red-600">{errors.payment_method.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    isLoading={isCreating}
                    disabled={isCreating}
                    fullWidth
                    size="lg"
                  >
                    Place Order
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(Number(item.product.final_price) * item.quantity)}
                    </span>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(subtotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};