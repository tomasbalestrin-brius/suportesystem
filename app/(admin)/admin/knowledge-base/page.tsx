import { createClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/admin-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { KnowledgeBaseList } from "@/components/admin/knowledge-base-list"

export default async function KnowledgeBasePage() {
  const supabase = await createClient()

  const { count: unreadNotifications } = await supabase
    .from("admin_notifications")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)

  const { data: articles } = await supabase
    .from("knowledge_base")
    .select("*")
    .order("usage_count", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <AdminNav unreadCount={unreadNotifications || 0} />

      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Base de Conhecimento</h1>
            <p className="text-muted-foreground">Gerencie os artigos usados pela Sofia para responder dúvidas</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Artigo
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Artigos da Base de Conhecimento</CardTitle>
            <CardDescription>Total de {articles?.length || 0} artigos disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <KnowledgeBaseList articles={articles || []} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
