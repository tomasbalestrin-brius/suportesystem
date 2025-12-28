import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/admin-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SettingsPage() {
  const supabase = await createClient()

  const { count: unreadNotifications } = await supabase
    .from("admin_notifications")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)

  return (
    <div className="min-h-screen bg-background">
      <AdminNav unreadCount={unreadNotifications || 0} />

      <main className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Configure as integrações e preferências do sistema</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Integrações Externas</CardTitle>
              <CardDescription>Conecte plataformas externas ao sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Plataforma de Email</p>
                  <p className="text-xs text-muted-foreground">SES/R2</p>
                </div>
                <Badge variant="outline">Em desenvolvimento</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Plataforma de Pagamentos</p>
                  <p className="text-xs text-muted-foreground">Hotmart/Pagtrust</p>
                </div>
                <Badge variant="outline">Em desenvolvimento</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Área de Membros</p>
                  <p className="text-xs text-muted-foreground">Sistema customizado</p>
                </div>
                <Badge variant="outline">Em desenvolvimento</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações da IA</CardTitle>
              <CardDescription>Ajuste o comportamento da Sofia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Modelo GPT-4</p>
                    <p className="text-xs text-muted-foreground">OpenAI</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
