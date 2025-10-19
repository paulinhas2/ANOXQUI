import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/20 p-6 glow-primary">
              <CheckCircle className="h-24 w-24 text-primary" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-primary text-glow-primary">Compra Realizada com Sucesso!</h1>
            <p className="text-xl text-foreground">Obrigado pela sua compra na DigitalStore</p>
            <p className="text-muted-foreground">
              Você receberá um email com os detalhes da sua compra e instruções para acessar seus produtos digitais.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
                Voltar para Loja
              </Button>
            </Link>
            <Link href="/meus-produtos">
              <Button variant="outline" className="border-border/50 bg-transparent">
                Ver Meus Produtos
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
