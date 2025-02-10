import { AuthProvider } from '@/contexts/AuthContext'
import { ProductProvider } from '@/contexts/ProductContext'
import { OrderProvider } from '@/contexts/OrderContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { PaymentProvider } from '@/contexts/PaymentContext'
import { AnalyticsProvider } from '@/contexts/AnalyticsContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ProductProvider>
            <OrderProvider>
              <NotificationProvider>
                <PaymentProvider>
                  <AnalyticsProvider>
                    {children}
                  </AnalyticsProvider>
                </PaymentProvider>
              </NotificationProvider>
            </OrderProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 