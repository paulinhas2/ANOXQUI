import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import Image from "next/image"

const purchasedProducts = [
  {
    id: "1",
    title: "PACK Artes GOSPEL Editáveis Canva e Photoshop +Bônus Premium",
    image: "/placeholder.svg?height=400&width=600",
    purchaseDate: "15/10/2025",
    downloadLink: "#",
  },
  {
    id: "2",
    title: "Curso BANNER BOLHA +13 PSD EDITAVEL +BONUS",
    image: "/placeholder.svg?height=400&width=600",
    purchaseDate: "10/10/2025",
    downloadLink: "#",
  },
]

export default function MyProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold font-mono text-primary text-glow-primary">Meus Produtos</h1>
            <p className="text-muted-foreground">Acesse todos os produtos que você adquiriu</p>
          </div>

          <div className="grid gap-6">
            {purchasedProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-lg border border-border/50 bg-card p-6 hover:border-primary/50 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative w-full md:w-48 aspect-video overflow-hidden rounded-md bg-muted flex-shrink-0">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground">{product.title}</h3>
                      <p className="text-sm text-muted-foreground">Comprado em: {product.purchaseDate}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
                        <Download className="mr-2 h-4 w-4" />
                        Baixar Produto
                      </Button>
                      <Button variant="outline" className="border-border/50 bg-transparent">
                        <FileText className="mr-2 h-4 w-4" />
                        Ver Documentação
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
