import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Article {
  id: string
  category: string
  title: string
  question: string
  usage_count: number
  is_active: boolean
}

interface KnowledgeBaseListProps {
  articles: Article[]
}

export function KnowledgeBaseList({ articles }: KnowledgeBaseListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhum artigo encontrado</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Categoria</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Pergunta</TableHead>
          <TableHead>Usos</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <TableRow key={article.id}>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {article.category}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">{article.title}</TableCell>
            <TableCell className="max-w-md truncate text-sm text-muted-foreground">{article.question}</TableCell>
            <TableCell>
              <Badge variant="secondary">{article.usage_count}</Badge>
            </TableCell>
            <TableCell>
              {article.is_active ? (
                <Badge className="bg-green-100 text-green-700">Ativo</Badge>
              ) : (
                <Badge variant="outline">Inativo</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
